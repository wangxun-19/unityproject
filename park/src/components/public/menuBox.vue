<template>
    <div class="menuBox">
        <div
            class="item"
            v-for="(item, index) in menuList"
            :key="index"
            :style="{ color: item.on === true ? '#ff8500' : '#333' }"
            @click="toThisPage(item)"
            :class="index === 2 ? 'back' : ''"
        >
            <span class="iconfont ico" :class="item.classTit"></span>
            <span class="text">{{ item.title }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "menuBox",
    data() {
        return {
            menuList: [
                {
                    title: "自助缴费",
                    classTit: "icon-icon6",
                    path: "/index",
                    isRoute: true,
                    link: "",
                    on: true
                },
                {
                    title: "寻找车位",
                    classTit: "icon-icon7",
                    path: "/findCar",
                    isRoute: true,
                    link: "",
                    on: false
                },
                {
                    title: "",
                    classTit: "",
                    path: "",
                    isRoute: false,
                    link: "http://cxzx.hzhope.com",
                    on: false
                },
                {
                    title: "欠费补缴",
                    classTit: "icon-qianfei",
                    path: "/payBack",
                    isRoute: true,
                    link: "",
                    on: false
                },
                {
                    title: "我的爱车",
                    classTit: "icon-icon11",
                    path: "/myCar",
                    isRoute: true,
                    link: "",
                    on: false
                }
            ]
        };
    },
    created() {
        this.menuList.forEach(i => {
            i.on = false;
        });
        //console.log(this.$route.path)
        switch (this.$route.path) {
            case "/index":
                this.menuList[0].on = true;
                break;
            case "/findCar":
                this.menuList[1].on = true;
                break;
            case "/payBack":
                this.menuList[3].on = true;
                break;
            case "/myCar":
                this.menuList[4].on = true;
        }
    },
    methods: {
        toThisPage(item) {
            //console.log(item)
            if (item.isRoute) {
                this.$router.push({
                    path: item.path
                });
            } else {
                window.location.href = item.link;
            }
        }
    }
};
</script>

<style scoped>
.menuBox {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99998;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 5px 0;
    box-shadow: 1px 0 2px 1px #f3f3f3;
    font-size: 13px;
}
.menuBox .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.menuBox .item .ico {
    font-size: 28px;
    line-height: 30px;
}
.menuBox .item.back {
    width: 55px;
    height: 55px;
    flex-shrink: 0;
    border-radius: 100%;
    background: url("../../assets/images/backIndex.png") no-repeat center
        center/100% 100%;
}
.indexBtn {
    position: absolute;
    right: 10px;
    bottom: 70px;
    width: 45px;
    height: 45px;
    border-radius: 100%;
    background-color: #ff8500;
    box-shadow: 0 0 2px 1px #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
}
.indexBtn .iconfont {
    position: relative;
    display: block;
    width: 30px;
    height: 41px;
    line-height: 45px;
    font-size: 30px;
}
</style>
