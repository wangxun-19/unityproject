<template>
    <div class="findResult paddingBottom">
            <div class="noErr">
                <div class="result" v-if="result && result.real_fee === 0">
                    <div class="topMsg">
                        <van-icon name="clock-o" />
                        <span>尚未进入计费时间范畴，请直接开车离开场</span>
                    </div>
                    <div class="mainMsg">
                        <div class="parkingName">
                            <img src="../assets/images/parking.png" alt="parking">
                            <span>{{result.park_name}}</span>
                        </div>
                        <div class="amount">
                            <div class="money">
                                <span class="num">0.00</span><span>元</span>
                            </div>
                            <div class="state">待付金额</div>
                        </div>
                    </div>
                    <div class="txt">停车信息</div>
                    <div class="itemMsg">
                        <div class="item">
                            <span class="black">车牌号</span>
                            <span>{{result.car_number}}</span>
                        </div>
                        <div class="item">
                            <span class="black">入场时间</span>
                            <span>{{result.enter_time}}</span>
                        </div>
                        <div class="item">
                            <span class="black">停车时长</span>
                            <span>{{result.park_duration}}</span>
                        </div>
                    </div>
                </div>
                <div class="result" v-else-if="result && result.real_fee > 0">
                    <div class="mainMsg">
                        <div class="parkingName">
                            <img src="../assets/images/parking.png" alt="parking">
                            <span>{{result.park_name}}</span>
                        </div>
                        <div class="amount">
                            <div class="money">
                                <span class="num">{{result.real_fee/100}}</span><span>元</span>
                            </div>
                            <div class="state">待付金额</div>
                        </div>
                    </div>
                    <div class="txt bgc" v-if="browserType">线下优惠描述</div>
                    <div class="txt" v-if="browserType">优惠方式</div>
                    <div class="itemMsg" v-if="browserType">
                        <div class="item">
                            <div class="black">
                                <p>商场停车券</p>
                                <p v-if="checked.length>0">
                                    <span class="li" v-for="(item,index) in checked" :key="index">{{item.coupon_info.amount/100}}元{{item.coupon_info.name}}</span>
                                </p>
                            </div>
                            <span v-if="coupons.length === 0">无可用券</span>
                            <div class="coupons" v-else @click="showList">
                                <span class="redCircle" v-if="checked.length === 0">●</span><span>{{coupons.length}}张券可用</span>
                                <img src="../assets/images/right.png" alt="right">
                            </div>
                        </div>
                        <div class="item" v-if="vip.is_used===0">
                            <span class="black">{{vip.name}}-{{vip.desc}}</span>
                            <span class="vipColor">-{{vip.amount/100}}元</span>
                        </div>
                        <div class="item">
                            <span class="black">优惠总金额</span>
                            <span class="mainColor">-{{discount/100}}元</span>
                        </div>
                    </div>
                    <div class="txt">停车信息</div>
                    <div class="itemMsg">
                        <div class="item">
                            <span class="black">车牌号</span>
                            <span>{{result.car_number}}</span>
                        </div>
                        <div class="item">
                            <span class="black">入场时间</span>
                            <span>{{result.enter_time}}</span>
                        </div>
                        <div class="item">
                            <span class="black">停车时长</span>
                            <span>{{result.park_duration}}</span>
                        </div>
                    </div>
                    <div class="fixedBottom">
                        <div class="topMsg">
                            <van-icon name="info-o" />
                            <span>请于付款后尽快离场，超时将加收停车费</span>
                        </div>
                        <div class="btn">
                            <div class="howMuch">应付金额：<span class="mainColor">{{realPay}}</span>元</div>
                            <div class="toPay" @click="createOrder">立即支付</div>
                        </div>
                    </div>
                    <choose-coupons v-show="showHide" @hide="hide" :coupons="coupons" @checked="getChoose"></choose-coupons>
                </div>

            </div>
        <div class="not" v-if="noFind">
            <banner-part
                :time="banner.interval"
                :bannerList="banner.items"
                :type="banner.type"
                :position="'CC-027'"
            ></banner-part>
            <div class="error">
                <van-icon name="warning-o" size="60" color="#ff8500" />
                <van-image :src="require('../assets/images/noMsg.png')" width="190"></van-image>
            </div>
            <div class="btnBox">
                <van-button type="info" @click="findPayBack" color="#ff8500">查询历史欠费</van-button>
                <van-button type="primary" @click="$router.go(-1)">返回上一页</van-button>
            </div>
            <banner-part
                class="banner2"
                :time="banner2.interval"
                :bannerList="banner2.items"
                :type="banner2.type"
                :position="'CC-028'"
            ></banner-part>
        </div>
    </div>
</template>

<script>
    //import { parkingFeeApi,myCouponApi,makeOrderApi,benefitApi } from '../request/api';
    import chooseCoupons from './chooseCoupons'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "findResult",
        mixins:[mixin],
        data(){
            return{
                browserType:true,
                parkId:'',
                result:{},
                coupons:[],
                showHide:false,
                checked:[],
                noFind:true,
                vip:{},
                loading:null,
                loading2:null,
                banner:{},
                banner2:{}
            }
        },
        components:{
            chooseCoupons
        },
        computed:{
            discount(){
                let num = 0;
                this.checked.forEach(item=>{
                    num+=Number(item.coupon_info.amount)
                });
                if(this.vip.is_used===0){
                    num = num+this.vip.amount;
                }
                return num;
            },
            realPay(){
                return this.result.real_fee < this.discount?0:(this.result.real_fee-this.discount)/100;
            }
        },
        created(){
            this.loading = this.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true
            });
            //console.log(this.$browserType)
            if(this.$browserType.browserType()==='zfb'){
                this.browserType = false;
            }else{
                this.browserType = true;
            }

        },
        mounted(){
            this.getCarMsg();
            this.getBanner();
            //console.log(carNum);
        },
        methods:{
            //获取广告
            getBanner(){
                this.$apis
                    .getBannerApi({
                        platform: 1,
                        position: "CC-027"
                    })
                    .then(res => {
                        if (res.code === 200) {
                            //console.log(res..data);
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
                        position: "CC-028"
                    })
                    .then(res => {
                        if (res.code === 200) {
                            //console.log(res..data);
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
            //显示停车券选择框
            showList(){
                this.showHide = true;
            },
            //隐藏停车券选择框
            hide(bool){
                this.showHide = bool;
            },
            //确认选择
            getChoose(checked){
                this.checked = checked;
            },
            //判断会员权益是否可用
            getVip(){
                this.$apis.benefitApi({
                    type:1001
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res)
                        this.vip = res.data;
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //获取停车信息
            getCarMsg(){
                let carNum = this.$route.query.carNum;
                this.$apis.parkingFeeApi({
                    car_number:carNum,
                    is_bind_judge:0
                }).then(res=>{
                    this.loading.clear();
                    if(res.code===200){
                        //console.log(res);
                        if(res.data.length===0){
                            this.noFind = true;
                            return false;
                        }
                        this.result = res.data;
                        this.parkId = res.data.park_id;
                        if(res.data.real_fee>0 && this.browserType){
                            this.getCoupon();
                            this.getVip();
                        }
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                }).catch(()=>{
                    this.loading.clear()
                })
            },
            //获取停车券信息
            getCoupon(){
                let that = this;
                this.$apis.myCouponApi({
                    type:3,
                    status: 0
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res.data);
                        that.coupons = res.data;
                        res.data.forEach((item,index)=>{
                            if(item.coupon_info.use_limit_type===2){
                                if(item.coupon_info.use_value_ids.indexOf(that.parkId)===-1){
                                    //console.log(item.coupon_info.use_value_ids)
                                    //console.log(that.parkId)
                                    //console.log(index)
                                    that.coupons.splice(index,1)
                                }
                            }
                        })
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //创建订单
            createOrder(){
                this.loading2 = this.$toast.loading({
                    duration: 0,
                    message: '订单提交中',
                    forbidClick: true
                });
                let str="";
                if(this.checked.length>0){
                    if(this.checked.length===1){
                        str = this.checked[0]['coupon_id'];
                    }
                    if(this.checked.length===2){
                        str = this.checked[0]['coupon_id']+','+this.checked[1]['coupon_id'];
                    }
                }
                let obj={};
                if(this.browserType){
                    if(this.vip.is_used){
                        obj = {
                            car_number:this.result.car_number,
                            pay_type:1,
                            coupon_id:str,
                            total_fee:this.result.real_fee,
                            benefit_type:""
                        }
                    }else{
                        obj = {
                            car_number:this.result.car_number,
                            pay_type:1,
                            coupon_id:str,
                            total_fee:this.result.real_fee,
                            benefit_type:1001
                        }
                    }
                }else{
                    obj = {
                        car_number:this.result.car_number,
                        total_fee:this.result.real_fee,
                        pay_type:2,
                        benefit_type:"",
                        coupon_id:""
                    }
                }
                //console.log(obj);
                this.$apis.makeOrderApi(obj).then(res=>{
                    this.loading2.clear();
                    if(res.code===200){
                        let that = this;
                        //console.log(res)
                        that.$router.replace({
                            path:'/toPay',
                            query:{
                                orderId: res.data.order_id
                            }
                        })
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })

            },
            //查询历史欠费
            findPayBack(){
                let carNum = this.$route.query.carNum;
                this.$router.push({
                    path:'/findArrears',
                    query:{
                        carNum
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .not{
        text-align: center;
    }
    .topMsg{
        padding: 5px 15px;
        display: flex;
        align-items: center;
        background-color: #f6dec2;
        color: #ff8500;
    }
    .topMsg span{
        line-height: 16px;
        margin-left: 5px;
    }
    .mainMsg{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        padding-bottom: 30px;
        border-bottom: 1px solid #f4f4f4;
    }
    .parkingName{
        display: flex;
        align-items: center;
        padding: 30px 0;
        max-width: 80%;
    }
    .parkingName img{
        width: 30px;
    }
    .parkingName span{
        font-size: 20px;
        margin-left: 10px;
    }
    .money{
        text-align: center;
    }
    .money .num{
        font-size: 30px;
        line-height: 30px;
        font-weight: bold;
    }
    .state{
        text-align: center;
    }
    .txt{
        padding: 8px 15px;
    }
    .bgc{
        background-color: #fff;
        border-bottom: 1px solid #f4f4f4;
    }
    .itemMsg{
        background-color: #fff;
        padding: 0 15px;
    }
    .itemMsg .item{
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f4f4f4;
        color: #666;
        box-sizing: border-box;
    }
    .itemMsg .item:last-child{
        border: none;
    }
    .itemMsg .item .black{
        color: #000;
    }
    .itemMsg .item .black .li{
        color: #ff8500;
        font-size: 12px;
    }
    .itemMsg .item .black .li + .li{
        margin-left: 15px;
    }
    .fixedBottom{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 99;
    }
    .fixedBottom .btn{
        display: flex;
    }
    .fixedBottom .btn > div{
        width: 50%;
    }
    .fixedBottom .btn .howMuch{
        line-height: 50px;
        padding-left: 15px;
        box-sizing: border-box;
        background-color: #fff;
    }
    .fixedBottom .btn .toPay{
        text-align: center;
        line-height: 50px;
        background-color: #ff8500;
        color: #fff;
    }
    .coupons{
        display: flex;
        align-items: center;
    }
    .coupons img{
        width: 16px;
        margin-left: 3px;
    }
    .redCircle{
        color: red;
    }
    .vipColor{
        color: red;
    }
    .error{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
    }
    .error span{
        display: block;
        margin-top: 10px;
        font-size: 16px;
        color: #444;
        width: 60%;
    }

    @media  screen and (min-width:0px) and (max-width: 290px) {
        .btnBox{
            margin-bottom: 60px;
        }
        .btnBox button{
            width: 120px;
            font-size: 13px;
        }
        .btnBox button + button{
            margin-left: 14px;
        }
    }

    @media  screen and (min-width:290px) and (max-width: 320px) {
        .btnBox{
            margin-bottom: 60px;
        }
        .btnBox button{
            width: 120px;
            font-size: 14px;
        }
        .btnBox button + button{
            margin-left: 15px;
        }
    }

    @media screen and (min-width: 320px) and (max-width: 414px) {
        .btnBox{
            margin-bottom: 30px;
        }
        .btnBox button{
            width: 120px;
        }
        .btnBox button + button{
            margin-left: 20px;
        }
    }

    @media screen and (min-width: 414px) and (max-width: 750px) {
        .btnBox{
            margin-bottom: 30px;
        }
        .btnBox button{
            width: 140px;
        }
        .btnBox button + button{
            margin-left: 20px;
        }
    }

    @media screen and (min-width: 750px) and (max-width: 1024px) {
        .btnBox{
            margin-bottom: 30px;
        }
        .btnBox button{
            width: 300px;
        }
        .btnBox button + button{
            margin-left: 40px;
        }
    }

    @media screen and (min-width: 1024px){
        .btnBox{
            margin-bottom: 30px;
        }
        .btnBox button{
            width: 300px;
        }
        .btnBox button + button{
            margin-left: 40px;
        }
    }
    /*.btnBox{*/
    /*    margin-bottom: 30px;*/
    /*}*/
    /*.btnBox button{*/
    /*    width: 120px;*/
    /*}*/
    /*.btnBox button + button{*/
    /*    margin-left: 60px;*/
    /*}*/
    .banner2{
        position:fixed;
        bottom:0;
        left: 0;
        width:100%;
    }
</style>
