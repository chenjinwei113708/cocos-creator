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
        this.time = this.node.getChildByName('time').getComponent(cc.Label);
        this.left = this.node.getChildByName('left');
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.info = {
            seconds: 30,
            countInterval: null,
        };

        this.left.getComponent(cc.Animation).play();
    },

    start () {
        this.time.string = `0:${this.info.seconds}`;
    },

    showCashout () {
        let oriPos = cc.v2(this.node.position.x, this.node.position.y);
        this.node.position = cc.v2(this.node.position.x+this.node.width, this.node.position.y);
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3, oriPos),
            cc.callFunc(() => {
                this.startCount();
            })
        ));
    },

    startCount () {
        this.info.countInterval && clearInterval(this.info.countInterval);
        this.info.countInterval = setInterval(() => {
            this.info.seconds--;
            this.time.string = `0:${this.info.seconds<10 ? '0'+this.info.seconds : this.info.seconds}`;
            // this.left.runAction(cc.sequence(
            //     cc.scaleTo(0.04, 1.2),
            //     cc.scaleTo(0.02, 0.8),
            //     cc.scaleTo(0.04, 1),
            // ));
            
            if (this.info.seconds <= 0) {
                this.time.string = '';
                this.info.countInterval && clearInterval(this.info.countInterval);
                cc.find('Canvas').getComponent('GameController').download();
            }
        }, 1000);
    },

    clickCashout () {
        this.info.countInterval && clearInterval(this.info.countInterval);
        this.gameController.guideView.clickCashout();
    },



    update (dt) {
    },
});
