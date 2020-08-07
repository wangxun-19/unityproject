<template>
    <div class="test">
        <div class="box" @click="to">
            测试页
        </div>
    </div>
</template>
<script>
//import wx from "weixin-js-sdk";
//import html2canvas from "html2canvas";
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "test",
    mixins: [mixin],
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {
        to() {
            this.$router.replace({
                path: "/findArrears",
                query: {
                    carNum: "浙E8612Z"
                }
            });
        }
    }
};
</script>

<style scoped></style>
