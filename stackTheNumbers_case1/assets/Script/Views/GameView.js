
import {
    CARD_STATUS,
    CARD_VALUE,
    CARD_GROUP,
    LOST_GAME_CARD_NUM
} from "./ConstValue";

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
        };
        this.sendCard();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    /**发牌 */
    sendCard () {
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
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
            newCard.runAction(cc.sequence(
                cc.moveTo(groupLeftBox*this.gameInfo.speed, cc.v2(0, (LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    if (this.gameInfo.isAutoFall) {
                        this.gameInfo.isAutoFall = false;
                        this.setCardStatue(CARD_STATUS.DONE_MOVE);
                        console.log('auto fall done, ', newCard);
                        this.addCardToGroup(groupName, newCard, false, this.completeCard.bind(this));
                    }
                }),
            ));
        }
    },

    /**点击切换分组 */
    click2ChangeGroup (touchEvent, groupName) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE && this.gameInfo.isAutoFall) {
            console.log('click2ChangeGroup:: ,', groupName);
            this.gameInfo.isAutoFall = false;
            if (!this.gameInfo.fallingCard) return;
            let card = this.gameInfo.fallingCard;
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            let dropSpeed = 0.15;
            card.stopAllActions();
            if (card.parent._name !== groupName) {
                card.parent = this[groupName];
                card.position = cc.v2(0, this.gameInfo.startPosY);
                dropSpeed = groupLeftBox*this.gameInfo.speedFast;
            }
            card.runAction(cc.sequence(
                cc.moveTo(dropSpeed, cc.v2(0, (LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    this.setCardStatue(CARD_STATUS.DONE_MOVE);
                    console.log('click fall done, ', card);
                    this.addCardToGroup(groupName, card, false, this.completeCard.bind(this));
                }),
            ));
        }
    },

    /**当前卡片摆放完成 */
    completeCard () {
        this.gameInfo.fallingCard = null;
        this.setCardStatue(CARD_STATUS.CAN_MOVE);
        this.sendCard();
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
            
            lastCard.runAction(cc.sequence(
                cc.repeat(cc.sequence(cc.rotateTo(0.09, 11), cc.rotateTo(0.09, -11)), 3),
                cc.spawn(cc.rotateTo(0.06, 0), cc.moveTo(0.12, destPos)),
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

    lostGame () {
        console.log('game lost');
        this.gameInfo.fallingCard = null;
        this.setCardStatue(CARD_STATUS.LOST_GAME);
    },

    /**设置卡片状态 */
    setCardStatue (status) {
        this.gameInfo.cardStatus = status;
    },

    start () {

    },

    // update (dt) {},
});
