<template>
    <div class="arrearsDetail">
        <!--轮播 start-->
        <div class="banner">
            <banner-part
                :time="banner.interval"
                :bannerList="banner.items"
                :type="banner.type"
                :position="'CC-012'"
            ></banner-part>
        </div>
        <!--轮播 end-->

        <div class="outBanner">
            <div class="result" v-if="result">
                <div class="mainMsg">
                    <div class="parkingName">
                        <img src="../assets/images/parking.png" alt="parking" />
                        <span>{{ result.park_name }}</span>
                    </div>
                    <div class="amount">
                        <div class="money">
                            <span class="num">{{
                                result.arrears_amount / 100
                            }}</span
                            ><span>元</span>
                        </div>
                        <div class="state">欠费金额</div>
                    </div>
                </div>
                <div class="txt">停车信息</div>
                <div class="itemMsg">
                    <div class="item">
                        <span class="black">车牌号</span>
                        <span>{{ result.car_number }}</span>
                    </div>
                    <div class="item">
                        <span class="black">入场时间</span>
                        <span>{{ result.in_time }}</span>
                    </div>
                    <div class="item">
                        <span class="black">出场时间</span>
                        <span>{{ result.out_time }}</span>
                    </div>
                    <div class="item">
                        <span class="black">停车位</span>
                        <span>{{ result.parking_no }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--轮播 start-->
        <div class="banner">
            <banner-part
                :time="banner2.interval"
                :bannerList="banner2.items"
                :type="banner2.type"
                :position="'CC-013'"
            ></banner-part>
        </div>
        <!--轮播 end-->

        <div class="fixedBottom">
            <div class="btn">
                <div class="howMuch">
                    应付金额：<span class="mainColor">{{
                        result.arrears_amount / 100
                    }}</span
                    >元
                </div>
                <div class="toPay" @click="createOrder">立即支付</div>
            </div>
        </div>
    </div>
</template>

<script>
//import { queryOweApi,makeOweOrderApi,getBannerApi } from '../request/api';
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "arrearsDetail",
    mixins: [mixin],
    data() {
        return {
            banner: {},
            banner2: {},
            carNum: "",
            resultList: [],
            result: {},
            guid: "",
            loading: null
        };
    },
    mounted() {
        this.getBanner();
        let data = this.$route.query.data;
        /*if(this.$store.state.arrearsList.length>0){
                this.resultList = this.$store.state.arrearsList;
                this.result = this.$store.state.arrearsList[index];
                this.guid = this.$store.state.arrearsList[index].guid;
                this.loading.clear();
            }else{
                this.getResult();
            }*/
        this.result = JSON.parse(data);
        this.guid = this.result.guid;
    },
    methods: {
        //获取广告位
        getBanner() {
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-012"
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
                    position: "CC-013"
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
        //获取记录
        /*getResult() {
            let carNum = this.$route.query.carNum;
            let index = this.$route.query.index;
            this.$apis
                .queryOweApi({
                    car_number: carNum
                })
                .then(res => {
                    this.loading.clear();
                    if (res.code === 200) {
                        //console.log(res);
                        this.resultList = res.data;
                        this.result = this.resultList[index];
                        this.guid = this.resultList[index].guid;
                        this.$store.commit("saveArrearsList", res.data);
                        //console.log(this.guid);
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
                .catch(() => {
                    this.loading.clear();
                });
        },*/
        //创建订单
        createOrder() {
            //console.log(this.guid);

            /*this.$router.push({
                path: "/test"
            });*/
            this.$apis
                .makeOweOrderApi({
                    car_number: this.result.car_number,
                    park_number: this.result.parking_no,
                    total_fee: this.result.arrears_amount,
                    guid: this.guid,
                    park_id: this.result.park_id,
                    enter_time: this.result.in_time,
                    pay_type: 1,
                    out_time: this.result.out_time
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data)
                        //this.$toast.success("订单已提交");
                        this.$router.push({
                            path: "/toPay",
                            query: {
                                orderId: res.data.order_id,
                                carNum: res.data.car_number
                            }
                        });
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        }
    }
};
</script>

<style scoped>
.arrearsDetail {
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.mainMsg {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding-bottom: 15px;
    border-bottom: 1px solid #f4f4f4;
}
.parkingName {
    display: flex;
    align-items: center;
    padding: 15px 0;
    max-width: 85%;
}
.parkingName img {
    width: 30px;
}
.parkingName span {
    font-size: 18px;
    margin-left: 10px;
    line-height: 20px;
}
.money {
    text-align: center;
}
.money .num {
    font-size: 30px;
    line-height: 30px;
    font-weight: bold;
}
.state {
    text-align: center;
}
.txt {
    padding: 5px 15px;
}
.itemMsg {
    background-color: #fff;
    padding: 0 15px;
}
.itemMsg .item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #f4f4f4;
    color: #666;
    box-sizing: border-box;
}
.itemMsg .item:last-child {
    border: none;
}
.itemMsg .item .black {
    color: #000;
}
.itemMsg .item .black .li {
    color: #ff8500;
    font-size: 12px;
}
.itemMsg .item .black .li + .li {
    margin-left: 15px;
}
.fixedBottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 99;
}
.fixedBottom .btn {
    display: flex;
}
.fixedBottom .btn > div {
    width: 50%;
}
.fixedBottom .btn .howMuch {
    line-height: 50px;
    padding-left: 15px;
    box-sizing: border-box;
    background-color: #fff;
}
.fixedBottom .btn .toPay {
    text-align: center;
    line-height: 50px;
    background-color: #ff8500;
    color: #fff;
}
</style>
