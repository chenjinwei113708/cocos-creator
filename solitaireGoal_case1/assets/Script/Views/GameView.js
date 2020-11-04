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
    CARD_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        cardGet: cc.Node, // 卡 翻牌 拿牌
        cardBai: cc.SpriteFrame,
        cardGet8: cc.Node, // 卡 取卡处的8
        cardMove8: cc.Node, // 卡 移动的8
        cardMove10: cc.Node, // 卡 移动的10 9 8
        cardEnd8: cc.Node, // 卡 8的目标位置
        ppcard: cc.Node, // 现金卡
        guideHand: cc.Node, // 指引手
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 触碰点
        this.touch1 = cc.find('Canvas/center/game/touch/touch1');
        this.touch2 = cc.find('Canvas/center/game/touch/touch2');
        this.touch3 = cc.find('Canvas/center/game/touch/touch3');
        this.touch4 = cc.find('Canvas/center/game/touch/touch4');
        this.touch5 = cc.find('Canvas/center/game/touch/touch5');
        this.ten2eight = cc.find('Canvas/center/game/put/zu3').children.filter((item, index) => index>0);

        this.gameInfo = {
            step: 0, // 游戏进行到第几步
            cardStatus: CARD_STATUS.CAN_MOVE, // 卡片状态
            startTouch: this.touch1, // 触碰开始点
            endTouch: this.touch2, // 触碰结束点
            lastCheckTime: 0, // 移动判定延时 开始时间
            direcDelay: 60, // 移动判定延时 时间间隔
            nowMoveNode: null, // 现在移动的卡
            isPPCardShow: false, // 现金卡是否可见
            isGameStarted: false, // 游戏开始没
            guideTimeout: null, // 定时器
        };
        this.showPPCard();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.gameInfo.startTouch.position.x - this.gameInfo.startTouch.width/2 &&
                touchPos.x <= this.gameInfo.startTouch.position.x + this.gameInfo.startTouch.width/2 &&
                touchPos.y >= this.gameInfo.startTouch.position.y - this.gameInfo.startTouch.height/2 &&
                touchPos.y <= this.gameInfo.startTouch.position.y + this.gameInfo.startTouch.height/2) {
                    this.gameInfo.lastCheckTime = Date.now();
                    if (this.gameInfo.step === 0) {
                        this.hideGuide();
                        this.setCardRotate(this.cardGet, true, () => {
                            this.gameInfo.step++;
                            this.setTouchNode(this.gameInfo.step);
                            this.setCardStatus(CARD_STATUS.CAN_MOVE);
                            this.cardGet8.active = true;
                            this.cardGet.active = false;
                            this.showGuide(this.gameInfo.step);
                        });
                        this.setCardStatus(CARD_STATUS.DONE_MOVE);
                        return;
                    } else if (this.gameInfo.step === 1) {
                        this.cardMove8.active = true;
                        this.cardGet8.active = false;
                        this.gameInfo.nowMoveNode = this.cardMove8;
                    } else if (this.gameInfo.step === 2) {
                        this.cardMove10.active = true;
                        this.ten2eight.forEach(each => {each.active = false;});
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
    onTouchMove (touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            // let nowBrickType = this.gameInfo.currentBrickType;
            this.gameInfo.nowMoveNode.position = touchPos;
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
    onTouchEnd (touch) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            if (touchPos.x >= this.gameInfo.endTouch.position.x - this.gameInfo.endTouch.width/2 &&
                touchPos.x <= this.gameInfo.endTouch.position.x + this.gameInfo.endTouch.width/2 &&
                touchPos.y >= this.gameInfo.endTouch.position.y - this.gameInfo.endTouch.height/2 &&
                touchPos.y <= this.gameInfo.endTouch.position.y + this.gameInfo.endTouch.height/2) {
                
                // 放在结束点内
                if (this.gameInfo.step === 1) {
                    this.gameInfo.nowMoveNode.active = false;
                    this.cardEnd8.active = true;
                    this.cardGet8.active = false;
                    this.gameInfo.step++;
                    this.setTouchNode(this.gameInfo.step);
                    this.setCardStatus(CARD_STATUS.CAN_MOVE);
                    this.hideGuide();
                    this.gameInfo.guideTimeout = setTimeout(() => {
                        this.showGuide(this.gameInfo.step);
                    }, 1000);
                } else if (this.gameInfo.step === 2) {
                    const zu7 = cc.find('Canvas/center/game/put/zu7');
                    const fanCard = cc.find('Canvas/center/game/put/zu3').children[0];
                    this.gameInfo.nowMoveNode.active = false;
                    this.ten2eight.forEach((each,index) => {
                        each.parent = zu7;
                        each.position = cc.v2(0, (index+3)*-32);
                        each.active = true;
                    });
                    this.setCardRotate(fanCard, false, () => {
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
            if (this.gameInfo.step === 1) {
                this.gameInfo.nowMoveNode.active = false;
                this.gameInfo.nowMoveNode.position = cc.v2(this.cardGet8.position.x, this.cardGet8.position.y);
                this.cardGet8.active = true;
            } else if (this.gameInfo.step === 2) {
                this.gameInfo.nowMoveNode.active = false;
                this.gameInfo.nowMoveNode.position = cc.v2(-76.576, -154.53);
                this.ten2eight.forEach(each => {each.active = true;});
            }
            this.setCardStatus(CARD_STATUS.CAN_MOVE);
        }
    },

    /**设置触碰点位置
     * @param {number} step 游戏进行到第几步
     */
    setTouchNode (step) {
        if (step === 0) {
            this.gameInfo.startTouch = this.touch1;
            this.gameInfo.endTouch = null;
        } else if (step === 1) {
            this.gameInfo.startTouch = this.touch2;
            this.gameInfo.endTouch = this.touch3;
        } else if (step === 2) {
            this.gameInfo.startTouch = this.touch4;
            this.gameInfo.endTouch = this.touch5;
        }
    },

    /**展示开场现金卡 */
    showPPCard (num) {
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
                // this.gameController.getAudioUtils().playEffect('moneyCard', 0.4);
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
    
    /**点击pp现金卡 */
    clickPPCard () {
        if (!this.gameInfo.isPPCardShow) return;
        this.gameInfo.isPPCardShow = false;
        // let num = this.gameInfo.ppcardNum;
        let ppcard = this.ppcard;
        ppcard.active = false;
        // this.gameInfo.isFishing = false;
        // this.gameController.getAudioUtils().playEffect('income', 0.4);
        
        this.gameController.addCash(100);
        // this.gameInfo.getCashTimes++;
        if (this.gameController.cashView.targetCash >= 200) {
            // this.gameController.getAudioUtils().playEffect('cheer', 0.4);
            // this.offTouchListener();
            // this.enabled = false;
            // this.gameController.guideView.showCashOutHand();
            // let noticash = cc.find('Canvas/center/UI/tankuang/cash');
            // let congratcash = cc.find('Canvas/center/UI/congrat/cash');
            // noticash.getComponent(cc.Label).string = `$${this.gameController.cashView.targetCash}`;
            // congratcash.getComponent(cc.Label).string = `${this.gameController.cashView.targetCash}`;
        }
        if (!this.gameInfo.isGameStarted) {
            this.showGuide(this.gameInfo.step);
        }
        // if (this.gameInfo.fishTimes === 1) {
        //     this.gameHand.runAction(cc.sequence(
        //         cc.fadeOut(0.2),
        //         cc.callFunc(() => {
        //             this.gameHand.active = false;
        //         })
        //     ));
        // }
        
    },

    /**展示提示
     * @param {number} step 步数
     */
    showGuide (step) {
        if (step === 0) {
            this.gameInfo.isGameStarted = true;
            let mask = cc.find('Canvas/center/game/mask');
            mask.opacity = 0;
            mask.active = true;
            mask.runAction(cc.sequence(
                cc.fadeTo(0.3, 100),
                cc.callFunc(() => {
                    this.setTouchNode(this.gameInfo.step);
                    this.setTouchListener();
                })
            ));
            this.guideHand.opacity = 0;
            this.guideHand.active = true;
            this.guideHand.runAction(cc.sequence(
                cc.fadeIn(0.3),
                cc.callFunc(() => {
                    this.guideHand.getComponent(cc.Animation).play('shake');
                })
            ));
        } else if (step === 1) {
            this.guideHand.opacity = 0;
            this.guideHand.active = true;
            this.guideHand.position = cc.v2(144.253, -27.848);
            this.guideHand.getComponent(cc.Animation).play('guide1');
        } else if (step === 2) {
            this.guideHand.opacity = 0;
            this.guideHand.active = true;
            this.guideHand.position = cc.v2(-79.92, -129.918);
            this.guideHand.getComponent(cc.Animation).play('guide2');
        }
    },

    /**隐藏指引 */
    hideGuide () {
        if (this.gameInfo.guideTimeout) {
            clearTimeout(this.gameInfo.guideTimeout);
        }
        let mask = cc.find('Canvas/center/game/mask');
        mask.active = false;
        this.guideHand.getComponent(cc.Animation).stop();
        this.guideHand.active = false;
        // console.log('hide');
    },

    /**让卡片旋转
     * @param {cc.Node} cardNode 需要旋转的卡
     * @param {boolean} needMove 是否需要移动
     * @param {function} callback 回调
     */
    setCardRotate (cardNode, needMove = false, callback) {
        const speed = 30;
        const xuanzhuan = 10;
        let angle = 0;
        let unit = xuanzhuan;
        cardNode.is3DNode = true;
        // console.log('cardGet', cardNode);
        
        angle += unit;
        // cardNode.rotationY = angle;
        cardNode.eulerAngles = cc.v3(0, angle, 0);
        let inter = setInterval(() => {
            angle += unit;
            cardNode.eulerAngles = cc.v3(0, angle, 0);
            // cardNode.position = cc.v2(cardNode.position.x-5, cardNode.position.y);
            if (angle >= 90) {
                unit = 0-xuanzhuan;
                cardNode.getChildByName('num').active = true;
                cardNode.getChildByName('icon').active = true;
                cardNode.getChildByName('pic').active = true;
                cardNode.getComponent(cc.Sprite).spriteFrame = this.cardBai;
            } else if (angle <= 0) {
                callback && callback();
                inter && clearInterval(inter);
            }
        }, speed);
        needMove && cardNode.runAction(cc.moveTo(0.5, 152, 0));
    },

    setCardStatus (status) {
        this.gameInfo.cardStatus = status;
    },

    /**赢得游戏，卡片飞到结束区域 */
    flyAllCards () {
        const endnode = cc.find('Canvas/center/game/end');
        const endzone = endnode.children;
        const end1 = endzone[0];
        const end2 = endzone[1];
        const end3 = endzone[2];
        const end4 = endzone[3];
        const end = {end1, end2, end3, end4};
        // 标志，用来控制最后一张收上去的牌是k
        let mark = {
            end1: false,
            end2: false,
            end3: false,
            end4: false,
        };
        const putzone = cc.find('Canvas/center/game/put').children;
        putzone.forEach((zu, index) => {
            if (index === 3) return;
            // console.log('```zu', index, ' num: ',zu.children.length);
            zu.children.forEach((card, index2) => {
                let zulength = zu.children.length - 1;
                let nowcard = zu.children[zulength - index2];
                let endindex = 1+ Math.floor(Math.random()*4);
                if (index2 === (zulength)) {
                    if (index === 0) {endindex = 1};
                    if (index === 4) {endindex = 2};
                    if (index === 5) {endindex = 3};
                    if (index === 6) {endindex = 4};
                    // console.log('----start:', endindex);
                }
                let endcard = end[`end${endindex}`];
                let destPos = zu.convertToNodeSpaceAR(endnode.convertToWorldSpaceAR(endcard.position));
                nowcard.runAction(cc.sequence(
                    cc.delayTime(0.1*index2 + index * 0.1),
                    cc.moveTo(0.2, destPos),
                    cc.callFunc(() => {
                        if (!mark[`end${endindex}`]) {
                            // 如果k没归位，就替换成新牌的样式
                            endcard.getChildByName('num').getComponent(cc.Sprite).spriteFrame = nowcard.getChildByName('num').getComponent(cc.Sprite).spriteFrame;
                            endcard.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = nowcard.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
                            endcard.getChildByName('pic').getComponent(cc.Sprite).spriteFrame = nowcard.getChildByName('pic').getComponent(cc.Sprite).spriteFrame;
                        }
                        nowcard.opacity = 0;
                        // 记录k已经归位
                        if (index2 === (zulength) && (index === 0 || index ===4 || index === 5 || index === 6)) {
                            mark[`end${endindex}`] = true;
                            // console.log('-true:', endindex);
                        }
                        if (index === 6 && index2 === 5) {
                            // console.log('结束');
                        }
                    })
                ));
            });
        });
    },

    start () {},

    // update (dt) {},
});
