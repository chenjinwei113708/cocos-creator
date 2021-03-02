
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.countDownViewInit();
    },

    /**初始化countDownView */
    countDownViewInit() {
        this.time = 0; // 计时事件
        this.endTime = Infinity; // 表示结束时候需要的事件
        this.timer = null; // 记录计时器的变量
        this.callback = null // 存放计时器到时间所需要执行的方法
        this.canRun = true; // 表示可不可以计时
    },

    /**
     * 开启计时器
     * @param {Number} endTime 结束需要的时间
     * @param {Function} cb 到了结束时间需要执行的函数
     */
    startCountDown(endTime = undefined, cb = undefined) {
        !this.canRun && this.setRunable(true)
        endTime && this.setEndTime(endTime);
        cb && (this.callback = cb);
        if (this.canRun) {
            this.timer = setTimeout(() => {
                console.log('tiktok')
                this.time++;
                this.startCountDown();
                if (this.time >= this.endTime) {
                    this.callback();
                    this.stopCountDown();
                }
            }, 1000)
        } else {

        }
    },

    /**停止计时器 */
    stopCountDown() {
        if (this.timer) clearTimeout(this.timer);
        this.time = 0;
        this.setRunable(false);
    },

    /**设置结束时所需要的事件 */
    setEndTime(endTime) {
        this.endTime = endTime;
    },

    /**设置是否可以计时 */
    setRunable(status) {
        this.canRun = status;
    },
    
    start () {

    },
});
