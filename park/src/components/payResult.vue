<template>
    <div class="payResult">

        <!-- 成功失败 start-->
        <div class="success" v-if="isSuccess">
            <div class="t">
                <i class="weui-icon-success weui-icon_msg"></i>
                <p class="black ">支付成功</p>
                <div class="amount">{{price/100}}<span>元</span></div>
                <div class="tips">请在<span class="mainColor">15分钟内</span>驶离<span class="mainColor">停车场</span></div>
            </div>
            <div class="msg">
                <div class="item" @click="toRecordDetail">
                    <span>订单列表</span>
                    <span><img src="../assets/images/right.png" alt="right"></span>
                </div>
            </div>
            <div class="btns">
                <div @click="toIndex">返回首页</div>
            </div>
        </div>
        <div class="fail" v-else>
            <div class="t">
                <van-icon name="warning-o" size="70px" color="red"/>
                <p class="black">缴费失败</p>
                <p class="p"><span class="color">支付超时</span>，您本次支付的金额在两小时内退回，请点击下方按钮再次缴费</p>
            </div>
            <div class="btns">
                <div class="again">再次一次</div>
                <div class="back" @click="toIndex">返回停车首页</div>
            </div>
        </div>
        <!--成功失败 end-->

    </div>
</template>

<script>
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "payResult",
        mixins:[mixin],
        data(){
            return{
                tit: "订单结果",
                isSuccess:true,
                price:0,
            }
        },
        created(){
            let code = this.$route.query.resultCode;
            this.isSuccess = this.$route.query.resultCode==="200";
            this.price = this.$route.query.price;

        },
        methods:{
            //到首页
            toIndex(){
                this.$router.push('/parkingServer')
            },
            //到订单详情页
            toRecordDetail(){
                this.$router.push({
                    path:'/recordDetail',
                    query:{
                        id:"123456"
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .payResult{
        background-color: #fff;
        padding-bottom: 50px;
    }
    .weui-btn_primary{
        background-color: #ff8500;
    }
    .weui-btn_plain-primary{
        border: 1px solid #ff8500;
        color: #ff8500;
    }
    .t{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 15px;
    }
    .black{
        color: #000;
        margin: 15px 0 0;
        font-size: 16px;
    }
    .amount{
        font-size: 40px;
    }
    .amount span{
        font-size: 12px;
    }
    .p{
        margin-top: 15px;
    }
    .weui-icon-cancel{
        font-size: 80px;
    }
    .t p{
        text-align: center;
        color: #666;
    }
    .t p .color{
        color: red;
    }
    .btns{
        padding: 0 15px;
    }
    .tel{
        position: absolute;
        bottom: 20px;
        left: 0;
        width: 100%;
        line-height: 35px;
        text-align: center;
    }
    .tel a{
        text-decoration: underline;
        color: skyblue;
        margin-left: 5px;
    }
    .msg{
        padding: 0 15px;
        margin-bottom: 25px;
    }
    .msg .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-top: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
    }
    .msg .item img{
        width: 20px;
    }
</style>
