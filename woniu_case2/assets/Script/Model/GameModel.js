import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isMtg = true;
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(240, 10),
                scale: 0.75,
                children: {
                    select: {
                        position: cc.v2(0, 280)
                    }
                }
            },
            UI: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    banner: {
                        position: cc.v2(-240, 0),
                        children: {
                            icon: {
                                position: cc.v2(0, 0)
                            },
                            logo: {
                                width: 302,
                                height: 114,
                                position: cc.v2(0, 180)
                            },
                            download: {
                                width: 232,
                                height: 81,
                                position: cc.v2(0, -170)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(0, -240)
                            },
                            mtg: {
                                active: this.isMtg,
                                position: cc.v2(0, -240)
                            }
                        }
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    select: {
                        position: cc.v2(0, 380)
                    }
                }
            },
            UI: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    banner: {
                        position: cc.v2(0, -420),
                        children: {
                            icon: {
                                width: 97,
                                height: 97,
                                position: cc.v2(-200, 0)
                            },
                            logo: {
                                width: 170.6,
                                height: 64.4,
                                position: cc.v2(180, 0)
                            },
                            download: {
                                width: 199,
                                height: 70,
                                position: cc.v2(-20, 0)
                            },
                            adsonly: {
                                active: this.isApplovin,
                                position: cc.v2(175, 40)
                            },
                            mtg: {
                                active: this.isMtg,
                                position: cc.v2(0, 53)
                            }
                        }
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