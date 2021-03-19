
// import Tools from '../Utils/utils'
import { GAME_STATUS, GAME_INFO } from '../Model/ConstValue';
import { blink, flyTo, myMoveBy, scaleIn, animInfo } from '../Utils/Animation'

cc.Class({
    extends: cc.Component,

    properties: {
        dragBlock: { type: cc.Node, default: null },
        fallBlocks: { type: cc.Node, default: [] },
        newBlock: { type: cc.Node, default: null },
        disappear1: { type: cc.Node, default: null }, // 第一波消除的方块
        disappear2: { type: cc.Node, default: null }, // 第二波消除的方块
        ppIconLight: { type: cc.Prefab, default: null }, // 发光的ppicon
        pps: { type: cc.Node, default: null },
        ppIcon: { type: cc.Node, default: null }, // 用于pp分数飞向的地方
        ppCardTip: { type: cc.Node, default: null }, // 用于pp卡出现之后的提示
        dragTips: { type: cc.Node, default: null }, // 用于开始时候提示的手
    },

    onLoad() {
        this.gameViewInit();
    },

    /**初始化gameView */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED
        },
        // 记录拖拽的坐标
        this.touchInfo = {
            startPos: undefined,
            endPos: undefined,
            startX: undefined,
            startY: undefined,
            endX: undefined,
            endY: undefined,
            moveX: 0,
            moveY: 0,
        }

        // 获脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )
    },

    start () {
        this.cashView.setIcon('$ ');
        this.showHandDrag(this.dragTips.children);
        this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_DRAG); // 设置为可以拖拽
    },

    showHandDrag (nodeArr, type) {
        // console.log(111)
        this.guideView.showHandDrag(nodeArr, type);
        // this.guideView.showHand(nodeArr[0])
    },

    stopHand () {
        this.guideView.stopHand && this.guideView.stopHand();
    },

    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /**获取游戏状态  */
    getGameStatus () {
        return this.gameInfo.status
    },

    // 节流函数
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

    /**增加点击事件 */
    addEventListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件 */
    onTouchStart (e) {
        // 无论是否正确都播放声音
        this.audioUtils.playEffect('bgClick');
        // 判断状态
        if (!this.checkPosByNode(e, this.dragBlock) || this.getGameStatus() !== GAME_STATUS.CAN_DRAG) return false;
        this.setGameStatus(GAME_STATUS.IS_DRAGING);
        this.stopHand();
        // console.log('进来了 -- start')
        // 记录坐标到this.touchInfo
        const pos = e.touch._point;
        this.touchInfo.startX = pos.x; // 这里只用管x
        this.touchInfo.startPos = this.dragBlock.position; // 记录开始的坐标
    },

    /**鼠标移动事件 */
    onTouchMove (e) {
        // 判断状态
        if (!this.checkPosByNode(e, this.dragBlock) || this.getGameStatus() !== GAME_STATUS.IS_DRAGING) return false;
        // console.log('进来了 -- move')
        // 记录参数
        const oriPos = this.touchInfo.startPos;
        const pos = e.touch._point;
        this.touchInfo.moveX = pos.x;

        // 实现跟着鼠标移动
        let distanceX = this.touchInfo.moveX - this.touchInfo.startX;

        // 限制移动
        distanceX = ((distanceX >= GAME_INFO.MAX_DISTANCEX)
            ? GAME_INFO.MAX_DISTANCEX
            : (distanceX <= GAME_INFO.MIN_DISTANCEX)
            ? GAME_INFO.MIN_DISTANCEX
            : distanceX)
        this.dragBlock.position = cc.v2(oriPos.x + distanceX, oriPos.y);
    },

    /**松手事件 */
    onTouchEnd (e) {
        // 判断状态
        if (this.getGameStatus() !== GAME_STATUS.IS_DRAGING) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        // console.log('进来了 -- end')
        // 获取初始值
        const moveTime = 0.1;
        const pos = e.touch._point;
        // this.touchInfo.endX = pos.x;
        this.touchInfo.endX = this.dragBlock.x;
        this.touchInfo.endPos = this.dragBlock.position;
        
        // 计算
        let distanceX = this.touchInfo.endX - this.touchInfo.startPos.x;
        // 限制移动
        distanceX = ((distanceX >= GAME_INFO.MAX_DISTANCEX)
            ? GAME_INFO.MAX_DISTANCEX
            : (distanceX <= GAME_INFO.MIN_DISTANCEX)
            ? GAME_INFO.MIN_DISTANCEX
            : distanceX)

        let currentOffsetX = distanceX % GAME_INFO.CELL_WIDTH;
        let moveX = null; // 最后需要移动的x

        // 逻辑判断
        if (Math.abs(currentOffsetX) > GAME_INFO.GRID_WIDTH) {
            moveX = (distanceX > 0 ? 1 : -1) * GAME_INFO.CELL_WIDTH  - currentOffsetX;
        } else {
            moveX = -currentOffsetX
        }

        // 运动
        this.dragBlock.runAction(cc.sequence(
            cc.moveBy(moveTime, cc.v2(moveX, 0)),
            cc.callFunc(() => {
                // 定义接下来运动的参数
                const buffer = 5;
                const offsetX = this.dragBlock.x - this.touchInfo.startPos.x;
                if (GAME_INFO.END_OFFSET_X - buffer <= offsetX && GAME_INFO.END_OFFSET_X + buffer >= offsetX) {
                    // console.log('去到目标位置')
                    // blink(this.dragBlock)
                    this.handleCorrectDrag()
                } else {
                    // 表示没有移动到目标位置
                    this.showHandDrag(this.dragTips.children);
                    this.touchInfo = {
                        startPos: undefined,
                        endPos: undefined,
                        startX: undefined,
                        startY: undefined,
                        endX: undefined,
                        endY: undefined,
                        moveX: 0,
                        moveY: 0,
                    }
                    this.setGameStatus(GAME_STATUS.CAN_DRAG);
                    console.log('can drag')
                }
            })
        ))
    },

    //  处理移动正确之后的函数
    handleCorrectDrag () {
        // 记录移动的宽高,方便后面计算
        // const width = GAME_INFO.CELL_WIDTH;
        const height = GAME_INFO.CELL_HEIGHT;

        let isCallback1 = false; // 第一个回调
        let isCallback2 = false; // 第二个回到
        let isCallback3 = false; // 第三个回调

        // 降落两格
        myMoveBy(this.dragBlock, {
            x: 0, y: -2 * height
        }).then(() => {
            // 播放合成的声音
            this.audioUtils.playEffect('correct', 0.3);
            // 消失掉合成的两行
            this.disappear1.children.forEach(node => {
                blink(node).then(() => {
                    // 生成新的ppicon 并根据node坐标添加到pps
                    const ppIconLight = cc.instantiate(this.ppIconLight);
                    ppIconLight.parent = this.pps;
                    ppIconLight.position = this.pps.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
                    scaleIn(ppIconLight).then(() => {
                        flyTo(ppIconLight, this.ppIcon)
                    })
                    // 回调判断
                    if (isCallback1) return false;
                    isCallback1 = true
                    setTimeout(() => {
                        // 播放金币声音
                        this.audioUtils.playEffect('money');
                        // 添加进度条与金币
                        this.progressView.setProgress(2 / 5, 2 / 5);
                        this.cashView.addCash(200, 2 / 5)
                    }, (animInfo.scaleIn.time + animInfo.flyTo.time) * 1000)
                    // 执行第一个回调 --- 显示被分割的方块
                    this.showNewBlock().then(() => {
                        // 消失完之后需要掉落的方块
                        this.fallBlocks.forEach(node => {
                            myMoveBy(node, {
                                x: 0, y: -5 * height
                            }).then(() => {
                                if (isCallback2) return false;
                                isCallback2 = true
                                // 播放合成的声音
                                this.audioUtils.playEffect('correct', 0.3);
                                // 执行第二个回调 --- 第二次消失方块
                                this.disappear2.children.forEach(node => {
                                    blink(node).then(() => {
                                        // 生成新的ppicon 并根据node坐标添加到pps
                                        const ppIconLight = cc.instantiate(this.ppIconLight);
                                        ppIconLight.parent = this.pps;
                                        ppIconLight.position = this.pps.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
                                        scaleIn(ppIconLight).then(() => {
                                            flyTo(ppIconLight, this.ppIcon)
                                        })
                                        // 回调判断
                                        if (isCallback3) return false;
                                        isCallback3 = true
                                        // 记录了延迟的时间
                                        setTimeout(() => {
                                            // 播放金币声音
                                            this.audioUtils.playEffect('money');
                                            // 添加进度条与金币
                                            this.progressView.setProgress(1, 3 / 5).then(() => {
                                                this.handleEndGame();
                                            });
                                            this.cashView.addCash(300, 3 / 5)
                                        }, (animInfo.scaleIn.time + animInfo.flyTo.time) * 1000)
                                        // 执行第三个回调 --- 执行结束函数
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },

    /**显示被分割之后产生的节点 */
    showNewBlock (cb) {
        return new Promise((resolve, reject) => {
            this.newBlock.active = true;
            resolve();
            cb && cb();
        })
    },

    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage()
    },

    /**展示pp页面 */
    showPPPage() {
        return this.awardView.showPPPage();
    },

    /**展示pp模糊页面 */
    showPPPageBlur () {
        return this.awardView.showPPPageBlur();
    },

    showAwardPage () {
        return this.awardView.showAwardPage();
    },

    handleReceiveAward () {
        this.stopHand();
        return this.awardView.handleReceiveAward().then(() => {
            this.guideView.setHand(this.guideView.hand2); // 换手
            this.showHand(this.awardView.downloadButton)
            this.gameController.endGame();
        });
    },

    /**结束游戏的函数 */
    handleEndGame () {
        // 播放游戏结束声音 
        this.audioUtils.playEffect('cheer');
        this.showAwardPage().then(() => {
            this.showHand(this.ppCardTip)
        })
    },

    /**
     * 检查坐标是否在某个节点的范围里面 
     * 因为cocos里面的button是无法根据浏览器那样获取准确的currentTarget的
     * */
    checkPosByNode (e, node) {
        // console.log(e)
        const touchPos = e.touch._point;
        // const pos = this.node.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
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

    
    /**handle */

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    }
});
