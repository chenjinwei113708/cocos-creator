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
        diamonds: [cc.Node], // 钻石
        bombs: [cc.Node], // 切水果爆开特效
        glass: cc.Node, // 装果汁的榨汁机
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setClickListener();
        this.gameInfo = {
            knifePos: cc.v2(this.knife.position.x, this.knife.position.y),
            knifeStatus: KNIFE_STATUS.CAN_MOVE,
            cutAppleNum: 0, // 切了几个苹果
            throwTimes: 0, // 第几次丢飞镖
            winAtThrowTimes: 0, // 上一次丢中是第几次丢飞镖
            cutTimes: 0, // 第几次丢中飞镖
            winTimes: 5, // 需要丢中几次才能赢游戏
            progressSpeed: 0.02, // 榨汁机速度
            nowProgress: 0, // 现在榨汁机进度
            targetProgress: 0, // 榨汁机目标进度
            isGameWin: false, // 游戏胜利了没
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
            this.gameInfo.throwTimes++; // 增加一次丢飞镖次数
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
        if (this.gameInfo.winAtThrowTimes !== this.gameInfo.throwTimes) {
            this.gameInfo.winAtThrowTimes = this.gameInfo.throwTimes;
            this.gameInfo.cutTimes++;
        }
        const juicePos = cc.v2(-197, -210);
        const moveTime = 0.2;

        let diamond = this.diamonds[(this.gameInfo.cutAppleNum-1)%this.diamonds.length];
        diamond.position = cc.v2(appleWorldPos.x, appleWorldPos.y-50);
        diamond.active = true;
        diamond.opacity = 255;
        diamond.runAction(cc.sequence(
            cc.moveBy(moveTime*2, 0, -90),
            cc.spawn(cc.moveBy(moveTime*3.2, 0, 600), cc.fadeTo(moveTime*2.5, 150)),
            cc.callFunc(() => {
                diamond.active = false;
            })
        ));

        let bomb = this.bombs[(this.gameInfo.cutAppleNum-1)%this.bombs.length];
        bomb.position = cc.v2(appleWorldPos.x, appleWorldPos.y);
        bomb.active = true;
        bomb.getComponent(cc.Animation).play();

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
                this.addJuice(this.gameInfo.cutTimes);
            })
        ));
    },

    /**增加果汁
     * @ param {number} cutTimes 丢中第几次飞镖，从1开始
     */
    addJuice (cutTimes) {
        this.gameInfo.targetProgress = cutTimes/this.gameInfo.winTimes;
        this.enabled = true; // 允许执行update
        if (this.gameInfo.cutAppleNum >= 9) {
            // 如果砍完了9个苹果，也算游戏胜利
            this.winGame();
        }
    },

    /**赢得游戏 */
    winGame () {
        if (!this.gameInfo.isGameWin) {
            console.log('win game, you cut ', this.gameInfo.cutAppleNum, ' apples');
            this.gameInfo.isGameWin = true;
            this.offClickListener();
        }
    },

    update (dt) {
        if (this.gameInfo.nowProgress < this.gameInfo.targetProgress) {
            this.gameInfo.nowProgress = this.gameInfo.nowProgress + this.gameInfo.progressSpeed;
            this.gameInfo.nowProgress = this.gameInfo.nowProgress > this.gameInfo.targetProgress ?
                this.gameInfo.targetProgress : this.gameInfo.nowProgress;
            this.glass.getComponent(cc.ProgressBar).progress = this.gameInfo.nowProgress;
            if (this.gameInfo.nowProgress >= 1) {
                this.winGame();
                this.enabled = false;
            }
        } else {
            this.enabled = false; // 停止执行update
        }
    },
});
