import {
} from "./ConstValue";

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
                position: cc.v2(240, 0),
                scale: 0.75,
            },
            UI: {
                children: {
                    blur: {
                        scale: 0.89,
                        position: cc.v2(-240, 0),
                        children: {
                            blur_banner: {
                                width: 540,
                                height: 607,
                                position: cc.v2(0, 0)
                            }
                        }
                    },
                    paypal: {
                        scale: 0.89,
                        position: cc.v2(-240, 160),
                        children: {
                            description: {
                                position: cc.v2(0, 50)
                            },
    
                        }
                    },
                    pps: {
                        position: cc.v2(240, 0),
                        scale: 0.75,
                    },
                    banner: {
                        scale: 0.89,
                        position: cc.v2(-241, -200),
                        children: {
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(0, 60)
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    }
                }
            }
        }
        this.VerticalConfig = {
            background: {
                width: 540,
                height: 960,
                scale: 1,
                position: cc.v2(0, 0),
            },
            game: {
                width: 540,
                height: 960,
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    input: {
                        position: cc.v2(0, -300)
                    },
                    dollar: {
                        position: cc.v2(0, 46.866)
                    }
                }
            },
            UI: {
                children: {
                    blur: {
                        position: cc.v2(0, 0),
                        scale: 1,
                        children: {
                            blur_paypal: {
                                position: cc.v2(0, 450)
                            },
                            blur_banner: {
                                height: 200,
                                position: cc.v2(0, -465)
                            }
                        }
                    },
                    awardPageBox: {
                        children: {
                            awardPage: {
                                children: {
                                    ppCard: {
                                        position: cc.v2(0, 30)
                                    }
                                }
                            }
                        }
                    },
                    pps: {
                        scale: 1,
                        position: cc.v2(0, 0)
                    },
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 450),
                        children: {
                            description: {
                                position: cc.v2(0, -4.279)
                            }
                        }
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -420),
                        children: {
                            // blur: {
                            //     position: cc.v2(0, -130)
                            // },
                            icon: {
                                position: cc.v2(-210, 0)
                            },
                            logo: {
                                position: cc.v2(-45, 0)
                            },
                            playNow: {
                                position: cc.v2(170, 0)
                            },
                            mtg: {
                                position: cc.v2(0, -30),
                                active: this.isMintegral
                            },
                            adsonly: {
                                position: cc.v2(165, 40),
                                active: this.isApplovin
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-220, 405)
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
    gameInit() {}
    
    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    // // 设置通知的位置,要让通知在屏幕顶部
    // setNotificationPos (screen) {
    //     // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
    //     // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
    //     let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
    //     let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
    //     // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
    //     // let y = this.guideScript.notification.height/2 + _screenH;
    //     // let halfHeight = this.guideScript.notification.height/2;
    //     this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
    //     this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    // }
}