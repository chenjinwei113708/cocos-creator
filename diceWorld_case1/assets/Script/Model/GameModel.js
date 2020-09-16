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
            // // 横屏
            // background: {
            //     position: cc.v2(0, 0),
            //     width: 1030,
            //     height: 540,
            //     scale: 1.4,
            //     children: {
            //         shanhu: {
            //             position: cc.v2(-268, -22),
            //             width: 317,
            //             height: 98
            //         },
            //         bgEffect: {
            //             position: cc.v2(-380, 0),
            //             children: {
            //                 waterWaveTop: {
            //                     position: cc.v2(444, 286)
            //                 }
            //             }
            //         },
            //         rightPlant: {
            //             position: cc.v2(380, -235),
            //             width: 513,
            //             height: 424,
            //             rotation: -2
            //         },
            //         leftPlant: {
            //             position: cc.v2(-323, -329),
            //             width: 586,
            //             height: 322,
            //             rotation: 9
            //         }
            //     }
            // },
            // progress: {
            //     position: cc.v2(-280, 0),
            //     rotation: 0,
            //     children: {
            //         skillProgress: {
            //             position: cc.v2(0, -191),
            //             rotation: 0,
            //         },
            //         collectProgress: {
            //             progressBarDirection: false,
            //             rotation: 180,
            //             children: {
            //                 shell: {
            //                     position: cc.v2(0, 90),
            //                     rotation: 0
            //                 },
            //                 text: {
            //                     position: cc.v2(0, 143),
            //                     rotation: 180
            //                 }
            //             }
            //         },
            //         icon: {
            //             position: cc.v2(-2, 204),
            //             rotation: 0
            //         }
            //     }
            // },
            // grid: {
            //     position: cc.v2(-150, -240)
            // },
            // effectLayer: {
            //     position: cc.v2(-150, -240),
            //     children: {
            //         thunder: {
            //             position: cc.v2(-132, 57)
            //         }
            //     }
            // },
            // guide: {
            //     children: {
            //         guideMask3: {
            //             position: cc.v2(-280, -191)
            //         },
            //         tip: {
            //             children: {
            //                 tipStart: {
            //                     position: cc.v2(347, 126)
            //                 },
            //                 tipStartEnd: {
            //                     width: 175,
            //                     height: 120,
            //                     position: cc.v2(244, 38)
            //                 },
            //                 tipSkill: {
            //                     position: cc.v2(-195, -175)
            //                 },
            //                 tipNormal1: {
            //                     position: cc.v2(394, -68)
            //                 },
            //                 tipNormal2: {
            //                     position: cc.v2(420, -155)
            //                 }

            //             }
            //         }
            //     }
            // },
            // tipEnd: {
            //     position: cc.v2(-245, -240)
            // }
        }
        this.VerticalConfig = {
            
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
    gameInit() {
        


    }
}