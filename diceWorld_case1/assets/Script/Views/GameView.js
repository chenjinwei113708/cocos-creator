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
    BRICK_STATUS,
    BRICK_BOX
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        user: cc.Node, // 用户移动的方块
        begin: cc.Node, // 开始的方块
        empty1: cc.Node, // 空格子 （3,2） 左下角第一个是（1,1）
        empty2: cc.Node, // 空格子 （3,3） 左下角第一个是（1,1）
        empty3: cc.Node, // 空格子 （4,3） 左下角第一个是（1,1）
        kongBox: cc.Node, // 激活状态
        bomb: cc.Node, // 炸弹
        wind: cc.Node, // 旋风
        bombParticle: cc.Node, // 粒子特效
        bombShadow: cc.Node, // 炸弹痕迹
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
            gestureDistance: 70, // 用户手指和移动的方块之间的距离
            brickWidth: 72,
            brickHeight: 72,
            inputOrder: [], // 用户放置的顺序
            inputBox: [ // 输入位置
                cc.v2(this.empty1.position.x, this.empty1.position.y),
                cc.v2(this.empty2.position.x, this.empty2.position.y),
                cc.v2(this.empty3.position.x, this.empty3.position.y),
            ],
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
            touchPos = cc.v2(touchPos.x, touchPos.y+this.gameInfo.gestureDistance);
            // console.log('touch move, ', touchPos);
            this.user.position = touchPos;
            this.checkGroup(touchPos, false);
        }
    },
    onTouchEnd (touch) {
        if (this.gameInfo.brickStatus === BRICK_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            touchPos = cc.v2(touchPos.x, touchPos.y+this.gameInfo.gestureDistance);
            // this.user.active = false;
            // 用户真正选择的分组
            let group = this.checkGroup(touchPos, true);
            console.log('-- onTouchEnd, 用户选择分组:', group);
            this.deactivateLastGroup();
            
            if (!group) { // 如果没放到方块牌组里去
                this.begin.active = true;
                this.user.active = false;
                this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                return;
            } else { // 如果放到了方块牌组里面去
                this.setBrickStatus(BRICK_STATUS.DONE_MOVE);
                this.putBrickIntoGroup(group, 6);
            }
        }
    },

    /**生成新的方块 */
    createNewBrick () {
        this.begin.position = cc.v2(159.108, -495.666);
        this.begin.active = true;
        this.begin.runAction(cc.moveTo(0.3, cc.v2(0, -241.093)));
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
            const groups = [BRICK_BOX.EMPTY1, BRICK_BOX.EMPTY2, BRICK_BOX.EMPTY3];
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

    /**把方块放进空格 */
    putBrickIntoGroup (gourpName, brickValue) {
        // console.log('--- putBrickIntoGroup,', gourpName, ' brickValue:',brickValue);
        this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
        if (this.gameInfo.inputOrder.indexOf(gourpName) > -1) {
            this.user.active = false;
            this.begin.active = true;
            return;
        }
        this.createNewBrick();
        this.user.runAction(cc.sequence(
            cc.moveTo(0.15, cc.v2(this[gourpName].position.x, this[gourpName].position.y)),
            cc.callFunc(() => {
                this[gourpName].active = true;
                this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                // console.log('this[gourpName], ', gourpName, '  ', this[gourpName]);
                this.gameInfo.inputOrder.push(gourpName);
                this.user.active = false;
                // this.createNewBrick();
                if (this.gameInfo.inputOrder.length >= 3) {
                    this.setBrickStatus(BRICK_STATUS.DONE_MOVE);
                    this.generateBomb(gourpName);
                }
            })
        ));
    },
    
    /**生成炸弹, 生成炸弹的点 */
    generateBomb (groupName) {
        console.log('generateBomb---,', groupName);
        let destNode = this[groupName];
        this.gameInfo.inputOrder.splice(this.gameInfo.inputOrder.indexOf(groupName), 1);
        this.gameInfo.inputOrder.forEach((brickName, index) => {
            this[brickName].runAction(cc.sequence(
                cc.moveTo(0.1, cc.v2(destNode.position.x, destNode.position.y)),
                cc.callFunc(() => {
                    this[brickName].opacity = 0;
                    if (index!==1) return;
                    destNode.runAction(cc.sequence(
                        cc.scaleTo(0.07, 1.1),
                        cc.scaleTo(0.1, 0.1),
                        cc.callFunc(() => {
                            this.bomb.position = destNode.position;
                            this.bomb.scale = 0.3;
                            this.bomb.opacity = 0;
                            this.bomb.active = true;
                            destNode.runAction(cc.fadeOut(0.15));
                            this.bomb.runAction(cc.sequence(
                                cc.fadeIn(0.1),
                                cc.scaleTo(0.1, 1),
                                cc.callFunc(() => {
                                    this.bombShadow.position = destNode.position;
                                    this.wind.position = destNode.position;
                                    this.bombParticle.position = destNode.position;
                                    this.showBombEffect();
                                })
                            ));
                        }),
                    ));
                })
            ));
        });
    },

    showBombEffect () {
        this.wind.opacity = 0;
        this.wind.scale = 0.7;
        this.wind.active =true;
        this.bomb.runAction(cc.sequence(
            cc.scaleTo(0.4, 0.9),
            cc.spawn(
                cc.scaleTo(0.3, 1.2),
                cc.fadeOut(0.35)
            ),
            cc.callFunc(() => {
                this.node.runAction(cc.sequence(
                    cc.moveTo(0.1, cc.v2(5,5)),
                    cc.moveTo(0.1, cc.v2(-6,-3)),
                    cc.moveTo(0.1, cc.v2(5,-1)),
                    cc.callFunc(() => {
                        this.clearAllBricks();
                    }),
                    cc.moveTo(0.1, cc.v2(-2,5)),
                    cc.moveTo(0.1, cc.v2(0,0)),
                ));
                this.bombParticle.getComponent(cc.ParticleSystem).life = 0.5;
                this.bombParticle.getComponent(cc.ParticleSystem).emissionRate = 500;
                this.bombParticle.getComponent(cc.ParticleSystem).duration = 0.5;
                this.bombParticle.getComponent(cc.ParticleSystem).resetSystem();
            })
        ));
        this.wind.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(0.1, 250),
                cc.rotateBy(0.1, 30),
            ),
            cc.spawn(
                cc.fadeOut(1.5),
                cc.rotateBy(1.2, 360),
                cc.scaleTo(0.4, 0.4),
            ),
            
        ));
    },

    clearAllBricks () {
        let bricks = [
            ...cc.find('Canvas/center/game/bricks/a').children,
            ...cc.find('Canvas/center/game/bricks/b').children,
            ...cc.find('Canvas/center/game/bricks/c').children,
            ...cc.find('Canvas/center/game/bricks/d').children,
            ...cc.find('Canvas/center/game/bricks/e').children,
        ];
        bricks.forEach(item => {
            item.runAction(cc.fadeOut(0.3));
        });
    },

    deactivateLastGroup () {
        this.kongBox.active = false;
    },

    // update (dt) {},
});
