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
                scale: 0.89,
                position: cc.v2(240, 0)
            },
            game: {
                scale: 0.75,
                position: cc.v2(240, 0)
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.89,
                        position: cc.v2(-240, 210)
                    },
                    banner: {
                        scale: 0.89,
                        position: cc.v2(-240, -227),
                        children: {
                            icon: {
                                position: cc.v2(-150, 5.812)
                            },
                            logo: {
                                scale: 1.5,
                                position: cc.v2(0, 250)
                            },
                            playNow: {

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
                        scale: 0.75
                    }
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
                        scale: 1,
                        position: cc.v2(0, 410.11)
                    },
                    // turn: {
                    // },
                    // pps: {
                    // },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -428.892),
                        children: {
                            icon: {
                                position: cc.v2(-208.172, 5.812)
                            },
                            logo: {
                                scale: 1,
                                position: cc.v2(-75.053, 3.335)
                            },
                            playNow: {
                                position: cc.v2(129.843, 0)
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
                        scale: 1
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