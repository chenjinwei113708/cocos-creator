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

    extends: cc.Component,

    properties: {
        riderDown2: cc.SpriteFrame,
        riderDown3: cc.SpriteFrame,
    },

    onLoad () {
        let carAction = cc.repeatForever(cc.sequence(cc.moveTo(3.5, -230.225, 24.951), cc.callFunc(()=>{
            this.node.getComponent(cc.Sprite).spriteFrame = this.riderDown3;
        }), cc.moveTo(4.5, 311.307, 228.961), cc.callFunc(()=>{
            this.node.getComponent(cc.Sprite).spriteFrame = this.riderDown2;
        }), cc.moveTo(0, -51.474, -137.732)));
        this.node.runAction(carAction);

    },

    start () {

    },

    // update (dt) {},
});
