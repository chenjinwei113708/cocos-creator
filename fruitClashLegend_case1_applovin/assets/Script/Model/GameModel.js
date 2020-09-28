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
                scale: 0.9,
                position: cc.v2(211.28, -3.707),
                children: {
                    bg: {
                        scale: 1.5
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(-449.934, 123.204),
                        width: 779,
                        height: 432,
                        children: {
                            icon: {
                                position: cc.v2(73.522, -45.077)
                            },
                            cash: {
                                position: cc.v2(272.43, -15.242)
                            },
                            btn: {
                                position: cc.v2(272.144, -89.322)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-342.867, -225.557),
                        width: 564,
                        height: 268,
                        children: {
                            icon: {
                                position: cc.v2(-25.601, 71.402)
                            },
                            btn: {
                                position: cc.v2(76.222, -8.427)
                            },
                            logo: {
                                position: cc.v2(139.375, 69.396)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-428.42, 218.418)
                    },
                    congrat: {
                        width: 277.38,
                        height: 540,
                        opacity: 190
                    },
                    congratBlur: {
                        width: 277.38,
                        height: 540,
                        opacity: 170
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                scale: 1,
                position: cc.v2(0, 0),
                children: {
                    bg: {
                        scale: 1
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(0, 467),
                        width: 555,
                        height: 308,
                        children: {
                            icon: {
                                position: cc.v2(-163.443, -71.755)
                            },
                            cash: {
                                position: cc.v2(161, -41.92)
                            },
                            btn: {
                                position: cc.v2(160.723, -116)
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(0, -490.584),
                        width: 564,
                        height: 268,
                        children: {
                            icon: {
                                position: cc.v2(-198.345, 71.402)
                            },
                            btn: {
                                position: cc.v2(-30, 58)
                            },
                            logo: {
                                position: cc.v2(172.595, 66.739)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 356.5)
                    },
                    congrat: {
                        width: 603,
                        height: 1170,
                        opacity: 255
                    },
                    congratBlur: {
                        width: 603,
                        height: 1170,
                        opacity: 255
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