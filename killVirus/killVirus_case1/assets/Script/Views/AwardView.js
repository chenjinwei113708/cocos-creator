cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        downloadMask: cc.Node, // 下载遮罩层
        ppCard: cc.Node, // 中部pp卡
        download: cc.Node, // 下载页面
        downloadButton: cc.Node, // 下载的按钮
        iphoneBg: cc.Node, // iphone展示时候的背景
        audio: cc.Node, // 音效
        PPPage: cc.Node,
        PPPageBlur: cc.Node,
        puzzle: cc.Prefab, // 生成的碎片
        puzzlePage: { type: cc.Node, default: null },
        puzzle: { type: cc.Node, default: null },
        iphone: { type: cc.Node, default: null }, // 测试用的手机
        puzzleOriPos: { type: cc.Node, default: null }
    },

    /**初始化 */
    onLoad() {
        this.awardViewInit();
    },
    
    awardViewInit() {
        this.hideAwardPage; // 存储隐藏奖励页的变量

        this.gameController.setScript(this, 
            'gameView',
            'cashView',
            'progressView'
        );

    },

    /**节防抖函数 */
    getDebounce (fn, delay = 40) {
        let timer = null;
        return function (...args) {
            if (timer) {
                clearTimeout(timer);
                timer = null
            }
            const _this = this; // 执行这个函数所在的this
            // if (timer) return false;
            timer = setTimeout(() => {
                timer = null;
                fn.apply(_this, args);
                // clearTimeout(timer);
            }, delay)
        }
    },
    
    /**展示奖励页面 */
    showAwardPage (cb) {
        return new Promise((resolve, reject) => {
            const time = 0.5;
            const bufferTime = 0.2;
            const maxScale = 1.2;
    
            // this.toggleMask(); // 展示遮罩层
    
            this.node.scale = 0; // 默认缩放设置为0
            this.node.active = true;
            this.node.runAction(cc.sequence(
                cc.scaleTo(time, maxScale),
                cc.scaleTo(bufferTime, 1),
                cc.callFunc(() => {
                    cb && cb();
                    resolve();
                })
            ));
    
            // 显示紫色背景图
            this.iphoneBg.opacity = 0;
            this.iphoneBg.active = true;
            this.iphoneBg.runAction(
                cc.fadeIn(0.4)
            )

            console.log('胜利了');
            // this.audioUtils.playEffect('cheer');
    
            this.hideAwardPage = () => { this.node.runAction(cc.scaleTo(time, 0)) } // 关闭的动画
        })
    },

    /**展示碎片页面 */
    showPuzzlePage (options = { addCash: 20, progress: 1, time: 1 }, cb) {
        const endPos = this.puzzleOriPos.parent.convertToNodeSpaceAR(this.iphone.parent.convertToWorldSpaceAR(this.iphone));
        console.log(endPos);
        this.puzzlePage.scale = 0;
        this.puzzlePage.active = true;
        
        const scaleTime = 0.4;

        // 应该放在init
        this.cashView = this.gameController.cashView;
        this.progressView = this.gameController.progressView;
        this.gameView = this.gameController.gameView;
        this.audioUtils = this.gameController.audioUtils;
        this.puzzleNum = 4;
        // ↑
        this.audioUtils.playEffect('correct');

        return new Promise((resolve, reject) => {
            this.puzzlePage.runAction(cc.spawn(
                cc.scaleTo(scaleTime, 1),
                cc.callFunc(() => {
                    let isCallback = false;
                    let delay = 300; // 循环之间的延迟

                    for (let i = 0; i < this.puzzleNum; i++) {
                        setTimeout(() => {
                            this.makePuzzle(endPos).then(() => {
                                if (isCallback) return false;
                                isCallback = true;
                                this.progressView.setProgress(options.progress, options.time);
                                this.cashView.addCash(options.addCash, options.time);
                                setTimeout(() => {
                                    this.hidePuzzlePage().then(() => {
                                        this.gameView.toggleMask('out');
                                        setTimeout(() => {
                                            // 再加一层延迟
                                            // 回调
                                            cb && cb();
                                            resolve();
                                        }, delay)
                                    })
                                }, (this.puzzleNum - 1) * delay)
                            })
                        }, i * delay)
                    }
                    // const puzzle = cc.instantiate(this.puzzle);
                    // puzzle.parent = this.puzzlePage;
                    // puzzle.active = true;
                    // puzzle.runAction(cc.spawn(
                    //     cc.rotateTo(time, endAngle),
                    //     cc.sequence(
                    //         cc.moveBy(moveTime1, cc.v2(-50, 200)).easing(cc.easeCubicActionOut()),
                    //         cc.delayTime(delay),
                    //         cc.spawn(
                    //             cc.moveTo(moveTime2, endPos).easing(cc.easeCubicActionIn()),
                    //             cc.scaleTo(moveTime2, 0).easing(cc.easeCubicActionIn())
                    //         ),
                            // cc.callFunc(() => {
                            //     puzzle.active = false;
                            //     this.hidePuzzlePage().then(() => {
                                    // this.cashView.addCash(options.addCash, options.time);
                                    // this.progressView.setProgress(options.progress, options.time).then(() => {
                                    //     console.log('关闭了');
                                    //     // 回调
                                    //     cb && cb();
                                    //     resolve();
                                    // });
                                    // this.gameView.toggleMask('out');
                            //     });
                            // })
                    //     )
                    // ))
                })
            ))
        })
    },

    makePuzzle (endPos, cb) {
        const time = 1.9;
        const moveTime1 = 0.6;
        const moveTime2 = 1.2;
        const delay = 0.1;
        const endAngle = -45;
        
        return new Promise((resolve, reject) => {
            const puzzle = cc.instantiate(this.puzzle);
            puzzle.parent = this.puzzlePage;
            puzzle.active = true;
            puzzle.runAction(cc.spawn(
                cc.rotateTo(time, endAngle),
                cc.sequence(
                    cc.moveBy(moveTime1, cc.v2(-50, 200)).easing(cc.easeCubicActionOut()),
                    cc.delayTime(delay),
                    cc.spawn(
                        cc.moveTo(moveTime2, endPos).easing(cc.easeCubicActionIn()),
                        cc.scaleTo(moveTime2, 0).easing(cc.easeCubicActionIn())
                    ),
                    cc.callFunc(() => {
                        puzzle.active = false;
                        // 并且播放声音
                        this.audioUtils.playEffect('money');
                        cb && cb();
                        resolve();
                    })
                )
            ))
        })
    },

    hidePuzzlePage (cb) {
        const scaleTime = 0.4;
        
        return new Promise((resolve, reject) => {

            this.puzzlePage.runAction(cc.sequence(
                cc.scaleTo(scaleTime, 0),
                cc.callFunc(() => {
                    this.puzzlePage.active = false;
                    cb && cb();
                    resolve();
                })
            ))
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
    }


});
