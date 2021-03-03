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
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        guideHand: cc.Node, //
        touchArea: cc.Node,
        screen2: cc.Node, // 第二幕
        flyCards: cc.Node,
        paypal: cc.Node,
        progress: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.progressView = this.progress.getComponent('ProgressView');
        
        this.gameInfo = {
            cellStatus: CELL_STATUS.CAN_MOVE,
            nowTouchPos: null, // 上次点击的触碰点的位置
            checkDistance: 20, // 移动最少的距离
        }

        this.setTouchListener();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
    },

    setTouchListener () {
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            this.gameInfo.nowTouchPos = touchPos;
            this.setCellStatus(CELL_STATUS.IS_MOVE);
            // if (touchPos.x >= this.touch1.position.x - this.touch1.width/2 &&
            //     touchPos.x <= this.touch1.position.x + this.touch1.width/2 &&
            //     touchPos.y >= this.touch1.position.y - this.touch1.height/2 &&
            //     touchPos.y <= this.touch1.position.y + this.touch1.height/2) {
            //         // this.gameInfo.nowTouch = this.touch1;
                    
            // }
        }
        
    },

    onTouchMove (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x - this.gameInfo.nowTouchPos.x > this.gameInfo.checkDistance) {
                this.playShoot();
                this.setCellStatus(CELL_STATUS.DONE_MOVE);
            }
        }
    },
    
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    hideGuideHand () {
        this.guideHand.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.guideHand.active = false;
            })
        ));
    },

    /**播放扔保龄球动画 */
    playShoot () {
        this.hideGuideHand();
        let animState = this.screen2.getComponent(cc.Animation).play();
        this.node.runAction(cc.sequence(
            cc.delayTime(0.6),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('merge', 0.4);
            }),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('merge', 0.4);
            }),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('merge', 0.4);
            }),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('merge', 0.4);
            })
        ));
        animState.on('finished', () => {
            this.gameController.getAudioUtils().playEffect('cheer', 0.4);
            this.showFlyCards(8, () => {
                this.showEnding();
            });
        });
    },

    showEnding () {
        this.gameController.guideView.showEndPage();
    },

    /**
     * 展示几张pp卡从不同地方出现，飞向同一个位置
     * @param {*} num pp卡数量
     * @param {*} callback 动作完毕之后的回调 
     */
    showFlyCards (num = 5, callback) {
        let cards = this.flyCards.children;
        let destPos = this.flyCards.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('icon').position));
        for (let i = 0; i < num; i++) {
            setTimeout(() => {
                let card = cards[i];
                let posy = -285+Math.random()*388;
                let posx = -194+Math.random()*388;
                let ang = -180+Math.random()*360;
                card.position = cc.v2(posx, posy);
                card.angle = ang;
                card.opacity = 0;
                card.scale = 0;
                card.active = true;
                // console.log('fly ', i, ' pos: ', card.position.x, card.position.y, ' destPos', destPos);
                let fadeIntime = 0.2*Math.random()+0.1;
                let moveTotime = 0.4*Math.random()+0.4;
                card.runAction(cc.sequence(
                    cc.spawn(cc.fadeIn(fadeIntime), cc.scaleTo(fadeIntime, 1)),
                    cc.spawn(cc.rotateTo(0.6, 0), cc.moveTo(moveTotime, destPos)),
                    cc.fadeOut(0.15),
                    cc.callFunc(() => {
                        if (i === num-1) {
                            callback&& callback();
                        }
                    })
                ));
                if (i === 5) {
                    this.gameController.addCash(200);
                    this.progressView.setProgress(1);
                    this.gameController.getAudioUtils().playEffect('coin', 0.4);
                    // this.ppcard.scale = 0;
                    // this.ppcard.opacity = 0;
                    // this.ppcard.active = true;
                    // this.ppcard.runAction(cc.sequence(
                    //     cc.spawn(cc.scaleTo(0.3, 1.05), cc.fadeTo(0.3, 230)),
                    //     cc.repeat(cc.sequence(cc.scaleTo(0.2, 0.95), cc.scaleTo(0.2, 1.05)), 2),
                    //     cc.spawn(cc.scaleTo(0.3, 0.5), cc.fadeOut(0.3, 0)),
                    //     cc.callFunc(() => {
                    //         if (this.gameController.cashView.targetCash >= 300) {
                    //             setTimeout(() => {this.show300Card();}, 200);
                    //         }
                    //     })
                    // ));
                }
            }, i*90);
        }
    },

    start () {

    },

    // update (dt) {},
});
