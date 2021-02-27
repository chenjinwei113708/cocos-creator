import {
    CORRECT_POS,
    GAME_MODE,
    GAME_INFO
} from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        correct1: {
            type: cc.Node,
            default: []
        },
        correct2: {
            type: cc.Node,
            default: []
        },
        correct3: {
            type: cc.Node,
            default: []
        },
        correct4: {
            type: cc.Node,
            default: []
        },
        correct5: {
            type: cc.Node,
            default: []
        },
        guide: cc.Node, // 引导模块
        difference1: cc.Node,
        difference2: cc.Node,
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node, // 音效
        progress: cc.Node,
        countDown: cc.Node,
        dashCircle: cc.Prefab, // 提示框预制资源
        pref: cc.Node //
    },

    onLoad() {
        this.gameViewInit();
        this.bindChildClickEvent(); // 绑定点击事件
        this.showStartGuide(); // 展示开始的引导
    },
    // 初始化gameview
    gameViewInit() {
        // 初始化参数
        this.endProgress = 1; // 初始默认设置为1
        this.currentProgress = 0; // 初始的进度
        this.canPlay = true; // 动画是否正在播放
        this.stopStartGuide = null; // 存储停止提示方法的变量
        // this.isEnd = false; // 表示游戏是否结束了 => 用来防止后面结束方法调用两次
        this.allAward = 0; // 表示累计奖励
        this.isShowingCorrect = false; // 表示正在展示正确页
        // this.isShowTips = false;
        this.tips = null; // 用来后续储存tips
        this.ppLogos = [];
        this.progress.children.forEach(node => { // 获取ppLogo
            if (node._name.indexOf('ppLogo') > -1) this.ppLogos.push(node);
        })
        // 获取目标脚本
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.audioUtils = this.audio.getComponent('AudioUtils');
        this.progressView = this.progress.getComponent('ProgressView'); // 获取其脚本文件
        this.countDownView = this.countDown.getComponent('CountDownView');
        // 设置游戏玩法
        this.endProgress = GAME_MODE.PLAY_TIMES[GAME_MODE.MODE]; // 困难简易模式在GAME_MODE里面设置了
    },
    // 绑定点击事件
    bindChildClickEvent() {
        this.node.children.forEach(node => {
            node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        })
    },
    onTouchStart(e) {
        const clickPos = e.target.convertToNodeSpaceAR(e.touch._point);
        this.audioUtils.playEffect('bgClick');
        let name = null;
        if ((name = this.checkClick(clickPos)) && (this.currentProgress < this.endProgress) && this.canPlay) {
            // 点击正确播放good音效
            // this.audioUtils.playEffect('good');
            name = name.toLowerCase(); // 获取的是CORRECT所以要变成小写，然后作为key用来给this检索
            
            this.stopStartGuide && this.stopStartGuide(); // 如果存在函数则生效  停止开始的引导
            this.canPlay = false; // 表示动画正在进行
            this.currentProgress++; // 每次点击成功就加
            this.countDownView.stopCountDown(); // 停止计时
            this.tips && this.hideTips(); // 如果有提示的话隐藏提示
            
            this[name].forEach(node => { // 遍历已经存储的correct
                if (!node.isClick) {
                    node.isClick = true; // 为node设置自定义属性
                    node.scale = 0;
                    node.active = true;
                    node.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1.4),
                        cc.scaleTo(0.2, 1),
                        cc.callFunc(() => {
                            if (this.isShowingCorrect) return;
                            this.isShowingCorrect = true; // 表示打开奖励动画的时候不能再触发
                            this.progressView.fillProgressBar(0.5, this.endProgress, this.ppShake.bind(this)).then(cb => {
                                cb && cb(this.currentProgress);
                            }); // 涨进度条
                            if (this.currentProgress >= this.endProgress) { // 判断游戏否是结束
                                // this.countDownView.stopCountDown();// 并且停用计时器
                                this.handleCorrect(true); // 结束
                            } else  {
                                this.handleCorrect(false); // 处理点击正确的方法(并不是结束的方法)
                                this.canPlay = true; // 表示动画已经结束 游戏不结束才开放canPlay
                            }
                        })
                    ))
                }
            })
        }
    },
    handleCorrect(isEnd) {
        this.toggleMask(); // 切换隐藏页

        // 显示奖励页
        this.awardView.showAwardPage(() => {
            if (isEnd) this.downloadMask.active = true;
            this.showCashOutHand();
        }, isEnd);
    },
    // 展示开始时的引导手
    showStartGuide() {
        this.guideView.startHand.position = this.difference1.convertToNodeSpaceAR(this.difference1.convertToWorldSpaceAR(this.correct1[0].position));
        this.stopStartGuide = this.guideView.showStartHand();
    },
    // 展示获取奖励的引导手
    showCashOutHand() {
        // console.log(this.node.convertToNodeSpaceAR(this.awardPage.convertToWorldSpaceAR(this.awardView.button.position)))
        // this.guideView.cashOutHand.position = this.node.convertToNodeSpaceAR(this.awardPage.convertToWorldSpaceAR(this.awardView.button.position))
        // this.stopCashOutHand = this.guideView.showCashOutHand();
        this.guideView.myFadeIn(this.guideView.cashOutHand, () => {
            this.stopCashOutHand = this.guideView.myClickHere(this.guideView.cashOutHand);
        });
    },
    // 展示提示用的框框
    showTips() {
        // this.isShowTips = true;
        this.tips = cc.instantiate(this.dashCircle);
        this.tips.parent = this.difference1; // 绑定到difference
        const endPos = [this.correct1[0], this.correct2[0], this.correct3[0], this.correct4[0], this.correct5[0]].find(node => {
            return !node.isClick; // 表示返回一个没有点击过的
        }).position;
        this.tips.position = endPos; // 设置为该未点击的位置
        this.tips.opacity = 0;
        this.tips.scale = 0.5;
        this.tips.active = true;
        this.tips.runAction(cc.spawn(
            cc.fadeIn(0.5),
            cc.sequence(
                cc.scaleTo(0.3, 1.4),
                cc.scaleTo(0.2, 1)
            )
        ));
        this.tips.getComponent('cc.Animation').play('lightSpin');
    },
    hideTips() {
        this.tips.stopAllActions()
        this.tips.runAction(cc.fadeOut(0.5))
        setTimeout(() => {
            this.tips.active = false;
            this.tips.getComponent('cc.Animation').stop('lightSpin');
            this.tips = null;
            // this.isShowTips = false;
        }, 500)
    },
    // 获取奖励
    getAward() {
        if (!this.canPlay) return; // 结束游戏不能触发点击
        this.audioUtils.playEffect('money');
        this.awardView.hideAwardPage(() => {
            this.countDownView.startCountDown.call(this.countDownView); // 重新开始计时
            this.stopCashOutHand.call(this.guideView);
        }); // 隐藏奖励页 并结束时打开倒计时
        this.toggleMask(); // 切换
    },
    // 获取两点的直线距离
    getDistance(pos1, pos2) {
        // return Math.floor(Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)));
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },
    // 切换遮罩层
    toggleMask() {
        if (!this.mask.active) {
            this.mask.active = true;
            this.mask.opacity = 0;
            this.mask.runAction(cc.fadeTo(0.3, 130));
        } else {
            this.mask.stopAllActions();
            this.mask.runAction(cc.sequence(
                cc.fadeOut(0.3), cc.callFunc(() => {
                    this.isShowingCorrect = false;
                    this.mask.active = false;
            })));
        }
    },
    // pp卡抖动并出现红点
    ppShake(index) {
        this.ppLogos.forEach(node => {
            node.stopAllActions();
            node.runAction(cc.rotateTo(0.01, 0));
        })
        setTimeout(() => {
            for (let i = 0; i <= index - 1; i++) {
                this.ppLogos[i].children[0].active = true; // 设置红点
                this.ppLogos[i].runAction(
                    cc.repeatForever(cc.sequence(
                        cc.rotateTo(0.1, 15),
                        cc.rotateTo(0.2, -12),
                        cc.rotateTo(0.1, 0)
                    )
                ))
            }
        }, 10)
    },
    // 查看点击的是否在范围里面，如果是返回一个index
    checkClick(pos) {
        let result = false;
        Object.keys(CORRECT_POS).forEach(index => {
            const distance = this.getDistance(CORRECT_POS[index], pos);
            if (GAME_INFO.CORRECT_RANGE[index].x >= distance.x && GAME_INFO.CORRECT_RANGE[index].y >= distance.y) result = index;
        })
        return result;
    },
    // 倒计时结束, 失败
    handleFailure() {
        this.stopStartGuide(); // 隐藏开始的引导手
        this.toggleMask(); // 打开遮罩层
        this.awardView.showAwardPage(() => {
            this.downloadMask.active = true;
            this.showCashOutHand();
        }, true, true);
    }
});
