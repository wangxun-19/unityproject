<template>
    <div class="index">
        <!-- 主要内容 -->
        <div class="flexContentBox">
            <!--轮播 start-->
            <div class="banner">
                <div class="load" v-if="loadingShow">
                    <van-loading class="loading" type="spinner" />
                </div>
                <banner-part
                    :time="banner.interval"
                    :bannerList="banner.items"
                    :type="banner.type"
                    :position="'CC-001'"
                    ref="child"
                ></banner-part>
            </div>
            <!--轮播 end-->

            <div class="outBanner">
                <!--公告 start-->
                <div class="notice2" v-if="browserType">
                    <div class="txt">公告</div>
                    <div class="noticeList">
                        <van-swipe
                            class="list"
                            :autoplay="6000"
                            vertical
                            :show-indicators="false"
                        >
                            <van-swipe-item
                                v-for="(item, index) in noticeList"
                                :key="index"
                                @click="toNoticeList"
                                >{{ item.content }}</van-swipe-item
                            >
                        </van-swipe>
                    </div>
                    <div class="moreBtn" @click="toNoticeList">
                        更多
                    </div>
                </div>
                <!--公告 end-->

                <!--车牌组件 start-->
                <plate-number
                    @getPlateLicense="getCarNum"
                    :confirmTxt="confirmTxt"
                    :showTwoBtn="showTwoBtn"
                ></plate-number>
                <!--车牌组件 end-->

                <div class="twoBtn" v-if="showTwoBtn">
                    <div class="btn btn1" @click="bindCar">
                        我是车主，添加爱车
                    </div>
                    <div class="btn btn2" @click="helpPay">
                        不是车主，立即缴费
                    </div>
                </div>

                <!--我的车 start-->
                <div class="history" v-if="browserType">
                    <div
                        class="load"
                        v-if="loadingShow3 && carList.length === 0"
                    >
                        <van-loading class="loading" type="spinner" />
                    </div>
                    <div class="historyList" v-if="carList.length > 0">
                        <div
                            class="item"
                            v-for="(item, index) in carList"
                            :key="index"
                            @click="getCarNum(item.car_number, 0)"
                        >
                            <span>{{ item.car_number }}</span>
                        </div>
                    </div>
                    <div class="historyList" v-if="noCar">
                        暂无车辆
                    </div>
                </div>
                <!--我的车 end-->

                <!--历史搜索记录 start-->
                <div class="history" v-if="!browserType">
                    <div class="historyList" v-if="historyList.length > 0">
                        <div
                            class="item"
                            v-for="(item, index) in historyList"
                            :key="index"
                            @click="getCarNum(item)"
                        >
                            <span>{{ item }}</span>
                        </div>
                    </div>
                    <div class="historyList" v-if="historyList.length === 0">
                        暂无搜索记录
                    </div>
                </div>
                <!--历史搜索记录 end-->

                <div class="tel">
                    <p>【如有停车缴费相关问题，请点击拨打投诉电话】</p>
                    <a href="tel:0572-6510002" class="tel1">0572-6510002</a>
                    <a href="tel:0572-6683100">0572-6683100</a>
                </div>
            </div>

            <!--轮播 start-->
            <div class="banner">
                <banner-part
                    :time="banner2.interval"
                    :bannerList="banner2.items"
                    :type="banner2.type"
                    :position="'CC-003'"
                    ref="child2"
                ></banner-part>
            </div>
            <!--轮播 end-->
        </div>

        <!--底部菜单 start-->
        <parking-menu v-if="browserType"></parking-menu>
        <!--底部菜单 end-->
    </div>
</template>

<script>
import plateNumber from "./plateNumber";
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "index",
    mixins: [mixin],
    data() {
        return {
            queryNumber: "",
            browserType: true,
            over_time: "",
            banner: {},
            banner2: {},
            carList: [],
            noticeList: [],
            noHistory: false,
            confirmTxt: "查询停车费",
            videoShow: true,
            noCar: false,
            historyList: [],
            loadingShow: true,
            loadingShow2: true,
            loadingShow3: true,
            showTwoBtn: false
        };
    },
    components: {
        plateNumber
    },
    created() {
        //console.log(this.$browserType.browserType())
        if (this.$browserType.browserType() === "zfb") {
            this.browserType = false;
            this.historyList = localStorage.getItem("history")
                ? JSON.parse(localStorage.getItem("history"))
                : [];
        } else {
            this.browserType = true;
        }
    },
    mounted() {
        this.getBanner();
        if (this.browserType) {
            this.getBanner2();
            this.getNotice();

            if (this.$store.state.myCarList.length > 0) {
                this.carList = this.$store.state.myCarList;
            } else {
                this.getMycar();
            }
        }
    },
    methods: {
        //获取广告位1
        getBanner() {
            //获取第一个广告位
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-001"
                })
                .then(res => {
                    this.loadingShow = false;
                    if (res.code === 200) {
                        //console.log(res..data);
                        this.banner = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //获取广告位2
        getBanner2() {
            //获取第二个广告位
            this.$apis
                .getBannerApi({
                    platform: 1,
                    position: "CC-003"
                })
                .then(res => {
                    this.loadingShow2 = false;
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
        //获取公告
        getNotice() {
            //获取第二个公告位
            this.$apis
                .getNoticesApi({
                    platform: 1,
                    position: 3
                })
                .then(res => {
                    if (res.code === 200) {
                        //console.log(res.data);
                        this.noticeList = res.data;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },

        //获取我的车列表
        getMycar() {
            this.$apis.myCarApi().then(res => {
                if (res.code === 200) {
                    //console.log(res.data);
                    this.loadingShow3 = false;
                    this.carList = res.data;
                    this.$store.commit("saveMyCarList", res.data);
                    if (res.data.length === 0) {
                        this.noCar = true;
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
        //公告列表页
        toNoticeList() {
            this.$router.push({
                path: "/noticeList",
                query: {
                    platform: 1,
                    position: 3
                }
            });
        },
        //代缴
        helpPay() {
            this.getCarNum(this.queryNumber, 0);
        },
        //绑定车辆
        bindCar() {
            this.$apis
                .bindCarApi({
                    car_number: this.queryNumber
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$store.commit("saveMyCarList", []);
                        this.getMycar();
                        this.$toast.success({
                            message: "车牌绑定成功",
                            duration: 1200,
                            forbidClick: true
                        });
                        this.noCar = false;
                        setTimeout(() => {
                            this.$router.push({
                                path: "/findResult",
                                query: {
                                    carNum: this.queryNumber
                                }
                            });
                        }, 1200);
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //到查询结果页
        getCarNum(i, isBind) {
            if (!this.browserType) {
                isBind = 0;
            }
            let that = this;
            this.queryNumber = i;
            if (!this.browserType && this.historyList.indexOf(i) === -1) {
                if (this.historyList.length <= 3) {
                    this.historyList.unshift(i);
                    localStorage.setItem(
                        "history",
                        JSON.stringify(this.historyList)
                    );
                } else {
                    this.historyList.unshift(i);
                    this.historyList.pop();
                    localStorage.setItem(
                        "history",
                        JSON.stringify(this.historyList)
                    );
                }
            }
            this.$apis
                .parkingFeeApi({
                    car_number: i,
                    is_bind_judge: isBind
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.data.errcode === 1001) {
                            this.$toast.fail({
                                message: "该车牌未绑定",
                                duration: 1200,
                                forbidClick: true
                            });
                            this.showTwoBtn = true;
                        } else {
                            that.$router.push({
                                path: "/findResult",
                                query: {
                                    carNum: i
                                }
                            });
                        }
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.load {
    padding: 20px 0;
}

.notice {
    background-color: #fff;
    padding: 5px 15px;
    height: 25px;
    display: flex;
    align-items: center;
    border-top: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
}

.notice .txt {
    color: #f55e5f;
    font-weight: bold;
    flex-shrink: 0;
}

.notice .txt .iconfont {
    font-size: 20px;
    height: 25px;
}

.noticeList {
    flex: 1;
    margin: 0 10px;
    height: 100%;
    line-height: 25px;
    overflow: hidden;
}
.list {
    height: 25px !important;
}
.list .van-swipe-item {
    height: 25px !important;
    line-height: 28px;
    overflow: hidden;
}

.notice2 {
    background-color: #fff;
    padding: 5px 15px;
    height: 25px;
    display: flex;
    align-items: center;
}

.notice2 .txt {
    color: #f55e5f;
    font-size: 16px;
    font-weight: bold;
    flex-shrink: 0;
}

.notice2 .noticeList {
    flex: 1;
    margin-left: 10px;
    height: 100%;
    line-height: 25px;
    overflow: hidden;
}

.history {
    padding: 0 12px;
    background-color: #fff;
    margin: 12px 0 0;
}

.history h3 {
    color: #444;
    padding: 10px 0 5px;
    border-bottom: 1px solid #f6f6f6;
    font-weight: normal;
}

.history .historyList {
    display: flex;
    flex-wrap: wrap;
    color: #666;
    padding: 6px;
}

.history .historyList .item {
    width: 25%;
    font-size: 15px;
    text-align: center;
}

.moreBtn {
    color: #888;
}

.twoBtn {
    padding: 0 15px;
    margin-top: 15px;
}
.twoBtn .btn {
    padding: 8px 0;
    color: #fff;
    border-radius: 5px;
    text-align: center;
    font-weight: 700;
    font-size: 17px;
}
.twoBtn .btn1 {
    background-color: #95cdb4;
}
.twoBtn .btn2 {
    background-color: #ff8500;
    margin-top: 10px;
}

.tel {
    padding: 7px 0;
    text-align: center;
}
.tel a {
    color: #ff8500;
    font-size: 15px;
}
.tel1 {
    margin-right: 15px;
}
</style>
