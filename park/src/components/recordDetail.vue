<template>
    <div class="recordDetail">
        <!--主体信息 start-->
        <template>
            <div class="mainMsg">
                <div class="parkingName">
                    <img src="../assets/images/parking.png" alt="parking">
                    <span>{{detail.park_name}}</span>
                </div>
                <div class="amount">
                    <div class="money">
                        <span class="num">{{detail.real_fee/100}}</span><span>元</span>
                    </div>
                    <div class="state">{{detail.status_text}}</div>
                </div>
            </div>
            <div class="itemMsg">
                <div class="item">
                    <span class="black">订单号</span>
                    <span>{{detail.order_id}}</span>
                </div>
                <div class="item">
                    <span class="black">车牌号</span>
                    <span>{{detail.car_number}}</span>
                </div>
                <div class="item">
                    <span class="black">总停车费</span>
                    <span>{{detail.total_fee/100}}元</span>
                </div>
                <div class="item">
                    <span class="black">停车券</span>
                    <span>-{{detail.discount_fee_coupon/100}}元</span>
                </div>
                <div class="item">
                    <span class="black">停车权益</span>
                    <span>-{{detail.discount_fee_benefit/100}}元</span>
                </div>
                <div class="item">
                    <span class="black">优惠总金额</span>
                    <span>-{{detail.discount_fee/100}}元</span>
                </div>
                <div class="item">
                    <span class="black">入场时间</span>
                    <span>{{detail.enter_time}}</span>
                </div>
                <div class="item">
                    <span class="black">停车时长</span>
                    <span>{{detail.chargeing_duration}}</span>
                </div>
                <div class="item">
                    <span class="black">订单创建时间</span>
                    <span>{{detail.order_time}}</span>
                </div>
                <div class="item" v-if="detail.status===0">
                    <span class="black">支付时间</span>
                    <span>{{detail.pay_time}}</span>
                </div>
            </div>
        </template>
        <!--主体信息 end-->

    </div>
</template>

<script>
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "recordDetail",
        mixins:[mixin],
        data(){
            return{
                detail:{},
            }
        },
        mounted() {
            /*let index = this.$route.query.index;
            //console.log(this.$route.query.index)
            if(sessionStorage.getItem('payRecord')){
                this.detail = JSON.parse(sessionStorage.getItem('payRecord'));
                //console.log(this.detail)
            }else{
                this.detail = this.$store.state.payRecord[index];
                //防止刷新后数据丢失，刷新前将数据临时保存在sessionStorage
                window.addEventListener('beforeunload',()=>{
                    sessionStorage.setItem('payRecord',JSON.stringify(this.detail))
                })
            }*/
            let obj = this.$route.query.info;
            this.detail = JSON.parse(obj);
            //console.log(this.detail);
        },
        beforeRouteLeave(to,from,next){
            to.meta.keepAlive = true;
            next();
        }
    }
</script>

<style scoped>
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
        justify-content: center;
        padding: 30px 0;
        width: 80%;
    }
    .parkingName img{
        width: 30px;
    }
    .parkingName span{
        font-size: 18px;
        margin-left: 5px;
        line-height: 24px;
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
</style>
