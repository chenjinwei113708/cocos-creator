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

    },

    onLoad () {
        this.node.scale = 0.8;
        this.node.position = cc.v2(0, 0);
        let x = Math.random() * (430+1-100)-150;
        let y = Math.random() * (600+1-320)-150;
        let d = Math.random() * 1.5;
        let coinAction = cc.sequence(cc.moveTo(0.3, x, y), cc.moveTo(0.5, x, y-10), cc.moveTo(d, 33.642, 677.79));
        this.node.runAction(coinAction);

    },

    start () {

    },

    // update (dt) {},
});
