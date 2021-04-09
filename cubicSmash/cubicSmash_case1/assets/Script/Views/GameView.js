import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';
import { flyTo, animInfo, scaleIn } from '../Utils/Animation';
import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null },
        moveBlock4: { type: cc.Node, default: null },
        moveGuide: { type: cc.Node, default: null },
        tail: { type: cc.Node, default: null },
        bomb: { type: cc.Prefab, default: null },
        bombBox: { type: cc.Node, default: null },
        newBlock8_1: { type: cc.Node, default: null },
        block4_2: { type: cc.Node, default: null },
        block8_2: { type: cc.Node, default: null },
        block16_2: { type: cc.Node, default: null },
        block16_1: { type: cc.Node, default: null },
        block32_1: { type: cc.Node, default: null },
        bombPos: { type: cc.Node, default: [] },
        ppIcon: { type: cc.Node, default: null },
        pps: { type: cc.Node, default: null },
        buttonTip: { type: cc.Node, default: null },
        tips: { type: cc.Node, default: [] },
        dragMask: { type: cc.Node, default: null }
    },

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad() {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('$ ', 'head');
        // this.showHandDrag();
        this.addEventListener();
        // this.setGameStatus(GAME_STATUS.CAN_DRAG);
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /**获取游戏状态 */
    getGameStatus (status) {
        return this.gameInfo.status;
    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED // 初始设置为不可点击状态    
        }

        this.touchInfo = {
            startPos: null,
            movePos: null,
            oriPos: this.moveBlock4.position,
            guideOriPos: this.moveGuide.position
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )

        // 方法节点
        this.playMoneyAudio = Tools.getThrottle(() => {
            this.audioUtils.playEffect('money')
        });
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
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeTo(fadeTime, maxOpacity),
                cc.callFunc(() => {
                    // this.mask.active = true;
                })
            ))
        }
    },

    /**切换dragmask的显示的状态 */
    toggleDragMask (type) {
        const fadeTime = 0.5;
        const maxOpacity = 125;
        const isActive = this.dragMask.active;

        if (type === 'out' || (type === undefined && isActive === true)) {
            // 隐藏
            this.dragMask.stopAllActions();
            this.dragMask.runAction(cc.sequence(
                cc.fadeOut(fadeTime),
                cc.callFunc(() => {
                    this.dragMask.active = false;
                })
            ))
        } else if ( type === 'in' || (type === undefined && isActive === false)) {
            this.dragMask.opacity = 0;
            this.dragMask.active = true;
            // 显示
            this.dragMask.stopAllActions();
            this.dragMask.runAction(cc.sequence(
                cc.fadeTo(fadeTime, maxOpacity),
                cc.callFunc(() => {
                    // this.mask.active = true;
                })
            ))
        }
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        this.audioUtils.playEffect('bgClick', 0.8);
        // 判断状态
        const status = this.getGameStatus();
        const isClickRight = this.checkPosByNode(e, this.moveBlock4);

        if (!(status === GAME_STATUS.CAN_DRAG && isClickRight)) return false;
        this.setGameStatus(GAME_STATUS.IS_MOVING);
        // 隐藏手 和 提示mask
        this.guideView.stopHand && this.guideView.stopHand();
        this.toggleDragMask('out');

        // 显示并更新底部的guide
        this.moveGuide.active = true;

        // 记录开始点击的位置
        this.touchInfo.startPos = cc.v2(e.touch._point.x, e.touch._point.y);
    },

    /**点击事件移动 */
    onTouchMove (e) {
        // 先触碰到方块然后跟随手指移动的距离来判断是否移动到规定的范围内（x）
        const status = this.getGameStatus();
        if (status !== GAME_STATUS.IS_MOVING) return false;
        // 记录当前移动的pos
        this.touchInfo.movePos = e.touch._point;

        // 计算两点之间的数值
        const differX = this.touchInfo.movePos.x - this.touchInfo.startPos.x; // 水平方向上的距离

        // 更正block的位置
        this.moveBlock4.position = cc.v2(this.touchInfo.oriPos.x + differX, this.touchInfo.oriPos.y);
        // 更正guide的位置
        this.moveGuide.position = cc.v2(this.touchInfo.guideOriPos.x + differX, this.touchInfo.guideOriPos.y)
    },

    /**点击事件结束 */
    onTouchEnd (e) {
        const status = this.getGameStatus();
        const endDifferX = this.moveBlock4.position.x - this.touchInfo.oriPos.x
        const isPutRight = (endDifferX >= GAME_INFO.END_DISTANCE - GAME_INFO.BUFFER) && (endDifferX <= GAME_INFO.END_DISTANCE + GAME_INFO.BUFFER)
        if (status === GAME_STATUS.IS_MOVING && isPutRight) {
            this.setGameStatus(GAME_STATUS.DISABLED);
            // 设置到正确的位置
            this.moveBlock4.position = cc.v2(this.touchInfo.oriPos.x + GAME_INFO.END_DISTANCE, this.touchInfo.oriPos.y);
            // guide消失 并且显示尾巴
            this.moveGuide.active = false;
            this.tail.active = true;
            // 然后触发移动正确的方法
            this.move4().then(() => {
                // 播放合成的声音
                this.audioUtils.playEffect('combine');

                // 原本的block消失然后变成block8
                this.block4_2.active = false;

                // 播放其他碰撞到的block的动画 包含爆炸效果
                this.playAnim().then(() => {
                    // 获胜
                    this.handleWin();
                });
            });
        } else if (status === GAME_STATUS.IS_MOVING && !isPutRight) {
            this.setGameStatus(GAME_STATUS.CAN_DRAG); // 设置可以拖动
            this.moveBlock4.position = this.touchInfo.oriPos;
            this.moveGuide.position = this.touchInfo.guideOriPos;
            this.moveGuide.active = false;
            this.showDrag();
            this.toggleDragMask('in');
            return false;
        }
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
            return true;
        } else {
            return false;
        }
    },

    /**
     * 
     * @param {cc.Node} node 在这个位置生成的爆炸效果
     */
    makeBomb (node) {
        const bomb = cc.instantiate(this.bomb);
        bomb.parent = this.bombBox;
        bomb.position = bomb.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node));
        setTimeout(() => {
            bomb.active = false;
        }, 500)
    },

    /**移动4 并且缩小 */
    move4 () {
        return new Promise((resolve, reject) => {
            // 初始化参数
            const endY = 255;
            const minScale = 0.66;
            const moveTime = 0.25;
    
            // 展示尾巴
            this.tail = true;
            this.moveBlock4.runAction(cc.sequence(
                cc.spawn(
                    cc.moveBy(moveTime, cc.v2(0, endY)),
                    cc.scaleTo(moveTime, minScale)
                ),
                cc.callFunc(() => {
                    this.moveBlock4.active = false;
                    resolve();
                })
            ))
        })
    },

    /**播放 block8_2 和 block16_2 的动画 */
    playAnim () {
        return new Promise((resolve, reject) => {
            // 新生成的8
            this.newBlock8_1.active = true;
    
            // 获取其完成的时间
            const anim1 = this.newBlock8_1.getComponent(cc.Animation);
            const duration = anim1.defaultClip.duration;
            setTimeout(() => {
                resolve(); // 回调
            }, duration * 1000)
    
            // 获取其余动画的几点
            const anim2 = this.block8_2.getComponent(cc.Animation);
            const anim3 = this.block16_2.getComponent(cc.Animation);
            const anim4 = this.block16_1.getComponent(cc.Animation);
            const anim5 = this.block32_1.getComponent(cc.Animation);
            
            // 播放动画
            anim2.play('block8_2');
            anim3.play('block16_2');
            anim4.play('block16_1');
            anim5.play('block32_1');
    
            // 并且制造爆炸效果
            const delay = 100; // 爆炸延迟效果, 注意放置的顺序
            this.bombPos.forEach((node, index) => {
                setTimeout(() => {
                    this.makeBomb(node);
                }, index * delay)
            })
        })
    },

    /**新生成的 8 掉落在地上之后视为胜利 */
    handleWin () {
        this.setGameStatus(GAME_STATUS.GAME_OVER);
        const delay = 0.5; // 表示动画结束之后展示最后画面之前所需要的延迟
        // 展示pps
        // 修改胜利按钮的字体
        this.awardView.changeAwardPage1Txt();
        // 展示pp的时候播放声音
        this.audioUtils.playEffect('correct');
        this.showPPs(this.ppIcon, () => {
            // 增加进度条还有金币
            this.progressView.setProgress(1, GAME_INFO.ADD_CASH_TIME);
            this.cashView.addCash(100, GAME_INFO.ADD_CASH_TIME)
        }).then(() => {
            setTimeout(() => {
                // 展示胜利的动画
                this.audioUtils.playEffect('cheer');
                this.awardView.showAwardPage1().then(() => {
                    this.guideView.showHand(this.buttonTip);
                    // 展示点击下载的遮罩层
                    this.awardView.showDownloadMask();
                    // 结束调用的方法
                    this.gameController.endGame();
                });
            }, delay * 1000)
        });
    },

    /**
     * 
     * @param {cc.Node} node 要飞向的节点
     * @param {Function} cb 第一个pp飞到icon之后的回调, 并非最后的会带哦
     * @returns 
     */
    showPPs (node, cb) {
        return new Promise((resolve, reject) => {
            const delay = 100;
            let isCallback = false;
            // 首先让所有pp初始化
            this.pps.children.forEach((pp) => {
                pp.opacity = 255;
                pp.scale = 1;
                pp.position = cc.v2(0, 0);
                pp.active = true;
            })
            scaleIn(this.pps).then(() => {
                this.pps.children.forEach((pp, index) => {
                    setTimeout(() => {
                        flyTo(pp, node).then(() => {
                            // 播放声音
                            this.playMoneyAudio();
                            if (isCallback) return false;
                            isCallback = true;
                            cb && cb();
                        })
                    }, index * delay)
                })

                // 最后的回调
                setTimeout(() => {
                    resolve();
                }, (this.pps.children.length - 1) * delay)
            })
        })
    },
    /**返回node1的坐标根据 */
    // getPos (node1, node2) {

    // }
// 点击事件相关结束---------------------------------------------------------------------

// guide相关----------------------------------------------------------------------------
    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**显示拖拽手 */
    showHandDrag (nodeArr, type) {
        this.guideView.showHandDrag(nodeArr, type);
        // this.guideView.showHand(nodeArr[0])
    },

    /**隐藏手 */
    stopHand () {
        this.guideView.stopHand && this.guideView.stopHand();
    },
    showDrag () {
        this.showHandDrag([...this.tips]);
    },
    
// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
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
