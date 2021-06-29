import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isMintegral = true; // 检测是不是isMintegral平台
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            game: {
                scale: 0.80,
                position: cc.v2(240, 0),
                children: {
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.89,
                        position: cc.v2(-240, 180)
                    },
                    banner: {
                        scale: 0.89,
                        position: cc.v2(-240, -210),
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    awardPage_box: {
                        scale: 0.65,
                        position: cc.v2(240, 0),
                    },
                }
            }
        }
        this.VerticalConfig = {
            game: {
                scale: 1,
                position: cc.v2(0, 0),
            },
            UI: {
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 405)
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -420),
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    awardPage_box: {
                        scale: 1,
                        position: cc.v2(0, 0),
                    },
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