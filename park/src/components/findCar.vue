<template>
    <div class="findCar">

        <div class="flexContentBox">
            <div class="fixedTop" ref="top">
                <!--搜索框 start-->
                <div class="searchBox">
                    <div class="searchBar" @click="toSearchPage">
                        <span class="iconfont icon-sousuo"></span>
                        <span>搜索停车场</span>
                    </div>
                    <div class="ico" @click="toMap">
                        <van-icon class-prefix="icon" name="dingwei" class="iconfont van-grid-item__icon" size="22px"/>
                        <p>地图</p>
                    </div>
                </div>
                <!--搜索框 end-->

                <!--轮播 start-->
                <div class="banner">
                    <van-loading class="loading" type="spinner" v-if="loadingShow"/>
                    <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" @load="load" :position="'CC-004'"></banner-part>
                </div>
                <!--轮播 end-->
            </div>
            <div class="outBanner" ref="viewBox">
                <div class="wrap">
                    <div class="parkingList">
                        <van-loading class="loading" type="spinner" v-if="loadingShow2 && parkingList.length===0"/>
                        <div class="item" v-for="(item,index) in parkingList" :key="index">
                            <div class="l" @click="toParkingDetail(item)">
                                <div class="name">{{item.park_name}}</div>
                                <div class="add">
                                    <span>{{item.address}}</span>&nbsp;&nbsp;
                                    <span>{{item.distanceKm}}km</span>
                                </div>
                                <div class="num">
                                    <span>空车位：</span>
                                    <span class="color" v-if="item.remain != -1">{{item.remain}}</span>
                                    <span class="color" v-if="item.remain == -1">未获取到数据</span>
                                </div>
                            </div>
                            <div class="r" @click="navigation(item.latitude,item.longitude,item.park_name)">
                                <img src="../assets/images/redit.png" alt="redit"/>
                                <span>导航</span>
                            </div>
                        </div>
                        <div class="nodata" v-if="startHide && parkingList.length===0">
                            <van-icon name="warning-o" size="60px"/>
                            <p>无结果</p>
                        </div>
                    </div>
                </div>

            </div>


            <!--轮播 start-->
            <div class="banner2">
                <div class="refresh" @click="reFlash">
                    <img src="../assets/images/flash.png" ref="ico">
                </div>

                <van-loading class="loading" type="spinner" v-if="loadingShow3"/>
                <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-005'"></banner-part>
            </div>
            <!--轮播 end-->

        </div>


        <!--底部菜单 start-->
        <parking-menu></parking-menu>
        <!--底部菜单 end-->
    </div>
</template>

<script>
    //import { getBannerApi, parkingListApi} from '../request/api';
    import { TMap } from '../utils/Tmap';
    //import wx from 'weixin-js-sdk'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "findCar",
        mixins:[mixin],
        data(){
            return{
                tit:'寻车',
                startHide:false,
                banner:{},
                banner2:{},
                searchTxt:'',
                nonceStr:'',
                timestamp:'',
                signature:'',
                myLatitude:'',
                myLongitude:'',
                parkingList:[],
                // endJW:[],
                // distanceList:[],
                paddingTop:"",
                loadingShow:true,
                loadingShow2:true,
                loadingShow3:true,
                scrollTxt:0
            }
        },
        activated() {
            if(this.scrollTxt > 0){
                //console.log(this.scrollTxt);
                this.$refs.viewBox.scrollTo(0, this.scrollTxt);
                this.scrollTxt = 0;
                this.$refs.viewBox.addEventListener('scroll', this.scroll);
            }
        },
        mounted() {
            let viewBox = this.$refs.viewBox;
            viewBox.addEventListener('scroll', this.scroll)
            this.getBanner();

            //若vuex中存在数据，则取出数据，否则请求数据
            if(this.$store.state.parkingList.length>0){
                this.parkingList = this.$store.state.parkingList;
                this.getLocation();
            }else{
                this.getData();
            }
        },
        methods:{
            //
            scroll(){
                let scr = this.$refs.viewBox.scrollTop; // 向上滚动的那一部分高度
                this.scrollTxt = scr;
            },
            //获取自身定位
            getLocation(){
                let that = this;
                this.$wxMethod.getLocation((res)=>{
                    that.myLatitude = res.latitude;
                    that.myLongitude = res.longitude;
                    that.createMap(res.latitude,res.longitude);
                })
            },
            //获取轮播图
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-004'
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
                    position:'CC-005'
                }).then(res=>{
                    this.loadingShow3 = false;
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
            //到轮播图跳转页
            toUrl(item){
                //外部跳转
                if(item.is_inside===0){
                    location.href = item.url;
                }
                //内部跳转
                if(item.is_inside===1){
                    if(item.link==="news"){
                        this.$router.push({
                            path:'/newsContent',
                            query:{
                                id:item.id
                            }
                        })
                    }
                    if(item.link==="brand"){
                        this.$router.push({
                            path:'/brandDetail',
                            query:{
                                id:item.id
                            }
                        });
                    }
                }
            },

            //创建地图
            createMap(latitude,longitude){
                let that = this;
                TMap('TZFBZ-UXFKV-4ABPP-UPL3O-6O7H2-WUFZS').then(qq => {
                    let start = new qq.maps.LatLng(latitude, longitude);
                    for(let i=0;i<that.parkingList.length;i++){
                        let end = new qq.maps.LatLng(that.parkingList[i].latitude, that.parkingList[i].longitude);
                        let distance = Math.round(qq.maps.geometry.spherical.computeDistanceBetween(start, end)*10)/10;
                        that.parkingList[i]['distance'] = distance;
                        that.parkingList[i]['distanceKm'] = (distance/1000).toFixed(2);
                    }
                    that.parkingList = that.sortKey(that.parkingList, 'distance');
                });

            },
            //获取停车场列表数据
            getData(){
                this.$apis.parkingListApi().then(res=>{
                    this.loadingShow2 = false;
                    if(res.code===200){
                        //console.log(res);
                        this.parkingList = res.data;
                        this.$store.commit('saveParkingList',res.data);
                        this.getLocation();

                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //到搜索页面
            toSearchPage(){
                this.$router.push('/parkingSearch')
            },
            //到地图页
            toMap(){
                this.$router.push({
                    path:'/maps'
                })
            },
            //导航
            navigation(latitude,longitude,park_name){
                //console.log(`纬度：${latitude},经度：${longitude}`)
                this.$wxMethod.openLocation({
                    latitude:Number(latitude), // 纬度，浮点数，范围为90 ~ -90
                    longitude:Number(longitude), // 经度，浮点数，范围为180 ~ -180。
                    name: park_name, // 位置名
                })
            },
            //刷新页面
            reFlash(){
                this.$store.commit('saveParkingList',[]);
                this.getData();
                this.$refs.ico.classList.add('rotate');
                setTimeout(()=>{
                    this.$refs.ico.classList.remove('rotate');
                },1500)
            },
            //获取高度,设置高度
            load(){
                //console.log(this.$refs.banner.offsetHeight);
                let Top = this.$refs.top.offsetHeight + "px";
                this.paddingTop = Top;
            },
            //到停车场详情
            toParkingDetail(item){
                //console.log(item);
                //this.$store.commit('saveCurrentRule',item.charge_rule);
                this.$router.push({
                    path:'/parkingDetail',
                    query:{
                        park_id:item.park_id,
                        distance:item.distanceKm,
                        remain:item.remain
                    }
                })
            },
            //排序
            sortKey(items, key) {
                return items.sort(function(a,b){
                    return (( a[key] < b[key] ) ? -1 : ( a[key] > b[key]) ? 1: 0 )
                })
            }
        }
    }
</script>

<style scoped>
    .searchBox{
        display: flex;
        align-items: center;
        padding: 0 15px;
        background-color: #ededed;
    }
    .searchBox .searchBar{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-radius: 15px;
        padding: 5px 0;
        margin-right: 10px;
    }
    .searchBox .searchBar .iconfont{
        margin-right: 5px;
    }
    .searchBox .ico{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        font-size: 12px;;
    }
    .banner .loading{
        margin-top: 15px;
    }
    .searchBox .ico p{
        line-height: 10px;
    }
    .parkingList .loading{
        margin-top: 40px;
    }
    .item{
        display: flex;
        padding: 13px 25px;
        border-bottom: 1px solid #f1f1f1;
        background-color: #fff;
    }
    .item .l{
        width: 75%;
    }
    .item .name{
        color: #333;
        font-size: 16px;
        margin-bottom: 5px;
    }
    .item .add{
        color: #999;
        font-size: 12px;
        margin-bottom: 10px;
    }
    .item .num{
        color: #999;
        font-size: 12px;
    }
    .item .num .color{
        color: #ff8500;
        font-weight: bold;
    }
    .item .r{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #f1f1f1;
    }
    .item .r img{
        width: 20px;
    }
    .nodata{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 50px;
    }
    .nodata p{
        margin-top: 20px;
        font-size: 16px;
    }
    .banner2{
        position: relative;
    }
    .banner2 .refresh{
        position: absolute;
        right: 10px;
        bottom: calc(100% + 10px);
        width: 40px;
        height: 40px;
        background-color: #fff;
        box-shadow: 1px 1px 6px 1px #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .rotate{
        transition: .5s;
        transform: rotate(360deg);
    }

</style>
