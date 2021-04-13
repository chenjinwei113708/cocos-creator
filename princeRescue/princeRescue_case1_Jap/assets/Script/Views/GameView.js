import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue'
import { scaleIn, flyTo, animInfo } from '../Utils/Animation'
// import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        prince: { type: cc.Node, default: null }, // 王子
        princess: { type: cc.Node, default: null }, // 公主
        littlePrince: { type: cc.Node, default: null }, // pypal的小王子
        littlePrincess: { type: cc.Node, default: null },
        tip1: { type: cc.Node, default: null }, // 提示移动手1
        tip2: { type: cc.Node, default: null }, // 提示移动手2
        tip3: { type: cc.Node, default: null }, // 提示cashout的手
        clickable: { type: cc.Node, default: null }, // 可以点击的范围
        pillar: { type: cc.Node, default: null }, // 点击正确之后移动的柱子
        heart: { type: cc.Node, default: null }, // 游戏结束出现的爱心
        PPNodes: {
            type: cc.Node,
            default: []
        },
        treasure: { type: cc.Node, default: null }, // 展示爱心时候消失的宝物
        pps: { type: cc.Node, default: null },
        ppIcon: { type: cc.Node, default: null }
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad() {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('', '');
        this.showHandDrag([this.tip1, this.tip2]);
        this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_DRAG);
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
            status: GAME_STATUS.DISABLED, // 初始设置为不可点击状态
            currentLightPPNode: 0
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )
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
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        if (!(this.getGameStatus() === GAME_STATUS.CAN_DRAG && this.checkPosByNode(e, this.clickable))) return false;
        this.setGameStatus(GAME_STATUS.DISABLED); // 点击完设置游戏状态
        this.guideView.stopHand(); // 隐藏手

        this.handleClickRight(); // 处理点击正确之后的方法
        this.audioUtils.playEffect('bgClick');
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },

    /**点击事件移动 */
    onTouchMove (e) {
        // console.log('touch move')
    },

    /**点击事件结束 */
    onTouchEnd (e) {
        // console.log('touch end')
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

    /**处理正确的点击事件 */
    handleClickRight () {
        const moveTime = 1;
        const disappearTime = 0.3;

        return new Promise((resolve, reject) => {
            // 让柱子移动并消失
            console.log('click right');
            this.pillar.runAction(cc.sequence(
                cc.moveBy(moveTime * (2 / 3), cc.v2(-GAME_INFO.PILLAR_MOVE_DISTANCE * (2 / 3))),
                cc.callFunc(() => {
                    this.princeFall().then(() => {
                        this.princeWalK();
                    });
                }),
                cc.spawn(
                    cc.moveBy(moveTime * (1 / 3), cc.v2(-GAME_INFO.PILLAR_MOVE_DISTANCE * (1 / 3))),
                    cc.fadeOut(moveTime * (1 / 3))
                )
            ))
        })
    },

    /**王子跌落 */
    princeFall (cb) {
        const fallTime = 0.8;
        const endY = -287.69;

        return new Promise((resolve, reject) => {
            this.prince.runAction(cc.sequence(
                cc.moveTo(fallTime, cc.v2(this.prince.x, endY)).easing(cc.easeQuadraticActionIn()),
                cc.callFunc(() => {
                    cb && cb();
                    resolve();
                })
            ))
        })
    },

    /**王子走过去 */
    princeWalK (cb) {
        return new Promise((resolve, reject) => {
            const animation = this.prince.getChildByName('prince').getComponent(cc.Animation); // 获得动画节点
            const animationName = 'walk'
            const walkTime = 1.1;
            const distance = 142;
    
            animation.stop(); // 停止当前动画
            animation.play(animationName); // 播放行走动画
            this.prince.runAction(cc.sequence(
                cc.moveBy(walkTime, cc.v2(distance, 0)),
                cc.callFunc(() => {
                    animation.stop();
                    // animation.play('prince_await');
                    this.showHeart(
                        () => {
                            this.prince.active = false;
                            this.princess.active = false;
                            this.treasure.active = false;
                        },
                        () => {
                            this.showPPs(this.heart).then(() => {
                                this.lightPPNodes(GAME_INFO.ADD_CASH_TIME);
                                this.handleLittlePrinceWalk();
                                this.cashView.addCash(777, GAME_INFO.ADD_CASH_TIME).then(() => {
                                    this.audioUtils.playEffect('cheer');
                                    this.showAwardPage().then(() => {
                                        // 结束游戏
                                        this.showHand(this.tip3);
                                        this.showDownloadMask();
                                        this.gameController.endGame();
                                    });
                                });
                            });
                        }
                    )
                })
            ))
        })
    },

    /**
     * 
     * @param {Function} cb1 爱心变到最大执行的方法
     * @param {Function} cb2 爱心变小之后执行的回调
     */
    showHeart (cb1, cb2) {
        // 初始化参数
        const largeTime = 0.4;
        const smallTime = 0.2;
        const shakeTime = 0.1;
        const disappearTime = 0.3;
        const maxScale = 1.2;

        this.heart.scale = 0;
        this.heart.active = true;

        this.heart.runAction(cc.sequence(
            cc.scaleTo(largeTime, maxScale),
            cc.scaleTo(smallTime, 1),
            cc.callFunc(() => {
                cb1 && cb1();
            }),
            cc.delayTime(0.5),
            cc.scaleTo(shakeTime, maxScale),
            cc.scaleTo(smallTime, 1),
            cc.delayTime(0.5),
            cc.scaleTo(shakeTime, maxScale),
            cc.scaleTo(disappearTime, 0),
            cc.callFunc(() => {
                this.heart.active = false;
                cb2 && cb2();
            })
        ))
    },

    /**点亮paypal并让王子走到公主那里 */
    lightPPNodes (time = 2) {
        const delay = GAME_INFO.ADD_CASH_TIME * 1000 / (this.PPNodes.length - 1);
        this.PPNodes.forEach((node, index) => {
            const light = node.getChildByName('light')
            setTimeout(() => {
                light.active = true;
                // node.active = false;
            }, index * delay)
        })
        // this.
    },

    /**
     * 展示pp图标并飞向icon
     * @param {cc.Node} node 让pps绑定到的节点
     */
    showPPs (node, cb) {
        return new Promise((resolve, reject) => {
            // 跟新pps的位置
            const pos = this.pps.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node));
            this.pps.position = pos;
            // 执行动画的函数
            const delay = 100; // 延迟
            let isCallback = false;
    
            scaleIn(this.pps).then(() => {
                this.pps.children.forEach((node, index) => {
                    setTimeout(() => {
                        this.audioUtils.playEffect('money', 0.6);
                        flyTo(node, this.ppIcon);
                    }, delay * index)
                })
            })
            setTimeout(() => {
                cb && cb();
                resolve();
            }, animInfo.flyTo.time * 1000)
        })
    },

    /**paypal的小王子走路 */
    handleLittlePrinceWalk () {
        const disappearTime = 0.4;
        this.littlePrince.runAction(cc.sequence(
            cc.moveBy(GAME_INFO.ADD_CASH_TIME, cc.v2(GAME_INFO.PP_NODE_DISTANCE * (this.PPNodes.length - 1), 0)),
            cc.callFunc(() => {
                this.littlePrince.runAction(cc.fadeOut(disappearTime));
                this.littlePrincess.runAction(cc.fadeOut(disappearTime));
            })    
        ))
    },

    /**添加金额获取数量 */
// 点击事件相关结束---------------------------------------------------------------------

// guide相关----------------------------------------------------------------------------
    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**显示拖拽手 */
    showHandDrag (nodeArr, type) {
        this.guideView.showHandDrag(nodeArr, type);
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
        return this.awardView.showAwardPage();
    },
    
    /**展现下载页面 */
    showDownloadMask () {
        this.awardView.showDownloadMask();
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
