<template>
    <div class="newsContent">

        <div class="weui-article">
            <h1>{{detail.title}}</h1>
            <p v-if="detail.create_time">{{detail.create_time.slice(0,10)}}</p>
            <section v-html="detail.content"></section>
        </div>

        <div class="sideBox" v-if="detail.is_read===0 && showTime" >
            <span class="color">{{taskTime}}</span>
            <span>s</span>
        </div>

        <div class="bmBtn" v-if="status==1" @click="toSignUp(detail.form_id)">
            去报名
        </div>
        <div class="bmBtn bmBtn2" v-else>
            不在活动时间内
        </div>
    </div>
</template>

<script>
    //import { getNewsContentApi,getTaskReadApi,pageDataApi } from '../request/api';
    import mixin from '../utils/mixin'; // 引入mixin文件
    export default {
        name: "newsContent",
        mixins:[mixin],
        data(){
            return{
                status:'',
                detail:{},
                taskList:[],
                task:{},
                taskTime:9,
                showTime:false,
                times:null,
                haveTask:false,
                loading:null,
                stayTimeStart:0,
                stayTimeEnd:0,
                stayTime:0,
                advId:'',
                mallId:'',
                fromPosition:''
            }
        },
        created(){
            this.loading = this.$toast.loading({
                duration: 0,
                message: '加载中...',
                forbidClick: true
            });
        },
        mounted() {
            //console.log(2)
            //console.log(this.$route.meta)
            if(this.$route.query.startTime===1){
                this.stayTimeStart = parseInt(new Date().getTime()/1000);
                this.advId = this.$route.query.advId;
                this.mallId = this.$route.query.mallId;
                this.fromPosition = this.$route.query.position;
            }
            this.getContent();
        },
        methods:{
            //获取新闻详情
            getContent(){
                let id = this.$route.query.id;
                this.$apis.getNewsContentApi({
                    id
                }).then(res=>{
                    //console.log(res.data.data);
                    this.loading.clear();
                    if(res.code===200){
                        this.detail = res.data;
                        let now = new Date().getTime();
                        if(res.data.form_info){
                            if(res.data.form_info.start_time*1000 > now){
                                this.status = 0; //未开始
                            }else if(res.data.form_info.start_time*1000 < now && res.data.form_info.end_time*1000 > now){
                                this.status = 1; //进行中
                            }else{
                                this.status = 2; //已过期
                            }
                        }
                        if(res.data.is_read===0){
                            this.showTime = true;
                            this.isDo();
                        }
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }

                }).catch(()=>{
                    this.loading.clear();
                })
            },
            //判断执行
            isDo(){
                this.times = setInterval(()=>{
                    if(this.taskTime>1){
                        this.taskTime--;
                    }else{
                        clearInterval(this.times);
                        this.taskTime = 0;
                        this.finishTask();
                        this.haveTask = false;
                    }
                },1000)
            },
            //完成任务
            finishTask(){
                this.$apis.getTaskReadApi({
                    article_id:this.$route.query.id
                }).then(res=>{
                    if(res.code===200){
                        //console.log(res.data);
                        this.showTime = false;
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            },
            //报名页
            toSignUp(id){
                if(id == undefined){
                    this.$toast.fail({
                        message: '暂时无法报名',
                        duration: 1200,
                        forbidClick: true
                    });
                    return;
                }
                this.$router.push({
                    path:'/signUp',
                    query:{
                        formId:id,
                        articleId:this.$route.query.id
                    }
                });
            }
        },
        beforeDestroy(){
            this.stayTimeEnd = parseInt(new Date().getTime()/1000);
            this.stayTime = this.stayTimeEnd - this.stayTimeStart;
            //console.log(this.stayTime)
            if(this.stayTimeStart && this.stayTime){
                let json = {
                    id:this.advId,
                    platform:1,
                    mall_id:this.mallId,
                    duration:this.stayTime,
                    position:this.fromPosition
                };

                this.$apis.pageDataApi({
                    type:1,
                    event_type:2,
                    params:JSON.stringify(json)
                }).then(res=>{
                    if(res.code===200){
                        console.log("时间提交成功")
                    }else if(res.code===400){
                        this.$toast.fail({
                            message: res.msg,
                            duration: 1200,
                            forbidClick: true
                        });
                    }
                })
            }
        },
        destroyed(){
            if(this.times) { //离开页面关闭定时器
                clearInterval(this.times);
            }
        },
        beforeRouteLeave(to,from,next){
            to.meta.keepAlive = true;
            next();
        }
    }
</script>

<style scoped>
    .newsContent{
        position: relative;
        background-color: #fff;
        padding-bottom: 100px;
    }
    .sideBox{
        position: fixed;
        right: 0;
        top: 50%;
        z-index: 99;
        width: 60px;
        height: 96px;
        margin-top: -30px;
        display: flex;
        justify-content: center;
        background: url('../assets/images2/readPic.gif') no-repeat center center/100%;
    }
    .sideBox span{
        width: 22%;
        margin-top: 63px;
        text-align: center;
        color: #eee;
        font-size: 17px;
    }
    .article{
        font-size: 17px;
        padding: 15px;
        color: rgba(0, 0, 0, 0.9);
    }
    .article h1 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: .9em;
        line-height: 1.4;
        color: #191919;
    }
    .article h2 {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: .34em;
        line-height: 1.4;
        color: #191919;
    }
    .article >>> *{
        max-width: 100% !important;
        box-sizing: border-box;
        word-wrap: break-word;
    }
    .bmBtn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 13px 0;
        background-color: #dab076;
        color: #fff;
        text-align: center;
    }
	.bmBtn2{
		background-color: gray;
	}
</style>
