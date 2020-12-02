import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isApplovin = true; // 是不是applovin平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(221.805, 36.801),
                scale: 0.836,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            UI: {
                children: {
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
                    board1: {
                        position: cc.v2(221.805, 36.801),
                        scale: 0.836,
                    },
                    board2: {
                        position: cc.v2(221.805, 36.801),
                        scale: 0.836,
                    },
                    // notification: {},
                    paypal: {
                        position: cc.v2(-404.028, 202.133),
                        children: {
                            topicon: {
                                position: cc.v2(21.316, 16.215)
                            },
                            btn: {
                                position: cc.v2(283.104, 10.126)
                            },
                        }
                    },
                    banner: {
                        position: cc.v2(-298.387, -144.439),
                        children: {
                            icon: {
                                position: cc.v2(25.738, 27.599),
                                scale: 1.5
                            },
                            logo: {
                                position: cc.v2(33.214, 130.164)
                            },
                            btn: {
                                position: cc.v2(27.204, -72.948)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-252.054, 116.422)
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
                    board1: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    board2: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    // notification: {},
                    paypal: {
                        position: cc.v2(0, 461.6),
                        children: {
                            topicon: {
                                position: cc.v2(-173.284, -26.412)
                            },
                            btn: {
                                position: cc.v2(171.055, -31.443)
                            },
                        }
                    },
                    banner: {
                        position: cc.v2(0, -428),
                        children: {
                            icon: {
                                position: cc.v2(-218.802, -0.954),
                                scale: 1
                            },
                            logo: {
                                position: cc.v2(-54.667, -1.658)
                            },
                            btn: {
                                position: cc.v2(152.749, -5.468)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 349.492)
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