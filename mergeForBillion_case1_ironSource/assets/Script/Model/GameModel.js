import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.initOrient = undefined; // 初始化的时候是横屏还是竖屏 'horizontal' : 'vertical'
        this.isLandscape = false;
        this.isApplovin = false; // 是不是applovin平台
        this.isMintegral = false; // 是不是mtg平台
        this.HorizontalConfig = {
            game1: {
                // position: cc.v2(240, 35),
                children: {
                    GameCamera: {
                        // position: cc.v2(-231.667, -35.214),
                        position: cc.v2(-240, -35)
                    },
                    bgimg: {
                        angle: 90
                    }
                }
                
            },
            game: {
                position: cc.v2(231.667, 35.214),
                // scale: 0.925,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    },
                    
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
                        position: cc.v2(-242.787, 180.449),
                        scale: 0.887,
                        // children: {
                        //     icon: {
                        //         position: cc.v2(-67.054, -7.471)
                        //     },
                        //     btn: {
                        //         position: cc.v2(137.034, -40.34)
                        //     },
                        //     cash: {
                        //         position: cc.v2(135.994, 31.177)
                        //     }
                        // }
                    },
                    pps: {
                        position: cc.v2(231.667, 35.214),
                    },
                    banner: {
                        position: cc.v2(-229.814, -197.614),
                        children: {
                            // icon: {
                            //     position: cc.v2(-70.997, 131.491)
                            // },
                            // logo: {
                            //     position: cc.v2(76.109, 130.311)
                            // },
                            // btn: {
                            //     position: cc.v2(17.395, 25.327)
                            // },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-432.058, 40.413)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game1: {
                // position: cc.v2(0, 0),
                children: {
                    GameCamera: {
                        // position: cc.v2(-231.667, -35.214),
                        position: cc.v2(0, 0)
                    },
                    bgimg: {
                        angle: 0
                    }
                },
                
            },
            game: {
                position: cc.v2(0, 0),
                // scale: 1,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    },
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
                        position: cc.v2(0, 378.756),
                        scale: 1,
                        // children: {
                        //     laoren: {
                        //         width: 319.4,
                        //         height: 177.4,
                        //         position: cc.v2(-0.75, -186.539)
                        //     },
                        //     icon: {
                        //         position: cc.v2(-155.976, -7.471)
                        //     },
                        //     btn: {
                        //         position: cc.v2(137.034, -40.34)
                        //     },
                        //     cash: {
                        //         position: cc.v2(135.994, 31.177)
                        //     }
                        // }
                    },
                    pps: {
                        position: cc.v2(0, 0),
                    },
                    banner: {
                        position: cc.v2(0, -416.308),
                        children: {
                            // icon: {
                            //     position: cc.v2(-197, 27)
                            // },
                            // logo: {
                            //     position: cc.v2(-49.894, 28.893)
                            // },
                            // btn: {
                            //     position: cc.v2(148.009, 28.4)
                            // },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-204.098, 388.841)
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