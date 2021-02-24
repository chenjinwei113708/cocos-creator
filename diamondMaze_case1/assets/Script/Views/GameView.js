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
        target: cc.Node, // 表示棋盘
        guide: cc.Node, // 表示指引的手
        soak: cc.Node, // 把钻石吸入的龙卷风
        wing: cc.Node, // 一开始显示的龙卷风
        progress: cc.Node, // 进度条
        pps: cc.Node, // 飞向记分板的pp标
        light: cc.Node, // pps出现时闪耀的效果
        ppCard: cc.Node, // pp卡
        mask: cc.Node, // pp卡出现时候的遮罩层
        cash: cc.Node, // 分数
        downLoad: cc.Node, // downLoad遮罩层
        audio: cc.Node
    },

    onLoad() {
        this.gameViewInit();
        this.showGuide()
    },

    gameViewInit() {
        this.isSoak = false; // 表示是否在旋转
        this.isFillProgress = false;
        this.isAddCash = false; // 表示已经添加了cash
        this.audioUtils = this.audio.getComponent('AudioUtils');
    },
    // 显示引导
    showGuide() {
        const wing = this.target.children.filter(node => node._name === 'wing')[0];
        this.guide.position = this.node.parent.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(wing.position));
        this.guide.active = true;
        const guideView = this.guide.getComponent('GuideView');
        guideView.myClickHere(this.guide)
        // console.log(this.node.parent.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(wing.position)))
    },
    // 显示ppCard的引导
    // showCashOutGuide() {
    //     const cashOut = cc.find('Canvas/center/UI/paypal/ppCard/cashout2');
    //     this.guide.position = this.guide.convertToNodeSpaceAR(this.ppCard.convertToWorldSpaceAR(cashOut.position));
    //     this.guide.active = true;
    //     const guideView = this.guide.getComponent('GuideView');
    //     guideView.myClickHere(this.guide)
    // },
    // 表示点击了龙卷风
    clickWing(e) {
        this.handleSoak(e)
    },
    // 吸入
    handleSoak(e) {
        if (this.isSoak) return;
        // 点击音效
        this.audioUtils.playEffect('bgClick', 1)
        this.isSoak = true;
        // 隐藏引导
        this.guide.active = false;
        this.soak.position = this.node.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(this.wing.position))
        this.soak.active = true;
        // 为soak添加吸入声音
        this.audioUtils.playEffect('wing')
        // 为soak添加缩放动画
        this.soak.runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.delayTime(1),
            cc.scaleTo(0.5, 0),
            cc.callFunc(() => {
                this.audioUtils.playEffect('fresh', 0.5)
                setTimeout(() => {
                    this.audioUtils.playEffect('soakDone')
                }, 1000)
            })
        ))
        this.wing.active = false; // 隐藏龙卷风
        const oriPos = e.target.convertToWorldSpaceAR(e.target.getPosition());
        const childrens = this.target.children;
        childrens.forEach(box => {
            // const nowPos = box.convertToWorldSpaceAR(cc.v2(box.x, box.y));
            const endPos = e.target.convertToNodeSpaceAR(oriPos);
            // const bezierPos = box.convertToNodeSpaceAR(cc.v2((oriPos.x - nowPos.x) * 0.75 + nowPos.x, oriPos.x > nowPos.x ? nowPos.y + 150 : nowPos.y - 150));
            // const bezierPos = this.target.convertToNodeSpaceAR(cc.v2(oriPos.x > nowPos.x ? nowPos.x + 300 : nowPos.x - 300, oriPos.x > nowPos.x ? nowPos.y + 300 : nowPos.y - 300));
            // var bezier = [cc.v2(0, 0), cc.v2(0, 0), endPos];
            // 为每一个都加上动画
            box.runAction(cc.sequence(
                cc.delayTime(1), // 停留0.5秒等待时间
                cc.spawn(
                    // cc.bezierTo(1, bezier)
                    cc.moveTo(0.5, endPos),
                    cc.fadeOut(0.8), // 消失
                    cc.sequence(
                        cc.delayTime(1), // 透明度为0的时候隐藏该元素
                        cc.callFunc(() => {
                            box.active = false;
                            if (!this.isFillProgress) this.progress.getComponent('ProgressView').fillProgressBar(1000, this.showPPs.bind(this)).then(cb => cb());
                            this.isFillProgress = true
                            // this.progress.fillProgressBar(1000);
                        })
                    )
                )
            ))
            // setTimeout(() => {
            //     if (!this.isFillProgress) this.progress.getComponent('ProgressView').fillProgressBar(1000, this.showPPs.bind(this)).then(cb => cb());
            //         this.isFillProgress = true
            // }, (0.5 + 0.8 + 1) * 1000)
        });
    },
    // 展现pp标飞向计分处
    showPPs() {
        const wing = this.target.children.filter(node => node._name === 'wing')[0];
        const showPos = this.node.parent.convertToNodeSpaceAR(this.target.convertToWorldSpaceAR(wing.position));
        this.pps.position = showPos;
        this.light.position = showPos;
        this.pps.active = true;
        this.light.active = true;
        const moneyIcon = cc.find('Canvas/center/UI/paypal/scoreBoard/moneyIcon');
        const endPos = this.node.parent.convertToNodeSpaceAR(moneyIcon.parent.convertToWorldSpaceAR(moneyIcon.position));
        this.pps.runAction(cc.scaleTo(0.1, 1))
        this.pps.children.forEach((pp, index) => {
            setTimeout(() => {
                pp.runAction(
                    cc.sequence(
                        cc.delayTime(0.1), // 等待pps缩放出来
                        cc.spawn(
                            cc.moveTo(0.5, cc.v2(endPos.x - showPos.x, endPos.y - showPos.y)),
                            cc.scaleTo(0.5, 0.5),
                            cc.sequence(
                                cc.delayTime(0.5), // 等待pp飞向记分板
                                cc.spawn(
                                    cc.scaleTo(0.2, 0),
                                    cc.fadeOut(0.2),
                                    cc.callFunc(() => {
                                        if (this.isAddCash) return;
                                        this.isAddCash = true
                                        this.cash.getComponent('CashView').addCash(200);
                                    })
                                )
                            ),
                            cc.callFunc(() => {
                                this.audioUtils.playEffect('money')
                            })
                        )
                    )
                )
            }, index * 100)
        })
        setTimeout(() => {
            this.showPPCard();
        }, (this.pps.children.length - 2) * 100 + 500)
    },
    // 展示pp卡
    showPPCard() {
        // 同时播放胜利背景音乐
        this.audioUtils.playEffect('cheer')
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.5, 180));
        this.ppCard.runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.callFunc(() => {
                // const cashOutHand = this.children.filter(value => value._name === 'chahoutHand');
                // cashOutHand.active = true
                // cashOutHand.
                this.guide.getComponent('GuideView').showCashOutHand()
                this.downLoad.active = true
            })
        ));
        // this.showCashOutGuide()
    }
});
