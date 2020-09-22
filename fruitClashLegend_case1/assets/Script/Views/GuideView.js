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
        flyCoins: [cc.Node],
        paypal: cc.Node,
        game: cc.Node,
        cashoutHand: cc.Node, // 提现提示手
        congrat: cc.Node,
        congratBlur: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () { 
        this.flyCoinTimes = 0; // 飞行金币的展示次数
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

    /**展示飞行金币 */
    showFlyCoin (pos) {
        let flyCoin1 = this.flyCoins[this.flyCoinTimes%this.flyCoins.length];
        this.flyCoinTimes++;
        let flyCoin2 = this.flyCoins[this.flyCoinTimes%this.flyCoins.length];
        this.flyCoinTimes++;
        let flyCoin3 = this.flyCoins[this.flyCoinTimes%this.flyCoins.length];
        this.flyCoinTimes++;
        let coins = [flyCoin1, flyCoin2, flyCoin3];

        let screenConfig = this.gameController.gameModel.getPositionConfig();
        let cashIcon = screenConfig.UI.children.paypal.children.cash;
        let srcPos = srcPos = this.node.convertToNodeSpaceAR(
            this.game.convertToWorldSpaceAR(cc.v2(pos.x+30, pos.y+30)));
        // 
        let destPos = this.node.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(cashIcon.position));
        coins.forEach((flyCoin, index) => {
            flyCoin.opacity = 0;
            flyCoin.active = true;
            flyCoin.position = srcPos;
            flyCoin.getChildByName('streak').getComponent(cc.MotionStreak).reset();
            // let delay = index===0 ? cc. : cc.delayTime(0.1*index); 
            flyCoin.runAction(cc.sequence(
                cc.delayTime(0.15*index),
                cc.fadeIn(0.1),
                cc.moveBy(0.18, 0, -3),
                cc.moveTo(0.3, destPos),
                cc.fadeOut(0.05),
                cc.callFunc(() => {
                    flyCoin.getChildByName('streak').getComponent(cc.MotionStreak).reset();
                })
            ));
        });
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
            this.gameController.getAudioUtils().playEffect('spin', 0.4);
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
