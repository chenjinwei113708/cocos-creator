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
        cash: 20,
        activeBtn: cc.SpriteFrame,
        inactiveBtn: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isDownload = true; // 是否导向下载
        this.isCanGet = false; // 是否可以点击
        this.iphone = cc.find('Canvas/center/UI/iphone');
        this.airpods = cc.find('Canvas/center/UI/airpods');
        this.progressBar = cc.find('Canvas/center/UI/paypal/topAbox/progress').getComponent(cc.ProgressBar);
        this.getbtn = cc.find('Canvas/center/UI/paypal/topAbox/btn');
        this.gethand = cc.find('Canvas/center/UI/paypal/topAbox/btn/hand');
        this.total = 30;
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.targetCash = 20; // 目标分数
        // this.updateDelay = 0.05; // 更新时间间隔 s
        this.timer = 0; // 计时器
        this.label = this.node.getComponent(cc.Label);
        // console.log(this.label);
        this.stopUpdate();
        // 更新不同级别
        this.updateLevel = {
            A: 9, // 0-9是A级
            B: 20,
            C: 40,
            D: 60,
            E: 150
        };
        // 更新时间间隔 s
        this.updateDelay = {
            A: 0.05,
            B: 0.05,
            C: 0.04,
            D: 0.03,
            E: 0.02
        };
        // 更新速度 // updateUnit的每一级不能大于updateLevel的上一级
        this.updateUnit = {
            A: 1,
            B: 3,
            C: 8,
            D: 9,
            E: 10
        };
    },

    start () {

    },

    /**
     * 加分
     * @param {*} number 
     */
    addCash (number) {
        this.targetCash = this.targetCash+number;
        // console.log('gradview addCash', number, this.targetCash);
        this.allowUpdate();
        return this.targetCash;
    },

    allowUpdate () {
        this.enabled = true;
    },

    stopUpdate () {
        this.enabled = false;
    },

    showHand () {
        this.gethand.opacity = 0;
        this.gethand.active = true;
        let animstate = this.gethand.getComponent(cc.Animation).play('here');
        animstate.on('finished', () => {
            this.gethand.getComponent(cc.Animation).play('shake');
        });
        this.isDownload = false;
    },

    clickGet () {
        if (!this.isCanGet && this.isDownload) {
            this.gameController.download();
        } else {
            this.isCanGet = false;
            this.getbtn.getComponent(cc.Sprite).spriteFrame = this.inactiveBtn;
            this.addCash(-30);
            this.gethand.active = false;
            this.showIphone();
        }
    },

    showIphone () {
        this.iphone.opacity = 0;
        this.iphone.scale = 0;
        this.iphone.active = true;
        this.gameController.getAudioUtils().playEffect('cheer', 0.5);
        this.iphone.runAction(cc.sequence(
            cc.delayTime(0.1),
            cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.4, 1)),
            cc.callFunc(() => {
                this.airpods.active = true;
            }),
            cc.delayTime(2),
            cc.fadeOut(0.4),
            cc.callFunc(() => {
                this.iphone.active = false;
            })
        ))
    },

    update (dt) {
        const icon = '/30';
        this.timer += dt;
        let isPlus = this.targetCash>this.cash ? true : false;
        let delta = Math.abs(this.targetCash - this.cash);
        let level = Object.keys(this.updateLevel).find(key => delta<=this.updateLevel[key]) || 'E';
        // console.log(level);
        // 计时器到达更新时间间隔
        if(this.timer>=this.updateDelay[level]){
            // console.log(this.timer);
            // this.label.string = this.timer;
            // console.log(this.cash, this.targetCash);
            if(delta>0){
                isPlus ? this.cash+=this.updateUnit[level] : this.cash-=this.updateUnit[level];
                this.label.string = this.cash+icon;
                this.progressBar.progress = this.cash/this.total;
                let isCanGet = this.cash/this.total >= 1 ? true : false;
                if (isCanGet !== this.isCanGet && isCanGet) {
                    this.isCanGet = isCanGet;
                    this.getbtn.getComponent(cc.Sprite).spriteFrame = this.activeBtn;
                    this.showHand();
                } else if (isCanGet !== this.isCanGet && !isCanGet) {
                    this.isCanGet = isCanGet;
                    this.getbtn.getComponent(cc.Sprite).spriteFrame = this.inactiveBtn;
                }
            }else{
                this.stopUpdate();
            }
            this.timer=0; // 重置计时器
        }
    },
});
