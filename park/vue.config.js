//const webpack = require('webpack')
const Timestamp = new Date().getTime();

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css"];

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

    outputDir: "dist",

    assetsDir: "static",

    indexPath: "index.html",

    filenameHashing: true,

    // When building in multi-pages mode, the webpack config will contain different plugins
    // (there will be multiple instances of html-webpack-plugin and preload-webpack-plugin).
    // Make sure to run vue inspect if you are trying to modify the options for those plugins.
    pages: {
        index: {
            // entry for the pages
            entry: "src/main.js",
            //entry: ["babel-polyfill", "src/main.js"],
            // the source template
            template: "public/index.html",
            // output as dist/index.html
            filename: "index.html",
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: "首页",
            // chunks to include on this pages, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ["chunk-vendors", "chunk-common", "index"]
        }
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
        // subpage: ''
    },

    // eslint-loader 是否在保存的时候检查
    //lintOnSave: process.env.NODE_ENV !== 'production',
    lintOnSave: false,

    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
    transpileDependencies: ["vant"],

    // 生产环境 sourceMap
    productionSourceMap: false,

    // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
    // corsUseCredentials: false,
    // webpack 配置，键值对象时会合并配置，为方法时会改写配置
    // https://cli.vuejs.org/guide/webpack.html#simple-configuration
    /*configureWebpack: {
        output: {
            filename: `static/js/[name].${Timestamp}.js`,
            chunkFilename: `static/js/[name].${Timestamp}.js`
        },
        plugins: [
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: new RegExp(
                    "\\.(" + productionGzipExtensions.join("|") + ")$"
                ),
                threshold: 10240,
                minRatio: 0.8
            })
        ],
        externals: {
            vue: "Vue",
            axios: "axios",
            "vue-router": "VueRouter",
            vant: "vant"
        }
    },*/
    configureWebpack: config => {
        config.plugins.push(
            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        safari10: true
                    }
                }
            })
        );
        config.plugins.push(
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: new RegExp(
                    "\\.(" + productionGzipExtensions.join("|") + ")$"
                ),
                threshold: 10240,
                minRatio: 0.8
            })
        );
        /*config.output = {
            // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `static/js/[name].${Timestamp}.js`,
            chunkFilename: `static/js/[name].${Timestamp}.js`
        };*/
        config.externals = {
            vue: "Vue",
            axios: "axios",
            "vue-router": "VueRouter",
            vant: "vant"
        };
    },

    // webpack 链接 API，用于生成和修改 webapck 配置
    // https://github.com/mozilla-neutrino/webpack-chain
    chainWebpack: config => {},

    // 配置高于chainWebpack中关于 css loader 的配置
    css: {
        // 是否开启支持 foo.module.css 样式
        modules: false,

        // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
        extract: true,

        // 是否构建样式地图，false 将提高构建速度
        sourceMap: false,

        // css预设器配置项
        loaderOptions: {
            css: {
                // options here will be passed to css-loader
            },

            postcss: {
                // options here will be passed to postcss-loader
            }
        }
    },

    // All options for webpack-dev-server are supported
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        open: true,
        port: 8080,
        proxy: {
            "/api": {
                target: "http://192.168.2.114", //对应自己的接口
                //target:' http://60.184.10.72:8888',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
};
