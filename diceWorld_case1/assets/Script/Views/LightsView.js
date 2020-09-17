

cc.Class({
    extends: cc.Component,

    properties: {
        light1: cc.Node,
        light1s: cc.Node,
        light2: cc.Node,
        light2s: cc.Node,
        light3: cc.Node,
        light3s: cc.Node,
        light4: cc.Node,
        light4s: cc.Node,
        light5: cc.Node,
        light5s: cc.Node,
        light6: cc.Node,
        light6s: cc.Node
    },

    setLightAction(){
        let action = cc.repeatForever(
            cc.sequence(cc.scaleTo(0.5,2.5,2.5), 
                        cc.scaleTo(0.5,0.5,0.5), 
                        cc.scaleTo(0.5,2.5,2.5), 
                        cc.scaleTo(0.5,0.5,0.5), 
                        cc.scaleTo(0.5,1.5,1.5), 
                        cc.spawn(cc.scaleTo(1,0,0), cc.moveBy(2, 10, 10)),
                        cc.moveBy(2,-10,-10)));
        
        this.light1.runAction(action);
        
        this.light2.runAction(action);
        
        this.light3.runAction(action);
        this.light4.runAction(action);
        this.light5.runAction(action);
        this.light6.runAction(action);
    },


    onLoad () {
        this.setLightAction();
    },

    start () {

    },

    // update (dt) {},
});
