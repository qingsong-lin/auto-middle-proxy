# 使用 Alpine 作为基础镜像
FROM alpine:latest

# 替换为阿里云的 Alpine 源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 wget 和其他必要的依赖
RUN apk add --no-cache wget bash

# 在容器中创建用户并切换到用户目录
RUN adduser -D clashuser
USER clashuser
WORKDIR /home/clashuser

# 创建 clash 目录并进入
RUN mkdir ~/clash && cd ~/clash

# 设置 Clash 二进制文件的下载 URL 和文件名
ENV CLASH_VERSION=premium

ENV CLASH_FILE=clash-${CLASH_VERSION}-release-linux-amd64.tar.gz
ENV CLASH_URL=https://github.com/DustinWin/clash_singbox-tools/releases/download/Clash-Premium/clashpremium-release-linux-amd64.tar.gz
# 设置 HTTP 代理
ENV http_proxy=http://proxy.lgxcloud.com:7856
ENV https_proxy=http://proxy.lgxcloud.com:7856

# 下载并解压 Clash 二进制文件，重命名为 clash
RUN wget ${CLASH_URL} -O ~/clash/${CLASH_FILE} && \
    tar -xzf ~/clash/${CLASH_FILE} -C ~/clash && \
    rm ~/clash/${CLASH_FILE} && \
    mv ~/clash/CrashCore ~/clash/clash

# 下载 Clash 配置文件
RUN wget -O ~/clash/config.yaml "https://tmhm0.no-mad-world.club/link/aA9yfVNqy1BKRQ59?clash=3"
RUN sed -i 's/allow-lan: false/allow-lan: true/' ~/clash/config.yaml
RUN sed -i 's/external-controller: 127.0.0.1:9090/external-controller: 0.0.0.0:9090/' ~/clash/config.yaml
# 设置 Clash 二进制文件可执行权限
RUN chmod +x ~/clash/clash
WORKDIR /home/clashuser/clash
# 暴露 Clash Dashboard 所需端口
EXPOSE 7890 9090 7891
COPY ./clash/Country.mmdb /home/clashuser/clash/Country.mmdb
# 取消代理设置
RUN unset http_proxy && unset https_proxy
# 启动 Clash 并启用 HTTP 和 SOCKS5 代理
CMD ["bash", "-c", "./clash -d ~/clash"]

