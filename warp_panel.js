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
    
    let isDone = false;
    const finish = (statusMsg) => {
        if (isDone) return;
        isDone = true;
        $done({
            title: "☁️ WARP 优选节点",
            content: `域名：warp.sijuly.uk\n落地 IP：${currentIp}\n${statusMsg}`,
            icon: "cloud.sun.fill",
            "icon-color": "#FF9500"
        });
    };

    try {
        // 调用 Surge 内部 API 清理 DNS
        $httpAPI("POST", "/v1/dns/flush", {}, function(apiResult) {
            finish("(已强制刷新 Surge 底层 DNS)");
        });
        
        // 设定 1.5 秒超时，如果 API 没反应，直接输出结果，防止面板卡死
        setTimeout(() => { finish("(获取成功，但 DNS 刷新超时)"); }, 1500);
    } catch (err) {
        finish("(请在 General 中开启 http-api)");
    }
});
