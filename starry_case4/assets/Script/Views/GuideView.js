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
        hand: cc.Node, // 引导手
        money: cc.Node, // 现金卡片
        play: cc.Node, // 邀请试玩口号
        notification1: cc.Node, // 通知1
        notification2: cc.Node, // 通知2
        mask: cc.Node, // 遮罩
        congrat: cc.Node, // 提现到账
        congratBlur: cc.Node, // 提现到账模糊节点
        paypalCards: [cc.Node],
        ppicons: cc.Node, // pp图标
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () { 
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.moneyCardEnabled = true;
        this.showPPIconTimes = 0; // 显示pp图标的次数
    },
    // start () {},
    /**展示欢迎页面 */
    // showWelcomePage(){
    //     this.modal.active = true;
    //     this.modal.runAction(cc.sequence(
    //         cc.callFunc(() => {
    //             this.modal.getChildByName('startPage').active = true;
    //         }),
    //         cc.fadeIn(.3)
    //     ));
    //     this.hand.active = true;
    // },
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
    

    /**
     * 初始化引导节点
     * @param {Number} step 步数 1 / 2
     */
    // setGuideMaskPos(step) {
    //     if (step != 1 && step != 2) {
    //         return false;
    //     }
    //     let target = step == 1 ? cc.v2(2,7) : cc.v2(3,3);
    //     let handTarget = step == 1 ? cc.v2(3,7) : cc.v2(5,3);

    //     let targetPos = this.translatePosition(target, false);
    //     let handTargetPos = this.translatePosition(handTarget, true);

    //     let targetNode = this.node.getChildByName(`guideMask${step}`);
    //     // targetNode.active = false;

    //     // 绑定拖拽事件
    //     this.registerTouchEvent(targetNode, step);
        
    //     this.showTip('tipStart');

    //     this.hand.stopAllActions();
    //     this.hand.position = handTargetPos;

    //     targetNode.active = false;
    //     targetNode.position = targetPos;
        
    //     this.showGuideNode(targetNode);
    // },

    

    /**显示引导节点 */
    // showGuideNode(targetNode) {
    //     this.node.opacity = 0;
    //     this.node.active = true;
    //     this.hand.active = true;
    //     let handAction = cc.repeatForever(
    //         cc.sequence(
    //             cc.moveBy(.5, 0, CELL_HEIGHT),
    //             cc.delayTime(.2),
    //             cc.moveBy(.3, 0, -CELL_HEIGHT),
    //             cc.delayTime(.2),
    //         )
    //     )
    //     this.hand.runAction(handAction);
    //     // 遮罩重新出现（mask有bug 直接调透明度会失去遮罩，写一个延时
    //     this.node.runAction(
    //         cc.spawn(
    //             cc.fadeIn(.5),
    //             cc.sequence(
    //                 cc.delayTime(.2),
    //                 cc.callFunc(()=>{
    //                     targetNode.getChildByName('bg').opacity = 0;
    //                     targetNode.active = true;
    //                     targetNode.getChildByName('bg').runAction(cc.fadeTo(.3, 150))
    //                 })
    //             )
    //         )
    //     );
        
    // },
    // showTip(tipName) {
    //     let _node = null;
    //     this.node.getChildByName('tip').children.forEach((node)=>{
    //         if(node.name == tipName) {
    //             _node = node;
    //             node.active = true;
    //         } else {
    //             node.active = false;
    //         }
    //     })
    //     return _node
    // },

    // registerTouchEvent(targetNode, step) {
    //     let firstPos, secondPos;
    //     if (step == 1) {
    //         firstPos = cc.v2(3,7);
    //         secondPos = cc.v2(3,8);
    //     } else if ( step == 2 ) {
    //         firstPos = cc.v2(5,4);
    //         secondPos = cc.v2(5,3);
    //     } else {
    //         return false;
    //     }
        
    //     targetNode.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
            
            
    //     }, this);
        
    // },

    // isSamePos(pos1, pos2) {
    //     return pos1.x == pos2.x && pos1.y == pos2.y
    // },
    
    /**结束引导 */
    endGuide() {
        let tipEnd = cc.find('Canvas/center/tipEnd');
        tipEnd.active=true;
        // console.log('endGuide',tipEnd.active);
        // this.showTip('tipEnd');
    },

    // 激活遮罩，防止用户点击背景区域
    activateMask () {
        // this.mask.opacity = 0;
        this.mask.active = true;
        // this.mask.runAction(cc.fadeIn(0.5));
    },

    // 关闭遮罩
    deactivateMask () {
        // this.mask.runAction(cc.sequence(
        //     cc.fadeOut(0.5),
        //     cc.callFunc(() => { this.mask.active = false; })
        // ));
        this.mask.active = false;
    },

    hideHand () {
        // this.hand.getComponent(cc.Animation).stop('guideHand');
        this.hand.active = false;
        this.hidePlay();
    },
    setHandPos (pos) {
        if (pos) this.hand.position = pos;
    },
    showHand (pos) {
        if (pos) this.hand.position = pos;
        this.hand.opacity = 0;
        this.hand.active = true;
        this.hand.runAction(
            cc.sequence(
                cc.fadeIn(0.5),
                cc.callFunc(
                    ()=>{this.hand.getComponent(cc.Animation).play('guideHand');}
                )
            )
        );
    },

    // 显示玩游戏提示语
    showPlay () {
        this.play.active = true;
    },

    // 隐藏玩游戏提示语
    hidePlay () {
        this.play.active = false;
    },

    setMoneyCardEnabled (enabled) {
        this.moneyCardEnabled = enabled;
    },

    // 设置金币卡金钱数额
    setMoneyCardAmount (amount = 100) {
        this.money.getChildByName('amount').getComponent(cc.Label).string = '$'+amount;
    },

    // 获取金币卡金钱数额
    getMoneyCardAmount () {
        return Number(this.money.getChildByName('amount').getComponent(cc.Label).string.substr(1));
    },

    // 显示收钱卡片
    // amount 金额数量
    showMoneyCard (amount) {
        // this.money.active = true;
        this.setMoneyCardEnabled(true);
        this.setMoneyCardAmount(amount);
        this.activateMask();
        let moneyHand = this.money.getChildByName('hand');
        moneyHand.opacity = 0;
        this.money.opacity = 0;
        this.money.active = true;
        this.money.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.spawn(
                        cc.delayTime(0.3),
                        cc.callFunc(()=>{
                            this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
                        })
                    )
                ),
                cc.delayTime(0.8),
                cc.callFunc(() => {
                    moneyHand.active = true;
                    moneyHand.runAction(
                        cc.sequence(
                            cc.fadeIn(0.8),
                            cc.callFunc(
                                ()=>{moneyHand.getComponent(cc.Animation).play('guideHand');}
                            )
                        )
                    );
                })
            )
        );
    },

    /**
     * 出现pp图标，飞到顶部pp标志
     * @param {*} startPos pp图标出现位置
     * @param {*} callback 
     */
    flyPPIcon (startPos, callback) {
        let paypal = cc.find('Canvas/center/wallet');
        let screenConfig = this.gameController.gameModel.getPositionConfig();
        let paypalIcon = screenConfig.wallet.children.paypal;
        let destPos = this.node.convertToNodeSpaceAR(
            paypal.convertToWorldSpaceAR(paypalIcon.position));
        destPos = cc.v2(destPos.x, destPos.y+40);
        let icon = this.ppicons.children[this.showPPIconTimes % this.ppicons.children.length];
        this.showPPIconTimes++;
        icon.active = true;
        icon.stopAllActions();
        icon.position = startPos;
        icon.runAction(cc.sequence(
            cc.spawn(cc.moveTo(0.6, destPos), cc.scaleTo(0.6, 0.6)).easing(cc.easeOut(1.3)),
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                if (callback) {
                    callback();
                } else {
                    icon.active = false;
                }
            })
        ));
        
    },

    // 隐藏收钱卡片
    hideMoneyCard () {
        this.deactivateMask();
        let moneyHand = this.money.getChildByName('hand');
        moneyHand.getComponent(cc.Animation).stop('guideHand');
        moneyHand.opacity = 0;
        moneyHand.active = false;
        this.money.stopAllActions();
        this.money.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(() => { this.money.active = false; })
        ));
    },
    

    // 收钱到余额
    receiveMoney () {
        // console.log('receiveMoney');
        if (this.moneyCardEnabled){
            this.setMoneyCardEnabled(false);
            this.gameController.getAudioUtils().playEffect('clickBtn', 0.6);
            this.hideMoneyCard();
            this.gameController.gotoNextStep();
            this.gameController.CashView.addCash(this.getMoneyCardAmount());
        }
    },

    /** 展示paypal卡弹出动画 */
    showPaypalCardFly (amount, callback) {
        const paypal = cc.find('Canvas/center/wallet');
        const delay = 150; // ms
        const moveTime = 0.25; // s
        this.setMoneyCardAmount(amount);
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
        this.gameController.CashView.addCash(this.getMoneyCardAmount());
        let screenConfig = this.gameController.gameModel.getPositionConfig();
        let paypalIcon = screenConfig.wallet.children.paypal;
        let paypalCardConfig = screenConfig.guide.children.ppCard;
        let destPos = this.node.convertToNodeSpaceAR(
            paypal.convertToWorldSpaceAR(paypalIcon.position));
        for (let i = 0; i < this.paypalCards.length; i++) {
            let card = this.paypalCards[i];
            // console.log('show, ', card, destPos);
            card.position = paypalCardConfig.position;
            card.active = true;
            card.opacity = 255;
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
                            this.gameController.gotoNextStep();
                            callback && callback();
                        }
                    })
                ))
            }, delay*i);
        }
    },

    // 展示通知
    showNotification () {
        const inMoveTime = 0.3;
        const inFadeTime = 0.2;
        const inWaitTime = 0.08;
        const outMoveTime = 0.3;
        const outFadeTime = 0.2;
        const outWaitTime = 0.9;
        const moveY = -118; // 移动距离
        const distance = -10; // 间隔
        this.hideHand();
        this.hand.stopAllActions();
        this.notification1.opacity = 0;
        this.notification1.active = true;
        this.notification1.runAction(
            cc.sequence(
                cc.spawn(
                    cc.callFunc(()=>{
                        this.gameController.getAudioUtils().playEffect('notification', 0.4);
                    }),
                    cc.moveBy(inMoveTime, 0, moveY),
                    cc.fadeIn(inFadeTime)
                ),
                cc.delayTime(inWaitTime+inMoveTime),
                // cc.moveBy(inMoveTime, 0, moveY+distance),
                cc.delayTime(outWaitTime+outMoveTime),
                // cc.spawn(
                //     cc.moveBy(outMoveTime, 0, -(moveY/2)),
                //     cc.fadeOut(outFadeTime)
                // ),
                cc.delayTime(inWaitTime*2),
                cc.callFunc(() => {
                    this.showHand();
                    this.notification1.active = false;
                })
            )
        );
        this.notification2.opacity = 0;
        this.notification2.active = true;
        this.notification2.runAction(
            cc.sequence(
                cc.delayTime(inMoveTime+inWaitTime),
                cc.spawn(
                    cc.callFunc(()=>{
                        this.gameController.getAudioUtils().playEffect('notification', 0.4);
                    }),
                    cc.moveBy(inMoveTime, 0, moveY),
                    cc.fadeIn(inFadeTime)
                ),
                cc.callFunc(()=>{
                    this.gameController.gameModel.resetNotificationPos(moveY);
                })
            )
            
        )
        // this.notification1.getComponent(cc.Animation).play('notificationShow');
    },

    hideNotification () {
        this.notification1.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.notification1.active = false;
            })
        ));
        this.notification2.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(() => {
                this.notification2.active = false;
            })
        ));
    },

    // 点击推送
    onCheckMessage () {
        this.hideHand();
        this.hideNotification();
        this.showEndPage();
        // console.log('onCheckMessage');
    },

    // 提现
    cashOut () {
        // this.node.runAction
        if (this.gameController.CashView.cash>=300){
            this.gameController.getAudioUtils().playEffect('clickBtn', 0.6);
            this.hideHand();
            // this.gameController.gotoNextStep();
            // this.showNotification();
            this.showEndPage()
            this.gameController.CashView.addCash(-300);
        } else {
            this.gameController.download();
        }
    },

    /**展示结束页面，并引导下载 */
    showEndPage(){
        //播放结束音乐
        // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                // this.congrat.x = this.congrat.x + this.congrat.width;
                this.congrat.x = this.congrat.x;
                this.congrat.opacity = 0;
                // this.congrat.scale = 0.75;
                this.congrat.scale = 0.1;
                this.congrat.active = true;
                let opacityAction = null;
                let posConfig = this.gameController.gameModel.getPositionConfig();
                opacityAction = cc.fadeTo(0.2, posConfig.guide.children.congrat.opacity);
                this.congrat.runAction(cc.spawn(
                    opacityAction,
                    // cc.moveBy(0.35, -this.congrat.width, 0),
                    cc.scaleTo(0.2, 1)
                ));
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
            }),
            cc.delayTime(1.2),
            cc.spawn(
                cc.callFunc(() => {
                    this.congratBlur.active = true;
                    this.congrat.runAction(cc.sequence(
                        cc.fadeOut(0.5),
                        cc.callFunc(() => {this.congrat.active = false;})
                    ));
                }),
                cc.callFunc(() => {
                    this.modal.active = true;
                    this.modal.runAction(cc.sequence(
                        cc.fadeIn(.5),
                        cc.callFunc(() => {
                            this.modal.getChildByName('endPage').active = true;
                            this.gameController.endGame();
                        })
                    ));
                }),
            ),
            

        ));
    }

    
});
