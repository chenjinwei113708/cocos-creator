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
                position: cc.v2(239.546, 79.659),
                scale: 0.88,
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
                    paypal: {
                        position: cc.v2(-283.1, 127.459),
                        children: {
                            laoren: {
                                width: 160,
                                height: 89,
                                position: cc.v2(392.037, 117.86)
                            },
                            icon: {
                                position: cc.v2(-67.054, -7.471)
                            },
                            btn: {
                                position: cc.v2(137.034, -40.34)
                            },
                            cash: {
                                position: cc.v2(135.994, 31.177)
                            },
                            mtg: {
                                active: this.isMintegral ? true : false,
                                position: cc.v2(35, -114.818)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-261.323, -242.363),
                        children: {
                            icon: {
                                position: cc.v2(-70.997, 131.491)
                            },
                            logo: {
                                position: cc.v2(76.109, 130.311)
                            },
                            btn: {
                                position: cc.v2(17.395, 25.327)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-415.577, 212.604)
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
                    paypal: {
                        position: cc.v2(0, 396.319),
                        children: {
                            laoren: {
                                width: 319.4,
                                height: 177.4,
                                position: cc.v2(-0.75, -186.539)
                            },
                            icon: {
                                position: cc.v2(-155.976, -7.471)
                            },
                            btn: {
                                position: cc.v2(137.034, -40.34)
                            },
                            cash: {
                                position: cc.v2(135.994, 31.177)
                            },
                            mtg: {
                                active: this.isMintegral ? true : false,
                                position: cc.v2(0, -114.818)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(0, -458.318),
                        children: {
                            icon: {
                                position: cc.v2(-197, 27)
                            },
                            logo: {
                                position: cc.v2(-49.894, 28.893)
                            },
                            btn: {
                                position: cc.v2(148.009, 28.4)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 403.152)
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
}