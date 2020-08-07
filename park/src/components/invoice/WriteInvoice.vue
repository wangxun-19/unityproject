<template>
    <div class="WriteInvoice">
        <div class="lineBox"></div>
        <div class="top">
            <div class="msg">抬头类型</div>
            <van-radio-group v-model="type" direction="horizontal">
                <van-radio name="1">个人</van-radio>
                <van-radio name="2">公司</van-radio>
            </van-radio-group>
        </div>
        <div class="lineBox"></div>
        <div class="content">
            <van-cell-group>
                <van-field
                    v-model="form.name"
                    label="发票抬头"
                    required
                    :placeholder="type === '1' ? '个人姓名' : '公司名称'"
                />
                <van-field
                    v-model="form.number"
                    label="纳税识别号"
                    required
                    v-if="type === '2'"
                    placeholder="请输入纳税识别号"
                />
                <van-field
                    v-model="form.address"
                    label="公司地址"
                    required
                    v-if="type === '2'"
                    placeholder="请输入公司地址"
                />
                <van-field label="发票内容" value="停车费" readonly />
                <van-field
                    label="发票金额"
                    :value="amount / 100 + '元'"
                    readonly
                    error
                />
                <van-field
                    v-model="form.email"
                    label="电子邮箱"
                    required
                    placeholder="请输入电子邮箱"
                />
                <van-field
                    v-model="form.tel"
                    label="手机号码"
                    required
                    placeholder="请输入手机号码"
                />
            </van-cell-group>
        </div>
        <div class="tips">
            <p>温馨提示：</p>
            <p>1.电子发票仅支持最近30天的消费订单；</p>
            <p>2.发票面额以实际支付的金额进行开票，不包括折扣，优惠等金额；</p>
            <p>3.请正确填写发票信息，一经提交不可修改；</p>
            <p>4.申请成功后，可自行查看下载发票。</p>
        </div>
        <div class="button" @click="submit">
            申请发票
        </div>
    </div>
</template>

<script>
export default {
    name: "WriteInvoice",
    data() {
        return {
            type: "1",
            amount: 0,
            ids: "",
            form: {
                name: "",
                number: "",
                address: "",
                email: "",
                tel: ""
            }
        };
    },
    created() {
        this.ids = this.$route.query.ids;
        this.amount = this.$route.query.amount;
    },
    methods: {
        submit() {
            let that = this;
            if (!this.form.name || !this.form.email || !this.form.tel) {
                this.$toast.fail({
                    message: "请填写必填项",
                    duration: 1200,
                    forbidClick: true
                });
                return;
            }
            if (
                this.type === "2" &&
                (!this.form.number || !this.form.address)
            ) {
                this.$toast.fail({
                    message: "请填写必填项",
                    duration: 1200,
                    forbidClick: true
                });
                return;
            }
            //console.log("ok");
            let obj = {};
            if (this.type === "1") {
                obj = {
                    type: 1,
                    name: this.form.name,
                    email: this.form.email,
                    phone_number: this.form.tel,
                    order_ids: this.ids
                };
            } else if (this.type === "2") {
                obj = {
                    type: 1,
                    name: this.form.name,
                    email: this.form.email,
                    phone_number: this.form.tel,
                    order_ids: this.ids,
                    taxes_number: this.form.number,
                    company_address: this.form.adress
                };
            }
            this.$apis.applyInvoiceApi(obj).then(res => {
                if (res.code === 200) {
                    this.$toast.success({
                        message: res.msg,
                        duration: 1200,
                        forbidClick: true,
                        onClose() {
                            that.$router.back();
                        }
                    });
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
.lineBox {
    height: 10px;
    background-color: #f1f1f1;
}
.top {
    background-color: #fff;
    padding: 10px 15px;
}
.top .msg {
    margin-bottom: 10px;
}
.tips {
    padding: 12px;
    color: #555;
    font-size: 13px;
    line-height: 24px;
}
.button {
    width: 85vw;
    padding: 10px 0;
    margin: 20px auto 0;
    background-color: #1989fa;
    color: #fff;
    font-weight: bold;
    border-radius: 30px;
    text-align: center;
}
</style>
