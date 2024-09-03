FROM golang:alpine as builder

WORKDIR /app/middle-proxy
COPY . /app
ENV GOPROXY https://goproxy.cn,direct
ENV GO111MODULE on
ENV PROXIES_DATA '["http://localhost:7891"]'
RUN go mod init middle-proxy
RUN go mod tidy
RUN go build .

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/middle-proxy/middle-proxy /app/
COPY --from=builder /app/middle-proxy/static /app/static
CMD ["./middle-proxy"]