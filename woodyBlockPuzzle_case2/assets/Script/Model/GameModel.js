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
                position: cc.v2(226.014, 31.264),
                scale: 0.754
            },
            UI: {
                children: {
                    paypal: {
                        width: 662,
                        height: 588,
                        position: cc.v2(-353, 6),
                        children: {
                            progress: {
                                position: cc.v2(31.22, 71.519)
                            },
                            play2win: {
                                position: cc.v2(31.175, 155),
                            },
                            ppcard: {
                                position: cc.v2(251.495, 126.907),
                            },
                            arrow: {
                                position: cc.v2(149.948, 174.82)
                            }
                        }
                    },
                    icon: {
                        position: cc.v2(-356.685, -110.577),
                    },
                    logo: {
                        position: cc.v2(-359.301, -188.815),
                    },
                    btn: {
                        position: cc.v2(-168.451, -192.761),
                    },
                    audioBtn: {
                        position: cc.v2(-431.024, 222.084),
                    },
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
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1
            },
            UI: {
                children: {
                    paypal: {
                        width: 551,
                        height: 318,
                        position: cc.v2(0, 464),
                        children: {
                            progress: {
                                position: cc.v2(-108.1, -122.1)
                            },
                            play2win: {
                                position: cc.v2(-108.145, -42.297),
                            },
                            ppcard: {
                                position: cc.v2(196.322, -71.713),
                            },
                            arrow: {
                                position: cc.v2(85.58, -67.939)
                            }
                        }
                    },
                    icon: {
                        position: cc.v2(-208.378, -435.595),
                    },
                    logo: {
                        position: cc.v2(-54.53, -438.431),
                    },
                    btn: {
                        position: cc.v2(149.002, -440.538),
                    },
                    audioBtn: {
                        position: cc.v2(0, 450.422),
                    },
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