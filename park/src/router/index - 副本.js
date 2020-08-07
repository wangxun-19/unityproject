/**Created by yiqu on 2019/7/27*/
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

//授权组件
//import auth from '../components/auth'

import menuBox from '../components/public/menuBox'
import menuBox1 from '../components/public/menuBox1'
import menuBox2 from '../components/public/menuBox2'
import menuBox3 from '../components/public/menuBox3'

import errorPage from '../components/public/error';
import qrCode from '../components/public/qrCode';

import test from '../components/test'
import bannerPart from '../components/public/bannerPart';

//会员服务组件
import index from '../components/index'
import businessCircle from '../components/businessCircle';
import hiPlay from '../components/hiPlay';
import findNews from '../components/findNews';
import my from '../components/my';

import coreActivity from '../components/coreActivity'
const signIn = () => import('../components/signIn');
import brand from '../components/brand';
const task = () => import('../components/task');
import brandDetail from '../components/brandDetail';
import newsContent from '../components/newsContent';
const coupon = () => import('../components/coupon');
const storeIn = () => import('../components/storeIn');
const myOrder = () => import('../components/myOrder');
const couponDetail = () => import('../components/couponDetail');
const editInfo = () => import('../components/editInfo');

import indexSearch from '../components/searchPage/indexSearch'
import shopSearch from '../components/searchPage/shopSearch'
import consumeSearch from '../components/searchPage/consumeSearch'


const shopAddress = () => import('../components/shopAddress');
const addAddress = () => import('../components/addAddress');
const editAddress = () => import('../components/editAddress');
import integralMall from '../components/integralMall';
import commodityDetail from '../components/commodityDetail';
const jfOrder = () => import('../components/jfOrder');
const jfPay = () => import('../components/jfPay');
const shopLogin = () => import('../components/shopLogin/index');
const consumeRecord = () => import('../components/shopLogin/consumeRecord');
import getCoupon from '../components/getCoupon';
const integralRecord = () => import('../components/integralRecord');
const feedBack = () => import('../components/feedBack');
import brandEnter from '../components/brandEnter';

const signUp = () => import('../components/signUp');
const confirmConsume = () => import('../components/shopLogin/confirmConsume');
const cooperation = () => import('../components/cooperation');
const coreDiscount = () => import('../components/coreDiscount');
import couponInfo from '../components/couponInfo';

//停车服务组件
import indexPark from '../components/parkingserver/index'
import findCar from '../components/parkingserver/findCar';
import myCar from '../components/parkingserver/myCar';
import payBack from '../components/parkingserver/payBack';

const payRecord = () => import('../components/parkingserver/payRecord');
const findResult = () => import('../components/parkingserver/findResult');
//const order = () => import('../components/parkingserver/order');
const recordDetail = () => import('../components/parkingserver/recordDetail');
const addCar = () => import('../components/parkingserver/addCar');
const toPay = () => import('../components/parkingserver/toPay');

import maps from '../components/parkingserver/maps';
const parkingDetail = () => import('../components/parkingserver/parkingDetail');
const carManage = () => import('../components/parkingserver/carManage');
const findArrears = () => import('../components/parkingserver/findArrears');
const arrearsDetail = () => import('../components/parkingserver/arrearsDetail');

import parkingSearch from '../components/searchPage/parkingSearch'
import noticeList from '../components/parkingserver/noticeList';
const custom = () => import('../components/parkingserver/custom');

//抽奖
import luckDraw from '../components/luckDraw/index';
import luckTurnTable from '../components/luckTurnTable/index';

//投票
import vote from '../components/vote/index';
const  voteDetail = () => import('../components/vote/detail');
const  voteSignUp = () => import('../components/vote/signUp');

//代餐二维码
import publicQr from '../components/qrCode/publicQr';
import parkingQr from '../components/qrCode/parkingQr';
import couponQr from '../components/qrCode/couponQr';

// 安装全局组件 ---parkingServer
Vue.component('indexMenu',menuBox);
Vue.component('businessMenu',menuBox1);
Vue.component('parkingMenu',menuBox2);
Vue.component('shopMenu',menuBox3);
Vue.component('bannerPart',bannerPart);


export default new Router({
    mode:'hash',
    scrollBehavior(to,from,savePosition){
        if(savePosition){
            return savePosition
        }else{
            return {x:0,y:0}
        }
    },
    routes: [
        {
            path: '*',
            redirect: '/',
        },
        {
            path: '/qrCode',
            name: 'qrCode',
            meta:{
                title:'关注公众号',
                keepAlive:false
            },
            component: qrCode
        },
        {
            path: '/',
            name: 'index',
            meta:{
                title:'长兴之芯',
                keepAlive:false,
                haveAdv:true
            },
            component: index
        },
        {
            path: '/brand',
            name: 'brand',
            meta:{
                title:'品牌导购',
                keepAlive:true
            },
            component: brand
        },
        {
            path: '/businessCircle',
            name: 'businessCircle',
            meta:{
                title:'商业街区',
                keepAlive:false,
                haveAdv:true
            },
            component: businessCircle
        },
        {
            path: '/hiPlay',
            name: 'hiPlay',
            meta:{
                title:'HI玩',
                keepAlive:true
            },
            component: hiPlay
        },
        {
            path: '/findNews',
            name: 'findNews',
            meta:{
                title:'芯资讯',
                keepAlive:true
            },
            component: findNews
        },
        {
            path: '/my',
            name: 'my',
            meta:{
                title:'我的',
                keepAlive:false
            },
            component: my
        },
        {
            path: '/editInfo',
            name: 'editInfo',
            meta:{
                title:'完善资料',
                keepAlive:false
            },
            component: editInfo
        },
        {
            path: '/indexSearch',
            name: 'indexSearch',
            meta:{
                title:'全局搜索',
                keepAlive:true
            },
            component: indexSearch
        },
        {
            path: '/shopSearch',
            name: 'shopSearch',
            meta:{
                title:'商户搜索',
                keepAlive:true
            },
            component: shopSearch
        },
        {
            path: '/consumeSearch',
            name: 'consumeSearch',
            meta:{
                title:'核销记录搜索',
                keepAlive:true
            },
            component: consumeSearch
        },
        {
            path: '/newsContent',
            name: 'newsContent',
            meta:{
                title:'内容详情',
                keepAlive:false,
                startTime:false
            },
            component: newsContent
        },
        {
            path: '/brandDetail',
            name: 'brandDetail',
            meta:{
                title:'商户详情',
                keepAlive:false,
                startTime:false
            },
            component: brandDetail
        },
        {
            path: '/task',
            name: 'task',
            meta:{
                title:'任务',
                keepAlive:false
            },
            component: task
        },
        {
            path: '/signIn',
            name: 'signIn',
            meta:{
                title:'签到',
                keepAlive:false
            },
            component: signIn
        },
        {
            path: '/integralRecord',
            name: 'integralRecord',
            meta:{
                title:'我的积分',
                keepAlive:false
            },
            component: integralRecord
        },
        {
            path: '/coupon',
            name: 'coupon',
            meta:{
                title:'优惠券',
                keepAlive:true
            },
            component: coupon
        },
        {
            path: '/storeIn',
            name: 'storeIn',
            meta:{
                title:'商户登陆',
                keepAlive:false
            },
            component: storeIn
        },
        {
            path: '/shopLogin',
            name: 'shopLogin',
            meta:{
                title:'商户后台管理',
                keepAlive:false
            },
            component: shopLogin
        },
        {
            path: '/consumeRecord',
            name: 'consumeRecord',
            meta:{
                title:'核销记录',
                keepAlive:false
            },
            component: consumeRecord
        },
        {
            path: '/myOrder',
            name: 'myOrder',
            meta:{
                title:'我的订单',
                keepAlive:false
            },
            component: myOrder
        },
        {
            path: '/integralMall',
            name: 'integralMall',
            meta:{
                title:'积分商城',
                keepAlive:false
            },
            component: integralMall
        },
        {
            path: '/commodityDetail',
            name: 'commodityDetail',
            meta:{
                title:'商品详情',
                keepAlive:false
            },
            component: commodityDetail
        },
        {
            path: '/jfPay',
            name: 'jfPay',
            meta:{
                title:'订单',
                keepAlive:false
            },
            component: jfPay
        },
        {
            path: '/couponDetail',
            name: 'couponDetail',
            meta:{
                title:'卡券详情',
                keepAlive:false
            },
            component: couponDetail
        },
        {
            path: '/shopAddress',
            name: 'shopAddress',
            meta:{
                title:'收货地址',
                keepAlive:false
            },
            component: shopAddress
        },
        {
            path: '/addAddress',
            name: 'addAddress',
            meta:{
                title:'新增收货地址',
                keepAlive:false
            },
            component: addAddress
        },
        {
            path: '/editAddress',
            name: 'editAddress',
            meta:{
                title:'编辑收货地址',
                keepAlive:false
            },
            component: editAddress
        },
        {
            path: '/jfOrder',
            name: 'jfOrder',
            meta:{
                title:'积分订单',
                keepAlive:false
            },
            component: jfOrder
        },
        {
            path: '/getCoupon',
            name: 'getCoupon',
            meta:{
                title:'领券中心',
                keepAlive:false
            },
            component: getCoupon
        },
        {
            path: '/feedBack',
            name: 'feedBack',
            meta:{
                title:'意见反馈',
                keepAlive:false
            },
            component: feedBack
        },
        {
            path: '/brandEnter',
            name: 'brandEnter',
            meta:{
                title:'品牌入驻',
                keepAlive:false
            },
            component: brandEnter
        },
        {
            path: '/signUp',
            name: 'signUp',
            meta:{
                title:'活动报名',
                keepAlive:false
            },
            component: signUp
        },
        {
            path: '/parkingServer',
            name: 'parkingServer',
            meta:{
                title:'自助缴费',
                keepAlive:false,
                haveAdv:true
            },
            component: indexPark
        },
        {
            path:'/findResult',
            name:'findResult',
            meta:{
                title:'查找结果',
                keepAlive:false,
            },
            component: findResult
        },
        {
            path: '/findCar',
            name: 'findCar',
            meta:{
                title:'寻找车位',
                keepAlive:true,
                haveAdv:true
            },
            component: findCar
        },
        {
            path: '/payBack',
            name: 'payBack',
            meta:{
                title:'欠费补缴',
                keepAlive:false,
                haveAdv:true
            },
            component: payBack
        },
        {
            path: '/findArrears',
            name: 'findArrears',
            meta:{
                title:'欠费查询结果',
                keepAlive:true,
                haveAdv:true
            },
            component:findArrears
        },
        {
            path: '/arrearsDetail',
            name: 'arrearsDetail',
            meta:{
                title:'欠费详情',
                keepAlive:false,
                haveAdv:true
            },
            component:arrearsDetail
        },
        {
            path: '/payRecord',
            name: 'payRecord',
            meta:{
                title:'缴费记录',
                keepAlive:true,
                haveAdv:true
            },
            component: payRecord
        },
        {
            path: '/myCar',
            name: 'myCar',
            meta:{
                title:'我的爱车',
                keepAlive:false,
                haveAdv:true
            },
            component: myCar
        },
        /*{
            path: '/order',
            name: 'order',
            meta:{
                title:'缴费订单',
                keepAlive:false
            },
            component: order
        },*/
        {
            path: '/recordDetail',
            name: 'recordDetail',
            meta:{
                title:'订单详情',
                keepAlive:false
            },
            component: recordDetail
        },
        {
            path: '/addCar',
            name: 'addCar',
            meta:{
                title:'添加爱车',
                keepAlive:false,
                haveAdv:true
            },
            component: addCar
        },
        {
            path: '/toPay',
            name: 'toPay',
            meta:{
                title:'支付',
                keepAlive:false,
                haveAdv:true
            },
            component: toPay
        },
        /*{
            path: '/payResult',
            name: 'payResult',
            meta:{
                title:'支付结果',
                keepAlive:false,
                haveAdv:true
            },
            component: payResult
        },*/
        {
            path: '/maps',
            name: 'maps',
            meta:{
                title:'地图',
                keepAlive:false
            },
            component: maps
        },
        {
            path: '/parkingSearch',
            name: 'parkingSearch',
            meta:{
                title:'搜索车位',
                keepAlive:true,
                haveAdv:true
            },
            component: parkingSearch
        },
        {
            path: '/parkingDetail',
            name: 'parkingDetail',
            meta:{
                title:'停车场详情',
                keepAlive:false,
                haveAdv:true
            },
            component: parkingDetail
        },
        {
            path: '/carManage',
            name: 'carManage',
            meta:{
                title:'车辆管理',
                keepAlive:false,
                haveAdv:true
            },
            component: carManage
        },
        {
            path: '/noticeList',
            name: 'noticeList',
            meta:{
                title:'公告列表',
                keepAlive:false
            },
            component: noticeList
        },
        {
            path: '/confirmConsume',
            name: 'confirmConsume',
            meta:{
                title:'确认核销',
                keepAlive:false
            },
            component: confirmConsume
        },
        {
            path: '/luckDraw',
            name: 'luckDraw',
            meta:{
                title:'欢乐老虎机',
                keepAlive:false
            },
            component: luckDraw
        },
        {
            path: '/luckTurnTable',
            name: 'luckTurnTable',
            meta:{
                title:'幸运抽大奖',
                keepAlive:false
            },
            component: luckTurnTable
        },
        {
            path: '/vote',
            name: 'vote',
            meta:{
                title:'投票',
                keepAlive:true
            },
            component: vote
        },
        {
            path: '/voteDetail',
            name: 'voteDetail',
            meta:{
                title:'投票详情',
                keepAlive:false
            },
            component: voteDetail
        },
        {
            path: '/voteSignUp',
            name: 'voteSignUp',
            meta:{
                title:'投票报名',
                keepAlive:false
            },
            component: voteSignUp
        },
        {
            path: '/cooperation',
            name: 'cooperation',
            meta:{
                title:'商务合作',
                keepAlive:false
            },
            component: cooperation
        },
        {
            path:'/coreActivity',
            name: 'coreActivity',
            meta:{
                title:'芯活动',
                keepAlive:true
            },
            component: coreActivity
        },
        {
            path: '/error',
            name: 'error',
            meta:{
                title:'错误页',
                keepAlive:false
            },
            component: errorPage
        },
        {
            path: '/test',
            name: 'test',
            meta:{
                title:'测试页',
                keepAlive:false
            },
            component: test
        },
        {
            path:'/custom',
            name: 'custom',
            meta:{
                title:'客服中心',
                keepAlive:false
            },
            component: custom
        },
        {
            path:'/coreDiscount',
            name: 'coreDiscount',
            meta:{
                title:'芯优惠',
                keepAlive:false
            },
            component: coreDiscount
        },
        {
            path:'/publicQr',
            name: 'publicQr',
            meta:{
                title:'关注公众号',
                keepAlive:false
            },
            component: publicQr
        },
        {
            path:'/parkingQr',
            name: 'parkingQr',
            meta:{
                title:'关注公众号',
                keepAlive:false
            },
            component: parkingQr
        },
        {
            path:'/couponQr',
            name: 'couponQr',
            meta:{
                title:'关注公众号',
                keepAlive:false
            },
            component: couponQr
        },
        {
            path:'/couponInfo',
            name: 'couponInfo',
            meta:{
                title:'详细信息',
                keepAlive:false
            },
            component: couponInfo
        }
    ]
})

