# auto-middle-proxy

<img src="http://www.lgxcloud.com:5244/p/files-storage/share/panda.png?sign=T3O-Vc8sVlNheQLa_PrHWKEJ0y_k0z-BMavkk0nxn6s=:0" width="300">

[![Build Status](https://img.shields.io/github/workflow/status/your-repo/auto-middle-proxy/CI)](https://github.com/your-repo/auto-middle-proxy/actions)
[![Docker pulls](https://img.shields.io/docker/pulls/your-repo/auto-middle-proxy)](https://hub.docker.com/r/your-repo/auto-middle-proxy)
[![Go Report Card](https://goreportcard.com/badge/github.com/istio/istio)](https://goreportcard.com/report/github.com/istio/istio)


## 项目介绍 / Introduction

`auto-middle-proxy` 是一个多级代理系统的第一级（第一跳）代理，采用 HTTP 代理形式呈现，后续的多级代理可以是 HTTP 代理或 SOCKS 代理。项目由三部分组成：

1. **Clash 客户端**：原始的 Clash 客户端作为代理引擎。
2. **middle-proxy 核心代码**：实现代理逻辑和自动切换功能。
3. **Web 网关**：包装原 Clash Web 控制台，提供 8080 端口访问。

由于 Google 浏览器的 bug，无法通过域名访问 Clash Web 控制台，项目中强制修改了 JS 脚本，将 `localhost` 替换为实际域名。用户可以根据需要自行修改 JS 脚本，将 `proxy.lgxlcloud.com` 改回 `localhost`。

---
## 🚀 项目特性 / Features

### 全网络互联

将所有网络互联起来，包括私有化局域网，使所有域名可以通过统一网址访问。

### 本地访问优先

优先使用本地网络访问服务。

### 自动代理切换

根据网络状况自动切换代理，尤其适用于翻墙服务，自动选择可用的代理进行访问。

## 🛠  配置 / Configuration


### 1. **Clash Dockerfile 配置**

在 clash目录下的`Dockerfile` 中设置代理地址：

```dockerfile
#使用已有的代理加快下载，不使用代理可能较慢
ENV http_proxy=http://192.168.50.245:7890 
ENV https_proxy=http://192.168.50.245:7890
```
需要到[ikuun](https://ikuuu.one/)注册免费用户并下载到自己的配置信息替换
```dockerfile
RUN wget -O ~/clash/config.yaml "https://tmhm0.no-mad-world.club/link/[******replace****]?clash=3"
```

#### 2. **环境变量配置**
在`deployment.yaml`和`docker-compose.yaml`中增加二级代理链
```env
PROXIES_DATA=["socks5://clash:7891", "http://others......"]
```
在环境变量中设置 `AutoSwitchNode = 'yes'` 启用自动切换 Clash 的免费节点：
```env
AutoSwitchNode = 'yes'
```
#### 3. **权限认证**
`credentials.json` 用于设置互联网登录时的账户和密码，局域网用户可以省略鉴权。

## 🛠 使用 / Usage

### 1. 启动项目

选择以下其中一个命令来启动项目：

#### K8s 部署：
```k8s
kubectl apply -f deployment.yaml
```
#### Docker Compose 部署：
```docker
docker-compose up
```
### 2. 本地访问

项目启动后，可以通过以下地址访问代理：

- 访问代理：http://localhost:7856
- 代理管理界面：http://localhost:8080
