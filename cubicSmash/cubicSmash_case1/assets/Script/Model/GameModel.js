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
            background: {
                scale: 0.75,
                position: cc.v2(278.5, 0)
            },
            game: {
                scale: 0.75,
                position: cc.v2(278.5, -20),
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.89,
                        position: cc.v2(-210, 220)
                    },
                    mask: {
                        scale: 0.75,
                        position: cc.v2(278.5, 0)
                    },
                    banner: {
                        scale: 0.89,
                        position: cc.v2(-210, -210),
                        children: {
                            icon: {
                                position: cc.v2(0, 220)
                            },
                            // logo: {
                            //     scale: 1.5,
                            //     position: cc.v2(0, 230)
                            // },
                            playNow: {
                                position: cc.v2(0, -19.202)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    award_page_box: {
                        scale: 0.65,
                        position: cc.v2(278.5, 0),
                    },
                    turn_box: {
                        scale: 0.75,
                        position: cc.v2(278.5, 30),
                        children: {
                            // bg_turn: {
                            //     scale: 0.89 / 0.65
                            // }
                        }
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
                position: cc.v2(0, 0),
            },
            UI: {
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 405)
                    },
                    mask: {
                        scale: 1,
                        position: cc.v2(0, 0)
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -405),
                        children: {
                            icon: {
                                position: cc.v2(-150.687, -19.202)
                            },
                            // logo: {
                            //     scale: 1.5,
                            //     position: cc.v2(0, 230)
                            // },
                            playNow: {
                                position: cc.v2(116.688, -19.202)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    award_page_box: {
                        scale: 1,
                        position: cc.v2(0, 0),
                    },
                    turn_box: {
                        scale: 1,
                        position: cc.v2(0, 0),
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