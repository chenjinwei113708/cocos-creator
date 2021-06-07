import {
    GAME_LEVEL,
    CELL_TYPE,
    ACTION_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        ppcard: cc.Node, // 现金卡片
        box: cc.Node, // 棋盘
        paypal: cc.Node, // 顶部栏
        hand: cc.Node, // 指引手
        flyCards: cc.Node, // 奖励pp卡
        mask1: cc.Node, // 遮罩 旋转按钮
        mask2: cc.Node, // 遮罩 拖动放置
        touch0: cc.Node, // 触碰区域0 转盘
        touch1: cc.Node, // 触碰区域1 开始位置
        touch2: cc.Node, // 触碰区域2 放置位置
        moveBrick: cc.Node, // 移动方块
        waitBrick: cc.Node, // 转盘上的方块
        destBrick1: cc.Node, // 目标方块1 （1行,第2个）
        destBrick2: cc.Node, // 目标方块2 （1行，第3个）
        lightIcon: cc.Prefab, // 卡牌中的pp卡
        lightBg: cc.Prefab, // 卡牌中的背景光
        // 不同类型的图
        sprite5: cc.SpriteFrame,
        sprite10: cc.SpriteFrame,
        sprite20: cc.SpriteFrame,
        sprite50: cc.SpriteFrame,
        sprite100: cc.SpriteFrame,
        spritePP: cc.SpriteFrame,
        spritePPcard: cc.SpriteFrame,
        spritePPlight: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hintbox = cc.find('Canvas/center/game/hint/hintbox');
        this.gameInfo = {
            nowLevel: GAME_LEVEL.LEVEL1,
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            checkDistance: 20, // 移动最少的距离
            isPPcardReceived: false, // pp卡收取没有
            startPos: cc.v2(42.994, -337.588), // 开始移动的坐标
            startTouch: null, // 开始触碰点
            endTouch: null, // 结束触碰点
            // nowTouch: null, // 上次点击的触碰点
            // nowTouchPos: null, // 上次点击的触碰点的位置
        };

        // 游戏总共几关
        this.gameLevels = [GAME_LEVEL.LEVEL1, GAME_LEVEL.LEVEL2, GAME_LEVEL.LEVEL3, GAME_LEVEL.LEVEL4, GAME_LEVEL.LEVEL5]

        // 不同类型对应的图片
        this.sprites = {
            [CELL_TYPE.C5]: this.sprite5,
            [CELL_TYPE.C10]: this.sprite10,
            [CELL_TYPE.C20]: this.sprite20,
            [CELL_TYPE.C50]: this.sprite50,
            [CELL_TYPE.C100]: this.sprite100,
            [CELL_TYPE.CPP]: this.spritePP,
        };

        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [undefined, ...this.box.getChildByName('kong0').children], // 这一行是看不见的
            [undefined, ...this.box.getChildByName('kong1').children],
            [undefined, ...this.box.getChildByName('kong2').children],
            [undefined, ...this.box.getChildByName('kong3').children],
            [undefined, ...this.box.getChildByName('kong4').children],
            [undefined, ...this.box.getChildByName('kong5').children],
        ];

        // 这一关将要执行的动画
        this.actionList = [];

        // 每一关对应的动画
        this.actionLevel = [
            [
                // {type: ACTION_TYPE.SWITCH, start: cc.v2(4,2), end: cc.v2(3,2)},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(1,3), others: [cc.v2(1,4), cc.v2(1,5)],
                    newType: CELL_TYPE.C100},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(1,3), others: [cc.v2(2,3), cc.v2(3,3)],
                    newType: CELL_TYPE.CPP},
            ],
            [
                {type: ACTION_TYPE.CHANGE, center: cc.v2(1,3), newType: CELL_TYPE.CPP},
                {type: ACTION_TYPE.SHOW, nodes: [
                    {start: cc.v2(0,1), end: cc.v2(5,1), newType: CELL_TYPE.C100},
                    // {start: cc.v2(0,1), end: cc.v2(5,2), newType: CELL_TYPE.C200},
                    // {start: cc.v2(0,1), end: cc.v2(5,3), newType: CELL_TYPE.C200},
                    // {start: cc.v2(0,1), end: cc.v2(5,4), newType: CELL_TYPE.C200},
                    // {start: cc.v2(0,1), end: cc.v2(5,5), newType: CELL_TYPE.C10},

                    // {start: cc.v2(0,1), end: cc.v2(4,1), newType: CELL_TYPE.C200},
                    {start: cc.v2(0,1), end: cc.v2(4,2), newType: CELL_TYPE.C100},
                    {start: cc.v2(0,1), end: cc.v2(4,3), newType: CELL_TYPE.C20},
                    // {start: cc.v2(0,1), end: cc.v2(4,4), newType: CELL_TYPE.C100},
                    {start: cc.v2(0,1), end: cc.v2(4,5), newType: CELL_TYPE.C10},

                    {start: cc.v2(0,1), end: cc.v2(3,1), newType: CELL_TYPE.C10},
                    {start: cc.v2(0,1), end: cc.v2(3,2), newType: CELL_TYPE.C20},
                    // {start: cc.v2(0,1), end: cc.v2(3,3), newType: CELL_TYPE.C200},
                    // {start: cc.v2(0,1), end: cc.v2(3,4), newType: CELL_TYPE.C50},
                    // {start: cc.v2(0,1), end: cc.v2(3,5), newType: CELL_TYPE.C10},

                    {start: cc.v2(0,1), end: cc.v2(2,1), newType: CELL_TYPE.C10},
                    // {start: cc.v2(0,1), end: cc.v2(2,2), newType: CELL_TYPE.C50},
                    {start: cc.v2(0,1), end: cc.v2(2,3), newType: CELL_TYPE.C20},
                    // {start: cc.v2(0,1), end: cc.v2(2,4), newType: CELL_TYPE.C200},
                    {start: cc.v2(0,1), end: cc.v2(2,5), newType: CELL_TYPE.C10},

                    // {start: cc.v2(0,1), end: cc.v2(1,1), newType: CELL_TYPE.C10},
                    {start: cc.v2(0,1), end: cc.v2(1,2), newType: CELL_TYPE.C100},
                    {start: cc.v2(0,1), end: cc.v2(1,3), newType: CELL_TYPE.C20},
                    // {start: cc.v2(0,1), end: cc.v2(1,4), newType: CELL_TYPE.C50},
                    {start: cc.v2(0,1), end: cc.v2(1,5), newType: CELL_TYPE.C5},
                    ]
                },
            ],
        ];

        this.changeToNextLevel();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    changeToNextLevel () {
        if (this.actionLevel.length === 0){
            this.gameController.getAudioUtils().playEffect('cheer', 0.7);
            this.gameController.guideView.showCashOutHand();
            this.offTouchListener();
            return;
        }

        this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];
        
        if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
            // this.showPPcard(true);
            this.changeToNextLevel();
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
            // this.showMask(1);
            // this.gameInfo.startTouch = this.touch0;
            // this.gameInfo.endTouch = this.touch2;
            this.setTouchListener();
            this.changeToNextLevel();
            // this.doActions();
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL3) {
            this.setCellStatus(CELL_STATUS.DONE_MOVE);
            this.showMask(2);
            this.gameInfo.startTouch = this.touch1;
            this.gameInfo.endTouch = this.touch2;
            let nextList = this.actionLevel.splice(0, 1)[0];
            this.actionList.push(...nextList);
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL4) {
            this.showPPcard(false);
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL5) {
            let nextList = this.actionLevel.splice(0, 1)[0];
            this.actionList.push(...nextList);
            this.doActions();
        }
    },

    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
        // console.log(' ***** setCellStatus cellStatus:', this.gameInfo.cellStatus);
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
            if (touchPos.x >= this.gameInfo.startTouch.position.x - this.gameInfo.startTouch.width/2 &&
                touchPos.x <= this.gameInfo.startTouch.position.x + this.gameInfo.startTouch.width/2 &&
                touchPos.y >= this.gameInfo.startTouch.position.y - this.gameInfo.startTouch.height/2 &&
                touchPos.y <= this.gameInfo.startTouch.position.y + this.gameInfo.startTouch.height/2) {
                    // console.log('onTouchStart right');
                    if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
                        // this.switchCards();
                    } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL3) {
                        this.gameController.getAudioUtils().playEffect('click', 1.1);
                        this.mask2.active = false;
                        this.hand.active = false;
                         // this.gameInfo.nowTouch = this.touch1;
                        this.gameInfo.lastCheckTime = Date.now();
                        // this.gameInfo.nowTouchPos = touchPos;
                        this.setCellStatus(CELL_STATUS.IS_MOVE);
                        // console.log('onTouchStart, doActions');
                        // this.doActions();
                        // this.offTouchListener();
                        this.moveBrick.active = true;
                        this.moveBrick.position = cc.v2(this.gameInfo.startPos.x, this.gameInfo.startPos.y+80);
                        this.waitBrick.active = false;
                    }
            }
        }
        
    },
    onTouchMove (touch) {
        // return;
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            this.moveBrick.position = cc.v2(touchPos.x, touchPos.y+80);;
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL3) {
                let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
                touchPos = cc.v2(touchPos.x, touchPos.y+80);
                if (touchPos.x >= this.gameInfo.endTouch.position.x - this.gameInfo.endTouch.width/2 &&
                    touchPos.x <= this.gameInfo.endTouch.position.x + this.gameInfo.endTouch.width/2 &&
                    touchPos.y >= this.gameInfo.endTouch.position.y - this.gameInfo.endTouch.height/2 &&
                    touchPos.y <= this.gameInfo.endTouch.position.y + this.gameInfo.endTouch.height/2) {
                    
                    this.destBrick1.active = true;
                    this.destBrick2.active = true;
                    this.moveBrick.active = false;
                    this.setCellStatus(CELL_STATUS.DONE_MOVE);
                    this.mask1.active = false;
                    this.hand.getComponent(cc.Animation).stop();
                    this.hand.active = false;
                    this.hintbox.getComponent(cc.Animation).stop();
                    this.hintbox.active = false;
                    this.doActions();
                } else {
                    this.moveBrick.active = false;
                    this.waitBrick.active = true;
                    this.setCellStatus(CELL_STATUS.CAN_MOVE);
                }
            }
            
            
        }
    },


    /**
     * 展示pp卡
     * @param {*} isAutoGet 是否自动收取金币，不需要用户点击
     */
    showPPcard (isAutoGet = false) {
        this.gameInfo.isPPcardReceived = false;
        this.ppcard.opacity = 0;
        this.ppcard.scale = 0;
        this.ppcard.active = true;
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.3, 1)),
            cc.callFunc(() => {
                if (isAutoGet) {
                    if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
                        let anim = this.ppcard.getComponent(cc.Animation).play();
                        anim.on('finished', () => {
                            if (this.gameInfo.isPPcardReceived) return;
                            this.receivePPcard();
                        });
                    } else {
                        setTimeout(() => {this.receivePPcard();}, 500);
                    }
                } else {
                    let anim = this.ppcard.getComponent(cc.Animation).play();
                    anim.on('finished', () => {
                        if (this.gameInfo.isPPcardReceived) return;
                        let hand = this.hand;
                        hand.opacity = 0;
                        hand.active = true;
                        hand.position = cc.v2(154.978, -64.918);
                        hand.runAction(cc.fadeIn(0.2));
                        hand.getComponent(cc.Animation).play();
                    });
                }
                
            })
        ));
    },

    receivePPcard () {
        if (this.gameInfo.isPPcardReceived) return;
        this.gameInfo.isPPcardReceived = true;
        this.gameController.addCash(100);
        this.gameController.getAudioUtils().playEffect('coin', 0.5);
        this.hand.getComponent(cc.Animation).stop();
        this.hand.active = false;
        this.ppcard.getComponent(cc.Animation).stop();
        this.gameController.download();
        return;

        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 0)),
            cc.callFunc(()=>{
                this.ppcard.active = false;
                if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
                    this.switchCards();
                } else {
                    this.changeToNextLevel();
                }
            })
        ));
        
    },

    showMask (num=2) {
        let mask = this[`mask${num}`];
        // let handPos = 
        mask.opacity = 0;
        mask.active = true;
        mask.runAction(cc.sequence(
            cc.fadeTo(0.6, 190),
            cc.callFunc(() => {
                let hand = this.hand;
                hand.opacity = 0;
                hand.active = true;
                hand.position = cc.v2(73.14, -351.175);
                if (num === 1) {
                    hand.runAction(cc.fadeIn(0.2));
                    hand.getComponent(cc.Animation).play('shake');
                } else if (num === 2) {
                    let hintbox = this.hintbox;
                    hintbox.opacity = 0;
                    hintbox.active = true;
                    hintbox.runAction(cc.sequence(
                        cc.fadeIn(0.3),
                        cc.callFunc(() => {
                            hintbox.getComponent(cc.Animation).play();
                        })
                    ));
                    hand.getComponent(cc.Animation).play('drag');
                    this.setCellStatus(CELL_STATUS.CAN_MOVE);
                }
                
            })
        ));
    },

    /**交换转盘上面的卡 */
    switchCards () {
        if ((this.gameInfo.nowLevel !== GAME_LEVEL.LEVEL2 && this.gameInfo.nowLevel !== GAME_LEVEL.LEVEL1) ||
            this.gameInfo.cellStatus !== CELL_STATUS.CAN_MOVE)
            return;
        // console.log(' +++ switch cards cellstatus: ', this.gameInfo.cellStatus);
        this.setCellStatus(CELL_STATUS.IS_MOVE);
        let c50 = cc.find('Canvas/center/game/zhuan/c50');
        let c20 = cc.find('Canvas/center/game/zhuan/c50/c20');
        this.mask1.active = false;
        this.hand.getComponent(cc.Animation).stop();
        this.hand.active = false;
        // c50.runAction(cc.sequence(
        //     cc.moveTo(0.2, cc.v2(42.994, -1)),
        //     cc.callFunc(() => {
        //         this.setCellStatus(CELL_STATUS.CAN_MOVE);
        //         this.changeToNextLevel();
        //     })
        // ));
        // c20.runAction(cc.moveTo(0.2, cc.v2(-85.305, 0)));
        // this.gameController.getAudioUtils().playEffect('switch', 1.3);
        this.setCellStatus(CELL_STATUS.CAN_MOVE);
        this.changeToNextLevel();
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

    /**动作：交换节点
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} end 结束位置坐标
     */
    actSwitch (start, end) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        if (!startNode || !endNode) return;
        let startPos = cc.v2(startNode.position.x, startNode.position.y);
        let endPos = cc.v2(endNode.position.x, endNode.position.y);
        const moveTime = 0.15; 
        startNode.runAction(cc.moveTo(moveTime, endPos));
        endNode.runAction(cc.sequence(
            cc.moveTo(moveTime, startPos),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.cells[start.x][start.y] = endNode;
                this.cells[end.x][end.y] = startNode
                this.doActions();
            })
        ));
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
                cc.moveTo(moveTime, centerPos),
                cc.callFunc(() => {
                    
                    if (index === otherNodes.length-1) {
                        this.gameController.getAudioUtils().playEffect('combine', 0.8);
                        
                        centerNode.runAction(cc.sequence(
                            // cc.scaleTo(0.1, 1.15),
                            // cc.scaleTo(0.1, 0.5),
                            cc.callFunc(() => {
                                centerNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                                if (newType === CELL_TYPE.CPP) {
                                    this.showFlyCards(7);
                                    this.addPPcardLight(centerNode);
                                    // this.gameController.addCash(100);
                                    // centerNode.getChildByName('light').active = true;
                                    // centerNode.getChildByName('cppIcon').active = true;
                                } else {
                                    // centerNode.getChildByName('light').active = false;
                                    // centerNode.getChildByName('cppIcon').active = false;
                                }
                                // this.showCombo();
                            }),
                            cc.repeat(cc.sequence(cc.rotateTo(0.1, 15), cc.rotateTo(0.1, -15)), 3),
                            cc.rotateTo(0.1, 0),
                            // cc.scaleTo(0.05, 1),
                            cc.callFunc(() => {
                                if (!isMulti) {this.doActions();}
                            })
                        ))
                    }
                    other.opacity = 0;
                    other.runAction(cc.sequence(
                        cc.delayTime(0.1*index),
                        cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 0.4), cc.moveBy(0.2, 0, 150)),
                        cc.callFunc(() => {
                            other.opacity = 0;
                            other.scale = 1;
                            other.position = originPos[index];
                        })
                    ));
                })
            ));
        });
    },

    /**动作：下落
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} dest 结束位置坐标
     * @ param {string} newType:可选 当需要生成新方块的时候，需要这个参数。新方块的类型 
     * @ param {boolean} isDown:可选 当前下落是否全部下落完成
     */
    actDown (start, end, newType, isAllDown = false) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        if (!startNode || !endNode) return;
        let moveTime = 0.1 * (end.x - start.x);
        let endPos = cc.v2(endNode.position.x, endNode.position.y);
        if (newType) {
            endNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
        } else {
            endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(cc.Sprite).spriteFrame;
        }
        
        endNode.position = cc.v2(startNode.position.x, startNode.position.y);
        endNode.opacity = 255;
        startNode.opacity = 0; //
        endNode.runAction(cc.sequence(
            cc.moveTo(moveTime, endPos),
            cc.delayTime(0.1),
            cc.callFunc(() => {
                if (isAllDown) {
                    this.doActions();
                }
            })
        ));
    },

    /**动作：显示出来
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} dest 结束位置坐标
     * @ param {string} newType:可选 当需要生成新方块的时候，需要这个参数。新方块的类型 
     * @ param {boolean} isDown:可选 当前下落是否全部下落完成
     */
    actShow (start, end, newType, isAllDown = false) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        if (!startNode || !endNode) return;
        // let moveTime = 0.1 * (end.x - start.x);
        // let endPos = cc.v2(endNode.position.x, endNode.position.y);
        if (newType) {
            endNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
        } else {
            endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(cc.Sprite).spriteFrame;
        }
        
        // endNode.position = cc.v2(startNode.position.x, startNode.position.y);
        endNode.opacity = 0;
        endNode.scale = 0;
        // startNode.opacity = 0; //
        endNode.runAction(cc.sequence(
            // cc.moveTo(moveTime, endPos),
            cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1)),
            // cc.delayTime(0.1),
            cc.callFunc(() => {
                if (isAllDown) {
                    this.doActions();
                }
            })
        ));
    },

    /**动作：变换
     * @ param {cc.v2} center 中心位置坐标
     * @ param {string} newType 需要变成什么类型
     */
    actChange (center, newType) {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                if (i === center.x && j === center.y) { continue; }
                let node = this.cells[i][j];
                if (!node.active) {
                    node.opacity = 0;
                    node.active = true;
                }
                node.runAction(cc.sequence(
                    cc.scaleTo(0.1, 1.15),
                    cc.scaleTo(0.1, 0),
                    cc.callFunc(() => {
                        node.opacity = 255;
                        node.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                        if (newType === CELL_TYPE.CPP) {
                            this.addPPcardLight(node);
                            // node.getChildByName('light').active = true;
                            // node.getChildByName('cppIcon').active = true;
                        } else {
                            // node.getChildByName('light').active = false;
                            // node.getChildByName('cppIcon').active = false;
                        }
                        // this.showCombo();
                    }),
                    cc.scaleTo(0.05, 1),
                    cc.callFunc(() => {
                        if (i === 5 && j === 5) {
                            setTimeout(() => {
                                this.showLightning();
                            }, 300);
                            setTimeout(() => {
                                this.actBomb();
                            }, 450);
                            setTimeout(() => {
                                this.showFlyCards(7);
                                this.gameController.addCash(200);
                                this.gameController.getAudioUtils().playEffect('coin', 0.4);
                            }, 600);
                            setTimeout(() => {
                                this.doActions();
                            }, 1300);
                        }
                    })
                ));
            }
        }
    },

    /**动作：爆炸 */
    actBomb () {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                let node = this.cells[i][j];
                node.runAction(cc.sequence(
                    // cc.scaleTo(0.1, 1.15),
                    // cc.rotateTo(0.1, 10),
                    // cc.rotateTo(0.1, -10),
                    // cc.rotateTo(0.1, 10),
                    // cc.rotateTo(0.1, -10),
                    // cc.rotateTo(0.1, 5),
                    // cc.rotateTo(0.1, 0),
                    // cc.scaleTo(0.1, 0.9),
                    // cc.scaleTo(0.1, 1.2),
                    // cc.scaleTo(0.1, 0.8),
                    // cc.scaleTo(0.1, 1.1),
                    cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 0.1)),
                    cc.callFunc(() => {
                        node.children.forEach((each, index) => {
                            each.active = false;
                        });
                        node.scale = 1;
                    }),
                    cc.callFunc(() => {
                        if (i === 5 && j === 5) {
                            // this.showFlyCards(7);
                            // setTimeout(() => {this.gameController.addCash(500);}, 300);
                            // this.doActions();
                        }
                    })
                ));
            }
        }
    },

    /**展示pp卡飞上去 */
    showFlyCards (num = 5) {
        // this.gameController.getAudioUtils().playEffect('coin', 0.4);
        let cards = this.flyCards.children;
        let destPos = this.flyCards.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('icon').position));
        for (let i = 0; i < num; i++) {
            setTimeout(() => {
                let card = cards[i];
                let posy = -285+Math.random()*388;
                let posx = -194+Math.random()*388;
                let ang = -180+Math.random()*360;
                card.position = cc.v2(posx, posy);
                card.angle = ang;
                card.scale = 0.65;
                card.opacity = 0;
                card.active = true;
                // console.log('fly ', i, ' pos: ', card.position.x, card.position.y, ' destPos', destPos);
                card.runAction(cc.sequence(
                    cc.fadeIn(0.1),
                    cc.spawn(cc.rotateTo(0.6, 0), cc.moveTo(0.6, destPos)),
                    cc.fadeOut(0.15),
                    // cc.callFunc(() => {
                    //     if (i === num-1) {
                    //         this.setCellStatus(CELL_STATUS.CAN_MOVE);
                    //     }
                    // })
                ));
            }, i*60);
        }
    },

    /**增加会发光的pp卡 */
    addPPcardLight (parentNode) {
        const centerpos = cc.v2(0, 0);
        let bg = cc.instantiate(this.lightBg);
        bg.position = centerpos;
        bg.width = 83.8;
        bg.height = 87.8;
        bg.parent = parentNode;
        bg.active = true;
        let icon = cc.instantiate(this.lightIcon);
        icon.position = centerpos;
        icon.width = 70.3;
        icon.height = 79;
        icon.parent = parentNode;
        icon.active = true;
    },

    /**播放闪电动画 */
    showLightning () {
        this.gameController.getAudioUtils().playEffect('lightning', 1);
        let lightning = cc.find('Canvas/center/game/lightning');
        lightning.active = true;
        let animstate = lightning.getComponent(cc.Animation).play();
        animstate.on('finished', () => {
            lightning.active = false;
        });
    },
    // start () {},

    // update (dt) {},
});
