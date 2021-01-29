// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT } from '../Model/ConstValue';

/**
 * 这个脚本是用来播放引导动作的
 */

cc.Class({
    extends: cc.Component,

    properties: {
        modal:cc.Node,
        hand: cc.Node,
        ppcard: cc.Node,
        cashoutHand: cc.Node,
        notification: cc.Node, // 通知
        congrat: cc.Node, // 提现到账
        congratBlur: cc.Node, // 提现到账模糊
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.info = {
            isCashout: false, // 是否提现过
        }
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    // start () {},
    /**展示欢迎页面 */
    showWelcomePage(){
        this.ppcard.runAction(
            cc.sequence(
                cc.fadeIn(0.4),
                cc.callFunc(() => {
                    this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
                })
        ));
    },

    hideWelcomePage () {
        this.ppcard.runAction(cc.fadeOut(0.25));
        this.gameController.gameView.setCardClickListener();
        this.gameController.gameView.showSwipeHint();
    },



    /**开始游戏的画面 */
    startGame(){
        // this.modal.runAction(cc.sequence(
        //     cc.fadeOut(.2),
        //     cc.callFunc(() => {
        //         this.modal.active = false;
        //         this.modal.getChildByName('startPage').active = false;
        //     })
        // ));
    },
    /**展示结束页面，并引导下载 */
    showEndPage(){
        // //播放结束音乐
        // // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        // this.modal.active = true;
        // this.modal.runAction(cc.sequence(
        //     cc.delayTime(1),
        //     cc.callFunc(() => {
        //         this.modal.getChildByName('endPage').active = true;
        //     }),
        //     cc.fadeIn(.5),
        // ));
    },
    
    /**结束引导 */
    endGuide() {
        // let tipEnd = cc.find('Canvas/center/tipEnd');
        // tipEnd.active=true;
        // console.log('endGuide',tipEnd.active);
        // this.showTip('tipEnd');
    },

    /**展示提示手 */
    showCashOutHand () {
        this.cashoutHand.opacity = 0;
        this.cashoutHand.active = true;
        this.cashoutHand.runAction(cc.sequence(
            cc.delayTime(1.2),
            cc.callFunc(() => {
                let hereState = this.cashoutHand.getComponent(cc.Animation).play('here');
                hereState.on('finished', () => {
                    this.cashoutHand.getComponent(cc.Animation).play('shake');
                }, this);
            })
        ));
    },

    /**点击提现 */
    clickCashout () {
        if (this.gameController.cashView.targetCash>=200 && !this.info.isCashout){
            this.info.isCashout = true;
            this.gameController.download();
            return;
            // this.cashoutHand.active = false;
            // this.showNotification();
            // this.gameController.cashView.addCash(-this.gameController.cashView.targetCash);
        }
    },

    /**修改提现金额文字 */
    changeTextNum (num) {
        this.notification.getChildByName('text').getComponent(cc.Label).string = num;
        this.congrat.getChildByName('text').getComponent(cc.Label).string = num;
    },

    showNotiHand () {
        const notiHand = this.notification.getChildByName('hand');
        this.showNotiHandTimeout = setTimeout(() => {
            notiHand.opacity = 0;
            notiHand.active = true;
            notiHand.runAction(cc.fadeIn(0.3));
            notiHand.getComponent(cc.Animation).play('guideHand');
        }, 1500);
        
    },
    hideNotiHand () {
        this.showNotiHandTimeout && clearTimeout(this.showNotiHandTimeout);
    },

    /**展示推送 */
    showNotification () {
        const inMoveTime = 0.3;
        const inFadeTime = 0.2;
        const moveY = -118; // 移动距离
        this.notification.opacity = 0;
        this.notification.active = true;
        this.notification.position = cc.v2(this.notification.position.x, this.notification.position.y-moveY);
        this.notification.runAction(
            cc.spawn(
                cc.callFunc(()=>{
                    this.showNotiHand();
                    this.gameController.getAudioUtils().playEffect('notification', 0.4);
                }),
                cc.moveBy(inMoveTime, 0, moveY),
                cc.fadeIn(inFadeTime)
            )
        );
    },

    hideNotification () {
        this.notification.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.notification.active = false;
            })
        ));
        this.hideNotiHand();
    },

    // 点击推送
    onCheckMessage () {
        // this.hideHand();
        this.hideNotification();
        this.showEndPage();
        // console.log('onCheckMessage');
    },

    /**展示结束页面，并引导下载 */
    showEndPage(){
        //播放结束音乐
        // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.congrat.x = this.congrat.x + this.congrat.width;
                this.congrat.opacity = 0;
                this.congrat.scale = 0.75;
                this.congrat.active = true;
                let opacityAction = null;
                if (this.gameController.gameModel.isLandscape) {
                    opacityAction = cc.fadeIn(0.2);
                } else {
                    opacityAction = cc.fadeIn(0.2);
                }
                this.congrat.runAction(cc.spawn(
                    opacityAction,
                    cc.moveBy(0.35, -this.congrat.width, 0),
                    cc.scaleTo(0.2, 1)
                ));
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
            }),
            cc.delayTime(1.2),
            cc.spawn(
                cc.callFunc(() => {
                    this.congratBlur.active = true;
                    this.congrat.runAction(cc.sequence(
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {this.congrat.active = false;})
                    ))
                }),
                cc.callFunc(() => {
                    this.modal.opacity = 0;
                    this.modal.active = true;
                    this.modal.runAction(cc.sequence(
                        cc.fadeIn(.5),
                        cc.callFunc(() => {
                            this.modal.getChildByName('endPage').opacity = 0;
                            this.modal.getChildByName('endPage').active = true;
                            this.modal.getChildByName('endPage').runAction(cc.fadeIn(0.3));
                        })
                    ));
                    this.gameController.endGame();
                }),
            ),
        ));
    },

    //
    myFadeIn (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        node.opacity = 0;
        node.position = cc.v2(oriPos.x, oriPos.y-node.height*1.5);
        node.active = true;
        node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.4, 0, node.height*1.5)).easing(cc.easeIn(2)),
            cc.callFunc(() => {
                callback && callback();
            })
        ));
    },
    /**
     * 提示点击
     * @param {*} node 
     */
    myClickHere (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        let movePos = cc.v2(oriPos.x+node.width*0.6, oriPos.y-node.height*0.8);
        node.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(cc.moveTo(0.5, movePos), cc.scaleTo(0.5, 1.2)),
                cc.spawn(cc.moveTo(0.3, oriPos), cc.scaleTo(0.3, 1))
            )
        ));
        callback && callback();
        let stopMyAnimation = (cb) => {
            node.stopAllActions();
            node.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.1, 1), cc.moveTo(0.1, oriPos)),
                cc.callFunc(() => {
                    node.stopMyAnimation = undefined;
                    cb && cb();
                })
            ));
        }
        node.stopMyAnimation = stopMyAnimation;
        return stopMyAnimation;
    },
    
});
