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
    CELL_STATUS,
    GRID_WIDTH,
    GRID_HEIGHT
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        box: cc.Node,
        boxbg: cc.Node,
        touchStartArea: cc.Node,
        spriteC1: cc.SpriteFrame,
        spriteC2: cc.SpriteFrame,
        spriteC3: cc.SpriteFrame,
        spriteC4: cc.SpriteFrame,
        spriteC5: cc.SpriteFrame,
        spriteC6: cc.SpriteFrame,
        spriteCPP: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    // 加载
    onLoad () {
        // 记录信息
        this.info = {
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 20, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            currentDices: [{relatPos: cc.v2(0,0), type: CELL_TYPE.C1}], // 现在的筛子组合
            nextDices: [{relatPos: cc.v2(0,-1), type: CELL_TYPE.C1}, {relatPos: cc.v2(0,0), type: CELL_TYPE.C1}], // 下一个筛子组合
            currentMove: null, // 当前移动的结点
            currentTurn: null, // 当前放在转盘的结点
            lastCanPutArr: null, // 上一次提示放置的位置,
            nowHoverPos: null, // 当前用户停留在什么棋盘坐标
            isFirstStep: true, // 是不是用户第一次操作
            guideTimeout: null, // 指引点击定时器
        };
        this.sprites = {
           [CELL_TYPE.C1]: this.spriteC1,
           [CELL_TYPE.C2]: this.spriteC2,
           [CELL_TYPE.C3]: this.spriteC3,
           [CELL_TYPE.C4]: this.spriteC4,
           [CELL_TYPE.C5]: this.spriteC5,
           [CELL_TYPE.C6]: this.spriteC6,
           [CELL_TYPE.CPP]: this.spriteCPP,
        };
        this.bomb = this.node.getChildByName('bomb');
        this.clickHand = this.node.getChildByName('hand');

        // 骰子组合
        let nextnode = this.node.getChildByName('nextdice');
        let movenode = this.node.getChildByName('move');
        let turnnode = this.node.getChildByName('turnbox');
        // 摆放骰子组合的三个不同区域
        this.movec = {
            one: movenode.getChildByName('one'),
            twoV: movenode.getChildByName('twoV'),
            twoH: movenode.getChildByName('twoH'),
        };
        this.turnc = {
            one: turnnode.getChildByName('one'),
            twoV: turnnode.getChildByName('twoV'),
            twoH: turnnode.getChildByName('twoH'),
        };
        this.nextc = {
            one: nextnode.getChildByName('one'),
            twoV: nextnode.getChildByName('twoV'),
            twoH: nextnode.getChildByName('twoH'),
        };

        /** 方块节点，（1， 1）代表第一行，第一列 */
        this.cells = [
            [],
            [undefined, ...this.box.getChildByName('line1').children],
            [undefined, ...this.box.getChildByName('line2').children],
            [undefined, ...this.box.getChildByName('line3').children],
            [undefined, ...this.box.getChildByName('line4').children],
            [undefined, ...this.box.getChildByName('line5').children],
        ];
        this.cellbgs = [
            [],
            [undefined, ...this.boxbg.getChildByName('line1').children],
            [undefined, ...this.boxbg.getChildByName('line2').children],
            [undefined, ...this.boxbg.getChildByName('line3').children],
            [undefined, ...this.boxbg.getChildByName('line4').children],
            [undefined, ...this.boxbg.getChildByName('line5').children],
        ]
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    // 开始
    start () {
        this.initWithModel(this.gameController.gameModel.cellModel);
        this.getNextDices();
        this.setTouchListener();
        // let arr = this.gameController.gameModel.getConnectArr();
        // console.log('arr --- ',arr);
    },

    initWithModel (model) {
        for (let i=1; i<=5; i++) {
            for (let j=1; j<=5; j++) {
                if (model[i][j] !== CELL_TYPE.CE) {
                    let node = this.cells[i][j];
                    node.active = true;
                    node.getComponent(cc.Sprite).spriteFrame = this.sprites[model[i][j]];
                }
            }
        }
    },

    setCellStatus (status) {
        this.info.cellStatus = status;
        if (status === CELL_STATUS.CAN_MOVE) {
            this.info.guideTimeout && clearTimeout(this.info.guideTimeout);
            this.info.guideTimeout = setTimeout(()=>{
                this.showClickHand();
            }, 3000);
        }
    },

    setTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.info.cellStatus === CELL_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.touchStartArea.position.x - this.touchStartArea.width/2 &&
                touchPos.x <= this.touchStartArea.position.x + this.touchStartArea.width/2 &&
                touchPos.y >= this.touchStartArea.position.y - this.touchStartArea.height/2 &&
                touchPos.y <= this.touchStartArea.position.y + this.touchStartArea.height/2) {
                    this.info.lastCheckTime = Date.now();

                    this.setCellStatus(CELL_STATUS.IS_MOVE);
                    this.hideClickHand();

                    this.info.currentMove.opacity = 255;
                    this.info.currentMove.active = true;
                    
                    this.info.currentMove.position = cc.v2(touchPos.x, touchPos.y+80);
                    this.info.currentTurn.active = false;
            }
        }
        
    },

    onTouchMove (touch) {
        if (this.info.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.info.lastCheckTime >= this.info.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            let putpos = cc.v2(touchPos.x, touchPos.y+80);
            this.info.currentMove.position = putpos;

            let boxPos = this.convertToBoxPos(putpos);
            // console.log('onTouchMove ----  boxPos', boxPos);
            // 用户更换到其他格子了,重置选中的底部格子
            if ((boxPos && !this.info.nowHoverPos) ||
                (this.info.nowHoverPos && !boxPos) ||
                (boxPos && (this.info.nowHoverPos.x !== boxPos.x || this.info.nowHoverPos.y !== boxPos.y)) ) {
                let canPutArr = this.gameController.gameModel.checkIfCanPut(boxPos, this.info.currentDices);
                // console.log('onTouchMove canPutArr', canPutArr);
                this.setCellBg(canPutArr);
                this.info.nowHoverPos = boxPos;
            }
            
            this.info.lastCheckTime = Date.now();
        }
    },
    
    onTouchEnd (touch) {
        if (this.info.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            let putpos = cc.v2(touchPos.x, touchPos.y+80);
            // this.info.currentMove.opacity = 255;
            this.info.currentMove.active = false;
            
            let boxPos = this.convertToBoxPos(putpos);
            this.setCellBg(null);

            let canPutArr = this.gameController.gameModel.checkIfCanPut(boxPos, this.info.currentDices);
            // 如果可以放进格子
            if (canPutArr) {
                this.gameController.getAudioUtils().playEffect('bubble', 1.5);
                if (this.info.isFirstStep) this.hideFirstGuide();
                let connectArr = this.gameController.gameModel.putCardIntoModel(boxPos, this.info.currentDices);
                // 如果存在可以合并的牌
                if (connectArr) {
                    this.actCombine(connectArr);
                    this.setCellStatus(CELL_STATUS.DONE_MOVE);
                } else {
                    if (this.info.currentDices[0].type === CELL_TYPE.CPP) {
                        this.actBomb();
                    } else {
                        this.getNextDices(); // 直接拿一组新方块
                        this.setCellStatus(CELL_STATUS.CAN_MOVE);
                    }
                    
                }
            } else {
                // 如果手上的方块没放进格子，则不需要拿新方块
                this.info.currentTurn.active = true;
                this.setCellStatus(CELL_STATUS.CAN_MOVE);
            }

            this.info.nowHoverPos = null;
            // console.log('onTouchEnd connectArr', connectArr);
        }
    },


    /**
     * 显示放下去的格子
     * @param {*} boxPos 棋盘坐标
     * @param {*} cardsModel 卡牌组模型 [{relatPos: cc.v2, type: CELL_TYPE}]
     */
    showCells (boxPos, cardsModel) {
        if (!cardsModel) return;
        cardsModel.forEach((model, index) => {
            let cell = this.cells[boxPos.x+model.relatPos.x][boxPos.y+model.relatPos.y];
            cell.getComponent(cc.Sprite).spriteFrame = this.sprites[model.type];
            cell.active = true;
            cell.opacity = 255;
        });
    },

    /**
     * 把方块下面的格子变成黑色
     * @param {[cc.v2]} canPutArr 如果传数组，则会把相应位置的格子变成黑色，如果传null则会把原来的黑色格子变白
     */
    setCellBg (canPutArr) {
        const light = new cc.color(255, 255, 255);
        const dark = new cc.color(207, 207, 207);
        
        if (this.info.lastCanPutArr) {
            this.info.lastCanPutArr.forEach(pos => {
                let bg = this.cellbgs[pos.x][pos.y];
                bg.color = light;
            });
        }
        this.info.lastCanPutArr = canPutArr;
        if (!canPutArr || canPutArr.length<=0) return;

        canPutArr.forEach(pos => {
            let bg = this.cellbgs[pos.x][pos.y];
            bg.color = dark;
        });
        this.info.lastCanPutArr = canPutArr;
    },

    /**
     * 把游戏坐标转换成棋盘坐标
     * @param {*} pos
     * @return 返回对应的棋盘坐标。如果没有对应的格子，则返回null
     */
    convertToBoxPos (pos) {
        // 左上角起点坐标（-174， 112） 间隔87 宽度77.5 缓冲距离15
        const center = {x: -174, y: 112};
        const dist = 87;
        const width = 77.5;
        const half = width/2;
        const huan = 5;
        const colY = [0, center.x, center.x+dist, center.x+dist*2, center.x+dist*3, center.x+dist*4];
        const rowX = [0, center.y, center.y-dist, center.y-dist*2, center.y-dist*3, center.y-dist*4];
        let xx = rowX.findIndex((y, i) => i>0 && (pos.y >= (y-half+huan) && pos.y <= (y+half-huan)) );
        let yy = colY.findIndex((x, i) => i>0 && (pos.x >= (x-half+huan) && pos.x <= (x+half-huan)));
        
        if (xx>0 && yy>0) {
            return cc.v2(xx, yy);
        } else {
            return null;
        }
    },

    /**拿到下一组新的骰子 */
    getNextDices () {
        let next = this.gameController.gameModel.getNextCards();
        // console.log('getNextDices next: ', next);
        if (next.length < 0 || next.length > 2) return false;
        this.info.currentDices = this.info.nextDices;
        this.info.nextDices = next;

        this.renderNewDices('nextc', this.info.nextDices);
        this.info.currentTurn = this.renderNewDices('turnc', this.info.currentDices);
        this.info.currentMove = this.renderNewDices('movec', this.info.currentDices);

        this.info.currentMove.active = false;
        this.info.currentTurn.active = true;
    },

    /**
     * 渲染骰子组
     * @param {*} area 区域 'movec' | 'turnc' | 'nextc'
     * @param {*} model 骰子组模型数组 [{relatPos: cc.v2, type: CELL_TYPE}]
     * @return cc.Node 返回对应的节点。如果渲染失败，返回null
     */
    renderNewDices (area, model) {
        let areacont = this[area];
        if (!areacont) return null; // 区域不存在
        if (model.length < 0 || model.length > 2) return null; // 模型长度违规

        let kind = 'one';
        if (model.length === 2) {
            kind = 'two';
            // 中点要放在右下角，也就是数组的第二个。如果第一个就是中点，就返回false
            if (model[0].relatPos.x === 0 && model[0].relatPos.y === 0) return null;
            if (model[0].relatPos.x !== 0) {
                kind = kind+'V';
            } else if (model[0].relatPos.y !== 0) {
                kind = kind+'H';
            }
        }
        // console.log('renderNewDices area: ', area,'  kind : ', kind);
        model.forEach((item, index) => {
            
            let dice = areacont[kind].children[index];
            dice.getComponent(cc.Sprite).spriteFrame = this.sprites[item.type];
        });
        // console.log('node: ', areacont[kind]);
        if (area === 'movec') {
            areacont[kind].active = true;
            areacont[kind].opacity = 0;
        } else {
            areacont[kind].active = true;
            areacont[kind].opacity = 255;
        }
        return areacont[kind];
    },

    /**
     * 把卡片组合起来
     * @param {[cc.v2]} arr 
     */
    actCombine (arr) {
        if (!arr || arr.length === 0) return;
        let center = this.cells[arr[0].x][arr[0].y];
        let newType = this.gameController.gameModel.combineCards(arr);
        
        arr.forEach((boxPos, index) => {
            let cell = this.cells[boxPos.x][boxPos.y];
            let originPos = cc.v2(cell.position.x, cell.position.y);
            if (index !== 0) {
                cell.runAction(cc.sequence(
                    cc.moveTo(0.3, center.position.x, center.position.y),
                    cc.callFunc(() => {
                        cell.opacity = 0;
                        cell.position = originPos;
                        if (index === arr.length-1) {
                            let money = 5+Math.ceil(Math.random()*10);
                            money = (this.gameController.cashView.targetCash+money) > 100 ?
                                (100 - this.gameController.cashView.targetCash) : money;
                            if (money>0) {
                                this.gameController.showNewMsg(money);
                            }
                            
                            center.runAction(cc.sequence(
                                cc.callFunc(() => {
                                    center.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                                }),
                                cc.scaleTo(0.1, 1.1),
                                cc.repeat(cc.sequence(cc.rotateTo(0.1, 15), cc.rotateTo(0.1, -15)), 3),
                                cc.spawn(cc.rotateTo(0.1, 0), cc.scaleTo(0.1, 1)),
                                cc.callFunc(() => {
                                    if (newType === CELL_TYPE.CPP) {
                                        this.actBomb();
                                    } else {
                                        if (this.gameController.cashView.targetCash < 100) {
                                            let connectArr = this.gameController.gameModel.getConnectArr();
                                            if (connectArr) {
                                                this.actCombine(connectArr)
                                            } else {
                                                if (this.gameController.cashView.targetCash < 100) {
                                                    this.getNextDices();
                                                    this.setCellStatus(CELL_STATUS.CAN_MOVE);
                                                } else {
                                                    this.showMoneyCard();
                                                }
                                            }
                                        } else {
                                            this.showMoneyCard();
                                        }
                                    }
                                    
                                    // console.log('组合完毕');
                                })
                            ));
                        }
                    })
                ));
            }
        });
    },

    /**爆炸 */
    actBomb () {
        this.bomb.active = true;
        let animstate = this.bomb.getComponent(cc.Animation).play('bomb');
        this.gameController.getAudioUtils().playEffect('lightning', 0.6);
        animstate.on('finished', () => {
            this.bomb.active = false;
        });
        let bombModels = this.gameController.gameModel.eliminateAllCards();
        // [{boxPos: cc.v2, type: CELL_TYPE}]
        bombModels.forEach((model, index) => {
            let node = this.cells[model.boxPos.x][model.boxPos.y];
            node.runAction(cc.sequence(
                cc.scaleTo(0.2, 0),
                cc.callFunc(() => {
                    node.scale = 1;
                    node.opacity = 0;
                    if (index === bombModels.length-1) {
                        let money = 100-this.gameController.cashView.targetCash;
                        if (money>0) {
                            this.gameController.showNewMsg(money);
                        }
                        
                        if (this.gameController.cashView.targetCash < 100) {
                            this.getNextDices();
                            this.setCellStatus(CELL_STATUS.CAN_MOVE);
                        } else {
                            this.showMoneyCard();
                        }
                        
                    }
                })
            ));
        });
    },

    // 隐藏第一步引导
    hideFirstGuide () {
        this.info.isFirstStep = false;
        let hand = this.node.getChildByName('handanim');
        let box = this.node.getChildByName('ligbox');
        [hand, box].forEach(each => {
            if (!each) return;
            each.getComponent(cc.Animation).stop();
            each.active = false;
        });
    },

    /**展示点击手势 */
    showClickHand () {
        if (this.info.isFirstStep) return;
        this.clickHand.active = true;
        this.clickHand.opacity = 0;
        this.clickHand.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                this.clickHand.getComponent(cc.Animation).play();
            })
        ));
    },

    /**隐藏点击手势 */
    hideClickHand () {
        this.info.guideTimeout && clearTimeout(this.info.guideTimeout);
        if (this.clickHand.active) {
            this.clickHand.getComponent(cc.Animation).play();
            this.clickHand.active = false;
        }
    },

    /**展示现金卡 */
    showMoneyCard () {
        let moneyCard = this.node.getChildByName('winmoney');
        let mask = cc.find('Canvas/center/game/mask');

        this.setCellStatus(CELL_STATUS.DONE_MOVE);
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
        moneyCard.scale = 0;
        moneyCard.active = true;
        moneyCard.runAction(cc.sequence(
            cc.scaleTo(0.4, 1.1),
            cc.scaleTo(0.2, 1)
        ));
        mask.active = true;
        mask.opacity = 0;
        mask.runAction(cc.fadeTo(0.4, 150));
    }

    // update (dt) {},
});
