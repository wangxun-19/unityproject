import wxJs from "./wx-sdk";
export default {
    //自定义分享
    share(info) {
        let link =
            info.link ||
            window.location.href.split("#")[0] +
                "redirect.html?app3Redirect=" +
                encodeURIComponent(window.location.href);
        let imgUrl = info.icon || "";
        let title = info.title || "";
        let desc = info.desc || "";

        wxJs.init([
            "updateAppMessageShareData",
            "updateTimelineShareData"
        ]).then(wx => {
            wx.updateAppMessageShareData({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success() {
                    console.log("分享好友设置成功");
                    //typeof cb == 'function' && cb("分享好友设置成功")
                }
            });
            wx.updateTimelineShareData({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success() {
                    console.log("分享朋友圈设置成功");
                    //typeof cb== 'function' && cb("分享好友设置成功")
                }
            });
        });
    },
    //微信支付
    wxPay(info, ccb, fcb) {
        let timestamp = info.timestamp;
        let nonceStr = info.nonceStr;
        let packages = info.package;
        let signType = info.signType;
        let paySign = info.paySign;
        wxJs.init(["chooseWXPay"]).then(wx => {
            wx.chooseWXPay({
                timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr, // 支付签名随机串，不长于 32 位
                package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign, // 支付签名
                success(result) {
                    // 支付成功后的回调函数
                    typeof ccb == "function" && ccb(result);
                },
                cancel() {
                    typeof fcb == "function" && fcb();
                }
            });
        });
    },
    //导航
    openLocation(info) {
        let latitude = info.latitude;
        let longitude = info.longitude;
        let name = info.name || "未设置";
        let address = info.address || "";
        let infoUrl = info.infoUrl || "";
        wxJs.init(["openLocation"]).then(wx => {
            wx.openLocation({
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                name: name, // 位置名
                address: address, // 地址详情说明
                scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
            });
        });
    },
    //扫一扫
    scanQRCode(ccb) {
        wxJs.init(["scanQRCode"]).then(wx => {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success(res) {
                    typeof ccb == "function" && ccb(res);
                }
            });
        });
    },
    //定位
    getLocation(ccb) {
        wxJs.init(["getLocation"]).then(wx => {
            wx.getLocation({
                type: "gcj02", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success(res) {
                    typeof ccb == "function" && ccb(res);
                }
            });
        });
    }
};
