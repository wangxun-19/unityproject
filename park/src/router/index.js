/**Created by yiqu on 2019/7/27*/
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import menuBox from "../components/public/menuBox";

import errorPage from "../components/public/error";
//import qrCode from '../components/public/qrCode';

import test from "../components/test";
import bannerPart from "../components/public/bannerPart";

//停车服务组件
import Auth from "../components/Auth";
import index from "../components/index";
import findCar from "../components/findCar";
import myCar from "../components/myCar";
import payBack from "../components/payBack";

import payRecord from "../components/payRecord";
import findResult from "../components/findResult";
import recordDetail from "../components/recordDetail";
import addCar from "../components/addCar";
import toPay from "../components/toPay";

import maps from "../components/maps";
import parkingDetail from "../components/parkingDetail";
import carManage from "../components/carManage";
import findArrears from "../components/findArrears";
import arrearsDetail from "../components/arrearsDetail";

import parkingSearch from "../components/parkingSearch";
import noticeList from "../components/noticeList";
import custom from "../components/custom";

import newsContent from "../components/newsContent";
import activityContent from "../components/activityContent";

import CouponList from "../components/CouponList";
import InvoiceList from "../components/invoice/InvoiceList";
import WriteInvoice from "../components/invoice/WriteInvoice";

//代参二维码
import parkingQr from "../components/qrCode/parkingQr";

// 安装全局组件 ---parkingServer
Vue.component("parkingMenu", menuBox);
Vue.component("bannerPart", bannerPart);

export default new Router({
    mode: "hash",
    scrollBehavior(to, from, savePosition) {
        if (savePosition) {
            return savePosition;
        } else {
            return { x: 0, y: 0 };
        }
    },
    routes: [
        {
            path: "/",
            name: "auth",
            meta: {
                title: "授权中"
            },
            component: Auth
            // component: findResult
        },
        {
            path: "/index",
            name: "index",
            meta: {
                title: "自助缴费",
                keepAlive: false,
                haveAdv: true
            },
            component: index
        },
        {
            path: "/findResult",
            name: "findResult",
            meta: {
                title: "查找结果",
                keepAlive: false
            },
            component: findResult
        },
        {
            path: "/findCar",
            name: "findCar",
            meta: {
                title: "寻找车位",
                keepAlive: true,
                haveAdv: true
            },
            component: findCar
        },
        {
            path: "/payBack",
            name: "payBack",
            meta: {
                title: "欠费补缴",
                keepAlive: false,
                haveAdv: true
            },
            component: payBack
        },
        {
            path: "/findArrears",
            name: "findArrears",
            meta: {
                title: "欠费查询结果",
                keepAlive: true,
                haveAdv: true
            },
            component: findArrears
        },
        {
            path: "/arrearsDetail",
            name: "arrearsDetail",
            meta: {
                title: "欠费详情",
                keepAlive: false,
                haveAdv: true
            },
            component: arrearsDetail
        },
        {
            path: "/payRecord",
            name: "payRecord",
            meta: {
                title: "缴费记录",
                keepAlive: true,
                haveAdv: true
            },
            component: payRecord
        },
        {
            path: "/myCar",
            name: "myCar",
            meta: {
                title: "我的爱车",
                keepAlive: false,
                haveAdv: true
            },
            component: myCar
        },
        {
            path: "/recordDetail",
            name: "recordDetail",
            meta: {
                title: "订单详情",
                keepAlive: false
            },
            component: recordDetail
        },
        {
            path: "/addCar",
            name: "addCar",
            meta: {
                title: "添加爱车",
                keepAlive: false,
                haveAdv: true
            },
            component: addCar
        },
        {
            path: "/toPay",
            name: "toPay",
            meta: {
                title: "支付",
                keepAlive: false,
                haveAdv: true
            },
            component: toPay
        },
        {
            path: "/maps",
            name: "maps",
            meta: {
                title: "地图",
                keepAlive: false
            },
            component: maps
        },
        {
            path: "/parkingSearch",
            name: "parkingSearch",
            meta: {
                title: "搜索车位",
                keepAlive: true,
                haveAdv: true
            },
            component: parkingSearch
        },
        {
            path: "/parkingDetail",
            name: "parkingDetail",
            meta: {
                title: "停车场详情",
                keepAlive: false,
                haveAdv: true
            },
            component: parkingDetail
        },
        {
            path: "/carManage",
            name: "carManage",
            meta: {
                title: "车辆管理",
                keepAlive: false,
                haveAdv: true
            },
            component: carManage
        },
        {
            path: "/noticeList",
            name: "noticeList",
            meta: {
                title: "公告列表",
                keepAlive: false
            },
            component: noticeList
        },
        {
            path: "/error",
            name: "error",
            meta: {
                title: "错误页",
                keepAlive: false
            },
            component: errorPage
        },
        {
            path: "/test",
            name: "test",
            meta: {
                title: "测试页",
                keepAlive: false
            },
            component: test
        },
        {
            path: "/custom",
            name: "custom",
            meta: {
                title: "客服中心",
                keepAlive: false
            },
            component: custom
        },
        {
            path: "/parkingQr",
            name: "parkingQr",
            meta: {
                title: "关注公众号",
                keepAlive: false,
                myShare: false
            },
            component: parkingQr
        },
        {
            path: "/newsContent",
            name: "newsContent",
            meta: {
                title: "内容详情",
                keepAlive: false,
                startTime: false
            },
            component: newsContent
        },
        {
            path: "/activityContent",
            name: "activityContent",
            meta: {
                title: "活动详情",
                keepAlive: false,
                startTime: false
            },
            component: activityContent
        },
        {
            path: "/couponList",
            name: "CouponList",
            meta: {
                title: "领取优惠券"
            },
            component: CouponList
        },
        {
            path: "/invoiceList",
            name: "InvoiceList",
            meta: {
                title: "订单列表"
            },
            component: InvoiceList
        },
        {
            path: "/writeInvoice",
            name: "WriteInvoice",
            meta: {
                title: "申请发票"
            },
            component: WriteInvoice
        },
        {
            path: "*",
            redirect: "/index"
        }
    ]
});
