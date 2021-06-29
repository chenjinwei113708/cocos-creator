import { toggleMask, scaleIn } from '../Utils/Animation';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        downloadMask: cc.Node, // 下载遮罩层
        awardPage: { type: cc.Node, default: null },
        buttonTip: { type: cc.Node, default: null },
        PPPage: cc.Node,
        PPPageBlur: cc.Node
    },

    /**初始化 */
    onLoad() {
        this.awardViewInit();
    },
    
    awardViewInit() {
        this.hideAwardPage; // 存储隐藏奖励页的变量

        this.gameController.setScript(this,
            'gameView',
            'audioUtils',
            'guideView'
        )
    },

    /**切换遮罩层显示 */
    toggleAwardMask (type) {
        return toggleMask(this.mask, type);
    },

    /**展示奖励页面 */
    showAwardPage (node = this.awardPage) {
        return new Promise((resolve, reject) => {
            this.toggleAwardMask('in');
            scaleIn(node).then(() => {
                this.guideView.showHand(this.buttonTip, 'position');
                resolve();
            })
        })
    },

    hideAwardPage (node) {
        return new Promise((resolve, reject) => {
            // 隐藏手
            this.guideView.stopHand();
            this.toggleAwardMask('out');
            scaleOut(this.awardPage1).then(() => {
                resolve();
            })
        })
    },

    showDownloadMask (cb) {
        this.downloadMask.active = true; // 点击任何地方都会进行下载
    },

    /**展示pp奖励页面 */
    showPPPage (cb) {
        return new Promise((resolve, reject) => {
            const moveTime = 0.4;
            const buffer = 15;
            const bufferTime = 0.3;
            const canvas = cc.find('Canvas');
            this.PPPage.position = cc.v2((canvas.width / 2) + (this.PPPage.width / 2), 0); // 让其在整个页面的右边
            this.PPPage.active = true;
            this.PPPage.runAction(cc.sequence(
                cc.moveTo(moveTime, cc.v2(-buffer, 0)),
                cc.moveTo(bufferTime, cc.v2(0, 0)),
                cc.callFunc(() => {
                    resolve();
                    cb && cb();
                })
            ))    
        }) 
    },

    /**展示pp奖励模糊页面 */
    showPPPageBlur (cb) {
        return new Promise((resolve, reject) => {
            const time = 0.25;
            this.PPPageBlur.opacity = 0;
            this.PPPageBlur.active = true;
            this.PPPageBlur.runAction(cc.sequence(
                cc.fadeIn(time),
                cc.callFunc(() => {
                    resolve();
                    cb && cb();
                })
            ))
        })
    },

    /**展示下载的页面 icon 与 下载按钮 */
    showDownload (cb) {
        return new Promise((resolve, reject) => {
            // 打开遮罩层
            // this.toggleMask(fadeInTime);
            this.toggleAwardMask();

            // 初始化参数
            const fadeInTime = 0.5;
            this.download.opacity = 0;
            this.download.active = true;

            // 执行运动
            this.download.runAction(cc.sequence(
                cc.fadeIn(fadeInTime),
                cc.callFunc(() => {
                    // 执行回调
                    cb && cb();
                    resolve();
                })
            ))
        })
    },

    /**收集奖励 */
    handleReceiveAward (cb) {
        return new Promise((resolve, reject) => {
            this.showPPPage().then(() => {
                this.showPPPageBlur().then(() => {
                    this.showDownloadMask();
                    this.showDownload().then(() => {
                        cb && cb();
                        resolve();
                    })
                })
            })
        })
    }
});
