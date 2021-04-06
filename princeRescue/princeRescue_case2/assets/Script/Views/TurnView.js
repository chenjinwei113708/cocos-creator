import { GAME_STATUS } from '../Model/ConstValue';
import { slideInto, slideOut } from '../Utils/Animation';

cc.Class({
    extends: cc.Component,

    properties: {
        turn: { type: cc.Node, default: null },
        tip_turn: { type: cc.Node, default: null },
        // tip_PPCard: { type: cc.Node, default: null }
    },

    onLoad () {
        this.turnViewInit();
    },

    start () {
        // 划入进来
        // slideInto(this.node).then(() => {
            // 展示手
            this.guideView.showHand(this.tip_turn);
            // 设置为可以点击的状态
            this.gameView.setGameStatus(GAME_STATUS.CAN_SPIN);
        // })
        // 显示mask
        // this.gameView.toggleMask('in');
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
            item2: 72,
            item3: 144,
            item4: 216,
            item5: 288
        }
        this.endItem = 'item2';

        // 初始化位置与状态
        // const canvas = cc.find('Canvas');
        // this.node.active = false;
        // console.log(this.node.width)
        // this.node.position = cc.v2((canvas.width / 2) + (this.node.width / 2), 0); // 让其在整个页面的右边
    },

    /**隐藏转盘 */
    hideTurn (cb) {
        slideOut(this.node).then(() => {
            // 滑出去之后设置状态并且展示手
            this.gameView.setGameStatus(GAME_STATUS.CAN_CLICK1);
            this.gameView.showDrag1();
            cb && cb();
        })
    },

    /**开始旋转 */
    startSpin (e, item = 'item5') {
        // console.log(this.gameView.getGameStatus(), GAME_STATUS.CAN_SPIN)
        if (this.gameView.getGameStatus() !== GAME_STATUS.CAN_SPIN) return false;
        this.gameView.setGameStatus(GAME_STATUS.DISABLED);
        this.guideView.stopHand();
        this.audioUtils.playEffect('spin');
        
        return new Promise((resolve, reject) => {
            const spinTime = 3.3;
            this.turn.runAction(cc.sequence(
                cc.rotateBy(spinTime, 360 * this.turnNumber - this.itemAngle[this.endItem]).easing(cc.easeInOut(4)),
                cc.callFunc(() => {
                    // console.log('旋转结束');
                    // this.hideTurn(() => {
                        // this.awardView.showPuzzlePage({
                        //     addCash: 20,
                        //     progress: 0.5
                        // }).then(() => {
                        //     this.gameView.showHighLight().then(() => {
                        //         this.gameView.setGameStatus(GAME_STATUS.CAN_CLICK);
                        //     })
                        // })
                        // });
                    this.awardView.showPPCardPage1().then(() => {
                        this.guideView.showHand(this.awardView.tip_PPCard1_1);
                    });
                })
            ))
        })
    }


});
