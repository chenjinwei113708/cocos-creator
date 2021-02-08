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
        this.isMintegral = true; // 是不是mtg平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(237.227, -5.56),
                scale: 0.868,
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(-245.569, 219.511),
                        scale: 0.818,
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
                    banner: {
                        position: cc.v2(-242.057, -214.52),
                        scale: 0.864,
                        children: {
                            logo: {
                                width: 265,
                                height: 178,
                                position: cc.v2(-21.194, 217.939)
                            },
                            btn: {
                                position: cc.v2(76.286, -8.374)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    game: {
                        position: cc.v2(237.227, -5.56),
                        scale: 0.868,
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-439.944, 94.279)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(0, 444.4),
                        scale: 1,
                    },
                    banner: {
                        position: cc.v2(0, -431.562),
                        scale: 1,
                        children: {
                            logo: {
                                width: 185,
                                height: 124,
                                position: cc.v2(174.253, 2.18)
                            },
                            btn: {
                                position: cc.v2(0, -8.374)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    game: {
                        position: cc.v2(0, 0),
                        scale: 1,
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 308.779)
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