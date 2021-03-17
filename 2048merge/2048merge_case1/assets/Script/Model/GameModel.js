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
                scale: 0.89,
                position: cc.v2(240, 50)
            },
            UI: {
                scale: 0.89,
                position: cc.v2(0, 0),
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(-240, 220)
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(-240, -230),
                        children: {
                            adsonly: {
                                active: this.isApplovin
                            },
                            mtg: {
                                active: this.isMintegral
                            }
                        }
                    },
                    turn: {
                        scale: 1,
                        position: cc.v2(280, 50)
                    },
                    award: {
                        scale: 0.8,
                        position: cc.v2(280, -20)
                    },
                    pps: {
                        scale: 1,
                        position: cc.v2(280, 0)
                    },
                    awardPageBox: {
                        scale: 1,
                        position: cc.v2(280, 0)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                scale: 1,
                position: cc.v2(0, 0),
                
            },
            UI: {
                scale: 1,
                position: cc.v2(0, 0),
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 405)
                    },
                    turn: {
                        scale: 1,
                        position: cc.v2(0, 40)
                    },
                    pps: {
                        scale: 1,
                        position: cc.v2(0, 0)
                    },
                    banner: {
                        scale: 1,
                        position: cc.v2(0, -410),
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
                        scale: 1,
                        position: cc.v2(0, 0)
                    },
                    award: {
                        scale: 1,
                        position: cc.v2(0, 0)
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