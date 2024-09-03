package gin_server

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"middle-proxy/log"
	"net/http/httputil"
	"net/url"
)

// ReverseProxyHandler 用于处理反向代理请求
func ReverseProxyHandler(c *gin.Context, target string) {
	// 解析目标 URL
	remote, err := url.Parse(target)
	if err != nil {
		log.Logger.Fatal("Failed to parse target url", zap.Error(err))
	}
	// 创建反向代理
	proxy := httputil.NewSingleHostReverseProxy(remote)

	// 修改请求头，确保 Host 等头信息与目标服务器匹配
	c.Request.Host = remote.Host
	c.Request.URL.Host = remote.Host
	c.Request.URL.Scheme = remote.Scheme
	c.Request.Header.Set("Host", remote.Host)

	// 自定义修改响应
	//proxy.ModifyResponse = func(resp *http.Response) error {
	//	locationHeader := resp.Header.Get("Location")
	//	if locationHeader != "" {
	//		// 替换百度的URL为本地代理地址
	//		newLocation := strings.Replace(locationHeader, "https://clash.razord.top", "http://proxy.lgxcloud.com", -1)
	//		resp.Header.Set("Location", newLocation)
	//	}
	//	return nil
	//}

	// 代理请求
	proxy.ServeHTTP(c.Writer, c.Request)
}

func Init() {
	r := gin.Default()

	target := "https://clash.razord.top/"
	r.Any("/*proxyPath", func(c *gin.Context) {
		// 检查请求的路径，如果是 JS 文件直接返回，不再代理
		if c.Request.URL.Path == "/assets/index-5e90ca00.js" {
			c.File("./static/index-5e90ca00.js")
			return
		}

		ReverseProxyHandler(c, target)
	})

	// 监听端口
	err := r.Run(":8090")
	if err != nil {
		log.Logger.Fatal("Failed to start server: %v", zap.Error(err))
	}
}
