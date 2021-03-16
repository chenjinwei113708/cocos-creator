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
        cashes: cc.Node, //
        text: cc.Node, //
        hand: cc.Node, // 指引手
        ppcard: cc.Node,
        mask: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.info = {
            isGameStarted: false, //
            status: GAME_STATUS.CAN_CLICK,
            directionDelay: 70,
            directionDistance: 10,
            startTouchTime: 0,
            startTouchPos: null,
            outNumber: 0, // 抽出了几张钱，
            isGameFinished: false,
            isHandShow: true,
            showHandTimeout: null,
        };

        this.setTouchListener();
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setGameStatus (status) {
        this.info.status = status;
    },

    setTouchListener () {
        this.cashes.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.cashes.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.cashes.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.cashes.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    offTouchListener () {
        this.cashes.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.cashes.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.cashes.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.cashes.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.info.status === GAME_STATUS.CAN_CLICK) {
            // this.gameController.getAudioUtils().playEffect('click', 0.5);
            let touchPos = touch.touch._point;
            // console.log('onTouchStart touchPos,', touchPos);
            this.info.startTouchPos = cc.v2(touchPos.x, touchPos.y);
            this.info.startTouchTime = Date.now();
            this.setGameStatus(GAME_STATUS.IS_PLAYING);
        }
    },

    onTouchMove (touch) {
        if (this.info.status === GAME_STATUS.IS_PLAYING &&
            Date.now() - this.info.startTouchTime >= this.info.directionDelay) {
            let touchPos = touch.touch._point;
            // console.log('onTouchMove time,', touchPos, touchPos.y - this.info.startTouchPos.y);
            if (touchPos.y - this.info.startTouchPos.y >= this.info.directionDistance) {
                // 播放动画
                // console.log('播放');
                this.showMoneyOut();
                this.hideGuide();
                if (!this.info.isGameStarted) {
                    this.info.isGameStarted = true;
                }
                this.setGameStatus(GAME_STATUS.DONE_PLAYING);
            } else {
                // console.log('没中');
                this.info.startTouchTime = Date.now();
            }
        }
    },

    onTouchEnd (touch) {
        if (this.info.status === GAME_STATUS.IS_PLAYING || this.info.status === GAME_STATUS.DONE_PLAYING) {
            this.setGameStatus(GAME_STATUS.CAN_CLICK);
        }
    },

    showGuideHand () {
        // if (this.info.status === GAME_STATUS.IS_PLAYING) return;
        if (this.info.isGameFinished) return;

        this.info.isHandShow = true;

        this.text.active = true;
        this.text.opacity = 0;
        this.text.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                this.text.getComponent(cc.Animation).play();
            })
        ));

        this.hand.active = true;
        this.hand.opacity = 0;
        this.hand.getComponent(cc.Animation).play();
        // this.hand.runAction(cc.sequence(
        //     cc.fadeIn(0.3),
        //     cc.callFunc(() => {
                
        //     })
        // ));
        
    },

    hideGuide () {
        if (!this.info.isHandShow) return;
        this.info.isHandShow = false;
        this.text.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.text.active = false;
            })
        ));
        this.hand.getComponent(cc.Animation).stop();
        this.hand.active = false;
        // this.hand.runAction(cc.sequence(
        //     cc.fadeOut(0.3),
        //     cc.callFunc(() => {
        //         this.hand.getComponent(cc.Animation).stop();
        //         this.hand.active = false;
        //     })
        // ));
    },

    // 展示钱被抽出去
    showMoneyOut () {
        if (this.info.isGameFinished) return
        this.gameController.getAudioUtils().playEffect('countCash', 0.7);
        const cashNum = this.cashes.children.length;
        let cash = this.cashes.children[this.info.outNumber%cashNum];
        this.info.outNumber++;
        let endCallback = null;
        if (this.info.outNumber >= 10) {
            this.info.isGameFinished = true;
            this.offTouchListener();
            endCallback = () => {
                this.showEndPage();
            };
        }

        cash.stopAllActions();
        cash.opacity = 255;
        cash.active = true;
        cash.position = cc.v2(-9, -39.233);

        let rand1 = Math.random(); // rand1<0.5左边， angle>0.5右边
        let randAngle = rand1 < 0.5 ? -30 : 30; // angle>0左边， angle<0右边
        let randX = rand1 < 0.5 ? -100-Math.random()*50: 100+Math.random()*50;
        this.gameController.addCash(10);
        cash.runAction(cc.sequence(
            cc.moveBy(0.1, 0, 400),
            cc.spawn(cc.moveBy(0.2, randX, 700), cc.rotateTo(0.3, randAngle)),
            cc.callFunc(() => {
                cash.opacity = 0;
                cash.angle = 0;
                cash.active = false;
                this.info.showHandTimeout && clearTimeout(this.info.showHandTimeout);
                this.info.showHandTimeout = setTimeout(() => {
                    if (!this.info.isGameFinished) {
                        this.showGuideHand();
                    }
                }, 2000);
                if (this.info.isGameFinished) {
                    endCallback && endCallback();
                }
                // cash.position = cc.v2(-9, -39.233);
            })
        ));
    },

    showEndPage () {
        // console.log('展示');
        const pphand = this.ppcard.getChildByName('hand');
        this.gameController.getAudioUtils().playEffect('cheer', 0.5);

        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.4, 130));

        this.ppcard.active = true;
        this.ppcard.scale = 0;
        this.ppcard.opacity = 0;
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.3, 1.1)),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);
                this.gameController.endGame();
            }),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                this.gameController.guideView.myFadeIn(pphand, ()=>{
                    this.gameController.guideView.myClickHere(pphand)
                });
            })
        ));
    },

    // update (dt) {},
});
