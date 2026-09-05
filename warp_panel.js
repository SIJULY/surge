const url = "https://cloudflare-dns.com/dns-query?name=warp.sijuly.uk&type=A";

$httpClient.get({
    url: url,
    headers: { "accept": "application/dns-json" }
}, function(error, response, data) {
    let currentIp = "获取超时或被拦截";
    
    if (!error && data) {
        try {
            const res = JSON.parse(data);
            if (res.Answer && res.Answer.length > 0) {
                currentIp = res.Answer[0].data;
            }
        } catch(e) {}
    }
    
    $done({
        title: "☁️ WARP 优选节点",
        content: `域名：warp.sijuly.uk\n落地 IP：${currentIp}\n(点击右上角 ↻ 即可手动刷新)`,
        icon: "cloud.sun.fill",
        "icon-color": "#FF9500"
    });
});
