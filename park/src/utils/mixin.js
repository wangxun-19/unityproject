import getquery from '../utils/getquery'
export default {
    data() {
        return {
            name: "mixin"
        };
    },
    created() {
        //  this.allShare();
    },
    mounted() {},
    methods: {
        //设置默认分享
        allShare() {
            if (!this.$route.meta.myShare) {
                this.$wxMethod.share(
                    {
                        title: "自助缴费", // 分享标题
                        desc: this.$route.meta.title, // 分享描述
                        icon:
                            "http://www.zjlaishang.com/resource/uploads/my/common_share.jpg"
                    },
                    res => {
                        console.log("通用分享设置成功");
                    }
                );
            }
        },
        //时间转化
        transTime(time, format) {
            //format
            //默认  2019-11-11 11:11

            //1 2019-11-11 11:11:11
            //2 2019-11-11 11:11
            //3 2019.11.11 11:11:11
            //4 2019.11.11 11:11
            //5 2019/11/11 11:11:11
            //6 2019/11/11 11:11
            //7 11-11 11:11
            //8 11.11 11:11
            //9 11/11 11:11
            //10 11.11
            //11 11/11
            //12 11-11
            //13 2019/11/11
            //14 2019-11-11
            //15 2019/11/11
            let newTime = new Date(time * 1000);
            let fullYear = newTime.getFullYear();
            let month = newTime.getMonth() + 1;
            let date = newTime.getDate();
            let hour = newTime.getHours();
            let minutes = newTime.getMinutes();
            let second = newTime.getSeconds();
            if (month < 10) {
                month = "0" + month;
            }
            if (date < 10) {
                date = "0" + date;
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (second < 10) {
                second = "0" + second;
            }
            switch (format) {
                case 1:
                    return `${fullYear}-${month}-${date} ${hour}:${minutes}:${second}`;
                case 2:
                    return `${fullYear}-${month}-${date} ${hour}:${minutes}`;
                case 3:
                    return `${fullYear}.${month}.${date} ${hour}:${minutes}:${second}`;
                case 4:
                    return `${fullYear}.${month}.${date} ${hour}:${minutes}`;
                case 5:
                    return `${fullYear}/${month}/${date} ${hour}:${minutes}:${second}`;
                case 6:
                    return `${fullYear}/${month}/${date} ${hour}:${minutes}`;
                case 7:
                    return `${month}-${date} ${hour}:${minutes}`;
                case 8:
                    return `${month}.${date} ${hour}:${minutes}`;
                case 9:
                    return `${month}/${date} ${hour}:${minutes}`;
                case 10:
                    return `${month}.${date}`;
                case 11:
                    return `${month}/${date}`;
                case 12:
                    return `${month}-${date}`;
                case 13:
                    return `${fullYear}.${month}.${date}`;
                case 14:
                    return `${fullYear}-${month}-${date}`;
                case 15:
                    return `${fullYear}/${month}/${date}`;
                case 16:
                    return `${fullYear}年${month}月${date}日`;
                case 17:
                    return `${fullYear}年${month}月${date}日 ${hour}:${minutes}:${second}`;
                case 18:
                    return `${fullYear}年${month}月${date}日 ${hour}:${minutes}`;
                default:
                    return `${fullYear}-${month}-${date} ${hour}:${minutes}`;
            }
        }
    },
    beforeDestroy() {
        if (this.loading) {
            console.log("取消loading");
            this.loading.clear();
        }
    },
    beforeRouteEnter(to, from, next) {
        let token = localStorage.getItem("token");
        let ua = window.navigator.userAgent.toLowerCase();
		let type = getquery.getQueryString("type");
		let code = getquery.getQueryString("code");
		if(type == "home"){
            if(navigator.userAgent.indexOf('iPhone') != -1){
                let wechaturl = window.location + '';
                localStorage.setItem("wechaturl",wechaturl);
            }
            window.location.href = "http://house.zjlaishang.com:9001?code="+code
        }
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            if (to.path === "/" || to.path==="/error") {
                next();
            } else {
                if (token) {
                    console.log(token)
                    next();
                } else {
                    localStorage.setItem("authBefore", window.location.href);
                    next("/");
                }
            }
        } else {
            if (to.path === "/") {
                next("/index");
            } else {
                next();
            }
        }
        //console.log(to.path);
    }
};
