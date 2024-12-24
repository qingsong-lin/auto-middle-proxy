package main

import (
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	retry "github.com/avast/retry-go"
	"github.com/elazarl/goproxy"
	"go.uber.org/zap"
	"io"
	gin_server "middle-proxy/gin"
	log "middle-proxy/log"
	safe_conn "middle-proxy/safe-conn"
	"middle-proxy/service"
	"middle-proxy/switch_node"
	"middle-proxy/utils"
	"net"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"
)

var domainProxyCache sync.Map // 并发安全的map，缓存域名与代理服务器的映射
var domainForbiddenProxyCache sync.Map
var proxies []string // 代理服务器列表
var mu sync.Mutex

func init() {
	// 初始化 map
	service.ConstantTimeOutCount = 2
	service.UserName2PasswordMap = make(map[string]string)
	// 读取环境变量
	envUser := os.Getenv("Username")
	envPass := os.Getenv("Password")
	if envUser != "" && envPass != "" {
		service.UserName2PasswordMap[envUser] = envPass
	}

	// 读取文件
	data, err := os.ReadFile("/etc/auto-middle-proxy/config/credentials.json")
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// 解析 JSON
	var fileMap map[string]string
	if err := json.Unmarshal(data, &fileMap); err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	// 合并到 map 中
	for user, pass := range fileMap {
		service.UserName2PasswordMap[user] = pass
	}
}

func main() {
	log.Logger, _ = zap.NewDevelopment()
	defer log.Logger.Sync()
	go func() {
		gin_server.Init()
	}()
	log.Logger.Info("server is start.", zap.String("Version", os.Getenv("Version")))
	// 从环境变量中获取代理服务器地址的 JSON 数组
	proxiesData := os.Getenv("PROXIES_DATA")
	if proxiesData == "" {
		fmt.Println("环境变量 PROXIES_DATA 未设置.")
		os.Exit(1)
	}

	// 解析代理服务器地址数组
	err := json.Unmarshal([]byte(proxiesData), &proxies)
	if err != nil {
		log.Logger.Debug("Unmarshal proxies fail", zap.Error(err))
		return
	}
	log.Logger.Info("Unmarshal success:", zap.Any("proxies", proxies))

	// 启动定时任务刷新缓存
	go refreshCachePeriodically()

	// 设置代理服务器
	proxy := goproxy.NewProxyHttpServer()

	proxy.OnRequest(goproxy.ReqHostMatches(regexp.MustCompile(".*"))).HijackConnect(handleRequestWithAuth)
	proxy.Tr.Proxy = proxyFunc

	log.Logger.Fatal("server exit err", zap.Error(http.ListenAndServe(":7856", proxy)))
}

// 处理请求，包含密码验证逻辑
func handleRequestWithAuth(req *http.Request, client net.Conn, ctx *goproxy.ProxyCtx) {
	defer func() {
		if client != nil {
			client.Close()
		}
	}()

	// 判断是否是内网请求（假设这是一个自定义函数）
	if !isInternalNetwork(req, client) {
		// 公网请求，要求进行基本认证
		authHeader := req.Header.Get("Proxy-Authorization")
		if strings.HasPrefix(authHeader, "Basic ") {
			encoded := strings.TrimPrefix(authHeader, "Basic ")
			decoded, err := base64.StdEncoding.DecodeString(encoded)
			if err != nil {
				client.Write([]byte("HTTP/1.1 407 Proxy Authentication Required\r\n" +
					"Proxy-Authenticate: Basic realm=\"Proxy\"\r\n\r\n"))
				log.Logger.Debug("proxy auth fail, DecodeString fail.", zap.Error(err))
				return
			}
			parts := strings.SplitN(string(decoded), ":", 2)
			if len(parts) != 2 {
				client.Write([]byte("HTTP/1.1 407 Proxy Authentication Required\r\n" +
					"Proxy-Authenticate: Basic realm=\"Proxy\"\r\n\r\n"))
				log.Logger.Debug("proxy auth fail,the count of parts is not two.")
				return
			}
			username, password := parts[0], parts[1]
			if passW, ok := service.UserName2PasswordMap[username]; !ok || passW != password {
				client.Write([]byte("HTTP/1.1 407 Proxy Authentication Required\r\n" +
					"Proxy-Authenticate: Basic realm=\"Proxy\"\r\n\r\n"))
				log.Logger.Debug("proxy auth fail, username and password is failed.", zap.String("username", username), zap.String("password", password))
				return
			}
		} else {
			client.Write([]byte("HTTP/1.1 407 Proxy Authentication Required\r\n" +
				"Proxy-Authenticate: Basic realm=\"Proxy\"\r\n\r\n"))
			return
		}
	}

	// 处理代理请求的核心逻辑
	handleRequest(req, client, ctx)
}

// 判断是否为内网请求
func isInternalNetwork(r *http.Request, client net.Conn) bool {
	host := r.Header.Get("X-Forwarded-For")
	if host == "" {
		// 如果没有 X-Forwarded-For，回退到 RemoteAddr
		host, _, _ = net.SplitHostPort(r.RemoteAddr)
	}
	//host, _, err := net.SplitHostPort(client.RemoteAddr().String())
	//if err != nil {
	//	Logger.Info("Error splitting host and port", zap.Error(err))
	//	return false
	//}
	//log.Logger.Info("connect from where.", zap.String("IP", host))
	// 使用 net.ParseIP 解析 IP 地址部分
	ipAddr := net.ParseIP(host)
	if ipAddr == nil {
		log.Logger.Info("Invalid IP address", zap.String("host", host))
		return false
	}
	//ipAddr := net.ParseIP(client.RemoteAddr().String())
	//if ipAddr == nil {
	//	return false
	//}
	// 检查是否为内网 IP 地址
	if ipAddr.IsLoopback() || ipAddr.IsPrivate() {
		return true
	}
	return false
}

// 处理代理请求的函数
func handleRequest(req *http.Request, client net.Conn, ctx *goproxy.ProxyCtx) {
	defer func() {
		if client != nil {
			client.Close()
		}
	}()
	hostWithPortAndSchem := utils.GetHostWithPort(req.URL.Host, req.URL.Port(), req.URL.Scheme)
	proxyAddress, err, newProxyConn := getProxyForRequest(hostWithPortAndSchem, "https", req.URL.Path)

	defer func() {
		if newProxyConn != nil {
			newProxyConn.Close()
		}
	}()
	if err != nil {
		log.Logger.Debug("Failed to get proxy", zap.Error(err), zap.String("host", hostWithPortAndSchem))
		return
	}
	if newProxyConn != nil {
		if proxyAddress == "" {
			// 如果 proxyAddress 为空，说明本地网络可以直接访问
			_, err = client.Write([]byte("HTTP/1.0 200 Connection established\r\n\r\n"))
			if err != nil {
				log.Logger.Debug("client.Write failed", zap.Error(err))
				return
			}

		} else {
			//newProxyConn, err := net.DialTimeout("tcp", GetHttpHost(proxyAddress), time.Second)
			//defer func() {
			//	if newProxyConn != nil {
			//		newProxyConn.Close()
			//	}
			//}()
			//if err != nil {
			//	Logger.Debug("Cannot connect to proxy", zap.Error(err))
			//	// 代理不可用时，从缓存中删除，并重新获取代理
			//	domainProxyCache.Delete(hostWithPortAndSchem)
			//	proxyAddress, err = getProxyForRequest(hostWithPortAndSchem)
			//	if err != nil {
			//		Logger.Debug("Failed to get proxy after deletion", zap.Error(err))
			//		return
			//	}
			//	newProxyConn, err = net.DialTimeout("tcp", GetHttpHost(proxyAddress), time.Second)
			//	if err != nil {
			//		Logger.Debug("Cannot connect to proxy after retry", zap.Error(err))
			//		return
			//	}
			//}
			_, err = client.Write([]byte("HTTP/1.0 200 Connection established\r\n\r\n"))
			if err != nil {
				log.Logger.Debug("client.Write failed", zap.Error(err))
				return
			}

		}
	} else {
		if proxyAddress == "" {
			// 如果 proxyAddress 为空，说明本地网络可以直接访问
			newProxyConn, err = net.DialTimeout("tcp", utils.GetHttpHost(hostWithPortAndSchem), 5*time.Second)
			if err != nil {
				domainForbiddenProxyCache.Store(hostWithPortAndSchem, "")
				log.Logger.Info("domainForbiddenProxyCache store", zap.String("host", hostWithPortAndSchem), zap.String("proxy", proxyAddress))
				log.Logger.Debug("Cannot connect to the host directly", zap.Error(err), zap.String("host", hostWithPortAndSchem))
				return
			}
			defer newProxyConn.Close()
			_, err = client.Write([]byte("HTTP/1.0 200 Connection established\r\n\r\n"))
			if err != nil {
				log.Logger.Debug("client.Write failed", zap.Error(err))
				return
			}
		} else {
			retry.Do(func() error {
				newProxyConn = service.PingHostThroughProxy(hostWithPortAndSchem, proxyAddress, "https", req.URL.Path)
				if newProxyConn == nil {
					return fmt.Errorf("ping through proxy failed host: %s,  proxyHost: %s", proxyAddress, hostWithPortAndSchem) // 失败，进行重试
				}
				return nil // 成功
			}, retry.Attempts(3), // 设置重试次数为3次
				retry.Delay(0))
			//if newProxyConn == nil {
			//	Logger.Debug("Cannot connect to proxy", zap.Error(err))
			//	// 代理不可用时，从缓存中删除，并重新获取代理
			//	domainProxyCache.Delete(hostWithPortAndSchem)
			//	proxyAddress, err, newProxyConn = getProxyForRequest(hostWithPortAndSchem)
			//	if err != nil {
			//		Logger.Debug("Failed to get proxy after deletion", zap.Error(err))
			//		return
			//	}
			//	newProxyConn = PingHostThroughProxy(hostWithPortAndSchem, proxyAddress)
			//	if newProxyConn == nil {
			//		Logger.Debug("Cannot connect to proxy after retry newProxyConn is nil")
			//		return
			//	}
			//}
			if newProxyConn != nil {
				_, err = client.Write([]byte("HTTP/1.0 200 Connection established\r\n\r\n"))
				if err != nil {
					log.Logger.Debug("client.Write failed", zap.Error(err))
					return
				}
			} else {
				domainForbiddenProxyCache.Store(hostWithPortAndSchem, "")
				log.Logger.Info("domainForbiddenProxyCache store", zap.String("host", hostWithPortAndSchem), zap.String("proxy", proxyAddress))
			}
		}
	}
	if newProxyConn != nil {
		go relayData(newProxyConn, client, hostWithPortAndSchem, proxyAddress)
		relayData(client, newProxyConn, hostWithPortAndSchem, proxyAddress)
	} else {
		log.Logger.Debug("handleRequest newProxyConn is nil", zap.String("proxyAddress", proxyAddress), zap.String("host", hostWithPortAndSchem))
	}
}

// 获取代理请求地址
func proxyFunc(req *http.Request) (*url.URL, error) {
	hostWithPortAndSchem := utils.GetHostWithPort(req.URL.Host, req.URL.Port(), req.URL.Scheme)
	proxyAddress, err, conn := getProxyForRequest(hostWithPortAndSchem, "http", req.URL.Path)
	defer func() {
		if conn != nil {
			conn.Close()
		}
	}()
	if err != nil {
		log.Logger.Info("Pass-through request", zap.String("host", hostWithPortAndSchem))
		return http.ProxyFromEnvironment(req)
	}

	if proxyAddress == "" {
		// 直接通过本地网络访问
		return nil, nil
	}

	log.Logger.Info("Using proxy", zap.String("proxyAddress", proxyAddress), zap.String("hostWithPortAndSchem", hostWithPortAndSchem))
	return url.Parse("http://" + proxyAddress)
}

type ConnProxyPair struct {
	Conn      net.Conn
	ProxyName string
}

// 读取缓存或选择代理
func getProxyForRequest(host, scheme, urlPath string) (string, error, net.Conn) {
	var passLocalHost bool
	if _, ok := service.ConstantUseProxy[processURL(host)]; ok {
		passLocalHost = true
	}
	forbiddenProxy, ok2 := domainForbiddenProxyCache.Load(host)
	if proxy, ok := domainProxyCache.Load(host); ok {
		if !ok2 || ok2 && proxy != forbiddenProxy {
			return proxy.(string), nil, nil
		} else {
			domainProxyCache.Delete(host)
			domainForbiddenProxyCache.Delete(host)
			log.Logger.Info("domainForbiddenProxyCache delete", zap.String("host", host), zap.String("proxy", forbiddenProxy.(string)))
		}
	}
	safeChannel := safe_conn.NewSafeChannel[ConnProxyPair](1)
	defer safeChannel.Close()
	var wg sync.WaitGroup
	// 检查本地网络是否可用
	if !(ok2 && forbiddenProxy == "") && !passLocalHost {
		wg.Add(1)
		go func() {
			defer wg.Done()
			retry.Do(func() error {
				conn := pingHost(host, scheme, urlPath)
				if conn != nil {
					safeChannel.Send(&ConnProxyPair{Conn: conn, ProxyName: ""})
					domainProxyCache.Store(host, "")
					if safeChannel.IsClose() {
						log.Logger.Info("force change cache to local network", zap.String("host", host))
					}
					return nil // 成功
				}
				return fmt.Errorf("ping failed") // 失败，进行重试
			}, retry.Attempts(3), // 设置重试次数为3次
				retry.Delay(0))
		}()
	} else if ok2 && forbiddenProxy == "" {
		domainForbiddenProxyCache.Delete(host)
		log.Logger.Info("domainForbiddenProxyCache delete for local", zap.String("host", host), zap.String("proxy", forbiddenProxy.(string)))
	}

	// 使用代理服务器列表逐个 ping
	for _, proxy := range proxies {
		proxyHost := proxy
		go func() {
			if !(ok2 && forbiddenProxy == proxyHost) {
				wg.Add(1)
				retry.Do(func() error {
					conn := service.PingHostThroughProxy(host, proxyHost, scheme, urlPath)
					if safeChannel.IsClose() {
						return nil
					}
					if conn != nil {
						safeChannel.Send(&ConnProxyPair{Conn: conn, ProxyName: proxyHost})
						return nil // 成功
					}
					return fmt.Errorf("ping through proxy failed proxyHost: %s", proxyHost) // 失败，进行重试
				}, retry.Attempts(3), // 设置重试次数为3次
					retry.Delay(0))
			} else {
				domainForbiddenProxyCache.Delete(host)
				log.Logger.Info("domainForbiddenProxyCache delete for proxy", zap.String("host", host), zap.String("proxy", forbiddenProxy.(string)))
			}
		}()
	}
	go func() {
		wg.Wait()
		safeChannel.End()
	}()
	conProxyPair := safeChannel.Get()
	if conProxyPair == nil {
		log.Logger.Error("No available proxy found", zap.String("host", host))
		return "", fmt.Errorf("No available proxy found"), nil
	}
	domainProxyCache.Store(host, conProxyPair.ProxyName)
	log.Logger.Info("cache host proxy or local", zap.String("host", host), zap.String("proxyName", conProxyPair.ProxyName))
	return conProxyPair.ProxyName, nil, conProxyPair.Conn

}

// 使用 ping 检查主机是否可达
func pingHost(host, scheme, urlPath string) net.Conn {
	count := service.ConstantTimeOutCount
	fqdn := utils.GetFQDN(scheme, utils.GetHttpHost(host))
	keyWithProxy := utils.GetDomainFailCountKeyWithProxy(fqdn, "")
	var ok bool
	if blockCount, ok2 := service.DomainFailCount.Load(keyWithProxy); ok2 {
		count = blockCount.(int64) + 1
		log.Logger.Info("pingHost increase connect timeout", zap.String("fqdn", fqdn), zap.Int64("count", count-1), zap.Int64("blockCount", count))
		ok = ok2
	}
	client := &http.Client{
		Timeout: time.Duration(count) * time.Second, // 全局超时1秒
		Transport: &http.Transport{
			DialContext: (&net.Dialer{
				Timeout: time.Duration(count) * 500 * time.Millisecond, // 连接超时500毫秒
			}).DialContext,
			ResponseHeaderTimeout: time.Duration(count) * 500 * time.Millisecond, // 响应头超时500毫秒
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true, // 跳过证书验证
			},
		},
	}
	// 构建请求
	req, err := http.NewRequest("HEAD", fqdn+urlPath, nil)
	if err != nil {
		log.Logger.Debug("Failed to create request", zap.Error(err), zap.String("host", host))
		return nil
	}
	// 添加自定义 headers
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
	// 发送请求
	resp, err := client.Do(req)
	if err != nil {
		if netErr, ok2 := err.(net.Error); ok2 && netErr.Timeout() {
			if ok {
				newCount := count
				if newCount >= 10 {
					newCount = service.ConstantTimeOutCount
				}
				service.DomainFailCount.CompareAndSwap(keyWithProxy, count-1, newCount)
			} else {
				service.DomainFailCount.LoadOrStore(keyWithProxy, service.ConstantTimeOutCount)
			}
		}
		log.Logger.Debug("pingHost", zap.Error(err), zap.String("host", host), zap.Bool("ok", ok), zap.Int64("blockCount", count), zap.String("fqdn", fqdn))
		return nil
	}

	// 关闭响应体
	defer resp.Body.Close()
	if ok {
		if _, ok3 := service.ConstantUseProxy[fqdn]; !ok3 {
			service.DomainFailCount.Delete(keyWithProxy)
		}
	}
	// 12306 对HEAD和OPTION请求都是返回502导致本地网络不能使用，暂时先去掉，有合理的方法再补上
	//// 检查响应码是否为 200 OK
	//if IsServerError(resp.StatusCode) {
	//	// 连接成功，返回客户端以供后续使用
	//	log.Logger.Info("pingHost local to host. get respond not 200!", zap.String("fqdn", fqdn), zap.Int("statusCode", resp.StatusCode))
	//	return nil
	//}

	// 尝试建立 TCP 连接
	conn, err := net.DialTimeout("tcp", utils.GetHttpHost(host), time.Duration(count)*time.Second)
	if err != nil {
		log.Logger.Debug("pingHost", zap.Error(err), zap.String("host", utils.GetHttpHost(host)))
		return nil
	}
	return conn
}

type closeWriter interface {
	CloseWrite() error
}

// 数据传输
func relayData(dst net.Conn, src net.Conn, hostWithPortAndSchem, proxyAddress string) {
	defer func() {
		if tcpConn, ok := dst.(closeWriter); ok {
			tcpConn.CloseWrite()
		}
	}()
	_, err := io.Copy(dst, src)
	if err == nil {
		return
	}

	if err != io.EOF && !strings.Contains(err.Error(), "connection reset by peer") &&
		!strings.Contains(err.Error(), "splice: broken pipe") &&
		!strings.Contains(err.Error(), "use of closed network connection") &&
		!strings.Contains(err.Error(), "An existing connection was forcibly closed by the remote host") &&
		!strings.Contains(err.Error(), "An established connection was aborted by the software in your host machine") {
		log.Logger.Error("Connection closed gracefully:", zap.Error(err), zap.String("proxyAddress", proxyAddress), zap.String("hostWithPortAndSchem", hostWithPortAndSchem))
		domainForbiddenProxyCache.Store(hostWithPortAndSchem, proxyAddress)
		log.Logger.Info("domainForbiddenProxyCache store", zap.String("host", hostWithPortAndSchem), zap.String("proxy", proxyAddress))
	} else {
		//Logger.Debug("Connection closed success")
	}
}

// 检查所有代理
func checkProxies() {
	for _, p := range proxies {
		clashPorxy := p
		go func() {
			switch_node.AutoSwitchNode(clashPorxy)
		}()
	}
}

// 定期刷新缓存
func refreshCachePeriodically() {
	autoSwitchNode := os.Getenv("AutoSwitchNode")
	if autoSwitchNode != "" {
		checkProxies()
		go func() {
			ticker := time.NewTicker(5 * time.Minute)
			defer ticker.Stop()

			// 启动一个 goroutine 执行定时任务
			for {
				select {
				case <-ticker.C:
					// 每五分钟执行一次检查
					checkProxies()
				}
			}
		}()
	}
	for {
		time.Sleep(30 * time.Minute)
		mu.Lock()
		domainProxyCache.Range(func(key, value interface{}) bool {
			domainProxyCache.Delete(key)
			return true
			//if proxyStr, ok := value.(string); ok && proxyStr == "" {
			//	domainProxyCache.Delete(key)
			//	return true
			//}
			//host := key.(string)
			//conn := pingHost(host)
			//defer func() {
			//	if conn != nil {
			//		conn.Close()
			//	}
			//}()
			//if conn != nil {
			//	// 本地网络通，移除代理缓存
			//	domainProxyCache.Delete(host)
			//} else {
			//	// 如果本地网络不可达，检查代理
			//	for _, proxy := range proxies {
			//		conn = PingHostThroughProxy(host, proxy)
			//		if conn != nil {
			//			domainProxyCache.Store(host, proxy)
			//			break
			//		}
			//	}
			//}
			//return true
		})
		domainForbiddenProxyCache.Range(func(key, value interface{}) bool {
			domainForbiddenProxyCache.Delete(key)
			return true
		})
		mu.Unlock()
	}
}

// 实际通过代理访问目标主机，检测代理是否可用
func checkProxyAccess(proxyConn net.Conn, host string) bool {
	proxyConn.SetDeadline(time.Now().Add(3 * time.Second)) // 设置超时时间
	_, err := proxyConn.Write([]byte("HEAD / HTTP/1.0\r\nHost: " + host + "\r\n\r\n"))
	if err != nil {
		return false
	}
	buf := make([]byte, 1024)
	_, err = proxyConn.Read(buf)
	return err == nil
}

func processURL(url string) string {
	// Regular expression to match the domain in the URL.
	re := regexp.MustCompile(`^(https?://)([^:/]+)(:[0-9]+)?`)

	// Match the URL and extract components.
	matches := re.FindStringSubmatch(url)
	if len(matches) == 0 {
		return url // Return original URL if it doesn't match.
	}

	protocol := matches[1]
	domain := matches[2]
	port := matches[3]

	// Split the domain into parts and keep the last two segments if there are more than two.
	domainParts := strings.Split(domain, ".")
	if len(domainParts) > 2 {
		domain = strings.Join(domainParts[len(domainParts)-2:], ".")
	}

	// Reconstruct the URL with the modified domain.
	return fmt.Sprintf("%s*.%s%s", protocol, domain, port)
}
