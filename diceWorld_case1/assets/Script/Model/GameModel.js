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
                position: cc.v2(226.398, 8.775),
                scale: 0.8,
                children:{
                    background: {
                        width: 1000,
                        height: 1280
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        width: 820,
                        height: 455,
                        position: cc.v2(-429.402, 111.673),
                        children:{
                            icon: {
                                position: cc.v2(61.814, -51.673)
                            },
                            cash: {
                                position: cc.v2(270.683, -6.734)
                            },
                            btn: {
                                position: cc.v2(272.809, -101.121)
                            }
                        }
                    },
                    banner: {
                        width: 706,
                        height: 206,
                        position: cc.v2(-371.711, -215.366),
                        children:{
                            icon: {
                                position: cc.v2(-37.74, 23.148)
                            },
                            logo: {
                                position: cc.v2(195.87, 50.957)
                            },
                            btn: {
                                position: cc.v2(192.2, -10.904)
                            }
                        }
                    },
                    guide: {
                        children: {
                            paypalCard: {
                                position: cc.v2(232.14, 3.302),
                                scale: 0.8,
                            }
                        }
                    },
                    congrat: {
                        angle: 90
                    },
                    congratBlur: {
                        angle: 90
                    },
                    audioBtn: {
                        position: cc.v2(-424.717, 228.227)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children:{
                    background: {
                        width: 720,
                        height: 1280
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        width: 618,
                        height: 343,
                        position: cc.v2(0, 446.678),
                        children:{
                            icon: {
                                position: cc.v2(-137, -70.548)
                            },
                            cash: {
                                position: cc.v2(152.4, -25.609)
                            },
                            btn: {
                                position: cc.v2(154.527, -119.996)
                            }
                        }
                    },
                    banner: {
                        width: 566,
                        height: 165,
                        position: cc.v2(0, -422),
                        children:{
                            icon: {
                                position: cc.v2(-153.505, 13.148)
                            },
                            logo: {
                                position: cc.v2(80.105, 40.957)
                            },
                            btn: {
                                position: cc.v2(76.436, -20.904)
                            }
                        }
                    },
                    guide: {
                        children: {
                            paypalCard: {
                                position: cc.v2(0, 3.302),
                                scale: 0.8,
                            }
                        }
                    },
                    congrat: {
                        angle: 0
                    },
                    congratBlur: {
                        angle: 0
                    },
                    audioBtn: {
                        position: cc.v2(0, 380.914)
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