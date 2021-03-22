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
                scale: 0.8,
                position: cc.v2(240, 0)
            },
            UI: {
                scale: 0.89,
                position: cc.v2(0, 0),
                children: {
                    paypal: {
                        position: cc.v2(-270, 210),
                        children: {
                            blur: {
                                // active: true
                            }
                        }
                    },
                    banner: {
                        position: cc.v2(-270, this.isMintegral ? -210 : -250),
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    // pps: {
                    // },
                    awardPageBox: {
                        // angle: this.isApplovin ? 0 : 90,
                        children: {
                            awardPage: {
                                position: cc.v2(270, 0),
                                // angle: this.isApplovin ? 0 : -90
                            },
                            pp_page_box: {
                                angle: this.isApplovin ? 0 : 90,
                                opacity: this.isApplovin ? 150: 255,
                                scale: this.isApplovin ? (540 / 960) : 1 / 0.89
                            },
                            mask: {
                                angle: 90,
                                scale: 1 / 0.5
                            },
                        }
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                scale: 1,
                position: cc.v2(0, 0)
            },
            UI: {
                scale: 1,
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 405),
                        children: {
                            blur: {
                                active: false
                            }
                        }
                    },
                    pps: {
                        scale: 1,
                        position: cc.v2(0, 0)
                    },
                    banner: {
                        position: cc.v2(0, this.isMintegral ? -380 : -420),
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    awardPageBox: {
                        children: {
                            awardPage: {
                                position: cc.v2(0, 0),
                            },
                            pp_page_box: {
                                angle: 0,
                                opacity: 255,
                                scale: 1
                            },
                            mask: {
                                angle: 0,
                            }
                        }
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