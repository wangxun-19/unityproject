<template>
    <div class="invoiceList">
        <div class="nodata" v-if="noData">
            <van-divider>暂无可开票订单</van-divider>
        </div>
        <van-list
            v-else
            v-model="loading"
            :finished="noMoreData"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <div class="list">
                <div class="item" v-for="(item, index) in list" :key="index">
                    <template v-if="item.park_invoice_info">
                        <div class="part1">
                            <van-checkbox
                                v-if="item.park_invoice_info.length === 0"
                                v-model="item.check"
                                checked-color="#1989fa"
                                >批量开票</van-checkbox
                            >
                            <div v-else>开票状态</div>
                            <div
                                class="state"
                                v-if="item.park_invoice_info.status === 1"
                            >
                                已开票
                            </div>
                            <div
                                class="state"
                                v-if="item.park_invoice_info.status === 0"
                            >
                                已申请
                            </div>
                            <div
                                class="state"
                                v-if="item.park_invoice_info.length === 0"
                            >
                                未开票
                            </div>
                        </div>
                        <div class="part2">
                            <div class="l">
                                <div class="name">{{ item.park_name }}</div>
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
                                <div
                                    class="btn"
                                    v-if="item.park_invoice_info.length === 0"
                                    @click="invoice(item)"
                                >
                                    去开票
                                </div>
                                <div
                                    class="btn"
                                    v-else
                                    @click="lookInvoice(item)"
                                >
                                    查看
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </van-list>
        <div class="totalBtn">
            <van-button
                block
                type="default"
                color="#1989fa"
                :disabled="disabled"
                @click="moreInvoice"
                >批量开票</van-button
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "InvoiceList",
    data() {
        return {
            list: [],
            start: 0,
            size: 10,
            noMoreData: false,
            noData: false,
            loading: false
        };
    },
    computed: {
        //选中的订单列表
        checkList() {
            let arr = [];
            this.list.forEach(item => {
                if (item.check) {
                    arr.push(item);
                }
            });
            return arr;
        },
        disabled() {
            return !this.checkList.length;
        }
    },
    methods: {
        //加载更多
        onLoad() {
            this.getData();
        },
        //获取订单列表
        getData() {
            this.$apis
                .getInvoiceApi({
                    start: this.start,
                    size: this.size
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.data.length) {
                            res.data.forEach(item => {
                                item.check = false;
                            });
                            this.list = this.list.concat(res.data);
                            this.noMoreData =
                                this.list.length % this.size !== 0;
                        } else if (this.start === 0) {
                            this.noData = true;
                        } else {
                            this.noMoreData = true;
                        }
                        this.loading = false;
                        this.start += this.size;
                    } else if (res.code === 400) {
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
        },
        //批量开票
        moreInvoice() {
            let amount = 0;
            let ids = [];
            this.checkList.forEach(item => {
                amount += item.real_fee;
                ids.push(item.id);
            });
            this.$router.push({
                path: "/writeInvoice",
                query: {
                    ids: ids.join(","),
                    amount
                }
            });
        },
        //去开发票页面
        invoice(item) {
            this.$router.push({
                path: "/writeInvoice",
                query: {
                    ids: item.id,
                    amount: item.real_fee
                }
            });
        },
        //查看发票
        lookInvoice(item) {
            let link = item.park_invoice_info.link;
            if (link) {
                if (link.includes("http")) {
                    window.location.href = link;
                } else {
                    window.location.href = "http://" + link;
                }
            } else {
                //去查询
                this.queryResult(item);
            }
        },
        //去查询
        queryResult(item) {
            this.$apis
                .queryInvoiceApi({
                    lsh: item.park_invoice_info.lsh
                })
                .then(res => {
                    if (res.code === 200) {
                        if (res.data.link) {
                            if (res.data.link.includes("http")) {
                                window.location.href = res.data.link;
                            } else {
                                window.location.href =
                                    "http://" + res.data.link;
                            }
                        } else {
                            this.$toast({
                                message: res.data.msg,
                                duration: 1500,
                                forbidClick: true
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

<style scoped>
.list {
    padding-bottom: 50px;
}
.invoiceList {
    width: 100%;
}
.item {
    position: relative;
    z-index: 1;
    padding: 0 15px;
    background-color: #fff;
}
.item + .item {
    margin-top: 15px;
}
.item .part1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    padding: 10px;
}
.item .part2 .l .name {
    color: #555;
    font-size: 15px;
    font-weight: bold;
    line-height: 25px;
    margin-bottom: 3px;
}
.item .part2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}
.wrap .part2 .l {
    padding-left: 10px;
}
.item .part2 .l div {
    position: relative;
    line-height: 25px;
    color: #999;
    padding-left: 9px;
}
.item .part2 .l div:before {
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
.item .part2 .l div span {
    color: #333;
}
.item .part2 .r {
    text-align: center;
}
.item .part2 .r .amount {
    font-size: 28px;
    text-align: center;
}
.item .part2 .r .amount span {
    font-size: 12px;
}
.item .part2 .r .btn {
    display: inline-block;
    padding: 2px 12px;
    border: 1px solid #1989fa;
    border-radius: 3px;
    font-size: 11px;
    color: #1989fa;
}
.totalBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    background-color: #fff;
}
</style>
