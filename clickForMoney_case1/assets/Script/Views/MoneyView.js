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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nextIndex = 0;
        this.moneys = this.node.children; // 加现金数值的子节点
    },

    start () {

    },

    /**
     * 展示加了多少现金
     * @param {*} number 现金数量
     */
    showAddMoney (number = 3.33) {
        const center = cc.v2(0, -153);
        let money = this.moneys[this.nextIndex];
        // console.log('index', this.nextFly);
        this.nextIndex = (this.nextIndex+1)%this.moneys.length;

        money.stopAllActions();
        money.active = true;
        money.position = center;
        money.scale = 0;
        money.opacity = 255;
        money.getComponent(cc.Label).string = `$${number}`;
        money.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.1),
            cc.spawn(cc.moveBy(1.7, 0, 140), cc.scaleTo(1.7, 0.9), cc.fadeOut(1.8)),
            cc.callFunc(() => {})
        ));
    }

    // update (dt) {},
});
