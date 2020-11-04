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
                position: cc.v2(226.518, 26.337),
                scale: 0.773,
            },
            UI: {
                children: {
                    congrat: {
                        // angle: 90,
                        // opacity: 255,
                        width: 277.38, // applovin
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
                    tankuang: {},
                    paypal: {
                        width: 681,
                        height: 401,
                        position: cc.v2(-367.133, 78.481),
                        children: {
                            icon: {
                                position: cc.v2(12.613, -16.75),
                            },
                            btn: {
                                position: cc.v2(195.954, -56.958),
                            },
                            cash: {
                                position: cc.v2(195.979, 21.444),
                            }
                        }
                    },
                    banner: {
                        width: 586,
                        height: 185.9,
                        position: cc.v2(-319.406, -209.075),
                        children: {
                            icon: {
                                position: cc.v2(-105.227, 25.09),
                            },
                            btn: {
                                position: cc.v2(193.282, 14.077),
                            },
                            logo: {
                                position: cc.v2(24.869, 20.323),
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-404.924, 200.828)
                    }
                }
            }
        };
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
            },
            UI: {
                children: {
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
                    tankuang: {},
                    paypal: {
                        width: 681,
                        height: 401,
                        position: cc.v2(0, 529.152),
                        children: {
                            icon: {
                                position: cc.v2(-180, -124),
                            },
                            btn: {
                                position: cc.v2(158.745, -161.628),
                            },
                            cash: {
                                position: cc.v2(158.77, -94.561),
                            }
                        }
                    },
                    banner: {
                        width: 586,
                        height: 185.9,
                        position: cc.v2(0, -471.7),
                        children: {
                            icon: {
                                position: cc.v2(-208.1, 39.471),
                            },
                            btn: {
                                position: cc.v2(149.506, 31.587),
                            },
                            logo: {
                                position: cc.v2(-51.739, 37.833),
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 369.364)
                    }
                }
            }
        };

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
        this.VerticalConfig.UI.children.tankuang.position = cc.v2(0, long/2 - halfHeight);
        this.HorizontalConfig.UI.children.tankuang.position = cc.v2(0, short/2 - halfHeight);
    }
}