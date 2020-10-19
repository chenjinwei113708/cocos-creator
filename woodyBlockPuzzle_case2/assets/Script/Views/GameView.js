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
    CELL_STATUS,
    BRICK_TYPE,
    BRICK_VALUE
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        hand: cc.Node, // 指引手
        touch1: cc.Node, // 触碰点1
        endPos1: cc.Node, // 结束点1
        four1: cc.Node, // 4个方块
        five1: cc.Node, // 5个方块
        two1: cc.Node, // 2个方块
        bomb: cc.Node, // 消除的方块存放的父节点
        progressBar: cc.Node, // 进度条
        reward: cc.Node, // 奖品
        flyPrefab: cc.Prefab, // 掉落的方块
        prizeCash: cc.Node, // 奖金
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(Date.now(), this.four1);
        this.allBricks = cc.find('Canvas/center/game/bricks').children;
        this.gameInfo = {
            cellStatus: CELL_STATUS.CAN_MOVE, // 可选择
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            bigger: 2.2,
            nowTouch: null, // 触碰点
            moveStartPos: cc.v2(-54.593, -332), // 记录起点位置
            moveShowPos: cc.v2(110.397, -332.575), // 方块出现的位置
            progressInterval: null,
            originPos: cc.v2(-251.143, 278.152), // 左上角格子的坐标
            border: {leastX: -251.143, leastY: -225.76, mostX: 253.749, mostY: 278.152},
            colunmWidth: 63.112, // 每一列宽度
            rowHeight: 62.989, // 每一行高度
            currentBrickType: BRICK_TYPE.FOUR1, // 当前移动的方块的名称
            currentBrick: null, // 当前移动的方块
            order: [BRICK_TYPE.FOUR1, BRICK_TYPE.FIVE1, BRICK_TYPE.TWO1], // 出场顺序
            moveTimes: 0, // 移动次数
            bombTimes: 0, // 爆炸次数
            rowNames: ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            tipBricks: [], // 当前提示的格子
        };
        
        // 结点池
        this.flyBricks = new cc.NodePool();
        for (let i = 0; i < 16; ++i) {
            let fly = cc.instantiate(this.flyPrefab); // 创建节点
            this.flyBricks.put(fly); // 通过 put 接口放入对象池
        }

        this.setTouchListener();
        this.setPrize(50);
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setTouchListener () {
        // console.log('setTouchListener', Date.now());
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
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.touch1.position.x - this.touch1.width/2 &&
                touchPos.x <= this.touch1.position.x + this.touch1.width/2 &&
                touchPos.y >= this.touch1.position.y - this.touch1.height/2 &&
                touchPos.y <= this.touch1.position.y + this.touch1.height/2) {
                    this.gameInfo.nowTouch = this.touch1;
                    this.gameInfo.lastCheckTime = Date.now();
                    let nowBrickType = this.gameInfo.currentBrickType;
                    this.gameInfo.currentBrick = this[nowBrickType];
                    this.gameInfo.currentBrick.scale = this.gameInfo.bigger;
                    // this.gameInfo.nowTouchPos = touchPos;
                    this.setCellStatus(CELL_STATUS.IS_MOVE);
            }
        }
        
    },
    onTouchMove (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            let nowBrickType = this.gameInfo.currentBrickType;
            this.gameInfo.currentBrick.position = touchPos;
            let brickPos = this.convert2BrickPos(touchPos); // 转换成格子坐标
            // console.log('brickPos', brickPos, touchPos);
            if (brickPos) {
                let canPut = this.gameController.gameModel.placeInto(brickPos, BRICK_VALUE[nowBrickType], false);
                // console.log('当前位置：', brickPos.x, ' ', brickPos.y, canPut);
                this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], canPut, false);
                // this.checkInPos(touchPos, false);
            } else {
                this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], false, false);
            };
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            let nowBrickType = this.gameInfo.currentBrickType;
            let brickPos = this.convert2BrickPos(touchPos); // 转换成格子坐标
            let currentBrick = this.gameInfo.currentBrick;
            if (this.gameInfo.moveTimes === 0) { // 第一次消除
                if (!brickPos || brickPos.x !== 7 || brickPos.y !== 5) {
                    this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], false, false);
                    currentBrick.scale = 1;
                    currentBrick.position = this.gameInfo.moveStartPos;
                    this.setCellStatus(CELL_STATUS.CAN_MOVE);
                    return; // 第一次只能放在指定位置(7, 5)
                }
            }
            let canPut = this.gameController.gameModel.placeInto(brickPos, BRICK_VALUE[nowBrickType], true);
            if (canPut) { //放对位置了
                // 第一次消除，隐藏指导手
                if (this.gameInfo.moveTimes === 0) {
                    // if (brickPos.x !== 7 || brickPos.y !== 5) {
                    //     currentBrick.scale = 1;
                    //     currentBrick.position = this.gameInfo.moveStartPos;
                    //     this.setCellStatus(CELL_STATUS.CAN_MOVE);
                    //     return; // 第一次只能放在指定位置(7, 5)
                    // }
                    this.hand.getComponent(cc.Animation).stop();
                    this.hand.active = false;
                }
                this.gameController.getAudioUtils().playEffect('put', 0.7);
                this.showTipArea(brickPos, BRICK_VALUE[nowBrickType], canPut, true);
                this.setCellStatus(CELL_STATUS.DONE_MOVE);
                currentBrick.scale = 1;
                currentBrick.position = this.gameInfo.moveStartPos;
                currentBrick.active = false;
                let bombBricks = this.gameController.gameModel.findBomb(brickPos, BRICK_VALUE[nowBrickType]);
                if (bombBricks) {
                    setTimeout(() => {this.showBomb(bombBricks);}, 100);
                } else {
                    this.getNextBrick();
                    // this.setCellStatus(CELL_STATUS.CAN_MOVE);
                }
                
            } else {
                currentBrick.scale = 1;
                currentBrick.position = this.gameInfo.moveStartPos;
                this.setCellStatus(CELL_STATUS.CAN_MOVE);
            }
        }
    },

    /**将坐标转换成格子坐标，第几行第几列cc.v2 */
    convert2BrickPos (pos) {
        if (pos.x < this.gameInfo.border.leastX || pos.x > this.gameInfo.border.mostX ||
            pos.y < this.gameInfo.border.leastY || pos.y > this.gameInfo.border.mostY ) return null;
        let y = parseInt((pos.x - this.gameInfo.originPos.x) / this.gameInfo.colunmWidth) + 1;
        let x = parseInt((this.gameInfo.originPos.y - pos.y) / this.gameInfo.rowHeight) + 1;
        return cc.v2(x, y);
    },

    /**展示提示区域 */
    showTipArea (startPos, brickValue, canPut, isPutDown = false) {
        if (this.gameInfo.tipBricks.length > 0) {
            this.gameInfo.tipBricks.forEach(each => {
                each.opacity = 0;
                each.active = false;
            });
        }
        if (canPut) {
            let tipBricks = this.findTipBricks(startPos, brickValue);
            this.gameInfo.tipBricks = tipBricks;
            tipBricks.forEach(each => {
                each.opacity = isPutDown ? 255 : 100;
                each.active = true;
                // console.log('checkInPos in, active ', each.active);
            });
            if (isPutDown) {
                this.gameInfo.tipBricks = [];
                if (this.gameInfo.bombTimes === 1) {
                    this.hideTryIt();
                }
            }
        }
    },

    /**找到提示区域的格子，当方块悬浮在格子上方，出现影子提示 */
    findTipBricks (startPos ,brickValue) {
        let tipBricks = [];
        if (!startPos) return tipBricks;
        brickValue.forEach(each => {
            let pos = cc.v2(startPos.x+each.x, startPos.y+each.y);
            let b = this.allBricks[pos.x-1].children[pos.y-1];
            tipBricks.push(b);
        });
        return tipBricks;
    },

    /**检查是否放入目标位置
     * @param {cc.v2} touchPos 需要检查的坐标
     * @param {boolean} isPutDown 是否放下，还是只是移动过去了
     */
    checkInPos (touchPos, isPutDown = false) {
        
        const bricksG = cc.find('Canvas/center/game/bricks/g').children;
        const dest = [bricksG[1], bricksG[2], bricksG[3], bricksG[4]];
        if (touchPos.x >= this.endPos1.position.x - this.endPos1.width/2 &&
            touchPos.x <= this.endPos1.position.x + this.endPos1.width/2 &&
            touchPos.y >= this.endPos1.position.y - this.endPos1.height/2 &&
            touchPos.y <= this.endPos1.position.y + this.endPos1.height/2) {
            // 是目标位置
            // console.log('checkInPos in');
            dest.forEach(each => {
                each.opacity = isPutDown ? 255 : 100;
                each.active = true;
                // console.log('checkInPos in, active ', each.active);
            });
            return true;
        } else {
            dest.forEach(each => {
                each.active = false;
            });
            
            return false;
        }
        
    },

    /**拿到某一行或者某一列的格子
     * @param {boolean} isLine 是否是行，还是列
     * @param {number} number 第几行，或第几列
     */
    getBombBricks (isLine = true, number) {
        if (number < 0 || number > 8) return null;
        if (isLine) {
            let row = this.allBricks[number-1].children;
            return row;
        } else {
            let column = this.allBricks.map(each => {
                return each.children[number-1];
            });
            return column;
        }
    },

    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
    },

    /**展示格子消除特效 */
    showBomb (bombBricks) {
        this.gameInfo.bombTimes++;
        const duration = {
            upLeast: 0.1,
            upMost: 0.3,
            downLeast: 0.5,
            downMost: 0.4,
        };
        const distance = {
            upLeast: 50,
            upMost: 80,
            upLeftLeast: 50,
            upLeftMost: 80,
            down: -900,
            downLeftLeast: 100,
            downLeftMost: 350,
        };
        if (this.gameInfo.bombTimes === 1) {
            this.setProgress(1);
        } else {
            this.setProgress((this.gameInfo.bombTimes-1) / 4);
        }
        const delay = 500; // ms
        // let bricks = this.getBombBricks(false, 5); // 拿到第5列的格子
        let bricks = bombBricks.bricks.map(eachPos => {
            return this.allBricks[eachPos.x-1].children[eachPos.y-1];
        });
        this.gameController.getAudioUtils().playEffect('merge', 0.6);
        // 消失一列格子
        bricks.forEach(each => {
            // 出现掉落特效
            let fly = this.getFlyBrick();
            fly.position = cc.v2(each.position.x, each.position.y);
            fly.active = true;
            fly.parent = this.bomb;
            let isLeft = Math.random() < 0.5 ?  true : false;
            fly.runAction(cc.sequence(
                cc.moveBy(duration.upLeast + Math.random()*duration.upMost,
                    isLeft ? -distance.upLeftLeast-Math.random()*distance.upLeftMost : distance.upLeftLeast+Math.random()*distance.upLeftMost,
                    distance.upLeast+Math.random()*distance.upMost),
                cc.moveBy(duration.downLeast + Math.random()*duration.downMost,
                    isLeft ? -distance.downLeftLeast-Math.random()*distance.downLeftMost : distance.downLeftLeast+Math.random()*distance.downLeftMost,
                    distance.down),
                cc.callFunc(() => {
                    this.killFlyBrick(fly);
                })
            ).easing(cc.easeIn(1.5)));
            // 隐藏原来的格子
            each.active = false;
        });
        this.gameController.gameModel.bomb(bombBricks.bricks); // 修改模型，爆炸的格子置为0
        
        console.log('bomb, times: ', this.gameInfo.bombTimes);
        if (this.gameInfo.bombTimes === 1 || this.gameInfo.bombTimes === 5){
            setTimeout(() => {
                this.showAward();
            }, delay);
        }
        setTimeout(() => {
            this.getNextBrick();
        }, delay);
    },

    /**出现下一个方块组 */
    getNextBrick () {
        this.gameInfo.moveTimes++;
        let nextName = this.gameInfo.order[this.gameInfo.moveTimes] || BRICK_TYPE.TWO1;
        this.gameInfo.currentBrickType = nextName;
        let nextBrick = this[nextName];
        // console.log('getNextBrick', nextName, nextBrick);
        nextBrick.opacity = 0;
        nextBrick.active = true;
        nextBrick.position = this.gameInfo.moveShowPos;
        
        nextBrick.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.moveTo(0.35, this.gameInfo.moveStartPos)),
            cc.callFunc(() => {
                if (this.gameInfo.bombTimes < 5) {
                    this.setCellStatus(CELL_STATUS.CAN_MOVE)
                }
            })
        ));
    },

    /**设置奖金数额 */
    setPrize (num) {
        this.prizeCash.getComponent(cc.Label).string = `$${num}`;
    },

    /**获取奖金金额 */
    getPrize () {
        var str = this.prizeCash.getComponent(cc.Label).string;
        var prize = Number(str.split('').splice(1).join(''));
        return prize;
    },

    /**展示高亮 区域 */
    showLight () {
        const brightColor = new cc.Color(253, 234, 9);
        const defaultColor = new cc.Color(255, 255, 255);
        const delay = 30;
        let bricks = this.getBombBricks(false, 5); // 拿到第5列的格子
        // 消失一列格子
        bricks.forEach((each, index) => {
            setTimeout(() => {
                each.color = brightColor;
                setTimeout(() => {
                    each.color = defaultColor;
                }, delay*6)
            }, delay*index)
        });
    },

    /**展示奖品 */
    showAward () {
        const showTime = 0.3;
        // console.log('showAward');
        this.gameController.getAudioUtils().playEffect('coin', 0.4);
        let shine = this.reward.getChildByName('shine');
        let ppcard = this.reward.getChildByName('ppcard');
        let ppcash = this.reward.getChildByName('ppcard').getChildByName('cash');
        let con = this.reward.getChildByName('congratulation');
        let prize = this.getPrize();
        ppcash.getComponent(cc.Label).string = `$${prize}`;

        shine.opacity = 0;
        shine.scale = 0.1;
        shine.active = true;
        shine.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(showTime, 1), cc.fadeIn(showTime)),
            cc.callFunc(() => {
                shine.getComponent(cc.Animation).play();
            })
        ));
        ppcard.opacity = 0;
        ppcard.scale = 0.1;
        ppcard.active = true;
        ppcard.runAction(cc.spawn(cc.scaleTo(showTime, 1), cc.fadeIn(showTime)));

        con.opacity = 0;
        con.scale = 0.1;
        con.active = true;
        con.runAction(cc.spawn(cc.scaleTo(showTime, 1), cc.fadeIn(showTime)));
        setTimeout(() => {
            shine.runAction(cc.sequence(
                cc.scaleTo(0.2, 0),
                cc.callFunc(() => {
                    shine.active = false;
                    ppcard.active = false;
                    con.active = false;
                    if (this.gameInfo.bombTimes === 1) {
                        this.showTryIt();
                        this.setPrize(200);
                        this.setProgress(0);
                    } else if (this.gameInfo.bombTimes === 5) {
                        this.showRedeem();
                    }
                })
            ));
            ppcard.runAction(cc.scaleTo(0.2, 0));
            con.runAction(cc.scaleTo(0.2, 0));
        }, 900);
    },

    getFlyBrick () {
        let fly = null;
        if (this.flyBricks.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            fly = this.flyBricks.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            fly = cc.instantiate(this.flyPrefab);
        }
        return fly;
    },

    killFlyBrick (flyBrick) {
        this.flyBricks.put(flyBrick);
    },

    showTryIt () {
        let tryIt = cc.find('Canvas/center/game/try');
        tryIt.scale = 0.1;
        tryIt.active = true;
        tryIt.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(() => {
                tryIt.getComponent(cc.Animation).play();
            })
        ));
    },

    hideTryIt () {
        let tryIt = cc.find('Canvas/center/game/try');
        tryIt.getComponent(cc.Animation).stop();
        tryIt.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                tryIt.active = false;
            })
        ));
    },

    showRedeem () {
        let redeem = cc.find('Canvas/center/game/redeem');
        redeem.scale = 0;
        redeem.active = true;
        this.gameController.getAudioUtils().playEffect('cheer', 0.7);
        redeem.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(() => {
                // tryIt.getComponent(cc.Animation).play();
            })
        ));
    },

    hideRedeem () {
        let redeem = cc.find('Canvas/center/game/redeem');
        // redeem.getComponent(cc.Animation).stop();
        redeem.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                redeem.active = false;
            })
        ));
    },

    /**设置进度 */
    setProgress (num) {
        let currentProgress = this.progressBar.getComponent(cc.ProgressBar).progress;
        console.log('setProgress', ' current', currentProgress, ' target', num);
        let add = num - currentProgress;
        if (add === 0) return;
        let isAdd = add > 0 ? true : false;
        let unit = isAdd ? 0.1 : -0.1;
        this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
        this.gameInfo.progressInterval = setInterval(() => {
            this.progressBar.getComponent(cc.ProgressBar).progress += unit;
            add -= unit;
            if (isAdd && add <= 0 || !isAdd && add >= 0) {
                this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
            }
        }, 80);
    },
    // update (dt) {},
});
