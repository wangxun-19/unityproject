<template>
    <div class="CouponList">
        <div class="noData" v-if="noData">
            <div class="above">
                <van-image
                    :src="require('../assets/images/nodata.png')"
                ></van-image>
                <span class="msg">暂无优惠券</span>
            </div>
            <div class="under">
                <div class="btn btn1" @click="leave">直接离开</div>
            </div>
        </div>
        <template v-else>
            <div class="top">获得{{listLength}}张优惠券！！快领取吧</div>
            <div class="list">
                <div class="item" v-for="(item, index) in list" :key="index">
                    <div class="bg">
                        <van-image :src="bg"></van-image>
                    </div>
                    <div class="content">
                        <div class="t">
                            <div class="l">
                                <div class="logo">
                                    <van-image
                                        :src="item.icon"
                                        fit="cover"
                                        width="100%"
                                        height="100%"
                                    ></van-image>
                                </div>
                                <div class="title">
                                    <div class="tit">{{ item.name }}</div>
                                    <div class="date">
                                        {{ transTime(item.send_start_time) }}-{{
                                            transTime(item.send_end_time)
                                        }}
                                    </div>
                                </div>
                            </div>
                            <div class="r r1" v-if="item.type === 1">
                                <div class="amount">
                                    <span class="symbol">￥</span>
                                    <span class="num">{{
                                        item.reduce_price / 100
                                    }}</span>
                                </div>
                                <div class="condition">
                                    满{{ item.min_price / 100 }}可用
                                </div>
                            </div>
                            <div class="r r2" v-if="item.type === 2">
                                <div class="amount">
                                    <span class="num">{{
                                        item.discount / 10
                                    }}</span>
                                    <span class="symbol">折</span>
                                </div>
                            </div>
                            <div class="r r3" v-if="item.type === 3">
                                <div class="amount">
                                    <span class="symbol">￥</span>
                                    <span class="num">
                                        {{ item.amount / 100 }}</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="b">
                            <div class="tag">
                                剩余：{{ item.total_num - item.receive_num }}张
                            </div>
                            <div
                                class="btn"
                                @click="receive(item.id)"
                                v-if="item.user_coupon === 0"
                            >
                                领取
                            </div>
                            <div class="btn btn2" v-else>
                                已领取
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="top0">可在卡券包中查看，<a href="http://cxzx.hzhope.com/#/coupon" style="color:#fff">去查看</a></div>
                </div>
            </div>
            <div class="bottom">
                <div class="btn btn1" @click="leave">
                    {{ unGetList.length ? "忍痛离开" : "直接离开" }}
                </div>
                <div
                    class="btn btn2"
                    @click="allReceive"
                    v-if="unGetList.length"
                >
                    全部领取
                </div>
            </div>
        </template>

        <!--<van-dialog
            v-model="showTips"
            title="提示"
            message="领取成功！"
            :show-confirm-button="showConfirm"
            :show-cancel-button="showCancel"
            confirm-button-text="继续领取"
            cancel-button-text="离开"
            @confirm="goon"
            @cancel="leave"
        >
        </van-dialog>-->
    </div>
</template>

<script>
//type1满减券
//type2折扣券
//type3停车券
import mixin from "../utils/mixin"; // 引入mixin文件
export default {
    name: "CouponList",
    mixins: [mixin],
    data() {
        return {
            noData: false, //无数据
            showTips: false, //显示弹窗
            bg: require("../assets/images/cpBg.png"),
            list: [], //全部
            carNum: "",
            queryType: ""
        };
    },
    computed: {
        listLength() {
            return this.list.length;
        },
        //未领取
        unGetList() {
            return this.list.filter(item => item.user_coupon === 0);
        }
    },
    created() {
        this.carNum = this.$route.query.carNum;
        this.queryType = this.$route.query.queryType;
        this.getList();
    },
    methods: {
        //获取券列表
        getList() {
            this.$apis
                .couponListApi({
                    get_way: 2
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.data.length) {
                            this.list = res.data;
                        } else {
                            this.noData = true;
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
        //单张领取
        receive(id) {
            this.$apis
                .getCouponApi({
                    id
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$toast.success({
                            message: "领取成功",
                            duration: 1200,
                            forbidClick: true
                        });
                        this.getList();
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //多张领取
        allReceive() {
            let ids = "";
            let unGet = this.list.filter(item => item.user_coupon === 0);
            unGet.forEach(item => {
                ids += item.id + ",";
            });
            ids = ids.slice(0, -1);
            this.$apis
                .batchgetApi({
                    ids
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$toast.success({
                            message: "全部领取成功",
                            duration: 1200,
                            forbidClick: true
                        });
                        this.getList();
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //离开
        leave() {
            let that = this;
            if (that.queryType == "2") {
                that.$router.replace({
                    path: "/findArrears",
                    query: {
                        carNum: that.carNum
                    }
                });
            } else {
                that.$router.replace({
                    path: "/"
                });
            }
        },
        //继续领取
        goon() {
            this.showTips = false;
        }
    }
};
</script>

<style scoped>
.CouponList {
    width: 100vw;
    height: 100vh;
    background: rgba(241, 61, 56, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.top {
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(254, 207, 173, 1);
    text-align: center;
    padding: 15px 0;
    font-size: 16px;
}
.top0 {
    font-family: PingFang SC;
    color: rgba(254, 207, 173, 1);
    text-align: center;
}
.list {
    flex: 1;
    overflow-y: scroll;
    box-sizing: border-box;
}
.list .item {
    position: relative;
    width: 95%;
    margin: auto;
}
.list .item + .item {
    margin-top: 3px;
}
.bottom {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.bottom .btn {
    width: 99px;
    height: 38px;
    border-radius: 19px;
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
}
.bottom .btn1 {
    background: rgba(39, 39, 39, 0);
    border: 1px solid rgba(251, 211, 161, 1);
    color: rgba(253, 207, 173, 1);
}
.bottom .btn2 {
    background: rgba(251, 211, 161, 1);
    border: 1px solid rgba(251, 211, 161, 1);
    color: rgba(239, 57, 55, 1);
    margin-left: 30px;
}
.list .item .content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 17px 15px;
    padding: 4.5% 4%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.list .item .content .t {
    display: flex;
    align-items: center;
}
.list .item .content .t .l {
    flex: 1;
    margin-right: 10px;
    display: flex;
}
.list .item .content .t .l .logo {
    flex-shrink: 0;
    width: 45px;
    height: 45px;
    margin-right: 7px;
}
.list .item .content .t .l .logo >>> img {
    border-radius: 5px;
}
.list .item .content .t .l .title {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.list .item .content .t .l .title .tit {
    font-size: 16px;
    font-weight: bold;
    font-family: PingFang SC;
}
.list .item .content .t .l .title .date {
    font-size: 11px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(127, 127, 127, 1);
    line-height: 14px;
}
.list .item .content .t .r {
    width: 75px;
    flex-shrink: 0;
    text-align: center;
}
.list .item .content .t .r1 .amount {
    color: #ed492e;
}
.list .item .content .t .r1 .amount .symbol {
    font-size: 12px;
    line-height: 14px;
}
.list .item .content .t .r1 .amount .num {
    font-size: 25px;
    line-height: 30px;
}
.list .item .content .t .r1 .condition {
    font-size: 11px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(127, 127, 127, 1);
}
.list .item .content .t .r2 {
    width: 60px;
}
.list .item .content .t .r2 .amount {
    color: #ed492e;
}
.list .item .content .t .r2 .amount .symbol {
    font-size: 12px;
    line-height: 14px;
}
.list .item .content .t .r2 .amount .num {
    font-size: 25px;
    line-height: 30px;
}
.list .item .content .t .r3 {
    width: 60px;
}
.list .item .content .t .r3 .amount {
    color: #ed492e;
}
.list .item .content .t .r3 .amount .symbol {
    font-size: 12px;
    line-height: 14px;
}
.list .item .content .t .r3 .amount .num {
    font-size: 25px;
    line-height: 30px;
}
.list .item .content .b {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.list .item .content .b .tag {
    display: inline-block;
    padding: 0 4px;
    background: rgba(252, 239, 239, 1);
    border-radius: 7px;
    font-size: 11px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(233, 51, 60, 1);
}
.list .item .content .b .btn {
    display: inline-block;
    padding: 1px 12px;
    background: rgba(249, 246, 249, 0);
    border: 1px solid rgba(235, 89, 65, 1);
    border-radius: 12px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(235, 89, 65, 1);
}
.list .item .content .b .btn2 {
    background: #999;
    color: #fff;
    border: 1px solid #999;
}

.noData {
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
}
.noData .above {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    color: #fff;
}
.noData .above .msg {
    font-size: 16px;
    font-weight: 500;
    margin-top: 5px;
    font-family: PingFang SC;
}
.noData .under {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.noData .under .btn {
    width: 99px;
    height: 38px;
    border-radius: 19px;
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
}
.noData .under .btn1 {
    background: rgba(39, 39, 39, 0);
    border: 1px solid rgba(251, 211, 161, 1);
    color: rgba(253, 207, 173, 1);
}
</style>
