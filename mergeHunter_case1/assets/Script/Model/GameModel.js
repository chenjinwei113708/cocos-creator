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
        this.isIronSource = false // 是不是is平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(255.785, 16.715),
                scale: 0.725,
                children: {
                    bg: {
                        position: cc.v2(-312, 132),
                        width: 1433,
                        height: 1510
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.937,
                        position: cc.v2(-223.835, 189.449),
                    },
                    banner: {
                        position: cc.v2(-244.848, -211.687),
                        children: {
                            bg: {
                                active: false,
                            },
                            icon: {
                                position: cc.v2(-109, -6.9)
                            },
                            logo: {
                                position: cc.v2(2.316, 192.863)
                            },
                            btn: {
                                position: cc.v2(119.756, -10.29)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 66),
                            },
                            is: {
                                active: this.isIronSource,
                                position: cc.v2(0,54.643),
                            }
                        }
                    },
                    pps: {
                        position: cc.v2(255.785, 16.715),
                        scale: 0.725
                    },
                    ppfly: {
                        position: cc.v2(255.785, 16.715),
                        scale: 0.725
                    },
                    audioBtn: {
                        position: cc.v2(-432.723, 76.988)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0,0),
                scale: 1,
                children: {
                    bg: {
                        position: cc.v2(0, 15.5),
                        width: 808,
                        height: 1116
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 431.56),
                    },
                    banner: {
                        position: cc.v2(0, -431.56),
                        children: {
                            bg: {
                                active: true,
                            },
                            icon: {
                                position: cc.v2(-201.56, -6.92)
                            },
                            logo: {
                                position: cc.v2(-44.86, -3.12)
                            },
                            btn: {
                                position: cc.v2(161.49, -10.29)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 150),
                            },
                            is: {
                                active: this.isIronSource,
                                position: cc.v2(0,136.6),
                            }
                        }
                    },
                    pps: {
                        position: cc.v2(0,0),
                        scale: 1
                    },
                    ppfly: {
                        position: cc.v2(0,0),
                        scale: 1
                    },
                    audioBtn: {
                        position: cc.v2(-229.1, 323.456)
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