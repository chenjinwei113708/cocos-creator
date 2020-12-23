/**
 * 这个脚本是用来辨别不同广告平台的，
 * 并且调用广告平台自定义的方法。
 */
import { DownloadUrl } from './DownloadUrl';
let playableStart = false; // 广告启动
let hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

export const PlayformSDK = {
    getAudioUtils() {
        return cc.find('Canvas').getComponent('GameController').getAudioUtils();
    },
    /** 处理页面可见状态的变化 */
    handleVisibilityChange () {
        const audioUtils = this.getAudioUtils();
        if (document.visibilityState === "hidden" || document[hidden]) {
            // 如果页面不可见
            // 关闭音乐
            cc.audioEngine.stopAll();
        } else {
            // 如果页面可见
            audioUtils.playBgm();
        }
    },
    // 游戏初始化时 
    gameStart() {
        let audioUtils = this.getAudioUtils();
        // 监听页面可见状态
        {
            if (typeof document.addEventListener === "undefined" || hidden === undefined) {
                // console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
            } else {
                // Handle page visibility change
                document.addEventListener(visibilityChange, this.handleVisibilityChange.bind(this), false);
            }
        }
        // ===================== Mintegral =====================   
        window.gameStart = () => {
            // mtg会在我们调用gameReady()后，自动调用gameStart()，而gameInit方法会调用gameReady(),导致死循环
            // cc.find('Canvas').getComponent('GameController').gameInit();
        }
        window.gameClose = () => {
            cc.audioEngine.stopAll();
        }
        
        // ===================== ironSource =====================   
        if (typeof dapi !== 'undefined') {
            let readyCB = () => {
                dapi.getScreenSize();
                // 设置音乐状态

                audioUtils.isAudioEnabled = !!dapi.getAudioVolume();
                if (audioUtils.isAudioEnabled) {
                    audioUtils.playBgm();
                    // cc.audioEngine.playMusic(this.bgMusic, true);
                } else {
                    cc.audioEngine.stopAll();
                    // cc.audioEngine.stopMusic();
                }

                // if (!playableStart && dapi.isViewable()) {
                if (!playableStart) {
                    cc.find('Canvas').getComponent('GameController').gameInit();
                    playableStart = true;
                };
                // 切到其他应用时停止播放音乐，返回时继续播放
                dapi.addEventListener("viewableChange", (event) => {
                    if (event.isViewable) {
                        if (!playableStart) {
                            cc.find('Canvas').getComponent('GameController').gameInit();
                            playableStart = true;
                        } else {
                            // 播放音乐
                            audioUtils.playBgm();
                        }
                    } else {
                        // 关闭音乐
                        cc.audioEngine.stopAll();
                    }
                });
                
                dapi.addEventListener("adResized", function adResizeCallback() { dapi.getScreenSize(); });
                dapi.addEventListener("audioVolumeChange", (volume) => {
                    audioUtils.isAudioEnabled = !!volume;
                    if (audioUtils.isAudioEnabled) {
                        audioUtils.playBgm();
                    } else {
                        cc.audioEngine.stopAll();
                    }
                });
            };

            if ( dapi.isReady() )  {
                readyCB()
            } else {
                dapi.addEventListener("ready", readyCB);
            }
            return false
        }

        // ===================== Mraid =====================   
        if (typeof mraid !== 'undefined') {
            // 在adcolony环境中检测广告的可视状态来控制声音的开闭
            console.log('mraid version: ', mraid.getVersion ? mraid.getVersion() : 'No getVersion api');

            // for mraid 3.0
            mraid.addEventListener("exposureChange", (exposedPercentage) => {
                if (exposedPercentage > 0.0) {
                    audioUtils.playBgm();
                } else {
                    cc.audioEngine.stopAll();
                }
            });
            // for mraid 2.0
            mraid.addEventListener('viewableChange', function (isViewable) {
                if (isViewable) {
                    audioUtils.playBgm();
                } else {
                    cc.audioEngine.stopAll();
                }
            });
            // adcolony默认初始声音关闭
            audioUtils.closeVolumn();
            cc.find('Canvas').getComponent('GameController').gameInit();
            console.log('mraid ads init')
            return false
        }

        // other平台
        audioUtils.playBgm();
        cc.find('Canvas').getComponent('GameController').gameInit();

        
    },

    // 游戏初始化完成时
    gameReady() {
        // 触发各个平台的Ready方法
        // ===================== Mintegral =====================   
        if(window.gameReady) window.gameReady()
    },

    // 游戏跳入endPage时
    gameFinish() {
        // 触发各个平台的Finish方法
        if (window.gameEnd) {
            window.gameEnd();
        } else if (window.TJ_API) {
            window.TJ_API.gameplayFinished();
        }
    },

    // 游戏点击下载时
    download() {
        let url = DownloadUrl.getUrl();
        try {
            if (typeof dapi !== 'undefined') {
                // ===================== ironSource ===================== 
                dapi.openStoreUrl()
                console.log('dapi open store (ironSource)')

            } else if (typeof FbPlayableAd !== 'undefined') {
                // ===================== facebook ===================== 
                FbPlayableAd.onCTAClick()
                console.log('FB open store')

            } else if (typeof mraid !== 'undefined') {
                // ===================== mraid ===================== 
                this.gameClose();  // 下载前关闭音乐
                // this.closeVolumn();
                if (mraid.openStore) {
                    mraid.openStore(url);
                } else {
                    mraid.open(url);
                }
                console.log('mraid open store')

            } else if (typeof ExitApi !== 'undefined') {
                // ===================== Google ===================== 
                ExitApi.exit();

            } else if (window.install) { 
                // ===================== Mintegral ===================== 
                window.install();
                console.log('Mintegral open store')

            } else if (window.openAppStore) { 
                // ===================== 穿山甲 ===================== 
                window.openAppStore();
                console.log('穿山甲 open store')

            } else if (window.TJ_API) {
                // ===================== tapjoy ===================== 
                TJ_API.click();

            } else {
                // ===================== 无平台接入时 ===================== 
                console.log(url);
                window.location = url;
            }
        } catch (err) {
            console.error(err)
            window.location = url;
        }
    },

    // 游戏彻底结束时
    gameClose() {
        // 关闭播放BGM
        cc.audioEngine.stopMusic();
    },

    // 获取当前平台名
    getCurPlat() {
        if (typeof dapi !== 'undefined') {
            // ===================== ironSource ===================== 
            return 'ironSource'
        } else if (typeof FbPlayableAd !== 'undefined') {
            // ===================== facebook ===================== 
            return 'facebook'
        } else if (typeof mraid !== 'undefined') {
            // ===================== mraid ===================== 
            return 'mraid'
        } else if (typeof ExitApi !== 'undefined') {
            // ===================== Google ===================== 
            return 'google'
        } else if (window.install) { 
            // ===================== Mintegral ===================== 
            return 'mintegral'
        } else if (window.openAppStore) { 
            // ===================== 穿山甲 ===================== 
            return '穿山甲'
        } else if (window.TJ_API) {
            // ===================== tapjoy ===================== 
            return 'tapjoy'
        } else {
            return 'other'
        }
    }
}