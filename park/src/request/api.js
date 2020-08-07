/**Created by yiqu on 2019/10/8*/
import { get, post, upload } from "./http";

//export const isSubscribeApi = data => post('/user/issubscribe', data);//判断是否关注公众号

export const getTokenApi = code => get("/token", code); //获取token

//export const reFreshTokenApi = code => get("/refreshtoken", code); //刷新token

export const getJsSdkApi = data => post("/jssdksign", data); //获取jssdk

export const getBannerApi = data => post("/slide/banners", data); //获取轮播

export const getNoticesApi = data => post("/slide/notices", data); //获取公告

export const allNoticesApi = data => post("/slide/allnotices", data); //获取所有公告

export const userInfoApi = data => post("/user/info", data); //获取我的信息

export const sendSMSApi = data => post("/user/sendsms", data); //发送验证码

export const myCouponApi = data => post("/coupon/mylist", data); //获取我的优惠券

export const couponDetailApi = data => post("/coupon/detail", data); //优惠券详情

export const parkingFeeApi = data => post("/park/queryfee", data); //查询停车信息

export const makeOrderApi = data => post("/park/makeorder", data); //提交商户订单

export const makeOweOrderApi = data => post("/park/makeoweorder", data); //提交商户欠费补缴订单

export const cancelOrderApi = data => post("/park/cancelorder", data); //取消商户订单

export const wxOrderApi = data => post("/park/unifiedorder", data); //提交微信订单

export const parkingListApi = data => post("/park/parklist", data); //获取停车场列表

export const queryOweApi = data => post("/park/queryowe", data); //获取欠费记录列表

export const payRecordApi = data => post("/park/payrecord", data); //获取支付列表

export const myCarApi = data => post("/park/car", data); //获取我的车辆

export const delCarApi = data => post("/park/delcar", data); //删除车辆

export const bindCarApi = data => post("/park/bindcar", data); //绑定车辆

export const searchParkingApi = data => post("/park/querypark", data); //搜索停车场

export const benefitApi = data => post("/benefit/info", data); //会员权益

export const parkingDetailApi = data => post("/park/lotdetail", data); //停车场详情

export const pageDataApi = data => post("/page/record", data); //广告页点击数，停留数

export const qrcodeApi = data => post("/qrcode", data); //带参二维码

export const couponListApi = data => post("/coupon/list", data); //券列表

export const getCouponApi = data => post("/coupon/get", data); //领取优惠券(单个)

export const batchgetApi = data => post("/coupon/batchget", data); //领取优惠券（批量）

export const getInvoiceApi = data => post("/park/getinvoice", data); //开票列表

export const queryInvoiceApi = data => post("/park/queryinvoice", data); //开票结果

export const applyInvoiceApi = data => post("/park/applyinvoice", data); //提交开票表单
