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
    BRICK_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        user: cc.Node, // 用户移动的方块
        begin: cc.Node, // 开始的方块
        empty1: cc.Node, // 空格子 （3,2） 左下角第一个是（1,1）
        empty2: cc.Node, // 空格子 （3,3） 左下角第一个是（1,1）
        empty3: cc.Node, // 空格子 （4,3） 左下角第一个是（1,1）
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            brickStatus: BRICK_STATUS.CAN_MOVE, // 可选择方块片的状态
            groupDelay: 40, // 分组判断延时
            lastGroupTime: 0, // 上次分组时间
            lastGroup: null, // 上次选中的分组
            brickDistance: -50, // 上次选中的分组
            isGameStarted: false, // 用户有没有开始游戏
            isFirstBrick: true, // 是不是第一张方块
            isSecondBrick: false, // 是不是第一张方块
            brickWidth: 97,
            brickHeight: 141,
            // inputBox: [ // 输入位置
            //     cc.v2(this.kong1.position.x, this.kong1.position.y-200),
            //     cc.v2(this.kong2.position.x, this.kong2.position.y-150),
            //     cc.v2(this.kong3.position.x, this.kong3.position.y-100),
            //     cc.v2(this.kong4.position.x, this.kong4.position.y-50),
            // ],
        };
        this.setBrickClickListener();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setBrickClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        // console.log('touch start, ', this.gameInfo.brickStatus === BRICK_STATUS.CAN_MOVE);
        if (this.gameInfo.brickStatus === BRICK_STATUS.CAN_MOVE) {
            // if (!this.gameInfo.isGameStarted) {
            //     this.gameInfo.isGameStarted = true;
            //     this.hideSwipeHint();
            // }
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (!this.isTouchInBrick2(touchPos)) {
                // 如果点击的不是可选择方块片
                return;
            }
            this.gameInfo.lastGroupTime = Date.now();
            this.setBrickStatus(BRICK_STATUS.IS_MOVE);
            let beginSprite = this.begin.getChildByName('kuai1').getComponent(cc.Sprite);
            let userSprite = this.user.getChildByName('kuai1').getComponent(cc.Sprite);
            userSprite.spriteFrame = beginSprite.spriteFrame;
            this.user.active = true;
            this.begin.active = false;
            this.user.position = cc.v2(this.begin.position.x, this.begin.position.y);
        }
    },
    onTouchMove (touch) {
        // console.log('touch move, ', this.gameInfo.brickStatus === BRICK_STATUS.IS_MOVE);
        if (this.gameInfo.brickStatus === BRICK_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+70);
            // console.log('touch move, ', touchPos);
            this.user.position = touchPos;
            // this.checkGroup(touchPos, false);
        }
    },
    onTouchEnd (touch) {
        return;
        if (this.gameInfo.brickStatus === BRICK_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+50);
            this.user.active = false;
            // 用户真正选择的分组
            let group = this.checkGroup(touchPos, true);
            // console.log('-- onTouchEnd, 用户选择分组:', group);
            this.deactivateLastGroup();
            
            if (!group) { // 如果没放到方块牌组里去
                this.brick2.active = true;
                this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                return;
            } else { // 如果放到了方块牌组里面去
                if (this.gameInfo.isFirstBrick) {
                    // 如果是第一次放，只能放到第一组
                    if (group !== CARD_GROUP.KONG1) {
                        this.brick2.active = true;
                        this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                        return;
                    } else {
                        this.gameInfo.isFirstBrick = false;
                        this.gameInfo.isSecondBrick = true;
                        this.changeSwipeHand();
                    }
                } else if (this.gameInfo.isSecondBrick) {
                    // 如果是第二次放，只能放到第二组
                    if (group !== CARD_GROUP.KONG2) {
                        this.brick2.active = true;
                        this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                        return;
                    } else {
                        this.hideSwipeHand();
                        this.gameInfo.isSecondBrick = false;
                        this.changeTimeout && clearTimeout(this.changeTimeout);
                    }
                }
                this.setBrickStatus(BRICK_STATUS.DONE_MOVE);
                let nowBrick = this.gameController.gameModel.getNowBrick();
                this.putBrickIntoGroup(group, nowBrick);
            }
        }
    },

    /**生成新的方块 */
    createNewBrick () {
        let newBrickValue = this.gameController.gameModel.generateNewBrick();
        // console.log('createNewBrick, newBrickValue', newBrickValue, ' brickindex: ',CARD_VALUE.indexOf(newBrickValue));
        this.brick2.scale = 0.836;
        this.brick2.position = cc.v2(this.brick1.position.x, this.brick1.position.y);
        this.brick2.getComponent(cc.Sprite).spriteFrame = this.brick1.getComponent(cc.Sprite).spriteFrame;
        this.brick2.active = true;
        this.brick1.getComponent(cc.Sprite).spriteFrame = this.brickSprites[CARD_VALUE.indexOf(newBrickValue)];
        this.brick2.runAction(cc.spawn(
            cc.moveTo(0.1, cc.v2(10.47, -267.314)),
            cc.scaleTo(0.1, 1),
        ));
    },

    /**判断是否选择方块片 */
    isTouchInBrick2 (touchPos) {
        const x1 = this.begin.position.x - this.begin.getChildByName('kuai1').width/2;
        const x2 = this.begin.position.x + this.begin.getChildByName('kuai1').width/2;
        const y1 = this.begin.position.y - this.begin.getChildByName('kuai1').height/2;
        const y2 = this.begin.position.y + this.begin.getChildByName('kuai1').height/2;
        if (touchPos.x >= x1 && touchPos.x <= x2 && touchPos.y >= y1 && touchPos.y <= y2) { return true; }
        else return false;
    },

    setBrickStatus (status) {
        this.gameInfo.brickStatus = status;
    },

    /**检查用户想把方块放入哪一组, 返回group名字或者null */
    checkGroup (brickPos, isTouchEnd = false) {

        let groupName = null;
        if (Date.now() - this.gameInfo.lastGroupTime >= this.gameInfo.groupDelay || isTouchEnd) {
            const groups = [CARD_GROUP.KONG1, CARD_GROUP.KONG2, CARD_GROUP.KONG3, CARD_GROUP.KONG4];
            const leastY = -148.5;
            const lastY = 342.6;
            if (brickPos.y >= leastY && brickPos.y <= lastY) {
                let groupIndex = this.gameInfo.inputBox.findIndex(item => {
                    if (brickPos.x > (item.x - this.gameInfo.brickWidth/2) &&
                        brickPos.x < (item.x + this.gameInfo.brickWidth/2) &&
                        brickPos.y > (item.y - this.gameInfo.brickHeight/2) &&
                        brickPos.y < (item.y + this.gameInfo.brickHeight/2)) {
                        return true;
                    } else return false;
                });
                if (groupIndex > -1) {
                    groupName = groups[groupIndex];
                    let groupPos = this.gameInfo.inputBox[groupIndex];
                    this.deactivateLastGroup();
                    this.kongBox.position = groupPos;
                    if (this.gameInfo.brickStatus === BRICK_STATUS.IS_MOVE) {
                        this.kongBox.active = true;
                    }
                    this.gameInfo.lastGroupTime = Date.now();
                    return groupName;
                } else {
                    this.deactivateLastGroup();
                }
            } else {
                this.deactivateLastGroup();
            }
        }
        return groupName;
    },
    
    deactivateLastGroup () {
        this.kongBox.active = false;
    },

    // update (dt) {},
});
