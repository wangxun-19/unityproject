<template>
    <div class="maps">

        <!--地图容器 start-->
        <div id="container">

        </div>
        <!--地图容器 end-->

        <!-- 左上角 start-->
        <div class="leftTop">
            <div class="state">
                <span class="exist"></span>
                <p>空</p>
            </div>
            <div class="state">
                <span class="none"></span>
                <p>满</p>
            </div>
            <div class="state">
                <span class="choose"></span>
                <p>选中</p>
            </div>
        </div>
        <!-- 左上角 end-->

        <!--底部信息 start-->
        <parking-msg v-if="show" :msg="parkingMsg" @navigation="navigation" @route="route"></parking-msg>
        <!--底部信息 end-->

    </div>
</template>

<script>
    //import { parkingListApi} from '../request/api';
    import { TMap } from '../utils/Tmap';
    //import wx from 'weixin-js-sdk'
    import parkingMsg from './public/parkingMsg'
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "maps",
        mixins:[mixin],
        data(){
            return{
                tit:'导航',
                latitude:"",
                longitude:"",
                none_ico:require('../assets/images/full_ico.png'),
                exist_ico:require('../assets/images/more_ico.png'),
                choose_ico:require('../assets/images/choose_ico.png'),
                show:false,
                parkingMsg:{},
                previousIco:'',
                previousMarker:null,
                checked:false,
                result:[],
                start:[],
                end:[],
                endJW:[],
                distanceList:[],
                loading:null
            }
        },
        components:{
            parkingMsg
        },
        created(){
            this.loading = this.$toast.loading({
                duration: 0,
                message: '载入中...',
                forbidClick: true
            });
        },
        mounted() {
            this.getLocation();
            //若vuex中存在数据，则取出数据，否则请求数据
            if(this.$store.state.parkingList.length>0){
                this.$store.state.parkingList.map((item)=>{
                    if(item.remain===0){
                        this.result.push(
                            Object.assign({},item,{state:false})
                        )
                    }else{
                        this.result.push(
                            Object.assign({},item,{state:true})
                        )
                    }
                    this.endJW.push([item.latitude,item.longitude]);
                });
            }else{
                this.getData();
            }
        },
        methods:{
            //获取自身定位
            getLocation(){
                let that = this;
                this.$wxMethod.getLocation((res)=>{
                    that.latitude = res.latitude;
                    that.longitude = res.longitude;
                    that.createMap(res.latitude,res.longitude);
                })
            },
            //创建地图
            createMap(latitude,longitude){
                let that = this;
                TMap('TZFBZ-UXFKV-4ABPP-UPL3O-6O7H2-WUFZS').then(qq => {
                    let map = new qq.maps.Map(document.getElementById("container"), {
                        // 地图的中心地理坐标。
                        center: new qq.maps.LatLng(latitude, longitude),
                        zoom: 17,
                        zoomControl: true,    //不启用缩放控件
                        mapTypeControlOptions: {  //设置控件的地图类型为普通街道地图
                            mapTypeIds: qq.maps.MapTypeId.ROADMAP
                        }
                    });
                    that.loading.clear();
                    //计算距离
                    for(let i=0;i<that.endJW.length;i++){
                        let start = new qq.maps.LatLng(latitude, longitude);
                        let end = new qq.maps.LatLng(that.endJW[i][0], that.endJW[i][1]);
                        let distance = Math.round(qq.maps.geometry.spherical.computeDistanceBetween(start, end)*10)/10;
                        that.distanceList.push(distance);
                    }
                    for(let i=0; i<this.result.length; i++){
                        let data = this.result[i];
                        //设置图标
                        let ico;
                        if(data.state){
                            ico = this.exist_ico;
                        }
                        if(!data.state){
                            ico = this.none_ico;
                        }
                        //创建标记
                        let marker = new qq.maps.Marker({
                            position: new qq.maps.LatLng(data.latitude, data.longitude),
                            icon:ico,
                            map: map
                        });

                        //***将必要的数据存入每一个对应的marker对象
                        marker.id = data.id;
                        marker.name = data.park_name;
                        marker.total = data.total;
                        marker.remain = data.remain;
                        marker.state = data.state;
                        marker.address = data.address;
                        marker.selected = false;
                        marker.distance = that.distanceList[i];
                        qq.maps.event.addListener(marker, 'click', function() {    //获取标记的点击事件
                            marker.selected = true;
                            if ( marker !== that.previousMarker && that.checked ) {
                                //console.log(that.previousMarker);
                                that.previousMarker.setIcon(that.previousIco);
                                that.previousMarker.selected = false;
                                that.checked = false;
                            }
                            that.bottomMsg(marker);
                            if(marker !== that.previousMarker){
                                that.previousIco = marker.icon;
                                that.previousMarker  = marker;
                            }
                            marker.setIcon(marker.selected?that.choose_ico:ico);//改变图标
                            that.checked = true;
                        });

                    }
                    //设置获取驾车线路方案的服务
                    var directionsService = new qq.maps.DrivingService({
                        map: map,
                        end:that.end
                        //展现结果
                        //panel: document.getElementById('infoDiv')
                    });
                    var start = that.start;
                    var end = that.end;
                    var policy = 'LEAST_TIME';
                    //设置驾车方案
                    directionsService.setPolicy(qq.maps.DrivingPolicy[policy]);
                    //设置驾车的区域范围
                    directionsService.setLocation("全国");
                    //设置驾驶路线的起点和终点
                    if(start !== [] && end !== []){
                        directionsService.search(
                            new qq.maps.LatLng(start[0], start[1]),
                            new qq.maps.LatLng(end[0], end[1])
                        );
                    }


                });
            },
            //获取停车场列表
            getData(){
                this.$apis.parkingListApi().then(res=>{
                    if(res.code===200){
                        res.data.map((item)=>{
                            if(item.remain===0){
                                this.result.push(
                                    Object.assign({},item,{state:false})
                                )
                            }else{
                                this.result.push(
                                    Object.assign({},item,{state:true})
                                )
                            }
                            this.endJW.push([item.latitude,item.longitude]);
                        });


                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //底部信息显示
            bottomMsg(parkingMsg){
                //console.log(parkingMsg);
                this.show = false;
                this.parkingMsg = parkingMsg;
                this.show = true;
            },
            //路线
            route(msg){
                this.start = [this.latitude,this.longitude];
                this.end = [msg.position.lat,msg.position.lng];
                //移除原有地图
                let container = document.getElementById('container');
                let mapDiv = container.getElementsByTagName('div')[0];
                container.removeChild(mapDiv);
                //重构地图
                this.createMap();
            },
            // 打开导航
            navigation(position,name){
                this.$wxMethod.openLocation({
                    latitude:Number(position.lat), // 纬度，浮点数，范围为90 ~ -90
                    longitude:Number(position.lng), // 经度，浮点数，范围为180 ~ -180。
                    name, // 位置名
                })
            }
        }
    }
</script>

<style scoped>
    #container{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .leftTop{
        position: absolute;
        left: 10px;
        top: 10px;
        background-color: #fff;
        border-radius: 3px;
    }
    .leftTop .state{
        display: flex;
        align-items: center;
        padding: 1px 5px;
    }
    .leftTop .state span{
        width: 12px;
        height: 12px;
        border-radius: 100%;
        margin-right: 3px;
    }
    .leftTop .state span.exist{
        background-color: #22aa39;
    }
    .leftTop .state span.none{
        background-color: red;
    }
    .leftTop .state span.choose{
        background-color: #1296db;
    }
</style>
