import { GAME_STATUS } from '../Model/ConstValue';
import { slideInto, slideOut } from '../Utils/Animation';

cc.Class({
    extends: cc.Component,

    properties: {
        turn: { type: cc.Node, default: null },
        tip_turn: { type: cc.Node, default: null },
        mask: { type: cc.Node, default: null }
    },

    onLoad () {
        this.turnViewInit();
    },

    start () {
        this.guideView.showHand(this.tip_turn);
        // 设置为可以点击的状态
        this.gameView.setGameStatus(GAME_STATUS.CAN_SPIN);
    },

    /**初始化函数 */
    turnViewInit () {
        // 获取脚本
        this.gameController.setScript(this, 
            'gameView',
            'audioUtils',
            'guideView',
            'awardView',
            // 'progressView',
            // 'cashView'
        )

        // 初始化参数
        this.currentAngle = 0; // 表示已经旋转的角度
        this.turnNumber = 5; // 表示一共转多少圈
        this.itemAngle = {
            item1: 0,
            item2: 60,
            item3: 120,
            item4: 180,
            item5: 240,
            item6: 300
        }
        this.endItem = 'item3';

        // 初始化位置与状态
        this.mask.opacity = 125;
        this.mask.active = true;
        this.turn.active = true;
    },

    /**隐藏转盘 */
    hideTurn (cb) {
        this.toggleMask('out');
        slideOut(this.node).then(() => {
            cb && cb();
        })
    },

    /**开始旋转 */
    startSpin (e, item = 'item3') {
        if (this.gameView.getGameStatus() !== GAME_STATUS.CAN_SPIN) return false;
        this.gameView.setGameStatus(GAME_STATUS.CAN_RECEIVE1);
        this.guideView.stopHand();
        this.audioUtils.playEffect('spin');
        
        return new Promise((resolve, reject) => {
            const spinTime = 3.3;
            this.turn.runAction(cc.sequence(
                cc.rotateBy(spinTime, 360 * this.turnNumber - this.itemAngle[this.endItem]).easing(cc.easeInOut(4)),
                cc.callFunc(() => {
                    // this.hideTurn(() => {
                    this.awardView.changeAwardPage1Txt(); // 修改字体
                    this.awardView.showAwardPage1().then(() => {
                        this.gameView.setGameStatus(GAME_STATUS.CAN_RECEIVE1);
                        resolve();
                    })
                })
            ))
        })
    },

    /** 旋转之后的回调 */
    spinCallback () {
        this.toggleMask('out');
        this.gameView.setGameStatus(GAME_STATUS.CAN_RECEIVE1);
    },

    /**切换遮罩层层 */
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
    
    test () {
        console.log('test')
    }
});
