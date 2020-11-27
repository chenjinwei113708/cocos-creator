import {
    CARD_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        ppcardSprite: cc.SpriteFrame, // 现金卡图片
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
        console.log('onTouchStart');
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            console.log('onTouchStart canmove');
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.gameInfo.startTouch.position.x - this.gameInfo.startTouch.width / 2 &&
                touchPos.x <= this.gameInfo.startTouch.position.x + this.gameInfo.startTouch.width / 2 &&
                touchPos.y >= this.gameInfo.startTouch.position.y - this.gameInfo.startTouch.height / 2 &&
                touchPos.y <= this.gameInfo.startTouch.position.y + this.gameInfo.startTouch.height / 2) {
                this.gameInfo.lastCheckTime = Date.now();
                if (this.gameInfo.step === 0) {
                    this.hideGuide(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.IS_MOVE);
                    this.gameInfo.startCard = this.startCard1;
                    this.gameInfo.endCard = this.endCard1;
                    this.move.position = cc.v2(this.startCard1.position.x, this.startCard1.position.y);
                    this.move.active = true;
                    this.startCard1.active = false;
                    return;
                } else if (this.gameInfo.step === 1) {
                    this.cardMove8.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.nowMoveNode = this.cardMove8;
                } else if (this.gameInfo.step === 2) {
                    this.hideGuide();
                    this.gameController.getAudioUtils().playEffect('card', 0.6);
                    // 把牌换数字，翻成背面
                    this.cardGet8.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('num').getComponent(cc.Sprite).spriteFrame;
                    this.cardGet8.getChildByName('num').color = new cc.Color(255, 0, 0);
                    this.cardGet8.getChildByName('num').active = false;
                    this.cardGet8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
                    this.cardGet8.getChildByName('icon').active = false;
                    this.cardGet8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('pic').getComponent(cc.Sprite).spriteFrame;
                    this.cardGet8.getChildByName('pic').active = false;
                    this.cardGet8.getComponent(cc.Sprite).spriteFrame = this.cardBack;
                    this.cardGet8.position = cc.v2(this.cardGet.position.x, this.cardGet.position.y);
                    this.cardGet8.active = true;
                    // 旋转卡
                    this.setCardRotate(this.cardGet8, true, () => {
                        this.gameInfo.step++;
                        this.setTouchNode(this.gameInfo.step);
                        // 把移动的卡换数字
                        this.cardMove8.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('num').getComponent(cc.Sprite).spriteFrame;
                        this.cardMove8.getChildByName('num').color = new cc.Color(255, 0, 0);
                        this.cardMove8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
                        this.cardMove8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame = this.cardEnd6.getChildByName('pic').getComponent(cc.Sprite).spriteFrame;
                        this.setCardStatus(CARD_STATUS.CAN_MOVE);
                        this.showGuide(this.gameInfo.step);
                    });
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    return;
                } else if (this.gameInfo.step === 3) {
                    this.cardMove8.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.nowMoveNode = this.cardMove8;
                    // this.cardMove10.active = true;
                    // this.ten2eight.forEach(each => {each.active = false;});
                    // this.gameInfo.nowMoveNode = this.cardMove10;
                } else if (this.gameInfo.step === 4) {
                    this.hideGuide();
                    this.gameController.getAudioUtils().playEffect('card', 0.6);
                    // 把牌换数字，翻成背面
                    this.cardGet8.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('num').getComponent(cc.Sprite).spriteFrame;
                    this.cardGet8.getChildByName('num').color = new cc.Color(0, 0, 0);
                    // this.cardGet8.getChildByName('num').active = false;
                    this.cardGet8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
                    // this.cardGet8.getChildByName('icon').active = false;
                    this.cardGet8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame;
                    // this.cardGet8.getChildByName('pic').active = false;
                    // this.cardGet8.position = cc.v2(this.cardGet.position.x, this.cardGet.position.y);
                    this.cardGet8.active = false;
                    // 旋转卡
                    this.setCardRotate(this.cardGet, true, () => {
                        this.gameInfo.step++;
                        this.setTouchNode(this.gameInfo.step);
                        // 把移动的卡换数字
                        this.cardMove8.getChildByName('num').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('num').getComponent(cc.Sprite).spriteFrame;
                        this.cardMove8.getChildByName('num').color = new cc.Color(0, 0, 0);
                        this.cardMove8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
                        this.cardMove8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame = this.cardEnd8.getChildByName('pic').getComponent(cc.Sprite).spriteFrame;
                        // 隐藏被翻的卡
                        this.cardGet8.active = true;
                        this.cardGet.active = false;
                        this.setCardStatus(CARD_STATUS.CAN_MOVE);
                        this.showGuide(this.gameInfo.step);
                    });
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    return;
                } else if (this.gameInfo.step === 5) {
                    this.cardMove8.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.nowMoveNode = this.cardMove8;
                    // this.cardMove10.active = true;
                    // this.ten2eight.forEach(each => {each.active = false;});
                    // this.gameInfo.nowMoveNode = this.cardMove10;
                } else if (this.gameInfo.step === 6) {
                    this.cardMove10.active = true;
                    this.ten2eight.forEach(each => {
                        each.active = false;
                    });
                    this.gameInfo.nowMoveNode = this.cardMove10;
                }
                // console.log('触碰---');
                // let nowBrickType = this.gameInfo.currentBrickType;
                // this.gameInfo.currentBrick = this[nowBrickType];
                // this.gameInfo.currentBrick.scale = this.gameInfo.bigger;
                // this.gameInfo.nowTouchPos = touchPos;
                this.setCardStatus(CARD_STATUS.IS_MOVE);
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
                if (this.gameInfo.step === 0) {
                    this.gameInfo.isCardDone1 = true;
                    // this.gameController.getAudioUtils().playEffect('card', 0.6);
                    this.hideGuide(this.gameInfo.step);
                    this.move.active = false;
                    this.gameInfo.endCard.active = true;
                    this.gameInfo.step++;
                    // 重置触碰区域
                    this.gameInfo.startTouch = this.startCard2;
                    this.gameInfo.endTouch = this.endCard2;
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    this.showGuide(this.gameInfo.step);
                } else if (this.gameInfo.step === 3) {
                    this.gameController.getAudioUtils().playEffect('card', 0.6);
                    this.gameInfo.nowMoveNode.active = false;
                    this.gameInfo.nowMoveNode.position = cc.v2(this.cardGet8.position.x, this.cardGet8.position.y);
                    this.cardEnd6.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.step++;
                    this.setTouchNode(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.CAN_MOVE);
                    this.hideGuide();
                    this.showGuide(this.gameInfo.step);

                } else if (this.gameInfo.step === 5) {
                    this.gameController.getAudioUtils().playEffect('card', 0.6);
                    this.gameInfo.nowMoveNode.active = false;
                    this.gameInfo.nowMoveNode.position = cc.v2(this.cardGet8.position.x, this.cardGet8.position.y);
                    this.cardEnd8.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.step++;
                    this.setTouchNode(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.CAN_MOVE);
                    this.hideGuide();
                    this.showGuide(this.gameInfo.step);
                    // this.gameInfo.guideTimeout = setTimeout(() => {
                    //     this.showGuide(this.gameInfo.step);
                    // }, 1000);
                } else if (this.gameInfo.step === 6) {
                    this.gameController.getAudioUtils().playEffect('card', 0.6);
                    const zu7 = cc.find('Canvas/center/game/put/zu7');
                    const fanCard = cc.find('Canvas/center/game/put/zu3').children[0];
                    this.gameInfo.nowMoveNode.active = false;
                    this.ten2eight.forEach((each, index) => {
                        each.parent = zu7;
                        each.position = cc.v2(0, (index + 3) * -32);
                        each.active = true;
                    });
                    this.setCardRotate(fanCard, false, () => {
                        this.gameController.getAudioUtils().playEffect('win', 0.6);
                        this.flyAllCards();
                    });
                    // this.cardEnd8.active = true;
                    // this.cardGet8.active = false;
                    this.gameInfo.step++;
                    // this.setTouchNode(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    this.hideGuide();
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
        this.setTouchListener();
    },


    /**展示开场现金卡 */
    showPPCard(num) {
        if (this.gameInfo.isPPCardShow) return;
        this.gameInfo.isPPCardShow = true;
        num = Number(num);
        let ppcard = this.ppcard;
        let pphand = this.ppcard.getChildByName('hand');
        ppcard.opacity = 0;
        ppcard.active = true;
        ppcard.scale = 0.1;
        pphand.opacity = 0;
        pphand.active = true;
        ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1.1)),
            cc.scaleTo(0.1, 0.9),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.4);
                pphand.runAction(cc.sequence(
                    cc.fadeIn(0.6),
                    cc.callFunc(() => {
                        pphand.getComponent(cc.Animation).play();
                    })
                ));
            }),
            cc.fadeIn(0.3)
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
        }
    },

    showGuide (step = 1) {
        if (step === 1) {
            let arrow = cc.find('Canvas/center/game/touches/arrow');
            arrow.opacity = 0;
            arrow.active = true;
            arrow.runAction(cc.fadeIn(0.3));
        }
    },

    setCardStatus (status) {
        this.gameInfo.cardStatus = status;
    },

    //start () {},
    // update (dt) {},
});