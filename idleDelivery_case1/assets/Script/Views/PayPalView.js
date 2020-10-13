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
        progress: cc.ProgressBar
    },

    onLoad(){
        this.gameControl = cc.find('Canvas').getComponent('GameController');
    },
    payPalAction () {
        let action = cc.sequence(cc.fadeIn(0), cc.scaleTo(0, 0, 0), cc.scaleTo(0.3, 1, 1), cc.scaleTo(0.1, 1.05, 1.05), cc.scaleTo(0.1, 1, 1));
        this.node.runAction(action);
    },

    click () {
        this.gameControl.gameModel.PayPal = true;
        this.node.runAction(cc.fadeOut(0));
        // for(let i = 0; i<5; i++){
        //     this.progress.progress += 0.2;
        // }

        let timeId = setInterval(() => {
            this.progress.progress += 0.05;
            if(this.progress.progress = 1){
                clearInterval(timeId);
            }
        }, 500);

        this.gameControl.addCash(100);
    },

    start () {

    },

    // update (dt) {},
});
