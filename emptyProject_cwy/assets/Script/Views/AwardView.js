import { GAME_MODE, WIN_TXT } from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        congract: cc.Node, // congraculation节点
        ppCard: cc.Node, // 中部pp卡
        button: cc.Node, // 结束按钮
        audio: cc.Node // 音效
    },
    /**展示奖励页面 */
    showAwardPage(cb, isEnd, fail) {
        this.node.scale = 0; // 默认缩放设置为0
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.callFunc(() => {
                cb && cb() // 
            })
        ));
        if (isEnd || fail) {
            console.log('胜利了');
            this.audioUtils.playEffect('cheer');
        }
        return () => { this.node.runAction(cc.scaleTo(0.3, 0))} // 关闭的动画
    },
    // changeCorrectLabel() {
    //     // 修改胜利时候的文字
    //     if (this.alreadyCorrect < 1) this.alreadyCorrect = 1
    //     this.ppCardLabel.string = '$' + WIN_TXT.CASH[this.alreadyCorrect - 1];
    //     // console.log(this.alreadyCorrect, GAME_MODE.PLAY_TIMES[GAME_MODE.MODE])
    //     if (this.alreadyCorrect === GAME_MODE.PLAY_TIMES[GAME_MODE.MODE] || this.isEnd) {
    //         this.congratLabel.string = WIN_TXT.CONGRAT;
    //         this.buttonLabel.string = WIN_TXT.BUTTON;
    //     }
    // },
    hideAwardPage(cb) {
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 0),
            cc.callFunc(() => {
                cb && cb()
            })
        ));
    },
    onLoad() {
        this.awardViewInit();
    },
    awardViewInit() {
        // 获取所有的文字节点
        this.node.children.forEach(node => {
            if (node._name === 'congratulation') this.congratLabel = node.getChildByName('txt').getComponent(cc.Label);
            if (node._name === 'ppCard') this.ppCardLabel = node.getChildByName('txt').getComponent(cc.Label);
            if (node._name === 'button') this.buttonLabel = node.getChildByName('txt').getComponent(cc.Label);
            // node.color = new cc.Color(0,0,0);
        });
        this.alreadyCorrect = 0; // 正确的次数 方便后面检索cash
        this.isEnd = false; // 表示游戏是否结束
        this.audioUtils = this.audio.getComponent('AudioUtils');
    }
});
