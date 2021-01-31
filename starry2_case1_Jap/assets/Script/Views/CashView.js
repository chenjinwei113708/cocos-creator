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
        cash: 0,
        progress: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.targetCash = 0; // 目标分数
        // this.updateDelay = 0.05; // 更新时间间隔 s
        this.timer = 0; // 计时器
        this.addTimes = 0;
        this.totalTimes = 3;
        this.label = this.node.getComponent(cc.Label);
        this.progressView = this.progress.getComponent(cc.ProgressBar).getComponent('ProgressView');
        // console.log(this.label);
        this.stopUpdate();
        // 更新不同级别
        this.updateLevel = {
            A: 9, // 0-9是A级
            B: 20,
            C: 40,
            D: 60,
            E: 150,
            F: 5000
        };
        // 更新时间间隔 s
        this.updateDelay = {
            A: 0.05,
            B: 0.05,
            C: 0.04,
            D: 0.03,
            E: 0.02,
            F: 0.01
        };
        // 更新速度 // updateUnit的每一级不能大于updateLevel的上一级
        this.updateUnit = {
            A: 1,
            B: 7,
            C: 8,
            D: 9,
            E: 10,
            F: 100
        };
    },

    start () {

    },

    /**
     * 加分
     * @param {*} number 
     */
    addCash (number) {
        this.addTimes++;
        this.progressView.setProgress(this.addTimes/this.totalTimes);
        this.targetCash = this.targetCash+number;
        // console.log('gradview addCash', number, this.targetCash);
        this.allowUpdate();
    },

    allowUpdate () {
        this.enabled = true;
    },

    stopUpdate () {
        this.enabled = false;
    },

    update (dt) {
        console.log(1000*dt)
        const icon = '円';
        this.timer += dt;
        let isPlus = this.targetCash>this.cash ? true : false;
        let delta = Math.abs(this.targetCash - this.cash);
        let level = Object.keys(this.updateLevel).find(key => {
            console.log(delta, this.updateLevel[key], delta<=this.updateLevel[key])
            delta<=this.updateLevel[key]
        }) || 'F';
        console.log(level);
        // 计时器到达更新时间间隔
        if(this.timer>=this.updateDelay[level]){
            // console.log(this.timer);
            // this.label.string = this.timer;
            // console.log(this.cash, this.targetCash);
            if(delta>0){
                isPlus ? this.cash+=this.updateUnit[level] : this.cash-=this.updateUnit[level];
                this.label.string = this.cash+".00"+icon;
                // this.label.string = this.cash;
            }else{
                this.stopUpdate();
            }
            this.timer=0; // 重置计时器
        }
    },
});
