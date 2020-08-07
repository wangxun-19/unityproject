<template>
    <div class="myCar">
        <!--轮播 start-->
        <div class="banner">
            <div class="load" v-if="loadingShow">
                <van-loading class="loading" type="spinner" />
            </div>
            <banner-part :time="banner.interval" :bannerList="banner.items" :type="banner.type" :position="'CC-020'"></banner-part>
        </div>
        <!--轮播 end-->

        <div class="outBanner">
            <!--车列表 start-->
            <div class="top">我的车辆：（{{carList.length}}/4）</div>
            <div class="carList" v-if="carList.length > 0">
                <div class="carItem" v-for="(item,index) in carList" :key="index">
                    <div class="num">{{item.car_number}}</div>
                    <div class="r" @click="del(item.id)">
                        <div class="btn">删除</div>
                        <img src="../assets/images/right.png" alt="right">
                    </div>
                </div>
            </div>
            <div class="none" v-else>
                <img src="../assets/images/nocar.jpg" alt="nocar"/>
            </div>
            <!--车列表 start-->

            <div class="add">
                <div class="btn btnl" @click="toAddCar">
                    <span>+ 添加爱车</span>
                </div>
                <div class="btn btnr" @click="toCustom">
                    <span>车牌无法绑定</span>
                    <span>【 点击处理 】</span>
                </div>
            </div>
        </div>



        <!--轮播 start-->
        <div class="banner">
            <div class="load" v-if="loadingShow2">
                <van-loading class="loading" type="spinner" />
            </div>
            <banner-part :time="banner2.interval" :bannerList="banner2.items" :type="banner2.type" :position="'CC-021'"></banner-part>
        </div>
        <!--轮播 end-->

    </div>
</template>

<script>
    //import { getBannerApi,myCarApi,delCarApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "myCar",
        mixins:[mixin],
        data(){
            return{
                carList:[],
                banner:{},
                banner2:{},
                loadingShow:true,
                loadingShow2:true
            }
        },
        mounted(){
            if(this.$store.state.myCarList.length>0){
                this.carList = this.$store.state.myCarList;
            }else{
                this.getCar();
            }
            this.getBanner();
        },
        methods:{
            //获取轮播
            getBanner(){
                this.$apis.getBannerApi({
                    platform:1,
                    position:'CC-020'
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
                    position:'CC-021'
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
            //获取车列表
            getCar(){
                this.$apis.myCarApi().then(res=>{
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
            //是否确认删除
            del(id){
                this.$dialog.confirm({
                    title: '提示',
                    message: '是否确认删除'
                }).then(() => {
                    // on confirm
                    this.confirmDel(id)
                }).catch(() => {
                    // on cancel
                });
            },
            //确认删除
            confirmDel(id){
                this.$apis.delCarApi({
                    id
                }).then(res=>{
                    if(res.code===200){
                        let that = this;
                        this.$toast.success({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true,
                            onClose(){
                                that.getCar();
                            }
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
            //到绑定车页
            toAddCar(){
                if(this.carList.length<4){
                    this.$router.push({
                        path:'/addCar'
                    })
                }else{
                    this.$toast.fail("失败，最多绑定4辆车");
                }
            },

            toCustom(){
                this.$router.push({
                    path:'/custom'
                })
            }
        }
    }
</script>

<style scoped>
    .myCar{
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .load{
        padding: 20px 0;
    }
    .top{
        padding: 12px 15px 10px;
    }
    .carList{
        background-color: #fff;
        padding: 5px 15px;
    }
    .carItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
    }
    .carItem .r{
        display: flex;
        align-items: center;
        font-size: 12px;
    }
    .carItem .r .btn{
        border: 1px solid red;
        color: red;
        padding: 3px 10px;
        border-radius: 10px;
    }
    .carItem .r img{
        margin-left: 7px;
        width: 20px;
    }
    .none{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 50px;
    }
    .none img{
        width: 65%;
    }
    .add{
        margin: 30px auto;
        text-align: center;
    }
    .add .btn{
        padding: 0 15px;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        min-height: 45px;
        margin: 0 10px;
        vertical-align: middle;
    }
    .add .btnl{
        background-color: #ff8500;
    }
    .add .btnr{
        background-color: #336aa2;
        font-size: 12px;
    }
</style>
