import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isMintegral = true; // 检测是不是isMintegral平台
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            // background: {
            //     width: 960,
            //     height: 540
            // },
            // game: {
            //     width: 960,
            //     height: 540,
            //     position: cc.v2(0, 0),
            //     scale: 1,
            //     children: {
            //         difference1: {
            //             scale: 0.88,
            //             position: cc.v2(-235, 0)
            //         },
            //         difference2: {
            //             scale: 0.88,
            //             position: cc.v2(235, 0)
            //         }
            //     }
            // },
            // UI: {
            //     children: {
            //         paypal: {
            //             position: cc.v2(0, 220),
            //         },
            //         banner: {
            //             position: cc.v2(0, -210),
            //             children: {
            //                 // blur: {
            //                 //     position: cc.v2(0, -130)
            //                 // },
            //                 icon: {
            //                     position: cc.v2(-210, 0)
            //                 },
            //                 logo: {
            //                     position: cc.v2(-45, 0)
            //                 },
            //                 playNow: {
            //                     position: cc.v2(170, 0)
            //                 },
            //                 mtg: {
            //                     active: this.isMintegral
            //                 },
            //                 adsonly: {
            //                     active: this.isApplovin
            //                 }
            //             }
            //         },
            //         // awardPage: {
            //         //     isLandScape: true,
            //         //     endScale: 0.8
            //         // },
            //         awardPageBox: {
            //             scale: 0.8,
            //             position: cc.v2(0, -20)
            //         },
            //         audioBtn: {
            //             position: cc.v2(-220, 220)
            //         }
            //     }
            // }
        }
        this.VerticalConfig = {
            // background: {
            //     width: 540,
            //     height: 960
            // },
            // game: {
            //     width: 540,
            //     height: 960,
            //     position: cc.v2(0, 0),
            //     scale: 1,
            //     children: {
            //         difference1: {
            //             scale: 1,
            //             position: cc.v2(0, 170)
            //         },
            //         difference2: {
            //             scale: 1,
            //             position: cc.v2(0, -170)
            //         }
            //     }
            // },
            // UI: {
            //     children: {
            //         paypal: {
            //             position: cc.v2(10, 405)
            //         },
            //         banner: {
            //             position: cc.v2(0, -410),
            //             children: {
            //                 // blur: {
            //                 //     position: cc.v2(0, -130)
            //                 // },
            //                 icon: {
            //                     position: cc.v2(-210, 0)
            //                 },
            //                 logo: {
            //                     position: cc.v2(-45, 0)
            //                 },
            //                 playNow: {
            //                     position: cc.v2(170, 0)
            //                 },
            //                 mtg: {
            //                     active: this.isMintegral
            //                 },
            //                 adsonly: {
            //                     active: this.isApplovin
            //                 }
            //             }
            //         },
            //         awardPageBox: {
            //             scale: 1,
            //             position: cc.v2(0, 0)
            //         },
            //         // awardPage: {
            //         //     isLandScape: false,
            //         //     endScale: 1,
            //         //     children: {
            //         //         congratulation: {
            //         //             position: cc.v2(0, 255)
            //         //         }
            //         //     }
            //         // },
            //         audioBtn: {
            //             position: cc.v2(-220, 405)
            //         }
            //     }
            // }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        

        this.guideScript = null;

        /**游戏进行顺序*/
        this.guideList = [
            // (cb) => {
            //     this.guideScript.showWelcomePage();
            //     this.curGuideStep++
            // },
            // (cb) => {
            //     // 第一步引导，引导用户进行第一个三消
            //     this.curGuideFunc = this.guideScript.setGuideMaskPos.bind(this.guideScript, 1);
            //     this.curGuideFunc();
            //     this.curGuideStep++
            // },
            // (cb) => {
            //     // 第二步合成一格
            //     this.curGuideFunc = this.guideScript.setGuideMaskPos.bind(this.guideScript, 2);
            //     this.curGuideFunc();
            //     this.curGuideStep++
            // }
        ]

    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {}
    
    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    // // 设置通知的位置,要让通知在屏幕顶部
    // setNotificationPos (screen) {
    //     // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
    //     // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
    //     let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
    //     let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
    //     // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
    //     // let y = this.guideScript.notification.height/2 + _screenH;
    //     // let halfHeight = this.guideScript.notification.height/2;
    //     this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
    //     this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    // }
}