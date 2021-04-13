import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isMintegral = false; // 检测是不是isMintegral平台
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            background: {
                scale: 0.75,
                position: cc.v2(280, 0)
            },
            game: {
                scale: 0.75,
                position: cc.v2(280, 0)
            },
            UI: {
                // scale: 0.89,
                position: cc.v2(0, 0),
                children: {
                    paypal: {
                        // scale: 0.89,
                        position: cc.v2(-200, 190)
                    },
                    banner: {
                        // scale: 0.89,
                        position: cc.v2(-200, -210),
                        children: {
                            icon: {
                                position: cc.v2(-142.01, 0)
                            },
                            playNow: {
                                position: cc.v2(111.561, 0)
                            },
                            logo: {
                                position: cc.v2(0, 190)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    // turn: {
                    // },
                    // pps: {
                    // },
                    // awardPageBox: {
                    // }
                }
            }
        }
        this.VerticalConfig = {
            background: {
                scale: 1,
                position: cc.v2(0, 0)
            },
            game: {
                scale: 1,
                position: cc.v2(0, 0)
            },
            UI: {
                children: {
                    paypal: {
                        position: cc.v2(0, 405)
                    },
                    pps: {
                    },
                    banner: {
                        position: cc.v2(0, -425),
                        children: {
                            icon: {
                                position: cc.v2(-189.182, 0)
                            },
                            logo: {
                                position: cc.v2(-53.4, 0)
                            },
                            playNow: {
                                position: cc.v2(141.8, 0)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    awardPageBox: {
                    }
                }
            }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        
        this.guideScript = null;

    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {}
}