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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameControl = cc.find("Canvas").getComponent('GameController');
        this.carControl = cc.find("Canvas/center/game/rider/riderDown3").getComponent('CarController2');
        this.vehicle = cc.find("Canvas/center/game/bottom/vehicle").getComponent('VehcleClick');
    },

    click(){
        if(this.gameControl.gameModel.Vehcle && this.gameControl.gameModel.PayPal){
            console.log(this.carControl)
            let a = this.carControl.a +1;
            let b = this.carControl.b +1;
            this.carControl.changeSpeed(a, b);

            this.vehicle.a +=1;
            this.vehicle.b +=1;
            this.vehicle.c +=1;
            this.vehicle.d +=1;
            this.vehicle.e +=1;
            this.vehicle.f +=1;
            this.vehicle.g +=1;
            this.vehicle.h +=1;
        }
    },

    start () {

    },

    // update (dt) {},
});
