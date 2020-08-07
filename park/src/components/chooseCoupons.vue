<template>
    <div class="chooseCoupons">
        <div class="t" @click="hide"></div>
        <div class="b">
            <div class="top">
                <h3>选择停车券</h3>
                <p>每次限用一张</p>
            </div>
            <div class="couponsList">
                <van-checkbox-group v-model="checked" :max="1">
                    <van-checkbox :name="item" v-for="(item,index) in coupons" :key="index">
                        <p>{{item.coupon_info.name}} 立减{{item.coupon_info.amount/100}}元</p>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="bottom">
                <div class="topMsg">
                    <span>您本次剩余可用停车券{{1-checked.length}}张</span>
                </div>
                <div class="btn" @click="confirm">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "chooseCoupons",
        props:['coupons'],
        data(){
            return{
                checked:[]
            }
        },
        methods:{
            //隐藏选择框
            hide(){
                this.$emit('hide',false)
            },
            //确认选择
            confirm(){
                this.hide();
                this.$emit("checked",this.checked)
            }
        }
    }
</script>

<style scoped>
    .chooseCoupons{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        background-color: rgba(0,0,0,.8);
        display: flex;
        flex-direction: column;
    }
    .chooseCoupons .t{
        height: 40%;
    }
    .chooseCoupons .b{
        flex: 1;
        height: 60%;
        background-color: #f4f4f4;
    }
    .chooseCoupons .b .top{
        text-align: center;
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #fff;
        margin-bottom: 8px;
    }
    .couponsList{
        height: calc( 100% - 82px - 58px );
        overflow-y: scroll;
    }
    .van-checkbox-group{
        padding: 15px;
        background-color: #fff;
    }
    .van-checkbox{
        padding: 5px 0;
    }
    .bottom{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .topMsg{
        padding: 5px 15px;
        display: flex;
        align-items: center;
        background-color: #f6dec2;
        color: #ff8500;
    }
    .btn{
        background-color: #ff8500;
        color: #fff;
        text-align: center;
        line-height: 50px;
    }
</style>
