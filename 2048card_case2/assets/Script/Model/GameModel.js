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
            game: {
                position: cc.v2(239.06, 3.824),
                scale: 0.757,
                children: {
                    bg1: {
                        width: 1250,
                        height: 2248
                    }
                }
            },
            UI: {
                children: {
                    audioBtn: {
                        position: cc.v2(-407.111, 206.164)
                    },
                    pp: {
                        width: 741,
                        height: 412,
                        position: cc.v2(-369.11, 78.889),
                        children: {
                            btn: {
                                position: cc.v2(198.754, -56.29)
                            },
                            icon: {
                                width: 225,
                                height: 236,
                                position: cc.v2(-8.778, -1.222)
                            },
                            cash: {
                                position: cc.v2(192.375, 44.461)
                            },
                        }
                    },
                    banner: {
                        position: cc.v2(-268.535, -254.925),
                        children: {
                            logo: {
                                position: cc.v2(190.279, 70.484)
                            },
                            icon: {
                                position: cc.v2(-152.868, 72.339)
                            },
                            btn: {
                                position: cc.v2(12.213, 70.484)
                            },
                        }
                    },
                    notification: {
                        position: cc.v2(0, 209.556)
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
                scale: 1,
                children: {
                    bg1: {
                        width: 1250,
                        height: 2248
                    }
                }
            },
            UI: {
                children: {
                    audioBtn: {
                        position: cc.v2(0, 444.386)
                    },
                    pp: {
                        width: 540,
                        height: 300,
                        position: cc.v2(0, 498.981),
                        children: {
                            btn: {
                                position: cc.v2(154.31, -114.957)
                            },
                            icon: {
                                width: 138,
                                height: 145,
                                position: cc.v2(-139.413, -82.095)
                            },
                            cash: {
                                position: cc.v2(149.708, -55.095)
                            },
                        }
                    },
                    banner: {
                        position: cc.v2(0, -496.617),
                        children: {
                            logo: {
                                position: cc.v2(172.501, 70.484)
                            },
                            icon: {
                                position: cc.v2(-170.646, 72.339)
                            },
                            btn: {
                                position: cc.v2(-5.565, 70.484)
                            },
                        }
                    },
                    notification: {
                        position: cc.v2(0, 420.317)
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

        // 游戏卡牌组里面放了什么牌
        this.cards = {
            [CARD_GROUP.KONG1]: [1024, 512, 256, 128, 64],
            [CARD_GROUP.KONG2]: [1024, 512, 256, 128],
            [CARD_GROUP.KONG3]: [1024, 512, 256],
            [CARD_GROUP.KONG4]: [1024, 512],
        };

        // 发牌库
        this.waitCards = [
            256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256
        ];

        this.isGameLost = false; // 游戏输了没

        // 用户可以选择的卡牌
        this.userCard = {
            nowCard: 64,
            nextCard: 128
        };
        

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

    /**使用当前选择的卡，会改变下一张卡 */
    useNowCard () {
    }

    /**生成新卡 */
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

    //初始化游戏模型
    gameInit() {
    }
}