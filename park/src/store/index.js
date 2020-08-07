/**Created by yiqu on 2019/8/17*/
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        browserType:"",   //浏览器类型
        reflash:false,   //当前是否刷新token状态
        toQrcode:false,   //当前是否跳往qrcode
        token: localStorage.getItem('token'),   //存token
        payRecord:[],  //当前查看的停车支付记录
        myMsg:{},   //我的信息
        couponList:[],  //优惠券列表
        parkingList:[],   //停车场列表
        myCarList:[],  //我的车列表
        brandList:[],  //品牌商铺分类
        selectList:sessionStorage.getItem('selectList')?JSON.parse(sessionStorage.getItem('selectList')):[],  //品牌分类
        allList:[],  //新闻列表
        arrearsList:[],   //补缴列表
        jfOrderListIndex:0,  //积分订单列表的index
        addressDefault:{},  //下单默认地址
        cancelTokenArr: [], ////vue路由跳转后取消请求
    },
    mutations:{
        //保存浏览器类型  微信或者支付宝
        saveBrowserType(state,value){
            state.browserType = value;
        },
        //保存刷新状态
        saveReflash(state,value){
            state.reflash = value;
        },
        //保存去qrcode状态
        saveToQrcode(state,value){
            state.toQrcode = value;
        },
        //保存token
        saveToken(state,value){
            state.token = value;
            localStorage.setItem('token',value);
        },
        //保存当前查看的停车支付记录列表
        savePayRecord(state,value){
            state.payRecord = value;
        },
        //保存我的信息
        saveMyMsg(state,value){
            state.myMsg = value;
        },
        //保存停车场列表
        saveParkingList(state,value){
            state.parkingList = value;
        },
        //保存补缴列表
        saveArrearsList(state,value){
            state.arrearsList = value;
        },
        //保存我的车列表
        saveMyCarList(state,value){
            state.myCarList = value;
        },
        //保存优惠券列表
        saveCouponList(state,value){
            state.couponList = value;
        },
        //保存商户列表
        saveBrandList(state,value){
            state.brandList = value;
        },
        //保存商户分类列表
        saveSelectList(state,value){
            state.selectList = value;
            sessionStorage.setItem('selectList',JSON.stringify(value));
        },
        //保存所有新闻列表
        saveAllList(state,value){
            state.allList = value;
        },
        //保存订单tab的索引
        saveJfOrderListIndex(state,value){
            state.jfOrderListIndex = value;
        },
        //保存下单默认地址
        saveAddressDefault(state,value){
            state.addressDefault = value;
        },
        //vue路由跳转后取消请求
        pushToken(state, value){
            state.cancelTokenArr.push(value.cancelToken);
        },
        clearToken({cancelTokenArr}){
            //console.log(cancelTokenArr);
            cancelTokenArr.forEach(item => {
                //console.log(item)
                item('路由跳转取消请求');
            });
            cancelTokenArr = [];
        }
    }
})
