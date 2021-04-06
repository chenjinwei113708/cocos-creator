import { GAME_STATUS, GAME_INFO } from '../Model/ConstValue';
import { animInfo, scaleIn } from '../Utils/Animation';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        downloadMask: cc.Node, // 下载遮罩层
        ppCard: cc.Node, // 中部pp卡
        download: cc.Node, // 下载页面
        downloadButton: cc.Node, // 下载的按钮
        audio: cc.Node, // 音效
        PPPage: cc.Node,
        PPPageBlur: cc.Node,
        PPCardPage1: { type: cc.Node, default: null },
        PPCardPage2: { type: cc.Node, default: null },
        tip_PPCard1_1: { type: cc.Node, default: null }, // 引导点击的位置
        tip_PPCard1_2: { type: cc.Node, default: null }, // showpps的位置
        tip_PPCard2_1: { type: cc.Node, default: null },
        tip_PPCard2_2: { type: cc.Node, default: null }
    },

    /**初始化 */
    onLoad() {
        this.awardViewInit();
    },
    
    awardViewInit() {
        this.hideAwardPage; // 存储隐藏奖励页的变量
    },

    /**展示奖励页面 */
    showAwardPage (cb) {
        return new Promise((resolve, reject) => {
            // console.log('showAwardPage')
            // const time = 0.6;
            const largeTime = 0.4;
            const smallTime = 0.2;
            const bufferTime = 0.2;
            const maxScale = 1.2;
    
            this.toggleMask(); // 展示遮罩层
    
            this.node.scale = 0; // 默认缩放设置为0
            this.node.active = true;
            this.node.runAction(cc.sequence(
                cc.scaleTo(largeTime, maxScale),
                cc.scaleTo(smallTime, 1),
                cc.callFunc(() => {
                    cb && cb();
                    resolve();
                })
            ));
    
            // console.log('胜利了');
            // this.audioUtils.playEffect('cheer');
    
            this.hideAwardPage = () => { this.node.runAction(cc.scaleTo(time, 0)) } // 关闭的动画
        })
    },

    /**切换遮罩层 */
    toggleMask (time = 0.5, cb) {
        // const time = 0.5; // 所需要花费时间
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
    },

    showDownloadMask (cb) {
        return new Promise((resolve, reject) => {
            this.downloadMask.active = true; // 点击任何地方都会进行下载
        })
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
            this.toggleMask(fadeInTime);

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
    },

    /**展示pp卡1 */
    showPPCardPage1 () {
        this.gameController.audioUtils.playEffect('correct'); // 正确的声音
        return new Promise((resolve, reject) => {
            this.PPCardPage1.scale = 0;
            this.PPCardPage1.active = true;
    
            // 开始显示
            scaleIn(this.PPCardPage1).then(() => {
                // 出现手
                resolve();
            });
            this.toggleMask();
        })
    },

    /**隐藏pp卡1 */
    hidePPCardPage1 () {
        this.gameController.guideView.stopHand(); // 隐藏手
        this.gameController.gameView.showPPs(this.tip_PPCard1_2).then(() => {
            this.gameController.cashView.addCash(300, GAME_INFO.EACH_LIGHT_TIME * 2);
            this.gameController.gameView.setProgress(2).then(() => {
                this.gameController.turnView.hideTurn();
            });
        });
        const scaleOutTime = 0.4;

        // 同时隐藏遮罩层
        this.toggleMask();
        // 隐藏pp卡
        this.PPCardPage1.runAction(cc.sequence(
            cc.scaleTo(scaleOutTime, 0),
            cc.callFunc(() => {
                this.PPCardPage1.active = false;
                // 隐藏turn
                // this.gameController.turnView.hideTurn();
            })
        ));
    },

    /**展示pp卡2 */
    showPPCardPage2 () {
        return new Promise((resolve, reject) => {
            this.PPCardPage1.scale = 0;
            this.PPCardPage1.active = true;
    
            // 开始显示
            scaleIn(this.PPCardPage2).then(() => {
                // 出现手
                resolve();
            });
            this.toggleMask();
        })
    },

    /**隐藏pp卡2 */
    hidePPCardPage2 () {
        this.gameController.guideView.stopHand(); // 隐藏手
        const scaleOutTime = 0.4;

        // 同时隐藏遮罩层
        this.toggleMask();
        // 隐藏pp卡
        this.PPCardPage2.runAction(cc.sequence(
            cc.scaleTo(scaleOutTime, 0),
            cc.callFunc(() => {
                this.PPCardPage1.active = false;
            })
        ))
    },
});
