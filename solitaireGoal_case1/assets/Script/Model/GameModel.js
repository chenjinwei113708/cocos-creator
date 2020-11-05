

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.HorizontalConfig = {
            game: {
                position: cc.v2(198.739, 187.273),
                scale: 1,
                children: {
                    mask: {
                        children: {
                            show: {
                                position: cc.v2(428.134, 188.289)
                            }
                        }
                    }
                }
            },
            UI: {
                children: {
                    congrat: {
                        opacity: 255,
                        angle: 90,
                        // width: 277.38, // applovin
                        // height: 540,
                        // opacity: 190
                    },
                    congratBlur: {
                        opacity: 255,
                        angle: 90,
                        // width: 277.38, // applovin
                        // height: 540,
                        // opacity: 190
                    },
                    notification: {},
                    paypal: {
                        position: cc.v2(-297.666, 141.217),
                        // width: 600,
                        // height: 438,
                        scale: 0.67,
                        children: {
                            top: {
                                position: cc.v2(0, 221.772)
                            },
                            banner: {
                                position: cc.v2(0, -431.1),
                                width: 600,
                                height: 421.3
                            },
                            download: {
                                position: cc.v2(0, -531.981)
                            },
                            icon: {
                                position: cc.v2(0, -433.958),
                                width: 99,
                                height: 99,
                            },
                            logo: {
                                position: cc.v2(0, -322.253),
                                width: 156,
                                height: 110,
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-437.987, -228.878)
                    },
                    effect: {
                        position: cc.v2(198.182, 156.364)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    mask: {
                        children: {
                            show: {
                                position: cc.v2(229.5, 0.9)
                            }
                        }
                    }
                }
            },
            UI: {
                children: {
                    congrat: {
                        opacity: 255,
                        angle: 0,
                        // width: 603, // applovin
                        // height: 1170,
                        // opacity: 255
                    },
                    congratBlur: {
                        opacity: 255,
                        angle: 0,
                        // width: 603, // applovin
                        // height: 1170,
                        // opacity: 255
                    },
                    notification: {},
                    paypal: {
                        position: cc.v2(0, 281.502),
                        // width: 600,
                        // height: 438,
                        scale: 1,
                        children: {
                            top: {
                                position: cc.v2(0, 221.772)
                            },
                            banner: {
                                position: cc.v2(0, -173),
                                width: 600,
                                height: 92.1
                            },
                            download: {
                                position: cc.v2(148.519, -178.605)
                            },
                            icon: {
                                position: cc.v2(-47.342, -171),
                                width: 64,
                                height: 64,
                            },
                            logo: {
                                position: cc.v2(-184, -172),
                                width: 102,
                                height: 72,
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-233.229, -436.715)
                    },
                    effect: {
                        position: cc.v2(0, 0)
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
        this.VerticalConfig.UI.children.paypal.children.top.position = cc.v2(0, long/2+39 - 281.502);
    }
}