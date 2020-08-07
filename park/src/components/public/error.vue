<template>
    <div class="error">
        <van-icon name="close" size="60px"/>
        <p class="txt">服务错误，请稍后再试</p>
        <van-button type="primary" @click="$router.go(-2)">返回上一页</van-button>
    </div>
</template>

<script>
    import mixin from '../../utils/mixin'; // 引入mixin文件
    export default {
        name: "error",
        mixins:[mixin],
    }
</script>

<style scoped>
    .error{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9999999;
        background-color: #aaa;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .txt{
        margin: 10px 0 20px;
    }
</style>
