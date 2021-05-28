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
        this.isMintegral = false; // 是不是mtg平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(227.549, 50.218),
                scale: 0.748,
                children: {
                    bg: {
                        // angle: 90,
                        position: cc.v2(10, 0),

                        scale: 1.04
                    },
                    cashbg: {
                        position: cc.v2(0, -103.778 - 70)
                    },
                    cashes: {
                        position: cc.v2(0, -112.778 - 70)
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(-240.104, 176.259),
                        children: {
                            // icon: {
                            //     position: cc.v2(-140.179, 12.075)
                            // },
                            // btn: {
                            //     position: cc.v2(137.034, -40.34)
                            // },
                            // cash: {
                            //     position: cc.v2(135.994, 31.177)
                            // }
                            dollar: {
                                position: cc.v2(54.034 - 30, 28.874)
                            },
                            cash: {
                                position: cc.v2(120.269 - 30, 30.562)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-300.261, -195.509),
                        children: {
                            icon: {
                                position: cc.v2(60, 200)
                            },
                            logo: {
                                position: cc.v2(-30, -30),
                            },
                            btn: {
                                position: cc.v2(130, -30),
                                scale: 1
                            },
                            adsonly: {
                                position: cc.v2(60, 20),
                                active: this.isApplovin
                            },
                            mtg: {
                                position: cc.v2(40, 71.313),
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-434.854, 71.413)
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
                        angle: 0,
                        position: cc.v2(0, 0),
                        scale: 1
                    },
                    cashbg: {
                        position: cc.v2(0, -103.778)
                    },
                    cashes: {
                        position: cc.v2(0, -112.778)
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(0, 367.714),
                        children: {
                            // icon: {
                            //     position: cc.v2(-155.976, -7.471)
                            // },
                            // btn: {
                            //     position: cc.v2(137.034, -40.34)
                            // },
                            // cash: {
                            //     position: cc.v2(135.994, 31.177)
                            // }
                            dollar: {
                                position: cc.v2(54.034, 28.874)
                            },
                            cash: {
                                position: cc.v2(120.269, 30.562)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(0, -425.301),
                        children: {
                            icon: {
                                position: cc.v2(-143.225, -10.042)
                            },
                            logo: {
                                position: cc.v2(-6.512, -10),

                            },
                            btn: {
                                position: cc.v2(155.7, -9)
                            },
                            adsonly: {
                                position: cc.v2(150.341, 27.44),
                                active: this.isApplovin
                            },
                            mtg: {
                                position: cc.v2(0, 71.313),
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-224.567, 266.007)
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