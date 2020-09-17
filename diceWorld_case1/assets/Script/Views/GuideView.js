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
        paypalCards: [cc.Node], // pp卡
        cashoutHand: cc.Node, //
        congrat: cc.Node,
        congratBlur: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () { 
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
            cc.fadeOut(.01),
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

    /** 展示paypal卡弹出动画 */
    showPaypalCardFly (callback) {
        const paypal = cc.find('Canvas/center/UI/paypal');
        const delay = 150; // ms
        const moveTime = 0.25; // s
        let screenConfig = this.gameController.gameModel.getPositionConfig();
        let paypalIcon = screenConfig.UI.children.paypal.children.icon;
        let paypalCardConfig = screenConfig.UI.children.guide.children.paypalCard;
        let destPos = this.node.convertToNodeSpaceAR(
            paypal.convertToWorldSpaceAR(paypalIcon.position));
        for (let i = 0; i < this.paypalCards.length; i++) {
            let card = this.paypalCards[i];
            // console.log('show, ', card, destPos);
            card.position = paypalCardConfig.position;
            card.scale = paypalCardConfig.scale;
            card.active = true;
            card.opacity = 0;
            card.runAction(cc.fadeIn(0.15));
            // if(i===0) {
            //     card.active = true;
            //     console.log('show, ', card, destPos);
            //     card.runAction(cc.moveTo(moveTime, destPos));
            // }
            
            setTimeout(() => {
                card.runAction(cc.sequence(
                    cc.moveTo(moveTime, destPos),
                    cc.fadeOut(0.1),
                    cc.callFunc(() => {
                        card.active = false;
                        if (i === this.paypalCards.length-1) {
                            callback && callback();
                        }
                    })
                ))
            }, delay*i);
        }
    },

    /**展示提示手 */
    showCashoutHand () {
        this.cashoutHand.opacity = 0;
        this.cashoutHand.active = true;
        this.cashoutHand.runAction(cc.sequence(
            cc.delayTime(0.5),
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
        if (this.gameController.cashView.cash>=300){
            this.cashoutHand.active = false;
            
            this.gameController.cashView.addCash(-300);
            setTimeout(() => {
                this.showEndPage();
            }, 600);
        }
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
                // this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
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
                        cc.fadeIn(.7),
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
