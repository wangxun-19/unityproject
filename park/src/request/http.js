/**Created by yiqu on 2019/9/30*/
import axios from "axios"; // 引入axios
import QS from "qs"; // 引入qs模块，用来序列化post类型的数据，后面会提到
import { Notify, Toast } from "vant";
import router from "../router";
//基本信息，包括（重定向地址，授权地址，请求地址等等）
import baseInfo from "../utils/config";
import way from "../utils/codeDeal";
axios.defaults.baseURL = baseInfo.axiosBaseURL;

//设置请求超时
axios.defaults.timeout = 10000; //超时时间

import store from "../store/index";

// 请求拦截器
axios.interceptors.request.use(
    config => {
        //vue路由跳转后取消请求
        config.cancelToken = new axios.CancelToken(function(cancel) {
            store.commit("pushToken", { cancelToken: cancel });
        });

        // 每次发送请求之前判断vuex中是否存在token
        const token = store.state.token;
        token && (config.headers.token = token);
        return config;
    },
    error => {
        //console.log(error)
        return Promise.error(error);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        //console.log(response);
        if (response.status === 200) {
            way.codeDeal(response.data);
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },

    error => {
        console.log(error);
        if (error.message === "路由跳转取消请求") {
            console.log("路由跳转取消请求");
            return Promise.reject(error);
        }
        if (error.response.status) {
            console.log(error.response.status);
            return Promise.reject(error.response);
        } else if (error.request) {
            console.log(error.request);
            return Promise.reject(error.request);
        } else {
            return Promise.reject(error.response);
        }
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, { params: params })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                //console.log(err)
                console.log("get", err);
                reject(err);
            });
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log("post", err);
                reject(err);
            });
    });
}

export function upload(url, fd) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, fd)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log("upload", err);
                reject(err);
            });
    });
}
