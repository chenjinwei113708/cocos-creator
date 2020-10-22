import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.HorizontalConfig = {
            game: {
                scale: 0.911,
                position: cc.v2(204.984, -28.332)
            },
            UI: {
                children: {
                    notification: {},
                    congrat: {
                        // angle: 90,
                        // opacity: 255,
                        width: 277.38,
                        height: 540,
                        opacity: 190
                    },
                    congratBlur: {
                        // angle: 90,
                        // opacity: 255,
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    },
                    topbar: {
                        width: 615,
                        height: 157,
                        position: cc.v2(-373.472, 7.975),
                        children: {
                            icon: {
                                position: cc.v2(6.071, 85.104)
                            },
                            cash: {
                                position: cc.v2(193.333, 129.973)
                            },
                            btn: {
                                position: cc.v2(198.836, 43.708)
                            }
                        }
                    },
                    footer: {
                        width: 1257,
                        height: 356,
                        position: cc.v2(-486.923, -162.133),
                        children: {
                            icon: {
                                position: cc.v2(451.758, 45.6)
                            },
                            logo: {
                                position: cc.v2(174.543, -65.765)
                            },
                            btn: {
                                position: cc.v2(454.322, -83.822)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-430.435, 222.526)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                scale: 1,
                position: cc.v2(0, -62.368)
            },
            UI: {
                children: {
                    notification: {},
                    congrat: {
                        // angle: 0,
                        // opacity: 255,
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    },
                    congratBlur: {
                        // angle: 0,
                        // opacity: 255,
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    },
                    topbar: {
                        width: 615,
                        height: 157,
                        position: cc.v2(0, 353.163),
                        children: {
                            icon: {
                                position: cc.v2(-173.059, 29.703)
                            },
                            cash: {
                                position: cc.v2(152.705, 69.032)
                            },
                            btn: {
                                position: cc.v2(156.362, -8)
                            }
                        }
                    },
                    footer: {
                        width: 1080,
                        height: 282,
                        position: cc.v2(7.392, -427.928),
                        children: {
                            icon: {
                                position: cc.v2(-299.126, 18.033)
                            },
                            logo: {
                                position: cc.v2(-86.849, 13.586)
                            },
                            btn: {
                                position: cc.v2(213.935, 14.2)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-2, 440.436)
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
}