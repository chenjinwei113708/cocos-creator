// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        paypal: cc.Node,
        gameMask: cc.Node,
        pps: cc.Node, // pp图标
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    showPPFly () {
        let destPos = this.pps.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('topbox').position)
        );
        let oriPos = cc.v2(0, 0);
        this.pps.children.forEach((node, index) => {
            node.opacity = 0;
            node.active = true;
            node.position = oriPos;
            node.runAction(cc.sequence(
                cc.delayTime(0.1*index),
                cc.fadeIn(0.2),
                cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.5)),
                cc.spawn(cc.scaleTo(0.2, 0.3), cc.fadeOut(0.2), cc.moveBy(0.2, -50, -20)),
                cc.callFunc(() => {
                    if (index === 0) {
                        this.gameController.addCash(200);
                    }
                    if (index === this.pps.children.length-1) {
                        console.log('finish');
                    }
                })
            ))
        });
        
    },

    hideGameMask () {
        this.gameMask.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.gameMask.active = false;
            })
        ));
    },

    // update (dt) {},
});
