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
                position: cc.v2(239.11, 46.046),
                scale: 0.77,
                children: {
                    grass: {
                        active: false,
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.929,
                        position: cc.v2(-226.779, 276.202),
                    },
                    pps: {
                        position: cc.v2(239.11, 46.046),
                        scale: 0.77
                    },
                    banner: {
                        position: cc.v2(-205.622, -189.883),
                        children: {
                            icon: {
                                position: cc.v2(-208.378, -9.694),
                            },
                            logo: {
                                position: cc.v2(-43.69, 163.534),
                                sacle: 1.273,
                            },
                            btn: {
                                position: cc.v2(93.574, -14.637),
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-425.581, 94.728),
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    grass: {
                        active: true,
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 494.146),
                    },
                    pps: {
                        position: cc.v2(0, 0),
                        scale: 1
                    },
                    banner: {
                        position: cc.v2(0, -425.901),
                        children: {
                            icon: {
                                position: cc.v2(-208.378, -9.694),
                            },
                            logo: {
                                position: cc.v2(-56.206, -9.903),
                                sacle: 1,
                            },
                            btn: {
                                position: cc.v2(149.002, -14.637),
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-221.019, 316.442),
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
    gameInit() {
    }

    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }
}