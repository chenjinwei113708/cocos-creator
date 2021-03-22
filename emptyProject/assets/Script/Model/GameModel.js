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
            // game: {
            // },
            // UI: {
            //     scale: 0.89,
            //     position: cc.v2(0, 0),
            //     children: {
            //         paypal: {
            //         },
            //         banner: {
            //             children: {
            //                 adsonly: {
            //                     active: this.isApplovin
            //                 },
            //                 mtg: {
            //                     active: this.isMintegral
            //                 }
            //             }
            //         },
            //         turn: {
            //         },
            //         pps: {
            //         },
            //         awardPageBox: {
            //         }
            //     }
            // }
        }
        this.VerticalConfig = {
            // game: {
            // },
            // UI: {
            //     children: {
            //         paypal: {
            //         },
            //         turn: {
            //         },
            //         pps: {
            //         },
            //         banner: {
            //             children: {
            //                 adsonly: {
            //                     active: this.isApplovin
            //                 },
            //                 mtg: {
            //                     active: this.isMintegral
            //                 }
            //             }
            //         },
            //         awardPageBox: {
            //         }
            //     }
            // }
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