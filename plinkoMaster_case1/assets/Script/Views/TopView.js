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
        light1: cc.Node,
        light2: cc.Node,
        light3: cc.Node,
        seven1: cc.Node,
        seven2: cc.Node,
        seven3: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.gameController = cc.find('Canvas').getComponent('GameController');
    },

    showSeven () {
        const delay = 500;
        for (let i = 1; i <= 3; i++){
            setTimeout(() => {
                this.sevenUp(i);
            }, (i-1)*delay);
        }
    },

    sevenUp (index) {
        const time = 0.3;
        const moveY = 107;
        let light = this[`light${index}`];
        let seven = this[`seven${index}`];

        let lightMove = cc.moveTo(time, cc.v2(light.position.x, light.position.y+moveY));
        lightMove.easing(cc.easeOut(3.0));
        light.runAction(cc.sequence(
            lightMove,
            cc.callFunc(() => {
                light.active = false;
            })
        ));

        this.gameController.getAudioUtils().playEffect('slotMachine', 0.3);
        let sevenMove = cc.moveTo(time, cc.v2(seven.position.x, seven.position.y+moveY));
        sevenMove.easing(cc.easeOut(3.0));
        seven.runAction(cc.sequence(
            sevenMove,
            cc.callFunc(() => {
                if (index === 3) {
                    this.gameController.gameView.completeSevens();
                }
            })
        ));
    }

    // update (dt) {},
});
