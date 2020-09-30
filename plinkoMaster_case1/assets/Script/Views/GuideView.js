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
        cashoutHand: cc.Node, // 提现手
        notification: cc.Node,
        notiHand: cc.Node,
        congrat: cc.Node,
        congratBlur: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        // 记录部分信息
        this.info = {
            isCashout: false, // 是否点击过提现
        };
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },
    // start () {},
    /**展示欢迎页面 */
    showWelcomePage(){
        this.modal.active = true;
        this.modal.runAction(cc.sequence(
            cc.callFunc(() => {
                this.modal.getChildByName('startPage').active = true;
            }),
            cc.fadeIn(.3)
        ));
    },
    /**开始游戏的画面 */
    startGame(){
        this.modal.runAction(cc.sequence(
            cc.fadeOut(.2),
            cc.callFunc(() => {
                this.modal.active = false;
                this.modal.getChildByName('startPage').active = false;
            })
        ));
    },
    /**展示结束页面，并引导下载 */
    showEndPage(){
        //播放结束音乐
        // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        this.modal.active = true;
        this.modal.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.modal.getChildByName('endPage').active = true;
            }),
            cc.fadeIn(.5),
        ));
    },

    /**展示提示手 */
    showCashOutHand () {
        this.cashoutHand.opacity = 0;
        this.cashoutHand.active = true;
        this.cashoutHand.runAction(cc.sequence(
            cc.delayTime(0.1),
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
        if (this.gameController.cashView.cash>=300 && !this.info.isCashout){
            this.info.isCashout = true;
            this.cashoutHand.active = false;
            this.showNotification();
            this.gameController.cashView.addCash(-300);
        }
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
                let posConfig = this.gameController.gameModel.getPositionConfig();
                opacityAction = cc.fadeTo(0.2, posConfig.UI.children.congrat.opacity);
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
    }

    
});
