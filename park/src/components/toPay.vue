<template>
    <div class="toPay">
        <!--轮播 start-->
        <div class="banner">
            <banner-part
                :time="banner.interval"
                :bannerList="banner.items"
                :type="banner.type"
                :position="'CC-014'"
            ></banner-part>
        </div>
        <!--轮播 end-->

        <div class="outBanner">
            <div class="on">
                <span>应付金额</span>
                <span class="amount" v-if="!zeroAmount"
                    >￥{{ payObj.amount / 100 }}</span
                >
                <span class="amount" v-if="zeroAmount">￥0</span>
            </div>
            <div class="item">
                <span class="name">支付状态</span>
                <span>待支付</span>
            </div>
            <div class="item" v-if="!zeroAmount">
                <span class="name">支付订单</span>
                <span>{{ payObj.order_id }}</span>
            </div>
            <div class="item">
                <span class="name">订单类型</span>
                <span>停车费</span>
            </div>
        </div>

        <!--轮播 start-->
        <div class="banner">
            <banner-part
                :time="banner2.interval"
                :bannerList="banner2.items"
                :type="banner2.type"
                :position="'CC-015'"
            ></banner-part>
        </div>
        <!--轮播 end-->
        <button class="pay" @click="pay" v-if="browserType">立即支付</button>
        <button class="pay" @click="aliPay" v-else>立即支付</button>

        <van-popup
            v-model="showCoupon"
            class="couponBox"
            :close-on-click-overlay="false"
        >
            <div class="redBag">
                <van-image
                    :src="require('../assets/images/couponBg.png')"
                ></van-image>
                <div class="btn" @click="toCouponList">立即领取</div>
            </div>
            <div class="close">
                <div class="icon" @click="closeRedBag">
                    <van-icon name="cross" color="#fff" size="20" />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
//import { wxOrderApi,getBannerApi } from '../request/api';
//import wx from 'weixin-js-sdk'
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "toPay",
    mixins: [mixin],
    data() {
        return {
            banner: {},
            banner2: {},
            browserType: true,
            loadingShow: true,
            radio: "1",
            payObj: {},
            zeroAmount: false,
            payType: 1, //1微信  2支付宝
            orderStr: "",
            queryType: "",
            carNum: "",
            showCoupon: false //显示红包
        };
    },
    created() {
        this.carNum = this.$route.query.carNum;
        if (this.$browserType.browserType() === "zfb") {
            this.browserType = false;
            this.payType = 2;
        } else {
            this.browserType = true;
            this.payType = 1;
        }
    },
    mounted() {
        this.getData();
        this.getBanner();
    },
    methods: {
        //获取广告位
        getBanner() {
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-014"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-015"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner2 = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //创建微信订单
        getData() {
            let order_id = this.$route.query.orderId;
            this.$apis
                .wxOrderApi({
                    order_id,
                    pay_type: this.payType
                })
                .then(res => {
                    if (res.code === 200) {
                        this.queryType = res.data.query_type;
                        if (Object.keys(res.data).length === 1) {
                            this.zeroAmount = true;
                        } else {
                            if (this.payType === 1) {
                                this.payObj = res.data;
                            } else if (this.payType === 2) {
                                this.payObj = res.data;
                                this.orderStr = res.data.trade_str;
                            }
                        }
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        pay() {
            if (this.zeroAmount) {
                this.$toast.success({
                    message: "支付成功",
                    duration: 1200
                });
                this.getList();
            } else {
                this.wxPay();
            }
        },
        //发起微信支付
        wxPay() {
            let that = this;
            this.$wxMethod.wxPay(
                {
                    timestamp: that.payObj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: that.payObj.nonceStr, // 支付签名随机串，不长于 32 位
                    package: that.payObj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: that.payObj.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: that.payObj.paySign // 支付签名
                },
                result => {
                    if (result.errMsg === "chooseWXPay:ok") {
                        that.getList();
                    } else {
                        that.$toast.fail("请重新尝试");
                    }
                },
                () => {
                    that.$toast.fail("已取消支付");
                }
            );
        },
        //支付宝支付
        aliPay() {
            document.write(this.orderStr);
        },
        //获取券列表
        getList() {
            this.$apis
                .couponListApi({
                    get_way: 2
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.data.length) {
                            this.showCoupon = true;
                        } else {
                            this.leave();
                        }
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //离开
        leave() {
            if (this.queryType === 1) {
                this.$router.replace({
                    path: "/payRecord"
                });
            } else {
                this.$router.replace({
                    path: "/findArrears",
                    query: {
                        carNum: this.carNum
                    }
                });
            }
        },
        //关闭红包
        closeRedBag() {
            this.showCoupon = false;
            this.leave();
        },
        //去券列表
        toCouponList() {
            this.$router.push({
                path: "/couponList",
                query: {
                    queryType: this.queryType,
                    carNum: this.carNum
                }
            });
        }
    }
};
</script>

<style scoped>
.toPay {
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.on {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 15px;
    color: #666;
    border-bottom: 1px solid #f6f6f6;
}
.on .amount {
    font-size: 30px;
    color: #333;
    margin-top: 5px;
}
.item {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #f6f6f6;
    background-color: #fff;
    color: #666;
}
.tit {
    padding: 12px 15px;
}
.wechatpay {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #fff;
}
.wechatpay .l {
    display: flex;
    align-items: center;
}
.wechatpay .l img {
    width: 30px;
    margin-right: 5px;
}
.pay {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    line-height: 50px;
    border-radius: 0;
    background-color: #ff8500;
    color: #fff;
    outline: none;
    border: none;
}
.lico {
    display: flex;
    align-items: center;
}
.lico img {
    width: 30px;
    margin-right: 3px;
}
.loading {
    padding-top: 150px;
}
.couponBox {
    background-color: transparent;
}
.redBag {
    position: relative;
    width: 60vw;
}
.redBag .btn {
    position: absolute;
    left: 50%;
    bottom: 35px;
    margin-left: -86px;
    width: 171px;
    height: 38px;
    background: rgba(251, 211, 162, 1);
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    line-height: 38px;
    color: rgba(240, 55, 55, 1);
}
.couponBox .close {
    text-align: center;
    margin-top: 20px;
}
.couponBox .close .icon {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    border-radius: 100%;
}
</style>
