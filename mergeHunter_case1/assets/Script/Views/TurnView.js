

cc.Class({
    extends: cc.Component,

    properties: {
        turn: { type: cc.Node, default: null },
        mask: cc.Node,
        hand: cc.Node,
        // tip_PPCard: { type: cc.Node, default: null }
    },

    onLoad () {
        this.turnViewInit();
        this.canSpin = false;
    },

    start () {
    },

    /**初始化函数 */
    turnViewInit () {
        // 获取脚本
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.gameView = this.gameController.gameView;
        this.guideView = this.gameController.guideView;
        this.audioUtils = this.gameController.getAudioUtils();

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
        this.endItem = 'item4';

        // 初始化位置与状态
        // const canvas = cc.find('Canvas');
        // this.node.active = false;
        // console.log(this.node.width)
        // this.node.position = cc.v2((canvas.width / 2) + (this.node.width / 2), 0); // 让其在整个页面的右边
    },

    // 出现转盘
    showTurn () {
        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.4, 130));
        this.node.active = true;
        this.node.scale = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.4, 1),
            cc.callFunc(() => {
                this.hand.position = cc.v2(48, 36);
                this.gameController.guideView.myFadeIn(this.hand, () => {
                    this.gameController.guideView.myClickHere(this.hand);
                    this.canSpin = true;
                });
            })
        ));
    },

    /**隐藏转盘 */
    hideTurn () {
        this.mask.runAction(cc.fadeOut(0.3));
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 0),
            cc.callFunc(() => {
                // 显示金币卡
                this.gameView.showPPcardFly(cc.v2(0, 68));
            })
        ));
    },

    /**开始旋转 */
    startSpin (e, item = 'item5') {
        // console.log(this.gameView.getGameStatus(), GAME_STATUS.CAN_SPIN)
        if (!this.canSpin) return false;
        this.canSpin = false;
        this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
            this.hand.active = false;
        });
        // this.gameView.setGameStatus(GAME_STATUS.DISABLED);
        // this.guideView.stopHand();
        this.audioUtils.playEffect('spin', 0.6);
        
        return new Promise((resolve, reject) => {
            const spinTime = 3.3;
            this.turn.runAction(cc.sequence(
                cc.rotateBy(spinTime, 360 * this.turnNumber - this.itemAngle[this.endItem]).easing(cc.easeInOut(4)),
                cc.callFunc(() => {
                    this.hideTurn();
                })
            ))
        })
    }


});
