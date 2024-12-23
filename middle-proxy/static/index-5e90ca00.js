import {j as e, c as j, f as et, r as h, p as je, e as Re, a as tt, b as V, d as ne, u as q, g as be, h as L, i as De, k as Me, l as _, R as Ae, m as st, n as ye, o as nt, q as oe, s as ot, t as He, v as ee, w as at, x as lt, y as ct, z as it, A as rt, B as $e, C as dt, D as ut, E as mt, F as ht, G as xt, $ as ft, H as pt, I as yt, N as gt, O as vt, J as wt, K as fe, L as jt, M as bt} from "./vendor-827b5617.js";
(function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload"))
            return;
        for (const o of document.querySelectorAll('link[rel="modulepreload"]'))
            a(o);
        new MutationObserver(o=>{
                for (const l of o)
                    if (l.type === "childList")
                        for (const c of l.addedNodes)
                            c.tagName === "LINK" && c.rel === "modulepreload" && a(c)
            }
        ).observe(document, {
            childList: !0,
            subtree: !0
        });
        function n(o) {
            const l = {};
            return o.integrity && (l.integrity = o.integrity),
            o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy),
                o.crossOrigin === "use-credentials" ? l.credentials = "include" : o.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin",
                l
        }
        function a(o) {
            if (o.ep)
                return;
            o.ep = !0;
            const l = n(o);
            fetch(o.href, l)
        }
    }
)();
function J() {
    return navigator.userAgent === "ClashX Runtime"
}
let k = null;
class Nt {
    constructor(t) {
        this.instance = null,
        window.WebViewJavascriptBridge != null && (this.instance = window.WebViewJavascriptBridge),
            this.initBridge(n=>{
                    this.instance = n,
                        t()
                }
            )
    }
    initBridge(t) {
        if (!J())
            return t == null ? void 0 : t(null);
        if (window.WebViewJavascriptBridge != null)
            return t(window.WebViewJavascriptBridge);
        if (window.WVJBCallbacks != null)
            return window.WVJBCallbacks.push(t);
        window.WVJBCallbacks = [t];
        const n = document.createElement("iframe");
        n.style.display = "none",
            n.src = "https://__bridge_loaded__",
            document.documentElement.appendChild(n),
            setTimeout(()=>document.documentElement.removeChild(n), 0)
    }
    async callHandler(t, n) {
        return await new Promise(a=>{
                var o;
                (o = this.instance) == null || o.callHandler(t, n, a)
            }
        )
    }
    async ping() {
        return await this.callHandler("ping")
    }
    async readConfigString() {
        return await this.callHandler("readConfigString")
    }
    async getPasteboard() {
        return await this.callHandler("getPasteboard")
    }
    async getAPIInfo() {
        return await this.callHandler("apiInfo")
    }
    async setPasteboard(t) {
        return await this.callHandler("setPasteboard", t)
    }
    async writeConfigWithString(t) {
        return await this.callHandler("writeConfigWithString", t)
    }
    async setSystemProxy(t) {
        return await this.callHandler("setSystemProxy", t)
    }
    async getStartAtLogin() {
        return await this.callHandler("getStartAtLogin")
    }
    async getProxyDelay(t) {
        return await this.callHandler("speedTest", t)
    }
    async setStartAtLogin(t) {
        return await this.callHandler("setStartAtLogin", t)
    }
    async isSystemProxySet() {
        return await this.callHandler("isSystemProxySet")
    }
}
function Ct(s) {
    if (k != null) {
        s();
        return
    }
    k = new Nt(s)
}
function B(s) {
    const {title: t, children: n, className: a, style: o} = s;
    return e.jsxs("header", {
        className: j("header", a),
        style: o,
        children: [e.jsx("h1", {
            className: "md:text-xl",
            children: t
        }), e.jsx("div", {
            className: "flex flex-auto items-center justify-end",
            children: n
        })]
    })
}
function T(s) {
    const {type: t, size: n=14, className: a, style: o} = s
        , l = j("clash-iconfont", `icon-${t}`, a)
        , c = {
        fontSize: n,
        ...o
    }
        , i = {
        ...s,
        className: l,
        style: c
    };
    return e.jsx("i", {
        ...i
    })
}
function I() {}
function Pt(s, t) {
    const n = []
        , a = [];
    for (const o of s)
        t(o) ? n.push(o) : a.push(o);
    return [n, a]
}
function z(s) {
    const t = ["B", "KiB", "MiB", "GiB", "TiB"]
        , n = Math.floor(Math.log(s || 1) / Math.log(1024));
    return `${et(s / Math.pow(1024, n), 2).toFixed(2)} ${(t == null ? void 0 : t[n]) ?? ""}`
}
function ze(s) {
    return s.replace(/.*[/\\]/, "")
}
function pe(s) {
    const {className: t, checked: n=!1, disabled: a=!1, onChange: o=I} = s
        , l = j("switch", {
        checked: n,
        disabled: a
    }, t);
    function c() {
        a || o(!n)
    }
    return e.jsx("div", {
        className: l,
        onClick: c,
        children: e.jsx(T, {
            className: "font-bold switch-icon",
            type: "check",
            size: 20
        })
    })
}
const O = h.forwardRef((s,t)=>{
        const {className: n, style: a, children: o} = s;
        return e.jsx("div", {
            className: j("card", n),
            style: a,
            ref: t,
            children: o
        })
    }
);
function Le(s) {
    const {options: t, value: n, onSelect: a} = s;
    return e.jsx("div", {
        className: "button-select",
        children: t.map(o=>e.jsx("button", {
            value: o.value,
            className: j("button-select-options", {
                actived: n === o.value
            }),
            onClick: ()=>a == null ? void 0 : a(o.value),
            children: o.label
        }, o.value))
    })
}
const St = {
    SideBar: {
        Proxies: "Proxies",
        Overview: "Overview",
        Logs: "Logs",
        Rules: "Rules",
        Settings: "Setting",
        Connections: "Connections",
        Version: "Version"
    },
    Settings: {
        title: "Settings",
        labels: {
            startAtLogin: "Start at login",
            language: "language",
            setAsSystemProxy: "Set as system proxy",
            allowConnectFromLan: "Allow connect from Lan",
            proxyMode: "Mode",
            socks5ProxyPort: "Socks5 proxy port",
            httpProxyPort: "HTTP proxy port",
            mixedProxyPort: "Mixed proxy port",
            externalController: "External controller"
        },
        values: {
            cn: "中文",
            en: "English",
            global: "Global",
            rules: "Rules",
            direct: "Direct",
            script: "Script"
        },
        versionString: "Current ClashX is the latest version：{{version}}",
        checkUpdate: "Check Update",
        externalControllerSetting: {
            title: "External Controller",
            note: "Please note that modifying this configuration will only configure Dashboard. Will not modify your Clash configuration file. Please make sure that the external controller address matches the address in the Clash configuration file, otherwise, Dashboard will not be able to connect to Clash.",
            host: "Host",
            port: "Port",
            secret: "Secret",
            addText: "Add",
            deleteText: "Delete",
            deleteErrorText: "Host not found"
        }
    },
    Logs: {
        title: "Logs",
        levelLabel: "Log level"
    },
    Rules: {
        title: "Rules",
        providerTitle: "Providers",
        providerUpdateTime: "Last updated at",
        ruleCount: "Rule count"
    },
    Connections: {
        title: "Connections",
        keepClosed: "Keep closed connections",
        total: {
            text: "total",
            upload: "upload",
            download: "download"
        },
        closeAll: {
            title: "Warning",
            content: "This would close all connections"
        },
        filter: {
            all: "All"
        },
        columns: {
            host: "Host",
            network: "Network",
            type: "Type",
            chains: "Chains",
            process: "Process",
            rule: "Rule",
            time: "Time",
            speed: "Speed",
            upload: "Upload",
            download: "Download",
            sourceIP: "Source IP"
        },
        info: {
            title: "Connection",
            id: "ID",
            host: "Host",
            hostEmpty: "Empty",
            dstIP: "IP",
            dstIPEmpty: "Empty",
            srcIP: "Source",
            upload: "Up",
            download: "Down",
            network: "Network",
            process: "Process",
            processPath: "Path",
            inbound: "Inbound",
            rule: "Rule",
            chains: "Chains",
            status: "Status",
            opening: "Open",
            closed: "Closed",
            closeConnection: "Close"
        }
    },
    Proxies: {
        title: "Proxies",
        editDialog: {
            title: "Edit Proxy",
            color: "Color",
            name: "Name",
            type: "Type",
            server: "Server",
            port: "Port",
            password: "Password",
            cipher: "Cipher",
            obfs: "Obfs",
            "obfs-host": "Obfs-host",
            uuid: "UUID",
            alterId: "AlterId",
            tls: "TLS"
        },
        groupTitle: "Policy Group",
        providerTitle: "Providers",
        providerUpdateTime: "Last updated at",
        expandText: "Expand",
        collapseText: "Collapse",
        speedTestText: "Speed Test",
        breakConnectionsText: "Close connections which include the group"
    },
    Modal: {
        ok: "Ok",
        cancel: "Cancel"
    }
}
    , kt = {
    SideBar: {
        Proxies: "代理",
        Overview: "总览",
        Logs: "日志",
        Rules: "规则",
        Settings: "设置",
        Connections: "连接",
        Version: "版本"
    },
    Settings: {
        title: "设置",
        labels: {
            startAtLogin: "开机时启动",
            language: "语言",
            setAsSystemProxy: "设置为系统代理",
            allowConnectFromLan: "允许来自局域网的连接",
            proxyMode: "代理模式",
            socks5ProxyPort: "Socks5 代理端口",
            httpProxyPort: "HTTP 代理端口",
            mixedProxyPort: "混合代理端口",
            externalController: "外部控制设置"
        },
        values: {
            cn: "中文",
            en: "English",
            global: "全局",
            rules: "规则",
            direct: "直连",
            script: "脚本"
        },
        versionString: "当前 ClashX 已是最新版本：{{version}}",
        checkUpdate: "检查更新",
        externalControllerSetting: {
            title: "编辑外部控制设置",
            note: "请注意，修改该配置项并不会修改你的 Clash 配置文件，请确认修改后的外部控制地址和 Clash 配置文件内的地址一致，否则会导致 Dashboard 无法连接。",
            host: "Host",
            port: "端口",
            secret: "密钥",
            addText: "添 加",
            deleteText: "删 除",
            deleteErrorText: "没有找到该 Host"
        }
    },
    Logs: {
        title: "日志",
        levelLabel: "日志等级"
    },
    Rules: {
        title: "规则",
        providerTitle: "规则集",
        providerUpdateTime: "最后更新于",
        ruleCount: "规则条数"
    },
    Connections: {
        title: "连接",
        keepClosed: "保留关闭连接",
        total: {
            text: "总量",
            upload: "上传",
            download: "下载"
        },
        closeAll: {
            title: "警告",
            content: "将会关闭所有连接"
        },
        filter: {
            all: "全部"
        },
        columns: {
            host: "域名",
            network: "网络",
            process: "进程",
            type: "类型",
            chains: "节点链",
            rule: "规则",
            time: "连接时间",
            speed: "速率",
            upload: "上传",
            download: "下载",
            sourceIP: "来源 IP"
        },
        info: {
            title: "连接信息",
            id: "ID",
            host: "域名",
            hostEmpty: "空",
            dstIP: "IP",
            dstIPEmpty: "空",
            srcIP: "来源",
            upload: "上传",
            download: "下载",
            network: "网络",
            process: "进程",
            processPath: "路径",
            inbound: "入口",
            rule: "规则",
            chains: "代理",
            status: "状态",
            opening: "连接中",
            closed: "已关闭",
            closeConnection: "关闭连接"
        }
    },
    Proxies: {
        title: "代理",
        editDialog: {
            title: "编辑代理",
            color: "颜色",
            name: "名字",
            type: "类型",
            server: "服务器",
            port: "端口",
            password: "密码",
            cipher: "加密方式",
            obfs: "Obfs",
            "obfs-host": "Obfs-host",
            uuid: "UUID",
            alterId: "AlterId",
            tls: "TLS"
        },
        groupTitle: "策略组",
        providerTitle: "代理集",
        providerUpdateTime: "最后更新于",
        expandText: "展开",
        collapseText: "收起",
        speedTestText: "测速",
        breakConnectionsText: "切换时打断包含策略组的连接"
    },
    Modal: {
        ok: "确 定",
        cancel: "取 消"
    }
}
    , Oe = {
    en_US: St,
    zh_CN: kt
}
    , Et = Object.keys(Oe);
function $t() {
    for (const s of window.navigator.languages) {
        if (s.includes("zh"))
            return "zh_CN";
        if (s.includes("us"))
            return "en_US"
    }
    return "en_US"
}
function Ne(s) {
    return h.useMemo(()=>{
            function n(a, o) {
                if (typeof a == "string")
                    s(l=>{
                            const c = a
                                , i = o;
                            l[c] = i
                        }
                    );
                else if (typeof a == "function") {
                    const l = a;
                    s(c=>l(c))
                } else
                    typeof a == "object" && s(l=>je(l, c=>{
                            const i = a;
                            for (const r of Object.keys(i)) {
                                const u = r;
                                c[u] = i[u]
                            }
                        }
                    ))
            }
            return n
        }
        , [s])
}
class Ue {
    constructor(t) {
        this.EE = new Re,
            this.innerBuffer = [],
            this.url = "",
            this.connection = null,
            this.config = Object.assign({
                bufferLength: 0,
                retryInterval: 5e3
            }, t)
    }
    connectWebsocket() {
        if (!this.url)
            return;
        const t = new URL(this.url);
        this.connection = new WebSocket(t.toString()),
            this.connection.addEventListener("message", n=>{
                    const a = JSON.parse(n.data);
                    this.EE.emit("data", [a]),
                    this.config.bufferLength > 0 && (this.innerBuffer.push(a),
                    this.innerBuffer.length > this.config.bufferLength && this.innerBuffer.splice(0, this.innerBuffer.length - this.config.bufferLength))
                }
            ),
            this.connection.addEventListener("error", n=>{
                    var a;
                    this.EE.emit("error", n),
                    (a = this.connection) == null || a.close(),
                        setTimeout(this.connectWebsocket, this.config.retryInterval)
                }
            )
    }
    connect(t) {
        var n;
        this.url === t && this.connection || (this.url = t,
        (n = this.connection) == null || n.close(),
            this.connectWebsocket())
    }
    subscribe(t, n) {
        this.EE.addListener(t, n)
    }
    unsubscribe(t, n) {
        this.EE.removeListener(t, n)
    }
    buffer() {
        return this.innerBuffer.slice()
    }
    destory() {
        var t;
        this.EE.removeAllListeners(),
        (t = this.connection) == null || t.close(),
            this.connection = null
    }
}
class Lt {
    constructor(t, n) {
        this.axiosClient = tt.create({
            baseURL: t,
            headers: n ? {
                Authorization: `Bearer ${n}`
            } : {}
        })
    }
    async getConfig() {
        return await this.axiosClient.get("configs")
    }
    async updateConfig(t) {
        return await this.axiosClient.patch("configs", t)
    }
    async getRules() {
        return await this.axiosClient.get("rules")
    }
    async getProxyProviders() {
        const t = await this.axiosClient.get("providers/proxies", {
            validateStatus(n) {
                return n >= 200 && n < 300 || n === 404
            }
        });
        return t.status === 404 && (t.data = {
            providers: {}
        }),
            t
    }
    async getRuleProviders() {
        return await this.axiosClient.get("providers/rules")
    }
    async updateProvider(t) {
        return await this.axiosClient.put(`providers/proxies/${encodeURIComponent(t)}`)
    }
    async updateRuleProvider(t) {
        return await this.axiosClient.put(`providers/rules/${encodeURIComponent(t)}`)
    }
    async healthCheckProvider(t) {
        return await this.axiosClient.get(`providers/proxies/${encodeURIComponent(t)}/healthcheck`)
    }
    async getProxies() {
        return await this.axiosClient.get("proxies")
    }
    async getProxy(t) {
        return await this.axiosClient.get(`proxies/${encodeURIComponent(t)}`)
    }
    async getVersion() {
        return await this.axiosClient.get("version")
    }
    async getProxyDelay(t) {
        return await this.axiosClient.get(`proxies/${encodeURIComponent(t)}/delay`, {
            params: {
                timeout: 5e3,
                url: "http://www.gstatic.com/generate_204"
            }
        })
    }
    async closeAllConnections() {
        return await this.axiosClient.delete("connections")
    }
    async closeConnection(t) {
        return await this.axiosClient.delete(`connections/${t}`)
    }
    async getConnections() {
        return await this.axiosClient.get("connections")
    }
    async changeProxySelected(t, n) {
        return await this.axiosClient.put(`proxies/${encodeURIComponent(t)}`, {
            name: n
        })
    }
}
const Tt = V(async()=>{
        if (!J())
            return null;
        const s = await k.getAPIInfo();
        return {
            hostname: s.host,
            port: s.port,
            secret: s.secret,
            protocol: "http:"
        }
    }
)
    , It = localStorage.getItem("externalControllers") ?? "[]"
    , Rt = localStorage.getItem("externalControllerIndex") ?? "0"
    , Ce = ne("externalControllers", JSON.parse(It))
    , Pe = ne("externalControllerIndex", parseInt(Rt));
function Q() {
    var x, w, g, d;
    const s = q(Tt)
        , t = be()
        , n = q(Pe)
        , a = q(Ce);
    if (s != null)
        return s;
    let o;
    {
        const p = document.querySelector('meta[name="external-controller"]');
        ((x = p == null ? void 0 : p.content) == null ? void 0 : x.match(/^https?:/)) != null && (o = new URL(p.content))
    }
    const l = new URLSearchParams(t.search)
        , c = l.get("host") ?? ((w = a == null ? void 0 : a[n]) == null ? void 0 : w.hostname) ?? (o == null ? void 0 : o.hostname) ?? "proxy.lgxcloud.com"
        , i = l.get("port") ?? ((g = a == null ? void 0 : a[n]) == null ? void 0 : g.port) ?? (o == null ? void 0 : o.port) ?? "9090"
        , r = l.get("secret") ?? ((d = a == null ? void 0 : a[n]) == null ? void 0 : d.secret) ?? (o == null ? void 0 : o.username) ?? ""
        , u = l.get("protocol") ?? c === "proxy.lgxcloud.com" ? "http:" : (o == null ? void 0 : o.protocol) ?? window.location.protocol;
    return {
        hostname: c,
        port: i,
        secret: r,
        protocol: u
    }
}
const Dt = V({
    key: "",
    instance: null
});
function R() {
    const {hostname: s, port: t, secret: n, protocol: a} = Q()
        , [o,l] = L(Dt)
        , c = `${a}//${s}:${t}?secret=${n}`;
    if (o.key === c)
        return o.instance;
    const i = new Lt(`${a}//${s}:${t}`,n);
    return l({
        key: c,
        instance: i
    }),
        i
}
const Se = V(!0)
    , Mt = ne("language", void 0);
function E() {
    const [s,t] = L(Mt)
        , n = h.useMemo(()=>s ?? $t(), [s])
        , a = h.useCallback(function(o) {
        function l(c) {
            return nt(Oe[n][o], c)
        }
        return {
            t: l
        }
    }, [n]);
    return {
        lang: n,
        locales: Et,
        setLang: t,
        translation: a
    }
}
const Be = V({
    version: "",
    premium: !1
});
function Fe() {
    const [s,t] = L(Be)
        , n = R()
        , a = Me(Se);
    return _([n], async function() {
        const o = await Ae.fromPromise(n.getVersion(), l=>l);
        a(o.isOk()),
            t(o.isErr() ? {
                version: "",
                premium: !1
            } : {
                version: o.value.data.version,
                premium: !!o.value.data.premium
            })
    }),
        s
}
function Ve() {
    const [{premium: s}] = L(Be)
        , t = R()
        , {data: n, mutate: a} = _(["/providers/rule", t, s], async()=>{
            if (!s)
                return [];
            const o = await t.getRuleProviders();
            return Object.keys(o.data.providers).map(l=>o.data.providers[l])
        }
    );
    return {
        providers: n ?? [],
        update: a
    }
}
const At = ne("profile", {
    breakConnections: !1,
    logLevel: ""
});
function ae() {
    const [s,t] = L(At)
        , n = h.useCallback(a=>{
            t(je(s, a))
        }
        , [s, t]);
    return {
        data: s,
        set: Ne(n)
    }
}
const _e = V([]);
function We() {
    const [s,t] = L(_e)
        , n = R()
        , {data: a, mutate: o} = _(["/providers/proxy", n], async()=>{
            const l = await n.getProxyProviders();
            return Object.keys(l.data.providers).map(c=>l.data.providers[c]).filter(c=>c.name !== "default").filter(c=>c.vehicleType !== "Compatible")
        }
    );
    return h.useEffect(()=>{
            t(a ?? [])
        }
        , [a, t]),
        {
            providers: s,
            update: o
        }
}
function le() {
    const s = R()
        , {data: t, mutate: n} = _(["/config", s], async()=>{
            const o = (await s.getConfig()).data;
            return {
                port: o.port,
                socksPort: o["socks-port"],
                mixedPort: o["mixed-port"] ?? 0,
                redirPort: o["redir-port"],
                mode: o.mode.toLowerCase(),
                logLevel: o["log-level"],
                allowLan: o["allow-lan"]
            }
        }
    );
    return {
        general: t ?? {},
        update: n
    }
}
const Ge = De({
    proxies: [],
    groups: [],
    global: {
        name: "GLOBAL",
        type: "Selector",
        now: "",
        history: [],
        all: []
    }
});
function ce() {
    const [s,t] = L(Ge)
        , n = Ne(t)
        , a = R()
        , {mutate: o} = _(["/proxies", a], async()=>{
            const c = await a.getProxies()
                , i = c.data.proxies.GLOBAL;
            i.name = "GLOBAL";
            const r = new Set(["Selector", "URLTest", "Fallback", "LoadBalance"])
                , u = new Set(["DIRECT", "REJECT", "GLOBAL"])
                , x = i.all.filter(d=>!u.has(d)).map(d=>({
                ...c.data.proxies[d],
                name: d
            }))
                , [w,g] = Pt(x, d=>!r.has(d.type));
            n({
                proxies: w,
                groups: g,
                global: i
            })
        }
    )
        , l = h.useCallback((c,i)=>{
            n(r=>{
                    c === "GLOBAL" && (r.global.now = i);
                    for (const u of r.groups)
                        u.name === c && (u.now = i)
                }
            )
        }
        , [n]);
    return {
        proxies: s.proxies,
        groups: s.groups,
        global: s.global,
        update: o,
        markProxySelected: l,
        set: n
    }
}
const Ht = V(s=>{
        const t = s(Ge)
            , n = s(_e)
            , a = new Map;
        for (const o of t.proxies)
            a.set(o.name, o);
        for (const o of n)
            for (const l of o.proxies)
                a.set(l.name, l);
        return a
    }
);
function Je() {
    const {data: s, mutate: t} = _("/clashx", async()=>{
            if (!J())
                return {
                    isClashX: !1,
                    startAtLogin: !1,
                    systemProxy: !1
                };
            const n = await (k == null ? void 0 : k.getStartAtLogin()) ?? !1
                , a = await (k == null ? void 0 : k.isSystemProxySet()) ?? !1;
            return {
                startAtLogin: n,
                systemProxy: a,
                isClashX: !0
            }
        }
    );
    return {
        data: s,
        update: t
    }
}
const zt = De([]);
function Ot() {
    const [s,t] = L(zt)
        , n = Ne(t)
        , a = R();
    async function o() {
        const l = await a.getRules();
        n(l.data.rules)
    }
    return {
        rules: s,
        update: o
    }
}
const Ut = V(new Ue({
    bufferLength: 200
}));
function Xe() {
    const s = Q()
        , {general: t} = le()
        , {data: {logLevel: n}} = ae()
        , a = q(Ut)
        , o = n || t.logLevel
        , l = st(`${s.protocol}//${s.hostname}:${s.port}/logs?level=${o}&secret=${encodeURIComponent(s.secret)}`)
        , c = ye(s);
    return h.useEffect(()=>{
            if (o) {
                const i = c.current
                    , u = `${i.protocol === "http:" ? "ws:" : "wss:"}//${i.hostname}:${i.port}/logs?level=${o}&token=${encodeURIComponent(i.secret)}`;
                a.connect(u)
            }
        }
        , [c, a, o, l]),
        a
}
function Bt() {
    const s = Q()
        , t = h.useRef(new Ue({
        bufferLength: 200
    }))
        , a = `${s.protocol === "http:" ? "ws:" : "wss:"}//${s.hostname}:${s.port}/connections?token=${encodeURIComponent(s.secret)}`;
    return h.useEffect(()=>{
            t.current.connect(a)
        }
        , [a]),
        t.current
}
function Ft(s) {
    const {className: t, data: n, onClick: a, select: o, canClick: l, errSet: c, rowHeight: i} = s
        , {translation: r} = E()
        , {t: u} = r("Proxies")
        , [x,w] = h.useState(!1)
        , [g,d] = h.useState(!1)
        , p = h.useRef(null);
    h.useLayoutEffect(()=>{
            var N;
            d((((N = p == null ? void 0 : p.current) == null ? void 0 : N.offsetHeight) ?? 0) > 30)
        }
        , []);
    const P = x ? "auto" : i
        , y = l ? a : I;
    function C() {
        w(!x)
    }
    const S = n.map(N=>{
            const $ = j({
                "tags-selected": o === N,
                "cursor-pointer": l,
                error: c == null ? void 0 : c.has(N)
            });
            return e.jsx("li", {
                className: $,
                onClick: ()=>y(N),
                children: N
            }, N)
        }
    );
    return e.jsxs("div", {
        className: j("flex items-start overflow-y-hidden", t),
        style: {
            height: P
        },
        children: [e.jsx("ul", {
            ref: p,
            className: j("tags", {
                expand: x
            }),
            children: S
        }), g && e.jsx("span", {
            className: "select-none cursor-pointer h-7 leading-7 px-5",
            onClick: C,
            children: u(x ? "collapseText" : "expandText")
        })]
    })
}
function G(s) {
    const {className: t, style: n, value: a="", align: o="center", inside: l=!1, autoFocus: c=!1, type: i="text", disabled: r=!1, onChange: u=I, onBlur: x=I, onEnter: w=I} = s
        , g = j("input", `text-${o}`, {
        "focus:shadow-none": l
    }, t);
    function d(p) {
        p.code === "Enter" && w(p)
    }
    return e.jsx("input", {
        disabled: r,
        className: g,
        style: n,
        value: a,
        autoFocus: c,
        type: i,
        onChange: p=>u(p.target.value, p),
        onBlur: x,
        onKeyDown: d
    })
}
function Ye(s) {
    const {value: t, options: n, onSelect: a, disabled: o, className: l, style: c} = s
        , i = h.useRef(document.createElement("div"))
        , r = h.useRef(null)
        , [u,x] = h.useState(!1)
        , [w,g] = h.useState({});
    h.useLayoutEffect(()=>{
            const y = i.current;
            return document.body.appendChild(y),
                ()=>{
                    document.body.removeChild(y)
                }
        }
        , []);
    function d() {
        if (!o) {
            if (!u) {
                const y = r.current.getBoundingClientRect();
                g({
                    top: Math.floor(y.top + y.height) + 6,
                    left: Math.floor(y.left) - 10
                })
            }
            x(!u)
        }
    }
    const p = h.useMemo(()=>n.find(y=>y.value === t), [t, n])
        , P = e.jsx("div", {
        className: j("select-list", {
            "select-list-show": u
        }),
        style: w,
        children: e.jsx("ul", {
            className: "list",
            children: n.map(y=>e.jsx(Vt, {
                className: j({
                    selected: y.value === t
                }),
                onClick: C=>{
                    a == null || a(y.value, C),
                        x(!1)
                }
                ,
                disabled: y.disabled,
                value: y.value,
                children: y.label
            }, y.key ?? y.value))
        })
    });
    return e.jsxs(e.Fragment, {
        children: [e.jsxs("div", {
            className: j("select", {
                disabled: o
            }, l),
            style: c,
            ref: r,
            onClick: d,
            children: [e.jsx("span", {
                className: "select-none",
                children: p == null ? void 0 : p.label
            }), e.jsx(T, {
                type: "triangle-down"
            })]
        }), oe.createPortal(P, i.current)]
    })
}
function Vt(s) {
    const {className: t, style: n, disabled: a=!1, children: o, onClick: l=I} = s
        , c = j("option", {
        disabled: a
    }, t);
    return e.jsx("li", {
        className: c,
        style: n,
        onClick: l,
        children: o
    })
}
function qe(s) {
    const {show: t=!0, title: n="Modal", size: a="small", footer: o=!0, onOk: l=I, onClose: c=I, bodyClassName: i, bodyStyle: r, className: u, footerExtra: x, style: w, children: g} = s
        , {translation: d} = E()
        , {t: p} = d("Modal")
        , P = h.useRef(document.createElement("div"))
        , y = h.useRef(null);
    h.useLayoutEffect(()=>{
            const N = P.current;
            return document.body.appendChild(N),
                ()=>{
                    document.body.removeChild(N)
                }
        }
        , []);
    function C(N) {
        N.target === y.current && c()
    }
    const S = e.jsx("div", {
        className: j("modal-mask", {
            "modal-show": t
        }),
        ref: y,
        onMouseDown: C,
        children: e.jsxs("div", {
            className: j("modal", `modal-${a}`, u),
            style: w,
            children: [e.jsx("div", {
                className: "modal-title",
                children: n
            }), e.jsx("div", {
                className: j("modal-body", i),
                style: r,
                children: g
            }), o && e.jsxs("div", {
                className: "flex items-center justify-between",
                children: [x, e.jsxs("div", {
                    className: "flex justify-end flex-1 space-x-3",
                    children: [e.jsx(K, {
                        onClick: ()=>c(),
                        children: p("cancel")
                    }), e.jsx(K, {
                        type: "primary",
                        onClick: ()=>l(),
                        children: p("ok")
                    })]
                })]
            })]
        })
    });
    return oe.createPortal(S, P.current)
}
const _t = {
    success: "check",
    info: "info",
    warning: "info",
    error: "close"
};
function Wt(s) {
    const {message: t="", type: n="info", inside: a=!1, children: o, className: l, style: c} = s
        , i = j("alert", `alert-${a ? "note" : "box"}-${n}`, l);
    return e.jsxs("div", {
        className: i,
        style: c,
        children: [e.jsx("span", {
            className: "alert-icon",
            children: e.jsx(T, {
                type: _t[n],
                size: 26
            })
        }), t ? e.jsx("p", {
            className: "alert-message",
            children: t
        }) : e.jsx("div", {
            className: "alert-message",
            children: o
        })]
    })
}
function K(s) {
    const {type: t="normal", onClick: n=I, children: a, className: o, style: l, disabled: c} = s
        , i = j("button", `button-${t}`, o, {
        "button-disabled": c
    });
    return e.jsx("button", {
        className: i,
        style: l,
        onClick: n,
        disabled: c,
        children: a
    })
}
function te(s) {
    const [t,n] = ot(s)
        , a = h.useMemo(()=>{
            function o(l, c) {
                typeof l == "string" ? n(i=>{
                        const r = l
                            , u = c;
                        i[r] = u
                    }
                ) : typeof l == "function" ? n(l) : typeof l == "object" && n(i=>{
                        const r = l;
                        for (const u of Object.keys(r)) {
                            const x = u;
                            i[x] = r[x]
                        }
                    }
                )
            }
            return o
        }
        , [n]);
    return [t, a]
}
function Gt(s, t=0) {
    if (s.length < 2)
        throw new Error("List requires at least two elements");
    const [n,a] = h.useState(t);
    function o() {
        a((n + 1) % s.length)
    }
    return {
        current: h.useMemo(()=>s[n], [s, n]),
        next: o
    }
}
function ie(s=!1) {
    const [t,n] = h.useState(s);
    function a() {
        n(!1)
    }
    function o() {
        n(!0)
    }
    return {
        visible: t,
        hide: a,
        show: o
    }
}
const Jt = {
    info: "info",
    success: "check",
    warning: "info-o",
    error: "close"
};
function Xt(s) {
    const {removeComponent: t=I, onClose: n=I, icon: a=e.jsx(T, {
        type: "info",
        size: 16
    }), content: o="", type: l="info", duration: c=1500} = s
        , {visible: i, show: r, hide: u} = ie();
    return h.useLayoutEffect(()=>{
            window.setTimeout(()=>r(), 0);
            const x = window.setTimeout(()=>{
                    u(),
                        n()
                }
                , c);
            return ()=>window.clearTimeout(x)
        }
        , [c, u, n, r]),
        e.jsxs("div", {
            className: j("message", `message-${l}`, {
                "message-show": i
            }),
            onTransitionEnd: ()=>!i && t(),
            children: [e.jsx("span", {
                className: "message-icon",
                children: a
            }), e.jsx("span", {
                className: "message-content",
                children: o
            })]
        })
}
function Yt(s) {
    const t = document.createElement("div");
    document.body.appendChild(t);
    const n = ()=>{
        oe.unmountComponentAtNode(t) && document.body.removeChild(t)
    }
        , a = e.jsx(T, {
        type: Jt[s.type],
        size: 16
    })
        , {type: o, content: l, duration: c, onClose: i} = s
        , r = {
        icon: a,
        type: o,
        content: l,
        removeComponent: n,
        duration: c,
        onClose: i
    };
    He(t).render(e.jsx(Xt, {
        ...r
    }))
}
const qt = (s,t,n)=>Yt({
    type: "error",
    content: s,
    duration: t,
    onClose: n
});
function Ke(s) {
    const {className: t, checked: n=!1, onChange: a=I} = s
        , o = j("checkbox", {
        checked: n
    }, t);
    function l() {
        a(!n)
    }
    return e.jsxs("div", {
        className: o,
        onClick: l,
        children: [e.jsx(T, {
            className: "checkbox-icon",
            type: "check",
            size: 18
        }), e.jsx("div", {
            children: s.children
        })]
    })
}
function se(s) {
    const {color: t, className: n, style: a} = s
        , o = j("tag", n)
        , l = {
        color: t,
        ...a
    }
        , c = {
        ...s,
        className: o,
        style: l
    };
    return e.jsx("span", {
        ...c,
        children: s.children
    })
}
function Kt(s) {
    const t = j("spinner", s.className);
    return e.jsxs("div", {
        className: t,
        children: [e.jsx("div", {
            className: "spinner-circle",
            children: e.jsx("div", {
                className: "spinner-inner"
            })
        }), e.jsx("div", {
            className: "spinner-circle",
            children: e.jsx("div", {
                className: "spinner-inner"
            })
        }), e.jsx("div", {
            className: "spinner-circle",
            children: e.jsx("div", {
                className: "spinner-inner"
            })
        }), e.jsx("div", {
            className: "spinner-circle",
            children: e.jsx("div", {
                className: "spinner-inner"
            })
        }), e.jsx("div", {
            className: "spinner-circle",
            children: e.jsx("div", {
                className: "spinner-inner"
            })
        })]
    })
}
function Qe(s) {
    const t = j("loading", "visible", s.className);
    return s.visible ? e.jsx("div", {
        className: t,
        children: e.jsx(Kt, {
            className: s.spinnerClassName
        })
    }) : null
}
function Qt(s) {
    var o;
    const t = h.useRef(document.createElement("div"));
    h.useLayoutEffect(()=>{
            const l = t.current;
            return document.body.appendChild(l),
                ()=>{
                    document.body.removeChild(l)
                }
        }
        , []);
    const n = "absolute h-full right-0 transition-transform transform duration-100 pointer-events-auto"
        , a = e.jsx("div", {
        className: j(s.className, "z-9999 pointer-events-none absolute inset-0"),
        children: e.jsx(O, {
            className: j(n, s.bodyClassName, {
                "translate-x-0": s.visible,
                "translate-x-full": !s.visible
            }),
            style: {
                width: s.width ?? 400
            },
            children: s.children
        })
    });
    return oe.createPortal(a, ((o = s.containerRef) == null ? void 0 : o.current) ?? t.current)
}
ee.extend(at);
function ke(s, t) {
    const n = t === "en_US" ? "en" : "zh-cn";
    return ee(s).locale(n).from(ee())
}
function Zt(s) {
    const {translation: t} = E()
        , n = h.useMemo(()=>t("Connections").t, [t])
        , {className: a, style: o} = s
        , l = j("flex flex-wrap px-1", a);
    function c(i) {
        var r;
        (r = s.onChange) == null || r.call(s, i)
    }
    return e.jsxs("div", {
        className: l,
        style: o,
        children: [e.jsx("div", {
            className: j("connections-devices-item mb-2 pt-2", {
                selected: s.selected === ""
            }),
            onClick: ()=>c(""),
            children: n("filter.all")
        }), s.devices.map(i=>e.jsxs("div", {
            className: j("connections-devices-item mb-2 pt-2", {
                selected: s.selected === i.label
            }),
            onClick: ()=>c(i.label),
            children: [i.label, " (", i.number, ")"]
        }, i.label))]
    })
}
function es(s) {
    var a, o, l, c, i, r, u, x, w, g, d;
    const {translation: t} = E()
        , n = h.useMemo(()=>t("Connections").t, [t]);
    return e.jsxs("div", {
        className: j(s.className, "flex flex-col overflow-y-auto text-sm"),
        children: [e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.id")
            }), e.jsx("span", {
                className: "font-mono",
                children: s.connection.id
            })]
        }), e.jsxs("div", {
            className: "flex justify-between my-3",
            children: [e.jsxs("div", {
                className: "flex flex-1",
                children: [e.jsx("span", {
                    className: "font-bold w-20",
                    children: n("info.network")
                }), e.jsx("span", {
                    className: "font-mono",
                    children: (a = s.connection.metadata) == null ? void 0 : a.network
                })]
            }), e.jsxs("div", {
                className: "flex flex-1",
                children: [e.jsx("span", {
                    className: "font-bold w-20",
                    children: n("info.inbound")
                }), e.jsx("span", {
                    className: "font-mono",
                    children: (o = s.connection.metadata) == null ? void 0 : o.type
                })]
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.host")
            }), e.jsx("span", {
                className: "flex-1 font-mono break-all",
                children: (l = s.connection.metadata) != null && l.host ? `${s.connection.metadata.host}:${(c = s.connection.metadata) == null ? void 0 : c.destinationPort}` : n("info.hostEmpty")
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.dstIP")
            }), e.jsx("span", {
                className: "font-mono",
                children: (i = s.connection.metadata) != null && i.destinationIP ? `${s.connection.metadata.destinationIP}:${(r = s.connection.metadata) == null ? void 0 : r.destinationPort}` : n("info.hostEmpty")
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.srcIP")
            }), e.jsx("span", {
                className: "font-mono",
                children: `${(u = s.connection.metadata) == null ? void 0 : u.sourceIP}:${(x = s.connection.metadata) == null ? void 0 : x.sourcePort}`
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.process")
            }), e.jsx("span", {
                className: "break-all flex-1 font-mono",
                children: (w = s.connection.metadata) != null && w.processPath ? `${ze(s.connection.metadata.processPath)}` : n("info.hostEmpty")
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.processPath")
            }), e.jsx("span", {
                className: "break-all flex-1 font-mono",
                children: (g = s.connection.metadata) != null && g.processPath ? `${s.connection.metadata.processPath}` : n("info.hostEmpty")
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.rule")
            }), e.jsx("span", {
                className: "font-mono",
                children: s.connection.rule && `${s.connection.rule}${s.connection.rulePayload && ` :: ${s.connection.rulePayload}`}`
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.chains")
            }), e.jsx("span", {
                className: "break-all flex-1 font-mono",
                children: (d = s.connection.chains) == null ? void 0 : d.slice().reverse().join(" / ")
            })]
        }), e.jsxs("div", {
            className: "flex justify-between my-3",
            children: [e.jsxs("div", {
                className: "flex flex-1",
                children: [e.jsx("span", {
                    className: "font-bold w-20",
                    children: n("info.upload")
                }), e.jsx("span", {
                    className: "font-mono",
                    children: z(s.connection.upload ?? 0)
                })]
            }), e.jsxs("div", {
                className: "flex flex-1",
                children: [e.jsx("span", {
                    className: "font-bold w-20",
                    children: n("info.download")
                }), e.jsx("span", {
                    className: "font-mono",
                    children: z(s.connection.download ?? 0)
                })]
            })]
        }), e.jsxs("div", {
            className: "flex my-3",
            children: [e.jsx("span", {
                className: "font-bold w-20",
                children: n("info.status")
            }), e.jsx("span", {
                className: "font-mono",
                children: s.connection.completed ? e.jsx("span", {
                    className: "text-red",
                    children: n("info.closed")
                }) : e.jsx("span", {
                    className: "text-green",
                    children: n("info.opening")
                })
            })]
        })]
    })
}
class ts {
    constructor() {
        this.connections = new Map,
            this.saveDisconnection = !1
    }
    appendToSet(t) {
        var a;
        const n = t.reduce((o,l)=>o.set(l.id, l), new Map);
        for (const o of this.connections.keys())
            if (!n.has(o))
                if (!this.saveDisconnection)
                    this.connections.delete(o);
                else {
                    const l = this.connections.get(o);
                    l != null && this.connections.set(o, je(l, c=>{
                            c.completed = !0,
                                c.uploadSpeed = 0,
                                c.downloadSpeed = 0
                        }
                    ))
                }
        for (const o of n.keys()) {
            if (!this.connections.has(o)) {
                this.connections.set(o, {
                    ...n.get(o),
                    uploadSpeed: 0,
                    downloadSpeed: 0
                });
                continue
            }
            const l = this.connections.get(o)
                , c = n.get(o);
            (a = this.connections) == null || a.set(o, {
                ...c,
                uploadSpeed: c.upload - l.upload,
                downloadSpeed: c.download - l.download
            })
        }
    }
    toggleSave() {
        var t, n;
        if (this.saveDisconnection) {
            this.saveDisconnection = !1;
            for (const a of this.connections.keys())
                (n = (t = this.connections) == null ? void 0 : t.get(a)) != null && n.completed && this.connections.delete(a)
        } else
            this.saveDisconnection = !0;
        return this.saveDisconnection
    }
    getConnections() {
        return [...this.connections.values()]
    }
}
function ss() {
    const s = h.useMemo(()=>new ts, [])
        , t = h.useRef(!0)
        , [n,a] = h.useState([])
        , [o,l] = h.useState(!1)
        , c = h.useCallback(function(r) {
        s.appendToSet(r),
        t.current && a(s.getConnections()),
            t.current = !t.current
    }, [s])
        , i = h.useCallback(function() {
        const r = s.toggleSave();
        l(r),
        r || a(s.getConnections()),
            t.current = !0
    }, [s]);
    return {
        connections: n,
        feed: c,
        toggleSave: i,
        save: o
    }
}
const b = {
    Host: "host",
    Network: "network",
    Process: "process",
    Type: "type",
    Chains: "chains",
    Rule: "rule",
    Speed: "speed",
    Upload: "upload",
    Download: "download",
    SourceIP: "sourceIP",
    Time: "time"
}
    , ns = new Set([b.Network, b.Type, b.Speed, b.Upload, b.Download, b.SourceIP, b.Time, b.Process]);
function os(s, t) {
    switch (!0) {
        case (s === 0 && t === 0):
            return "-";
        case (s !== 0 && t !== 0):
            return `↑ ${z(s)}/s ↓ ${z(t)}/s`;
        case s !== 0:
            return `↑ ${z(s)}/s`;
        default:
            return `↓ ${z(t)}/s`
    }
}
const M = dt();
function as() {
    const {translation: s, lang: t} = E()
        , n = h.useMemo(()=>s("Connections").t, [s])
        , a = Bt()
        , o = ye(a)
        , l = R()
        , c = h.useRef(null)
        , [i,r] = te({
        uploadTotal: 0,
        downloadTotal: 0
    })
        , {visible: u, show: x, hide: w} = ie();
    function g() {
        l.closeAllConnections().finally(()=>w())
    }
    const {connections: d, feed: p, save: P, toggleSave: y} = ss()
        , C = h.useMemo(()=>d.map(m=>({
        id: m.id,
        host: `${m.metadata.host || m.metadata.destinationIP}:${m.metadata.destinationPort}`,
        chains: m.chains.slice().reverse().join(" / "),
        rule: m.rulePayload ? `${m.rule} :: ${m.rulePayload}` : m.rule,
        time: new Date(m.start).getTime(),
        upload: m.upload,
        download: m.download,
        sourceIP: m.metadata.sourceIP,
        type: m.metadata.type,
        network: m.metadata.network.toUpperCase(),
        process: m.metadata.processPath,
        speed: {
            upload: m.uploadSpeed,
            download: m.downloadSpeed
        },
        completed: !!m.completed,
        original: m
    })), [d])
        , S = h.useMemo(()=>{
            const m = lt(d, "metadata.sourceIP");
            return Object.keys(m).map(f=>({
                label: f,
                number: m[f].length
            })).sort((f,v)=>f.label.localeCompare(v.label))
        }
        , [d])
        , N = h.useRef(null)
        , $ = ct(N, {
        threshold: [1]
    })
        , W = h.useMemo(()=>[M.accessor(b.Host, {
        minSize: 260,
        size: 260,
        header: n(`columns.${b.Host}`)
    }), M.accessor(b.Network, {
        minSize: 80,
        size: 80,
        header: n(`columns.${b.Network}`)
    }), M.accessor(b.Type, {
        minSize: 100,
        size: 100,
        header: n(`columns.${b.Type}`)
    }), M.accessor(b.Chains, {
        minSize: 200,
        size: 200,
        header: n(`columns.${b.Chains}`)
    }), M.accessor(b.Rule, {
        minSize: 140,
        size: 140,
        header: n(`columns.${b.Rule}`)
    }), M.accessor(b.Process, {
        minSize: 100,
        size: 100,
        header: n(`columns.${b.Process}`),
        cell: m=>m.getValue() ? ze(m.getValue()) : "-"
    }), M.accessor(m=>[m.speed.upload, m.speed.download], {
        id: b.Speed,
        header: n(`columns.${b.Speed}`),
        minSize: 200,
        size: 200,
        sortDescFirst: !0,
        sortingFn(m, f) {
            var Y, Ee;
            const v = ((Y = m.original) == null ? void 0 : Y.speed) ?? {
                upload: 0,
                download: 0
            }
                , H = ((Ee = f.original) == null ? void 0 : Ee.speed) ?? {
                upload: 0,
                download: 0
            };
            return v.download === H.download ? v.upload - H.upload : v.download - H.download
        },
        cell: m=>os(m.getValue()[0], m.getValue()[1])
    }), M.accessor(b.Upload, {
        minSize: 100,
        size: 100,
        header: n(`columns.${b.Upload}`),
        cell: m=>z(m.getValue())
    }), M.accessor(b.Download, {
        minSize: 100,
        size: 100,
        header: n(`columns.${b.Download}`),
        cell: m=>z(m.getValue())
    }), M.accessor(b.SourceIP, {
        minSize: 140,
        size: 140,
        header: n(`columns.${b.SourceIP}`),
        filterFn: "equals"
    }), M.accessor(b.Time, {
        minSize: 120,
        size: 120,
        header: n(`columns.${b.Time}`),
        cell: m=>ke(new Date(m.getValue()), t),
        sortingFn: (m,f)=>{
            var v, H;
            return (((v = f.original) == null ? void 0 : v.time) ?? 0) - (((H = m.original) == null ? void 0 : H.time) ?? 0)
        }
    })], [t, n]);
    h.useLayoutEffect(()=>{
            function m(f) {
                for (const v of f)
                    r({
                        uploadTotal: v.uploadTotal,
                        downloadTotal: v.downloadTotal
                    }),
                        p(v.connections)
            }
            return a == null || a.subscribe("data", m),
                ()=>{
                    a == null || a.unsubscribe("data", m)
                }
        }
        , [a, p, r]),
        it(()=>{
                var m;
                (m = o.current) == null || m.destory()
            }
        );
    const X = rt({
        data: C,
        columns: W,
        getCoreRowModel: ut(),
        getSortedRowModel: mt(),
        getFilteredRowModel: ht(),
        initialState: {
            sorting: [{
                id: b.Time,
                desc: !1
            }]
        },
        columnResizeMode: "onChange",
        enableColumnResizing: !0
    })
        , Z = X.getHeaderGroups()[0]
        , [re,de] = h.useState("");
    function ue(m) {
        var f;
        de(m),
        (f = X.getColumn(b.SourceIP)) == null || f.setFilterValue(m || void 0)
    }
    const [A,U] = te({
        visible: !1,
        selectedID: "",
        connection: {}
    });
    function me() {
        U(m=>{
                m.connection.completed = !0
            }
        ),
            l.closeConnection(A.selectedID)
    }
    const F = ye(A.connection);
    h.useEffect(()=>{
            var f;
            const m = (f = C.find(v=>v.id === A.selectedID)) == null ? void 0 : f.original;
            m ? U(v=>{
                    v.connection = {
                        ...m
                    },
                    A.selectedID === F.current.id && (v.connection.completed = F.current.completed)
                }
            ) : Object.keys(F.current).length !== 0 && !F.current.completed && U(v=>{
                    v.connection.completed = !0
                }
            )
        }
        , [C, A.selectedID, F, U]);
    const D = h.useMemo(()=>(($ == null ? void 0 : $.intersectionRatio) ?? 0) < 1, [$])
        , he = Z.headers.map((m,f)=>{
            const v = m.column
                , H = v.id;
            return e.jsxs("th", {
                className: j("connections-th", {
                    resizing: v.getIsResizing(),
                    fixed: v.id === b.Host,
                    shadow: D && v.id === b.Host
                }),
                style: {
                    width: m.getSize()
                },
                ref: v.id === b.Host ? N : void 0,
                children: [e.jsxs("div", {
                    onClick: v.getToggleSortingHandler(),
                    children: [$e(m.column.columnDef.header, m.getContext()), v.getIsSorted() !== !1 ? v.getIsSorted() === "desc" ? " ↓" : " ↑" : null]
                }), f !== Z.headers.length - 1 && e.jsx("div", {
                    onMouseDown: m.getResizeHandler(),
                    onTouchStart: m.getResizeHandler(),
                    className: "connections-resizer"
                })]
            }, H)
        }
    )
        , xe = X.getRowModel().rows.map(m=>{
            var f;
            return e.jsx("tr", {
                className: "select-none cursor-default",
                onClick: ()=>{
                    var v;
                    return U({
                        visible: !0,
                        selectedID: (v = m.original) == null ? void 0 : v.id
                    })
                }
                ,
                children: m.getAllCells().map(v=>{
                        var Y;
                        const H = j("connections-block", {
                            "text-center": ns.has(v.column.id),
                            completed: (Y = m.original) == null ? void 0 : Y.completed
                        }, {
                            fixed: v.column.id === b.Host,
                            shadow: D && v.column.id === b.Host
                        });
                        return e.jsx("td", {
                            className: H,
                            style: {
                                width: v.column.getSize()
                            },
                            children: $e(v.column.columnDef.cell, v.getContext())
                        }, v.column.id)
                    }
                )
            }, (f = m.original) == null ? void 0 : f.id)
        }
    );
    return e.jsxs("div", {
        className: "!h-100vh page",
        children: [e.jsxs(B, {
            title: n("title"),
            children: [e.jsx("span", {
                className: "cursor-default flex-1 connections-filter",
                children: `(${n("total.text")}: ${n("total.upload")} ${z(i.uploadTotal)} ${n("total.download")} ${z(i.downloadTotal)})`
            }), e.jsx(Ke, {
                className: "connections-filter",
                checked: P,
                onChange: y,
                children: n("keepClosed")
            }), e.jsx(T, {
                className: "connections-filter dangerous",
                onClick: x,
                type: "close-all",
                size: 20
            })]
        }), S.length > 1 && e.jsx(Zt, {
            devices: S,
            selected: re,
            onChange: ue
        }), e.jsx(O, {
            ref: c,
            className: "connections-card relative",
            children: e.jsx("div", {
                className: "min-h-full min-w-full overflow-auto",
                children: e.jsxs("table", {
                    children: [e.jsx("thead", {
                        children: e.jsx("tr", {
                            className: "connections-header",
                            children: he
                        })
                    }), e.jsx("tbody", {
                        children: xe
                    })]
                })
            })
        }), e.jsx(qe, {
            title: n("closeAll.title"),
            show: u,
            onClose: w,
            onOk: g,
            children: n("closeAll.content")
        }), e.jsxs(Qt, {
            containerRef: c,
            bodyClassName: "flex flex-col",
            visible: A.visible,
            width: 450,
            children: [e.jsxs("div", {
                className: "flex items-center justify-between h-8",
                children: [e.jsx("span", {
                    className: "font-bold pl-3",
                    children: n("info.title")
                }), e.jsx(T, {
                    type: "close",
                    size: 16,
                    className: "cursor-pointer",
                    onClick: ()=>U("visible", !1)
                })]
            }), e.jsx(es, {
                className: "px-5 mt-3",
                connection: A.connection
            }), e.jsx("div", {
                className: "flex justify-end mt-3 pr-3",
                children: e.jsx(K, {
                    type: "danger",
                    disabled: A.connection.completed,
                    onClick: ()=>me(),
                    children: n("info.closeConnection")
                })
            })]
        })]
    })
}
function ls() {
    const {translation: s} = E()
        , {t} = s("Settings")
        , {hostname: n, port: a, secret: o} = Q()
        , [l,c] = L(Se)
        , [i,r] = te({
        hostname: "",
        port: "",
        secret: ""
    });
    h.useEffect(()=>{
            r({
                hostname: n,
                port: a,
                secret: o
            })
        }
        , [n, a, o, r]);
    const [u,x] = L(Ce)
        , [w,g] = L(Pe);
    function d() {
        const {hostname: C, port: S, secret: N} = i;
        x([{
            hostname: C,
            port: S,
            secret: N
        }])
    }
    function p() {
        const {hostname: C, port: S, secret: N} = i
            , $ = [...u, {
            hostname: C,
            port: S,
            secret: N
        }];
        x($),
            g($.length - 1)
    }
    function P() {
        const {hostname: C, port: S} = i
            , N = u.findIndex(W=>W.hostname === C && W.port === S);
        if (N === -1) {
            qt(t("externalControllerSetting.deleteErrorText"));
            return
        }
        const $ = [...u.slice(0, N), ...u.slice(N + 1)];
        x($),
        w >= N && g(0)
    }
    const y = e.jsxs("div", {
        className: "space-x-3",
        children: [e.jsx(K, {
            type: "primary",
            onClick: ()=>p(),
            children: t("externalControllerSetting.addText")
        }), e.jsx(K, {
            type: "danger",
            disabled: u.length < 2,
            onClick: ()=>P(),
            children: t("externalControllerSetting.deleteText")
        })]
    });
    return e.jsxs(qe, {
        className: "!<sm:w-84 !w-105",
        show: !l,
        title: t("externalControllerSetting.title"),
        bodyClassName: "external-controller",
        footerExtra: y,
        onClose: ()=>c(!0),
        onOk: d,
        children: [e.jsx(Wt, {
            type: "info",
            inside: !0,
            children: e.jsx("p", {
                children: t("externalControllerSetting.note")
            })
        }), e.jsxs("div", {
            className: "flex items-center",
            children: [e.jsx("span", {
                className: "font-bold md:my-3 my-1 w-14",
                children: t("externalControllerSetting.host")
            }), e.jsx(G, {
                className: "flex-1 md:my-3 my-1",
                align: "left",
                inside: !0,
                value: i.hostname,
                onChange: C=>r("hostname", C),
                onEnter: d
            })]
        }), e.jsxs("div", {
            className: "flex items-center",
            children: [e.jsx("div", {
                className: "font-bold md:my-3 my-1 w-14",
                children: t("externalControllerSetting.port")
            }), e.jsx(G, {
                className: "flex-1 md:my-3 my-1 w-14",
                align: "left",
                inside: !0,
                value: i.port,
                onChange: C=>r("port", C),
                onEnter: d
            })]
        }), e.jsxs("div", {
            className: "flex items-center",
            children: [e.jsx("div", {
                className: "font-bold md:my-3 my-1 w-14",
                children: t("externalControllerSetting.secret")
            }), e.jsx(G, {
                className: "flex-1 md:my-3 my-1 w-14",
                align: "left",
                inside: !0,
                value: i.secret,
                onChange: C=>r("secret", C),
                onEnter: d
            })]
        })]
    })
}
const cs = [{
    label: "Default",
    value: ""
}, {
    label: "Debug",
    value: "debug"
}, {
    label: "Info",
    value: "info"
}, {
    label: "Warn",
    value: "warning"
}, {
    label: "Error",
    value: "error"
}, {
    label: "Silent",
    value: "silent"
}]
    , is = new Map([["debug", "text-teal-500"], ["info", "text-sky-500"], ["warning", "text-pink-500"], ["error", "text-rose-500"]]);
function rs() {
    var g;
    const s = h.useRef(null)
        , t = h.useRef([])
        , [n,a] = h.useState([])
        , {translation: o} = E()
        , {data: {logLevel: l}, set: c} = ae()
        , {general: {logLevel: i}} = le()
        , {t: r} = o("Logs")
        , u = Xe()
        , x = h.useRef(((g = s.current) == null ? void 0 : g.scrollHeight) ?? 0)
        , w = xt(i) === "silent";
    return h.useLayoutEffect(()=>{
            const d = s.current;
            d != null && x.current === d.scrollTop + d.clientHeight && (d.scrollTop = d.scrollHeight - d.clientHeight),
                x.current = (d == null ? void 0 : d.scrollHeight) ?? 0
        }
    ),
        h.useEffect(()=>{
                function d(p) {
                    t.current = t.current.slice().concat(p.map(P=>({
                        ...P,
                        time: new Date
                    }))),
                        a(t.current)
                }
                return u != null && (u.subscribe("data", d),
                    t.current = u.buffer(),
                    a(t.current)),
                    ()=>u == null ? void 0 : u.unsubscribe("data", d)
            }
            , [u]),
        e.jsxs("div", {
            className: "page",
            children: [e.jsxs(B, {
                title: r("title"),
                children: [e.jsxs("span", {
                    className: "mr-2 text-primary-darken text-sm",
                    children: [r("levelLabel"), ":"]
                }), e.jsx(Ye, {
                    disabled: w,
                    options: cs,
                    value: w ? "silent" : l,
                    onSelect: d=>c(p=>{
                            p.logLevel = d
                        }
                    )
                })]
            }), e.jsx(O, {
                className: "flex flex-1 flex-col md:mt-4 mt-2.5",
                children: e.jsx("ul", {
                    className: "logs-panel",
                    ref: s,
                    children: n.map((d,p)=>e.jsxs("li", {
                        className: "inline-block leading-5 text-[11px]",
                        children: [e.jsxs("span", {
                            className: "mr-2 text-orange-400",
                            children: ["[", ee(d.time).format("YYYY-MM-DD HH:mm:ss"), "]"]
                        }), e.jsxs("span", {
                            className: is.get(d.type),
                            children: ["[", d.type.toUpperCase(), "]"]
                        }), e.jsxs("span", {
                            children: [" ", d.payload]
                        })]
                    }, p))
                })
            })]
        })
}
var ge = (s=>(s.SPEED_NOTIFY = "speed-notify",
    s))(ge || {});
class ds {
    constructor() {
        this.EE = new Re
    }
    notifySpeedTest() {
        this.EE.emit("speed-notify")
    }
    subscribe(t, n) {
        this.EE.addListener(t, n)
    }
    unsubscribe(t, n) {
        this.EE.removeListener(t, n)
    }
}
const ve = new ds;
const Te = {
    "#909399": 0,
    "#00c520": 260,
    "#ff9a28": 600,
    "#ff3e5e": 1 / 0
};
function Ze(s) {
    var p, P;
    const {config: t, className: n} = s
        , {set: a} = ce()
        , o = R()
        , l = h.useCallback(async y=>{
            if (J())
                return await (k == null ? void 0 : k.getProxyDelay(y)) ?? 0;
            const {data: {delay: C}} = await o.getProxyDelay(y);
            return C
        }
        , [o])
        , c = h.useCallback(async function() {
        const y = await Ae.fromPromise(l(t.name), S=>S)
            , C = y.isErr() ? 0 : y.value;
        a(S=>{
                const N = S.proxies.find($=>$.name === t.name);
                N != null && N.history.push({
                    time: Date.now().toString(),
                    delay: C
                })
            }
        )
    }, [t.name, l, a])
        , i = (p = t.history) != null && p.length ? t.history.slice(-1)[0].delay : 0
        , r = (P = t.history) != null && P.length ? t.history.slice(-1)[0].meanDelay : void 0
        , u = i === 0 ? "-" : `${i}ms`
        , x = r ? `(${r}ms)` : "";
    h.useLayoutEffect(()=>{
            const y = ()=>{
                    c()
                }
            ;
            return ve.subscribe(ge.SPEED_NOTIFY, y),
                ()=>ve.unsubscribe(ge.SPEED_NOTIFY, y)
        }
        , [c]);
    const w = h.useMemo(()=>i === 0, [i])
        , g = h.useMemo(()=>Object.keys(Te).find(y=>(r || i) <= Te[y]), [i, r])
        , d = w ? "#E5E7EB" : g;
    return e.jsxs("div", {
        className: j("proxy-item", {
            "opacity-50": w
        }, n),
        children: [e.jsxs("div", {
            className: "flex-1",
            children: [e.jsx("span", {
                className: j("rounded-sm py-[3px] px-1 text-[10px] text-white", {
                    "text-gray-600": w
                }),
                style: {
                    backgroundColor: d
                },
                children: t.type
            }), e.jsx("p", {
                className: "proxy-name",
                children: t.name
            })]
        }), e.jsxs("div", {
            className: "flex flex-col h-full items-center justify-center md:flex-row md:h-[18px] md:justify-between md:space-y-0 space-y-3 text-[10px]",
            children: [e.jsxs("p", {
                children: [u, x]
            }), t.udp && e.jsx("p", {
                className: "bg-gray-200 p-[3px] rounded text-gray-600",
                children: "UDP"
            })]
        })]
    })
}
function us(s) {
    const {markProxySelected: t} = ce()
        , [n] = L(Ht)
        , {data: a} = ae()
        , o = R()
        , {config: l} = s;
    async function c(u) {
        if (await o.changeProxySelected(s.config.name, u),
            t(s.config.name, u),
            a.breakConnections) {
            const x = []
                , w = await o.getConnections();
            for (const g of w.data.connections)
                g.chains.includes(s.config.name) && x.push(g.id);
            await Promise.all(x.map(g=>o.closeConnection(g)))
        }
    }
    const i = h.useMemo(()=>{
            var x;
            const u = new Set;
            for (const w of l.all) {
                const g = (x = n.get(w)) == null ? void 0 : x.history;
                g != null && g.length && g.slice(-1)[0].delay === 0 && u.add(w)
            }
            return u
        }
        , [l.all, n])
        , r = l.type === "Selector";
    return e.jsxs("div", {
        className: "proxy-group",
        children: [e.jsxs("div", {
            className: "flex items-center justify-between h-10 md:h-15 md:mt-0 md:w-auto mt-4 w-full",
            children: [e.jsx("span", {
                className: "px-5 h-6 md:w-30 overflow-ellipsis overflow-hidden w-35 whitespace-nowrap",
                children: l.name
            }), e.jsx(se, {
                className: "md:mr-0 mr-5",
                children: l.type
            })]
        }), e.jsx("div", {
            className: "flex-1 md:py-4 py-2",
            children: e.jsx(Ft, {
                className: "md:ml-8 ml-5",
                data: l.all,
                onClick: c,
                errSet: i,
                select: l.now,
                canClick: r,
                rowHeight: 30
            })
        })]
    })
}
function ms(s) {
    const {update: t} = We()
        , {translation: n, lang: a} = E()
        , o = R()
        , {provider: l} = s
        , {t: c} = n("Proxies")
        , {visible: i, hide: r, show: u} = ie();
    function x() {
        u(),
            o.healthCheckProvider(l.name).then(async()=>await t()).finally(()=>r())
    }
    function w() {
        u(),
            o.updateProvider(l.name).then(async()=>await t()).finally(()=>r())
    }
    const g = h.useMemo(()=>l.proxies.slice().sort((d,p)=>-1 * we(d, p)), [l.proxies]);
    return e.jsxs(O, {
        className: "proxy-provider",
        children: [e.jsx(Qe, {
            visible: i
        }), e.jsxs("div", {
            className: "flex flex-col justify-between md:flex-row md:items-center",
            children: [e.jsxs("div", {
                className: "flex items-center",
                children: [e.jsx("span", {
                    className: "mr-6",
                    children: l.name
                }), e.jsx(se, {
                    children: l.vehicleType
                })]
            }), e.jsxs("div", {
                className: "flex items-center md:pt-0 pt-3",
                children: [l.updatedAt && e.jsx("span", {
                    className: "text-sm",
                    children: `${c("providerUpdateTime")}: ${ke(new Date(l.updatedAt), a)}`
                }), e.jsx(T, {
                    className: "cursor-pointer text-red pl-5",
                    type: "healthcheck",
                    size: 18,
                    onClick: x
                }), e.jsx(T, {
                    className: "cursor-pointer pl-5",
                    type: "update",
                    size: 18,
                    onClick: w
                })]
            })]
        }), e.jsx("ul", {
            className: "proxies-list",
            children: g.map(d=>e.jsx("li", {
                children: e.jsx(Ze, {
                    className: "proxy-provider-item",
                    config: d
                })
            }, d.name))
        })]
    })
}
const hs = {
    [0]: "sort",
    [1]: "sort-ascending",
    [2]: "sort-descending"
};
function we(s, t) {
    const n = s.history.length > 0 ? s.history.slice(-1)[0].delay : 0;
    return ((t.history.length > 0 ? t.history.slice(-1)[0].delay : 0) || Number.MAX_SAFE_INTEGER) - (n || Number.MAX_SAFE_INTEGER)
}
function xs() {
    const {groups: s, global: t} = ce()
        , {data: n, set: a} = ae()
        , {general: o} = le()
        , {translation: l} = E()
        , {t: c} = l("Proxies")
        , i = h.useMemo(()=>o.mode === "global" ? [t, ...s] : s, [o, s, t]);
    return e.jsx(e.Fragment, {
        children: i.length !== 0 && e.jsxs("div", {
            className: "flex flex-col",
            children: [e.jsx(B, {
                title: c("groupTitle"),
                children: e.jsx(Ke, {
                    className: "cursor-pointer text-sm text-primary-600 text-shadow-primary",
                    checked: n.breakConnections,
                    onChange: r=>a("breakConnections", r),
                    children: c("breakConnectionsText")
                })
            }), e.jsx(O, {
                className: "md:my-4 my-2.5 p-0",
                children: e.jsx("ul", {
                    className: "divide-gray-300 divide-y list-none",
                    children: i.map(r=>e.jsx("li", {
                        children: e.jsx(us, {
                            config: r
                        })
                    }, r.name))
                })
            })]
        })
    })
}
function fs() {
    const {providers: s} = We()
        , {translation: t} = E()
        , {t: n} = t("Proxies");
    return e.jsx(e.Fragment, {
        children: s.length !== 0 && e.jsxs("div", {
            className: "flex flex-col",
            children: [e.jsx(B, {
                title: n("providerTitle")
            }), e.jsx("ul", {
                className: "list-none",
                children: s.map(a=>e.jsx("li", {
                    className: "md:my-4 my-2.5",
                    children: e.jsx(ms, {
                        provider: a
                    })
                }, a.name))
            })]
        })
    })
}
function ps() {
    const {proxies: s} = ce()
        , {translation: t} = E()
        , {t: n} = t("Proxies");
    function a() {
        ve.notifySpeedTest()
    }
    const {current: o, next: l} = Gt([1, 2, 0])
        , c = h.useMemo(()=>{
            switch (o) {
                case 2:
                    return s.slice().sort((r,u)=>we(r, u));
                case 1:
                    return s.slice().sort((r,u)=>-1 * we(r, u));
                default:
                    return s.slice()
            }
        }
        , [o, s])
        , i = l;
    return e.jsx(e.Fragment, {
        children: c.length !== 0 && e.jsxs("div", {
            className: "flex flex-col",
            children: [e.jsxs(B, {
                title: n("title"),
                children: [e.jsx(T, {
                    className: "ml-3",
                    type: hs[o],
                    onClick: i,
                    size: 20
                }), e.jsx(T, {
                    className: "ml-3",
                    type: "speed",
                    size: 20
                }), e.jsx("span", {
                    className: "proxies-speed-test",
                    onClick: a,
                    children: n("speedTestText")
                })]
            }), e.jsx("ul", {
                className: "proxies-list",
                children: c.map(r=>e.jsx("li", {
                    children: e.jsx(Ze, {
                        config: r
                    })
                }, r.name))
            })]
        })
    })
}
function ys() {
    return e.jsxs("div", {
        className: "page",
        children: [e.jsx(xs, {}), e.jsx(fs, {}), e.jsx(ps, {})]
    })
}
function gs(s) {
    const {update: t} = Ve()
        , {translation: n, lang: a} = E()
        , o = R()
        , {provider: l} = s
        , {t: c} = n("Rules")
        , {visible: i, hide: r, show: u} = ie();
    function x() {
        u(),
            o.updateRuleProvider(l.name).then(async()=>await t()).finally(()=>r())
    }
    const w = j("rule-provider-icon", {
        "rule-provider-loading": i
    });
    return e.jsx("div", {
        className: "rule-provider",
        children: e.jsxs("div", {
            className: "rule-provider-header",
            children: [e.jsxs("div", {
                className: "rule-provider-header-part",
                children: [e.jsx("span", {
                    className: "rule-provider-name",
                    children: l.name
                }), e.jsx(se, {
                    children: l.vehicleType
                }), e.jsx(se, {
                    className: "rule-provider-behavior",
                    children: l.behavior
                }), e.jsx("span", {
                    className: "rule-provider-update",
                    children: `${c("ruleCount")}: ${l.ruleCount}`
                })]
            }), e.jsxs("div", {
                className: "rule-provider-header-part",
                children: [l.updatedAt && e.jsx("span", {
                    className: "rule-provider-update",
                    children: `${c("providerUpdateTime")}: ${ke(new Date(l.updatedAt), a)}`
                }), e.jsx(T, {
                    className: w,
                    type: "update",
                    size: 18,
                    onClick: x
                })]
            })]
        })
    })
}
function vs() {
    const {providers: s} = Ve()
        , {translation: t} = E()
        , {t: n} = t("Rules");
    return e.jsx(e.Fragment, {
        children: s.length !== 0 && e.jsxs("div", {
            className: "flex flex-col",
            children: [e.jsx(B, {
                title: n("providerTitle")
            }), e.jsx(O, {
                className: "divide-y mt-4 p-0 rounded shadow-primary",
                children: s.map(a=>e.jsx(gs, {
                    provider: a
                }, a.name))
            })]
        })
    })
}
function ws() {
    const {rules: s, update: t} = Ot()
        , {translation: n} = E()
        , {t: a} = n("Rules");
    _("rules", t);
    function o({index: l, style: c}) {
        const i = s[l];
        return e.jsx("li", {
            className: "rule-item",
            style: c,
            children: e.jsxs("div", {
                className: "flex py-1",
                children: [e.jsx("div", {
                    className: "rule-type text-center w-40",
                    children: i.type
                }), e.jsx("div", {
                    className: "flex-1 text-center payload",
                    children: i.payload
                }), e.jsx("div", {
                    className: "text-center w-40 rule-proxy",
                    children: i.proxy
                })]
            })
        })
    }
    return e.jsxs("div", {
        className: "page",
        children: [e.jsx(vs, {}), e.jsx(B, {
            className: "not-first:mt-7.5",
            title: a("title")
        }), e.jsx(O, {
            className: "flex flex-1 flex-col md:mt-4 mt-2.5 p-0 focus:outline-none",
            children: e.jsx(ft, {
                className: "min-h-120",
                children: ({height: l, width: c})=>e.jsx(pt, {
                    height: l ?? 0,
                    width: c ?? 0,
                    itemCount: s.length,
                    itemSize: 50,
                    children: o
                })
            })
        })]
    })
}
const js = [{
    label: "中文",
    value: "zh_CN"
}, {
    label: "English",
    value: "en_US"
}];
function bs() {
    const {premium: s} = Fe()
        , {data: t, update: n} = Je()
        , {general: a, update: o} = le()
        , l = Me(Se)
        , [c,i] = L(Pe)
        , r = q(Ce)
        , u = Q()
        , {translation: x, setLang: w, lang: g} = E()
        , {t: d} = x("Settings")
        , p = R()
        , [P,y] = te({
        socks5ProxyPort: 7891,
        httpProxyPort: 7890,
        mixedProxyPort: 0
    });
    h.useEffect(()=>{
            y("socks5ProxyPort", (a == null ? void 0 : a.socksPort) ?? 0),
                y("httpProxyPort", (a == null ? void 0 : a.port) ?? 0),
                y("mixedProxyPort", (a == null ? void 0 : a.mixedPort) ?? 0)
        }
        , [a, y]);
    async function C(f) {
        await p.updateConfig({
            mode: f
        }),
            await o()
    }
    async function S(f) {
        await (k == null ? void 0 : k.setStartAtLogin(f)),
            await n()
    }
    async function N(f) {
        await (k == null ? void 0 : k.setSystemProxy(f)),
            await n()
    }
    function $(f) {
        w(f)
    }
    async function W() {
        await p.updateConfig({
            port: P.httpProxyPort
        }),
            await o()
    }
    async function X() {
        await p.updateConfig({
            "socks-port": P.socks5ProxyPort
        }),
            await o()
    }
    async function Z() {
        await p.updateConfig({
            "mixed-port": P.mixedProxyPort
        }),
            await o()
    }
    async function re(f) {
        await p.updateConfig({
            "allow-lan": f
        }),
            await o()
    }
    const {hostname: de, port: ue} = u
        , {allowLan: A, mode: U} = a
        , me = (t == null ? void 0 : t.startAtLogin) ?? !1
        , F = (t == null ? void 0 : t.systemProxy) ?? !1
        , D = (t == null ? void 0 : t.isClashX) ?? !1
        , he = h.useMemo(()=>{
            const f = [{
                label: d("values.global"),
                value: "Global"
            }, {
                label: d("values.rules"),
                value: "Rule"
            }, {
                label: d("values.direct"),
                value: "Direct"
            }];
            return s && f.push({
                label: d("values.script"),
                value: "Script"
            }),
                f
        }
        , [d, s])
        , xe = r.map((f,v)=>({
        value: v,
        label: e.jsx("span", {
            className: "text-right truncate",
            children: f.hostname
        })
    }))
        , m = D ? e.jsx("span", {
        className: "text-primary-darken text-sm",
        children: `${de}:${ue}`
    }) : e.jsxs(e.Fragment, {
        children: [e.jsx(Ye, {
            disabled: r.length < 2 && !D,
            options: xe,
            value: c,
            onSelect: f=>i(f)
        }), e.jsx("span", {
            className: j({
                "modify-btn": !D
            }, "external-controller"),
            onClick: ()=>!D && l(!1),
            children: "编辑"
        })]
    });
    return e.jsxs("div", {
        className: "page",
        children: [e.jsx(B, {
            title: d("title")
        }), e.jsxs(O, {
            className: "settings-card",
            children: [e.jsxs("div", {
                className: "flex flex-wrap",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between w-full md:w-1/2 px-8 py-3",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.startAtLogin")
                    }), e.jsx(pe, {
                        disabled: !(t != null && t.isClashX),
                        checked: me,
                        onChange: S
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.language")
                    }), e.jsx(Le, {
                        options: js,
                        value: g,
                        onSelect: f=>$(f)
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex flex-wrap",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.setAsSystemProxy")
                    }), e.jsx(pe, {
                        disabled: !D,
                        checked: F,
                        onChange: N
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.allowConnectFromLan")
                    }), e.jsx(pe, {
                        checked: A,
                        onChange: re
                    })]
                })]
            })]
        }), e.jsxs(O, {
            className: "settings-card",
            children: [e.jsxs("div", {
                className: "flex flex-wrap",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.proxyMode")
                    }), e.jsx(Le, {
                        options: he,
                        value: yt(U),
                        onSelect: C
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.socks5ProxyPort")
                    }), e.jsx(G, {
                        className: "w-28",
                        disabled: D,
                        value: P.socks5ProxyPort,
                        onChange: f=>y("socks5ProxyPort", +f),
                        onBlur: X
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex flex-wrap",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.httpProxyPort")
                    }), e.jsx(G, {
                        className: "w-28",
                        disabled: D,
                        value: P.httpProxyPort,
                        onChange: f=>y("httpProxyPort", +f),
                        onBlur: W
                    })]
                }), e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.mixedProxyPort")
                    }), e.jsx(G, {
                        className: "w-28",
                        disabled: D,
                        value: P.mixedProxyPort,
                        onChange: f=>y("mixedProxyPort", +f),
                        onBlur: Z
                    })]
                })]
            }), e.jsxs("div", {
                className: "flex flex-wrap",
                children: [e.jsxs("div", {
                    className: "flex items-center justify-between md:w-1/2 px-8 py-3 w-full",
                    children: [e.jsx("span", {
                        className: "font-bold label",
                        children: d("labels.externalController")
                    }), e.jsx("div", {
                        className: "flex items-center space-x-2",
                        children: m
                    })]
                }), e.jsx("div", {
                    className: "px-8 w-1/2"
                })]
            })]
        })]
    })
}
const Ns = "" + new URL("logo-b453e72f.png",import.meta.url).href;
function Cs(s) {
    const {routes: t} = s
        , {translation: n} = E()
        , {version: a, premium: o} = Fe()
        , {data: l} = Je()
        , {t: c} = n("SideBar")
        , i = be()
        , r = t.map(({path: u, name: x, noMobile: w})=>e.jsx("li", {
        className: j("item", {
            "no-mobile": w
        }),
        children: e.jsx(gt, {
            to: {
                pathname: u,
                search: i.search
            },
            className: ({isActive: g})=>j({
                active: g
            }),
            children: c(x)
        })
    }, x));
    return e.jsxs("div", {
        className: "sidebar",
        children: [e.jsx("img", {
            src: Ns,
            alt: "logo",
            className: "sidebar-logo"
        }), e.jsx("ul", {
            className: "sidebar-menu",
            children: r
        }), e.jsxs("div", {
            className: "sidebar-version",
            children: [e.jsxs("span", {
                className: "sidebar-version-label",
                children: ["Clash", (l == null ? void 0 : l.isClashX) && "X", " ", c("Version")]
            }), e.jsx("span", {
                className: "sidebar-version-text",
                children: a
            }), o && e.jsx("span", {
                className: "sidebar-version-label",
                children: "Premium"
            })]
        })]
    })
}
function Ps() {
    Xe();
    const s = be()
        , t = [{
        path: "/proxies",
        name: "Proxies",
        element: e.jsx(ys, {})
    }, {
        path: "/logs",
        name: "Logs",
        element: e.jsx(rs, {})
    }, {
        path: "/rules",
        name: "Rules",
        element: e.jsx(ws, {}),
        noMobile: !0
    }, {
        path: "/connections",
        name: "Connections",
        element: e.jsx(as, {}),
        noMobile: !0
    }, {
        path: "/settings",
        name: "Settings",
        element: e.jsx(bs, {})
    }]
        , n = e.jsxs("div", {
        className: j("app", {
            "not-clashx": !J()
        }),
        children: [e.jsx(Cs, {
            routes: t
        }), e.jsx("div", {
            className: "page-container",
            children: e.jsx(vt, {})
        }), e.jsx(ls, {})]
    });
    return e.jsx(wt, {
        children: e.jsxs(fe, {
            path: "/",
            element: n,
            children: [e.jsx(fe, {
                path: "/",
                element: e.jsx(jt, {
                    to: {
                        pathname: "/proxies",
                        search: s.search
                    },
                    replace: !0
                })
            }), t.map(a=>e.jsx(fe, {
                path: a.path,
                element: a.element
            }, a.path))]
        })
    })
}
function Ie() {
    const s = document.getElementById("root")
        , t = e.jsx(h.StrictMode, {
        children: e.jsx(bt, {
            children: e.jsx(h.Suspense, {
                fallback: e.jsx(Qe, {
                    visible: !0
                }),
                children: e.jsx(Ps, {})
            })
        })
    });
    He(s).render(t)
}
J() ? Ct(()=>Ie()) : Ie();
