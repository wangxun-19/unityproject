<template>
    <div class="noticeList">
        <div class="viewBox" ref="viewBox">
            <div class="item" v-for="(item,index) in noticeList" :key="index" @click="toUrl(item)">
                <div class="l">
                    <div class="t">{{item.content}}</div>
                    <div class="b">
                        <div class="ll">{{transTime(item.create_time)}}</div>
                        <div class="rr">查看详情 ></div>
                    </div>
                </div>
                <div class="r" :style="{backgroundImage: 'url(' + noticeBg(item.image) + ')'}"></div>
            </div>
            <div class="noData" v-if="noData">
                暂无公告
            </div>
        </div>
    </div>
</template>

<script>
    //import { allNoticesApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "noticeList",
        mixins:[mixin],
        data(){
            return{
                noticeImg:require('../assets/images/adv.png'),
                error:false,
                noticeList:[],
                newList:[],
                size:10,
                start:0,
                loading:null,
                end:false,
                noData:false,
                isMoreLoad:false,
                loadingImg:false,
            }
        },
        created(){
            this.platform = this.$route.query.platform;
            this.position = this.$route.query.position;
            this.loading = this.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true
            });
        },
        mounted() {
            this.$refs.viewBox.addEventListener('scroll', this.scroll)
            this.getList();
        },
        methods:{
            //获取公告列表
            getList(){
				//console.log(2)
                this.$apis.allNoticesApi({
                    size:this.size,
                    start:this.start,
					platform:this.platform,
					position:this.position
                }).then(res=>{
                    this.loading.clear();
                    if(res.code===200){
                        if(res.data.length>0){
                            this.noticeList = this.noticeList.concat(res.data);
                        }else{
                            this.noData = true;
                        }
                        if(res.data.length < this.size && res.data.length > 0){
                            this.$toast('已加载全部数据~');
                            this.end = true;
                        }
                        this.isMoreLoad = res.data.length === this.size;

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
            },
            noticeBg(bg){
                 if(bg){
                     return bg;
                 } else{
                     return this.noticeImg;
                 }
            },
            //到轮播图或者公告跳转页
            toUrl(item){
                //console.log(item);
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
            //触底加载更多
            scroll(){
                let _this = this;
                let scr = this.$refs.viewBox.scrollTop; // 向上滚动的那一部分高度
                let clientHeight = this.$refs.viewBox.clientHeight; // 屏幕高度也就是当前设备静态下你所看到的视觉高度
                let scrHeight = this.$refs.viewBox.scrollHeight; // 整个网页的实际高度，兼容Pc端
                if(scr + clientHeight + 10 >= scrHeight){
                    if(_this.isMoreLoad && !_this.loadingImg){ //this.isMoreLoad控制滚动是否加载更多
                        this.$toast.loading({
                            mask: true,
                            message: '加载中...',
                            duration:500
                        });
                        _this.start += _this.size; // 加载更多
                        _this.scrollLoadMore();
                    }else{
                        return;
                    }
                }
            },
            scrollLoadMore(){
                // 防止多次加载
                if(this.loadingImg){
                    return false;
                }
                this.loadingImg = true;
                if(!this.end){
                    this.getList();
                }
            },
            //时间转化
            transTime(time){
                let nowTime = new Date(time*1000);
                let year = nowTime.getFullYear();
                let month = nowTime.getMonth()+1;
                let date = nowTime.getDate();
                return `${year}-${month}-${date}`
            }
        }
    }
</script>

<style scoped>
    .noticeList{
        height: 100vh;
        background-color: #fff;
    }
    .noticeList .viewBox{
        height: 100%;
        overflow-y: scroll;
    }
    .viewBox .item{
        display: flex;
        padding: 10px 15px;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
    }
    .viewBox .item .l{
        flex: 1;
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .viewBox .item .l .t{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: #555;
        font-size: 15px;
        font-weight: bold;
    }
    .viewBox .item .l .b{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    .viewBox .item .l .b .ll{
        color: #333;
    }
    .viewBox .item .l .b .rr{
        color: #999;
    }
    .viewBox .item .r{
        flex-shrink: 0;
        width: 120px;
        height: 100px;
        background: no-repeat center center/cover;
    }
</style>
