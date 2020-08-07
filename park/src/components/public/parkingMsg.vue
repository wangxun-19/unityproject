<template>
    <div class="ParkingMsg">
        <div class="t">
            <div class="tt">
                <div class="l">
                    <img :src="ico" alt="ico"/>
                    <span>{{msg.name}}</span>
                </div>
                <div class="r">
                    <span>{{msg.distance}}m</span>
                    <img src="../../assets/images/right.png" alt="ico"/>
                </div>
            </div>
            <div class="bb">
                空车位：<span>{{msg.remain==-1?'未知':msg.remain}}</span>  总车位：{{msg.total}}
            </div>
        </div>
        <div class="b">
            <div class="l" @click="route(msg)">
                <img src="../../assets/images/redit2.png" alt="ico"/>
                <span>路线</span>
            </div>
            <div class="r" @click="navigation(msg.position,msg.name)">
                <img src="../../assets/images/redit.png" alt="ico"/>
                <span>导航</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ParkingMsg",
        props:['msg'],
        data(){
            return{
                ico:''
            }
        },
        methods:{
            navigation(position,name){
                this.$emit('navigation',position,name)
            },
            route(msg){
                this.$emit('route',msg)
            }
        },
        mounted() {
            if(this.msg.state){
                this.ico = require('../../assets/images/more_ico.png');
            }else{
                this.ico = require('../../assets/images/full_ico.png');
            }
        },
        updated() {
            if(this.msg.state){
                this.ico = require('../../assets/images/more_ico.png');
            }else{
                this.ico = require('../../assets/images/full_ico.png');
            }
        }
    }
</script>

<style scoped>
    .ParkingMsg{
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 10px;
        margin: auto;
        background-color: #fff;
    }
    .ParkingMsg .t{
        padding: 15px;
    }
    .ParkingMsg .tt{
        display: flex;
        justify-content: space-between;
        padding-bottom: 7px;
    }
    .ParkingMsg .tt .l{
        display: flex;
        align-items: center;
        color: #000;
        font-size: 16px;
    }
    .ParkingMsg .tt .l img{
        width: 20px;
        margin-right: 5px;
    }
    .ParkingMsg .tt .r{
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #999;
    }
    .ParkingMsg .tt .r img{
        width: 17px;
        margin-left: 5px;
    }
    .ParkingMsg .bb{
        padding-top: 7px;
        color: #666;
    }
    .ParkingMsg .bb text{
        color: #ff8500;
        margin-right: 10px;
    }
    .ParkingMsg .b{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #f2f2f2;
        padding: 12px 0;
        color: #484848;
    }
    .ParkingMsg .b > div{
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ParkingMsg .b .l{
        border-right: 1px solid #f4f4f4;
    }
    .ParkingMsg .b img{
        width: 20px;
        margin-right: 5px;
    }
</style>
