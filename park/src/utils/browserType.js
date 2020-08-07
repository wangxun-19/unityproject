/**Created by yiqu on 2019/10/29*/
export default{
    browserType(){
        let ua = window.navigator.userAgent.toLowerCase();
        if ( ua.match(/MicroMessenger/i) == 'micromessenger' ) {
            return 'wx'
        } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
            return 'zfb'
        } else {
            return 'other'
        }
    }
}
