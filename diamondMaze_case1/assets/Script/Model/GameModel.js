import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isMintegral = false;
        this.isApplovin = true; // 是不是applovin平台
        this.HorizontalConfig = {
            background: {
                width: 540,
                height: 960,
                angle: 90,
                position: cc.v2(0, 0),
            },
            game: {
                position: cc.v2(260, 30),
                scale: 0.8,
                // children: {
                //     background: {
                //         angle: 90,
                //         position: cc.v2(0, 0)
                //     }
                // }
            },
            UI: {
                children: {
                    // congrat: this.isApplovin ? {
                    //     width: 277.38, // applovin
                    //     height: 540,
                    //     opacity: 190
                    // } : {
                    //     opacity: 255,
                    //     angle: 90,
                    // },
                    // congratBlur: this.isApplovin ? {
                    //     width: 277.38, // applovin
                    //     height: 540,
                    //     opacity: 190
                    // } : {
                    //     opacity: 255,
                    //     angle: 90,
                    // },
                    // notification: {},
                    paypal: {
                        position: cc.v2(-210, -210),
                        children: {
                            progress: {
                                position: cc.v2(0, 300)
                            },
                            scoreBoard: {
                                position: cc.v2(0, 400)
                            },
                            ppCard: {
                                position: cc.v2(470, 210)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-210, -210),
                        children: {
                            blur: {
                                position: cc.v2(0, -130)
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 74)
                            },
                            adsonly: {
                                position: cc.v2(190, 50),
                                active: this.isApplovin
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-420, 215)
                    }
                }
            }
        }
        this.VerticalConfig = {
            background: {
                position: cc.v2(0, 0),
                angle: 0,
                width: 540,
                height: 960
            },
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                // children: {
                //     background: {
                //         angle: 0
                //     }
                // }
            },
            UI: {
                children: {
                    // congrat: this.isApplovin ? {
                    //     width: 603, // applovin
                    //     height: 1170,
                    //     opacity: 255
                    // } : {
                    //     opacity: 255,
                    //     angle: 0,
                    // },
                    // congratBlur: this.isApplovin ? {
                    //     width: 603, // applovin
                    //     height: 1170,
                    //     opacity: 255
                    // } : {
                    //     opacity: 255,
                    //     angle: 0,
                    // },
                    // notification: {},
                    paypal: {
                        position: cc.v2(0, 0),
                        children: {
                            progress: {
                                width: 447,
                                height: 44,
                                position: cc.v2(0, 280)
                            },
                            scoreBoard: {
                                position: cc.v2(0, 400)
                            },
                            ppCard: {
                                position: cc.v2(0, 0)
                            }
                            // btn: {
                            //     position: cc.v2(137.034, -40.34)
                            // },
                            // cash: {
                            //     position: cc.v2(135.994, 31.177)
                            // }
                        }
                    },
                    banner: {
                        position: cc.v2(0, -420),
                        children: {
                            blur: {
                                position: cc.v2(0, -130)
                            },
                            icon: {
                                position: cc.v2(-215, 0)
                            },
                            logo: {
                                position: cc.v2(-80, 0)
                            },
                            download: {
                                position: cc.v2(140, 0)
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 74)
                            },
                            adsonly: {
                                position: cc.v2(190, 50),
                                active: this.isApplovin
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-200, 430)
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