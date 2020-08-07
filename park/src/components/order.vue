<template>
    <div class="order paddingBottom">

        <div class="topMsg">
            <van-icon name="info-o" />
            <span>温馨提示：请您在{{minute}}分{{second}}秒内去支付，逾时将取消订单</span>
        </div>

        <!--主体信息 start-->
        <div class="mainMsg">
            <div class="parkingName">
                <img src="../assets/images/parking.png" alt="parking">
                <span>{{park_name}}</span>
            </div>
            <div class="amount">
                <div class="money">
                    <span class="num">{{real_fee/100}}</span><span>元</span>
                </div>
                <div class="state">待支付</div>
            </div>
        </div>
        <div class="itemMsg">
            <div class="item">
                <span class="black">车牌号</span>
                <span>{{car_number}}</span>
            </div>
            <div class="item">
                <span class="black">总停车费用</span>
                <span>{{total_fee/100}}元</span>
            </div>
            <div class="item" v-if="browserType">
                <span class="black">停车券</span>
                <span>-{{discount_fee_coupon/100}}元</span>
            </div>
            <div class="item" v-if="browserType">
                <span class="black">停车权益</span>
                <span>-{{discount_fee_benefit/100}}元</span>
            </div>
            <div class="item" v-if="browserType">
                <span class="black">优惠总金额</span>
                <span>-{{discount_fee/100}}元</span>
            </div>
            <div class="item">
                <span class="black">订单创建时间</span>
                <span>{{create_time}}</span>
            </div>
            <div class="item">
                <span class="black">入场时间</span>
                <span>{{enter_time}}</span>
            </div>
        </div>
        <div class="bottom">
            <div class="topMsg">
                <van-icon name="info-o" />
                <span>请于付款后尽快离场，超时将加收停车费</span>
            </div>
            <div class="btn">
                <div class="cancel" @click="cancel">取消订单</div>
                <div class="pay" @click="toPay">立即付款</div>
            </div>
        </div>
        <!--主体信息 end-->

    </div>
</template>

<script>
    //import { cancelOrderApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "order",
        mixins:[mixin],
        data(){
            return{
                browserType:true,
                minute:14,
                second:59,
                now:900,
                coupon:'',
                park_name:'',
                real_fee:'',
                car_number:'',
                total_fee:'',
                discount_fee:'',
                discount_fee_benefit:'',
                discount_fee_coupon:'',
                enter_time:'',
                create_time:'',
                expire_time:'',
                order_id:'',
                park_type:'',
                loading:null
            }
        },
        watch:{
            now(){
                this.minute = Math.floor(this.now/60);
                this.second = this.now - Math.floor(this.now/60)*60;
            }
        },
        created(){
            if(this.$browserType.browserType()==='zfb'){
                this.browserType = false;
            }else{
                this.browserType = true;
            }
        },
        mounted(){
            //console.log(this.$route.query.order);
            this.park_name = this.$route.query.park_name;
            this.real_fee = this.$route.query.real_fee;
            this.car_number = this.$route.query.car_number;
            this.total_fee = this.$route.query.total_fee;
            this.discount_fee = this.$route.query.discount_fee;
            this.discount_fee_benefit = this.$route.query.discount_fee_benefit;
            this.discount_fee_coupon = this.$route.query.discount_fee_coupon;
            this.enter_time = this.$route.query.enter_time;
            this.create_time = this.$route.query.create_time;
            this.expire_time = this.$route.query.expire_time;
            this.order_id = this.$route.query.order_id;
            this.park_type = this.$route.query.park_type;
            //console.log(this.create_time)

            if((new Date(this.expire_time) - new Date()) <=0){
                //console.log((new Date() -  new Date(this.create_time))/1000/60);
                this.$toast.fail("支付超时，订单自动取消");
                setTimeout(()=>{
                    this.cancel();
                },1000);
            }else{
                let nowTimeChuo = Number((new Date().getTime()+'').substr(0,10));
                let expireTimeChuo = Number((new Date(this.expire_time.replace(/-/g,'/')).getTime()+'').substr(0,10));
                let howMiao = expireTimeChuo - nowTimeChuo;
                this.now = howMiao;
                this.minute = Math.floor(howMiao/60);
                this.second = howMiao - (Math.floor(howMiao/60)*60);

                let times = setInterval(()=>{
                    if(this.now <= 0){
                        clearInterval(times);
                        this.now = 0;
                        this.minute = 0;
                        this.second = 0;
                        this.$toast.fail("支付超时，订单自动取消");
                        setTimeout(()=>{
                            this.cancel();
                        },1000);
                    }else{
                        this.now = (this.minute*60 + this.second ) - 1;
                    }
                },1000);

            }
        },
        methods:{
            //取消订单
            cancel(){
                this.loading = this.$toast.loading({
                    duration: 0,
                    message: '订单取消中',
                    forbidClick: true
                });
                this.$apis.cancelOrderApi({
                    order_id:this.order_id
                }).then((res)=>{
                    this.loading.clear();
                    if(res.code===200){
                        //console.log(res);
                        let that = this;
                        this.$store.commit('savePayRecord',[]);
                        this.$toast.success({
                            message: "已取消订单",
                            duration: 1200,
                            forbidClick: true,
                            onClose(){
                                that.$router.replace({
                                    path:'/parkingServer'
                                });
                            }
                        });
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
            //到支付页
            toPay(){
                this.$router.push({
                    path:'/toPay',
                    query:{
                        orderId:this.order_id
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .topMsg{
        padding: 5px 15px;
        display: flex;
        align-items: center;
        background-color: #f6dec2;
        color: #ff8500;
    }
    .topMsg span{
        line-height: 16px;
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
        color: skyblue;
    }
    .itemMsg{
        background-color: #fff;
        padding: 0 15px;
    }
    .itemMsg .item{
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        color: #666;
        box-sizing: border-box;
    }
    .itemMsg .item:last-child{
        border-top: 1px solid #f4f4f4;
    }
    .itemMsg .item .black{
        color: #000;
    }
    .bottom{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }
    .bottom .btn{
        display: flex;
    }
    .bottom .btn > div{
        width: 50%;
        text-align: center;
        line-height: 50px;
    }
    .bottom .btn .cancel{
        background-color: #fff;
        color: #ff8500;
    }
    .bottom .btn .pay{
        background-color: #ff8500;
        color: #fff;
    }
</style>
