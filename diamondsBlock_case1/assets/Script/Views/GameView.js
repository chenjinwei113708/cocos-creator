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
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        hand: cc.Node, // 指引手
        guideHand: cc.Node, // 手指引动画
        touch1: cc.Node, // 触碰点1
        endPos1: cc.Node, // 结束点1
        four1: cc.Node, // 起点的4个方块
        moveBrick: cc.Node, // 移动的方块
        bomb: cc.Node, // 消除的格子
        progressBar: cc.Node, // 进度条
        reward: cc.Node, // 奖品
        pps: cc.Node, // pp气泡
        paypal: cc.Node, // 顶部栏
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(Date.now(), this.four1);
        this.gameInfo = {
            cellStatus: CELL_STATUS.CAN_MOVE, // 可选择
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            bigger: 2.2,
            nowTouch: null, 
            four1Pos: cc.v2(this.four1.position.x, this.four1.position.y), // 记录起点位置
            progressInterval: null,
        };
        this.setTouchListener();
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
                    // this.four1.scale = this.gameInfo.bigger;
                    this.four1.active = false;
                    this.moveBrick.active = true;
                    this.moveBrick.position = cc.v2(this.four1.position.x, this.four1.position.y);
                    // this.gameInfo.nowTouchPos = touchPos;
                    this.setCellStatus(CELL_STATUS.IS_MOVE);
            }
        }
        
    },
    onTouchMove (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            this.moveBrick.position = touchPos;
            // this.checkInPos(touchPos, false);
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            let inDest = this.checkInPos(touchPos, true);
            if (inDest) {
                // 放对位置了
                // this.four1.scale = 1;
                // this.four1.position = this.gameInfo.four1Pos;
                this.four1.active = false;
                this.moveBrick.active = false;
                this.setFourBrickActive();
                this.setCellStatus(CELL_STATUS.DONE_MOVE);
                this.guideHand.getComponent(cc.Animation).stop();
                this.guideHand.active = false;
                this.showPPBubble(this.getBombBricks(false, 3));
                // setTimeout(() => {this.showBomb();}, 100);
            } else {
                // this.four1.scale = 1;
                // this.four1.position = this.gameInfo.four1Pos;
                this.four1.active = true;
                this.moveBrick.active = false;
                this.setCellStatus(CELL_STATUS.CAN_MOVE);
            }
        }
    },

    /**检查是否放入目标位置
     * @param {cc.v2} touchPos 需要检查的坐标
     * @param {boolean} isPutDown 是否放下，还是只是移动过去了
     */
    checkInPos (touchPos, isPutDown = false) {
        
        // const bricksG = cc.find('Canvas/center/game/bricks/g').children;
        // const dest = [bricksG[1], bricksG[2], bricksG[3], bricksG[4]];
        if (touchPos.x >= this.endPos1.position.x - this.endPos1.width/2 &&
            touchPos.x <= this.endPos1.position.x + this.endPos1.width/2 &&
            touchPos.y >= this.endPos1.position.y - this.endPos1.height/2 &&
            touchPos.y <= this.endPos1.position.y + this.endPos1.height/2) {
            // 是目标位置
            // console.log('checkInPos in');
            // dest.forEach(each => {
            //     each.opacity = isPutDown ? 255 : 100;
            //     each.active = true;
            //     // console.log('checkInPos in, active ', each.active);
            // });
            return true;
        } else {
            // dest.forEach(each => {
            //     each.active = false;
            // });
            
            return false;
        }
        
    },

    /**拿到某一行或者某一列的格子
     * @param {boolean} isLine 是否是行，还是列
     * @param {number} number 第几行，或第几列
     */
    getBombBricks (isLine = true, number) {
        const bricks = cc.find('Canvas/center/game/bricks').children;
        const lineNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        if (number < 0 || number > 8) return null;
        if (isLine) {
            let row = bricks[number-1].children;
            return row;
        } else {
            let column = bricks.map(each => {
                return each.children[number-1];
            });
            return column;
        }
    },

    /**根据行列拿到的格子
     * @param {number} row 第几行
     * @param {number} column 第几列
     */
     getBombBrick (row, column) {
        const bricks = cc.find('Canvas/center/game/bricks');
        const lineNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        if (column < 0 || column > 8) return null;
        let brick = bricks.getChildByName(lineNames[row - 1]).children[column-1];
        return brick;
    },

    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
    },

    /**展示格子消除特效 */
    showBomb () {
        return;
        console.log('展示爆炸');
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
        const delay = 500; // ms
        let bricks = this.getBombBricks(false, 5); // 拿到第5列的格子
        // 消失一列格子
        bricks.forEach(each => {
            each.active = false;
        });
        this.setProgress(1);
        // 出现掉落特效
        this.bomb.children.forEach(fly => {
            fly.active = true;
            let isLeft = Math.random() < 0.5 ?  true : false;
            fly.runAction(cc.sequence(
                cc.moveBy(duration.upLeast + Math.random()*duration.upMost,
                    isLeft ? -distance.upLeftLeast-Math.random()*distance.upLeftMost : distance.upLeftLeast+Math.random()*distance.upLeftMost,
                    distance.upLeast+Math.random()*distance.upMost),
                cc.moveBy(duration.downLeast + Math.random()*duration.downMost,
                    isLeft ? -distance.downLeftLeast-Math.random()*distance.downLeftMost : distance.downLeftLeast+Math.random()*distance.downLeftMost,
                    distance.down)
            ).easing(cc.easeIn(1.5)));
        });
        setTimeout(() => {
            this.showAward();
        }, delay);
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
        let mask = this.reward.getChildByName('mask');
        let shine = this.reward.getChildByName('shine');
        let ppcard = this.reward.getChildByName('ppcard');
        let con = this.reward.getChildByName('congratulation');
        let btn = this.reward.getChildByName('cashout');
        let endhand = this.reward.getChildByName('hand');

        mask.opacity = 0;
        mask.active = true;
        mask.runAction(cc.fadeTo(showTime, 130));

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
        
        btn.opacity = 0;
        btn.scale = 0.1;
        btn.active = true;
        btn.runAction(cc.spawn(cc.scaleTo(showTime, 1), cc.fadeIn(showTime)));

        this.gameController.guideView.myFadeIn(endhand, ()=>{
            this.gameController.guideView.myClickHere(endhand);
        });
    
    },

    /**设置进度 */
    setProgress (num) {
        let currentProgress = this.progressBar.getComponent(cc.ProgressBar).progress;
        let add = num - currentProgress;
        if (add <= 0) return;
        this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
        this.gameInfo.progressInterval = setInterval(() => {
            this.progressBar.getComponent(cc.ProgressBar).progress += 0.1;
            add -= 0.1;
            if (add <= 0) {
                this.gameInfo.progressInterval && clearInterval(this.gameInfo.progressInterval);
            }
        }, 80);
    },

    /**
     * 将方块设置为可见
     * @param {array[cc.Node]} bricks 
     */
    setBricksActive (bricks, type) {
        bricks.forEach(b => {
            b.active = true;
        });
    },

    // 把四个放下的方块设为可见
    setFourBrickActive () {
        let arr = [];
        arr.push(this.getBombBrick(3,3));
        arr.push(this.getBombBrick(3,4));
        arr.push(this.getBombBrick(4,3));
        arr.push(this.getBombBrick(4,4));
        this.setBricksActive(arr);
    },


    /**
     * 展示pp气泡
     * @param {array[cc.Node]} bricks 
     */
    showPPBubble (bricks) {
        let destPos = this.node.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('ppcard').position)
        );
        bricks.forEach((brick, index)=>{
            let pp = this.pps.children[index];
            pp.position = cc.v2(brick.position.x, brick.position.y);
            pp.scale = 0;
            pp.active = true;
            brick.runAction(cc.sequence(
                cc.delayTime(0.06*index),
                cc.scaleTo(0.2, 0)
            ));
            pp.runAction(cc.sequence(
                cc.delayTime(0.06*index),
                cc.scaleTo(0.2, 1),
                cc.delayTime(0.25),
                cc.moveTo(0.6, destPos).easing(cc.easeOut(1.5)),
                cc.fadeOut(0.2),
                cc.callFunc(() => {
                    if (index === bricks.length-1) {
                        this.gameController.endGame();
                        this.showAward();
                    }
                })
            ));
        }); 
    }
    // update (dt) {},
});