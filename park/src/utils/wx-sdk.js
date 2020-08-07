//import wx from 'weixin-js-sdk';  //SDK依赖
import { getJsSdkApi } from "../request/api";
export default {
    init(jsApiList = []) {
        //需要使用的api列表
        return new Promise((resolve, reject) => {
            getJsSdkApi({
                //从后台获取签名相关的接口
                url: location.href.split("#")[0]
            }).then(res => {
                if (res.code === 200) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                        signature: res.data.signature, // 必填，签名，见附录1
                        jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(() => {
                        // 微信SDK准备就绪后执行的回调。
                        resolve(wx);
                    });
                    wx.error(() => {
                        reject();
                    });
                } else if (res.code === 400) {
                    this.$toast.fail({
                        message: res.msg,
                        duration: 1200,
                        forbidClick: true
                    });
                }
            });
        });
    }
};
