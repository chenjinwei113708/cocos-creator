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
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(239.546, 79.659),
                scale: 0.88,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            UI: {
                children: {
                    congrat: this.isApplovin ? {
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    } : {
                        opacity: 255,
                        angle: 90,
                    },
                    congratBlur: this.isApplovin ? {
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    } : {
                        opacity: 255,
                        angle: 90,
                    },
                    notification: {},
                    paypal: {
                        // position: cc.v2(-283.1, 127.459),
                        // children: {
                        //     laoren: {
                        //         width: 160,
                        //         height: 89,
                        //         position: cc.v2(392.037, 117.86)
                        //     },
                        //     icon: {
                        //         position: cc.v2(-67.054, -7.471)
                        //     },
                        //     btn: {
                        //         position: cc.v2(137.034, -40.34)
                        //     },
                        //     cash: {
                        //         position: cc.v2(135.994, 31.177)
                        //     }
                        // }
                    },
                    banner: {
                        // position: cc.v2(-261.323, -242.363),
                        // children: {
                        //     icon: {
                        //         position: cc.v2(-70.997, 131.491)
                        //     },
                        //     logo: {
                        //         position: cc.v2(76.109, 130.311)
                        //     },
                        //     btn: {
                        //         position: cc.v2(17.395, 25.327)
                        //     }
                        // }
                    },
                    audioBtn: {
                        position: cc.v2(-415.577, 212.604)
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            UI: {
                children: {
                    congrat: this.isApplovin ? {
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    } : {
                        opacity: 255,
                        angle: 0,
                    },
                    congratBlur: this.isApplovin ? {
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    } : {
                        opacity: 255,
                        angle: 0,
                    },
                    notification: {},
                    paypal: {
                        // position: cc.v2(0, 396.319),
                        // children: {
                        //     laoren: {
                        //         width: 319.4,
                        //         height: 177.4,
                        //         position: cc.v2(-0.75, -186.539)
                        //     },
                        //     icon: {
                        //         position: cc.v2(-155.976, -7.471)
                        //     },
                        //     btn: {
                        //         position: cc.v2(137.034, -40.34)
                        //     },
                        //     cash: {
                        //         position: cc.v2(135.994, 31.177)
                        //     }
                        // }
                    },
                    banner: {
                        // position: cc.v2(0, -458.318),
                        // children: {
                        //     icon: {
                        //         position: cc.v2(-197, 27)
                        //     },
                        //     logo: {
                        //         position: cc.v2(-49.894, 28.893)
                        //     },
                        //     btn: {
                        //         position: cc.v2(148.009, 28.4)
                        //     }
                        // }
                    },
                    audioBtn: {
                        position: cc.v2(-43.784, 376.57)
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
        ]

        // 游戏卡牌组里面放了什么牌
        this.cards = {
            [CARD_GROUP.KONG1]: [512, 8, 128, 32, 16],
            [CARD_GROUP.KONG2]: [2, 256, 32, 16, 2],
            [CARD_GROUP.KONG3]: [1024, 128, 64, 2],
            [CARD_GROUP.KONG4]: [2, 256, 32, 16, 2],
            [CARD_GROUP.KONG5]: [512, 8, 128, 32, 16],
        };

        // 发牌库
        this.waitCards = [
            2, 2, 2, 2, 2, 2, 2, 2, 64, 64, 64
        ];

        // 每次出牌要从哪一组开始发
        this.waitGroups = [
            3
        ];

        this.isGameLost = false; // 游戏输了没

        // 用户可以选择的卡牌
        this.userCard = {
            nowCard: 2,
            nextCard: 2
        };

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
     * @param {string} groupName 哪一组
     * @param {number} cardValue 卡片数值
     * @param {boolean} isAuto 是否系统自动，系统自动也就代表这个卡是合成卡
     * @return {number} 返回最终合成的分数;如果没有合成，返回0
     */
    insertCard (groupName, cardValue, isAuto = false) {
        // console.log('-- insertCard 插入卡片 ', groupName, ' ',  cardValue, ' isAuto:', isAuto);
        let group = this.cards[groupName];
        if (!group || !cardValue) return 0;
        let lastCard = isAuto ? group[group.length -2] : group[group.length -1];

        // 检查左右的卡

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
     * @param {string} groupName 哪一组
     * @return {number} 返回2048的上一张卡的值，如果没有的话返回0
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

    /**计算得分
     * @param {number} basis 基数
     * @param {number} num 基数的个数
     * @return {number} 返回自定义计算结果。如果返回0，表示结果有误。
     */
    calcuGrade (basis, num) {
        if (num < 2) return 0;
        for (let i = 0; i < num-1; i++) {
            basis += basis;
        }
        return basis;
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
            // newGroup = 1+parseInt(Math.random()*5);
            newGroup = 3;
        }
        return newGroup;
    }

    /**拿到当前组剩下几个空格子 */
    getLeftDistance (groupName) {
        return LOST_GAME_CARD_NUM - this.cards[groupName].length;
    }
}