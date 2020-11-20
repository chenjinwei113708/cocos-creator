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
        this.HorizontalConfig = {
            game: {
                position: cc.v2(0, -58.331),
                children: {
                    MainCamera: {
                        position: cc.v2(-310, 25),
                    },
                    adsonly: {
                        active: this.isApplovin ? true : false
                    },
                }
            },
            UI: {
                children: {
                    notification: {},
                    install: {
                        position: cc.v2(-225.185, -221.739)
                    },
                    paypal: {
                        position: cc.v2(-401.735, 4),
                        width: 568,
                        height: 557,
                        children: {
                            icon: {
                                position: cc.v2(14.409, 86.81),
                            },
                            cash: {
                                position: cc.v2(177.523, 112.744)
                            },
                            btn: {
                                position: cc.v2(181.478, 52.828)
                            }
                        }
                    },
                    icon: {
                        position: cc.v2(-385.84, -199.951)
                    },
                    congrat: this.isApplovin ? {
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    } : {
                        opacity: 255,
                        angle: 90,
                    },
                    congratBlur: this.isApplovin ? {
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    } : {
                        opacity: 255,
                        angle: 90,
                    },
                    audioBtn: {
                        position: cc.v2(-423.28, 214.908)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, -58.331),
                children: {
                    MainCamera: {
                        position: cc.v2(0, 58.331),
                    },
                    adsonly: {
                        active: this.isApplovin ? true : false
                    },
                }
            },
            UI: {
                children: {
                    notification: {},
                    install: {
                        position: cc.v2(0, -440.152)
                    },
                    paypal: {
                        position: cc.v2(0, 481),
                        width: 568,
                        height: 221,
                        children: {
                            icon: {
                                position: cc.v2(-204, -52.026),
                            },
                            cash: {
                                position: cc.v2(-95.07, -29.479)
                            },
                            btn: {
                                position: cc.v2(-96.194, -82.622)
                            }
                        }
                    },
                    icon: {
                        position: cc.v2(198.584, 430.964)
                    },
                    congrat: this.isApplovin ? {
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    } : {
                        opacity: 255,
                        angle: 0,
                    },
                    congratBlur: this.isApplovin ? {
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    } : {
                        opacity: 255,
                        angle: 0,
                    },
                    audioBtn: {
                        position: cc.v2(0, 397.765)
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

    // 设置通知的位置,要让通知在屏幕顶部
    setNotificationPos (screen) {
        // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
        // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
        let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
        let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
        // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
        // let y = this.guideScript.notification.height/2 + _screenH;
        let halfHeight = this.guideScript.notification.height/2;
        this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
        this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {
    }

    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }
}