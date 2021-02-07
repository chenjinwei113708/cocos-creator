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
        this.tree1 = this.node.getChildByName('t1');

        this.currentTree = 'tree1';
        this.anim = {
            tree1: 'tree1Shake',
        };
    },

    start () {

    },

    // 播放树摇摆的动画
    shakeTree () {
        let tree = this[this.currentTree];
        let shakeAnim = this.anim[this.currentTree];
        let animation = tree.getComponent(cc.Animation);
        animation.stop(shakeAnim); // 停止上一个摇摆动画
        animation.playAdditive(shakeAnim); // 播放摇树动画（同时并行播放）
    },

    // 变成下一颗树
    changeToNextTree () {},

    // update (dt) {},
});
