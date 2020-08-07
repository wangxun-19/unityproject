/**Created by yiqu on 2020/2/29*/
let axiosBaseURL, reditUrl, authUrl;

// 环境的切换
if (process.env.NODE_ENV === "development") {
    axiosBaseURL = "http://api.zjlaishang.com";
    reditUrl = "http://www.zjlaishang.com";
    authUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0064a5ecb4bb49eb&redirect_uri=" +
        reditUrl +
        "&response_type=code&scope=snsapi_userinfo&state=WXPROJ1#wechat_redirect";
} else if (process.env.NODE_ENV === "production") {
    axiosBaseURL = "http://api.zjlaishang.com";
    reditUrl = "http://www.zjlaishang.com";
    authUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0064a5ecb4bb49eb&redirect_uri=" +
        reditUrl +
        "&response_type=code&scope=snsapi_userinfo&state=WXPROJ1#wechat_redirect";
}

export default {
    axiosBaseURL,
    reditUrl,
    authUrl
};
