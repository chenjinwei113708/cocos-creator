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
        knife: cc.Node, // 小刀
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setClickListener();
        this.gameInfo = {
            knifePos: cc.v2(this.knife.position.x, this.knife.position.y),
        };
    },

    setClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClickKnife, this);
    },
    offClickListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onClickKnife, this);
    },

    /**点击小刀 */
    onClickKnife (touch) {
        let spinAngle = Math.random() * 400 + 900;
        this.knife.runAction(cc.sequence(
            cc.spawn(cc.moveBy(0.35, 0, 950), cc.rotateTo(0.35, spinAngle)),
            cc.callFunc(() => {
                this.knife.angle = 0;
                this.knife.position = this.gameInfo.knifePos;
            })
        ));
    },

    start () {

    },

    // update (dt) {},
});
