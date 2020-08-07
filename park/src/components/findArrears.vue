<template>
    <div class="findArrears">
        <!--轮播 start-->
        <div class="banner" v-if="resultList.length">
            <banner-part
                :time="banner.interval"
                :bannerList="banner.items"
                :type="banner.type"
                :position="'CC-011'"
            ></banner-part>
        </div>
        <div class="banner" v-if="!resultList.length">
            <banner-part
                :time="banner2.interval"
                :bannerList="banner2.items"
                :type="banner2.type"
                :position="'CC-016'"
            ></banner-part>
        </div>
        <!--轮播 end-->

        <div class="outBanner" ref="viewBox">
            <van-loading
                class="loading"
                type="spinner"
                v-if="loadingShow && resultList.length === 0"
            />
            <div class="result" v-if="resultList.length">
                <div class="txt">你有{{ resultList.length }}条欠费信息</div>
                <div class="list">
                    <div
                        class="item"
                        v-for="(item, index) in resultList"
                        :key="index"
                        @click="toArrearsDetail(index, item)"
                    >
                        <div class="top">
                            <span>{{ item.park_name }}</span>
                            <span class="iconfont icon-youjiantou"></span>
                        </div>
                        <div class="bottom">
                            <div class="l">
                                <div class="itm">
                                    <span>车牌号：</span>
                                    <span>{{ item.car_number }}</span>
                                </div>
                                <div class="itm">
                                    <span>入场时间：</span>
                                    <span>{{ item.in_time }}</span>
                                </div>
                                <div class="itm">
                                    <span>出场时间：</span>
                                    <span>{{ item.out_time }}</span>
                                </div>
                            </div>
                            <div class="r">
                                <p>
                                    <span>{{ item.arrears_amount / 100 }}</span
                                    >元
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="not" v-if="noFind">
                <div class="error">
                    <van-icon name="warning-o" size="60" color="#ff8500" />
                    <span>未查询到该车牌的欠费信息</span>
                </div>
                <van-button type="primary" @click="$router.go(-1)"
                    >返回上一页</van-button
                >
            </div>
        </div>

        <!--轮播 start-->
        <div class="banner2" v-if="resultList.length">
            <banner-part
                :time="banner4.interval"
                :bannerList="banner4.items"
                :type="banner4.type"
                :position="'CC-026'"
            ></banner-part>
        </div>
        <!--轮播 end-->
        <!--轮播 start-->
        <div class="banner2" v-if="!resultList.length">
            <banner-part
                :time="banner3.interval"
                :bannerList="banner3.items"
                :type="banner3.type"
                :position="'CC-017'"
            ></banner-part>
        </div>
        <!--轮播 end-->
    </div>
</template>

<script>
//import { queryOweApi,getBannerApi } from '../request/api';
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "findArrears",
    mixins: [mixin],
    data() {
        return {
            banner: {},
            banner2: {},
            banner3: {},
            banner4: {},
            noFind: false,
            carNum: "",
            resultList: [],
            loadingShow: true,
            scrollTxt: 0
        };
    },
    activated() {
        //console.log(this.$route.meta.keepAlive);
        if (this.scrollTxt > 0) {
            //console.log(this.scrollTxt);
            this.$refs.viewBox.scrollTo(0, this.scrollTxt);
            this.scrollTxt = 0;
            this.$refs.viewBox.addEventListener("scroll", this.scroll);
        }
        if (!this.$route.meta.keepAlive) {
            //isUseCache 时添加中router中的元信息，判读是否要缓存
            this.resultList = []; //清空原有数据
            this.getResult(this.$route.query.carNum); // 重新加载
        }
    },
    mounted() {
        let viewBox = this.$refs.viewBox;
        viewBox.addEventListener("scroll", this.scroll);

        this.carNum = this.$route.query.carNum;
        this.getResult(this.carNum);
    },
    methods: {
        //scroll
        scroll() {
            let scr = this.$refs.viewBox.scrollTop; // 向上滚动的那一部分高度
            this.scrollTxt = scr;
        },
        //获取广告位1
        getBanner() {
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-011"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-026"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner4 = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //获取广告位23
        getBanner23() {
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-016"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner2 = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-017"
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.banner3 = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //获取记录
        getResult(car_number) {
            this.$apis
                .queryOweApi({
                    car_number
                })
                .then(res => {
                    this.loadingShow = false;
                    if (res.code === 200) {
                        this.resultList = res.data;
                        this.getBanner();
                        //this.$store.commit("saveArrearsList", res.data);
                        if (res.data.length === 0) {
                            this.noFind = true;
                            this.getBanner23();
                        }
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //到详情页
        toArrearsDetail(index, item) {
            if (item.can_pay) {
                this.$router.push({
                    path: "/arrearsDetail",
                    query: {
                        data: JSON.stringify(this.resultList[index])
                    }
                });
            } else {
                this.$toast({
                    icon: "cross",
                    message: "该车场暂不支持欠费补缴",
                    duration: 1200,
                    forbidClick: true
                });
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.path === "/toPay" || from.path === "/couponList") {
                vm.resultList = []; //清空原有数据
                vm.getResult(vm.$route.query.carNum); // 重新加载
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        if (to.path === "/arrearsDetail") {
            this.$route.meta.keepAlive = true;
        } else {
            this.$route.meta.keepAlive = false;
        }
        next();
    }
};
</script>

<style scoped>
.findArrears {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.result .txt {
    padding: 8px 15px;
    font-size: 16px;
    color: #444;
}
.result .list {
    padding: 0 15px;
}
.result .list .item {
    padding: 0 15px;
    margin-bottom: 15px;
    background-color: #fff;
    border-radius: 10px;
}
.result .list .item .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0 5px;
    border-bottom: 1px solid #f9f9f9;
    font-size: 16px;
}
.result .list .item .bottom {
    padding: 5px 0 10px;
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
}
.result .list .item .bottom .r {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.result .list .item .bottom .r span {
    font-size: 25px;
    font-weight: bold;
    color: #f55e5f;
    margin-right: 3px;
}
.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
}
.not {
    padding: 0 15px 30px;
    text-align: center;
}
.error span {
    margin-top: 10px;
    font-size: 16px;
    color: #444;
}
</style>
