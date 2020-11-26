// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME, DIRECTION, TIP, CELL_TYPE, GRID_PIXEL_HEIGHT } from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        // 金币
        coin: {
            type: cc.Sprite,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isSelect = false;

        this.animTip = null;//提示动画效果，指示拖动方向
        this.animTipHere = null;//提示动画效果，原地缩放
        //原地缩放动画
        this.scale = cc.sequence(cc.scaleTo(0.2, 1.05), cc.scaleTo(0.1, 1.03), cc.scaleTo(0.1, 1.05),
            cc.scaleTo(0.1, 1.04), cc.scaleTo(0.1, 1.03), cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1));
        this.animTipHere = cc.repeatForever(this.scale);
        this.model = null; // 方块模型
        //用来记录提示开始时的位置
        // this.tipX=-1;
        // this.tipY=-1;
    },

    start () {

    },

    /**
     * 初始化某个格子的视图,以及它所处的位置
     * @param {*} model 列表中的某个格子模型 
     */
    initWithModel: function (model) {
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.x = CELL_WIDTH * (x - 0.5);
        this.node.y = CELL_HEIGHT * (y - 0.5);
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.stop();
        this.node.opacity = 0;

        // 如果有金币就显示
        if(model.getHasGold()){
            this.showCoin();
        }
        // if (model.status == CELL_STATUS.COMMON) { //如果这个动物的状态是常态，就不要播放动画
        //     this.animation.stop();
        //     // animation.play();
        // } else { //如果这个动物的状态是其他状态
        //     this.animation.play(model.status); //就根据它的状态来播放动画效果
        // }
    },

    /** 播放入场动画 */
    playAppearAnim (number) {
        let desPos = {
            x: this.node.x,
            y: this.node.y,
        };
        this.node.position = cc.v2(this.node.x, this.node.y+45);
        setTimeout(() => {
            this.node.runAction(cc.spawn(
                cc.fadeIn(0.3),
                cc.moveTo(0.3, desPos)
            ));
        }, number*10);
        
    },

    /**在自己的位置上进行提示 */
    setTipHere(){
        // console.log('tipHere');
        // this.node.runAction(this.animTipHere);
        this.animation.play();
    },

    /**停止原地提示 */
    stopTipHere() {
        // this.node.stopAction(this.animTipHere);
        this.animation.stop();
        this.node.runAction(cc.scaleTo(0.3, 1));
    },

    /** 显示金币 */
    showCoin () {
        this.coin.node.active = true;
    },

    /** 隐藏金币 */
    hideCoin () {
        this.coin.node.active = false;
    },

    /** 让当前方块消失 */
    disappear () {
        var action = cc.fadeOut(ANITIME.FADEOUT);
        // 执行一串动作
        cc.tween(this.node)
            .then(action)
            .removeSelf() // 移除自己
            .start(); // 开始执行
    },

    /**
     * 移动
     * @param {*} direction 移动方向
     * @param {*} step 移动步数
     * @param {*} nowPosVec2 格子移动前的坐标（当前坐标）
     * @param {*} waitTime 移动前需要等待的时间
     * @return 返回此次移动所需的时间
     */
    move (direction, step, nowPosVec2, waitTime=0) {
        let moveTime = step<5? ANITIME.MOVE*step: 0.4;
        let currentX = (nowPosVec2.x -0.5)*CELL_WIDTH;
        let currentY = (nowPosVec2.y -0.5)*CELL_HEIGHT;
        waitTime = waitTime === 0 ? 0 : waitTime+0.1; // 让下落顺序的效果更明显
        switch(direction) {
            case DIRECTION.DOWN:
                // 执行一串动作
                this.node.runAction(
                    cc.moveTo(moveTime,
                        cc.v2(currentX, currentY-step*CELL_HEIGHT))
                );
                break;
            case DIRECTION.LEFT:
                // 执行一串动作
                let sequence = cc.sequence(
                    cc.delayTime(waitTime),
                    cc.moveTo(moveTime,
                        cc.v2(currentX-step*CELL_WIDTH, currentY))
                );
                this.node.runAction(sequence);
                break;
        }
        return moveTime;
    }

    // update (dt) {},
});
