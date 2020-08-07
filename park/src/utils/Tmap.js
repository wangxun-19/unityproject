/**Created by yiqu on 2019/7/29*/
export function TMap(key) {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(qq)//注意这里
        };
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://map.qq.com/api/js?v=2.exp&libraries=geometry&callback=init&key="+key;

        script.onerror = reject;
        document.body.appendChild(script);
    })
}
