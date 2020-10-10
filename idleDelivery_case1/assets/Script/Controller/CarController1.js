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
        riderDown2: cc.SpriteFrame,
        riderDown: cc.SpriteFrame,
    },

    onLoad () {
        let carAction = cc.repeatForever(cc.sequence(cc.moveTo(3.5, 15.119, -167.441), cc.callFunc(()=>{
            this.node.getComponent(cc.Sprite).spriteFrame = this.riderDown2;
        }), cc.moveTo(3, 153.926, -328.528), cc.callFunc(()=>{
            this.node.getComponent(cc.Sprite).spriteFrame = this.riderDown;
        }), cc.moveTo(0, 343.647, -43.382)));
        this.node.runAction(carAction);

    },
    start () {

    },

    // update (dt) {},
});
