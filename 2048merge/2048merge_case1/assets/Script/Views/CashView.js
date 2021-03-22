cc.Class({
    extends: cc.Component,

    properties: {
        cash: 0 // 当前金额
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化参数
        this.currentCash = this.cash
        this.targetCash = 0; // 目标金额 初始为0
        this.icon = '$ '; // 金额符号
        this.iconType = 'head'; // 符号所在位置
        this.eachAdd = 100; // 每次增加的金额

        this.updatable = false; // 是否可以更新
        this.isPlus = true; // 表示为增加或者减少金额

        // 获取节点
        this.label = this.node.getComponent(cc.Label);
    },

    /** 设置符号的位置以及状态
     * @param {String} icon 设置金额的字符
     * @param {Boolean} iconType 设置字符在金额的哪个位置 有head和behind
     */
    setIcon(icon = '$ ', iconType) {
        this.icon = icon;
        this.iconType = iconType;
    },

    /**
     * @param {Number} num 目标金额
     * @param {*} time 达到金额所需要的时间
     */
    addCash(num, addTime = 1) {
        this.targetCash += num; // 目标金额
        this.addTime = addTime; // 增加时长

        this.isPlus = this.targetCash > this.currentCash ? true : false;
        this.eachAdd = Math.abs(this.targetCash - this.currentCash) * (0.0166666666666666) / addTime; // 每dt增加的cash

        this.setUpdatable(true); // 设置为可以加钱状态
    },

    /**设置是否可以增加 */
    setUpdatable(status) {
        this.updatable = status;
    },

    update(dt) {
        if (!this.updatable) return false;
        this.currentCash = this.currentCash + (this.isPlus ? (this.eachAdd) : (-1 * this.eachAdd))
        this.cash = parseInt(this.currentCash); // 增加金币并四舍五入

        // 是否结束的判断
        if (this.isPlus ? (this.currentCash >= this.targetCash) : (this.currentCash <= this.targetCash)) {
            this.setUpdatable(false);
            this.currentCash = this.targetCash;
            this.cash = this.targetCash;
        }

        // 判断符号在前面还是后面
        if (this.iconType) {
            this.label.string = this.icon + this.cash;
        } else {
            this.label.string = this.cash + this.icon;
        }
    },
});
