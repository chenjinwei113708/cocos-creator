
cc.Class({
    extends: cc.Component,

    properties: {
        game: cc.Node,
        audio: cc.Node,
        alarm: cc.Node
    },
    onLoad () {
        this.countDownViewInit();
        this.startCountDown();
    },
    /**初始化 */
    countDownViewInit() {
        this.time = 15;
        this.currentTimer = null;
        this.tipsTime = 0; // 累计多久没点击
        this.label = this.node.getComponent(cc.Label);
        this.gameView = this.game.getComponent('GameView');
        this.isRed = false; // 是否为红色
        this.audioUtils = this.audio.getComponent('AudioUtils');
    },
    /**设置倒计时 */
    startCountDown() {
        if (this.time <= 0 && this.gameView.canPlay) {
            // 失败执行
            this.gameView.canPlay = false;
            this.gameView.handleFailure();
        } else {
            if (this.tipsTime >= 5) {
                this.tipsTime = 0; // 重置为0
                this.gameView.showTips(); // 显示引导
            }
            this.currentTimer = setTimeout(() => {
                this.time--;
                if (this.time <= 5) {
                    if (!this.isRed) this.setRedWord();
                    if (this.time !== 0) {
                        this.audioUtils.playEffect('timing');
                        this.alarmShake()    
                    }
                }
                // console.log(this.time, this.tipsTime)
                if (!this.gameView.tips) this.tipsTime++;
                this.label.string = this.time + 's'
                this.startCountDown();
            }, 1000)
        }
    },
    alarmShake() {
        this.alarm.runAction(cc.sequence(
            cc.rotateTo(0.1, 25),
            cc.rotateTo(0.2, -25),
            cc.rotateTo(0.1, 0)
        ))
    },
    stopCountDown() {
        clearTimeout(this.currentTimer);
        this.tipsTime = 0;
    },
    setRedWord() {
        this.node.color = new cc.Color(255, 100, 100);
        this.isRed = true;
    },
});
