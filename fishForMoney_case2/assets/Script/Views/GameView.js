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
        npc: cc.Node, // 渔夫
        fishes: cc.Node, // 所有鱼存在的节点
        ppcard: cc.Node, // pp卡
        gameHand: cc.Node, // 游戏指引手
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 钓鱼线节点
        this.graph = cc.find('Canvas/center/game/spin/xian/line').getComponent(cc.Graphics);
        // 鱼钩
        this.hook = cc.find('Canvas/center/game/spin/xian/hook');
        // 鱼钩摇摆控制器
        this.spin = cc.find('Canvas/center/game/spin');
        // 游戏信息
        this.gameInfo = {
            isFishing: false, // 是否正在钓鱼
            isLineMove: false, // 是否正在绘制钓鱼线，
            lineNormalLength: 119.79, // 线正常长度对应的y
            lineStartY: 288.577, // 线起点的y
            lineMostLength: -337, // 线跑出后长度对应的y
            lineMoveUnit: 5, // 线移动单位
            isLineFall: true, // 线移动方向，是不是向下
            lineCurrentY: 119.79, // 线当前长度对应的y
            fishNode: null, // 钓到鱼了，鱼节点
            isCatchFish: false, // 是否钓到鱼了
            hookAngle: 0, // 钩子下降时的角度
            isPPCardShow: false, // 是否展示pp卡
            ppcardNum: 50, // 现金卡面值
            isGameStarted: false, // 游戏开始没
            fishTimes: 0, // 钓鱼次数
        };
        this.initLine();
        this.setTouchListener();
        this.startCollider();
    },

    start () {},

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },
    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart (touch) {
        if (this.gameInfo.isFishing) return;
        this.gameInfo.isFishing = true;
        this.startFish();
        let angle = this.spin.getComponent('SpinController').stopSpin();
        this.gameInfo.hookAngle = angle;
        // console.log('touch angle: ', angle);
    },

    /**开启碰撞组件 */
    startCollider () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true; // 绘制调试信息
    },

    /**抛竿，开始钓鱼 */
    startFish () {
        this.npc.getComponent(cc.Animation).play();
        let animState = this.spin.getComponent(cc.Animation).play();
        animState.on('finished', () => {
            // console.log('123')
            this.gameController.getAudioUtils().playEffect('click', 0.4);
            this.gameInfo.isLineMove = true;
        });
    },

    /**钓到鱼了 */
    hitFish (fish) {
        const fishCash = {
            ppcard50: 50,
            ppcard100: 100,
            ppcard200: 200,
        };
        this.gameInfo.isCatchFish = true;
        this.gameInfo.fishNode = fish;
        // 设置金额
        let cashNum = fishCash[fish._name];
        this.gameInfo.ppcardNum = cashNum;
        // console.log('钓到鱼了', fish, cashNum);
        this.gameInfo.fishTimes++;
        setTimeout(() => {
            this.gameInfo.isLineFall = false;
            fish.runAction(cc.rotateTo(0.3, -this.gameInfo.hookAngle));
            // this.gameInfo.fishNode.angle = this.gameInfo.hookAngle;
        }, 50);
    },

    /**绘制初始的钓鱼线 */
    initLine () {
        const graph = this.graph;
        // console.log('tryLine', graph);
        graph.moveTo (0, this.gameInfo.lineStartY);
        graph.lineTo(0, 119.79);
        // graph.lineTo(200, -200);
        graph.stroke();
        // graph.fill();
    },

    /**展示开场现金卡 */
    showPPCard (num) {
        if (this.gameInfo.isPPCardShow) return;
        this.gameInfo.isPPCardShow = true;
        num = Number(num);
        let ppcard = this.ppcard;
        ppcard.getChildByName('cash').getComponent(cc.Label).string = `$${num}`;
        ppcard.opacity = 0;
        ppcard.active = true;
        ppcard.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.4);
            }),
            cc.fadeIn(0.3)
        ));
    },

    /**点击pp现金卡 */
    clickPPCard () {
        if (!this.gameInfo.isPPCardShow) return;
        this.gameInfo.isPPCardShow = false;
        let num = this.gameInfo.ppcardNum;
        let ppcard = this.ppcard;
        ppcard.active = false;
        this.gameInfo.isFishing = false;
        this.gameController.getAudioUtils().playEffect('income', 0.4);
        
        this.gameController.addCash(num);
        // this.gameInfo.getCashTimes++;
        if (this.gameController.cashView.targetCash >= 200) {
            this.gameController.getAudioUtils().playEffect('cheer', 0.4);
            this.offTouchListener();
            this.enabled = false;
            this.gameController.guideView.showCashOutHand();
            let noticash = cc.find('Canvas/center/UI/tankuang/cash');
            let congratcash = cc.find('Canvas/center/UI/congrat/cash');
            noticash.getComponent(cc.Label).string = `$${this.gameController.cashView.targetCash}`;
            congratcash.getComponent(cc.Label).string = `${this.gameController.cashView.targetCash}`;
        }
        if (!this.gameInfo.isGameStarted) {
            this.gameInfo.isGameStarted = true;
            this.spin.getComponent('SpinController').resetSpin();
        }
        if (this.gameInfo.fishTimes === 1) {
            this.gameHand.runAction(cc.sequence(
                cc.fadeOut(0.2),
                cc.callFunc(() => {
                    this.gameHand.active = false;
                })
            ));
        }
        
    },

    update (dt) {
        // 绘制钓鱼线
        if (this.gameInfo.isLineMove) {
            let unit = 0;
            let destY = 0;
            if (this.gameInfo.isLineFall) {
                unit = 0-this.gameInfo.lineMoveUnit;
                destY = this.gameInfo.lineCurrentY + unit;
                if (destY <= this.gameInfo.lineMostLength) {
                    destY = this.gameInfo.lineMostLength;
                    this.gameInfo.isLineFall = false;
                }
            } else {
                unit = this.gameInfo.lineMoveUnit;
                destY = this.gameInfo.lineCurrentY + unit;
                if (destY >= this.gameInfo.lineNormalLength) {
                    destY = this.gameInfo.lineNormalLength;
                    // 结束此次绘制
                    this.gameInfo.isLineFall = true;
                    this.gameInfo.isLineMove = false;
                    if (this.gameInfo.isGameStarted) {
                        this.spin.getComponent('SpinController').continueSpin();
                    }
                    if (this.gameInfo.isCatchFish) {
                        this.gameInfo.fishNode && (this.gameInfo.fishNode.active = false);
                        this.gameInfo.isCatchFish = false;
                        this.gameInfo.fishNode = null;
                        this.showPPCard(this.gameInfo.ppcardNum);
                    } else {
                        this.gameInfo.isFishing = false;
                    }
                }
            }
            this.gameInfo.lineCurrentY = destY;
            this.graph.clear();
            this.graph.moveTo (0, this.gameInfo.lineStartY);
            this.graph.lineTo(0, destY);
            this.hook.position = cc.v2(0, destY);
            this.graph.stroke();
            if (this.gameInfo.isCatchFish) {
                let newPos = this.fishes.convertToNodeSpaceAR(this.spin.convertToWorldSpaceAR(cc.v2(this.hook.position.x, this.hook.position.y-328))); 
                this.gameInfo.fishNode.position = newPos;
                
            }
        }
    },
});
