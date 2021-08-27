import * as fs from "fs"
import * as path from "path"
import * as uglify from "uglify-js"
import CleanCSS = require("clean-css")
const tinify = require("tinify");

tinify.key = "5ZBe2ebDJQ9iIujMCyLfRI3MowzMY1pU";

export namespace X {

    /** 一些配置参数
     * - [注意] 路径问题.start脚本与web-mobile同层级,因此相对路径需要带上web-mobile;cocos在调用资源时没有web-mobile,需要在最后去掉
     */
    const C = {
        BASE_PATH: "src/web-mobile",            // web-mobile包基础路径
        RES_PATH: "src/web-mobile/res",         // web-mobile包下的res路径
        RES_BASE64_EXTNAME_SET: new Set([       // 需要使用base64编码的资源后缀(根据项目自行扩充)
            ".png", ".jpg", ".webp", ".mp3", ".mp4"
        ]),
        OUTPUT_RES_JS: "dist/res.js",           // 输出文件res.js
        OUTPUT_DIR: "dist",   // 输出文件的路径
        INPUT_HTML_FILE: "src/web-mobile/index.html",
        INPUT_CSS_FILES: [
            "src/web-mobile/style-mobile.css"
        ],
        MAIN_JS_FILE: "src/web-mobile/main.js",
        MAIN_JS_CUT: "src/web-mobile/cut-main.js",
        INPUT_JS_FILES: [
            "dist/res.js",                      // 注意这里先输出再输入
            "src/web-mobile/cocos2d-js-min.js",
            "src/web-mobile/cut-main.js",
            "src/web-mobile/src/settings.js",
            "src/web-mobile/src/project.js",
            "src/new-res-loader.js",
            "src/game-start.js",
        ],
        PLATFORM: [                             // 输出的平台
            'standard', 'ironSource', 'toutiao', 'mintegral', 'unity'
        ],
        PLATFORM_SCRIPT: {
            ironSource: '<script>\nfunction getScript(e,i){var n=document.createElement("script");n.type="text/javascript",n.async=!0,i&&(n.onload=i),n.src=e,document.head.appendChild(n)}function parseMessage(e){var i=e.data,n=i.indexOf(DOLLAR_PREFIX+RECEIVE_MSG_PREFIX);if(-1!==n){var t=i.slice(n+2);return getMessageParams(t)}return{}}function getMessageParams(e){var i,n=[],t=e.split("/"),a=t.length;if(-1===e.indexOf(RECEIVE_MSG_PREFIX)){if(a>=2&&a%2===0)for(i=0;a>i;i+=2)n[t[i]]=t.length<i+1?null:decodeURIComponent(t[i+1])}else{var o=e.split(RECEIVE_MSG_PREFIX);void 0!==o[1]&&(n=JSON&&JSON.parse(o[1]))}return n}function getDapi(e){var i=parseMessage(e);if(!i||i.name===GET_DAPI_URL_MSG_NAME){var n=i.data;getScript(n,onDapiReceived)}}function invokeDapiListeners(){for(var e in dapiEventsPool)dapiEventsPool.hasOwnProperty(e)&&dapi.addEventListener(e,dapiEventsPool[e])}function onDapiReceived(){dapi=window.dapi,window.removeEventListener("message",getDapi),invokeDapiListeners()}function init(){window.dapi.isDemoDapi&&(window.parent.postMessage(DOLLAR_PREFIX+SEND_MSG_PREFIX+JSON.stringify({state:"getDapiUrl"}),"*"),window.addEventListener("message",getDapi,!1))}var DOLLAR_PREFIX="$$$",RECEIVE_MSG_PREFIX="DAPI_SERVICE:",SEND_MSG_PREFIX="DAPI_AD:",GET_DAPI_URL_MSG_NAME="connection.getDapiUrl",dapiEventsPool={},dapi=window.dapi||{isReady:function(){return!1},addEventListener:function(e,i){dapiEventsPool[e]=i},removeEventListener:function(e){delete dapiEventsPool[e]},isDemoDapi:!0};init();\n</script>',
            toutiao: '<script src="https://sf-tb-sg.ibytedtos.com/obj/ttfe-malisg/playable/sdk/index.b5662ec443f458c8a87e.js"></script>',
            mintegral: "<script> function gameStart() { 1 === 0 && cc.find('Canvas').getComponent('GameController'); }; function gameClose() { 1 === 0 && cc.audioEngine.stopAll(); }; function _download() { window.install && window.install(); }; function _mockEnd() { window.gameEnd && window.gameEnd(); }; function _mockReady() { window.gameReady && window.gameReady(); }; if(0 === 1) { _mockEnd() && _mockReady() }; </script>",
            unity: "<script>\n    var storeUrl='https://play.google.com/store/apps/details?id=com.pocket.spy.shooting.guns.bullet';\n    var iosStoreUrl='https://itunes.apple.com/app/id1475086635';\n    var onSdkReady =function(){}\n    var onShowAR = function() {}\n    var onShowFallBack = function() {}\n    var unityDownload = function() { mraid.open(storeURL) }\n    if (typeof mraid !== 'undefined') {\n        //Wait for the SDK to become ready\n        if(mraid.getState() === 'loading'){\n            mraid.addEventListener('ready',onSdkReady);\n        }else{\n            onSdkReady();\n        }\n    }\n  </script>"
        },
        IRON_SOURCE_TRY_WEBGL: '<script> var tryGetWebGL=function(){var a=document.createElement("CANVAS");return a.getContext("webgl")||a.getContext("experimental-webgl")||a.getContext("webkit-3d")||a.getContext("moz-webgl")||null};var viewableChangeCb=function(event){if(event.isViewable){console.log("viewchange init");startInit()}};var startInit=function(){dapi.removeEventListener("viewableChange",viewableChangeCb);clearTimeout(webglTimer);console.log("start init");initCocos()};var StartTime=(new Date).getTime();var webglTimer=null;var tryLoadCocos=function(){let timeOffset=(new Date).getTime()-StartTime;if(timeOffset<5000){if(dapi.isViewable()){console.log("direct init");startInit()}else{console.log("try again");webglTimer=setTimeout(function(){tryLoadCocos()},500)}}};var readyCB=function(isCallback){if(isCallback!=="noBind")dapi.removeEventListener("ready",readyCB);tryLoadCocos();dapi.addEventListener("viewableChange",viewableChangeCb)};if(dapi.isReady()){readyCB("noBind")}else{dapi.addEventListener("ready",readyCB)}</script>',
    }

    /**
     * 读取文件内容
     * - 特定后缀返回base64编码后字符串,否则直接返回文件内容字符串
     * @param filepath
     */
    function get_file_content(filepath: string): string {
        let file = fs.readFileSync(filepath)
        return C.RES_BASE64_EXTNAME_SET.has(path.extname(filepath)) ? file.toString("base64") : file.toString()
    }

    /**
     * 获取路径下的所有子文件路径(深度遍历)
     * @param filepath
     */
    function get_all_child_file(filepath: string): string[] {
        let children = [filepath]
        for (; ;) {
            // 如果都是file类型的,则跳出循环
            if (children.every(v => fs.statSync(v).isFile())) { break }
            // 如果至少有1个directroy类型,则删除这一项,并加入其子项
            children.forEach((child, i) => {
                if (fs.statSync(child).isDirectory()) {
                    delete children[i]
                    let child_children = fs.readdirSync(child).map(v => `${child}/${v}`)
                    children.push(...child_children)
                }
            })
        }
        return children
    }

    /**
     * 压缩图片
     */
    function compressImg(): void {
        get_all_child_file(C.RES_PATH+"/raw-assets").forEach(path => {
            console.log('压缩图片,', path);
            if (path.endsWith('.png') || path.endsWith('.jpg')) {
                console.log('  压缩中,', path);
                const source = tinify.fromFile(path);
                source.toFile(path);
            }
        });
    }

    function edit_mainjs_file(filepath: string, output: string): void {
        let jsLine: Array<string> = fs.readFileSync(filepath, {
            encoding: 'utf8',
            flag: 'r' 
        }).split('\n');
        jsLine.splice(153, 10); // 删除154~163行内容
        fs.writeFileSync(output, jsLine.join('\n'));
    }

    /**
     * 将所有res路径下的资源转化为res.js
     * - 存储方式为:res-url(注意是相对的),res文件内容字符串或编码
     */
    function write_resjs() {
        // 读取并写入到一个对象中
        let res_object = {}
        get_all_child_file(C.RES_PATH).forEach(path => {
            // 注意,存储时删除BASE_PATH前置
            let store_path = path.replace(new RegExp(`^${C.BASE_PATH}/`), "")
            res_object[store_path] = get_file_content(path)
        })
        // 写入文件
        fs.writeFileSync(C.OUTPUT_RES_JS, `window.res=${JSON.stringify(res_object)}`)
    }

    /** 将js文件转化为html文件内容(包括压缩过程) */
    function get_html_code_by_js_file(js_filepath: string, withoutScriptTag: boolean = false): string {
        let js = get_file_content(js_filepath);
        ​let fileInfo = fs.statSync(js_filepath)
        let min_js = null;
        // 如果文件小于1M，就使用uglyfy，否则不使用
        if (fileInfo.size < (1024*1024)) min_js = uglify.minify(js).code;
        else min_js = js;
        if (withoutScriptTag) {return ";"+min_js;} // ;开头放置intermediate value is not a function报错
        else {return `<script type="text/javascript">;${min_js}</script>`;}
    }

    /** 将css文件转化为html文件内容(包括压缩过程) */
    function get_html_code_by_css_file(css_filepath: string): string {
        let css = get_file_content(css_filepath)
        let min_css = new CleanCSS().minify(css).styles
        return `<style>${min_css}</style>`
    }

    function del_dir(path: string): void {
        let files: Array<string> = [];
        if(fs.existsSync(path)){
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let curPath: string = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()){
                    del_dir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(path);
        }
    }

    /**
     * 从标准文件里面提取正确的商店下载链接
     * @param content 
     */
    function get_down_url(content: string): object {
        let android = content.match(/androidUrl:[ "']{1}[\s\S]+?[ "']{1}/s);
        let code = (android && android[0].indexOf('"')>-1) ? '"' : "'";
        let androidUrl = android && android[0].split(code)[1];
        let ios = content.match(/iosUrl:[ "']{1}[\s\S]+?[ "']{1}/s);
        code = (ios && ios[0].indexOf('"')>-1) ? '"' : "'";
        let iosUrl = ios && ios[0].split(code)[1];
        if (!androidUrl || !iosUrl) {
            throw new Error('原始文件中缺少商店下载链接 androidUrl 或 iosUrl');
        }
        return {
            androidUrl: androidUrl,
            iosUrl: iosUrl
        }
    }

    /**
     * 将需要用到url的地方更换成正确的url
     * @param urls 
     */
    function correct_url (urls: any): void{
        if (C.PLATFORM_SCRIPT.unity) {
            C.PLATFORM_SCRIPT.unity = C.PLATFORM_SCRIPT.unity.replace(/storeUrl='[\s\S]+?'/s, `storeUrl='${urls.androidUrl}'`);
            C.PLATFORM_SCRIPT.unity = C.PLATFORM_SCRIPT.unity.replace(/iosStoreUrl='[\s\S]+?'/s, `iosStoreUrl='${urls.iosUrl}'`);
        }
    }

    /**
     * 在代码中加入对MP4格式的处理
     * @param urls 
     */
    function load_mp4_video (contents: string): string{
        let match = contents.match(/=document\.createElement\("source"\)\).src=[\s\S]+?=cc.path.extname\([a-zA-Z]*\);/s);
        if (match) {
            // 读取自定义脚本
            let jsfile = uglify.minify(get_file_content('src/myLoadVideo.js')).code;
            // 在html中加入自定义的加载视频方法
            contents = contents.replace(/<\/head>/, `</head>\n<script>${jsfile}</script>\n`);
            // 在cocos引擎代码里调用自定义的视频加载方法
            contents = contents.replace(/=document\.createElement\("source"\)\).src=[\s\S]+?=cc.path.extname\([a-zA-Z]*\);/s,
            `${match[0]}myLoadVideo();`);
        }
        return contents;
    }

    /** 执行任务 */
    export function do_task() {
        console.log('删除原dist文件')
        del_dir(C.OUTPUT_DIR)
        if (!fs.existsSync(C.OUTPUT_DIR)) {
            fs.mkdirSync(C.OUTPUT_DIR)
        }
        // 压缩res资源中的图片
        console.time("压缩res中的图片")
        compressImg()
        console.timeEnd("压缩res中的图片")

        // 前置:将res资源写成res.js
        console.time("写入res.js")
        write_resjs()
        console.timeEnd("写入res.js")

        // 清理html
        console.time("清理html")
        let html = get_file_content(C.INPUT_HTML_FILE)
        html = html.replace(/<link rel="stylesheet".*\/>/gs, "")
        html = html.replace(/<script.*<\/script>/gs, "")
        let prefixName = /<title>Cocos Creator \| (.*)<\/title>/gs.exec(html)[1]
        console.log("替换名称为", prefixName)
        html = html.replace(/<title>Cocos Creator \| (.*)<\/title>/gs, `<title>${prefixName}<\/title>`)
        console.timeEnd("清理html")
        // 写入css
        console.log("写入所有css文件")
        C.INPUT_CSS_FILES.forEach(v => {
            console.time(`---${path.basename(v)}`)
            html = html.replace(/<\/head>/, `${get_html_code_by_css_file(v)}\n</head>`)
            html = html.replace(/url\([\s\S]*splash.png\)/gs, "") // 移除对cocos开场图标的引用
            console.timeEnd(`---${path.basename(v)}`)
        })

        // 清理mainjs
        console.log("删除main.js中多余内容")
        edit_mainjs_file(C.MAIN_JS_FILE, C.MAIN_JS_CUT);

        // 写入js
        console.log("加载所有cocos相关js代码")
        let seperateCocosScripts = '';
        let allCocosScripts = '';
        C.INPUT_JS_FILES.forEach(v => {
            console.time(`---${path.basename(v)}`)
            seperateCocosScripts += `${get_html_code_by_js_file(v)}\n`;
            allCocosScripts += `${get_html_code_by_js_file(v, true)}\n`;
            // html = html.replace(/<\/body>.+<\/html>/gs, `${get_html_code_by_js_file(v)}\n</body>\n</html>`)
            console.timeEnd(`---${path.basename(v)}`)
        })

        console.time("查找并替换下载url");
        let downloadUrls = get_down_url(allCocosScripts);
        correct_url(downloadUrls);
        console.timeEnd("查找并替换下载url");

        console.time("加入自定义加载视频的代码");
        html = load_mp4_video(html);
        console.timeEnd("加入自定义加载视频的代码");

        // 输出为各个平台的文件并提示成功
        console.time("输出通用平台")
        
        fs.writeFileSync(C.OUTPUT_DIR + `/${prefixName}_standard.html`, html)
        console.timeEnd("输出通用平台")

        C.PLATFORM.forEach( platform => {
            console.time(`输出${platform}平台`)
            let tempHtml = html
            console.time("  写入所有js到html")
            if (platform === 'ironSource') {
                tempHtml = tempHtml.replace(/<\/body>.+<\/html>/gs, `<script type="text/javascript">\nfunction initCocos() {\n${allCocosScripts}}\n</script>\n</body>\n</html>`);
                tempHtml = tempHtml.replace(/<\/body>.+<\/html>/gs, `${C.IRON_SOURCE_TRY_WEBGL}\n</body>\n</html>`);
            } else {
                tempHtml = tempHtml.replace(/<\/body>.+<\/html>/gs, `${seperateCocosScripts}\n</body>\n</html>`);
            }
            console.timeEnd("  写入所有js到html")
            // console.log("TCL: functiondo_task -> tempHtml", tempHtml)
            if (C.PLATFORM_SCRIPT[platform]) {
                tempHtml = tempHtml.replace(/<\/head>/, `${C.PLATFORM_SCRIPT[platform]}\n</head>`)
            }
            fs.writeFileSync(C.OUTPUT_DIR + `/${prefixName}_${platform}.html`, tempHtml)
            console.timeEnd(`输出${platform}平台`)
        })

    }
}

X.do_task()
