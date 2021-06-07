cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        downloadMask: cc.Node, // 下载遮罩层
        ppCard: cc.Node, // 中部pp卡
        button: cc.Node, // 结束按钮
        audio: cc.Node // 音效
    },

    /**初始化 */
    onLoad() {
        this.awardViewInit();
    },
    awardViewInit() {
        this.hideAwardPage; // 存储隐藏奖励页的变量
        
        // 获取节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
    },

    /**展示奖励页面 */
    showAwardPage(cb) {
        const time = 0.5;
        const bufferTime = 0.2;
        const maxScale = 1.2;

        this.toggleMask(); // 展示遮罩层

        this.node.scale = 0; // 默认缩放设置为0
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.scaleTo(time, maxScale),
            cc.scaleTo(bufferTime, 1),
            cc.callFunc(() => {
                this.gameController.endGame(); // 结束游戏方法
                this.downloadMask.active = true; // 点击任何地方都会进行下载
                cb && cb();
            })
        ));

        console.log('胜利了');
        // this.audioUtils.playEffect('cheer');

        this.hideAwardPage = () => { this.node.runAction(cc.scaleTo(time, 0)) } // 关闭的动画
    },

    /**切换遮罩层 */
    toggleMask (cb) {
        const time = 0.5; // 所需要花费时间
        const maxOpacity = 125; 
        this.mask.stopAllActions(); // 首先停止所有动作
        if (this.mask.active) {
            // 已经激活 => 变成隐藏
            this.mask.runAction(
                cc.sequence(
                    cc.fadeOut(time),
                    cc.callFunc(() => {
                        this.mask.active = false;
                        cb && cb();
                    })
                )
            )
        } else {
            // 没有激活 => 变成激活
            this.mask.opacity = 0;
            this.mask.active = true
            this.mask.runAction(
                cc.sequence(
                    cc.fadeTo(time, maxOpacity),
                    cc.callFunc(() => {
                        cb && cb();
                    })
                )
            )
        }
    }

    
});
