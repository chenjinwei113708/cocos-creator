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
    CELL_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        ppcard: cc.Node,
        pps: cc.Node,
        paypal: cc.Node,
        gift: cc.Node,
        guideHand: cc.Node,
        awardHand: cc.Node,
        downloadBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lightnings = cc.find('Canvas/center/game1/effectL').children;
        this.balls = cc.find('Canvas/center/game1/balls').children;
        this.ball8 = this.balls.filter((each) => each.name === 'cc8');

        this.info = {
            cellStatus: CELL_STATUS.CAN_MOVE,
            canCollect: true,
        };

        this.startPhysicEngine();
        this.gameController.guideView.myClickHere(this.guideHand);
    },

    start () {
        // console.log('this.ball8', this.ball8);
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setCellStatus (status) {
        this.info.cellStatus = status;
        // console.log(' ***** setCellStatus cellStatus:', this.gameInfo.cellStatus);
    },

    /**打开物理引擎 */
    startPhysicEngine () {
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 绘制调试信息  | cc.PhysicsManager.DrawBits.e_aabbBit;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        // // 关闭绘制
        // cc.director.getPhysicsManager().debugDrawFlags = 0;
        // 设置重力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -450);

        // 碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // console.log('开启物理引擎');
    },

    // 点击气泡炸弹
    onClickBomb () {
        if (this.info.cellStatus === CELL_STATUS.CAN_MOVE) {
            console.log('点击爆炸');
            this.guideHand.stopMyAnimation && this.guideHand.stopMyAnimation(() => {
                this.guideHand.runAction(cc.fadeOut(0.2));
            });
            this.setCellStatus(CELL_STATUS.IS_MOVE);
            this.showLigtning();
        }
    },

    // 展示雷电特效
    showLigtning () {
        this.gameController.getAudioUtils().playEffect('lightning', 0.65);
        this.ball8.forEach((node, index) => {
            let lightning = this.lightnings[index];
            lightning.position = node.position;
            let rand = Math.random();
            setTimeout(() => {
                let animState = lightning.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(
                    cc.rotateBy(0.1, 15),
                    cc.rotateBy(0.1, -15),
                    cc.rotateBy(0.1, 20),
                    cc.rotateBy(0.1, -20),
                    cc.rotateBy(0.1, 8),
                    cc.rotateBy(0.1, -8),
                    cc.rotateBy(0.1, 10),
                    cc.rotateBy(0.1, -10),
                ));
                animState.on('finished', () => {
                    node.runAction(cc.sequence(
                        cc.fadeOut(0.1),
                        cc.callFunc(() => {
                            if (index === this.ball8.length-1) {
                                // console.log('结束lightning');
                                setTimeout(() => {
                                    this.showPPcard();
                                }, 300);
                            }
                            node.active = false;
                        })
                    ));
                });
            }, rand*300);
            
            
        });
    },

    showPPcard () {
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.2, 190));
        this.ppcard.opacity = 0;
        this.ppcard.scale = 0;
        this.ppcard.active = true;
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.3, 1)),
            cc.callFunc(() => {
                this.gameController.guideView.myFadeIn(this.awardHand, () => {
                    this.gameController.guideView.myClickHere(this.awardHand);
                });
            })
        ));
        
    },

    hidePPcard () {
        this.mask.active = false;
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 0)),
            cc.callFunc(() => {
                this.ppcard.active = false;
            })
        ));
    },

    // 收取金币
    onClickCollect () {
        if (this.info.canCollect) {
            this.gameController.getAudioUtils().playEffect('combine', 0.6);
            this.info.canCollect = false;
            this.hidePPcard();
            setTimeout(() => {
                this.showPPFly();
            }, 300);
        
        }
    },

    showPPFly () {
        let destPos = this.pps.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('topicon').position)
        );
        let oriPos = cc.v2(0, 0);
        this.pps.children.forEach((node, index) => {
            node.opacity = 0;
            node.scale = 1;
            node.active = true;
            node.position = oriPos;
            node.runAction(cc.sequence(
                cc.delayTime(0.1*index),
                cc.fadeIn(0.2),
                cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.5)),
                cc.spawn(cc.scaleTo(0.2, 0.3), cc.fadeOut(0.2), cc.moveBy(0.2, -50, -20)),
                cc.callFunc(() => {
                    if (index === 0) {
                        this.gameController.getAudioUtils().playEffect('coin', 0.6);
                        // this.gameController.addCash(200);
                        this.gameController.addCash(100);
                        this.gameController.progressView.setProgress(1);
                        setTimeout(() => {
                            this.showPacket();
                        }, 1000);
                    }
                    if (index === this.pps.children.length-1) {
                        // if (this.gameLevels.length > 0) {
                            // this.setTouchListener();
                            // this.showMoveHand();
                        // } else {
                            // this.showCashout();
                        // }
                        
                        // console.log('finish');
                    }
                })
            ))
        });
        
    },

    // 展示礼包
    showPacket () {
        let packet = this.gift.getChildByName('packet');
        let hand = this.gift.getChildByName('hand');
        hand.opacity = 0;
        this.gift.scale = 0;
        this.gift.active = true;
        hand.active = true;
        this.gameController.getAudioUtils().playEffect('cheer', 0.6);

        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.3, 190));

        this.gameController.endGame();

        this.gift.runAction(cc.sequence(
            cc.scaleTo(0.6, 1.3),
            cc.scaleTo(0.3, 0.9),
            cc.scaleTo(0.2, 1),
            cc.callFunc(() => {
                this.downloadBtn.active = true;
                packet.getComponent(cc.Animation).play();
                
                hand.runAction(cc.sequence(
                    cc.fadeIn(0.3),
                    cc.callFunc(() => {
                        hand.getComponent(cc.Animation).play();
                    })
                ));
            })
        ));
    },
    // update (dt) {},
});
