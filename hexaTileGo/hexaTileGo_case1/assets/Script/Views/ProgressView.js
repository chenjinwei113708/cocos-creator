
cc.Class({
    extends: cc.Component,

    properties: {
        fresh: cc.Node,
        audio: cc.Node
    },

    onLoad () {
        this.time = 1; // 每次加载需要的时间
        this.canFill = false; // 表示是否可以加载
        this.alreadyFill = 0; // 表示已经加载了多少次
        this.times = 1; // 表示需要多少次加载完进度条
        this.progressBar = this.node.getComponent(cc.ProgressBar);
    },
    /**
     * 
     * @param {*} time 
     * @param {*} times 次数，表示总共的填充次数
     */
    fillProgressBar(time, times, cb) {
        return new Promise((resolve, reject) => {
            this.canFill = true; // 表示可以填充
            this.time = time; // 总时间
            this.times = times; // 分成几次攒进度条
            setTimeout(() => {
                // this.progressBar.progress += 1 / times;
                this.alreadyFill += 1;
                this.progressBar.progress = this.alreadyFill / times;
                this.canFill = false;
                resolve(cb)
            }, time * 1000)
        })
    },

    update (dt) {
        if (!this.canFill || this.fullTime === 0) return;
        this.progressBar.progress += dt / this.time / this.times;
    },
});
