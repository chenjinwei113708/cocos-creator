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
        congract: cc.Node, // congraculation节点
        ppCard: cc.Node, // 中部pp卡
        button: cc.Node, // 结束按钮
        audio: cc.Node // 音效
    },
    /**展示奖励页面 */
    showAwardPage(cb) {
        this.audioUtils = this.audio.getComponent('AudioUtils');
        this.audioUtils.playEffect('cheer')
        this.node.scale = 0;
        const endScale = this.node.isLandScape ? this.node.endScale : 1 // 再gameModel里面设置了
        this.node.active = true;
        this.node.runAction(cc.scaleTo(0.3, endScale));
        setTimeout(() => {
            cb && cb() // cb 一般放下载遮罩层
            // this.audioUtils.playEffect('cheer');
        }, 0.3 * 1000)
    },

    // onLoad() {
    //     this.awardViewInit();
    // },
    awardViewInit() {
        // 获取所有的文字节点
        this.node.children.forEach(node => {
            if (node._name === 'congratulation') this.congratTXT = node;
            if (node._name === 'ppCard') this.ppCardTXT = node;
            if (node._name === 'button') this.buttonTXT = node;
        });
        this.audioUtils = this.audio.getComponent('AudioUtils');
        console.log(1111)
        console.log(this.audioUtils)
    }
});
