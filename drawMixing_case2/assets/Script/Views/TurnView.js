

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        hand: cc.Node, // 指引手
        turn: cc.Node, // 整个旋转相关的节点

    },

    onLoad () {
        // 获取节点
        this.gameController = cc.find('Canvas').getComponent('GameController');

        this.canSpinTurn = false; // 可不可以转动转盘
        this.item1 = this.node.getChildByName('item1');
        this.item2 = this.node.getChildByName('item2');
        this.item3 = this.node.getChildByName('item3');
        this.item4 = this.node.getChildByName('item4');
        this.item5 = this.node.getChildByName('item5');
        this.item6 = this.node.getChildByName('item6');
        this.angle = {
            'item1': 0,
            'item2': 60,
            'item3': 120,
            'item4': 180,
            'item5': 240,
            'item6': 300,
        };
        
    },


    start () {
    },

    setIfCanSpin (bool) {
        this.canSpinTurn = bool;
    },

    clickSpin () {
        
        if (!this.canSpinTurn) return;
        this.stopHand();
        this.canSpinTurn = false;
        this.spin();
    },

    /**展示引导手 */
    showHand (ndoe, type) {
        this.guideView.showHand(ndoe, type);
    },
    
    /**隐藏引导手 */
    stopHand () {
        this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
            this.hand.active = false;
        });
    },


    spin (item = 'item6') {
        let ang = this.angle[item];
        // this.gameController.getAudioUtils().playEffect('spin', 0.6);
        this.node.runAction(cc.sequence(
            cc.rotateTo(3.3, -360*10-ang).easing(cc.easeInOut(4)),
            cc.callFunc(() => {
                this.hideTurn();
                this.gameController.gameView.showPPCard(500, false);
            })
        ));
    },

    hideTurn () {
        // this.mask.runAction(cc.fadeOut(0.3));
        this.turn.runAction(cc.sequence(
            cc.scaleTo(0.1, 0),
            cc.callFunc(() => {
                this.turn.active = false;
            })
        ));
    },

    // update (dt) {},
});
