import {
    CARD_GROUP,
    LOST_GAME_CARD_NUM,
    CARD_VALUE
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


        // 游戏卡牌组里面放了什么牌
        this.cards = {
            [CARD_GROUP.KONG1]: [32, 16, 8, 4, 2],
            [CARD_GROUP.KONG2]: [32, 16, 8, 4],
            [CARD_GROUP.KONG3]: [256, 128, 64],
            [CARD_GROUP.KONG4]: [128, 64],
            [CARD_GROUP.KONG5]: [64],
        };

        // 发牌库
        this.waitCards = [
            64, 64, 32, 16, 8, 64, 64, 64, 64, 64, 64
        ];

        // 每次出牌要从哪一组开始发
        this.waitGroups = [
            5, 4, 3
        ];

        this.isGameLost = false; // 游戏输了没

        // 用户可以选择的卡牌
        this.userCard = {
            nowCard: 2,
            nextCard: 4
        };

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

    /**插入一张卡片到卡牌组，或者卡片组合成了一张新卡片
     * @ param {string} groupName 哪一组
     * @ param {number} cardValue 卡片数值
     * @ param {boolean} isAuto 是否系统自动，系统自动也就代表这个卡是合成卡
     * @ return {number} 返回最终合成的分数;如果没有合成，返回0
     */
    insertCard (groupName, cardValue, isAuto = false) {
        // console.log('-- insertCard 插入卡片 ', groupName, ' ',  cardValue, ' isAuto:', isAuto);
        let group = this.cards[groupName];
        if (!group || !cardValue) return 0;
        let lastCard = isAuto ? group[group.length -2] : group[group.length -1];

        if (cardValue === lastCard) { // 可以合成新卡
            let newCard = cardValue*2
            if (isAuto) {
                let del = group.length -1;
                group.splice(del, 1);
                group[del - 1] = newCard;
            } else {
                group[group.length -1] = newCard;
            }
            // console.log('-- insertCard 插入卡片之后model：', group);
            return newCard;
        } else { // 不能合成新卡
            if (!isAuto) group.push(cardValue);
            if (group.length >= LOST_GAME_CARD_NUM) { this.isGameLost = true; }
            // console.log('-- insertCard 插入卡片之后model：', group);
            return 0;
        }
    }

    /**删除2048
     * @ param {string} groupName 哪一组
     * @ return {number} 返回2048的上一张卡的值，如果没有的话返回0
     */
    delete2048 (groupName) {
        this.cards[groupName].splice(this.cards[groupName].length -1, 1);
        let re = 0;
        if (this.cards[groupName].length > 0) {
            re = this.cards[groupName][this.cards[groupName].length -1];
        }
        // console.log(' +++ delete2048, cards: ', this.cards[groupName], ' re:', re);
        return re;
    }

    /**获得卡牌组的长度 */
    getGroupLength (groupName) {
        return this.cards[groupName].length;
    }

    /**检查游戏是否输了 */
    checkIsGameLost () {
        return this.isGameLost;
    }

    /**拿到当前选择区的卡，不会改变下一张卡 */
    getNowCard () {
        return this.userCard.nowCard;
    }

    /**生成新卡,会改变下一张卡 */
    generateNewCard () {
        let newCard = null;
        if (this.waitCards.length > 0) {
            newCard = this.waitCards.splice(0, 1)[0];
        } else {
            newCard = CARD_VALUE[7];
        }
        this.userCard.nowCard = this.userCard.nextCard;
        this.userCard.nextCard = newCard;
        return newCard;
    }

    /**拿到下一次从第几组出牌 */
    getNextGroup () {
        let newGroup = null;
        if (this.waitGroups.length > 0) {
            newGroup = this.waitGroups.splice(0, 1)[0];
        } else {
            newGroup = 1+parseInt(Math.random()*5);
        }
        return newGroup;
    }

    /**拿到当前组剩下几个空格子 */
    getLeftDistance (groupName) {
        return LOST_GAME_CARD_NUM - this.cards[groupName].length;
    }

    //初始化游戏模型
    gameInit() {
        


    }
}