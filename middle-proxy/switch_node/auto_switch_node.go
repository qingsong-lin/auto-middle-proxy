package switch_node

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"middle-proxy/service"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type Proxy struct {
	Name  string   `json:"name"`
	Alive bool     `json:"alive"`
	Now   string   `json:"now,omitempty"`
	All   []string `json:"all,omitempty"`
}

type Providers struct {
	Proxies map[string]Proxy `json:"proxies"`
}

func getProxies(clashServer string) (*Providers, error) {
	url := fmt.Sprintf("http://%s:9090/proxies", clashServer)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch proxy list: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var providers Providers
	err = json.Unmarshal(body, &providers)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	return &providers, nil
}

func switchProxy(proxyName, clashServer string) error {
	url := fmt.Sprintf("http://%s:9090/proxies/", clashServer) + "🔰 选择节点"
	payload := map[string]string{
		"name": proxyName,
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %v", err)
	}

	resp, err := http.NewRequest("PUT", url, bytes.NewReader(payloadBytes))
	if err != nil {
		return fmt.Errorf("failed to create PUT request: %v", err)
	}
	resp.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(resp)
	if err != nil {
		return fmt.Errorf("failed to send PUT request: %v", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusNoContent {
		return fmt.Errorf("failed to switch proxy: received status code %d", res.StatusCode)
	}

	return nil
}

func ExtractHostFromURL(proxyHost string) (string, error) {
	// 处理两种情况：1. 有协议（http, https, socks5），2. 无协议（localhost, localhost:7878）
	re := regexp.MustCompile(`^(?:https?|socks5)://([^:/]+)|^([^:/]+)`)
	matches := re.FindStringSubmatch(proxyHost)
	if len(matches) < 2 {
		return "", fmt.Errorf("无法提取主机名")
	}

	// 优先选择有协议的匹配结果，否则返回无协议的主机名
	if matches[1] != "" {
		return matches[1], nil
	} else if matches[2] != "" {
		return matches[2], nil
	}

	return "", fmt.Errorf("无法提取主机名")
}

// 检查是否可以连接到给定的host和port
func isPortOpen(host string, port int) bool {
	// 使用http.NewRequest()方式来检查端口的可用性
	url := fmt.Sprintf("http://%s:%d", host, port)
	client := &http.Client{
		Timeout: 3 * time.Second, // 设置3秒超时
	}
	resp, err := client.Get(url)
	if err != nil || resp.StatusCode != http.StatusOK {
		return false
	}
	defer resp.Body.Close()
	return true
}

func AutoSwitchNode(proxyHost string) {
	clashServer, err := ExtractHostFromURL(proxyHost)
	if err != nil {
		log.Fatalf("fail ExtractHostFromURL err: %v", err)
		return
	}
	if !isPortOpen(clashServer, 9090) {
		//log.Printf("Clash server at %s is not responding on port 9090. No need to switch proxy.", clashServer)
		// 直接返回一个空的Providers对象，表示无需切换代理
		return
	}
	conn := service.PingHostThroughProxy("https://github.com:443", proxyHost, "http", "")
	if conn != nil {
		conn.Close()
		return // 成功连接，退出
	}

	// 获取代理列表
	providers, err := getProxies(clashServer)
	if err != nil {
		log.Fatalf("Error fetching providers: %v", err)
	}

	// 获取 '🔰 选择节点' 代理组
	proxyGroup := providers.Proxies["🔰 选择节点"]
	if proxyGroup.Name == "" {
		log.Fatalf("Proxy group not found")
	}

	// 遍历所有代理
	for _, nodeProxy := range proxyGroup.All {
		if !strings.Contains(nodeProxy, "免费") || nodeProxy == proxyGroup.Now {
			continue
		}
		err = switchProxy(nodeProxy, clashServer)
		if err != nil {
			log.Printf("Error switching proxy %s: %v", nodeProxy, err)
			continue
		}
		// 使用当前代理进行ping测试
		conn = service.PingHostThroughProxy("https://github.com:443", proxyHost, "http", "")
		if conn != nil {
			conn.Close()
			log.Printf("Successfully connected using proxy: %s", nodeProxy)
			return // 成功连接，退出
		}
		// 如果连接失败，尝试切换到下一个代理
		log.Printf("Failed to connect with %s, trying next proxy...", nodeProxy)

		// 调用切换代理的接口
	}

	log.Println("No working proxy found.")
}
