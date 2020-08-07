<template>
    <div class="payRecord">
        <!-- 主体 start -->
        <div class="navBar">
            <!--轮播 start-->
            <div class="banner" ref="banner">
                <banner-part
                    :time="banner.interval"
                    :bannerList="banner.items"
                    :type="banner.type"
                    :position="'CC-024'"
                ></banner-part>
            </div>
            <!--轮播 end-->

            <div class="listBox" ref="viewBox">
                <div class="item">
                    <div
                        class="wrap"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="toDetail(item)"
                    >
                        <div class="part1">
                            <div class="name">{{ item.park_name }}</div>
                            <div class="state">{{ item.status_text }}</div>
                        </div>
                        <div class="part2">
                            <div class="l">
                                <div>
                                    车牌号码：<span>{{ item.car_number }}</span>
                                </div>
                                <div>
                                    计费时长：<span>{{
                                        item.chargeing_duration
                                    }}</span>
                                </div>
                                <div>
                                    支付时间：<span>{{ item.pay_time }}</span>
                                </div>
                            </div>
                            <div class="r">
                                <div class="amount">
                                    {{ item.real_fee / 100 }}<span>元</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="noData" v-if="noData">
                    没有数据~
                </div>
            </div>
            <div
                class="invoiceBtn"
                @click="$router.push('/invoiceList')"
                v-if="showBtn"
            >
                <van-icon name="records" size="18" />
                <span>电子发票</span>
            </div>
            <!--轮播 start-->
            <div class="banner2" ref="banner2">
                <banner-part
                    :time="banner2.interval"
                    :bannerList="banner2.items"
                    :type="banner2.type"
                    :position="'CC-025'"
                ></banner-part>
            </div>
            <!--轮播 end-->
        </div>
        <!-- 主体 end -->
    </div>
</template>

<script>
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "payRecord",
    mixins: [mixin],
    data() {
        return {
            list: [],
            start: 0,
            size: 10,
            banner: {},
            banner2: {},
            end: false,
            heights1: "",
            heights2: "",
            noData: false,
            isMoreLoad: false,
            loadingImg: false,
            scrollTxt: 0,
            showBtn: false
        };
    },
    activated() {
        if (this.scrollTxt > 0) {
            //console.log(this.scrollTxt);
            this.$refs.viewBox.scrollTo(0, this.scrollTxt);
            this.scrollTxt = 0;
            this.$refs.viewBox.addEventListener("scroll", this.scroll);
        }
    },
    mounted() {
        //console.log(2222)
        this.getData();
        this.getBanner();
        let viewBox = this.$refs.viewBox;
        viewBox.addEventListener("scroll", this.scroll);
    },
    methods: {
        //获取轮播图
        getBanner() {
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-024"
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
                    position: "CC-025"
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
        },
        //获取订单列表
        getData() {
            this.$apis
                .payRecordApi({
                    start: this.start,
                    size: this.size
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.msg === "OK2") {
                            this.showBtn = true;
                        } else {
                            this.showBtn = false;
                        }
                        if (res.data.length > 0) {
                            this.list = this.list.concat(res.data);
                            //this.$store.commit('savePayRecord',this.list);
                        } else {
                            this.noData = true;
                        }
                        if (
                            res.data.length < this.size &&
                            res.data.length !== 0
                        ) {
                            this.$toast("已加载全部数据~");
                            this.end = true;
                        }
                        this.isMoreLoad = res.data.length === this.size;
                        setTimeout(() => {
                            this.loadingImg = false;
                        }, 500);
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        scrollLoadMore() {
            // 防止多次加载
            if (this.loadingImg) {
                return false;
            }
            this.loadingImg = true;
            if (!this.end) {
                this.getData();
            }
        },

        //触底加载更多
        scroll() {
            let _this = this;
            let scr = this.$refs.viewBox.scrollTop; // 向上滚动的那一部分高度
            this.scrollTxt = scr;
            let clientHeight = this.$refs.viewBox.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
            let scrHeight = this.$refs.viewBox.scrollHeight; // 整个网页的实际高度，兼容Pc端
            //console.log(scr + clientHeight + 10 >= scrHeight);
            if (scr + clientHeight + 10 >= scrHeight) {
                if (_this.isMoreLoad && !_this.loadingImg) {
                    //this.isMoreLoad控制滚动是否加载更多
                    this.$toast.loading({
                        mask: true,
                        message: "加载中...",
                        duration: 500
                    });
                    //console.log(_this.size);
                    //console.log(_this.start);
                    _this.start += _this.size; // 加载更多
                    _this.scrollLoadMore();
                } else {
                    return;
                }
            }
        },
        //到订单详情页
        toDetail(item) {
            //console.log(id);
            this.$router.push({
                path: "/recordDetail",
                query: {
                    info: JSON.stringify(item)
                }
            });
        }
    }
};
</script>

<style scoped>
.navBar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.navBar .banner {
    flex-shrink: 0;
}
.navBar .banner2 {
    flex-shrink: 0;
}
.listBox {
    width: 100%;
    flex: 1;
    overflow-y: scroll;
}
.wrap {
    position: relative;
    z-index: 1;
    padding: 0 15px;
    background-color: #fff;
}
.wrap + .wrap {
    margin-top: 15px;
}
.wrap .part1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    padding: 10px;
}
.wrap .part1 .name {
    color: #555;
    font-size: 15px;
    font-weight: bold;
    position: relative;
    padding-left: 15px;
    max-width: 70%;
    line-height: 20px;
}
.wrap .part1 .name:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 6px;
    height: 6px;
    margin-top: -3px;
    border-radius: 100%;
    background-color: #ff8500;
}
.wrap .part2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}
.wrap .part2 .l {
    padding-left: 10px;
}
.wrap .part2 .l div {
    position: relative;
    line-height: 25px;
    color: #999;
    padding-left: 9px;
}
.wrap .part2 .l div:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    margin-top: -2px;
    background-color: #999;
    border-radius: 100%;
}
.wrap .part2 .l div span {
    color: #333;
}
.wrap .part2 .r .amount {
    font-size: 28px;
    text-align: center;
}
.wrap .part2 .r .amount span {
    font-size: 12px;
}
/*.banner2{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
    }*/
.noData {
    text-align: center;
    margin-top: 50px;
}
.invoiceBtn {
    background-color: #ff8500;
    padding: 10px 0;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
</style>
