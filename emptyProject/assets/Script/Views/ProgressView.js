
cc.Class({
    extends: cc.Component,

    properties: {
        audio: cc.Node
    },

    onLoad () {
        // 节点
        this.progressBar = this.node.getComponent(cc.ProgressBar);
        
        // 初始化参数
        this.currentProgress = this.progressBar.progress; // 获取当前的进度
        this.targetProgress = this.currentProgress; // 设置初始目标进度条
        this.fillable = false; // 表示是否可以加载
        this.isPlus = true; // 默认进度条增加方向
        this.eachAdd = 0;
    },

    /**
     * 
     * @param {Number} num 进度条的进度, 0 - 1
     * @param {*} addTime 增加进度条所需要的时间
     * @param {*} cb 回调函数
     * @returns 返回一个Promise
     */
    setProgress(num, addTime = 1, cb) {
        if (num > 1 || num < 0) return false;
        return new Promise((resolve, reject) => {
            this.currentProgress = this.progressBar.progress;
            this.targetProgress = num; // 设置目标进度条
            this.addTime = addTime; // 设置增加时间
            this.setFillable(true); // 设置是否可以增加进度条

            this.isPlus = this.targetProgress > this.currentProgress ? true : false;
            this.eachAdd = Math.abs(this.targetProgress - this.currentProgress) * (0.0166666666666666) / addTime; // 每dt增加的cash

            setTimeout(() => {
                // 过了之间直接到最终点
                this.setFillable(false);
                this.currentProgress = this.targetProgress;
                this.progressBar.progress = this.targetProgress;
                // 回调与promise
                cb && cb();
                resolve();
            }, addTime * 1000)
        })
    },

    setFillable(status) {
        this.fillable = status;
    },

    update (dt) {
        if (!this.fillable) return false;
        this.currentProgress = this.currentProgress + (this.isPlus ? this.eachAdd : (-1 * this.eachAdd))
        this.cash = parseInt(this.currentProgress); // 增加金币并四舍五入

        // 是否结束的判断
        if (this.isPlus ? (this.currentProgress >= this.targetProgress) : (this.currentProgress <= this.targetProgress)) {
            this.setFillable(false);
            this.currentProgress = this.targetProgress;
            this.progressBar.progress = this.targetProgress;
        }
        // 每次的进度条更改
        this.progressBar.progress = this.currentProgress;
    },
});
