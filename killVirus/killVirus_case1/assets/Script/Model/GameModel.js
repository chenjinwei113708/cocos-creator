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
        this.isApplovin = true; // 是不是applovin平台
        this.HorizontalConfig = {
            background: {
                scale: 0.89,
                position: cc.v2(240, 0)
            },
            game: {
                scale: 0.89,
                position: cc.v2(240, 0),
                children: {
                    grid: {
                        // scale: 0.8
                    }
                }
            },
            UI: {
                // scale: 0.89,
                // position: cc.v2(0, 0),
                children: {
                    paypal: {
                        scale: 0.89,
                        position: cc.v2(-240, 220)
                    },
                    banner: {
                        scale: 0.89,
                        position: cc.v2(-240, -210),
                        children: {
                            icon: {
                                position: cc.v2(-130, 0)
                            },
                            logo: {
                                scale: 1.5,
                                position: cc.v2(0, 230)
                            },
                            playNow: {
                                position: cc.v2(90, 0)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    pps: {
                    },
                    awardPageBox: {
                        scale: 0.65,
                        position: cc.v2(240, 0),
                        children: {
                            bg_iphone: {
                                scale: 0.89 / 0.65
                            }
                        }
                    },
                    turn_box: {
                        scale: 0.65,
                        position: cc.v2(240, 30),
                        children: {
                            bg_turn: {
                                scale: 0.89 / 0.65
                            }
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
                        position: cc.v2(0, 438.821)
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -420),
                        children: {
                            icon: {
                                position: cc.v2(-210, 0)
                            },
                            logo: {
                                scale: 1,
                                position: cc.v2(-58.035, 0)
                            },
                            playNow: {
                                position: cc.v2(146.469, 0)
                            },
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    pps: {
                    },
                    awardPageBox: {
                        scale: 1,
                        position: cc.v2(0, 0),
                        children: {
                            bg_iphone: {
                                scale: 1
                            }
                        }
                    },
                    turn_box: {
                        scale: 1,
                        position: cc.v2(0, 0),
                        children: {
                            bg_turn: {
                                scale: 1
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