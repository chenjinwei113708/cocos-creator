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
    KNIFE_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        knife: cc.Node, // 小刀
        ban1: [cc.Node], // 切开的苹果瓣1
        ban2: [cc.Node], // 切开的苹果瓣2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setClickListener();
        this.gameInfo = {
            knifePos: cc.v2(this.knife.position.x, this.knife.position.y),
            knifeStatus: KNIFE_STATUS.CAN_MOVE,
            cutAppleNum: 0,
        };
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClickKnife, this);
    },
    offClickListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onClickKnife, this);
    },

    /**点击小刀 */
    onClickKnife (touch) {
        if (this.gameInfo.knifeStatus === KNIFE_STATUS.CAN_MOVE) {
            this.setKnifeStatus(KNIFE_STATUS.IS_MOVE);
            let spinAngle = Math.random() * 400 + 900;
            this.knife.getComponent(cc.Animation).stop('knife');
            this.knife.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.35, 0, 649), cc.rotateTo(0.35, spinAngle)),
                cc.callFunc(() => {
                    this.knife.angle = 0;
                    this.knife.position = this.gameInfo.knifePos;
                    this.knife.getComponent(cc.Animation).play('knife');
                    this.setKnifeStatus(KNIFE_STATUS.CAN_MOVE);
                }),
            ));
        }
    },

    setKnifeStatus (status) {
        this.gameInfo.knifeStatus = status;
    },

    start () {

    },

    /**展示切苹果的动画 */
    showCutApple (appleWorldPos) {
        this.gameInfo.cutAppleNum++;
        const juicePos = cc.v2(-197, -210);
        const moveTime = 0.2;

        let ban1 = this.ban1[(this.gameInfo.cutAppleNum-1)%this.ban1.length];
        ban1.position = cc.v2(appleWorldPos.x-10, appleWorldPos.y);
        ban1.angle = 0;
        ban1.active = true;

        let ban2 = this.ban2[(this.gameInfo.cutAppleNum-1)%this.ban2.length];
        ban2.position = cc.v2(appleWorldPos.x+10, appleWorldPos.y);
        ban2.angle = 0;
        ban2.active = true;

        ban1.runAction(cc.sequence(
            cc.spawn(cc.moveBy(moveTime*1.5, -80, -40), cc.rotateTo(moveTime, -30)),
            cc.moveTo(moveTime, juicePos),
            cc.callFunc(() => {
                ban1.active = false;
            })
        ));
        ban2.runAction(cc.sequence(
            cc.spawn(cc.moveBy(moveTime*1.5, 60, -50), cc.rotateTo(moveTime, 30)),
            cc.moveTo(moveTime, juicePos),
            cc.callFunc(() => {
                ban2.active = false;
            })
        ));
    }

    // update (dt) {},
});
