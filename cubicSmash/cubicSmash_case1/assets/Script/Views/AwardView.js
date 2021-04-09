import { scaleIn, scaleOut } from '../Utils/Animation';
import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        downloadMask: cc.Node, // 下载遮罩层
        awardPage: { type: cc.Node, default: null },
        PPPage: cc.Node,
        PPPageBlur: cc.Node,
        awardPage1: { type: cc.Node, default: null },
        buttonTip: { type: cc.Node, default: null }
    },

    /**初始化 */
    onLoad() {
        this.awardViewInit();
    },
    
    awardViewInit() {
        this.hideAwardPage; // 存储隐藏奖励页的变量
        this.alreadyShowAwardPage1 = 0; // 根据这个变量来表示展示了几次awardPage1

        this.gameController.setScript(this,
            'gameView',
            'audioUtils',
            'guideView',
            'progressView',
            'cashView',
            'turnView'
        )
    },

    /**展示奖励页面 */
    showAwardPage (cb) {
        return new Promise((resolve, reject) => {
            const time = 0.5;
            const bufferTime = 0.2;
            const maxScale = 1.2;
    
            // this.toggleMask(); // 展示遮罩层
    
            this.awardPage.scale = 0; // 默认缩放设置为0
            this.awardPage.active = true;
            this.awardPage.runAction(cc.sequence(
                cc.scaleTo(time, maxScale),
                cc.scaleTo(bufferTime, 1),
                cc.callFunc(() => {
                    cb && cb();
                    resolve();
                })
            ));
            this.hideAwardPage = () => { this.node.runAction(cc.scaleTo(time, 0)) } // 关闭的动画
        })
    },

    /**切换遮罩层 */
    // toggleMask (time = 0.5, cb) {
    //     // const time = 0.5; // 所需要花费时间
    //     const maxOpacity = 125; 
    //     this.mask.stopAllActions(); // 首先停止所有动作
    //     if (this.mask.active) {
    //         // 已经激活 => 变成隐藏
    //         this.mask.runAction(
    //             cc.sequence(
    //                 cc.fadeOut(time),
    //                 cc.callFunc(() => {
    //                     this.mask.active = false;
    //                     cb && cb();
    //                 })
    //             )
    //         )
    //     } else {
    //         // 没有激活 => 变成激活
    //         this.mask.opacity = 0;
    //         this.mask.active = true
    //         this.mask.runAction(
    //             cc.sequence(
    //                 cc.fadeTo(time, maxOpacity),
    //                 cc.callFunc(() => {
    //                     cb && cb();
    //                 })
    //             )
    //         )
    //     }
    // },
    toggleMask (type) {
        const fadeTime = 0.5;
        const maxOpacity = 125;
        const isActive = this.mask.active;

        if (type === 'out' || (type === undefined && isActive === true)) {
            // 隐藏
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeOut(fadeTime),
                cc.callFunc(() => {
                    this.mask.active = false;
                })
            ))
        } else if ( type === 'in' || (type === undefined && isActive === false)) {
            this.mask.opacity = 0;
            this.mask.active = true;
            // 显示
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeTo(fadeTime, maxOpacity),
                cc.callFunc(() => {
                    // this.mask.active = true;
                })
            ))
        }
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
            this.toggleMask('in');

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

    /**展示奖赏页面 */
    showAwardPage1 () {
        this.toggleMask('in');
        // 根据游戏状态播放声音
        const status = this.gameView.getGameStatus();
        console.log(status === GAME_STATUS.GAME_OVER, status, GAME_STATUS.GAME_OVER);
        if (status === GAME_STATUS.CAN_RECEIVE1) {
            this.audioUtils.playEffect('correct');
        } else if (status === GAME_STATUS.GAME_OVER) {
            this.audioUtils.playEffect('cheer');
        } else {
            console.log(status)
            return false;
        }
        return new Promise((resolve, reject) => {
            scaleIn(this.awardPage1).then(() => {
                this.guideView.showHand(this.buttonTip)
                resolve();
            })
        })
    },

    hideAwardPage1 () {
        // 隐藏手
        this.guideView.stopHand && this.guideView.stopHand();
        // 表示展示过一次
        const status = this.gameView.getGameStatus();
        return new Promise((resolve, reject) => {
            this.toggleMask('out');
            // 第一次收集
            if (status === GAME_STATUS.CAN_RECEIVE1) {
                this.audioUtils.playEffect('bgClick');
                scaleOut(this.awardPage1).then(() => {
                    this.handleReveiceAward1().then(() => {
                        // 调整状态
                        this.gameView.setGameStatus(GAME_STATUS.CAN_DRAG);
                        this.gameView.showDrag();
                        this.gameView.toggleDragMask();
                    });
                    this.turnView.hideTurn();
                    resolve();
                })
            // 第二次出现
            } else if (status === GAME_STATUS.GAME_OVER) {
                // this.gameView.handleGameOver(); // 游戏结束
                this.gameController.download();
            } else {
                reject(new Error(`状态值不正确${status}`));
            }
        })
    },

    /**根据游戏status判断 */
    handleReveiceAward1 () {
        return new Promise((resolve, reject) => {
            this.gameView.showPPs(this.gameView.ppIcon, () => {
                // 增加进度条还有金币
                this.progressView.setProgress(0.5, GAME_INFO.ADD_CASH_TIME);
                this.cashView.addCash(100, GAME_INFO.ADD_CASH_TIME)
            }).then(() => {
                resolve();
            })
        })
        // 展示拖拽手
        // this.gameView.showHandDrag([...this.gameView.tips]);
        // this.gameView.setGameStatus(GAME_STATUS.CAN_DRAG);
        // } else if (status === GAME_STATUS.CAN_RECEIVE2) {
        //     this.gameView.setGameStatus
        // }
        // 展示pp
    },

    changeAwardPage1Txt () {
        // 获取状态值并赋予字体
        const status = this.gameView.getGameStatus();
        if (!(status === GAME_STATUS.CAN_RECEIVE1 || status === GAME_STATUS.GAME_OVER)) return console.log('修改文字之前请保证正确的status: ' + status)
        let ppCardTxt = GAME_INFO.AWARD_PAGE1_TXT[status].PP_CARD;
        let buttonTxt = GAME_INFO.AWARD_PAGE1_TXT[status].BUTTON;
        // 获取文字节点
        const cardLabel = this.awardPage1.getChildByName('pp_card').getChildByName('txt').getComponent(cc.Label);
        const buttonlabel = this.awardPage1.getChildByName('button').getChildByName('txt').getComponent(cc.Label);

        cardLabel.string = ppCardTxt;
        buttonlabel.string = buttonTxt;
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
