// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import {
    GAME_STATUS
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        ppcard: cc.Node,
        bigcard: cc.Node, // 结束卡
        mask: cc.Node,
        cardHand: cc.Node,
        gameHand: cc.Node,
        paypal: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.flyCashView = cc.find('Canvas/center/game/flycash').getComponent('FlyCashView');
        this.moneyView = cc.find('Canvas/center/game/money').getComponent('MoneyView');
        this.treeView = cc.find('Canvas/center/game/tree').getComponent('TreeView');

        this.info = {
            clickTimes: 0, // 点击树的次数
            status: GAME_STATUS.CAN_CLICK, // 游戏状态
            getMoney: 0, // 拿到的钱
            addMoney: 3.33, // 每次点击增加的钱
        };

        this.setListener();
        this.setGameStatus(GAME_STATUS.CAN_CLICK);
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setGameStatus (status) {
        this.info.status = status;
        if (status === GAME_STATUS.CAN_CLICK) {
            this.showClickHand();
        }
    },

    setListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart (event) {
        if (this.info.status === GAME_STATUS.CAN_CLICK) {
            let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.info.clickTimes++;
            this.gameController.getAudioUtils().playEffect('bubble', 0.9);
            this.gameHand.stopMyAnimation && this.gameHand.stopMyAnimation(); // 停止游戏指引手的点击动画
            this.flyCashView.shootMoney(touchPos); // 发射现金特效
            this.moneyView.showAddMoney(this.info.addMoney); // 展示现金数字增加
            this.treeView.shakeTree(); // 摇树
            if (this.info.clickTimes === 3) {
                // 第一次展示pp卡
                this.setGameStatus(GAME_STATUS.DONE_CLICK);
                this.treeView.changeToNextTree(); // 变成下一棵树
                setTimeout(() => {
                    this.info.getMoney = 9.99; // 这次pp卡展示的钱
                    this.showPPcard(this.info.getMoney);
                    this.info.addMoney = '10.00'; // 下次点击树增加的钱
                }, 1000);
            } else if (this.info.clickTimes === 6) {
                // 第二次展示pp卡
                this.setGameStatus(GAME_STATUS.DONE_CLICK);
                this.treeView.changeToNextTree(); // 变成下一棵树
                setTimeout(() => {
                    this.info.getMoney = 30;
                    this.showPPcard(this.info.getMoney);
                    this.info.addMoney = '25.00';
                }, 1000);
            } else if (this.info.clickTimes === 10) {
                // 第三次展示pp卡
                this.setGameStatus(GAME_STATUS.DONE_CLICK);
                this.treeView.showLight(); // 展示光特效
                // this.treeView.changeToNextTree(); // 变成下一棵树
                setTimeout(() => {
                    this.info.getMoney = 100;
                    this.showPPcard(this.info.getMoney);
                }, 1000);
            }
        }
    },

    /**
     * 展示pp卡
     * @param {number} num 金额
     */
    showPPcard (num) {
        this.ppcard.getChildByName('money').getComponent(cc.Label).string = `+$${num}`;

        this.gameController.getAudioUtils().playEffect('moneyCard', 0.8);

        this.ppcard.scale = 0;
        this.ppcard.opacity = 255;
        this.ppcard.active = true;
        this.ppcard.position = cc.v2(0, 0);

        this.ppcard.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.callFunc(() => {
                this.gameController.guideView.myFadeIn(this.cardHand, () => {
                    this.gameController.guideView.myClickHere(this.cardHand);
                });
            })
        ));

        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.3, 150));
    },

    receivePPcard () {
        let destPos = this.node.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('icon').position)
        );
        this.gameController.addCash(this.info.getMoney);
        this.gameController.getAudioUtils().playEffect('coin', 0.7);

        this.cardHand.stopMyAnimation && this.cardHand.stopMyAnimation(); // 停止pp卡指引手的点击动画

        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.moveTo(0.4, destPos), cc.scaleTo(0.4, 0.2)),
            cc.fadeOut(0.1),
            cc.callFunc(() => {
                if (this.info.clickTimes < 10) {
                    this.setGameStatus(GAME_STATUS.CAN_CLICK);
                } else if (this.info.clickTimes === 10) {
                    this.showEndCard();
                }
            })
        ));

        this.mask.runAction(cc.sequence(
            cc.fadeOut(0.4),
            cc.callFunc(() => {
                this.mask.active = false;
            })
        ));
    },

    // 游戏结束，展示结束页
    showEndCard () {
        this.gameController.endGame();

        // this.bigcard.getChildByName('money').getComponent(cc.Label).string = `+$${num}`;

        this.gameController.getAudioUtils().playEffect('cheer', 0.6);
        let endHand = this.bigcard.getChildByName('cardHand');
        this.bigcard.scale = 0;
        this.bigcard.opacity = 255;
        this.bigcard.active = true;
        this.bigcard.position = cc.v2(0, 0);

        this.bigcard.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.callFunc(() => {
                this.gameController.guideView.myFadeIn(endHand, () => {
                    this.gameController.guideView.myClickHere(endHand);
                });
            })
        ));

        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.3, 150));
    },

    // 展示游戏提示点击的手
    showClickHand () {
        this.gameController.guideView.myFadeIn(this.gameHand, () => {
            this.gameController.guideView.myClickHere(this.gameHand);
        });
    },

    // update (dt) {},
});
