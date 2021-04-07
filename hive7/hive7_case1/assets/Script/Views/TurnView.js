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
        mask: cc.Node,
        award: cc.Node,
        turn: cc.Node, // 整个旋转相关的节点
        playHand: cc.Node,
        awardHand: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.item1 = this.node.getChildByName('item1');
        this.item2 = this.node.getChildByName('item2');
        this.item3 = this.node.getChildByName('item3');
        this.item4 = this.node.getChildByName('item4');
        this.item5 = this.node.getChildByName('item5');
        this.item6 = this.node.getChildByName('item6');
        this.angle = {
            'item1': 0,
            'item2': 60,
            'item3': 120,
            'item4': 180,
            'item5': 240,
            'item6': 300,
        };
        this.canClick = true;
        this.canReceive = true;
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.isGameReceive = false; // 是不是游戏产生的金币
    },

    start () {
        // this.spin();
        this.showHand();
    },

    clickSpin () {
        if (this.canClick) {
            this.canClick = false;
            this.hideHand();
            this.spin();
        }
        
    },

    showHand () {
        this.gameController.guideView.myFadeIn(this.playHand, () => {
            let stop = this.gameController.guideView.myClickHere(this.playHand);
        });
    },

    hideHand () {
        // console.log('this.playHand.stopMyAnimation', this.playHand.stopMyAnimation);
        this.playHand.stopMyAnimation && this.playHand.stopMyAnimation(() => {
            this.playHand.runAction(cc.fadeOut(0.2));
        });
    },

    spin (item = 'item3') {
        let ang = this.angle[item];
        this.gameController.getAudioUtils().playEffect('spin', 0.6);
        this.node.runAction(cc.sequence(
            cc.rotateTo(3.3, -360*10-ang).easing(cc.easeInOut(4)),
            cc.callFunc(() => {
                this.showAward();
            })
        ));
    },

    showAward () {
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.3, 150));
        this.award.scale = 0;
        this.award.active = true;
        this.award.runAction(cc.scaleTo(0.4, 1).easing(cc.easeIn(1.5)));
        this.gameController.guideView.myFadeIn(this.awardHand, () => {
            this.gameController.guideView.myClickHere(this.awardHand);
        });
    },

    receiveAward () {
        if (this.isGameReceive) {
            this.gameController.gameView.receiveGameAward();
            return;
        }
        if (!this.canReceive) return;
        this.canReceive = false;
        this.mask.runAction(cc.fadeOut(0.2));
        this.award.runAction(cc.scaleTo(0.3, 0).easing(cc.easeIn(1.5)));
        this.turn.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(() => {
                this.turn.sacle = 1;
                this.turn.active = false;
                this.gameController.gameView.hideGameMask();
                this.gameController.gameView.showPPFly();
            })
        ));
        this.awardHand.stopMyAnimation && this.awardHand.stopMyAnimation();
    },
    

    // update (dt) {},
});
