<template>
    <div class="myCar">
        <div class="flexContentBox">
            <!--轮播 start-->
            <div class="banner">
                <div class="load" v-if="loadingShow">
                    <van-loading class="loading" type="spinner" />
                </div>
                <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-018'"></banner-part>
            </div>
            <!--轮播 end-->

            <div class="outBanner">
                <!--车列表 start-->
                <div class="center">
                    <div class="load" v-if="loadingShow2 && carList.length===0">
                        <van-loading class="loading" type="spinner" />
                    </div>
                    <div class="carList" v-if="carList.length > 0">
                        <van-cell-group>
                            <van-cell is-link v-for="(item,index) in carList" :key="index" @click="findResult(item.car_number)">
                                <span class="iconfont icon-clgl"></span>
                                <span>{{item.car_number}}</span>
                            </van-cell>
                        </van-cell-group>

                    </div>
                    <div class="none" v-else>
                        <img src="../assets/images/nocar.jpg" alt="nocar"/>
                    </div>
                </div>
                <!--车列表 start-->

                <div class="add">
                    <van-button type="primary" @click="toCarManage" color="#ff8500">车辆管理</van-button>
                    <van-button type="primary" @click="toPayRecord" color="#336aa2">缴费记录</van-button>
                </div>
            </div>

            <!--轮播 start-->
            <div class="banner">
                <div class="load" v-if="loadingShow3">
                    <van-loading class="loading" type="spinner" />
                </div>
                <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-019'"></banner-part>
            </div>
            <!--轮播 end-->
        </div>

        <!--底部菜单 start-->
        <parking-menu></parking-menu>
        <!--底部菜单 end-->
    </div>
</template>

<script>
    //import { getBannerApi,myCarApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "myCar",
        mixins:[mixin],
        data(){
            return{
                ico:require('../assets/images/car.png'),
                banner:{},
                banner2:{},
                carList:[],
                loadingShow:true,
                loadingShow2:true,
                loadingShow3:true
            }
        },
        mounted(){
            this.getBanner();
            if(this.$store.state.myCarList.length>0){
                this.carList = this.$store.state.myCarList;
                this.loadingShow2 = false;
            }else{
                this.getCar();
            }

        },
        methods:{
            //获取轮播图
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-018'
                }).then(res=>{
                    this.loadingShow = false;
                    if(res.code===200){
                        //console.log(res.data.data);
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
                    position:'CC-019'
                }).then(res=>{
                    this.loadingShow3 = false;
                    if(res.code===200){
                        //console.log(res.data.data);
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
            //到轮播图或者公告跳转页
            toUrl(item){
                //外部跳转
                if(item.is_inside===0){
                    location.href = item.url;
                }
                //内部跳转
                if(item.is_inside===1 && item.link_id){
                    if(item.link==="news"){
                        this.$router.push({
                            path:'/newsContent',
                            query:{
                                id:item.link_id
                            }
                        })
                    }
                    if(item.link==="shop"){
                        this.$router.push({
                            path:'/brandDetail',
                            query:{
                                id:item.link_id
                            }
                        });
                    }
                }
            },
            //获取车列表
            getCar(){
                this.$apis.myCarApi().then(res=>{
                    this.loadingShow2 = false;
                    if(res.code===200){
                        this.carList = res.data;
                        this.$store.commit('saveMyCarList',res.data);
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //查找车信息
            findResult(num){
                this.$router.push({
                    path:'/findResult',
                    query:{
                        carNum:num
                    }
                })
            },
            //到车辆管理页
            toCarManage(){
                this.$router.push({
                    path:'/carManage',
                })
            },
            //到缴费记录页
            toPayRecord(){
                this.$router.push({
                    path:'/payRecord',
                })
            }
        }
    }
</script>

<style scoped>
    .myCar{
        padding-bottom: 65px;
    }
    .load{
        padding: 20px 0;
    }
    .carList{
        background-color: #fff;
        padding: 5px 15px;
    }
    .van-cell{
        font-size: 18px;
    }
    .van-cell__value--alone{
        color: #444;
    }
    .none{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
    }
    .none img{
        width: 65%;
    }
    .add{
        width: 100%;
        margin: 25px auto;
        text-align: center;
    }
    .iconfont{
        margin-right: 5px;
        font-size: 20px;
    }
    button{
        margin: 0 10px;
    }
</style>
