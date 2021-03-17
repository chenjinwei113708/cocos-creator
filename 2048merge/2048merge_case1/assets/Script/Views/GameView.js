import {
    BLOCK_INFO,
    GAME_INFO,
    GAME_STATUS
} from '../Model/ConstValue'

import {
    flyTo,
    scaleIn,
    shake
} from '../Utils/Animation'

// import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        guide: cc.Node, // 引导模块
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node, // 音效
        progress: cc.Node,
        cash: cc.Node,

        ppBoard: cc.Node, // 记分板上icon与logo的父节点
        tip32: cc.Node,
        blocks64: cc.Node,
        blocks32: cc.Node,
        blocksNew: cc.Node,
        blocksFall: cc.Node,
        bomb: cc.Node,
        particle: cc.Prefab,
        pp$200: cc.Prefab,
        pps: cc.Node,
        downloadButton: cc.Node,
        pps: cc.Node,
        pp: cc.Prefab,
        bombEffect: cc.Prefab,
        ppLogos: cc.Node
    },  

    onLoad() {
        this.gameViewInit();
    },

    /**初始化gameView */
    gameViewInit() {
        // 获取节点
        this.ppIcon = this.ppBoard.children.filter(node => {
            return node._name.indexOf('icon') !== -1;
        })[0] // 获取将要飞去的ppicon

        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.CAN_CLICK_32
        }

        // 获取目标脚本
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.progressView = this.progress.getComponent('ProgressView');
        this.cashView = this.cash.getComponent('CashView');
    },

    start () {
        this.cashView.setIcon('');
        // this.addEventListener();
    },

    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    // 节流函数
    getThrottle (fn, delay = 100) {
        let timer = null;
        return function (...args) {
            const _this = this; // 执行这个函数所在的this
            if (timer) return false;
            timer = setTimeout(() => {
                fn.apply(_this, args);
                clearTimeout(timer);
                timer = null;
            }, delay)
        }
    },

    /**增加点击事件 */
    addEventListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    /**点击事件 */
    onTouchStart (e) {
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },

    /**展现开始的手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**处理点击了32的事件 */
    handleClick32 () {
        // 判断状态
        if (this.gameInfo.status !== GAME_STATUS.CAN_CLICK_32) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);

        // 停止手指指引 播放声音
        this.guideView.stopHand();
        this.gameController.getAudioUtils().playEffect('bgClick', 0.8);

        const speed = 0.5;
        const buffer = 5; // 方块掉下来时候的缓冲
        let isGuide = false;

        // 隐藏32并释放粒子特效
        this.blocks32.children.forEach(node => {
            const particle = cc.instantiate(this.particle);
            const pos = node.position
            particle.position = pos;
            particle.parent = node.parent.parent
            // particle.position = pos
            // particle.active = true;
            node.runAction(
                cc.sequence(
                    cc.scaleTo(0.3, 1.2),
                    cc.scaleTo(0.5, 0),
                    cc.callFunc(() => {
                        node.active = false;
                    })
                )
            )
        })

        // 展示炸弹和新合成的64
        setTimeout(() => {
            this.blocksNew.children.forEach(node => {
                node.active = true;
                node.scale = 0;
                node.runAction(
                    cc.sequence(
                        cc.scaleTo(0.4, 1.2),
                        cc.scaleTo(0.2, 1),
                        cc.callFunc(() => {
                            node.parent = this.blocks64;
                            this.setGameStatus(GAME_STATUS.CAN_CLICK_BOMB);
                            if (node._name.indexOf('bomb') !== -1) {
                                node.runAction(cc.repeatForever(
                                    cc.sequence(
                                        cc.scaleTo(0.5, 1.1),
                                        cc.scaleTo(0.5, 0.9)
                                    )
                                ))
                            }
                        }),
                    )
                )
            })
            // 上面的64落下来
            this.blocksFall.children.forEach(node => {
                // 显示隐藏的64
                if (!node.active) {
                    node.active = true
                }
                node.runAction(cc.sequence(
                    cc.moveBy(0.4, cc.v2(0, -1 * (GAME_INFO.FALL_NUM * BLOCK_INFO.HEIGHT + buffer))),
                    cc.moveBy(0.2, cc.v2(0, buffer)),
                    cc.callFunc(() => {
                        // 开始手指引
                        if (!isGuide) {
                            isGuide = true;
                            this.showHand(this.bomb, 'position')
                        }
                        // 变成block64的子节点
                        node.parent = this.blocks64
                    }),
                ))
            })
        }, (0.3 + 0.5) * 1000)

    },

    /**处理点击了炸弹的事件 */
    handleClickBomb () {
        if (this.gameInfo.status !== GAME_STATUS.CAN_CLICK_BOMB) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);

        const cb = () => {
            this.showAwardPage();
        }
        const moneyMusic = this.getThrottle(() => {
            this.gameController.getAudioUtils().playEffect('money', 0.3); // 播放声音
        })

        let isCallback = false; // 表示是否制定了回调,因为遍历节点每个都调用一个
        let isSetProgress = false; // 表示是否已经设置了进度条和cash
        let flyTime = undefined;
        let randomTime = 1000; // 用于制作延迟飞行效果

        // 因为要展示内容所以隐藏掉手
        this.guideView.stopHand();
        this.gameController.getAudioUtils().playEffect('bomb', 0.2); // 播放声音
        // console.log('bomb!!!'); // test

        // 因为有所存储的变量在blocks64中,所以遍历这个即可
        this.blocks64.children.forEach(node => {
            node.stopAllActions();
            node.runAction(cc.spawn(
                cc.scaleTo(0.2, 0),
                cc.callFunc(() => {
                    const pp$200 = cc.instantiate(this.pp$200);
                    const bombEffect = cc.instantiate(this.bombEffect);
                    const pos = this.pps.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position))
                    pp$200.scale = 0;
                    pp$200.active = true;
                    bombEffect.active = true;
                    // pp$200.parent = node.parent
                    pp$200.parent = this.pps;
                    bombEffect.parent = this.pps;
                    pp$200.position = pos;
                    bombEffect.position = pos;
                    pp$200.runAction(cc.sequence(
                        cc.delayTime(0.1),
                        cc.scaleTo(0.4, 1.1),
                        cc.scaleTo(0.2, 1),
                        cc.delayTime(0.1),
                        cc.rotateTo(0.15, 15),
                        cc.rotateTo(0.3, -15),
                        cc.rotateTo(0.15, 0),
                        cc.delayTime(0.3),
                        cc.rotateTo(0.15, 15),
                        cc.rotateTo(0.3, -15),
                        cc.rotateTo(0.15, 0),
                        cc.callFunc(() => {
                            setTimeout(() => {
                                // 为每一个新生成的完成动作之后都飞向ppicon
                                flyTime = flyTo(pp$200, this.ppIcon);
                                setTimeout(() => {
                                    moneyMusic('a', 'b', 'c');
                                    // this.gameController.getAudioUtils().playEffect('money', 0.2); // 播放声音
                                }, 200)
                            }, Math.random() * randomTime)
                            setTimeout(() => {
                                // 判断是否已经回调了
                                if (isCallback) return false;
                                isCallback = true;
                                cb && cb(this.showHand(this.downloadButton, 'parent'));
                                this.gameController.getAudioUtils().playEffect('cheer', 0.4); // 播放声音

                                // 添加金币与进度条
                                if (!isSetProgress) {
                                    isSetProgress = true;
                                    this.shakePPLogo();
                                    this.cashView.addCash(100, flyTime / 2);
                                    this.progressView.setProgress(0.75, flyTime / 2)
                                        .then(() => {
                                            this.shakePPLogo()
                                            this.cashView.addCash(100, flyTime / 2);
                                            this.progressView.setProgress(1, flyTime / 2)
                                        });
                                }
                            }, randomTime)
                        })
                    ))
                })
            ))
        })
    },

    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage()
    },

    /**展示pp飞向icon */
    showPPFly (cb) {
        // 初始化参数与会带哦函数
        const ppNum = 8; // 要生成的pp数量
        const delay = 100; // 每个pp延迟100ms
        const flyTime = (ppNum - 1) * delay
        cb = () => {
            // console.log('show tips32 hand')
            this.showHand(this.tip32, 'parent');
            this.setGameStatus(GAME_STATUS.CAN_CLICK_32);
        }

        // 循环开始
        for (let i = 0; i < ppNum; i++) {
            const pp = cc.instantiate(this.pp);
            pp.parent = this.pps;
            pp.active = true;
            setTimeout(() => {
                flyTo(pp, this.ppIcon)
                setTimeout(() => {
                    this.gameController.getAudioUtils().playEffect('money', 0.3);
                }, 100)
            }, i * delay)
        }

        // 一边飞一边执行的动作
        this.showPPIconLogo();
        this.shakePPLogo();
        this.cashView.addCash(100, flyTime / 1000 / 2);
        this.progressView.setProgress(0.25, flyTime / 1000 / 2)
            .then(() => {
                this.shakePPLogo();
                this.cashView.addCash(100, flyTime / 1000 / 2);
                this.progressView.setProgress(0.55, flyTime / 1000 / 2)
            });

        // 回调
        setTimeout(() => {
            cb && cb();
        }, flyTime)
    },

    /**展示图标与logo */
    showPPIconLogo () {
        this.ppBoard.children.forEach(node => {
            scaleIn(node)
        })
    },

    shakePPLogo () {
        if (!this.ppLogos._shakeIndex) {
            this.ppLogos._shakeIndex = 1;
        } else {
            this.ppLogos._shakeIndex++;
        }
        this.ppLogos.children.forEach((node, index) => {
            if (index <= this.ppLogos._shakeIndex - 1) {
                node.stopAllActions();
                node.runAction(cc.sequence(
                    cc.rotateTo(0.01, 0),
                    cc.callFunc(() => {
                        node.getChildByName('red_point').active = true;
                        shake(node);
                    })
                ))
            }
        })
        
    },

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    }
});
