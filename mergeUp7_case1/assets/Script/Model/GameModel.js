import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isApplovin = false; // 是不是applovin平台
        this.isMintegral = false; // 是不是mtg平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(247.385, 11.077),
                scale: 0.795,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            UI: {
                children: {
                    // notification: {},
                    paypal: {
                        position: cc.v2(-151.384, 208.493),
                        scale: 1.186
                    },
                    pps: {
                        position: cc.v2(247.385, 11.077),
                        scale: 0.795,
                    },
                    banner: {
                        position: cc.v2(-201.231, -204.575),
                        children: {
                            logo: {
                                position: cc.v2(-46.884, 165.448),
                                scale: 1.58
                            },
                            btn: {
                                position: cc.v2(55.853, -6.6)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-373.897, 128.776)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            UI: {
                children: {
                    // notification: {},
                    paypal: {
                        position: cc.v2(0, 439.262),
                        scale: 1,
                    },
                    pps: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    banner: {
                        position: cc.v2(0, -420.575),
                        children: {
                            logo: {
                                position: cc.v2(-24.73, 1.141),
                                scale: 1
                            },
                            btn: {
                                position: cc.v2(174.007, -4.754)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-209.589, 359.545)
                    }
                }
            }
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