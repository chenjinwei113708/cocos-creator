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
        grade: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.targetGrade = 0; // 目标分数
        this.updateDelay = 0.05; // 更新时间间隔 s
        this.timer = 0; // 计时器
        this.label = this.node.getComponent(cc.Label);
        // console.log(this.label);
        this.stopUpdate();
        // 更新不同级别
        this.updateLevel = {
            A: 9, // 0-9是A级
            B: 70,
            C: 200,
            D: 500,
            E: 10000
        };
        // 更新时间间隔 s
        this.updateDelay = {
            A: 0.1,
            B: 0.05,
            C: 0.04,
            D: 0.03,
            E: 0.02
        };
        // 更新速度 // updateUnit的每一级不能大于updateLevel的上一级
        this.updateUnit = {
            A: 1,
            B: 8,
            C: 20,
            D: 100,
            E: 200
        };
    },

    start () {

    },

    /**
     * 加分
     * @param {*} number 
     */
    addGrade (number) {
        this.targetGrade = this.targetGrade+number;
        // console.log('gradview addGrade', number, this.targetGrade);
        this.allowUpdate();
    },

    allowUpdate () {
        this.enabled = true;
    },

    stopUpdate () {
        this.enabled = false;
    },

    update (dt) {
        this.timer += dt;
        let delta = this.targetGrade - this.grade;
        let level = Object.keys(this.updateLevel).find(key => delta<=this.updateLevel[key]) || 'E';
        // console.log(level);
        // 计时器到达更新时间间隔
        if(this.timer>=this.updateDelay[level]){
            // console.log(this.timer);
            // this.label.string = this.timer;
            // console.log(this.grade, this.targetGrade);
            if(this.grade<this.targetGrade){
                this.grade+=this.updateUnit[level];
                this.label.string = this.grade;
            }else{
                this.stopUpdate();
            }
            this.timer=0; // 重置计时器
        }
    },
});
