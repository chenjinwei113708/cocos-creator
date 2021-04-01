import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';
import { scaleIn, flyTo, animInfo } from '../Utils/Animation';
import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        block1Img: { type: cc.SpriteFrame, default: null },
        block0Img: { type: cc.SpriteFrame, default: null },
        treasureBoxOpenImg: { type: cc.SpriteFrame, default: null },
        block2: { type: cc.Node, default: null },
        emptyBox: { type: cc.Node, default: null }, // 存放空白方块的盒子
        noEmptyBox: { type: cc.Node, default: null }, // 装有数值的方块的盒子
        nextBlocks: { type: cc.Node, default: null },
        grid: { type: cc.Node, default: null }, // 棋盘
        emptyBlock: { type: cc.Prefab, default: null }, // 空白格子的预制资源
        lighting: { type: cc.Prefab, default: null }, // 闪电
        // ppIcon: { type: cc.Prefab, default: null }, // 从宝箱生成的ppIcon
        ppIcons: {
            type: cc.Node,
            default: []
        },
        lightBox: { type: cc.Node, default: null }, // 装有闪电的盒子
        lightingPos: {
            type: cc.Node,
            default: []
        },
        // treasureBox: { type: cc.Node, default: [] },
        mask: { type: cc.Node, default: null },
        tips: {
            type: cc.Node,
            default: []
        }
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad() {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('$ ', 'head');
        // this.showHandDrag();
        // this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_CLICK1);
        this.showTip(1);
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /**获取游戏状态 */
    getGameStatus () {
        return this.gameInfo.status;
    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED // 初始设置为不可点击状态
        }

        // 闪电参数
        this.currentLightingIndex = 0;
        this.lightingInfo = [
            { angle: 0 },
            { angle: 0 },
            { angle: 90 },
            { angle: 0 }
        ]

        // ppIcon
        this.currentPPIndex = 0;

        // 左上角提示
        this.tipBlocks = [...this.nextBlocks.children].reverse();
        this.currentTipBlock = 0;

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )
        
        // 播放金钱的节流函数
        this.moneyMusicThrottle = this.getThrottle(() => {
            this.audioUtils.playEffect('money', 0.7);
        }, 200)

    },

    /**节流函数 */
    getThrottle (fn, delay = 100) {
        let timer = null;
        return function (...args) {
            const _this = this; // 执行这个函数所在的this
            if (timer) return false;
            timer = setTimeout(() => {
                fn.apply(_this, args);
                clearTimeout(timer);
                timer = null;
            }, delay)
        }
    },

    /**展示提示1 */
    showTip (num) {
        const tip = this.tips[num - 1];
        tip.active = true;
        // 使tip放大缩小
        tip.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
                tip.runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.6, 0.95),
                    cc.scaleTo(0.6, 1)
                )))
            })
        ))
        // 出现引导手
        this.guideView.showHand(tip);
        
    },

    /**隐藏提示1 */
    hideTip (num) {
        const tip = this.tips[num - 1];
        tip.stopAllActions();
        tip.runAction(cc.fadeOut(0.2));
        this.guideView.stopHand();
    },

    /**切换mask的显示状态 
     * @param type 如果为 in 则表示显示 如果为out 则表示隐藏
    */
     toggleMask (type) {
        const fadeTime = 0.5;
        const maxOpacity = 125;
        const isActive = this.mask.active;

        if (type === 'out' || (type === undefined && isActive === true)) {
            // 隐藏
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeOut(fadeTime),
                cc.callFunc(() => {
                    this.mask.active = false;
                })
            ))
        } else if ( type === 'in' || (type === undefined && isActive === false)) {
            this.mask.opacity = 0;
            this.mask.active = true;
            // 显示
            // console.log('in')
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeTo(fadeTime, maxOpacity),
                cc.callFunc(() => {
                    // this.mask.active = true;
                })
            ))
        }
    },

    /**获取做根据node2的坐标前提是要有parent */
    getPos (node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },

    /**点击事件移动 */
    onTouchStart (e) {

    },

    /**点击事件结束 */
    onTouchEnd (e) {

    },

    /**处理第一步点击 */
    handleClick1 (e) {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK1) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        this.hideTip(1);
        this.audioUtils.playEffect('bgClick');
        this.showNextBlock();

        console.log('点击了第一步');
        const target = e.target;
        const delay = 0.2;

        // 将点击的目标放在noEmptyBox里面
        const worldPos = target.parent.convertToWorldSpaceAR(target);
        target.parent = this.noEmptyBox;
        target.position = this.noEmptyBox.convertToNodeSpaceAR(worldPos);
        
        // block2 变为 1
        this.block2.runAction(cc.sequence(
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 减1
                this.block2.getComponent(cc.Sprite).spriteFrame = this.block1Img;
                this.block2.opacity = 255
            })
        ))

        // 变为 1 并且消失为 0
        target.runAction(cc.sequence(
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 显示并且更换图片
                target.getComponent(cc.Sprite).spriteFrame = this.block1Img;
                target.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 显示闪电
                this.makeLighting();
                this.audioUtils.playEffect('fresh', 0.2);
                // 换为新图片
                target.getComponent(cc.Sprite).spriteFrame = this.block0Img;
                // 重新显示
                target.opacity = 255;
                // 更改游戏状态
                this.setGameStatus(GAME_STATUS.CAN_CLICK2);
                this.showTip(2);
            })
        ))
    },

    /**处理第二部点击 */
    handleClick2 (e) {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK2) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        this.hideTip(2);
        this.audioUtils.playEffect('bgClick');
        this.showNextBlock();

        // console.log('点击了第二步');
        const target = e.target;
        const delay = 0.2;

        // 设置最后面的回调
        const callBack = () => {
            // 缩小其余所有空白方块, 并生成灰色方块然后飞向计分处
            const smallOutTime = 0.2;
            let isPlayMusic = false;
            let isCallback1 = false;
            let isCallback2 = false;

            this.emptyBox.children.forEach((node, index) => {
                if (!isPlayMusic) {
                    isPlayMusic = true;
                    this.audioUtils.playEffect('correct');
                }
                node.runAction(cc.sequence(
                    cc.scaleTo(smallOutTime, 0),
                    cc.callFunc(() => {
                        // 隐藏闪电
                        const fadeOutTime = 0.2;
                        this.lightBox.runAction(cc.sequence(
                            cc.fadeOut(fadeOutTime),
                            cc.callFunc(() => {
                                this.lightBox.active = false;
                            })
                        ))
                        // 缩到最小的时候更换图片
                        node.getComponent(cc.Sprite).spriteFrame = this.block0Img;
                        // 然后再放大
                        scaleIn(node).then(() => {
                            // 最后飞向计分处 cash
                            if (isCallback1) return false;
                            isCallback1 = true;
                            this.grid.children.forEach(child => {
                                child.children.forEach((childNode, index) => {
                                    // 设置成随机飞向
                                    setTimeout(() => {
                                        flyTo(childNode, this.cashView.node);
                                        setTimeout(() => {
                                            this.moneyMusicThrottle();
                                        }, animInfo.flyTime * 1000)
                                    }, Math.random() * 1000)
                                    // 飞向记分板之后的回调
                                    if (!isCallback2) {
                                        isCallback2 = true;
                                        setTimeout(() => {
                                            // 增加记分板
                                            this.cashView.addCash(200);
                                            // 增加进度条
                                            this.progressView.setProgress(1 / 3, 1 / 3).then(() => {
                                                // this.openTreasureBox();
                                                this.shakePPicons();
                                                this.progressView.setProgress(2 / 3, 1 / 3).then(() => {
                                                    // this.openTreasureBox();
                                                    this.shakePPicons();
                                                    this.progressView.setProgress(1, 1 / 3).then(() => {
                                                        // this.openTreasureBox(); // 打开宝箱
                                                        this.shakePPicons(); // 晃动ppIcon
                                                        // 延迟一段时间再触发胜利
                                                        setTimeout(() => {
                                                            this.audioUtils.playEffect('cheer');
                                                            this.toggleMask();
                                                            this.awardView.showAwardPage().then(() => {
                                                                this.guideView.showHand(this.tips[2]);
                                                                this.gameController.endGame();
                                                            });
                                                        }, 500)
                                                    })
                                                })
                                            });
                                        }, animInfo.flyTime * 1000)
                                    }
                                })
                            })
                        });
                    }),
                ))
            })
            // 
        }

        // 将点击的目标放在noEmptyBox里面
        const worldPos = target.parent.convertToWorldSpaceAR(target);
        target.parent = this.noEmptyBox;
        target.position = this.noEmptyBox.convertToNodeSpaceAR(worldPos);
        
        // block2 变为 1
        this.block2.runAction(cc.sequence(
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                this.block2.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 减1
                this.block2.getComponent(cc.Sprite).spriteFrame = this.block0Img;
                this.block2.opacity = 255
            })
        ))

        // 变为 1 并且消失为 0
        target.runAction(cc.sequence(
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 显示并且更换图片
                target.getComponent(cc.Sprite).spriteFrame = this.block1Img;
                target.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 255;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                target.opacity = 0;
            }),
            cc.delayTime(delay),
            cc.callFunc(() => {
                // 显示闪电
                this.makeLighting();
                this.makeLighting();
                this.makeLighting();
                this.audioUtils.playEffect('fresh', 0.2);
                // 换为新图片
                target.getComponent(cc.Sprite).spriteFrame = this.block0Img;
                // 重新显示
                target.opacity = 255;
                // 更改游戏状态
                this.setGameStatus(GAME_STATUS.DISABLED);
                // 延迟一段时间进行回调
                setTimeout(() => {
                    callBack && callBack();
                }, delay * 2000)
            })
        ))
    },

    /**制造闪电 */
    makeLighting () {
        const lighting = cc.instantiate(this.lighting);
        const currentInfo = this.lightingInfo[this.currentLightingIndex]; // 获取当前的闪电配置
        lighting.parent = this.lightBox;
        lighting.position = this.getPos(lighting, this.lightingPos[this.currentLightingIndex]);
        for (const key in currentInfo) {
            lighting[key] = currentInfo[key];
        }
        this.currentLightingIndex++;
    },

    /**打开奖励宝箱 */
    openTreasureBox () {
        // 获取当前宝箱并 更换为打开的图片
        const current = this.treasureBox[this.currentTreasureBoxIndex++];
        current.getComponent(cc.Sprite).spriteFrame = this.treasureBoxOpenImg;
        
        // 获得ppicon并初始化
        const ppIcon = cc.instantiate(this.ppIcon);
        ppIcon.scale = 0;
        ppIcon.parent = current;
        ppIcon.position = cc.v2(0, 0);
        this.ppIcons.push(ppIcon);

        // 宝箱向下移动 pp从宝箱出来
        const time = 0.4;

        current.runAction(cc.spawn(
            cc.moveBy(time, cc.v2(0, -30)),
            cc.callFunc(() => {
                ppIcon.runAction(cc.spawn(
                    cc.moveBy(time, cc.v2(0, 60)),
                    cc.scaleTo(time, 1)
                ))
            })
        ))
    },

    /**展示下一个左上角的pp */
    showNextBlock () {
        const animTime = 0.3;
        this.tipBlocks.forEach((node, index) => {
            if (index == 0) {
                node.active = 0;
            } else if (index === 1) {
                node.runAction(cc.spawn(
                    cc.moveBy(animTime, cc.v2(0, -20)),
                    cc.scaleTo(animTime, 1)
                ))
            } else if (index === 2) {
                node.runAction(cc.spawn(
                    cc.moveBy(animTime, cc.v2(0, -20)),
                    cc.scaleTo(animTime, 0.8)
                ))
            } else if (index === 3) {
                const pos = node.position;
                node.position = cc.v2(pos.x, pos.y + 40);
                node.scale = 0.6;
                node.active = true;
            }
        })
        setTimeout(() => {
            this.tipBlocks.shift();
        })
    },

    /**使ppIcon摆动 */
    shakePPicons () {
        console.log(this.ppIcons, this.currentPPIndex)
        const current = this.ppIcons[this.currentPPIndex++];
        current.isShake = true;
        this.ppIcons.forEach(ppIcon => {
            if (ppIcon.isShake) {
                // 停止摆动
                ppIcon.stopAllActions();
                ppIcon.runAction(cc.sequence(
                    cc.rotateTo(0.1, 0),
                    cc.callFunc(() => {
                        // 不断摆动
                        ppIcon.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.rotateTo(0.15, 15),
                                cc.rotateTo(0.3, -15),
                                cc.rotateTo(0.15, 0)
                            )
                        ))
                    })
                ))
            }
        })
    },

    /**
     * 判断点击是否在node里面
     * @param {*} e 点击事件
     * @param {cc.Node} node 判断点击事件是否在里面的节点
     * @returns {Boolean}
     */
    checkPosByNode (e, node) {
        const touchPos = e.touch._point;
        const pos = node.parent.convertToWorldSpaceAR(node.position);
        const offsetX = node.width / 2;
        const offsetY = node.height / 2;

        if (touchPos.x <= pos.x + offsetX && touchPos.x >= pos.x - offsetX && touchPos.y <= pos.y + offsetY && touchPos.y >= pos.y - offsetY) {
            // console.log('在里面')
            return true;
        } else {
            // console.log('不在里面');
            return false;
        }
    },
// 点击事件相关结束---------------------------------------------------------------------

// guide相关----------------------------------------------------------------------------
    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**显示拖拽手 */
    showHandDrag (nodeArr, type) {
        // console.log(111)
        this.guideView.showHandDrag(nodeArr, type);
        // this.guideView.showHand(nodeArr[0])
    },

    /**隐藏手 */
    stopHand () {
        this.guideView.stopHand && this.guideView.stopHand();
    },
// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage()
    },
// award相关结束-----------------------------------------------------------------------------

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    }
});
