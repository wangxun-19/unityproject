<template>
    <div class="searchPage">
        <div class="header" ref="top">
            <div class="top">
                <div class="searchBar">
                    <form action="javascript:return true;">
                        <span class="iconfont icon-sousuo"></span>
                        <input type="search" placeholder="请输入停车场名称或者关键字" v-model="searchTxt" autofocus @search="search" ref="inputs">
                    </form>
                </div>
                <span @click="cannel" class="qx">取消</span>
            </div>
            <!--轮播 start-->
            <div class="banner" v-if="searchBefore">
                <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-006'"></banner-part>
            </div>
            <div class="banner2" v-if="!searchBefore">
                <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-007'"></banner-part>
            </div>
            <!--轮播 end-->
        </div>
        <div class="parkingList" :style="{paddingTop:paddingTop}">
            <div class="item" v-for="(item,index) in parkingList" :key="index">
                <div class="l" @click="toParkingDetail(item)">
                    <div class="name">{{item.park_name}}</div>
                    <div class="add">
                        <span>{{item.address}}</span>&nbsp;&nbsp;
                        <span>{{item.distanceKm}}km</span>
                    </div>
                    <div class="num">
                        <span>空车位：</span>
                        <span class="color" v-if="item.remain !== -1">{{item.remain}}</span>
                        <span class="color" v-if="item.remain === -1">未获取到数据</span>
                    </div>
                </div>
                <div class="r" @click="navigation(item.latitude,item.longitude,item.name)">
                    <img src="../assets/images/redit.png" alt="redit"/>
                    <span>导航</span>
                </div>
            </div>
        </div>

        <div class="nodata" v-if="noData">
            <van-icon name="warning-o" size="60px"/>
            <p>无结果</p>
        </div>

    </div>
</template>

<script>
    //import { searchParkingApi,getBannerApi } from '../request/api';
    import { TMap } from '../utils/Tmap';
    //import wx from 'weixin-js-sdk'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "searchPage",
        mixins:[mixin],
        data(){
            return{
                searchBefore:true,
                banner:{},
                banner2:{},
                searchTxt:'',
                noData:false,
                myLatitude:'',
                myLongitude:'',
                parkingList:[],
                //endJW:[],
                //distanceList:[],
                loading: null,
                paddingTop:""
            }
        },
        mounted(){
            this.$refs.inputs.focus();
            this.getBanner();
            this.paddingTop=this.$refs.top.offsetHeight + "px"
        },
        methods:{
            //获取广告
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-006'
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res..data);
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
                    position:'CC-007'
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res..data);
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
            //获取高度,设置高度
            /*load(){
                //console.log(this.$refs.banner.offsetHeight);
                let Top = this.$refs.top.offsetHeight + "px";
                this.paddingTop = Top;
            },*/
            //获取自身定位
            getLocation(){
                let that = this;
                this.$wxMethod.getLocation((res)=>{
                    that.myLatitude = res.latitude;
                    that.myLongitude = res.longitude;
                    that.createMap(res.latitude,res.longitude);
                })
            },
            //创建地图
            createMap(latitude,longitude){
                let that = this;
                //console.log(that.endJW);
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
            //搜索
            search(){
                this.loading = this.$toast.loading({
                    duration: 0,
                    message: '搜索中...',
                    forbidClick: true
                });
                this.searchBefore = false;
                this.noData = false;
                this.parkingList = [];
                if(this.searchTxt){
                    this.$apis.searchParkingApi({
                        keyword: this.searchTxt
                    }).then(res=>{
                        this.loading.clear();
                        //console.log(this.$refs.top.offsetHeight);
                        this.paddingTop = this.$refs.top.offsetHeight + "px";
                        if(res.code===200){
                            //console.log(res.data);
                            if(res.data.length>0){
                                this.parkingList = res.data;

                                /*res.data.map((item)=>{
                                    this.endJW.push([item.latitude,item.longitude]);
                                });*/
                                this.getLocation();
                            }else{
                                this.noData = true;
                            }

                        }else if(res.code===400){
                            this.$toast.fail({
                                message: res.msg,
                                duration: 1200,
                                forbidClick: true
                            });
                        }
                    }).catch(()=>{
                        this.loading.clear()
                    })
                }else{
                    this.$toast.fail("请先输入关键字");
                }
            },
            //导航
            navigation(latitude,longitude,name){
                //console.log(`纬度：${latitude},经度：${longitude}`)
                this.$wxMethod.openLocation({
                    latitude:Number(latitude), // 纬度，浮点数，范围为90 ~ -90
                    longitude:Number(longitude), // 经度，浮点数，范围为180 ~ -180。
                    name: name, // 位置名
                })
            },
            //到停车场详情
            toParkingDetail(item){
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
            //取消
            cannel(){
                this.searchTxt = "";
                this.parkingList = [];
                this.searchBefore = true;
                this.$router.go(-1);
            },
            //排序
            sortKey(items, key) {
                return items.sort(function(a,b){
                    return (( a[key] < b[key] ) ? -1 : ( a[key] > b[key]) ? 1: 0 )
                })
            }
        },
        beforeRouteEnter(to,from,next){
            next(vm=>{
                vm.$refs.inputs.focus();
            })
        },
        beforeRouteLeave(to,from,next){
            if(to.path !== "/parkingDetail"){
                this.searchTxt = "";
                this.parkingList = [];
                this.searchBefore = true;
                next()
            }else{
                next();
            }
        }
    }
</script>

<style scoped>
    .header{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
    }
    input{
        border: none;
        outline: none;
    }
    .top{
        padding: 10px 15px;
        display: flex;
        align-items: center;
        background-color: #f4f4f4;
    }
    .top .searchBar{
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 50px;
        padding: 5px 10px;
        flex: 1;
        margin-right: 10px;
    }
    .top .searchBar form{
        width: 100%;
        display: flex;
        align-items: center;
    }
    .top .searchBar input{
        flex: 1;
        margin-left: 10px;
        line-height: 27px;
    }
    .top .searchBar .iconfont{
        font-size: 20px;
        line-height: 20px;
        height: 20px;
    }
    .top .qx{
        flex-shrink: 0;
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
</style>
