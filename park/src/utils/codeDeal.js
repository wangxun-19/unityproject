/**Created by yiqu on 2020/5/6*/

import router from "../router";
import baseInfo from "./config";
import store from "../store";
import { getTokenApi } from "../request/api";

export default {
    //请求code处理
    codeDeal(res) {
        //console.log(res);
        let myCode = res.code;
        let errcode = res.errcode;
        if (myCode === 200) {
            //保存token
            if (res.data.token) {
                let token = res.data.token;
                store.commit("saveToken", token);
            }
            //完成任务获得积分
            if (res.data.reward) {
                this.getReward(res.data.reward);
            }
        } else if (myCode === 400) {
            /*vant.Toast.fail({
                message: res.msg,
                duration: 1200,
                forbidClick: true
            });*/
        } else if (myCode === 401 || myCode === 403) {
            console.log("去获取token");
            this.toAuth();
        } else if (myCode === 405) {
            console.log("未关注");
            this.toRouter();
        } else {
            console.log("其他");
            this.toError();
        }
        //console.log(errcode);
        if (errcode === 4001) {
            localStorage.removeItem("mchToken");
            router.replace("/shop/login");
        }
    },
    //去授权页面
    toAuth() {
        localStorage.removeItem("token");
        localStorage.setItem("authBefore", window.location.href);
        router.push("/");
    },
    //获取token
    getToken(code, cb) {
        getTokenApi({
            code
        })
            .then(res => {
                this.codeDeal(res);
                //this.getMyInfo();
                typeof cb == "function" && cb();
            })
            .catch(() => {
                this.toError();
            });
    },
    //去微信授权页面
    toWxAuth() {
        //去授权
        console.log("auth");
        window.location.href = baseInfo.authUrl;
    },
    //未关注跳转
    toRouter() {
        router.push({
            path: "/parkingQr"
        });
    },
    //完成任务
    getReward(reward) {
        let str = "";
        for (let i = 0; i < reward.length; i++) {
            str += "完成任务\n获得" + reward[i].name + reward[i].num + "\n";
        }
        //console.log(str);
        vant.Notify({
            type: "primary",
            color: "#fff",
            background: "#facd73",
            message: str,
            duration: 1500
        });
    },
    //到错误页
    toError() {
        router.push({
            path: "/error"
        });
    }
};
