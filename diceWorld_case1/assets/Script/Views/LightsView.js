

cc.Class({
    extends: cc.Component,

    properties: {
        light1: cc.Node,
        light2: cc.Node,
        light3: cc.Node,
        light4: cc.Node,
        light5: cc.Node,
        light6: cc.Node,
    },

    setLightAction(){
        let action = cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5,1), 
            cc.scaleTo(0.5,0.3), 
            cc.scaleTo(0.5,0.8), 
            cc.scaleTo(0.5,0.5), 
            cc.scaleTo(0.5,1.1), 
            cc.spawn(cc.scaleTo(1,0), cc.moveBy(2, 10, 10)),
            cc.moveBy(2,-10,-10),
            cc.delayTime(0.3)
        ));
        return action;
    },


    onLoad () {
        this.light1.scale = 0;
        this.light2.scale = 0;
        this.light3.scale = 0;
        this.light4.scale = 0;
        this.light5.scale = 0;
        this.light6.scale = 0;
        setTimeout(() => {this.light1.runAction(this.setLightAction());}, 0);
        setTimeout(() => {this.light2.runAction(this.setLightAction());}, 2250);
        setTimeout(() => {this.light3.runAction(this.setLightAction());}, 5500);
        setTimeout(() => {this.light4.runAction(this.setLightAction());}, 6000);
        setTimeout(() => {this.light5.runAction(this.setLightAction());}, 1500);
        setTimeout(() => {this.light6.runAction(this.setLightAction());}, 300);
    },

    start () {

    },

    // update (dt) {},
});
