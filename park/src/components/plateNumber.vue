<template>
    <div id="page">
        <div class="wrap">
            <div class="mytop">
                <div class="msg">请输入您的车牌号</div>
                <div class="radio-box">
                    <label class="flex-items-center">
                        <img
                            v-if="formData.commonCard == 1"
                            src="../assets/images/icon_chose_s@2x.png"
                            alt=""
                        />
                        <img
                            v-else
                            src="../assets/images/icon_chose_n@2x.png"
                            alt=""
                        />
                        <input
                            type="radio"
                            v-model="formData.commonCard"
                            value="1"
                        />普通车牌
                    </label>
                    <label class="flex-items-center">
                        <img
                            v-if="formData.commonCard == 2"
                            src="../assets/images/icon_chose_s@2x.png"
                            alt=""
                        />
                        <img
                            v-else
                            src="../assets/images/icon_chose_n@2x.png"
                            alt=""
                        />
                        <input
                            type="radio"
                            v-model="formData.commonCard"
                            value="2"
                        />新能源车牌
                    </label>
                </div>
            </div>

            <div class="num-box">
                <div class="num1" @click="clickFirstWrap()">
                    <span>{{ formData.num0 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(1)">
                    <span>{{ formData.num1 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(2)">
                    <span>{{ formData.num2 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(3)">
                    <span>{{ formData.num3 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(4)">
                    <span>{{ formData.num4 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(5)">
                    <span>{{ formData.num5 }}</span>
                </div>
                <div class="num1" @click="clickKeyWordWrap(6)">
                    <span>{{ formData.num6 }}</span>
                </div>
                <div
                    v-if="formData.commonCard == '2'"
                    class="num1"
                    @click="clickKeyWordWrap(7)"
                >
                    <span>{{ formData.num7 }}</span>
                </div>
            </div>

            <div class="submit-box" v-show="!showTwoBtn">
                <div class="btn" @click="submitFn()">
                    {{ confirmTxt }}
                </div>
            </div>
        </div>
        <div class="first-word-wrap" v-if="firstWrapStatus">
            <div class="first-word" @click="selectFirstWord($event)">
                <div class="word">
                    <span>京</span>
                </div>
                <div class="word">
                    <span>津</span>
                </div>
                <div class="word">
                    <span>渝</span>
                </div>
                <div class="word">
                    <span>沪</span>
                </div>
                <div class="word">
                    <span>冀</span>
                </div>
                <div class="word">
                    <span>晋</span>
                </div>
                <div class="word">
                    <span>辽</span>
                </div>
                <div class="word">
                    <span>吉</span>
                </div>
                <div class="word">
                    <span>黑</span>
                </div>
                <div class="word">
                    <span>苏</span>
                </div>
            </div>
            <div class="first-word" @click="selectFirstWord($event)">
                <div class="word">
                    <span>浙</span>
                </div>
                <div class="word">
                    <span>皖</span>
                </div>
                <div class="word">
                    <span>闽</span>
                </div>
                <div class="word">
                    <span>赣</span>
                </div>
                <div class="word">
                    <span>鲁</span>
                </div>
                <div class="word">
                    <span>豫</span>
                </div>
                <div class="word">
                    <span>鄂</span>
                </div>
                <div class="word">
                    <span>湘</span>
                </div>
                <div class="word">
                    <span>粤</span>
                </div>
                <div class="word">
                    <span>琼</span>
                </div>
            </div>
            <div class="first-word" @click="selectFirstWord($event)">
                <div class="word">
                    <span>川</span>
                </div>
                <div class="word">
                    <span>贵</span>
                </div>
                <div class="word">
                    <span>云</span>
                </div>
                <div class="word">
                    <span>陕</span>
                </div>
                <div class="word">
                    <span>甘</span>
                </div>
                <div class="word">
                    <span>青</span>
                </div>
                <div class="word">
                    <span>蒙</span>
                </div>
                <div class="word">
                    <span>桂</span>
                </div>
                <div class="word">
                    <span>宁</span>
                </div>
                <div class="word">
                    <span>新</span>
                </div>
            </div>
            <div class="first-word" @click="selectFirstWord($event)">
                <div class="word">
                    <span>藏</span>
                </div>
                <div class="word">
                    <span>使</span>
                </div>
                <div class="word">
                    <span>领</span>
                </div>
                <div class="word">
                    <span>警</span>
                </div>
                <div class="word">
                    <span>学</span>
                </div>
                <div class="word">
                    <span>港</span>
                </div>
                <div class="word">
                    <span>澳</span>
                </div>
                <div class="word longWord" @click.stop="closeFirstWrap">
                    <span style="background: #465266;color: #fff">关闭</span>
                </div>
            </div>
        </div>
        <div class="keyboard-wrap" v-if="keyBoardStatus === true">
            <div class="keyboard" v-if="activeKeyWordIndex !== 1">
                <span
                    v-for="(item, index) in allKeyWord._1"
                    :key="index + '1'"
                    @click="clickKeyBoard(item)"
                    >{{ item }}</span
                >
            </div>
            <div class="keyboard">
                <span
                    v-for="(item, index) in allKeyWord._3"
                    :key="index + '2'"
                    @click="clickKeyBoard(item)"
                    >{{ item }}</span
                >
            </div>
            <div class="keyboard">
                <span
                    v-for="(item, index) in allKeyWord._4"
                    :key="index + '3'"
                    @click="clickKeyBoard(item)"
                    >{{ item }}</span
                >
            </div>
            <div class="keyboard">
                <span class="delete" @click="deleteWord">
                    <img src="../assets/images/icon-delete.png" alt="" />
                </span>
                <span
                    v-for="(item, index) in allKeyWord._5"
                    :key="index + '4'"
                    @click="clickKeyBoard(item)"
                    >{{ item }}</span
                >
                <span @click="closeKeyWrap" class="delete">关闭</span>
                <!--<span v-for="(item,index) in allKeyWord._7"
                      :key="index+'5'"
                      @click="clickKeyBoard(item)">{{item}}</span>-->
            </div>
            <!--<div class="keyboard">
                <span class="delete" @click="deleteWord">
                    <img src="../assets/images/icon-delete.png" alt="">
                </span>
                <span @click="keyBoardStatus = false">关闭</span>
            </div>-->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            formData: {
                commonCard: "1",
                num0: "",
                num1: "",
                num2: "",
                num3: "",
                num4: "",
                num5: "",
                num6: "",
                num7: ""
            },
            allKeyWord: {
                _1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
                // _2: [9, 0],
                _3: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
                _4: ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
                _5: ["W", "X", "Y", "Z", "港", "澳", "学", "警", "使"]
                // _6: ['Z'],
                //_7: ['港', '澳', '学', '领', '警']
            },
            activeKeyWordIndex: 1, // 当前车牌号
            keyBoardStatus: false,
            firstWrapStatus: false, // 选择弹窗
            confirmTitle: "",
            submitConfirm: false,
            submitConfirmFalse: false,
            submitConfirmText: ""
        };
    },
    props: ["confirmTxt", "showTwoBtn"],
    mounted() {},
    methods: {
        clickFirstWrap() {
            // 点击第一个输入框
            this.firstClickStatus = true;
            this.firstWrapStatus = true;
            this.keyBoardStatus = false;
            this.formData.num0 = "";
            this.$emit("closeVideo", false);
        },
        closeFirstWrap() {
            this.$emit("closeVideo", true);
            this.firstClickStatus = false;
            this.firstWrapStatus = false;
            this.keyBoardStatus = false;
            this.formData.num0 = "";
        },
        closeKeyWrap() {
            this.keyBoardStatus = false;
            this.$emit("closeVideo", true);
        },
        selectFirstWord(event) {
            // 选择省份
            if (event.target.localName !== "span") {
                return;
            }
            this.formData.num0 = event.target.innerText;
            this.firstSelectStatus = true;
            this.firstWrapStatus = false;
            this.firstClickStatus = false;
            this.keyBoardStatus = true;
            this.activeKeyWordIndex = 1;
            // this.$refs.num1.focus()
            // document.getElementById('num1').focus()
        },
        clickKeyBoard(item) {
            // 点击自定义键盘
            //console.log(item)
            this.formData["num" + this.activeKeyWordIndex] = item;

            if (this.formData.commonCard === "1") {
                this.activeKeyWordIndex++;
                if (this.activeKeyWordIndex > 6) {
                    this.keyBoardStatus = false;
                }
            } else {
                this.activeKeyWordIndex++;
                if (this.activeKeyWordIndex > 7) {
                    this.keyBoardStatus = false;
                }
            }
        },
        deleteWord() {
            // 退格
            // console.log(this.activeKeyWordIndex)
            // console.log(this.formData['num' + (this.activeKeyWordIndex - 1)])
            if (this.activeKeyWordIndex > 0) {
                this.formData["num" + (this.activeKeyWordIndex - 1)] = "";
                this.activeKeyWordIndex--;
                if (this.activeKeyWordIndex == 0) {
                    this.clickFirstWrap();
                }
            }
        },
        clickKeyWordWrap(activeKeyWordIndex) {
            this.$emit("closeVideo", false);
            this.firstWrapStatus = false;
            this.keyBoardStatus = true;
            this.activeKeyWordIndex = activeKeyWordIndex;
            this.formData["num" + this.activeKeyWordIndex] = "";
        },
        submitFn() {
            let plateLicense;
            if (this.formData.commonCard === "1") {
                plateLicense = this.plate_license_1;
                plateLicense = this.palindrome(plateLicense);
                if (plateLicense.length < 7) {
                    //alert('请输入正确的车牌号');
                    this.$toast.fail("请输入正确的车牌号");
                    return;
                }
            }
            if (this.formData.commonCard === "2") {
                plateLicense = this.plate_license_2;
                plateLicense = this.palindrome(plateLicense);
                if (plateLicense.length < 8) {
                    //alert('请输入正确的车牌号');
                    this.$toast.fail("请输入正确的车牌号");
                    return;
                }
            }
            if (this.isLicensePlate(plateLicense)) {
                this.$emit("getPlateLicense", plateLicense, 1);
            } else {
                //alert("车牌格式错误")
                this.$toast.fail("车牌格式错误");
            }
            //console.log(plateLicense);
        },
        //正则检验车牌
        isLicensePlate(str) {
            let reg = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/;
            return reg.test(str);
        },

        palindrome(str) {
            var arr = str.split("");
            arr = arr.filter(function(val) {
                return (
                    val !== " " &&
                    val !== "," &&
                    val !== "." &&
                    val !== "?" &&
                    val !== ":" &&
                    val !== ";" &&
                    val !== "`" &&
                    val !== "'" &&
                    val !== "_" &&
                    val !== "/" &&
                    val !== "-" &&
                    val !== "\\" &&
                    val !== "" &&
                    val !== "(" &&
                    val !== ")"
                );
            });
            return arr.join("");
        },
        checkIsHasSpecialStr(str) {
            var flag = false;
            var arr = str.split("");
            arr.forEach(val => {
                if (
                    val === "!" ||
                    val === "}" ||
                    val === "{" ||
                    val === "]" ||
                    val === "[" ||
                    val === "&" ||
                    val === "$" ||
                    val === "@" ||
                    val === " " ||
                    val === "," ||
                    val === "." ||
                    val === "?" ||
                    val === ":" ||
                    val === ";" ||
                    val === "`" ||
                    val === "'" ||
                    val === "_" ||
                    val === "/" ||
                    val === "-" ||
                    val === "\\" ||
                    val === "" ||
                    val === "(" ||
                    val === ")"
                ) {
                    flag = true;
                }
            });
            return flag;
        },
        checkIsHasChineseStr(str) {
            var Reg = /.*[\u4e00-\u9fa5]+.*/;
            if (Reg.test(str)) {
                return true;
            }
            return false;
        }
    },
    computed: {
        plate_license_1() {
            return (
                this.formData.num0 +
                this.formData.num1 +
                this.formData.num2 +
                this.formData.num3 +
                this.formData.num4 +
                this.formData.num5 +
                this.formData.num6
            );
        },
        plate_license_2() {
            return (
                this.formData.num0 +
                this.formData.num1 +
                this.formData.num2 +
                this.formData.num3 +
                this.formData.num4 +
                this.formData.num5 +
                this.formData.num6 +
                this.formData.num7
            );
        }
    }
};
</script>
<style lang="less" scoped>
.mytop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 16px;
    color: #333;
}
.submit-box {
    margin-top: 15px;
}
input {
    outline: none;
}

.flex-items-center {
    display: flex;
    align-items: center;
}
.wrap {
    /*height: 11.1rem;*/
    padding: 0 15px;
    .radio-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 12px;
        text-align: right;
        color: #4a4a4a;
        input[type="radio"] {
            display: none;
        }
        label {
            padding-left: 1.2rem;
            cursor: pointer;
            img {
                width: 1.2rem;
                margin-right: 0.1rem;
            }
        }
    }
    .card-header {
        font-size: 0.75rem;
        margin: 0.2rem 0 0.5rem;
        color: #4a4a4a;
    }

    .num-box {
        display: flex;
        margin-top: 8px;
        justify-content: space-between;
        align-items: center;
        .spot {
            width: 0.2rem;
            height: 0.2rem;
            border-radius: 50%;
            background-color: #d8d8d8;
        }
        & > div {
            width: 3.4rem;
            height: 3.4rem;
            border: 1px solid #e4e4e4;
            background-color: #fff;
            &.first {
                position: relative;
                text-align: center;
                line-height: 3.3rem;
                font-weight: 200;
                .input-wrap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    &.active {
                        z-index: 100;
                    }
                }
                em {
                    color: #979797;
                    font-size: 1.6rem;
                    line-height: 1.7rem;
                }
                span {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    // background-color: #9cbce2;
                    color: #828282;
                    line-height: 1.8rem;
                }
            }
            &.active {
                border: 1px solid #4a90e2;
                &:after {
                    border-bottom: 0.5rem solid #4a90e2;
                }
            }
            span {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                font-size: 1rem;
                color: #828282;
                &.first {
                    background-color: #9cbce2;
                    color: #fff;
                    text-indent: 0.4rem;
                    border-radius: 0;
                }
            }
        }
    }
    .submit-box {
        button {
            width: 100%;
            height: 3.2rem;
            border-radius: 0.25rem;
            font-size: 13px;
            margin-top: 1.2rem;
            background: #ff8500;
            color: #fff;
            outline: none;
            border: none;
        }
    }
    .info {
        font-size: 0.5rem;
        margin-top: 0.9rem;
        color: #828282;
        text-align: left;
        img {
            width: 0.6rem;
            vertical-align: middle;
        }
    }
}
.first-word-wrap {
    // height: 9.4rem;
    background-color: #d1d5da;
    padding: 0.5rem;
    position: fixed;
    bottom: 60px;
    left: 0;
    right: 0;
    z-index: 999999;
    .first-word {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.35rem;
        .word.longWord {
            width: 4.8rem;
        }
        .word {
            box-sizing: border-box;
            width: 2.2rem;
            height: 3rem;
            // border: 1px solid #9cbce2;
            //box-shadow: 0px 1px 4px  rgba(0, 0, 0, 0.35);
            border-radius: 0.16rem;
            text-align: center;
            &.bordernone {
                border: none;
                box-shadow: none;
            }
            span {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                width: 100%;
                height: 100%;
                background-color: #fff;
                color: #000;
                // border: 1px solid #fff;
                border-radius: 6px;
            }
            img {
                width: 1.6rem;
            }
        }
        &:nth-last-of-type(1) {
            margin-bottom: 0rem;
        }
    }
}
.keyboard-wrap {
    background-color: #d2d5db;
    position: fixed;
    bottom: 60px;
    left: 0;
    right: 0;
    padding: 0.5rem;
    z-index: 999999;
    .keyboard {
        display: flex;
        justify-content: space-between;
        align-items: center;
        //height: 2.6rem;
        margin-bottom: 0.35rem;
        span {
            text-align: center;
            display: flex;
            width: 2.2rem;
            align-items: center;
            justify-content: center;
            height: 3rem;
            //box-shadow: 0px 1px 4px  rgba(0, 0, 0, 0.35);
            background-color: #fff;
            border-radius: 6px;
            &:active {
                background-color: #e4e4e4;
            }
            &.bordernone {
                border: none;
                box-shadow: none;
                background-color: #d2d5db;
                &:active {
                    background-color: #d2d5db;
                }
            }
            &.delete {
                background-color: #465266;
                color: #fff;
                img {
                    width: 1.15rem;
                }
            }
        }
    }
    .cancel {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.6rem;
            height: 1.8rem;
            background-color: #465266;
            color: #fff;
            border-radius: 0.125rem;
        }
    }
}
.submit-box .btn {
    padding: 8px 0;
    background-color: #ff8500;
    color: #fff;
    border-radius: 5px;
    text-align: center;
    font-weight: 700;
    font-size: 17px;
}
</style>
