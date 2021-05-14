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
                position: cc.v2(237.636, -4.141),
                scale: 0.842,
                children: {
                    bg: {
                        position: cc.v2(0, 0)
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(-239.186, 193.582),
                        scale: 0.891,
                    },
                    banner: {
                        position: cc.v2(-232.54, -204.592),
                        children: {
                            icon: {
                                position: cc.v2(-151.711, -2.499),
                            },
                            logo: {
                                position: cc.v2(-23.499, 195.039),
                                scale: 1,
                            },
                            btn: {
                                position: cc.v2(91.945, -7.331)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(119.427, 69.374),
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-240.934, 225.379)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    bg: {
                        position: cc.v2(0, 0)
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(0, 401.68),
                        scale: 1,
                    },
                    banner: {
                        position: cc.v2(0, -417.201),
                        children: {
                            icon: {
                                position: cc.v2(-200.75, -2.499),
                            },
                            logo: {
                                position: cc.v2(-23.499, -1.625),
                                scale: 1,
                            },
                            btn: {
                                position: cc.v2(176.5, -2.623)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(200.427, 69.374),
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 436.66)
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