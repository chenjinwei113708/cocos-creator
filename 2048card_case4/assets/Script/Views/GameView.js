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
    CARD_STATUS,
    CARD_GROUP,
    CARD_VALUE,
    CARD_GROUP_INDEX
} from '../Model/ConstValue';
cc.Class({
    extends: cc.Component,

    properties: {
        card1: cc.Node, // 卡牌库的下一张卡
        card2: cc.Node, // 用户可以点击的卡
        user: cc.Node, // 用户手势位置
        kong1: cc.Node, // 第一组卡牌
        kong2: cc.Node, // 第二组卡牌
        kong3: cc.Node, // 第三组卡牌
        kong4: cc.Node, // 第四组卡牌
        kongBox: cc.Node, // 提示框
        excellent: cc.Node, // 优秀
        hint: cc.Node, // 提示
        swipe: cc.Node, // 提示
        golds: cc.Node, // 金币
        cashes: cc.Node, // 现金
        mask2: cc.Node, // 遮罩
        ppcard: cc.Node, // 现金卡
        progressBar: cc.Node, // 进度条
        cardPrefab: cc.Prefab, // 卡牌预制资源
        cardSprites: [cc.SpriteFrame], // 卡牌图片
        // 转盘新增
        gameMask: cc.Node, // pp奖赏遮罩层
        paypal: cc.Node, // 上方计数板
        pps: cc.Node, // 飞翔计数板的pp图标
        cashout: cc.Node,
        // 转盘新增结束
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            cardStatus: CARD_STATUS.CAN_MOVE, // 可选择卡片的状态
            groupDelay: 40, // 分组判断延时
            lastGroupTime: 0, // 上次分组时间
            lastGroup: null, // 上次选中的分组
            cardDistance: -50, // 卡片距离
            isGameStarted: false, // 用户有没有开始游戏
            isFirstCard: true, // 是不是第一张卡
            isSecondCard: false, // 是不是第一张卡
            cardWidth: 97,
            cardHeight: 141,
            inputBox: [ // 输入位置
                cc.v2(this.kong1.position.x, this.kong1.position.y-100),
                cc.v2(this.kong2.position.x, this.kong2.position.y-150),
                cc.v2(this.kong3.position.x, this.kong3.position.y-200),
                cc.v2(this.kong4.position.x, this.kong4.position.y-50),
            ],
            progress: 0, // 进度条 范围0-1
            progressInterval: null, // 进度条递加
        };
        this.setCardClickListener();
        this.showSwipeHint();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setCardClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    offClickListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        // console.log('touch start, ', this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE);
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            if (!this.gameInfo.isGameStarted) {
                this.gameInfo.isGameStarted = true;
                this.hideSwipeHint();
            }
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (!this.isTouchInCard2(touchPos)) {
                // 如果点击的不是可选择卡片
                return;
            }
            this.gameInfo.lastGroupTime = Date.now();
            this.setCardStatus(CARD_STATUS.IS_MOVE);
            let card2Sprite = this.card2.getComponent(cc.Sprite);
            let userSprite = this.user.getComponent(cc.Sprite);
            userSprite.spriteFrame = card2Sprite.spriteFrame;
            this.user.active = true;
            this.card2.active = false;
            this.user.position = cc.v2(this.card2.position.x, this.card2.position.y);
        }
    },
    onTouchMove (touch) {
        // console.log('touch move, ', this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE);
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            // console.log('touch move, ', touchPos);
            this.user.position = touchPos;
            this.checkGroup(touchPos, false);
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            this.user.active = false;
            // 用户真正选择的分组
            let group = this.checkGroup(touchPos, true);
            // console.log('-- onTouchEnd, 用户选择分组:', group);
            this.deactivateLastGroup();
            
            if (!group) { // 如果没放到卡牌组里去
                this.card2.active = true;
                this.setCardStatus(CARD_STATUS.CAN_MOVE);
                return;
            } else { // 如果放到了卡牌组里面去
                if (this.gameInfo.isFirstCard) {
                    // 如果是第一次放，只能放到第二组
                    if (group !== CARD_GROUP.KONG2) {
                        this.card2.active = true;
                        this.setCardStatus(CARD_STATUS.CAN_MOVE);
                        return
                    };
                    this.gameInfo.isFirstCard = false;
                    this.gameInfo.isSecondCard = true;
                    this.changeSwipeHand();
                    // this.hideSwipeHand();
                } 
                else if (this.gameInfo.isSecondCard) {
                    // 如果是第二次放，只能放到第三组
                    if (group !== CARD_GROUP.KONG3) {
                        this.card2.active = true;
                        this.setCardStatus(CARD_STATUS.CAN_MOVE);
                        return;
                    } else {
                        this.hideSwipeHand();
                        this.gameInfo.isSecondCard = false;
                        this.changeTimeout && clearTimeout(this.changeTimeout);
                    }
                }
                this.setCardStatus(CARD_STATUS.DONE_MOVE);
                let nowCard = this.gameController.gameModel.getNowCard();
                this.putCardIntoGroup(group, nowCard);
            }
        }
    },

    /**把卡片放到分组里去 */
    putCardIntoGroup (groupName, cardValue, isAuto = false) {
        let newCard = cc.instantiate(this.cardPrefab);
        if (isAuto) {
            newCard = this[groupName].children[this[groupName].children.length - 1];
            // console.log(' groupName :', groupName, ' *** newCard',  newCard);
        } else {
            newCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(cardValue)];
            newCard._name = cardValue;
            newCard.position = cc.v2(0, (this[groupName].children.length)* this.gameInfo.cardDistance);
            newCard.parent = this[groupName];
        }
        if (cardValue === 2048) {
            // 2048卡
            this.gainCoin();
            this.showExcellent();
            this.stopGame();
            this.showPPFly() // pp飞向记分板
            setTimeout(() => {
                this.gameController.addCash(200);
                this.showFlyCard(newCard);
            }, 350);
            // newCard.runAction(cc.sequence(
            //     cc.repeat(cc.sequence(
            //         cc.rotateTo(0.1, 15), cc.rotateTo(0.1,-15)
            //     ), 3),
            //     cc.spawn(cc.fadeOut(0.1), cc.scaleTo(0.1, 0.5)),
            //     cc.callFunc(() => {
            //         newCard.runAction(cc.removeSelf());
            //         let lastCardValue = this.gameController.gameModel.delete2048(groupName);
            //         this.createNewCard();
            //         if (lastCardValue > 0) {
            //             // 如果2048上面还有卡
            //             // console.log(' --- lastCardValue, ', lastCardValue);
            //             let lastCard = this[groupName].children[this[groupName].children.length - 2];
            //             this.gameInfo.inputBox[CARD_GROUP_INDEX[groupName]] =
            //                 cc.v2(this[groupName].position.x, this[groupName].position.y + lastCard.position.y);
            //             this.setCardStatus(CARD_STATUS.CAN_MOVE); // 设置用户可以再次放卡
            //         } else {
            //             // 更新(卡牌组)输入框位置
            //             this.gameInfo.inputBox[CARD_GROUP_INDEX[groupName]] =
            //                 cc.v2(this[groupName].position.x, this[groupName].position.y);
            //             this.setCardStatus(CARD_STATUS.CAN_MOVE); // 设置用户可以再次放卡
            //         }
            //     })
            // ));
            // return;
        }
        // 更新(卡牌组)输入框位置
        this.gameInfo.inputBox[CARD_GROUP_INDEX[groupName]] =
            cc.v2(this[groupName].position.x, this[groupName].position.y + newCard.position.y);
        let newResult = this.gameController.gameModel.insertCard(groupName, cardValue, isAuto); // 插入卡片到卡牌组,如果合成新卡，会返回新卡的值，否则返回0
        if (newResult > 0) {
            // 合成新卡
            // console.log('-- putCardIntoGroup 合成新卡, isAuto:', isAuto, ' new:', newResult);
            // 播放合成卡片动画
            this.gameController.getAudioUtils().playEffect('combine', 0.6);
            newCard.runAction(cc.sequence(
                cc.moveBy(0.08, 0, -this.gameInfo.cardDistance),
                cc.callFunc(() => {
                    let lastCard = this[groupName].children[this[groupName].children.length - 2];
                    lastCard.runAction(cc.removeSelf());
                }),
                cc.scaleTo(0.08, 0.7),
                cc.callFunc(() => {
                    newCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(newResult)];
                    newCard._name = newResult;
                }),
                cc.scaleTo(0.08, 1),
                cc.callFunc(() => {
                    this.putCardIntoGroup(groupName, newResult, true);
                }),
            ));
        } else if (newResult === 0) {
            // 没合成新卡
            // console.log('-- putCardIntoGroup 没合成新卡, isAuto:', isAuto);
            // 播放插入卡片动画
            this.createNewCard();
            if (isAuto) {
                this.gainCoin();
                this.setCardStatus(CARD_STATUS.CAN_MOVE); // 设置用户可以再次放卡
            } else {
                this.gameController.getAudioUtils().playEffect('put', 0.6);
                newCard.runAction(cc.sequence(
                    cc.scaleTo(0.1, 1, 0.87),
                    cc.scaleTo(0.1, 1, 1),
                    cc.callFunc(() => {
                        let gameLost = this.gameController.gameModel.checkIsGameLost();
                        if (gameLost) {
                            this.setCardStatus(CARD_STATUS.LOST_GAME);
                            this.loseGame();
                        }
                        else { 
                            this.setCardStatus(CARD_STATUS.CAN_MOVE); // 设置用户可以再次放卡
                        }
                    })
                ));
            }
        }
    },

    /**
     * 展示2048卡片飞到pp顶部
     * @param {cc.Node} originNode 原来的2048卡片节点
     */
    showFlyCard (originNode) {
        let lighty = cc.find('Canvas/center/UI/flycard/card/lighty');
        let card = cc.find('Canvas/center/UI/flycard/card');
        if (!lighty || !card) return;
        let originPos = cc.v2(originNode.position.x+64, originNode.position.y+272);
        let desPos = cc.v2(-150, 200);
        
        card.position = originPos;
        card.active = true;
        originNode.active = false;
        lighty.active = true;
        
        lighty.scale = 0;
        lighty.opacity = 0;

        lighty.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.5), cc.scaleTo(0.3, 1)),
            cc.delayTime(0.6),
            cc.callFunc(() => {
                setTimeout(() => {
                    this.showCashoutBtn();
                }, 1000);
                // card.runAction(cc.sequence(
                //     cc.moveTo(0.5, desPos).easing(cc.easeIn(1.5)),
                //     cc.spawn(cc.scaleTo(0.2, 0.2), cc.fadeOut(0.4), cc.moveBy(0.3, -25, -25)),
                //     cc.callFunc(() => {
                //         this.showPPFly() // pp飞向记分板
                //         setTimeout(() => {
                //             this.showCashoutBtn();
                //         }, 1000);
                //     })
                // ))
            })
        ));
    },

    /**展示提现按钮 */
    showCashoutBtn () {
        console.log('展示提现按钮')
        this.showCashout()
    },

    /**生成新的卡 */
    createNewCard () {
        let newCardValue = this.gameController.gameModel.generateNewCard();
        // console.log('createNewCard, newCardValue', newCardValue, ' cardindex: ',CARD_VALUE.indexOf(newCardValue));
        this.card2.scale = 0.836;
        this.card2.position = cc.v2(this.card1.position.x, this.card1.position.y);
        this.card2.getComponent(cc.Sprite).spriteFrame = this.card1.getComponent(cc.Sprite).spriteFrame;
        this.card2.active = true;
        this.card1.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(newCardValue)];
        this.card2.runAction(cc.spawn(
            cc.moveTo(0.1, cc.v2(10.47, -267.314)),
            cc.scaleTo(0.1, 1),
        ));
    },

    /**判断是否选择卡片 */
    isTouchInCard2 (touchPos) {
        const x1 = this.card2.position.x - this.card2.width/2;
        const x2 = this.card2.position.x + this.card2.width/2;
        const y1 = this.card2.position.y - this.card2.height/2;
        const y2 = this.card2.position.y + this.card2.height/2;
        if (touchPos.x >= x1 && touchPos.x <= x2 && touchPos.y >= y1 && touchPos.y <= y2) { return true; }
        else return false;
    },

    setCardStatus (status) {
        this.gameInfo.cardStatus = status;
    },

    /**检查用户想把卡放入哪一组, 返回group名字或者null */
    checkGroup (cardPos, isTouchEnd = false) {

        let groupName = null;
        if (Date.now() - this.gameInfo.lastGroupTime >= this.gameInfo.groupDelay || isTouchEnd) {
            const groups = [CARD_GROUP.KONG1, CARD_GROUP.KONG2, CARD_GROUP.KONG3, CARD_GROUP.KONG4];
            const leastY = -148.5;
            const lastY = 342.6;
            if (cardPos.y >= leastY && cardPos.y <= lastY) {
                let groupIndex = this.gameInfo.inputBox.findIndex(item => {
                    if (cardPos.x > (item.x - this.gameInfo.cardWidth/2) &&
                        cardPos.x < (item.x + this.gameInfo.cardWidth/2) &&
                        cardPos.y > (item.y - this.gameInfo.cardHeight/2) &&
                        cardPos.y < (item.y + this.gameInfo.cardHeight/2)) {
                        return true;
                    } else return false;
                });
                if (groupIndex > -1) {
                    groupName = groups[groupIndex];
                    let groupPos = this.gameInfo.inputBox[groupIndex];
                    this.deactivateLastGroup();
                    this.kongBox.position = groupPos;
                    if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE) {
                        this.kongBox.active = true;
                    }
                    this.gameInfo.lastGroupTime = Date.now();
                    return groupName;
                } else {
                    this.deactivateLastGroup();
                }
            } else {
                this.deactivateLastGroup();
            }
        }
        return groupName;
    },
    
    deactivateLastGroup () {
        this.kongBox.active = false;
    },

    /**2048特效 */
    showExcellent () {
        this.gameController.getAudioUtils().playEffect('excellent', 0.6);
        this.excellent.opacity = 0;
        this.excellent.scale = 0.5;
        this.excellent.active = true;
        this.excellent.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.18, 1), cc.fadeIn(0.1)),
            cc.delayTime(0.2),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.excellent.active = false;
            })
        ));
    },

    /**出现提示信息 */
    showSwipeHint () {
        // this.hint.opacity = 0;
        // this.hint.active = true;
        // this.hint.runAction(cc.fadeTo(0.5, 220));
        this.swipe.opacity = 0;
        this.swipe.active = true;
        this.swipe.getComponent(cc.Animation).play('swipeHand');
        // this.swipe.runAction(cc.sequence(
        //     // cc.fadeIn(0.5),
        //     cc.callFunc(() => {
        //         this.swipe.getComponent(cc.Animation).play();
        //     })
        // ));
    },

    /**隐藏提示信息 */
    hideSwipeHint () {
        // this.hint.runAction(cc.sequence(
        //     cc.fadeOut(0.3),
        //     cc.callFunc(() => {
        //         this.hint.active = false;
        //     })
        // ));
    },

    /**隐藏提示手 */
    hideSwipeHand () {
        this.swipe.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.swipe.getComponent(cc.Animation).stop();
                this.swipe.active = false;
            })
        ));
    },

    /**改变提示手 */
    changeSwipeHand () {
        this.hideSwipeHand();
        this.changeTimeout = setTimeout(() => {
            this.swipe.opacity = 0;
            this.swipe.active = true;
            this.swipe.getComponent(cc.Animation).play('swipeHand2');
        }, 1500);
    },

    /**获得金币 */
    gainCoin () {
        this.golds.active = true;
        this.gameController.getAudioUtils().playEffect('money', 0.6);
        this.golds.getComponent(cc.Animation).play();
        // this.addProgress();
        if (this.gameInfo.isSecondCard) {
            this.showPPFly() // pp飞向记分板
            let money = parseInt(10);
            this.gameController.addCash(money);
        }
        
        // this.gameController.paypalView.addNewMsg(200);
        // if (this.gameInfo.isSecondCard) this.gameController.addCash(100);
        // else { this.gameController.addCash(50); }
    },

    /**输掉了游戏 */
    loseGame () {
        cc.audioEngine.stopMusic();
        this.gameController.getAudioUtils().playEffect('fail', 0.8);   
        setTimeout(() => {
            this.gameController.download();
        }, 2200);
        console.log('lost game');
    },

    /**停止游戏 */
    stopGame () {
        this.offClickListener();
    },

    /**让文字闪光 */
    textBling () {
        let text = cc.find('Canvas/center/UI/paypal/box/cash');
        // console.log('text',text);
        let time = 1;
        let mostTime = 13;
        const green = new cc.Color(22, 146, 16);
        const red = new cc.Color(216, 0, 9);
        const white = new cc.Color(255, 255, 255);
        
        this.textInterval = setInterval(() => {
            let col = (time % 2 === 0) ? green : white;
            text.color = col;
            // console.log('textbling col', col, text);
            // text.getComponent(cc.LabelOutline).color = col;
            if (time >= mostTime) {
                this.textInterval && clearInterval(this.textInterval);
            }
            time++;
        }, 120);
    },

    showPPcard () {
        let mask2 = this.mask2;
        let ppcard = this.ppcard;
        mask2.opacity = 0;
        mask2.active = true;
        mask2.runAction(cc.fadeTo(0.4, 160));
        ppcard.scale = 0;
        ppcard.active = true;
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.7);
        ppcard.runAction(cc.sequence(
            cc.scaleTo(0.3, 1.1),
            cc.scaleTo(0.2, 0.9),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                // this.gameController.getAudioUtils().playEffect('cheer', 0.5);
            })
        ));
        this.showMoneyFly();
        this.gameController.endGame();
    },

    // 展示现金飘落
    showMoneyFly () {
        this.cashes.children.forEach((node, index) => {
            let oriX = -240 + Math.random() * 480;
            let oriY = 520 + (Math.random()-0.5) * 50;
            let destX = -260 + Math.random() * 520;
            let destY = -720 + (Math.random()-0.5) * 50;
            node.position = cc.v2(oriX, oriY);
            node.scale = 1.3;
            // node.skew.x = -15 + Math.random() * 30;
            // node.skew.y = -15 + Math.random() * 30;
            node.opacity = 0;
            node.active = true;
            node.runAction(cc.sequence(
                cc.delayTime(index*0.01+index*0.2*Math.random()),
                cc.spawn(cc.fadeIn(0.2), cc.moveTo(1.0+2.5*Math.random(), destX, destY), cc.rotateTo(1.5+0.8*Math.random(), 180+360*Math.random())),
                cc.fadeOut(0.2),
            ));
        });
    },

    /**增加进度条 */
    addProgress () {
        this.gameInfo.progress += 0.2;
        this.enabled = true;

    },
    /* 转盘新增 */

    // 转盘模块新增 --- 隐藏mask
    hideGameMask () {
        this.gameMask.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.gameMask.active = false;
            })
        ));
    },

    // 奖赏pp飞到上方计数板
    showPPFly () {
        let destPos = this.pps.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('topbox').position)
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
                        
                    }
                    // if (index === this.pps.children.length-1) {
                    //     if (this.gameLevels.length > 0) {
                    //         this.setTouchListener();
                    //         this.showMoveHand();
                    //     } else {
                    //         this.showCashout();
                    //     }
                        
                    //     // console.log('finish');
                    // }
                })
            ))
        });
        
    },

    // 展示cashout
    showCashout () {
        let oriPos = cc.v2(this.cashout.position.x, this.cashout.position.y);
        this.cashout.position = cc.v2(oriPos.x-this.cashout.width, oriPos.y);
        this.cashout.active = true;
        this.cashout.opacity= 0;
        this.gameController.getAudioUtils().playEffect('cheer', 0.6);
        this.cashout.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.5), cc.moveBy(0.5, this.cashout.width, 0)).easing(cc.easeIn(1.5)),
            cc.callFunc(() => {
                this.cashout.getComponent(cc.Animation).play();
                this.gameController.guideView.showCashOutHand();
            })
        ));
    },
    /* 转盘新增结束 */

    start () {

    },

    update (dt) {
        const unit = 0.03;
        // this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
        // this.gameInfo.progressInterval = setInterval(() => {
            
        // }, 500);
        let nowp = this.progressBar.getComponent(cc.ProgressBar).progress;
        if (this.gameInfo.progress - nowp > unit) {
            this.progressBar.getComponent(cc.ProgressBar).progress += unit;
        } else {
            this.progressBar.getComponent(cc.ProgressBar).progress = this.gameInfo.progress;
            this.enabled = false;
            // this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
        }
    },
});
