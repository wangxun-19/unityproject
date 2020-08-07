<template>
    <div class="addCar">
        <!--轮播 start-->
        <div class="banner">
            <div class="load" v-if="loadingShow">
                <van-loading class="loading" type="spinner" />
            </div>
            <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-022'"></banner-part>
        </div>
        <!--轮播 end-->

        <!--车牌组件 start-->
        <plate-number @getPlateLicense="getCarNum" :confirmTxt="confirmTxt"></plate-number>
        <!--车牌组件 end-->

        <!--轮播 start-->
        <div class="banner2">
            <div class="load" v-if="loadingShow2">
                <van-loading class="loading" type="spinner" />
            </div>
            <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-023'"></banner-part>
        </div>
        <!--轮播 end-->

    </div>
</template>

<script>
    //import { bindCarApi,getBannerApi } from '../request/api';
    import plateNumber from './plateNumber'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "addCar",
        mixins:[mixin],
        data(){
            return{
                carNum:'',
                confirmTxt:'确认绑定',
                error:false,
                loadingShow:true,
                loadingShow2:true,
                banner:{},
                banner2:{}
            }
        },
        components:{
            plateNumber
        },
        mounted(){
            this.getBanner();
        },
        methods:{
            //获取轮播
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-022'
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
                    position:'CC-023'
                }).then(res=>{
                    this.loadingShow2 = false;
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
            //获取车牌
            getCarNum(i){
                this.carNum = i;
                //console.log(i);
                this.bindCar(i);
            },
            //绑定车
            bindCar(i){
                this.$apis.bindCarApi({
                    car_number:i
                }).then(res=>{
                    if(res.code===200){
                        this.$toast.success(res.msg);
                        setTimeout(()=> {
                            this.$store.commit('saveMyCarList',[]);
                            this.$router.go(-1);
                        },1000);

                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .banner2{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
    }
</style>
