import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue'
// import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null }
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
        // this.setGameStatus(GAME_STATUS);
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED // 初始设置为不可点击状态
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
