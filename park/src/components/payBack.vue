<template>
    <div class="payBack">
        <div class="flexContentBox">
            <!--轮播 start-->
            <div class="banner">
                <div class="load" v-if="loadingShow">
                    <van-loading class="loading" type="spinner" />
                </div>
                <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-009'"></banner-part>
            </div>
            <!--轮播 end-->

            <div class="outBanner">
                <!--车牌组件 start-->
                <plate-number @getPlateLicense="getCarNum" :confirmTxt="confirmTxt"></plate-number>
                <!--车牌组件 end-->

                <!--历史搜索记录 start-->
                <div class="history">
                    <div class="load" v-if="loadingShow2 && carList.length===0">
                        <van-loading class="loading" type="spinner" />
                    </div>
                    <div class="historyList" v-if="carList.length>0">
                        <div class="item" v-for="(item,index) in carList" :key="index" @click="getCarNum(item.car_number)">
                            <span>{{item.car_number}}</span>
                        </div>
                    </div>
                    <div class="historyList" v-if="noHistory">
                        暂无车辆
                    </div>
                </div>
                <!--历史搜索记录 end-->
            </div>


            <!--轮播 start-->
            <div class="banner">
                <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-010'"></banner-part>
            </div>
            <!--轮播 end-->
        </div>



        <!--底部菜单 start-->
        <parking-menu></parking-menu>
        <!--底部菜单 end-->

    </div>
</template>

<script>
    //import { getBannerApi ,myCarApi} from '../request/api';
    import plateNumber from './plateNumber'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "payBack",
        mixins:[mixin],
        data(){
            return{
                banner:{},
                banner2:{},
                confirmTxt:'欠费缴费',
                carList:[],
                noHistory:false,
                loadingShow:true,
                loadingShow2:true
            }
        },
        components:{
            plateNumber
        },
        mounted() {
            this.getBanner();
            if(this.$store.state.myCarList.length>0){
                this.carList = this.$store.state.myCarList;
            }else{
                this.getMycar();
            }
        },
        methods:{
            //获取轮播
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-009'
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
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-010'
                }).then(res=>{
                    this.loadingShow = false;
                    if(res.code===200){
                        //console.log(res.data);
                        this.banner2 = res.data;
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //获取我的车列表
            getMycar(){
                this.$apis.myCarApi().then(res=>{
                    this.loadingShow2 = false;
                    if(res.code===200){
                        this.carList = res.data;
                        this.$store.commit('saveMyCarList',res.data);
                        if(res.data.length===0){
                            this.noHistory = true;
                        }
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //到查询结果页
            getCarNum(i){
                this.$store.commit('saveArrearsList',[]);
                this.$router.push({
                    path:'/findArrears',
                    query:{
                        carNum:i
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .payBack{
        padding-bottom: 65px;
    }
    .load{
        padding: 20px 0;
    }
    .msg{
        text-align: center;
        padding: 10px 0;
    }
    .history{
        padding: 0 15px;
        background-color: #fff;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .history h3{
        color: #444;
        padding: 10px 0 5px;
        border-bottom: 1px solid #f6f6f6;
        font-weight: normal;
    }
    .history .historyList{
        display: flex;
        flex-wrap: wrap;
        padding: 5px 0 5px;
        color: #666;
    }
    .history .historyList .item{
        width: 25%;
        line-height: 38px;
        font-size: 15px;
        text-align: center;
    }
</style>
