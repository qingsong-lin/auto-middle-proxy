package utils

import (
	"fmt"
	"go.uber.org/zap"
	"golang.org/x/net/proxy"
	"middle-proxy/log"
	"net"
	"net/url"
	"regexp"
	"strings"
)

func GetFQDN(scheme, host string) string {
	if scheme == "https" && strings.Contains(host, ":443") {
		return fmt.Sprintf("%s://%s", scheme, strings.ReplaceAll(host, ":443", ""))
	} else if scheme == "http" && strings.Contains(host, ":80") {
		return fmt.Sprintf("%s://%s", scheme, strings.ReplaceAll(host, ":80", ""))
	}
	return fmt.Sprintf("%s://%s", scheme, host)
}

func GetScheme(proxyHost string) (string, *url.URL) {
	proxyURLParsed, err := url.Parse(proxyHost)
	if err != nil {
		log.Logger.Debug(fmt.Sprintf("[GetScheme] Invalid proxy URL err:%v, proxyHost:%v", err, proxyHost))
		return "", nil
	}
	return proxyURLParsed.Scheme, proxyURLParsed
}

func GetDomainFailCountKeyWithProxy(fqdn, proxyHost string) string {
	if proxyHost == "" {
		return fqdn
	}
	return fmt.Sprintf("%s -i %s", fqdn, proxyHost)
}

func GetHostWithPort(host, port, schem string) (result string) {
	defer func() {
		// 检查格式，支持 IPv4、IPv6 和端口
		re := regexp.MustCompile(`^(http|https)://([a-fA-F0-9:]+|[a-zA-Z0-9.-]+):([0-9]+)$`)
		if !re.MatchString(result) {
			log.Logger.Debug("Invalid format for host",
				zap.String("host", host),
				zap.String("port", port),
				zap.String("schem", schem),
				zap.String("result", result),
			)
		}
	}()
	host = strings.TrimSpace(host)
	port = strings.TrimSpace(port)
	schem = strings.TrimSpace(schem)

	// 处理 IPv6 地址并确保格式正确
	ip := net.ParseIP(host)
	if ip != nil && ip.To4() == nil {
		switch port {
		case "":
			if strings.Contains(host, ":443") && schem == "" {
				schem = "https"
			} else if schem == "" {
				schem = "http"
			}
		case "443":
			if schem == "" {
				schem = "https"
			}
		case "80":
			if schem == "" {
				schem = "http"
			}
		}
		return schem + "://" + host
	}

	// Check if the host already has a scheme
	if strings.HasPrefix(host, "http://") {
		if strings.Contains(strings.TrimLeft(host, "http://"), ":") {
			return host
		} else if port == "" {
			port = "80"
			return host + ":" + port
		}
	}
	if strings.HasPrefix(host, "https://") {
		if strings.Contains(strings.TrimLeft(host, "https://"), ":") {
			return host
		} else if port == "" {
			port = "443"
			return host + ":" + port
		}
	}
	if strings.Contains(host, ":") && !strings.HasPrefix(host, "[") { // 如果是IPv4或未包裹的IPv6
		if schem == "" {
			if port == "" {
				vec := strings.Split(host, ":")
				if len(vec) == 2 {
					port = vec[1]
				} else {
					log.Logger.Debug("GetHostWithPort get port from host fail", zap.String("host", host), zap.String("port", port), zap.String("schem", schem))
					port = "80"
				}
			}
			switch port {
			case "80":
				schem = "http"
				break
			case "443":
				schem = "https"
				break
			default:
				schem = "http"
			}
		}
		return schem + "://" + host
	} else { // 处理没有端口或需要添加的情况
		if port == "" {
			switch schem {
			case "https":
				port = "443"
				break
			default:
				port = "80"
			}
		}
		if schem == "" {
			switch port {
			case "443":
				schem = "https"
				break
			default:
				schem = "http"
			}
		}
		return schem + "://" + host + ":" + port
	}
}

func GetHttpHost(proxyHost string) string {
	// 解析代理地址
	proxyURLParsed, err := url.Parse(proxyHost)
	if err != nil {
		log.Logger.Debug(fmt.Sprintf("Invalid proxy URL err:%v, proxyHost:%v", err, proxyHost))
		return proxyHost
	}

	if strings.Count(proxyURLParsed.Host, ":") > 1 {
		// 如果末尾有端口号，手动分离出地址和端口
		lastColon := strings.LastIndex(proxyURLParsed.Host, ":")
		ipv6Address := proxyURLParsed.Host[:lastColon] // IPv6 地址部分
		port := proxyURLParsed.Host[lastColon+1:]      // 端口部分

		// 检查 IPv6 地址是否需要包裹方括号（在url.Parse解析时可能没有方括号）
		if !strings.HasPrefix(ipv6Address, "[") && !strings.HasSuffix(ipv6Address, "]") {
			ipv6Address = "[" + ipv6Address + "]"
		}
		return fmt.Sprintf("%s:%s", ipv6Address, port) // 返回 [IPv6地址]:端口 格式
	}

	host, port, err := net.SplitHostPort(proxyURLParsed.Host)
	if err != nil {
		// 如果没有端口，或者格式不正确，直接返回
		host = proxyURLParsed.Host
		port = ""
	}

	ip := net.ParseIP(host)
	if ip != nil && ip.To4() == nil { // 如果是IPv6地址
		if port != "" {
			return fmt.Sprintf("[%s]:%s", ip.String(), port) // IPv6 地址需要用方括号包裹，并且保留端口
		}
		return fmt.Sprintf("[%s]", ip.String()) // 只返回IPv6地址，没有端口
	}

	return proxyURLParsed.Host
}

func dailWithProxyConn(host, proxyHost, scheme string) net.Conn {
	dialer, err := proxy.SOCKS5("tcp", GetHttpHost(proxyHost), nil, proxy.Direct)
	if err != nil {
		log.Logger.Debug(fmt.Sprintf("Failed to create SOCKS5 dialer err: %v", err))
		return nil
	}
	// 尝试建立 TCP 连接
	conn, err := dialer.Dial("tcp", GetHttpHost(host))
	if err != nil {
		log.Logger.Debug(fmt.Sprintf("Failed to connect through proxy err: %v", err))
		return nil
	}
	return conn
}

func IsServerError(statusCode int) bool {
	return statusCode >= 500 && statusCode < 600
}
