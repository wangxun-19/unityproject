<template>
    <div class="parkingDetail">
        <div class="topimg">
            <img src="../assets/images/parkingDetail.jpg" alt="" width="100%">
        </div>
        <div class="detail">
            <h4>{{park_name}}</h4>
            <div>{{address}}</div>
            <p>{{distance}}km</p>
        </div>
        <div class="number">
            <div class="msg">车位使用情况</div>
            <div class="b">
                <div class="l">
                    <div class="num color" v-if="remain !== -1">{{remain}}</div>
                    <div class="num color" v-if="remain === -1">未获取到数据</div>
                    <p>剩余车位</p>
                </div>
                <div class="r">
                    <div class="num">{{total}}</div>
                    <p>车位总数</p>
                </div>
            </div>
        </div>
        <!--收费标准 start-->
        <template v-if="ruleArr.length>0">
            <div class="standard">
                <div class="tit">
                    <p>{{type}}</p>
                    <span class="iconfont icon-gengduo" @click="showPopup"></span>
                </div>
                <div class="money">
                    <p>{{changePrice}}<span class="yuan">元</span></p>
                </div>
                <div class="slideBar">
                    <div class="txtBar">
                        <div class="item" v-for="(i,index) in 4" :key="i" :class="value/25===index?'on':''">
                            <div class="num">{{timeDuring[index]}}<p class="hs" v-if="value/25===index">小时</p></div>
                            <div class="line"></div>
                        </div>
                        <div class="item" :class="value===100?'on':''">
                            <div class="tc"><span v-if="value===100">每日</span>封顶</div>
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="slides">
                        <van-slider v-model="value" :step="25">
                            <div
                                slot="button"
                                class="custom-button"
                            >
                                <div class="center"></div>
                            </div>
                        </van-slider>
                    </div>
                </div>
            </div>

            <div class="standard standard2" v-if="ruleArr.length>1">
                <div class="tit">
                    <p>{{type2}}</p>
                    <span class="iconfont icon-gengduo" @click="showPopup2"></span>
                </div>
                <div class="money">
                    <p>{{changePrice2}}<span class="yuan">元</span></p>
                </div>
                <div class="slideBar">
                    <div class="txtBar">
                        <div class="item" v-for="(i,index) in 4" :key="i" :class="value2/25===index?'on':''">
                            <div class="num">{{timeDuring2[index]}}<p class="hs" v-if="value2/25===index">小时</p></div>
                            <div class="line"></div>
                        </div>
                        <div class="item" :class="value2===100?'on':''">
                            <div class="tc"><span v-if="value2===100">每日</span>封顶</div>
                            <div class="line"></div>
                        </div>
                    </div>
                    <div class="slides">
                        <van-slider v-model="value2" :step="25">
                            <div
                                slot="button"
                                class="custom-button"
                            >
                                <div class="center"></div>
                            </div>
                        </van-slider>
                    </div>
                </div>
            </div>
        </template>
        <!--收费标准 end-->

        <!--轮播 start-->
        <div class="banner">
            <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-008'"></banner-part>
        </div>
        <!--轮播 end-->

        <van-popup v-model="showPop"  position="bottom">
            <h3>收费规则</h3>
            <p v-for="(item,index) in msgTxt" :key="index">【{{index}}】 {{item}}</p>
        </van-popup>

        <van-popup v-model="showPop2"  position="bottom">
            <h3>收费规则</h3>
            <p v-for="(item,index) in msgTxt2" :key="index">【{{index}}】 {{item}}</p>
        </van-popup>
    </div>
</template>

<script>
    //import { parkingDetailApi,getBannerApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "parkingDetail",
        mixins:[mixin],
        data(){
            return{
                park_name:'',
                address:'',
                distance:"",
                remain:null,
                total:null,
                latitude:'',
                longitude:'',
                value:0,
                value2:0,
                type:'',
                type2:'',
                ruleArr:[],
                rule:{},
                rule2:{},
                timeDuring:[],
                price:[],
                timeDuring2:[],
                price2:[],
                topNum:'',
                topNum2:'',
                msgTxt:[],
                msgTxt2:[],
                showPop:false,
                showPop2:false,
                banner:{}
            }
        },
        computed:{
            changePrice(){
                if(this.value===0){
                    return this.price[0]/100
                }else if(this.value===25){
                    return this.price[1]/100
                }else if(this.value===50){
                    return this.price[2]/100
                }else if(this.value===75){
                    return this.price[3]/100
                }else if(this.value===100){
                    return this.topNum/100
                }else{
                    return "未知"
                }
            },
            changePrice2(){
                if(this.value2===0){
                    return this.price2[0]/100
                }else if(this.value2===25){
                    return this.price2[1]/100
                }else if(this.value2===50){
                    return this.price2[2]/100
                }else if(this.value2===75){
                    return this.price2[3]/100
                }else if(this.value2===100){
                    return this.topNum2/100
                }else{
                    return "未知"
                }
            }
        },
        mounted() {
            this.getDetail();
            this.distance = this.$route.query.distance;
            this.remain = this.$route.query.remain;
            this.getBanner();
        },
        methods:{
            //获取广告
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-008'
                }).then(res=>{
                    this.loadingShow = false;
                    if(res.code===200){
                        //console.log(res.data);
                        this.banner = res.data;
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                });
            },
            //获取停车场列表
            getDetail(){
                this.$apis.parkingDetailApi({
                    park_id:this.$route.query.park_id
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res);
                        this.park_name = res.data.park_name;
                        this.address = res.data.address;
                        this.total = res.data.total;
                        this.latitude = res.data.latitude;
                        this.longitude = res.data.longitude;
                        this.ruleArr = res.data.charge_rule;
                        this.getRule();
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            getRule(){
                if(this.ruleArr.length===1){
                    this.rule = this.ruleArr[0];
                    this.topNum = this.rule.top;
                    this.msgTxt = this.rule.desc;
                    switch (this.rule.type) {
                        case "common":
                            this.type="通用停车收费规则";
                            break;
                        case "ground":
                            this.type="地面停车场收费规则";
                            break;
                        case "underground":
                            this.type="地下停车场收费规则";
                            break;
                    }
                    if(this.rule.each === 0){
                        //console.log(this.rule.rule)
                        //console.log(Object.keys(this.rule.rule))
                        for (let i in this.rule.rule){
                            this.timeDuring.push(i/60);
                            this.price.push(this.rule.rule[i]);
                        }
                    }else{
                        //console.log(this.rule.rule)
                        for (let i in this.rule.rule){
                            this.timeDuring.push(i/60);
                            this.price.push(this.rule.rule[i]);
                        }
                        let eachTime = Object.keys(this.rule.each)[0]/60;
                        let eachPrice = Object.values(this.rule.each)[0];
                        //console.log(eachTime);
                        while (this.timeDuring.length<4){
                            this.timeDuring.push(this.timeDuring[this.timeDuring.length-1]+eachTime);
                            this.price.push(this.price[this.price.length-1]+eachPrice)
                        }
                        //console.log(this.timeDuring);
                        //console.log(this.price);
                    }

                }else if(this.ruleArr.length===2){
                    this.rule = this.ruleArr[0];
                    this.rule2 = this.ruleArr[1];
                    this.topNum = this.rule.top;
                    this.topNum2 = this.rule2.top;
                    this.msgTxt = this.rule.desc;
                    this.msgTxt2 = this.rule2.desc;
                    switch (this.rule.type) {
                        case "common":
                            this.type="通用停车收费规则";
                            break;
                        case "ground":
                            this.type="地面停车场收费规则";
                            break;
                        case "underground":
                            this.type="地下停车场收费规则";
                            break;
                    }
                    switch (this.rule2.type) {
                        case "common":
                            this.type2="通用停车收费规则";
                            break;
                        case "ground":
                            this.type2="地面停车场收费规则";
                            break;
                        case "underground":
                            this.type2="地下停车场收费规则";
                            break;
                    }
                    if(this.rule.each === 0){
                        //console.log(this.rule.rule)
                        //console.log(Object.keys(this.rule.rule))
                        for (let i in this.rule.rule){
                            this.timeDuring.push(i/60);
                            this.price.push(this.rule.rule[i]);
                        }
                        //console.log(this.timeDuring);
                        //console.log(this.price);
                    }else{
                        //console.log(this.rule.rule)
                        for (let i in this.rule.rule){
                            this.timeDuring.push(i/60);
                            this.price.push(this.rule.rule[i]);
                        }
                        let eachTime = Object.keys(this.rule.each)[0]/60;
                        let eachPrice = Object.values(this.rule.each)[0];
                        //console.log(eachTime);
                        while (this.timeDuring.length<4){
                            this.timeDuring.push(this.timeDuring[this.timeDuring.length-1]+eachTime);
                            this.price.push(this.price[this.price.length-1]+eachPrice)
                        }
                        //console.log(this.timeDuring);
                        //console.log(this.price);
                    }

                    if(this.rule2.each === 0){
                        //console.log(this.rule2.rule)
                        //console.log(Object.keys(this.rule2.rule))
                        for (let i in this.rule2.rule){
                            this.timeDuring2.push(i/60);
                            this.price2.push(this.rule2.rule[i]);
                        }
                        //console.log(this.timeDuring2);
                        //console.log(this.price2);
                    }else{
                        //console.log(this.rule.rule)
                        for (let i in this.rule2.rule){
                            this.timeDuring2.push(i/60);
                            this.price2.push(this.rule2.rule[i]);
                        }
                        let eachTime = Object.keys(this.rule2.each)[0]/60;
                        let eachPrice = Object.values(this.rule2.each)[0];
                        //console.log(eachTime);
                        while (this.timeDuring2.length<4){
                            this.timeDuring2.push(this.timeDuring2[this.timeDuring2.length-1]+eachTime);
                            this.price2.push(this.price2[this.price2.length-1]+eachPrice)
                        }
                        //console.log(this.timeDuring2);
                        //console.log(this.price2);
                    }

                }
            },
            showPopup(){
                this.showPop = true;
            },
            showPopup2(){
                this.showPop2 = true;
            }
        },
        beforeRouteLeave(to,from,next){
            to.meta.keepAlive = true;
            next();
        }
    }
</script>

<style scoped>
    .parkingDetail{
        padding-bottom: 200px;
    }
    .detail{
        padding: 0 15px;
        background-color: #fff;
    }
    .detail h4{
        padding-top: 10px;
        font-size: 16px;
        color: #444;
    }
    .detail div{
        padding: 5px 0;
        color: #888;
    }
    .detail p{
        padding-bottom: 10px;
        color: #888;
    }
    .number{
        margin-top: 5px;
        background-color: #fff;
        padding: 0 15px;
    }
    .number .msg{
        padding: 10px 0 0;
        color: #444;
    }
    .number .b{
        display: flex;
        justify-content: space-between;
        padding: 8px 0 8px;
        color: #777;
    }
    .number .b > div{
        flex: 1;
        text-align: center;
    }
    .number .b .l{
        border-right: 1px solid #f8f8f8;
    }
    .number .b > div .num{
        font-size: 20px;
    }
    .number .b > div .color{
        color: #ff8500;
    }
    .standard{
        padding: 12px 15px;
        background-color: #2a323d;
        color: #fff;
        margin-top: 10px;
    }
    .standard .tit{
        display: flex;
        justify-content: space-between;
    }
    .standard2{
        border-top: 1px solid #999;
        margin-top: 0;
    }
    .standard .msg{
        display: flex;
        justify-content: space-between;
    }
    .slideBar{
        padding: 0 0 16px;
    }
    .slides{
        padding: 0 17px;
    }
    .custom-button{
        width: 35px;
        height: 35px;
        border-radius: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .custom-button .center{
        width: 15px;
        height: 15px;
        border-radius: 100%;
        background-color: #ff8500;
    }
    .txtBar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        margin-top: 6px;
    }
    .txtBar .item{
        display: flex;
        width: 35px;
        flex-direction: column;
        align-items: center;
        color: #aaa;
        height: 55px;
    }
    .txtBar .item.on{
        transform: translateY(-20px);
        color: #fff;
    }
    .txtBar .item .tc{
        text-align: center;
    }
    .txtBar .item.on .num{
        font-size: 20px;
    }
    .txtBar .item.on .num .hs{
        font-size: 12px;
        line-height: 15px;
    }
    .txtBar .item .num{
        text-align: center;
    }
    .txtBar .item .line{
        width: 1px;
        height: 14px;
        background-color: #aaa;
    }
    .txtBar .item.on .line{
        background-color: #fff;
    }
    .money{
        text-align: center;
        font-size: 35px;
        line-height: 30px;
     }
    .money .yuan{
        font-size: 14px;
    }
    .van-popup{
        box-sizing: border-box;
        padding: 20px 15px;
    }
    .van-popup h3{
        font-size: 16px;
        text-align: center;
        font-weight: normal;
        margin-bottom: 10px;
        color: #333;
    }
    .van-popup p{
        color: #666;
    }
    .banner{
        position: fixed;
        bottom:0;
        left: 0;
        width: 100%;
    }
</style>
