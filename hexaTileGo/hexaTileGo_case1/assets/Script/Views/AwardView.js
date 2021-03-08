import { GAME_MODE, WIN_TXT } from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        congract: cc.Node, // congraculation节点
        awardPage: cc.Node,
        ppCard: cc.Node, // 中部pp卡
        button: cc.Node, // 结束按钮
        audio: cc.Node, // 音效
        mask: cc.Node, // 颜色遮罩层
        downloadMask: cc.Node // 下载遮罩层
    },
    /**展示奖励页面 */
    showAwardPage(cb, isEnd, fail) {
        this.awardPage.scale = 0; // 默认缩放设置为0
        this.awardPage.active = true;
        this.awardPage.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.callFunc(() => {
                cb && cb() // 
            })
        ));

        // 并且展示遮罩层
        this.mask.opacity = 0;
        this.mask.scale = 1;
        this.mask.active = true;
        this.mask.runAction(cc.sequence(
            cc.fadeTo(0.3, 135),
            cc.callFunc(() => {

            })
        ))

        // if (isEnd || fail) {
            console.log('胜利了');
            this.audioUtils.playEffect('cheer');
        // }
        return () => { // 关闭的动画
            this.awardPage.stopAllActions();
            this.awardPage.runAction(cc.scaleTo(0.3, 0))
        }
    },
    hideAwardPage(cb) {
        this.award.runAction(cc.sequence(
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
        // this.node.children.forEach(node => {
        //     if (node._name === 'congratulation') this.congratLabel = node.getChildByName('txt').getComponent(cc.Label);
        //     if (node._name === 'ppCard') this.ppCardLabel = node.getChildByName('txt').getComponent(cc.Label);
        //     if (node._name === 'button') this.buttonLabel = node.getChildByName('txt').getComponent(cc.Label);
        //     // node.color = new cc.Color(0,0,0);
        // });
        this.alreadyCorrect = 0; // 正确的次数 方便后面检索cash
        this.isEnd = false; // 表示游戏是否结束
        this.audioUtils = this.audio.getComponent('AudioUtils');
    }
});
