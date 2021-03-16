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
        // 节点
        this.tree1 = this.node.getChildByName('t1');
        this.tree2 = this.node.getChildByName('t2');
        this.tree3 = this.node.getChildByName('t3');
        this.light2 = this.node.getChildByName('light').getChildByName('light02');
        this.light3 = this.node.getChildByName('light').getChildByName('light03');

        this.index = 0; // 第几颗树
        this.allTrees = ['tree1', 'tree2', 'tree3'];
        this.currentTree = 'tree1';
        this.anim = {
            tree1: 'tree1Shake',
            tree2: 'tree2Shake',
            tree3: 'tree3Shake',
        };

        this.gameController = cc.find('Canvas').getComponent('GameController');
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
    changeToNextTree () {
        this.index++;
        this.currentTree = this.allTrees[this.index] || 'tree3';

        let lastTree = this[this.allTrees[this.index-1]];
        let tree = this[this.currentTree];
        lastTree.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                lastTree.active = false;
            })
        ));
        tree.active = true;
        this.showLight();
    },

    // 展示升级灯光特效
    showLight () {
        this.gameController.getAudioUtils().playEffect('combine', 0.6);

        this.light2.active = true;
        this.light2.opacity = 255;
        this.light2.scaleY = 0;
        this.light2.scaleX = 1;
        this.light2.runAction(cc.sequence(
            cc.scaleTo(0.2, 1, 1),
            cc.spawn(cc.scaleTo(0.3, 1, 1.2), cc.fadeOut(0.6)),
        ));

        let oriPos = cc.v2(this.light3.position.x, this.light3.position.y);
        this.light3.active = true;
        this.light3.opacity = 0;
        this.light3.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.4, 1.2)),
            cc.moveBy(0.4, 0, 15),
            cc.fadeOut(0.5),
            cc.callFunc(() => {
                this.light3.position = oriPos;
            })
        ));
    },

    // update (dt) {},
});
