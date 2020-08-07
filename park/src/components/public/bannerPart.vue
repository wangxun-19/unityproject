<template>
    <div class="bannerPart">
        <!--jpg/png-->
        <van-swipe :autoplay="time * 1000" v-if="type == 1">
            <van-swipe-item v-for="(item, index) in bannerList" :key="index">
                <van-image
                    :src="item.images"
                    @click="toUrl(item)"
                    @load="load"
                />
            </van-swipe-item>
        </van-swipe>
        <!--video-->
        <div class="video" v-if="type == 2 && browserType" ref="videoWrap">
            <div class="mp4">
                <div class="videoBox">
                    <video
                        poster="../../assets/images2/video.png"
                        id="video"
                        ref="video"
                        autoplay
                        loop
                        :src="bannerList.images"
                        type="video/mp4"
                        @click="suspend"
                        x5-video-player-type="h5-page"
                        playsinline
                        webkit-playsinline="true"
                        preload
                    ></video>
                </div>
            </div>
        </div>
        <!--gif-->
        <div class="gif" v-if="type == 3">
            <img
                :src="bannerList.images"
                alt="gif"
                @click="toUrl(bannerList)"
            />
        </div>
    </div>
</template>

<script>
//import { pageDataApi } from '../../request/api';
//import wx from 'weixin-js-sdk'
export default {
    name: "bannerPart",
    props: ["bannerList", "time", "type", "position"],
    data() {
        return {
            browserType: true,
            videoA: true,
            videoI: true
        };
    },
    created() {
        if (this.$browserType.browserType() === "zfb") {
            this.browserType = false;
        } else {
            this.browserType = true;
        }

        // if(localStorage.getItem('system')){
        //     if(localStorage.getItem('system')==="android"){
        //         this.videoI = false;
        //     }
        //     if(localStorage.getItem('system')==="ios"){
        //         this.videoA = false;
        //     }
        // }
    },
    mounted() {
        if (this.type === 2) {
            this.$refs.video.play();
        }

        wx.ready(() => {
            if (this.type === 2) {
                //alert(wx)
                this.$refs.video.play();
            }
        });
    },
    methods: {
        //图片加载完成
        load() {
            this.$emit("load");
        },
        //到详情页
        toUrl(item) {
            if (this.browserType) {
                let json = {
                    id: item.id,
                    platform: 1,
                    position: this.position
                };
                this.$apis
                    .pageDataApi({
                        type: 1,
                        event_type: 1,
                        params: JSON.stringify(json)
                    })
                    .then(res => {
                        if (res.code === 200) {
                            console.log("点击次数提交成功");
                        } else if (res.code === 400) {
                            this.$toast.fail({
                                message: res.msg,
                                duration: 1200,
                                forbidClick: true
                            });
                        }
                    });
                //外部跳转
                if (item.is_inside === 0) {
                    location.href = item.url;
                }
                //内部跳转
                if (item.is_inside === 1 && item.link_id) {
                    if (item.link === "news") {
                        this.$router.push({
                            path: "/newsContent",
                            query: {
                                startTime: 1,
                                id: item.link_id,
                                advId: item.id,
                                position: this.position
                            }
                        });
                    }
                    if (item.link === "shop") {
                        this.$router.push({
                            path: "/brandDetail",
                            query: {
                                startTime: 1,
                                id: item.link_id,
                                advId: item.id,
                                position: this.position
                            }
                        });
                    }
                }
            }
        },
        //视频播放
        suspend() {
            let video = this.$refs.video;
            //alert(video.paused);
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }
};
</script>

<style scoped>
.bannerPart {
    position: relative;
}
video {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 150px;
    vertical-align: top;
}
.videoBox img {
    margin: auto;
}
.gif {
    width: 100%;
}
.gif img {
    width: 100%;
}
</style>
