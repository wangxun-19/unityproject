import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "babel-polyfill";

Vue.config.productionTip = false;

//所有接口
import * as apis from "./request/api";
Vue.prototype.$apis = apis;

//引入阿里图标
import "./assets/iconfont/iconfont.css";

//浏览器类型---支付宝/微信
import browserType from "./utils/browserType";
Vue.prototype.$browserType = browserType;

//引入微信jssdk的方法
import wxMethod from "./utils/wxMethod";
Vue.prototype.$wxMethod = wxMethod;

//路由跳转前授权
router.beforeEach((to, from, next) => {
    store.commit("clearToken"); // vue路由跳转后取消请求
    document.title = to.meta.title; //让页面显示路由对应的name值。
    let path = to.path;
    //console.log(path);
    if (path === "/error") {
        next();
        return;
    }
    let browserTypes = browserType.browserType();
    store.commit("saveBrowserType", browserTypes);
    next();
});

let vm = new Vue({
    render: h => h(App),
    store,
    router
}).$mount("#app");
