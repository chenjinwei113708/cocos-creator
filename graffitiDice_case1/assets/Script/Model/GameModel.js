import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isApplovin = false;
        this.isMintegral = false;
        this.HorizontalConfig = {
            game: {
                position: cc.v2(226.398, 28.775),
                scale: 0.8,
                children:{
                    background: {
                        width: 1000,
                        height: 1280
                    },
                    adsonly: {
                        active: this.isApplovin
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(-246.402, 211.673),
                        width: 543,
                        height: 133,
                        scale: 0.85,
                        children:{
                            icon: {
                                position: cc.v2(-166, 11.292)
                            },
                            cash: {
                                position: cc.v2(-53.563, 4.591)
                            },
                            btn: {
                                position: cc.v2(132.74, -3.074)
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
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(120, 122.651)
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
                        position: cc.v2(-449.717, 203.227)
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
                    },
                    adsonly: {
                        active: this.isApplovin
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        width: 543,
                        height: 133,
                        position: cc.v2(1.346, 419.258),
                        scale: 1,
                        children:{
                            icon: {
                                position: cc.v2(-166, 11.292)
                            },
                            cash: {
                                position: cc.v2(-53.563, 4.591)
                            },
                            btn: {
                                position: cc.v2(132.74, -3.074)
                            }
                        }
                    },
                    banner: {
                        width: 566,
                        height: 165,
                        position: cc.v2(0, -422),
                        children:{
                            icon: {
                                position: cc.v2(-210.756, -10.487)
                            },
                            logo: {
                                position: cc.v2(-73.435, -12.811)
                            },
                            btn: {
                                position: cc.v2(140.458, -14.869)
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, 52.651)
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
                        position: cc.v2(-237.822, 405.979)
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