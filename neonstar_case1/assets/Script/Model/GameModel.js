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
                position: cc.v2(233.651, 41.087),
                scale: 0.822,
                children: {
                    bg1: {
                        angle: -90,
                        position: cc.v2(-162.721, 0)
                    }
                }
            },
            UI: {
                children: {
                    flyIcons: {
                        position: cc.v2(233.651, 41.087),
                        scale: 0.822,
                    },
                    paypal: {
                        scale: 0.865,
                        position: cc.v2(-233.489, 191.992),
                        children: {
                            // icon: {
                            //     position: cc.v2(-67.054, -7.471)
                            // },
                            // btn: {
                            //     position: cc.v2(137.034, -40.34)
                            // },
                            // cash: {
                            //     position: cc.v2(135.994, 31.177)
                            // }
                        }
                    },
                    banner: {
                        position: cc.v2(-211.64, -197.735),
                        children: {
                            icon: {
                                position: cc.v2(-180.506, 0)
                            },
                            logo: {
                                position: cc.v2(-132, 111.364)
                            },
                            btn: {
                                position: cc.v2(26.258, -6.772)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(28, 35.45)
                            },
                            mtg: {
                                position: cc.v2(-35.976, 46.492),
                                scale: 0.82,
                                active: this.isMintegral
                                
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-426.667, 93.354)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    bg1: {
                        angle: 0,
                        position: cc.v2(0, 0)
                    }
                }
            },
            UI: {
                children: {
                    flyIcons: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    paypal: {
                        scale: 1,
                        position: cc.v2(5.241, 390.087),
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
                        }
                    },
                    banner: {
                        position: cc.v2(0, -428),
                        children: {
                            icon: {
                                position: cc.v2(-195.334, 0)
                            },
                            logo: {
                                position: cc.v2(-7.163, 0)
                            },
                            btn: {
                                position: cc.v2(183.089, 0)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(0, 50.45)
                            },
                            mtg: {
                                position: cc.v2(0, 65.672),
                                scale: 1,
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 306.687)
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