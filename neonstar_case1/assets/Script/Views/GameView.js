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
        box: cc.Node, // 棋盘
        touch: cc.Node, // 触碰区域
        flyIcons: cc.Node,
        paypal: cc.Node,
        clickText: cc.Node,
        hand: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            nowLevel: GAME_LEVEL.LEVEL1,
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            checkDistance: 20, // 移动最少的距离
            nowTouch: null, // 上次点击的触碰点
            nowTouchPos: null, // 上次点击的触碰点的位置
        };

        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [undefined, ...this.box.getChildByName('line0').children], // 这一行是看不见的
            [undefined, ...this.box.getChildByName('line1').children],
            [undefined, ...this.box.getChildByName('line2').children],
            [undefined, ...this.box.getChildByName('line3').children],
            [undefined, ...this.box.getChildByName('line4').children],
            [undefined, ...this.box.getChildByName('line5').children],
            [undefined, ...this.box.getChildByName('line6').children],
            [undefined, ...this.box.getChildByName('line7').children],
            [undefined, ...this.box.getChildByName('line8').children],
            [undefined, ...this.box.getChildByName('line9').children],
            [undefined, ...this.box.getChildByName('line10').children],
        ];
        // pp卡
        this.flyPPIcons = [
            ...this.flyIcons.children
        ];

        // 这一关将要执行的动画
        this.actionList = [];
        // 游戏总共几关
        this.gameLevels = [GAME_LEVEL.LEVEL1];
        // 每一关对应的动画
        this.actionLevel = [
            [
                // {type: ACTION_TYPE.SWITCH, start: cc.v2(4,2), end: cc.v2(3,2)},
                {type: ACTION_TYPE.BOMB},
                // {type: ACTION_TYPE.COMBINE, center: cc.v2(5,3), others: [cc.v2(2,1),
                //     cc.v2(3,1), cc.v2(3,4), cc.v2(4,1), cc.v2(4,2), cc.v2(4,4), cc.v2(5,2), cc.v2(5,4)], newType: CELL_TYPE.CPP},
                // {type: ACTION_TYPE.DOWN, nodes: [
                //     {start: cc.v2(1,1), end: cc.v2(4,1), newType: undefined},
                //     {start: cc.v2(0,1), end: cc.v2(3,1), newType: CELL_TYPE.C200},
                //     {start: cc.v2(0,1), end: cc.v2(2,1), newType: CELL_TYPE.C200},
                //     {start: cc.v2(0,1), end: cc.v2(1,1), newType: CELL_TYPE.C200},
                //     {start: cc.v2(3,2), end: cc.v2(5,2), newType: undefined},
                //     {start: cc.v2(2,2), end: cc.v2(4,2), newType: undefined},
                //     {start: cc.v2(1,2), end: cc.v2(3,2), newType: undefined},
                //     {start: cc.v2(0,2), end: cc.v2(2,2), newType: CELL_TYPE.C200},
                //     {start: cc.v2(0,2), end: cc.v2(1,2), newType: CELL_TYPE.C200},
                //     {start: cc.v2(2,4), end: cc.v2(5,4), newType: undefined},
                //     {start: cc.v2(1,4), end: cc.v2(4,4), newType: undefined},
                //     {start: cc.v2(0,4), end: cc.v2(3,4), newType: CELL_TYPE.C200},
                //     {start: cc.v2(0,4), end: cc.v2(2,4), newType: CELL_TYPE.C200},
                //     {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.C50},
                //     ]
                // },
            ]
        ];

        this.setTouchListener();
        this.changeToNextLevel();
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    changeToNextLevel () {
        if (this.actionLevel.length === 0){
            // this.gameController.guideView.showCashOutHand();
            console.log('changeToNextLevel gameFinish');
            this.offTouchListener();
            return;
        }
        let nextList = this.actionLevel.splice(0, 1)[0];
        this.actionList.push(...nextList);
        this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];
        
        if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
            // this.startGuide();
            console.log('changeToNextLevel LEVEL1');
            this.gameController.guideView.myFadeIn(this.hand, () => {
                this.gameController.guideView.myClickHere(this.hand);
            });
        } else {
            // this.doActions();
        }
    },

    setTouchListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, function ( event) {
        //     console.log('click, move');
        //     // this.actSwitch(cc.v2(4,2), cc.v2(3,2));
        //     this.doActions();
        // }, this);
        this.touch.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touch.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touch.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.touch.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touch.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touch.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    /**
     * 检查是否在可点击区域内
     * @param {*} cellPos 点击的格子的坐标
     */
    checkInGroup (cellPos) {
        if (!cellPos) return false;
        const cell = this.cells[cellPos.x][cellPos.y];
        if (cell.active && cell.getComponent(cc.Sprite).spriteFrame.name === 'cc_beer') {
            return true;
        } else {
            return false;
        }
    },

    onTouchStart (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            // this.gameController.getAudioUtils().playEffect('click', 0.5);
            const touchPos = this.touch.convertToNodeSpaceAR(touch.touch._point);
            const cellPos = this.convertToCellPos(touchPos);
            const inGroup = this.checkInGroup(cellPos);
            if (!cellPos || !inGroup) {
                this.setCellStatus(CELL_STATUS.CAN_MOVE);
                return;
            }
            this.setCellStatus(CELL_STATUS.DONE_MOVE);
            // 隐藏手和文字
            this.clickText.runAction(cc.sequence(
                cc.fadeOut(0.3),
                cc.callFunc(() => {
                    this.clickText.active = false;
                })
            ));
            this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
                this.hand.active = false;
            });
            // console.log('onTouchStart, ', touchPos);
            // console.log('cellPos:', this.convertToCellPos(touchPos));
            this.doActions();
        }
        
    },
    onTouchMove (touch) {
        return;
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    showPPFly (oriPos, ppindex, callback) {
        let destPos = this.flyIcons.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('icon').position));
        destPos = cc.v2(destPos.x+50, destPos.y+50);
        const ppIcon = this.flyPPIcons[ppindex];
        ppIcon.active = true;
        ppIcon.position = cc.v2(oriPos.x, oriPos.y);
        ppIcon.children.forEach((pp, index) => {
            if (index === 0) {
                pp.runAction(cc.sequence(
                    cc.scaleTo(0.4, 1),
                    cc.delayTime(0.9),
                    // cc.scaleTo(0.2, 0)
                ))
            } else if (index === 1) {
                pp.runAction(cc.sequence(
                    cc.scaleTo(0.4, 1),
                    cc.delayTime(0.3),
                    cc.scaleTo(0.1, 1 - (1 / 5)),
                    cc.delayTime(0.5),
                    cc.scaleTo(0.2, 0)
                ))
            } else if (index === 2) {
                pp.runAction(cc.sequence(
                    cc.scaleTo(0.4, 1),
                    cc.delayTime(0.3),
                    cc.scaleTo(0.1, 1 - (1 / 5)),
                    cc.scaleTo(0.1, 1 - (2 / 5)),
                    cc.delayTime(0.4),
                    cc.scaleTo(0.2, 0)
                ))
            } else if (index === 3) {
                pp.runAction(cc.sequence(
                    cc.scaleTo(0.4, 1),
                    cc.delayTime(0.3),
                    cc.scaleTo(0.1, 1 - (1 / 5)),
                    cc.scaleTo(0.1, 1 - (2 / 5)),
                    cc.scaleTo(0.1, 1 - (3 / 5)),
                    cc.delayTime(0.3),
                    cc.scaleTo(0.2, 0)
                ))
            } else if (index === 4) {
                pp.runAction(cc.sequence(
                    cc.scaleTo(0.4, 1),
                    cc.delayTime(0.3),
                    cc.scaleTo(0.1, 1 - (1 / 5)),
                    cc.scaleTo(0.1, 1 - (2 / 5)),
                    cc.scaleTo(0.1, 1 - (3 / 5)),
                    cc.scaleTo(0.1, 1 - (4 / 5)),
                    cc.delayTime(0.2),
                    cc.scaleTo(0.2, 0),
                    cc.callFunc(() => {
                        if (ppindex === 20) {
                            this.gameController.addCash(100);
                        }
                        ppIcon.runAction(cc.sequence(
                            cc.delayTime((0.05*ppindex/2)),
                            cc.moveTo(0.3, destPos),
                            cc.spawn(cc.moveBy(0.1, -50, -50), cc.scaleTo(0.2, 0)),
                        ));
                        callback && callback();
                    })
                ))
            }

        });
    },
    
    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
    },

    /**
     * 把touch点击坐标转换成格子坐标,如果没有则返回null
     * @param {*} pos 
     */
    convertToCellPos (pos) {
        // 棋盘的中心点在正中间才适用,而且每个格子大小必须一致，格子必须是矩形
        const padding = 5; // 格子内边距
        const width = 462; // 棋盘宽度
        const height = 462; // 棋盘高度
        const colNum = 10; // 列数目
        const rowNum = 10; // 行数目
        // const width = this.touch ? this.touch.width : 462;
        // const height = this.touch ? this.touch.height : 462;
        const cellWidth = width/colNum;
        const cellHeight = height/rowNum;
        const firstX = 0-(colNum/2-0.5)*cellWidth;
        const firstY = 0+(rowNum/2-0.5)*cellHeight;
        if (pos.x > 0+width/2 || pos.x < 0-width/2 || pos.y > 0+height/2 || pos.y < 0-height/2) {
            return null;
        }
        const distX = Math.abs(pos.x - firstX);
        const distY = Math.abs(firstY - pos.y);
        const addX = Math.round(distX/cellWidth);
        const addY = Math.round(distY/cellHeight);
        const cellPos = cc.v2(1+addY, 1+addX); // 格子在棋盘上的坐标
        const cellCenter = cc.v2(firstX+addX*cellWidth, firstY-addY*cellHeight); // 格子中心点的坐标
        if (pos.x > cellCenter.x+cellWidth/2-padding || pos.x < cellCenter.x-cellWidth/2+padding ||
            pos.y > cellCenter.y+cellHeight/2-padding || pos.y < cellCenter.y-cellHeight/2+padding) {
            return null;
        } else {
            return cellPos;
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
                    this.showCool();
                    setTimeout(() => {
                        this.actChange(action.center, action.newType);
                    }, 600);
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
                default: break;
            }
        } else {
            this.changeToNextLevel();
            this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    
    /**动作：爆炸 */
    actBomb () {
        // for (let i = 1; i <= 5; i++) {
        //     for (let j = 1; j <= 5; j++) {
        //         let node = this.cells[i][j];
        //         node.runAction(cc.sequence(
        //             cc.scaleTo(0.1, 1.15),
        //             cc.rotateTo(0.1, 10),
        //             cc.rotateTo(0.1, -10),
        //             cc.rotateTo(0.1, 10),
        //             cc.rotateTo(0.1, -10),
        //             cc.rotateTo(0.1, 5),
        //             cc.rotateTo(0.1, 0),
        //             // cc.scaleTo(0.1, 0.9),
        //             // cc.scaleTo(0.1, 1.2),
        //             // cc.scaleTo(0.1, 0.8),
        //             // cc.scaleTo(0.1, 1.1),
        //             cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 0.5)),
        //             cc.callFunc(() => {
        //                 node.getChildByName('light').active = false;
        //                 node.getChildByName('cppIcon').active = false;
        //                 node.scale = 1;
        //             }),
        //             cc.callFunc(() => {
        //                 if (i === 5 && j === 5) {
        //                     this.showFlyCards(11);
        //                     setTimeout(() => {this.gameController.addCash(500);}, 300);
        //                     this.doActions();
        //                 }
        //             })
        //         ));
        //     }
        // }

        const beers = [];
        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                let node = this.cells[i][j];
                if (node.active && node.getComponent(cc.Sprite).spriteFrame.name === 'cc_beer') {
                    beers.push(node);
                }
            }
        }
        let callback = null;
        beers.forEach((beer, index) => {
            if (index === beers.length-1) {
                callback = () => {
                    this.doActions();
                }
            }
            beer.runAction(cc.fadeOut(0.7));
            this.showPPFly(beer.position, index, callback);
        })
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

    // update (dt) {},
});
