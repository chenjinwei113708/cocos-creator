import {
    GAME_STATUS,
    GRID_STATUS
} from '../Model/ConstValue'
cc.Class({
    extends: cc.Component,

    properties: {
        moveBox: cc.Node, // 用户移动的方块
        beginBox: cc.Node, // 开始需要电机的方块
        endBox: cc.Node, // 结束时候方块的位置
        grid: cc.Node, // 棋盘
        pps: cc.Node,
        progress: cc.Node,
        mask: cc.Node, // 遮罩层
        gift: cc.Node, // 礼物
        guideHand: cc.Node, // 开始指引的手
        maskBegin: cc.Node, // 游戏开始的遮罩层
        maskEnd: cc.Node, // 游戏结束的遮罩层
        cash: cc.Node,
        guide: cc.Node
    },

    onLoad () {
        // 初始化属性
        this.gameInfo = {
            gameStatus: GAME_STATUS.BEGIN, // 设置游戏的状态的状态
            isGameStarted: false, // 是否开始了游戏
            bombArr: [
                cc.find('Canvas/center/game/grid/4-2'),
                cc.find('Canvas/center/game/grid/5-2'),
                cc.find('Canvas/center/game/grid/4-3'),
                cc.find('Canvas/center/game/grid/5-3'),
                ...cc.find('Canvas/center/game/grid/endBox').children
            ],
            direcDelay: 20, // 延迟时间
            lastCheckTime: Date.now(),
            correctionX: 20, // 开始点击修正值20
            correctionY: 40 // 开始点击修正值40
        }
        // 记录所有格子的坐标
        // 绑定点击移动事件
        this.setGridClickListener()
        this.audio = cc.find('Canvas/center/UI/audioBtn').getComponent('AudioUtils')
    },

    // 绑定点击移动事件
    setGridClickListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    },
    // 点击事件
    onTouchStart (touch) {
        if (this.gameInfo.gameStatus === GAME_STATUS.BEGIN) { // 只有为这个状态的时候才可以移动
            if (!this.gameInfo.isGameStarted) {
                this.gameInfo.isGameStarted = true
                // 隐藏指引的手
            }
            // 记录当前点击的坐标 --> 是一个v3类型
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point)
            // 检查是否是可以点击的状态
            // console.log(this.checkClickable(touchPos))
            if (!this.checkClickable(touchPos)) return
            // 设置状态为可以移动状态 ===> 1
            this.gameInfo.gameStatus = GAME_STATUS.CAN_MOVE
            
            this.hideGuide() // 隐藏开始引导的手
            this.hideMaskBegin() // 隐藏指导的mask
            this.beginBox.active = false // 隐藏一开始的box
            this.audio.playEffect('bgClick')
            this.moveBox.position = this.node.convertToNodeSpaceAR(touch.touch._point)
            this.moveBox.active = true
            this.gameInfo.lastCheckTime = Date.now()
            let newPos = cc.v2(touch.touch._point.x, touch.touch._point.y+77);
            this.moveBox.position = this.node.convertToNodeSpaceAR(newPos)
        }
    },
    // 移动事件
    onTouchMove (touch) {
        // console.log(Date.now() - this.gameInfo.lastCheckTime , this.gameInfo.direcDelay)
        if (!this.gameInfo.gameStatus === GAME_STATUS.CAN_MOVE || !(Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay)) return
        // console.log(touch.touch._point)
        let newPos = cc.v2(touch.touch._point.x, touch.touch._point.y+77);
        this.moveBox.position = this.node.convertToNodeSpaceAR(newPos)
        this.gameInfo.lastCheckTime = Date.now()
    },
    // 结束移动 / 取消移动的事件
    onTouchEnd (touch) {
        if (this.gameInfo.gameStatus === GAME_STATUS.DONE) return
        let newPos = cc.v2(touch.touch._point.x, touch.touch._point.y+77)
        // 判断相对于grid的坐标是否在正确的位置
        if (this.checkEndable(this.grid.convertToNodeSpaceAR(newPos)) && this.gameInfo.gameStatus === GAME_STATUS.CAN_MOVE) {
            // 移到了正确的位置 ---> 结束
            this.gameInfo.gameStatus = GAME_STATUS.DONE // 设置状态为2
            // 设置盒子状态
            this.moveBox.active = false
            this.endBox.active = true
            this.boxDisappear() // 让人物消失
            this.audio.playEffect('bombMusic', 0.5)
            const time = this.showPPs()
            setTimeout(() => {
                // 填满进度条
                this.progress.getComponent('ProgressView').fillProgressBar(1000, this.showGift).then(cb => {
                    cb.apply(this)
                    this.audio.getComponent('AudioUtils').playEffect('cheer')
                })
                // 增加金币
                this.cash.getComponent('CashView').addCash(50)
                // 结束遮罩层
                this.maskEnd.active = true
            }, time)
        } else {
            // 没有移到正确位置 ---> 重置
            this.gameInfo.gameStatus = GAME_STATUS.BEGIN // 0
            this.maskBegin.active = true
            this.maskBegin.runAction(cc.fadeTo(0.2, 150))
            // this.guideHand.active = true
            // this.guideHand.getComponent(cc.Animation).play('movegGuide')
            // 重置moveBox
            this.moveBox.position = cc.v2(GAME_STATUS.BEGIN_POS.x, GAME_STATUS.BEGIN_POS.y)
            this.moveBox.active = false
            this.beginBox.active = true
        }
    },
    // 检查该坐标是否是可以点击的状态
    checkClickable (pos) {
        // console.log(111, this.beginBox.position)
        const minX = this.beginBox.position.x - this.beginBox.width / 2 - this.gameInfo.correctionX
        const maxX = this.beginBox.position.x + this.beginBox.width / 2 + this.gameInfo.correctionX
        const minY = this.beginBox.position.y - this.beginBox.height / 2 - this.gameInfo.correctionY
        const maxY = this.beginBox.position.y + this.beginBox.height / 2 + this.gameInfo.correctionY
        // 判断是否在范围里面
        return (pos.x >= minX && pos.y >= minY && pos.x <= maxX && pos.y <= maxY) ? true : false
    },
    // 检查当前坐标是否可以结束
    checkEndable (pos) {
        const endCenterX = GRID_STATUS.EACH_WIDTH * (GRID_STATUS.END_POS[0][0] + GRID_STATUS.END_POS[1][0]) / 2
        const endCenterY = GRID_STATUS.EACH_WIDTH * (GRID_STATUS.END_POS[0][1] + GRID_STATUS.END_POS[1][1]) / 2
        const maxX = endCenterX + GRID_STATUS.EACH_WIDTH
        const minX = endCenterX - GRID_STATUS.EACH_WIDTH
        const maxY = endCenterY + GRID_STATUS.EACH_HEIGHT / 2
        const minY = endCenterY - GRID_STATUS.EACH_HEIGHT / 2
        return (pos.x >= minX && pos.y >= minY && pos.x <= maxX && pos.y <= maxY) ? true : false
    },
    boxDisappear () {
        // console.log(this.gameInfo.bombArr)
        this.gameInfo.bombArr.forEach(node => {
            // console.log(node)
            node.runAction(cc.scaleTo(0.3, 0))
        })
    },
    // 展示ppIcon动画
    showPPs () {
        // 动画持续1.4秒
        this.pps.children.forEach(ppIcon => {
            ppIcon.active = true
            ppIcon.children.forEach((pp, index) => {
                if (index === 0) {
                    pp.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1),
                        cc.delayTime(0.9),
                        cc.scaleTo(0.2, 0)
                    ))
                } else if (index === 1) {
                    pp.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.1, 1 - (1 / 5)),
                        cc.delayTime(0.5),
                        cc.scaleTo(0.2, 0)
                    ))
                } else if (index === 2) {
                    pp.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.1, 1 - (1 / 5)),
                        cc.scaleTo(0.1, 1 - (2 / 5)),
                        cc.delayTime(0.4),
                        cc.scaleTo(0.2, 0)
                    ))
                } else if (index === 3) {
                    pp.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.1, 1 - (1 / 5)),
                        cc.scaleTo(0.1, 1 - (2 / 5)),
                        cc.scaleTo(0.1, 1 - (3 / 5)),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.2, 0)
                    ))
                } else if (index === 4) {
                    pp.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1),
                        cc.delayTime(0.3),
                        cc.scaleTo(0.1, 1 - (1 / 5)),
                        cc.scaleTo(0.1, 1 - (2 / 5)),
                        cc.scaleTo(0.1, 1 - (3 / 5)),
                        cc.scaleTo(0.1, 1 - (4 / 5)),
                        cc.delayTime(0.2),
                        cc.scaleTo(0.2, 0),
                    ))
                }

            })
        })
        return 1500
    },
    // 展示礼物
    showGift () {
        // 对遮罩层的操作
        // console.log(111111)
        this.mask.opacity = 0
        this.mask.active = true
        this.mask.runAction(cc.fadeTo(0.6, 150))
        // 对礼物盒的操作
        this.gift.active = true
        this.gift.scale = 0
        this.gift.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.callFunc(() => {
                const btn = this.gift.children.filter(node => node._name === 'btn')[0]

                // this.guide.position = this.guide.convertToNodeSpaceAR(this.gift.convertToWorldSpaceAR(btn.position))
                this.guide.position = this.guide.convertToNodeSpaceAR(this.gift.convertToWorldSpaceAR(btn.position))
                this.guide.active = true
                const guideView = this.guide.getComponent('GuideView')
                // guideView.myFadeIn(this.guide, guideView.myClickHere(this.guide))
                guideView.myClickHere(this.guide)
            })
        ))
    },
    // 隐藏开始的遮罩层
    hideMaskBegin () {
        this.maskBegin.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.maskBegin.active = false
            })
        ))
    },
    // 隐藏开始引导的手
    hideGuide () {
        this.guideHand.getComponent(cc.Animation).stop()
        this.guideHand.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(0.5, 0),
                cc.scaleTo(0.5, 1.2),
            ),
            cc.callFunc(() => {
                this.guideHand.active = false
            })
        ))
    },
    start () {

    },
    
    // update (dt) {},
});
