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
                position: cc.v2(195.695, 30),
                scale: 0.7
            },
            UI: {
                children: {
                    notification: {},
                    paypal: {
                        position: cc.v2(-565.947, 105.043),
                        width: 976,
                        height: 428,
                        children: {
                            icon: {
                                position: cc.v2(304.487, 60.474)
                            },
                            btn: {
                                position: cc.v2(304.834, -127.104)
                            },
                            cash: {
                                position: cc.v2(305.292, -67.126)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(-385.431, 179.447)
                    },
                    banner: {
                        position: cc.v2(-398.903, -242.083),
                        children: {
                            icon: {
                                position: cc.v2(53.189, 33.386),
                                width: 59,
                                height: 59
                            },
                            btn: {
                                position: cc.v2(204.226, 33.944),
                                width: 167.3,
                                height: 49.2
                            },
                            logo: {
                                position: cc.v2(7.189, 49.386),
                                width: 74,
                                height: 54
                            }
                        }
                    },
                    congrat: {
                        angle: 90
                    },
                    congratBlur: {
                        angle: 90
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1
            },
            UI: {
                children: {
                    notification: {},
                    paypal: {
                        position: cc.v2(0, 527.061),
                        width: 870,
                        height: 382,
                        children: {
                            icon: {
                                position: cc.v2(-155.784, -117.412)
                            },
                            btn: {
                                position: cc.v2(157.471, -154.966)
                            },
                            cash: {
                                position: cc.v2(157.929, -86.415)
                            }
                        }
                    },
                    audioBtn: {
                        position: cc.v2(0, 370.865)
                    },
                    banner: {
                        position: cc.v2(0, -500.697),
                        children: {
                            icon: {
                                position: cc.v2(-127.302, 76.244),
                                width: 75.7,
                                height: 75.7
                            },
                            btn: {
                                position: cc.v2(78.068, 68.595),
                                width: 186,
                                height: 54.7
                            },
                            logo: {
                                position: cc.v2(-186.134, 97.196),
                                width: 95,
                                height: 69
                            }
                        }
                    },
                    congrat: {
                        angle: 0
                    },
                    congratBlur: {
                        angle: 0
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

    // 设置通知的位置,要让通知在屏幕顶部
    setNotificationPos (screen) {
        // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
        // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
        let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
        let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
        // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
        // let y = this.guideScript.notification.height/2 + _screenH;
        let halfHeight = this.guideScript.notification.height/2;
        this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
        this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {
        


    }
}