<template>
    <div class="Auth"></div>
</template>

<script>
import mixin from "../utils/mixin"; // 引入mixin文件
import way from "../utils/codeDeal";
export default {
    name: "Auth",
    mixins: [mixin],
    created() {
        //let code = this.$route.query.code;
        let code = window.location.search.split("&")[0].slice(6);
        console.log(code);
        if (code) {
            way.getToken(code, () => {
                this.auth();
            });
        } else {
            this.auth();
        }
    },
    methods: {
        auth() {
            let token = localStorage.getItem("token");
            let authBefore = localStorage.getItem("authBefore");
            if (token) {
                if (authBefore) {
                    window.location.href = authBefore;
                } else {
                    console.log(token);
                    this.$router.replace("/index");
                    //window.location.href = index;
                }
                localStorage.removeItem("authBefore");
            } else {
                way.toWxAuth();
            }
        }
    }
};
</script>

<style scoped></style>
