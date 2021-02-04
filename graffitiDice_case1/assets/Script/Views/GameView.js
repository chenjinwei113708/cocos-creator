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
        beginTouch: cc.Node, // 开始方块的位置
        endTouch: cc.Node, // 结束方块的位置
        empty1: cc.Node, // 空格子 （3,3） 左下角第一个是（1,1）
        empty2: cc.Node, // 空格子 （3,4） 左下角第一个是（1,1）
        kongBox: cc.Node, // 激活状态
        bricks: cc.Node, // 格子
        bomb: cc.Node, // 炸弹
        wind: cc.Node, // 旋风
        bombParticle: cc.Node, // 粒子特效
        bombShadow: cc.Node, // 炸弹痕迹
        guideHand: cc.Node, // 提示
        guideDesc: cc.Node, // 提示
        brick6Spriteframe: cc.SpriteFrame // 方块6的图
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
            ],
        };
        // 所有格子 视图坐下角格子的坐标是（1， 1），x代表行，y代表列
        this.allBricks = [
            undefined,
            [undefined, ...this.bricks.getChildByName('e').children],
            [undefined, ...this.bricks.getChildByName('d').children],
            [undefined, ...this.bricks.getChildByName('c').children],
            [undefined, ...this.bricks.getChildByName('b').children],
            [undefined, ...this.bricks.getChildByName('a').children],
        ];
        this.setBrickClickListener();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setBrickClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    },

    onTouchStart (touch) {
        // console.log('touch start, ', this.gameInfo.brickStatus === BRICK_STATUS.CAN_MOVE);
        if (this.gameInfo.brickStatus === BRICK_STATUS.CAN_MOVE) {
            if (!this.gameInfo.isGameStarted) {
                this.gameInfo.isGameStarted = true;
                this.hideGuide();
            }
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (!this.isTouchInBrick2(touchPos)) {
                // 如果点击的不是可选择方块片
                return;
            }
            this.gameInfo.lastGroupTime = Date.now();
            this.setBrickStatus(BRICK_STATUS.IS_MOVE);
            // let beginSprite = this.begin.getChildByName('kuai1').getComponent(cc.Sprite);
            // let userSprite = this.user.getChildByName('kuai1').getComponent(cc.Sprite);
            // userSprite.spriteFrame = beginSprite.spriteFrame;
            this.user.active = true;
            this.begin.active = false;
            this.user.position = cc.v2(touchPos.x, touchPos.y+this.gameInfo.gestureDistance);
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
            console.log('-- onTouchEnd, 用户放到了指定位置:', group);
            this.deactivateLastGroup();
            
            if (!group) { // 如果没放到方块牌组里去
                this.begin.active = true;
                this.user.active = false;
                this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
                return;
            } else { // 如果放到了方块牌组里面去
                this.user.active = false;
                this.empty1.active = true;
                this.empty2.active = true;
                this.setBrickStatus(BRICK_STATUS.DONE_MOVE);
                this.putBrickIntoGroup(group);
            }
        }
    },

    /**生成新的方块 */
    createNewBrick () {
        this.begin.position = cc.v2(159.108, -495.666);
        // this.begin.getChildByName('kuai1').getComponent(cc.Sprite).spriteFrame = this.brick6Spriteframe;
        this.begin.active = true;
        this.begin.runAction(cc.moveTo(0.3, cc.v2(0, -241.093)));
    },

    /**判断是否选择方块片 */
    isTouchInBrick2 (touchPos) {
        const x1 = this.beginTouch.position.x - this.beginTouch.width/2;
        const x2 = this.beginTouch.position.x + this.beginTouch.width/2;
        const y1 = this.beginTouch.position.y - this.beginTouch.height/2;
        const y2 = this.beginTouch.position.y + this.beginTouch.height/2;
        if (touchPos.x >= x1 && touchPos.x <= x2 && touchPos.y >= y1 && touchPos.y <= y2) { return true; }
        else return false;
    },

    setBrickStatus (status) {
        this.gameInfo.brickStatus = status;
    },

    /**检查用户想把方块放入哪一组, 返回group名字或者null */
    checkGroup (brickPos, isTouchEnd = false) {

        if (brickPos.x > (this.endTouch.x - this.endTouch.width/2) &&
            brickPos.x < (this.endTouch.x + this.endTouch.width/2) &&
            brickPos.y > (this.endTouch.y - this.endTouch.height/2) &&
            brickPos.y < (this.endTouch.y + this.endTouch.height/2)) {
            return true;
        } else return false;

        // this.deactivateLastGroup();
        
    },

    /**把方块放进空格 */
    putBrickIntoGroup (gourpName, brickValue) {
        // console.log('--- putBrickIntoGroup,', gourpName, ' this.allBricks:',this.allBricks);
        let stars = [this.allBricks[2][3], this.allBricks[3][2], this.allBricks[4][3]];
        let destNode = this.allBricks[3][3];
        let destPos = cc.v2(destNode.position.x, destNode.position.y);

        stars.forEach((node, index) => {
            node.runAction(cc.sequence(
                cc.delayTime(0.1*index),
                cc.moveTo(0.15, destPos),
                cc.callFunc(() => {
                    node.opacity = 0;
                    if (index === stars.length-1) {
                        this.generateBomb(destNode);
                    }
                })
            ));
        });
        // this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
        // // 最开始第一个只允许放在第一 第二个空格
        // if (this.gameInfo.inputOrder.length === 0 && (gourpName===BRICK_BOX.EMPTY3 || gourpName===BRICK_BOX.EMPTY4)){
        //     this.user.active = false;
        //     this.begin.active = true;
        //     return;
        // }
        // // 如果这个位置已经放了，就不能再放
        // if (this.gameInfo.inputOrder.indexOf(gourpName) > -1) {
        //     this.user.active = false;
        //     this.begin.active = true;
        //     return;
        // }
        // this.createNewBrick();
        // this.user.runAction(cc.sequence(
        //     cc.moveTo(0.15, cc.v2(this[gourpName].position.x, this[gourpName].position.y)),
        //     cc.callFunc(() => {
        //         this[gourpName].active = true;
        //         this.setBrickStatus(BRICK_STATUS.CAN_MOVE);
        //         // console.log('this[gourpName], ', gourpName, '  ', this[gourpName]);
        //         this.gameInfo.inputOrder.push(gourpName);
        //         this.user.active = false;
        //         // this.createNewBrick();
        //         if (this.gameInfo.inputOrder.length === 1) {
        //             this.generateSix(gourpName);
        //         }
        //         if (this.gameInfo.inputOrder.length >= 3) {
        //             this.setBrickStatus(BRICK_STATUS.DONE_MOVE);
        //             this.generateBomb(gourpName);
        //         }
        //     })
        // ));
    },

    /**生成方块6,  groupName：生成方块6的点*/
    generateSix (groupName) {
        console.log('generateSix---,', groupName);
        let destNode = this[groupName];
        let fives = [BRICK_BOX.EMPTY3, BRICK_BOX.EMPTY4];
        let originPos = {
            [BRICK_BOX.EMPTY3]: cc.v2(this[BRICK_BOX.EMPTY3].position.x, this[BRICK_BOX.EMPTY3].position.y),
            [BRICK_BOX.EMPTY4]: cc.v2(this[BRICK_BOX.EMPTY4].position.x, this[BRICK_BOX.EMPTY4].position.y),
        }
        fives.forEach((brickName, index) => {
            this[brickName].runAction(cc.sequence(
                cc.moveTo(0.1, cc.v2(destNode.position.x, destNode.position.y)),
                cc.callFunc(() => {
                    this[brickName].opacity = 0;
                    if (index===1) {
                        destNode.runAction(cc.sequence(
                            cc.scaleTo(0.07, 1.1),
                            cc.scaleTo(0.1, 0.1),
                            cc.callFunc(() => {
                                this[BRICK_BOX.EMPTY1].getChildByName('kuai1').getComponent(cc.Sprite).spriteFrame = this.brick6Spriteframe;
                                this[BRICK_BOX.EMPTY2].getChildByName('kuai1').getComponent(cc.Sprite).spriteFrame = this.brick6Spriteframe;
                                this.gameController.addCash(100);
                                
                            }),
                            cc.scaleTo(0.1, 1),
                            cc.delayTime(0.25),
                            cc.callFunc(() => {
                                this.gameController.guideView.showPaypalCardFly();
                            })
                        ));
                    }
                    this[brickName].position = originPos[brickName];
                    this[brickName].getChildByName('kuai1').getComponent(cc.Sprite).spriteFrame = this.brick6Spriteframe;
                    this[brickName].active = false;
                    this[brickName].opacity = 255;
                }),
            ));
        });
    },
    
    /**生成炸弹, 生成炸弹的点 */
    generateBomb (destNode) {
        // console.log('generateBomb---,', groupName);
        // let destNode = this[groupName];
        // destNode.active = false;
        // this.user.active = false;
        // this.empty1.active = false;
        // this.empty2.active = false;
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
                    cc.moveBy(0.1, cc.v2(5,5)),
                    cc.moveBy(0.1, cc.v2(-11,-8)),
                    cc.moveBy(0.1, cc.v2(16,7)),
                    cc.moveBy(0.1, cc.v2(-10,-4)),
                    cc.callFunc(() => {
                        this.clearAllBricks();
                        this.bombShadow.opacity = 0;
                        this.bombShadow.active = true;
                        this.bombShadow.runAction(cc.sequence(
                            cc.fadeIn(0.1),
                            cc.delayTime(1),
                            cc.fadeOut(0.5)
                        ));
                        this.gameController.addCash(300);
                        setTimeout(() => {
                            this.gameController.progressView.setProgress(1);
                        }, 200);
                        this.gameController.guideView.showPaypalCardFly(() => {
                            // this.gameController.guideView.showCashoutHand();
                            this.showGift();
                        });
                    }),
                    cc.moveBy(0.1, cc.v2(-18,-2)),
                    cc.moveBy(0.1, cc.v2(18,2)),
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
                cc.fadeOut(1.2),
                cc.rotateBy(1.2, 360),
                cc.scaleTo(0.4, 0.4),
            ),
            
        ));
    },

    showGift () {
        let mask = cc.find('Canvas/center/game/mask');
        let gift = cc.find('Canvas/center/game/gift');
        let giftHand = cc.find('Canvas/center/game/gift/hand');
        let mask2 = cc.find('Canvas/center/UI/downloadMask');

        mask.opacity = 0;
        mask.active = true;
        mask.runAction(cc.fadeTo(0.3, 150));

        mask2.active = true; // 全局点击可下载

        gift.scale = 0;
        gift.active = true;
        gift.runAction(cc.sequence(
            cc.scaleTo(0.4, 1),
            cc.callFunc(() => {
                this.gameController.endGame();
                this.gameController.guideView.myFadeIn(giftHand, () => {
                    this.gameController.guideView.myClickHere(giftHand);
                });
            })
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

    hideGuide () {
        this.guideHand.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.guideHand.getComponent(cc.Animation).stop();
                this.guideHand.active = false;
            }),
        ));
        this.guideDesc.runAction(cc.fadeOut(0.3));
    },

    deactivateLastGroup () {
        this.kongBox.active = false;
    },

    // update (dt) {},
});
