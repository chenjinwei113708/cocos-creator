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
        this.isMintegral = false;
        this.HorizontalConfig = {
            game: {
                position: cc.v2(260, 0),
                scale: 0.77,
                children: {
                    background: {
                        angle: 90
                    }
                }
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
                                position: cc.v2(0, 340)
                            },
                            scoreBoard: {
                                position: cc.v2(0, 425.5)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-210, -210),
                        children: {
                            blur: {
                                position: cc.v2(-90, -130)
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 56.25)
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
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    background: {
                        angle: 0
                    }
                }
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
                                width: 501,
                                height: 84,
                                position: cc.v2(0, 340)
                            },
                            scoreBoard: {
                                position: cc.v2(0, 425.5)
                            },
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
                                position: cc.v2(-210, 0)
                            },
                            logo: {
                                position: cc.v2(-75, 0)
                            },
                            download: {
                                position: cc.v2(135, 0)
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 56.25)
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