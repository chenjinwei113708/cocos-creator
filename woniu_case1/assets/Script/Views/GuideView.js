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

    /**
     * （从下方）渐入
     * @param {*} node 
     */
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

    /**来回移动  */
    laiHui(node1, node2, callback) {
        let oriPos1 = cc.v2(node1.position.x, node1.position.y);
        let oriPos2 = cc.v2(node2.position.x, node2.position.y);
        // let movePos1 = cc.v2(oriPos1.x + node1.width*0.6, oriPos1.y - node1.height*0.8);
        // let movePos2 = cc.v2(oriPos2.x + node2.width*0.6, oriPos2.y - node2.height*0.8);
        // console.log(oriPos2, movePos2)
        node1.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.5, 1.2),
                cc.scaleTo(0.3, 1),
                cc.moveTo(0.5, oriPos2),
                cc.scaleTo(0.5, 1.2),
                cc.scaleTo(0.3, 1),
                cc.moveTo(0.5, oriPos1)
            )
        ));
        callback && callback();
        let stopMyAnimation = (cb) => {
            node1.stopAllActions();
            node1.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2, oriPos1)),
                cc.callFunc(() => {
                    node1.position = oriPos1
                    node1.stopMyAnimation = undefined;
                    cb && cb();
                })
            ));
        }
        node1.stopMyAnimation = stopMyAnimation;
        return stopMyAnimation;
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
                cc.spawn(cc.scaleTo(0.1, 0), cc.moveTo(0.1, oriPos)),
                cc.callFunc(() => {
                    node.stopMyAnimation = undefined;
                    cb && cb();
                })
            ));
        }
        node.stopMyAnimation = stopMyAnimation;
        return stopMyAnimation;
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
