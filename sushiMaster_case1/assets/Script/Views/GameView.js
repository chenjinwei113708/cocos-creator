import {
    CARD_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        guideHand1: cc.Node, // 指引手1
        guideHand2: cc.Node, // 指引手2
        touch1: cc.Node, // 开始触碰点1
        touch2: cc.Node, // 开始触碰点2
        touch3: cc.Node, // 结束触碰点1
        touch4: cc.Node, // 结束触碰点2
        startCard1: cc.Node, // 开始点1
        startCard2: cc.Node, // 开始点2
        endCard1: cc.Node, // 结束点1
        endCard2: cc.Node, // 结束点2
        move: cc.Node, // 移动卡
        ppcard: cc.Node, // pp卡
        ppSprite: cc.SpriteFrame, // pp卡牌样式
    },

    onLoad() {
        // 传送带上的牌
        this.end1 = cc.find('Canvas/center/game/convey/t1'); // 第1张10
        this.end2 = cc.find('Canvas/center/game/convey/t2'); // 第2张10
        this.end3 = cc.find('Canvas/center/game/convey/t3'); // 第3张10

        this.gameInfo = {
            step: 0, // 游戏进行到第几步
            cardStatus: CARD_STATUS.DONE_MOVE, // 卡片状态
            startTouch: this.touch1, // 触碰开始点
            endTouch: this.touch3, // 触碰结束点
            startCard: null, // 开始卡片
            endCard: null, // 结束卡片
            lastCheckTime: 0, // 移动判定延时 开始时间
            direcDelay: 60, // 移动判定延时 时间间隔
            isGameStarted: false, // 游戏开始没
            isCardDone1: false, // 第一张卡放好了没
            isCardDone2: false, // 第二张卡放好了没
            isClickWrong: false, // 用户最后一步放置是否点击了错误的地方
        };

        this.showFirstGuideAmin();
    },

    setGameController(gameController) {
        this.gameController = gameController;
    },

    setTouchListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    offTouchListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart(touch) {
        // console.log('onTouchStart');
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            // console.log('onTouchStart canmove');
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.gameInfo.startTouch.position.x - this.gameInfo.startTouch.width / 2 &&
                touchPos.x <= this.gameInfo.startTouch.position.x + this.gameInfo.startTouch.width / 2 &&
                touchPos.y >= this.gameInfo.startTouch.position.y - this.gameInfo.startTouch.height / 2 &&
                touchPos.y <= this.gameInfo.startTouch.position.y + this.gameInfo.startTouch.height / 2) {
                this.gameInfo.lastCheckTime = Date.now();
                this.gameController.getAudioUtils().playEffect('click', 0.7);
                if (this.gameInfo.step === 0) {
                    this.hideGuide(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.IS_MOVE);
                    this.move.position = cc.v2(this.startCard1.position.x, this.startCard1.position.y);
                    this.move.active = true;
                    this.startCard1.active = false;
                    return;
                } else if (this.gameInfo.step === 1) {
                    this.setCardStatus(CARD_STATUS.IS_MOVE);
                    this.move.active = true;
                    this.move.position = cc.v2(this.gameInfo.startCard.position.x, this.gameInfo.startCard.position.y);
                    this.gameInfo.startCard.active = false;
                    // this.showError();
                    
                }
                this.setCardStatus(CARD_STATUS.IS_MOVE);
            } else {
                if (this.gameInfo.step === 1 && !this.gameInfo.isClickWrong) {
                    this.gameInfo.isClickWrong = true;
                    this.showError();
                }
            }
        }

    },
    onTouchMove(touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y + 50);
            // let nowBrickType = this.gameInfo.currentBrickType;
            this.move.position = touchPos;
            // let brickPos = this.convert2BrickPos(touchPos); // 转换成格子坐标
            // console.log('brickPos', brickPos, touchPos);
            // if (brickPos) {
            //     let canPut = this.gameController.gameModel.placeInto(brickPos, BRICK_VALUE[nowBrickType], false);
            //     // console.log('当前位置：', brickPos.x, ' ', brickPos.y, canPut);
            //     this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], canPut, false);
            //     // this.checkInPos(touchPos, false);
            // } else {
            //     this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], false, false);
            // };
        }
    },
    onTouchEnd(touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y + 50);
            if (touchPos.x >= this.gameInfo.endTouch.position.x - this.gameInfo.endTouch.width / 2 &&
                touchPos.x <= this.gameInfo.endTouch.position.x + this.gameInfo.endTouch.width / 2 &&
                touchPos.y >= this.gameInfo.endTouch.position.y - this.gameInfo.endTouch.height / 2 &&
                touchPos.y <= this.gameInfo.endTouch.position.y + this.gameInfo.endTouch.height / 2) {
                // 放在结束点内
                this.gameController.getAudioUtils().playEffect('put', 0.6);
                if (this.gameInfo.step === 0) {
                    this.gameInfo.isCardDone1 = true;
                    // this.gameController.getAudioUtils().playEffect('card', 0.6);
                    this.hideGuide(this.gameInfo.step);
                    this.move.active = false;
                    this.gameInfo.endCard.active = true;
                    this.gameInfo.step++;
                    // 重置触碰区域 和 卡片
                    this.gameInfo.startTouch = this.touch2;
                    this.gameInfo.endTouch = this.endCard2;
                    this.gameInfo.startCard = this.startCard2;
                    this.gameInfo.endCard = this.endCard2
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    this.showGuide(this.gameInfo.step);
                } else if (this.gameInfo.step === 1) {
                    this.gameInfo.isCardDone2 = true;
                    // this.gameController.getAudioUtils().playEffect('card', 0.6);
                    this.hideGuide(this.gameInfo.step);
                    this.move.active = false;
                    this.gameInfo.endCard.active = true;
                    this.gameInfo.step++;
                    setTimeout(() => {this.combineCards();}, 100);
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                }
                return;
            }
            // 没放到指定位置
            this.move.active = false;
            this.gameInfo.startCard.active = true;
            // if (this.gameInfo.step === 0) {
                
            //     this.gameInfo.nowMoveNode.position = cc.v2(this.cardGet8.position.x, this.cardGet8.position.y);
            //     this.cardGet8.active = true;
            // } else if (this.gameInfo.step === 6) {
            //     this.gameInfo.nowMoveNode.active = false;
            //     this.gameInfo.nowMoveNode.position = cc.v2(-76.576, -154.53);
            //     this.ten2eight.forEach(each => {
            //         each.active = true;
            //     });
            // }
            this.setCardStatus(CARD_STATUS.CAN_MOVE);
        }
    },

    /**展示开场动画 */
    showFirstGuideAmin () {
        setTimeout(() => {
            let animState = this.guideHand1.getComponent(cc.Animation).play();
            animState.on('finished', () => {
                let t1 = cc.find('Canvas/center/game/convey/t1');
                t1.active = true;
                this.startGuide2();
                this.guideHand1.active = false;
            });
        }, 600);
        
    },

    /**指引用户第一次拖动方块 */
    startGuide2 () {
        let mask1 = cc.find('Canvas/center/game/mask1');
        let drag = cc.find('Canvas/center/game/drag');
        let cbox = cc.find('Canvas/center/game/convey/cbox');
        drag.opacity = 0;
        drag.active = true;
        cbox.opacity = 0;
        cbox.active = true;
        mask1.runAction(cc.fadeTo(0.4, 150));
        drag.runAction(cc.fadeIn(0.4));
        cbox.runAction(cc.fadeIn(0.4));
        this.guideHand2.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(() => {
                this.guideHand2.getComponent(cc.Animation).play();
            })
        ));
        // 允许用户操作
        this.setCardStatus(CARD_STATUS.CAN_MOVE);
        this.gameInfo.startCard = this.startCard1;
        this.gameInfo.endCard = this.endCard1;
        this.setTouchListener();
    },


    /**展示现金卡 */
    showPPCard(num = 100) {
        // if (this.gameInfo.isPPCardShow) return;
        // this.gameInfo.isPPCardShow = true;
        num = Number(num);
        let ppcard = this.ppcard;
        // let pphand = this.ppcard.getChildByName('hand');
        ppcard.opacity = 0;
        ppcard.active = true;
        ppcard.scale = 0.1;
        // pphand.opacity = 0;
        // pphand.active = true;
        ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1.1)),
            cc.scaleTo(0.1, 0.9),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                // this.gameController.getAudioUtils().playEffect('moneyCard', 0.4);
                // pphand.runAction(cc.sequence(
                //     cc.fadeIn(0.6),
                //     cc.callFunc(() => {
                //         pphand.getComponent(cc.Animation).play();
                //     })
                // ));
            }),
            cc.repeat(cc.sequence(cc.rotateTo(0.2, 5), cc.rotateTo(0.2, -5)), 2),
            cc.rotateTo(0.05, 0),
            cc.callFunc(() => {
                this.gameController.addCash(100);
                this.gameController.getAudioUtils().playEffect('coin', 0.4);
            }),
            cc.spawn(cc.scaleTo(0.5, 0.4), cc.fadeOut(0.5), cc.moveBy(0.5, 0, 350)),
            cc.callFunc(() => {
                this.becomePPcards();
            })
        ));
    },

    hideCard(name) {
        let card = this[name];
        if (!card) return;
        card.active = false;
    },

    showCard(name) {
        let card = this[name];
        if (!card) return;
        card.active = true;
    },

    hideGuide (step = 0) {
        if (step === 0) {
            let mask1 = cc.find('Canvas/center/game/mask1');
            if (mask1.active) {
                mask1.runAction(cc.sequence(
                    cc.fadeOut(0.4),
                    cc.callFunc(() => {
                        mask1.active = false;
                    })
                ));
            }
            if (this.gameInfo.isCardDone1) {
                let drag = cc.find('Canvas/center/game/drag');
                let cbox = cc.find('Canvas/center/game/convey/cbox');
                drag.active = false;
                cbox.active = false;
                this.guideHand2.getComponent(cc.Animation).stop();
                this.guideHand2.active = false;
            }
        } else if (step === 1) {
            let arrow = cc.find('Canvas/center/game/touches/arrow');
            let mask2 = cc.find('Canvas/center/game/mask2');
            let cbox = cc.find('Canvas/center/game/convey/cbox');
            arrow.getComponent(cc.Animation).stop();
            arrow.active = false;
            mask2.active = false;
            cbox.active = false;
        }
    },

    showGuide (step = 1) {
        if (step === 1) {
            let arrow = cc.find('Canvas/center/game/touches/arrow');
            if (!arrow.active) {
                arrow.opacity = 0;
                arrow.active = true;
                arrow.runAction(cc.fadeIn(0.3));
                this.setCardStatus(CARD_STATUS.CAN_MOVE);
            }
            if (this.gameInfo.isClickWrong) {
                let mask2 = cc.find('Canvas/center/game/mask2');
                let t3 = cc.find('Canvas/center/game/convey/t3');
                let cbox = cc.find('Canvas/center/game/convey/cbox');
                cbox.opacity = 0;
                cbox.position = cc.v2(t3.position.x, t3.position.y);
                cbox.active = true;
                cbox.runAction(cc.fadeIn(0.4));
                mask2.runAction(cc.fadeTo(0.4, 150));
            }
        }
    },

    showError () {
        this.setCardStatus(CARD_STATUS.DONE_MOVE);
        const err = cc.find('Canvas/center/game/error');
        this.gameController.getAudioUtils().playEffect('error', 0.6);
        err.active = true;
        err.stopAllActions();
        err.runAction(cc.sequence(
            cc.blink(0.6, 2),
            cc.callFunc(() => {
                this.showGuide(this.gameInfo.step);
                err.active = false;
                this.setCardStatus(CARD_STATUS.CAN_MOVE);
            })
        ))
    },

    setCardStatus (status) {
        this.gameInfo.cardStatus = status;
    },

    /**三卡合成现金 */
    combineCards () {
        const c1 = cc.find('Canvas/center/game/convey/t1');
        const c2 = cc.find('Canvas/center/game/convey/t2');
        const c3 = cc.find('Canvas/center/game/convey/t3');
        this.gameController.getAudioUtils().playEffect('merge', 0.7);
        [c1, c2, c3].forEach((each, index) => {
            each.runAction(cc.sequence(
                cc.spawn(cc.rotateTo(0.3, 180), cc.scaleTo(0.3, 0)),
                cc.callFunc(() => {
                    if (index === 2) {
                        this.showPPCard();
                    }
                })
            ));
        });
    },

    /**全部变成pp卡飞上去 */
    becomePPcards () {
        const oldboard1 = cc.find('Canvas/center/game/board1');
        const oldboard2 = cc.find('Canvas/center/game/board2');
        const board1 = cc.find('Canvas/center/UI/board1');
        const board2 = cc.find('Canvas/center/UI/board2');
        let paypal = cc.find('Canvas/center/UI/paypal');
        let paypalIcon = cc.find('Canvas/center/UI/paypal/topicon');
        let destPos = this.node.convertToNodeSpaceAR(paypal.convertToWorldSpaceAR(paypalIcon.position))
        let all = [];
        oldboard1.active = false;
        oldboard2.active = false;
        board1.active = true;
        board2.active = true;
        [board1, board2].forEach((board) => {
            board.children.forEach((col, index) => {
                all.push(...col.children);
            });
        });
        all.forEach((card, index) => {
            if (!card.active) return;
            card.runAction(cc.sequence(
                cc.spawn(cc.rotateTo(0.2, 180), cc.scaleTo(0.2, 0)),
                cc.callFunc(() => {
                    card.getComponent(cc.Sprite).spriteFrame = this.ppSprite;
                }),
                cc.spawn(cc.rotateTo(0.2, 360), cc.scaleTo(0.2, 1)),
                cc.repeat(cc.sequence(cc.rotateTo(0.2, 15), cc.rotateTo(0.2, -15)), 5)
            ));
        });
        setTimeout(() => {
            this.gameController.addCash(300);
            all.forEach((card, index) => {
                card.runAction(cc.sequence(
                    cc.delayTime(index*0.02),
                    cc.spawn(cc.moveTo(0.35, destPos), cc.scaleTo(0.35, 0.5)),
                    cc.fadeOut(0.1),
                    cc.callFunc(() => {
                        if (index === all.length - 1) {
                            this.gameController.addCash(100);
                            this.gameController.guideView.showCashOutHand();
                        }
                    })
                ));
            });
        }, 400);
    }

    //start () {},
    // update (dt) {},
});