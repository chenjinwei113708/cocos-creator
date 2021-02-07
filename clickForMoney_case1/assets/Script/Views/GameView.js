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
        };

        this.setListener();
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setGameStatus (status) {
        this.info.status = status;
    },

    setListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart (event) {
        if (this.info.status === GAME_STATUS.CAN_CLICK) {
            let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.info.clickTimes++;
            this.flyCashView.shootMoney(touchPos); // 发射现金特效
            this.moneyView.showAddMoney(3.33); // 展示现金数字增加
            this.treeView.shakeTree(); // 摇树
            if (this.info.clickTimes === 3) {
                // 第一次展示pp卡
                this.setGameStatus(GAME_STATUS.DONE_CLICK);
                setTimeout(() => {
                    this.info.getMoney = 9.99;
                    this.showPPcard(this.info.getMoney);
                }, 200);
            }
        }
    },

    /**
     * 展示pp卡
     * @param {number} num 金额
     */
    showPPcard (num) {
        this.ppcard.getChildByName('money').getComponent(cc.Label).string = `+$${num}`;

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

        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.moveTo(0.4, destPos), cc.scaleTo(0.4, 0.2)),
            cc.fadeOut(0.1),
            cc.callFunc(() => {})
        ));

        this.mask.runAction(cc.sequence(
            cc.fadeOut(0.4),
            cc.callFunc(() => {
                this.mask.active = false;
            })
        ));
    },

    // update (dt) {},
});
