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
        this.nextFly = 0;
        this.flys = this.node.children; // 飞金币的子节点
        this.pos = {
            cash01: cc.v2(93.848, -61.6),
            cash02: cc.v2(-120.5, -110.23),
            cash03: cc.v2(13.82, 48.87),
            cash04: cc.v2(19.536, -13.1),
            cash05: cc.v2(-0.47, -87.36),
            cash06: cc.v2(-114.798, -16.86),
            cash07: cc.v2(-70.972, -0.67),
        };
    },

    start () {
        // setTimeout(() => {
        //     this.shootMoney(cc.v2(100, 100));
        // }, 1000);
    },

    /**
     * 给定一个坐标，在此处发射现金
     * @param {*} pos 
     */
    shootMoney (pos) {
        const center = cc.v2(0, 0);
        let fly = this.flys[this.nextFly];
        // console.log('index', this.nextFly);
        this.nextFly = (this.nextFly+1)%this.flys.length;

        fly.active = true;
        fly.position = pos;
        fly.children.forEach((cash, index) => {
            let destPos = this.pos[cash.name];
            let rand = Math.random();
            if (rand>=0.6){
                destPos = cc.v2(destPos.x + rand*30, destPos.y - rand*35);
            }
            
            cash.stopAllActions();
            cash.position = center;
            cash.scale = 0;
            cash.opacity = 255;
            cash.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.2+0.2*rand, 1) ,cc.moveTo(0.1+0.2*rand, destPos)).easing(cc.easeOut(1.2)),
                cc.spawn(cc.fadeOut(1.2+0.4*rand), cc.moveBy(1.5, 0, -60), cc.rotateTo(1, 50-100*rand)),
                cc.callFunc(() => {})
            ))
        });
    }

    // update (dt) {},
});
