import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue'
import { scaleOut, myMoveBy } from '../Utils/Animation';
// import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null },
        blue: { type: cc.Node, default: null }, // 存放蓝色的节点
        blue_particle: { type: cc.Prefab, default: null }, // 蓝色粒子效果
        top: { type: cc.Node, default: null }, // 要掉落的节点
        top2: { type: cc.Node, default: null },
        tips: {
            type: cc.Node,
            default: []
        },
        highLight: { type: cc.Node, default: null }, // 提示点击蓝色的高亮层
    },

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad() {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon(' / 40', 'behind');
        // this.showHandDrag();
        this.addEventListener();
        // this.setGameStatus(GAME_STATUS);
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
            // status: GAME_STATUS.DISABLED // 初始设置为不可点击状态
            status: GAME_STATUS.DISABLED
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )

        // tip
        this.tipTypes = {
            tip1: 0,
            tip2: 1
        }
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
            console.log('in')
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

    /**提示点击蓝色 */
    showHighLight () {
        return new Promise((resolve, reject) => {
            const fadeInTime = 0.4;
            this.highLight.opacity = 0;
            this.highLight.active = true;
            this.highLight.runAction(cc.sequence(
                cc.fadeIn(fadeInTime),
                cc.callFunc(() => {
                    this.guideView.showHand(this.tips[this.tipTypes.tip1], 'position');
                    resolve();
                })
            ))
        })

    },

    /**隐藏点击 */
    hideHighLight () {
        this.guideView.stopHand();

        return new Promise((resolve, reject) => {
            const fadeOutTime = 0.4;
            this.highLight.runAction(cc.sequence(
                cc.fadeOut(fadeOutTime),
                cc.callFunc(() => {
                    resolve();
                })
            ))
        })
    },

    /**点击事件 */
    handleClick (e) {
        // 状态判断
        // console.log('当前状态', this.getGameStatus());
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        this.hideHighLight();
        this.audioUtils.playEffect('bgClick');
        
        let isCallback = false;

        // 让蓝色消失
        this.blue.children.forEach((node, index) => {
            // node.active = false;
            if (index % 2 === 0) {
                const blue_particle = cc.instantiate(this.blue_particle);
                // blue_particle.parent = node;
                blue_particle.parent = this.node;
                blue_particle.position = this.getPos(blue_particle, node);
            }
            scaleOut(node).then(() => {
                // 让 top 与 top2 掉下来
                if (isCallback) return false; // 只调用一次
                isCallback = true;
                myMoveBy(this.top, {
                    y: -GAME_INFO.CELL_HEIGHT * 3
                })
                myMoveBy(this.top2, {
                    y: -GAME_INFO.CELL_HEIGHT * 2
                }).then(() => {
                    // 最后弹出碎片奖励页， 弹出之前延迟一段时间
                    setTimeout(() => {
                        this.toggleMask('in');
                        this.awardView.showPuzzlePage().then(() => {
                            // 播放声音
                            this.audioUtils.playEffect('cheer');
                            // 展示iphone奖品
                            this.awardView.showAwardPage().then(() => {
                                this.gameController.endGame();
                                this.guideView.showHand(this.tips[this.tipTypes.tip2]);
                            });
                        });
                    }, 300);
                })
            })
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
