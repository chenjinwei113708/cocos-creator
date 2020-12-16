
import {
    CARD_STATUS,
    CARD_VALUE,
    CARD_GROUP,
    LOST_GAME_CARD_NUM
} from "../Model/ConstValue.js";

cc.Class({
    extends: cc.Component,

    properties: {
        card1: cc.Node, // 卡牌库的下一张卡
        kong1: cc.Node, // 第一组卡牌
        kong2: cc.Node, // 第二组卡牌
        kong3: cc.Node, // 第三组卡牌
        kong4: cc.Node, // 第四组卡牌
        kong5: cc.Node, // 第五组卡牌
        // kongBox: cc.Node, // 提示框
        // excellent: cc.Node, // 优秀
        // hint: cc.Node, // 提示
        // swipe: cc.Node, // 提示
        // golds: cc.Node, // 金币
        cardPrefab: cc.Prefab, // 卡牌预制资源
        cardSprites: [cc.SpriteFrame], // 卡牌图片
        mask1: cc.Node, // 指引遮罩
        mask2: cc.Node, // 指引遮罩
        hand: cc.Node, // 指引手
        coinPre: cc.Prefab, // 金币
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            cardStatus: CARD_STATUS.CAN_MOVE, // 可选择卡片的状态
            speed: 2, // 下落一格所需时间 s
            speedFast: 0.1, // 下落一格所需时间 快速 s
            cardDistance: 83, // 卡片的距离
            isGameStarted: false, // 用户有没有开始游戏
            isFirstCard: true, // 是不是第一张卡
            isSecondCard: false, // 是不是第二张卡
            cardWidth: 78,
            cardHeight: 78,
            startPosY: 513, // 发牌的时候 y所在位置
            isAutoFall: false, // 是不是自由落下
            fallingCard: null, // 正在下落的牌
            sendCardTimes: 0,
            threeCards: [], // 同时下落的三张卡
        };

        this.coinParent = cc.find('Canvas/center/game/coins');
        this.coins  = new cc.NodePool();
        for (let i = 0; i < 5; i++) {
            let coin = cc.instantiate(this.coinPre);
            this.coins.put(coin);
        }
        
        this.send3Cards();
        setTimeout(() => {
            this.sendCard();
        }, 100);
        
    },

    getCoin () {
        let coin = null;
        if (this.coins.size() > 0) {
            coin = this.coins.get();
        } else {
            coin = cc.instantiate(this.coinPre);
        }
        coin.parent = this.coinParent;
        return coin;
    },
    killCoin (coin) {
        this.coins.put(coin);
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    /**同时落下3张卡片 */
    send3Cards () {
        let groupNames = [CARD_GROUP.KONG2, CARD_GROUP.KONG3, CARD_GROUP.KONG4];
        let cardValues = [128, 256, 512];
        for (let i = 0; i < 3; i++) {
            // 发卡，让卡片自动落下
            let newCard = cc.instantiate(this.cardPrefab);
            let groupName = groupNames[i];
            let nowCardValue = cardValues[i];
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            this.gameInfo.threeCards.push(newCard); // 放进数组存起来
            newCard.parent = this[groupName];
            newCard._name = nowCardValue;
            newCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(nowCardValue)];
            newCard.position = cc.v2(0, this.gameInfo.startPosY);
            newCard.active = true;
            this.gameInfo.isAutoFall = true;
            let fallAction = cc.sequence(
                cc.moveTo(0.9, cc.v2(0, 460)),
                cc.moveTo(0.9, cc.v2(0, 435)),
                cc.callFunc(() => {
                    if (this.gameInfo.isAutoFall) {
                        // this.gameInfo.isAutoFall = false;
                        // this.setCardStatue(CARD_STATUS.DONE_MOVE);
                        // // console.log('auto fall done, ', newCard);
                        // this.addCardToGroup(groupName, newCard, false, this.completeCard.bind(this));
                    }
                }),
            );
            newCard.runAction(fallAction);
        }
    },

    /**发牌 */
    sendCard () {
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            this.gameInfo.sendCardTimes++;
            this.setCardStatue(CARD_STATUS.IS_MOVE);
            let nowCardValue = this.gameController.gameModel.getNowCard();
            let sendGroup = this.gameController.gameModel.getNextGroup();
            let groupName = CARD_GROUP[`KONG${sendGroup}`];
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            // 修改下一准备发的张卡
            this.gameController.gameModel.generateNewCard();
            let nextCardValue = this.gameController.gameModel.getNowCard();
            this.card1.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(nextCardValue)];
            // 发卡，让卡片自动落下
            let newCard = cc.instantiate(this.cardPrefab);
            this.gameInfo.fallingCard = newCard;
            newCard.parent = this[groupName];
            newCard._name = nowCardValue;
            newCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(nowCardValue)];
            newCard.position = cc.v2(0, this.gameInfo.startPosY);
            newCard.active = true;
            this.gameInfo.isAutoFall = true;
            let fallAction = cc.sequence(
                cc.moveTo(groupLeftBox*this.gameInfo.speed, cc.v2(0, (LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    if (this.gameInfo.isAutoFall) {
                        this.gameInfo.isAutoFall = false;
                        this.setCardStatue(CARD_STATUS.DONE_MOVE);
                        // console.log('auto fall done, ', newCard);
                        this.addCardToGroup(groupName, newCard, false, this.completeCard.bind(this));
                    }
                }),
            );
            newCard.runAction(fallAction);
            if (this.gameInfo.isFirstCard) {
                setTimeout(() => {
                    if (this.gameInfo.isFirstCard) {
                        newCard.stopAction(fallAction);
                        this.setGuideMask(1);
                    }
                }, 600);
            } else if (this.gameInfo.isSecondCard) {
                setTimeout(() => {
                    if (this.gameInfo.isSecondCard) {
                        newCard.stopAction(fallAction);
                        this.setGuideMask(2);
                    }
                }, 1000);
            }
            
        }
    },

    /**点击切换分组
     * @param {} touchEvent
     * @param {string} groupName
     * @param {cc.Node} downCard 下落的卡
     */
    click2ChangeGroup (touchEvent, groupName, downCard) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE && this.gameInfo.isAutoFall) {
            // console.log('click2ChangeGroup:: ,', groupName);
            if (this.gameInfo.isFirstCard) {
                if (groupName !== CARD_GROUP.KONG1) return;
                this.gameInfo.isFirstCard = false;
                // this.gameInfo.isSecondCard = true;
                for (let i = 0; i < this.gameInfo.threeCards.length; i++) {
                    let nowCards = this.gameInfo.threeCards;
                    this.click2ChangeGroup(undefined, nowCards[i].parent._name, nowCards[i]);
                }
                this.hideGuide();
            } else if (this.gameInfo.isSecondCard) {
                if (groupName !== CARD_GROUP.KONG2) return;
                this.gameInfo.isSecondCard = false;
                this.hideGuide();
            }
            
            // this.gameInfo.isAutoFall = false;
            if (!this.gameInfo.fallingCard) return;
            let card = downCard || this.gameInfo.fallingCard;
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            let dropSpeed = 0.15;
            card.stopAllActions();
            if (card.parent._name !== groupName) {
                card.parent = this[groupName];
                card.position = cc.v2(0, this.gameInfo.threeCards[0].position.y);
                dropSpeed = groupLeftBox*this.gameInfo.speedFast;
            }
            card.runAction(cc.sequence(
                cc.moveTo(dropSpeed, cc.v2(0, (LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    this.setCardStatue(CARD_STATUS.DONE_MOVE);
                    // console.log('click fall done, ', card);
                    this.addCardToGroup(groupName, card, false, groupName === CARD_GROUP.KONG1 ? this.completeCard.bind(this) : undefined);
                }),
            ));
        }
    },

    /**当前卡片摆放完成 */
    completeCard () {
        console.log('completeCard sendCardTimes', this.gameInfo.sendCardTimes);
        setTimeout(() => {
            this.becomeBigCard();
        }, 100);
        
        // this.gameInfo.fallingCard = null;
        // this.setCardStatue(CARD_STATUS.CAN_MOVE);
        // this.gameController.addCash(410);
        // this.gameController.guideView.showPaypalCardFly(() => {
        //     if (this.gameInfo.sendCardTimes < 3) {
        //         // this.sendCard();
        //     } else {
        //         this.gameController.getAudioUtils().playEffect('cheer', 0.55);
        //         this.gameController.guideView.showCashOutHand();
        //     }
        // });
    },

    /**把牌最终加到某一组里面去 */
    addCardToGroup (groupName, cardNode, isAuto, callback) {
        if (this.gameInfo.cardStatus !== CARD_STATUS.DONE_MOVE) return;
        let combine = this.gameController.gameModel.insertCard(groupName, Number(cardNode._name), isAuto);
        if (combine > 0) { // 合成了新牌
            let lastCard = this[groupName].children[this[groupName].children.length-2]; // 数组的倒数第二张牌
            let destPos = cc.v2(lastCard.position.x, lastCard.position.y);
            lastCard._name = combine;
            lastCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(combine)];
            lastCard.position = cc.v2(cardNode.position.x, cardNode.position.y);
            
            cardNode.active = false;
            cardNode.parent = this.node;
            cardNode.destroy();
            
            this.gameController.getAudioUtils().playEffect('combine', 0.4);
            let coin = this.getCoin();
            let coinPos = this.node.convertToNodeSpaceAR(this[groupName].convertToWorldSpaceAR(lastCard.position));
            coin.getComponent('CoinView').showDollar(coinPos, () => {
                this.killCoin(coin);
            });
            lastCard.runAction(cc.sequence(
                cc.scaleTo(0.1, 0.95),
                // cc.repeat(cc.sequence(cc.rotateTo(0.09, 11), cc.rotateTo(0.09, -11)), 3),
                cc.spawn(cc.scaleTo(0.12, 1), cc.moveTo(0.12, destPos)),
                cc.callFunc(() => {
                    this.addCardToGroup(groupName, lastCard, true, callback);
                })
            ));
        } else { // 没合成新牌
            let groupLength = this.gameController.gameModel.getGroupLength(groupName);
            if (groupLength >= LOST_GAME_CARD_NUM) {
                this.lostGame();
            } else {
                callback && callback();
            }
        }
    },

    /**设置提示
     * @ param {number} 第几关，从1开始
     */
    setGuideMask (level) {
        if (level === 1 && this.gameInfo.isFirstCard) {
            // 如果是第一张卡
            this.mask1.opacity = 0;
            this.mask1.active = true;
            this.mask1.runAction(cc.fadeIn(0.6));
            this.hand.opacity = 0;
            this.hand.active = true;
            this.hand.position = cc.v2(-162.885, 62);
            this.hand.runAction(cc.fadeIn(0.3));
            this.hand.getComponent(cc.Animation).play();
        } else if (level === 2 && this.gameInfo.isSecondCard) {
            // 如果是第二张卡
            this.mask2.opacity = 0;
            this.mask2.active = true;
            this.mask2.runAction(cc.fadeIn(0.6));
            this.hand.opacity = 0;
            this.hand.active = true;
            this.hand.position = cc.v2(-99.1, 92.54);
            this.hand.runAction(cc.fadeIn(0.3));
            this.hand.getComponent(cc.Animation).play();
        }
    },

    /**隐藏提示 */
    hideGuide () {
        if (this.hand.active) {
            this.mask1.active = false;
            this.mask2.active = false;
            this.hand.getComponent(cc.Animation).stop();
            this.hand.active = false;
        }
    },

    lostGame () {
        console.log('game lost');
        this.gameInfo.fallingCard = null;
        this.setCardStatue(CARD_STATUS.LOST_GAME);
    },

    /**设置卡片状态 */
    setCardStatue (status) {
        this.gameInfo.cardStatus = status;
    },

    /**合成大的2048卡 */
    becomeBigCard () {
        let flycard = cc.find('Canvas/center/UI/flycard');
        let paypal = cc.find('Canvas/center/UI/paypal');
        let paypalIcon = cc.find('Canvas/center/UI/paypal/icon');
        let ppPos = flycard.convertToNodeSpaceAR(paypal.convertToWorldSpaceAR(paypalIcon.position));
        for (let i = 1; i <= 5; i++) {
            let card = this[`kong${i}`].children[0];
            let centerPos = this[`kong${i}`].convertToNodeSpaceAR(flycard.convertToWorldSpaceAR(cc.v2(0,0)));
            card.runAction(cc.sequence(
                cc.moveTo(0.4, centerPos),
                cc.scaleTo(0.2, 0),
                cc.callFunc(() => {
                    card.opacity = 0;
                    if (i !== 5) return;
                    flycard.opacity = 0;
                    flycard.scale = 0.2;
                    flycard.active = true;
                    flycard.runAction(cc.sequence(
                        cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.3, 1.1)),
                        cc.scaleTo(0.3, 1),
                        cc.delayTime(0.5),
                        cc.spawn(cc.moveTo(0.7, ppPos), cc.scaleTo(0.7, 0.85)),
                        cc.spawn(cc.fadeOut(0.25), cc.scaleTo(0.2, 0.1)),
                        cc.callFunc(() => {
                            this.gameController.addCash(2048);
                            this.gameController.getAudioUtils().playEffect('cheer', 0.55);
                            this.gameController.guideView.showCashOutHand();
                        })
                    ));
                })
            ));
        }
    },

    start () {

    },

    // update (dt) {},
});
