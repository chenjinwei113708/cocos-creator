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
        this.isMintegral = false; // 是不是applovin平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(242.618, 25.533),
                scale: 0.83,
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
                    // notification: {},
                    paypal: {
                        scale: 0.87,
                        position: cc.v2(-240.537, 195.548),
                    },
                    boxEffect: {
                        position: cc.v2(242.618, 25.533),
                        scale: 0.83,
                    },
                    banner: {
                        position: cc.v2(-229.401, -186),
                        width: 467,
                        height: 106,
                        children: {
                            icon: {
                                position: cc.v2(-138.92, -0.139)
                            },
                            logo: {
                                position: cc.v2(11, 193),
                                width: 133 ,
                                height: 66
                            },
                            btn: {
                                position: cc.v2(84.571, -9)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-431.35, -69.478)
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
                    // notification: {},
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 405),
                    },
                    boxEffect: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    banner: {
                        position: cc.v2(0, -413.371),
                        width: 525,
                        height: 119,
                        children: {
                            icon: {
                                position: cc.v2(-203.262, 3)
                            },
                            logo: {
                                position: cc.v2(-41.893, -3),
                                width: 133,
                                height: 66
                            },
                            btn: {
                                position: cc.v2(159.898, -9)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-230.043, 400.336)
                    }
                }
            }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        
        this.guideScript = null;

        this.level1Model = [
            [],
            [undefined, 'C2', 'C2', 'C2', 'C2', 'C3'],
            [undefined, 'C2', 'C2', 'C2', 'C2', 'C1'],
            [undefined, 'C2', 'C2', 'C2', 'C2', 'C5'],
            [undefined, 'C4', 'C6', 'C1', 'C1', 'C5'],
            [undefined, 'C4', 'C4', 'C6', 'C3', 'C4'],
        ];

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