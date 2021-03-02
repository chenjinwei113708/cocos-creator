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
        nowProgress: 1,
        targerProgress: 0,
        unit: 0.02,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.pp1 = this.node.getChildByName('pp1');
        // this.pp2 = this.node.getChildByName('pp2');
        // this.pp3 = this.node.getChildByName('pp3');
        // this.pp4 = this.node.getChildByName('pp4');
        this.progressBar = this.node.getComponent(cc.ProgressBar);

        // this = {
        //     nowProgress: 1,
        //     targerProgress: 0,
        //     unit: 0.02,
        // }
    },

    start () {
        // this.setProgress(0.33);
    },

    /**
     * 设置进度条进度
     * @param {*} num 0-1 进度
     */
    setProgress (num) {
        if (num<0 || num>1) return;
        this.targerProgress = num;
        let distance = num - this.nowProgress;
        if (distance === 0) return;
        // 设置加减单位
        this.unit = distance > 0 ? Math.abs(this.unit) : -Math.abs(this.unit);
        this.enabled = true;
    },

    update (dt) {
        if (Math.abs(this.targerProgress - this.nowProgress) > Math.abs(this.unit)) {
            this.nowProgress += this.unit;
            this.progressBar.progress = this.nowProgress;
        } else {
            this.nowProgress = this.targerProgress;
            this.progressBar.progress = this.nowProgress;
            this.enabled = false;
        }
    },
});
