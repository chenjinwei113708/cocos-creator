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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.spinInfo = {
            angle: 0, // 当前角度,
            unit: 0.5, // 每帧摆动的角度，正值。 设置这个值来调整摆动速度,
            isLeft: true, // 是否往左摆动
            leftMost: -40, // 往左摆动最大幅度
            rightMost: 40, // 往右摆动最大幅度
        };
        this.enabled = false;
    },

    start () {},

    /**设置当前角度 */
    setAngle (angle) {
        this.spinInfo.angle = angle;
        this.node.angle = angle;
        // console.log('angle: ', angle);
    },
    /**获得当前角度 */
    getAngle () {
        return this.spinInfo.angle;
    },

    /**开始旋转 */
    resetSpin () {
        this.setAngle(0);
        this.spinInfo.isLeft = true;
        this.enabled = true; // 开始更新
    },

    /**停止旋转,返回当前旋转的角度 */
    stopSpin () {
        this.enabled = false; // 停止更新
        return this.getAngle();
    },

    continueSpin () {
        this.enabled = true; // 开始更新
    },

    update (dt) {
        let unit = 0;
        let most = 0;
        if (this.spinInfo.isLeft) {
            unit = 0-this.spinInfo.unit;
            most = this.spinInfo.leftMost;
        } else {
            unit = this.spinInfo.unit;
            most = this.spinInfo.rightMost;
        }
        this.setAngle(this.spinInfo.angle+unit);
        if (Math.abs(this.spinInfo.angle) >= Math.abs(most)) {
            if (this.spinInfo.isLeft) {
                this.spinInfo.isLeft = false;
            } else {
                this.spinInfo.isLeft = true;
            }
        }
    },
});
