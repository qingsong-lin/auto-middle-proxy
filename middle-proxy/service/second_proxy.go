package service

import (
	"bufio"
	"context"
	"crypto/tls"
	"fmt"
	"go.uber.org/zap"
	"golang.org/x/net/proxy"
	"middle-proxy/log"
	"middle-proxy/utils"
	"net"
	"net/http"
	"net/url"
	"sync"
	"time"
)

var UserName2PasswordMap map[string]string
var ConstantTimeOutCount int64
var ConstantUseProxy = map[string]struct{}{
	"https://*.github.com:443":       {},
	"https://*.githubassets.com:443": {},
	"https://*.openai.com:443":       {},
	"https://*.docker.io:443":        {},
	"https://*.chatgpt.com:443":      {},
	"https://*.anthropic.com:443":    {},
	"https://*.googleapis.com:443":   {},
}
var DomainFailCount sync.Map // 并发安全的map，缓存域名失败次数则上升等待时间

// 使用代理服务器逐个 ping
func PingHostThroughProxy(host, proxyHost, scheme, UrlPath string) net.Conn {
	count := ConstantTimeOutCount
	fqdn := utils.GetFQDN(scheme, utils.GetHttpHost(host))
	var ok bool
	keyWithProxy := utils.GetDomainFailCountKeyWithProxy(fqdn, proxyHost)
	if blockCount, ok2 := DomainFailCount.Load(keyWithProxy); ok2 {
		count = blockCount.(int64) + 1
		log.Logger.Info("PingHostThroughProxy increase connect timeout", zap.String("fqdn", fqdn), zap.Int64("count", count-1), zap.Int64("blockCount", count))
		ok = ok2
	}

	proxyScheme, _ := utils.GetScheme(proxyHost)
	switch proxyScheme {
	case "http":
		c, err := net.DialTimeout("tcp", utils.GetHttpHost(proxyHost), time.Second*5)
		if err != nil {
			log.Logger.Debug(fmt.Sprintf("Failed to connect proxy err: %v", err))
			return nil
		}

		reqURL, err := url.Parse("http://" + utils.GetHttpHost(host) + UrlPath)
		if err != nil {
			return nil
		}
		req, err := http.NewRequest(http.MethodConnect, reqURL.String(), nil)
		if err != nil {
			return nil
		}
		req.Close = false
		req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.3")

		err = req.Write(c)
		if err != nil {
			return nil
		}

		resp, err := http.ReadResponse(bufio.NewReader(c), req)
		if err != nil {
			if netErr, ok2 := err.(net.Error); ok2 && netErr.Timeout() {
				if ok {
					newCount := count
					if newCount >= 10 {
						newCount = ConstantTimeOutCount
					}
					DomainFailCount.CompareAndSwap(keyWithProxy, count-1, newCount)
				} else {
					DomainFailCount.LoadOrStore(keyWithProxy, ConstantTimeOutCount)
				}
			}
			log.Logger.Debug(fmt.Sprintf("Failed to send request through proxy err: %v", err), zap.Bool("ok", ok), zap.Int64("blockCount", count), zap.String("fqdn", fqdn), zap.String("proxy", proxyHost))
			return nil
		}
		defer resp.Body.Close()
		if ok {
			if _, ok3 := ConstantUseProxy[fqdn]; !ok3 {
				DomainFailCount.Delete(keyWithProxy)
			}
		}
		if resp.StatusCode != 200 {
			log.Logger.Info("PingHostThroughProxy to host by proxyHost get not 200!", zap.String("fqdn", fqdn), zap.String("proxyHost", proxyHost), zap.Int("statusCode", resp.StatusCode), zap.String("proxy", proxyHost))
			return nil
		}
		return c
	case "socks5":
		dialer, err := proxy.SOCKS5("tcp", utils.GetHttpHost(proxyHost), nil, proxy.Direct)
		if err != nil {
			log.Logger.Debug(fmt.Sprintf("Failed to create SOCKS5 dialer err: %v", err))
			return nil
		}

		// 创建自定义的 http.Transport 使用 SOCKS5 代理拨号器
		transport := &http.Transport{
			DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
				return dialer.Dial(network, addr) // 使用 SOCKS5 代理拨号器
			},
			ResponseHeaderTimeout: time.Duration(count) * 500 * time.Millisecond, // 响应头超时500毫秒
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true, // 跳过证书验证
			},
		}

		// 创建 HTTP 客户端，指定自定义的 Transport 和超时时间
		client := &http.Client{
			Timeout:   time.Duration(count) * time.Second, // 全局超时1秒
			Transport: transport,
		}

		// 构建 HTTP HEAD 请求
		req, err := http.NewRequest("HEAD", fqdn+UrlPath, nil)
		if err != nil {
			log.Logger.Debug(fmt.Sprintf("socks5 Failed to create request err: %v", err))
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
						newCount = ConstantTimeOutCount
					}
					DomainFailCount.CompareAndSwap(keyWithProxy, count-1, newCount)
				} else {
					DomainFailCount.LoadOrStore(keyWithProxy, ConstantTimeOutCount)
				}
			}
			log.Logger.Debug(fmt.Sprintf("socks5 Failed to send request through proxy err: %v", err), zap.Bool("ok", ok), zap.Int64("blockCount", count), zap.String("fqdn", fqdn), zap.String("proxy", proxyHost))
			return nil
		}
		defer resp.Body.Close()
		if ok {
			if _, ok3 := ConstantUseProxy[fqdn]; !ok3 {
				DomainFailCount.Delete(keyWithProxy)
			}
		}
		// 检查响应状态码是否是 200 OK
		if utils.IsServerError(resp.StatusCode) {
			log.Logger.Info("socks5 PingHostThroughProxy to host by proxyHost get not 200!", zap.String("fqdn", fqdn), zap.String("proxyHost", proxyHost), zap.Int("statusCode", resp.StatusCode), zap.String("proxy", proxyHost))
			return nil
		}

		// 尝试建立 TCP 连接
		conn, err := dialer.Dial("tcp", utils.GetHttpHost(host))
		if err != nil {
			log.Logger.Debug(fmt.Sprintf("socks5 Failed to connect through proxy err: %v", err))
			return nil
		}
		return conn
	default:
		log.Logger.Error("parse proxy scheme error")
		return nil
	}
}
