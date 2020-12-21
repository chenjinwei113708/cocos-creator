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
        this.isIos = true; // 是不是ios平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(255.943, 50.845),
                scale: 0.682,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    },
                    paycard: {
                        children: {
                            an_name: {
                                active: this.isIos ? false : true,
                            },
                            ios_name: {
                                active: this.isIos ? true : false
                            }
                        }
                    }
                }
            },
            UI: {
                children: {
                    congrat: this.isApplovin ? {
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190,
                        children: {
                            android: {
                                active: this.isIos ? false : true
                            },
                            ios: {
                                active: this.isIos ? true : false
                            }
                        }
                    } : {
                        opacity: 255,
                        angle: 90,
                        children: {
                            android: {
                                active: this.isIos ? false : true
                            },
                            ios: {
                                active: this.isIos ? true : false
                            }
                        }
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
                        position: cc.v2(-236.439, 206.958),
                        scale: 0.904
                    },
                    playnow: {
                        position: cc.v2(-231.197, -224.408),
                    },
                    an_logo: {
                        active: this.isIos ? false : true,
                        position: cc.v2(-233.127, -10.21),
                    },
                    ios_logo: {
                        active: this.isIos ? true : false,
                        position: cc.v2(-233.127, -10.21),
                    },
                    an_icon: {
                        active: this.isIos ? false : true,
                        position: cc.v2(-232.073, -130.521),
                    },
                    ios_icon: {
                        active: this.isIos ? true : false,
                        position: cc.v2(-232.073, -130.521),
                    },
                    modal: {
                        children: {
                            endPage: {
                                children: {
                                    android: {
                                        active: this.isIos ? false : true,
                                    },
                                    ios: {
                                        active: this.isIos ? true : false,
                                    }
                                }
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-434.384, 233.086)
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
                    },
                    paycard: {
                        children: {
                            an_name: {
                                active: this.isIos ? false : true,
                            },
                            ios_name: {
                                active: this.isIos ? true : false
                            }
                        }
                    }
                }
            },
            UI: {
                children: {
                    congrat: this.isApplovin ? {
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255,
                        children: {
                            android: {
                                active: this.isIos ? false : true
                            },
                            ios: {
                                active: this.isIos ? true : false
                            }
                        }
                    } : {
                        opacity: 255,
                        angle: 0,
                        children: {
                            android: {
                                active: this.isIos ? false : true
                            },
                            ios: {
                                active: this.isIos ? true : false
                            }
                        }
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
                        position: cc.v2(0, 477.582),
                        scale: 1
                    },
                    playnow: {
                        position: cc.v2(-179.304, -434.999),
                    },
                    an_logo: {
                        active: this.isIos ? false : true,
                        position: cc.v2(-181.234, -280.597),
                    },
                    ios_logo: {
                        active: this.isIos ? true : false,
                        position: cc.v2(-181.234, -280.597),
                    },
                    an_icon: {
                        active: this.isIos ? false : true,
                        position: cc.v2(-180.18, -353.071),
                    },
                    ios_icon: {
                        active: this.isIos ? true : false,
                        position: cc.v2(-180.18, -353.071),
                    },
                    modal: {
                        children: {
                            endPage: {
                                children: {
                                    android: {
                                        active: this.isIos ? false : true,
                                    },
                                    ios: {
                                        active: this.isIos ? true : false,
                                    }
                                }
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(220.83, -405.252)
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