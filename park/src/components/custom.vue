<template>
    <div class="qrCode" :style="{backgroundImage: 'url(' + bg + ')'}">
        <div class="qrcodeBox">
            <div class="qrcode">
                <img src="../assets/images2/customQrcode.jpg" alt="customQrcode">
            </div>
            <div class="txt">
                <p>长按识别二维码</p>
                <p>添加客服咨询</p>
            </div>
        </div>
        <div class="tel">
            <a href="tel:13735195038" class="callBtn">
                <img src="../assets/images2/customTelBg.png" alt="customTelBg">
            </a>
            <img src="../assets/images2/customBottom.png" alt="customBottom">
        </div>
    </div>
</template>

<script>
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "custom",
        mixins:[mixin],
        data(){
            return{
                bg:require('../assets/images2/customBg.jpg')
            }
        }
    }
</script>

<style scoped>
    .qrCode{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: no-repeat center center/100% 100%;
    }
    .qrcodeBox{
        width: 42vw;
    }
    .qrcodeBox .txt{
        text-align: center;
        color: #454545;
        font-weight: bold;
        font-size: 18px;
        margin-top: 13px;
        line-height: 20px;
    }
    .qrcodeBox img{
        width: 100%;
    }
    .tel{
        position: absolute;
        left: 50%;
        bottom: 6%;
        width: 68%;
        margin-left: -34%;
    }
    .tel img{
        width: 100%;
    }
    .callBtn{
        display: block;
        width: 88%;
        margin: 0 auto 15px;
    }
</style>
