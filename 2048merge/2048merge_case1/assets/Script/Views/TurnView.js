import {
    GAME_STATUS
} from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        maskByTurn: cc.Node, // 转盘的遮罩层
        maskByAward: cc.Node, // 收集奖励的遮罩层
        award: cc.Node,
        awardButton: cc.Node, // 奖励按钮
        turn: cc.Node, // 整个旋转相关的节点
        playButton: cc.Node,
        guide: cc.Node,
        board: cc.Node, // 存放ppicon和logo的父节点

    },

    onLoad () {
        // 获取节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.gameView = this.gameController.gameView;

        // 获取脚本
        this.guideView = this.guide.getComponent('GuideView');
        this.progressView = this.gameView.progress.getComponent('PorgressView');
        this.cashView = this.gameView.cash.getComponent('CashView');

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

        // 初始化数据
        this.isGameReceive = false; // 是不是游戏产生的金币
        
    },

    setGameStatus(status) {
        this.gameView.gameInfo.status = status;
    },

    getGameStatus() {
        return this.gameView.gameInfo.status;
    },

    start () {
        this.guideView.showHand(this.playButton, 'parent');
        this.setGameStatus(GAME_STATUS.CAN_CLICK_TRUN)
    },

    clickSpin () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK_TRUN) return false;
        this.setGameStatus(GAME_STATUS.DISABLED)
        this.stopHand();
        this.spin();
    },

    /**展示引导手 */
    showHand (ndoe, type) {
        this.guideView.showHand(ndoe, type);
    },
    
    /**隐藏引导手 */
    stopHand () {
        this.guideView.stopHand();
    },


    spin (item = 'item4') {
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
        const time = 0.4;
        const endOpacity = this.maskByTurn.opacity; // 存放最终需要展示的透明度

        // 播放音乐
        this.gameController.getAudioUtils().playEffect('correct', 0.6);

        // 隐藏turn的遮罩并开启award的遮罩
        this.maskByTurn.runAction(cc.spawn(
            cc.fadeOut(time),
            cc.callFunc(() => {
                this.maskByAward.opacity = 0;
                this.maskByAward.active = true;
                this.maskByAward.runAction(cc.sequence(
                    cc.fadeTo(time, endOpacity),
                    cc.callFunc(() => {
                        this.maskByTurn.active = false;
                    })
                ))
            })
        ))

        // 展示奖励页
        this.award.scale = 0;
        this.award.active = true;
        this.award.runAction(cc.sequence(
            cc.scaleTo(0.4, 1).easing(cc.easeIn(1.5)),
            cc.callFunc(() => {
                this.showHand(this.awardButton, 'parent'); // 展示手
                this.setGameStatus(GAME_STATUS.CAN_CLICK_AWARD); // 设置为可以收集奖励状态
            })
        ));

    },

    receiveAward () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK_AWARD) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        
        this.gameController.getAudioUtils().playEffect('bgClick', 0.8); // 播放声音
        this.stopHand(); // 隐藏手

        // 隐藏遮罩层
        this.maskByAward.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                // 延迟过后消让mask消失
                this.maskByAward.active = false;
            })
        ));
        // 隐藏奖励页面
        this.award.runAction(cc.sequence(
            cc.scaleTo(0.3, 0).easing(cc.easeIn(1.5)),
            cc.callFunc(() => {
                this.award.active = false;
            })
        ));
        this.turn.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(() => {
                this.turn.active = false;
                this.turn.sacle = 1;
                this.gameController.gameView.showPPFly();
                
            })
        ));
    },

    // update (dt) {},
});
