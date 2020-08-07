<template>
    <div id="app" ref="app">
        <keep-alive>
            <!--可被缓存的视图组件-->
            <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
        </keep-alive>
        <!--不可被缓存的视图组件-->
        <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        provide(){
            return{
                reload:this.reload,
                browserType:true
            }
        },
        data(){
            return{
                isRouterAlive:true
            }
        },
        mounted(){
            if(this.$browserType.browserType()==='zfb'){
                this.browserType = false;
            }else{
                this.browserType = true;
            }
        },
        methods:{
            //刷新页面
            reload(){
                this.isRouterAlive = false;
                this.$nextTick(()=>{
                    this.isRouterAlive = true;
                })
            }
        }
    }
</script>

<style>
    *{
        margin: 0;
        padding: 0;
    }
    html,body{
        font-size: 14px;
        color: #333;
        background-color: #f4f4f4;
        font-family: "Arial","Microsoft YaHei",sans-serif;
    }
    ul,li{
        list-style: none;
    }
    a{
        text-decoration: none;
        color: #333;
    }
    img{
        display: block;
    }
    .van-toast{
        z-index: 9999999 !important;
    }
    div{
        -webkit-tap-highlight-color:rgba(255,255,255,0);
    }
    .iconfont{
        display: inline-block;
        position: relative;
        font: 14px/1 "iconfont";
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
    }
    .iconfont::before{
        display: inline-block;
    }

    .loading{
        text-align: center;
    }
    .flexContentBox{
    	height: calc( 100vh - 65px);
    	display: flex;
    	flex-direction: column;
    	justify-content: space-between;
    }
    .outBanner{
		position: relative;
    	flex: 1;
    	overflow-y: scroll;
    }
    .van-image{
        vertical-align:top;
    }
    input{
        -webkit-appearance:none;
    }
</style>
