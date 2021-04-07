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
    GAME_LEVEL,
    CELL_TYPE,
    ACTION_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        paypal: cc.Node,
        gameMask: cc.Node,
        award: cc.Node,
        turnBox: cc.Node,
        cashout: cc.Node,
        moveHand: cc.Node, // 指引移动手
        awardHand: cc.Node, // 指引移动手
        pps: cc.Node, // pp图标
        touchStart: cc.Node, // 开始触碰点 可见
        touchStart1: cc.Node, // 开始触碰点区域1 不可见
        touchStart2: cc.Node, // 开始触碰点区域2 不可见
        touchMove: cc.Node, // 移动点
        touchEnd: cc.Node, // 放置点
        endCard1: cc.Node, // 放置点卡片1 下面那个
        endCard2: cc.Node, // 放置点卡片2 上面那个
        grid: cc.Node, // 格子
        card2Sprite: cc.SpriteFrame,
        card3Sprite: cc.SpriteFrame,
        card4Sprite: cc.SpriteFrame,
        card5Sprite: cc.SpriteFrame,
        card6Sprite: cc.SpriteFrame,
        card7Sprite: cc.SpriteFrame,
        cardStarSprite: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            nowLevel: GAME_LEVEL.LEVEL1,
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            checkDistance: 20, // 移动最少的距离
            canReceive: true, // pp卡可以收取吗
            startPos: cc.v2(42.994, -337.588), // 开始移动的坐标
            startTouch: null, // 开始触碰点
            endTouch: null, // 结束触碰点
            // nowTouch: null, // 上次点击的触碰点
            // nowTouchPos: null, // 上次点击的触碰点的位置
        };

        this.turnView = this.turnBox.getComponent('TurnView');

        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [], // 这一行是不用的
            [undefined, ...this.grid.getChildByName('line1').children],
            [undefined, ...this.grid.getChildByName('line2').children],
            [undefined, ...this.grid.getChildByName('line3').children],
            [undefined, ...this.grid.getChildByName('line4').children],
            [undefined, ...this.grid.getChildByName('line5').children],
            [undefined, ...this.grid.getChildByName('line6').children],
            [undefined, ...this.grid.getChildByName('line7').children],
        ];

        this.sprites = {
            [CELL_TYPE.C2]: this.card2Sprite,
            [CELL_TYPE.C3]: this.card3Sprite,
            [CELL_TYPE.C4]: this.card4Sprite,
            [CELL_TYPE.C5]: this.card5Sprite,
            [CELL_TYPE.C6]: this.card6Sprite,
            [CELL_TYPE.C7]: this.card7Sprite,
            [CELL_TYPE.CStar]: this.cardStarSprite,
        }

        // 游戏总共几关
        this.gameLevels = [GAME_LEVEL.LEVEL1];

        // 这一关将要执行的动画
        this.actionList = [];

        // 每一关对应的动画
        this.actionLevel = [
            [
                // {type: ACTION_TYPE.SWITCH, start: cc.v2(4,2), end: cc.v2(3,2)},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,3), others: [cc.v2(3,4), cc.v2(4,4)],
                    newType: CELL_TYPE.C7},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,3), others: [
                    cc.v2(1,1), cc.v2(1,2), cc.v2(1,3), cc.v2(1,4),
                    cc.v2(2,1), cc.v2(2,2), cc.v2(2,3), cc.v2(2,4), cc.v2(2,5),
                    cc.v2(3,1), cc.v2(3,2), cc.v2(3,5), cc.v2(3,6),
                    cc.v2(4,1), cc.v2(4,2), cc.v2(4,3), cc.v2(4,5), cc.v2(4,6), cc.v2(4,7),
                    cc.v2(5,1), cc.v2(5,2), cc.v2(5,3), cc.v2(5,4), cc.v2(5,5), cc.v2(5,6),
                    cc.v2(6,1), cc.v2(6,2), cc.v2(6,3), cc.v2(6,4), cc.v2(6,5),
                    cc.v2(7,1), cc.v2(7,2), cc.v2(7,3), cc.v2(7,4)
                ], newType: CELL_TYPE.CStar},
            ],
        ];
    },

    start () {
        
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    changeToNextLevel () {
        if (this.actionLevel.length === 0){
            // this.gameController.getAudioUtils().playEffect('cheer', 0.7);
            // this.gameController.guideView.showCashOutHand();
            this.offTouchListener();
            // console.log('finished---');
            this.showGameAward();
            return;
        }

        this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];
        
        if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
            let nextList = this.actionLevel.splice(0, 1)[0];
            this.actionList.push(...nextList);
            this.doActions();
        }
    },

    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
        // console.log(' ***** setCellStatus cellStatus:', this.gameInfo.cellStatus);
    },

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
                        this.gameController.addCash(100);
                    }
                    if (index === this.pps.children.length-1) {
                        if (this.gameLevels.length > 0) {
                            this.setTouchListener();
                            this.showMoveHand();
                        } else {
                            this.showCashout();
                        }
                        
                        // console.log('finish');
                    }
                })
            ))
        });
        
    },

    hideGameMask () {
        this.gameMask.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.gameMask.active = false;
            })
        ));
    },

    setTouchListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, function ( event) {
        //     console.log('click, move');
        //     // this.actSwitch(cc.v2(4,2), cc.v2(3,2));
        //     this.doActions();
        // }, this);
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
        // console.log('onTouchStart');
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            // console.log('onTouchStart, ', this.gameInfo.nowLevel);
            let isStart = false;
            if (touchPos.x >= this.touchStart1.position.x - this.touchStart1.width/2 &&
            touchPos.x <= this.touchStart1.position.x + this.touchStart1.width/2 &&
            touchPos.y >= this.touchStart1.position.y - this.touchStart1.height/2 &&
            touchPos.y <= this.touchStart1.position.y + this.touchStart1.height/2) {
                isStart = true;
            } else if (touchPos.x >= this.touchStart2.position.x - this.touchStart2.width/2 &&
            touchPos.x <= this.touchStart2.position.x + this.touchStart2.width/2 &&
            touchPos.y >= this.touchStart2.position.y - this.touchStart2.height/2 &&
            touchPos.y <= this.touchStart2.position.y + this.touchStart2.height/2) {
                isStart = true;
            }
            if (isStart) {
                this.setCellStatus(CELL_STATUS.IS_MOVE);
                this.touchStart.active = false;
                this.touchMove.position = cc.v2(this.touchStart.position.x, this.touchStart.position.y);
                this.touchMove.active = true;
                this.gameInfo.lastCheckTime = Date.now();
            }
        }
        
    },
    onTouchMove (touch) {
        // return;
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            this.touchMove.position = cc.v2(touchPos.x, touchPos.y+80);
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+80);
            // console.log('end touchPos,', touchPos);
            // console.log('end touchEnd,', this.touchEnd.position);
            if (touchPos.x >= this.touchEnd.position.x - this.touchEnd.width/2 &&
            touchPos.x <= this.touchEnd.position.x + this.touchEnd.width/2 &&
            touchPos.y >= this.touchEnd.position.y - this.touchEnd.height/2 &&
            touchPos.y <= this.touchEnd.position.y + this.touchEnd.height/2) {
                // console.log('put');
                this.hideMoveHand();
                this.touchMove.active = false;
                this.endCard1.active = true;
                this.endCard2.active = true;
                this.endCard1.opacity = 255;
                this.endCard2.opacity = 255;
                this.endCard1.getComponent(cc.Sprite).spriteFrame = this.touchMove.children[0].getComponent(cc.Sprite).spriteFrame;
                this.endCard2.getComponent(cc.Sprite).spriteFrame = this.touchMove.children[0].getComponent(cc.Sprite).spriteFrame;
                this.setCellStatus(CELL_STATUS.DONE_MOVE);
                this.changeToNextLevel();
            } else {
                this.touchStart.active = true;
                this.touchMove.active = false;
                this.setCellStatus(CELL_STATUS.CAN_MOVE);
            }
            
        }
    },

    /**执行动作序列 */
    doActions () {
        // this.hideGuide();
        if (this.actionList.length > 0) {
            let action = this.actionList.splice(0, 1)[0];
            switch (action.type) {
                case ACTION_TYPE.SWITCH:
                    this.actSwitch(action.start, action.end);
                    break;
                case ACTION_TYPE.COMBINE:
                    if (action.list) {
                        action.list.forEach((each, index) => {
                            let isMulti = true;
                            if (index >= action.list.length-1) {isMulti = false;}
                            this.actCombine(each.center, each.others, each.newType, isMulti);
                        })
                    } else {
                        this.actCombine(action.center, action.others, action.newType);
                    }
                    break;
                case ACTION_TYPE.CHANGE:
                    // this.gameController.getAudioUtils().playEffect('change', 0.5);
                    // this.showCool();
                    this.actChange(action.center, action.newType);
                    break;
                case ACTION_TYPE.BOMB:
                    // this.showBombAnim();
                    this.actBomb();
                    break;
                case ACTION_TYPE.DOWN:
                    action.nodes.forEach((item, index) => {
                        let done = false;
                        if (index >= action.nodes.length-1) {done = true;}
                        setTimeout(() => {
                            this.actDown(item.start, item.end, item.newType, done);
                        }, index*30);
                    });
                    
                    break;
                case ACTION_TYPE.SHOW:
                    action.nodes.forEach((item, index) => {
                        let done = false;
                        if (index >= action.nodes.length-1) {done = true;}
                        setTimeout(() => {
                            this.actShow(item.start, item.end, item.newType, done);
                        }, index*30);
                    });
                    break;
                default: break;
            }
        } else {
            this.changeToNextLevel();
            // this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    /**动作：合并
     * @ param {cc.v2} center 中心合并位置坐标
     * @ param {[cc.v2]} other 其他点的位置坐标 数组
     * @ param {string} newType 需要合成什么类型
     * @ param {boolean} isMulti 是否同时合成多个
     */
    actCombine (center, others, newType, isMulti=false) {
        let centerNode = this.cells[center.x][center.y];
        if (!centerNode) return;
        let centerPos = cc.v2(centerNode.position.x, centerNode.position.y);
        let otherNodes = others.map(other => {return this.cells[other.x][other.y];});
        const moveTime = 0.2;
        let originPos = [];
        otherNodes.forEach((other, index) => {
            originPos[index] = cc.v2(other.position.x, other.position.y);
            other.runAction(cc.sequence(
                cc.moveTo(moveTime, centerPos).easing(cc.easeIn(1.2)),
                cc.callFunc(() => {
                    
                    if (index === otherNodes.length-1) {
                        this.gameController.getAudioUtils().playEffect('combine', 0.8);
                        centerNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                        centerNode.runAction(cc.sequence(
                            cc.scaleTo(0.2, 1.15),
                            cc.scaleTo(0.2, 1),
                            cc.callFunc(() => {
                                // centerNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                                if (newType === CELL_TYPE.CPP) {
                                    // this.showFlyCards(7);
                                    // this.addPPcardLight(centerNode);
                                    // this.gameController.addCash(100);
                                    // centerNode.getChildByName('light').active = true;
                                    // centerNode.getChildByName('cppIcon').active = true;
                                } else {
                                    // centerNode.getChildByName('light').active = false;
                                    // centerNode.getChildByName('cppIcon').active = false;
                                }
                                // this.showCombo();
                            }),
                            // cc.repeat(cc.sequence(cc.rotateTo(0.1, 15), cc.rotateTo(0.1, -15)), 3),
                            // cc.rotateTo(0.1, 0),
                            // cc.scaleTo(0.05, 1),
                            cc.callFunc(() => {
                                if (!isMulti) {
                                    setTimeout(() => {
                                        this.doActions();
                                    }, 100);
                                    
                                }
                            })
                        ))
                    }
                    other.opacity = 0;
                    other.scale = 1;
                    other.position = originPos[index];
                    // other.opacity = 0;
                    // other.runAction(cc.sequence(
                    //     cc.delayTime(0.1*index),
                    //     cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 0.4), cc.moveBy(0.2, 0, 150)),
                    //     cc.callFunc(() => {
                    //         other.opacity = 0;
                    //         other.scale = 1;
                    //         other.position = originPos[index];
                    //     })
                    // ));
                })
            ));
        });
    },

    showGameAward () {
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
        this.gameMask.opacity = 0;
        this.gameMask.active = true;
        this.gameMask.runAction(cc.fadeTo(0.3, 130));
        this.award.scale = 0;
        this.award.active = true;
        this.award.runAction(cc.scaleTo(0.4, 1).easing(cc.easeIn(1.5)));
        this.turnView.isGameReceive = true;
        this.gameController.guideView.myFadeIn(this.awardHand, () => {
            this.gameController.guideView.myClickHere(this.awardHand);
        });
    },

    receiveGameAward () {
        if (!this.gameInfo.canReceive) return;
        this.gameInfo.canReceive = false;
        this.hideGameMask();;
        this.award.runAction(cc.scaleTo(0.3, 0).easing(cc.easeIn(1.5)));
        this.showPPFly();
        this.awardHand.stopMyAnimation && this.awardHand.stopMyAnimation();
    },

    showCashout () {
        let oriPos = cc.v2(this.cashout.position.x, this.cashout.position.y);
        this.cashout.position = cc.v2(oriPos.x-this.cashout.width, oriPos.y);
        this.cashout.active = true;
        this.cashout.opacity= 0;
        this.gameController.getAudioUtils().playEffect('cheer', 0.6);
        this.cashout.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.5), cc.moveBy(0.5, this.cashout.width, 0)).easing(cc.easeIn(1.5)),
            cc.callFunc(() => {
                this.gameController.endGame();
                this.cashout.getComponent(cc.Animation).play();
                this.gameController.guideView.showCashOutHand();
            })
        ));
    },

    showMoveHand () {
        this.moveHand.getComponent(cc.Animation).play();
    },

    hideMoveHand () {
        this.moveHand.getComponent(cc.Animation).stop();
        this.moveHand.runAction(cc.fadeOut(0.3));
    },
    // update (dt) {},
});
