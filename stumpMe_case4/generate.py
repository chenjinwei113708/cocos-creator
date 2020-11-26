# coding=utf-8

# 用法：(用户第一个参数为目标文件名称)
# python .\generate.py MrSpy
# ！注意：如果使用WebGl渲染的话，第二个参数请填写webgl
# python .\generate.py MrSpy webgl
# 脚本放置路径：cocos项目根目录，跟instantConfig.py放一起
# date: 20190926
# author: dy


import codecs
import sys
import re
import os
import zipfile
import shutil
import platform as sysPlatform

# region 平台相关的脚本

# 平台
PLATFORM = ['Standard', 'IronSource', 'Toutiao', 'Mintegral', 'Unity']

# 平台专用脚本
standard = ''
ironSource = '<script>function getScript(e,i){var n=document.createElement("script");n.type="text/javascript",n.async=!0,i&&(n.onload=i),n.src=e,document.head.appendChild(n)}function parseMessage(e){var i=e.data,n=i.indexOf(DOLLAR_PREFIX+RECEIVE_MSG_PREFIX);if(-1!==n){var t=i.slice(n+2);return getMessageParams(t)}return{}}function getMessageParams(e){var i,n=[],t=e.split("/"),a=t.length;if(-1===e.indexOf(RECEIVE_MSG_PREFIX)){if(a>=2&&a%2===0)for(i=0;a>i ;i+=2)n[t[i]]=t.length<i+1?null:decodeURIComponent(t[i+1])}else{var o=e.split(RECEIVE_MSG_PREFIX);void 0!==o[1]&&(n=JSON&&JSON.parse(o[1]))}return n}function getDapi(e){var i=parseMessage(e);if(!i||i.name===GET_DAPI_URL_MSG_NAME){var n=i.data;getScript(n,onDapiReceived)}}function invokeDapiListeners(){for(var e in dapiEventsPool)dapiEventsPool.hasOwnProperty(e)&&dapi.addEventListener(e,dapiEventsPool[e])}function onDapiReceived(){dapi=window.dapi,window.removeEventListener("message",getDapi),invokeDapiListeners( )}function init(){window.dapi.isDemoDapi&&(window.parent.postMessage(DOLLAR_PREFIX+SEND_MSG_PREFIX+JSON.stringify({state:"getDapiUrl"}),"*"),window.addEventListener("message",getDapi,!1))}var DOLLAR_PREFIX="$$",RECEIVE_MSG_PREFIX="DAPI_SERVICE:",SEND_MSG_PREFIX="DAPI_AD:",GET_DAPI_URL_MSG_NAME="connection.getDapiUrl",dapiEventsPool={},dapi=window.dapi||{isReady:function(){return!1},addEventListener:function(e,i){dapiEventsPool[e]=i},removeEventListener:function(e){delete dapiEventsPool[e]},isDemoDapi:!0};init();</script>'
ironSource_webgl = '<script>var tryGetWebGL=function(){var a=document.createElement("CANVAS");return a.getContext("webgl")||a.getContext("experimental-webgl")||a.getContext("webkit-3d")||a.getContext("moz-webgl")||null};var viewableChangeCb=function(event){if(event.isViewable){console.log("viewchange init");startInit()}};var startInit=function(){dapi.removeEventListener("viewableChange",viewableChangeCb);clearTimeout(webglTimer);console.log("start init");initCocos()};var StartTime=(new Date).getTime();var webglTimer=null;var tryLoadCocos=function(){let timeOffset=(new Date).getTime()-StartTime;if(timeOffset<5000){if(dapi.isViewable()){console.log("direct init");startInit()}else{console.log("try again");webglTimer=setTimeout(function(){tryLoadCocos()},500)}}};var readyCB=function(isCallback){if(isCallback!=="noBind")dapi.removeEventListener("ready",readyCB);tryLoadCocos();dapi.addEventListener("viewableChange",viewableChangeCb)};if(dapi.isReady()){readyCB("noBind")}else{dapi.addEventListener("ready",readyCB)}</script>'
toutiao = '<script src="https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/union/playable/sdk/index.b5662ec443f458c8a87e.js"></script>'
mintegral = "<script> function gameStart() { 1 === 0 && cc.find('Canvas').getComponent('GameController'); }; function gameClose() { 1 === 0 && cc.audioEngine.stopAll(); }; function _download() { window.install && window.install(); }; function _mockEnd() { window.gameEnd && window.gameEnd(); }; function _mockReady() { window.gameReady && window.gameReady(); }; if(0 === 1) { _mockEnd() && _mockReady() }; </script>"
unity = "<script>\n    var storeUrl='https://play.google.com/store/apps/details?id=com.pocket.spy.shooting.guns.bullet';\n    var iosStoreUrl = 'https://itunes.apple.com/app/id1475086635';\n    var onSdkReady =function(){}\n    var onShowAR = function() {}\n    var onShowFallBack = function() {}\n    var unityDownload = function() { mraid.open(storeURL) }\n    if (typeof mraid !== 'undefined') {\n        //Wait for the SDK to become ready\n        if(mraid.getState() === 'loading'){\n            mraid.addEventListener('ready',onSdkReady);\n        }else{\n            onSdkReady();\n        }\n    }\n  </script>"

CONST_VALUE = {
    'Standard': standard,
    'IronSource': ironSource,
    'IronSource_webgl': ironSource_webgl,
    'Toutiao': toutiao,
    'Mintegral': mintegral,
    'Unity': unity
}

FILE_PATH = "./build/web-mobile/"
FILE_NAME = "index.html"

# 新脚本插入位置
INSERT_PLACE = r'<meta name="x5-page-mode" content="app">'

DEST_FILE = 'index'
DEST_DIR = 'dest'

IS_WEBGL = False
# endregion

# 读取系统参数


def readSysArgs():
    if len(sys.argv) >= 2:
        return sys.argv[1]
    else:
        hint = "\033[1;31;43m please give an argument, for example: python .\\generate.py MrSpy \033[0m"
        print hint
        sys.exit()


def ifUseWebGl():
    if len(sys.argv) >= 3 and sys.argv[2] == 'webgl':
        return True

# 删除文件夹及其中的所有内容


def deleteDir(dir):
    for root, dirs, files in os.walk(dir, topdown=False):
        for name in files:
            os.remove(os.path.join(root, name))
        for name in dirs:
            os.rmdir(os.path.join(root, name))
    os.rmdir(dir)
    return True
    # print 'deleted'


def createNewFile(content):
    # 删除旧目录文件夹，创建新目录文件夹
    try:
        if os.path.exists(FILE_PATH+DEST_DIR):
            shutil.rmtree(FILE_PATH+DEST_DIR)    # 递归删除文件夹
            os.mkdir(FILE_PATH+DEST_DIR)
        else:
            os.mkdir(FILE_PATH+DEST_DIR)
    except Exception, Argument:
        hint = "\033[1;31;43m please first close all directories and files related to dest dir \033[0m"
        print hint
        print Argument
        sys.exit()

    # 遍历各个平台
    for index, platform in enumerate(PLATFORM):
        print "--generating file No."+(index+1).__str__()+"-"+platform

        destFileName = DEST_FILE+"_"+platform+".html"

        if platform == 'Mintegral':  # 如果是Mintegral平台
            zipFilePathName = FILE_PATH+DEST_DIR+"/"+DEST_FILE+"_"+platform+".zip"
            destFileName = 'index.html'
            destFile = codecs.open(
                FILE_PATH+DEST_DIR+"/"+destFileName, 'w', 'utf-8')
            newContent = re.sub(INSERT_PLACE, INSERT_PLACE +
                                '\n  '+CONST_VALUE[platform], content)
            destFile.write(newContent)
            destFile.close()
            # 压缩成zip
            zf = zipfile.ZipFile(zipFilePathName, 'w', zipfile.ZIP_DEFLATED)
            zf.write(FILE_PATH+DEST_DIR+"/"+destFileName, destFileName)
            zf.close()
            os.remove(FILE_PATH+DEST_DIR+"/"+destFileName)
            print '-----'
            continue
        elif platform == 'IronSource' and IS_WEBGL:  # 如果是webgl模式
            print "    *WebGl mode*"

            destFile = codecs.open(
                FILE_PATH+DEST_DIR+"/"+destFileName, 'w', 'utf-8')

            newContent = re.sub(
                INSERT_PLACE,
                INSERT_PLACE + '\n  '+CONST_VALUE['IronSource'],
                content)
            WEBGL_DELETE_CODE = r'</script><script charset="utf-8">'
            newContent = re.sub(WEBGL_DELETE_CODE, '', newContent)

            WEBGL_INIT_COCOS_START = r'<script type="text/javascript">\(function\(t,e,i\)'
            WEBGL_INIT_COCOS = "var initCocos = function(){"
            newContent = re.sub(
                WEBGL_INIT_COCOS_START,
                '<script type="text/javascript">\n  ' +
                WEBGL_INIT_COCOS+"\n  (function(t,e,i)",
                newContent)

            WEBGL_INIT_COCOS_START_END = r'</script>[\s]*</body>'
            WEBGL_TRY_GET = CONST_VALUE['IronSource_webgl']
            newContent = re.sub(
                WEBGL_INIT_COCOS_START_END,
                "}\n</script>\n"+WEBGL_TRY_GET+"\n</body>",
                newContent)

            destFile.write(newContent)
            destFile.close()
            print '-----'
            continue

        destFile = codecs.open(FILE_PATH+DEST_DIR+"/" +
                               destFileName, 'w', 'utf-8')
        newContent = re.sub(INSERT_PLACE, INSERT_PLACE +
                            '\n  '+CONST_VALUE[platform], content)
        destFile.write(newContent)
        destFile.close()
        # print CONST_VALUE[platform]
        print '-----'


# 自动打开目标文件夹
def autoOpenDestDir():
    sysstr = sysPlatform.system()
    if(sysstr == "Windows"):
        parentAbsPath = os.path.dirname(os.path.abspath(__file__))
        destPath = parentAbsPath+re.sub(r'/', '\\\\', FILE_PATH[1:]+DEST_DIR)
        print '  auto opening ' + destPath
        os.startfile(destPath)


# 程序入口
if __name__ == '__main__':
    DEST_FILE = readSysArgs()
    IS_WEBGL = ifUseWebGl()
    print 'start generating the dest file ' + DEST_FILE
    if IS_WEBGL:
        print "****use WebGl mode****"
    else:
        print "****don't use WebGl mode****"

    # 读取文件
    indexFile = codecs.open(FILE_PATH+FILE_NAME, 'r', 'utf-8')
    contentLines = indexFile.readlines()
    indexFile.close()
    content = ''
    # print CONST_VALUE['unity']
    for line in contentLines:
        content += line

    # （主要方法）创建新文件
    createNewFile(content)
    print ''
    print '  SUCCESS!  '
    autoOpenDestDir()
    print ''
    sys.exit(0)
