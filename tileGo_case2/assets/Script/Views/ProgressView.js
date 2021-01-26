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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pp1 = this.node.getChildByName('pp1');
        this.pp2 = this.node.getChildByName('pp2');
        this.pp3 = this.node.getChildByName('pp3');
        this.pp4 = this.node.getChildByName('pp4');
        this.pp5 = this.node.getChildByName('pp5');
        this.pp6 = this.node.getChildByName('pp6');
        this.progressBar = this.node.getComponent(cc.ProgressBar);
        this.pps = [this.pp1, this.pp2, this.pp3, this.pp4, this.pp5, this.pp6];

        this.info = {
            nowProgress: 0,
            targerProgress: 0,
            unit: 0.02,
            animCount: 0,
        };
    },

    start () {
        this.enabled = false;
        this.setProgress(0);
        // setTimeout(() => {
        //     this.setProgress(0.33);
        // }, 1000);
        // setTimeout(() => {
        //     this.setProgress(0.66);
        // }, 3000);
        // setTimeout(() => {
        //     this.setProgress(1);
        // }, 5000);
    },

    /**
     * 设置pp卡抖动
     * @param {*} progress 当前进度
     */
    setPPShake (progress) {
        // console.log('setPPShake', progress);
        let shakeNum = parseInt(progress/0.2)+1;
        this.pps.forEach((node, index) => {
            node.stopAllActions();
            node.runAction(cc.scaleTo(0.1, 1));
            if (index+1 <= shakeNum) {
                /**方案一*/
                // setTimeout(() => {
                //     node.stopAllActions();
                //     node.scale = 1;
                //     // node.runAction(cc.repeatForever(
                //     //     cc.sequence(
                //     //         // cc.scaleTo(0.15, 1.15),
                //     //         cc.rotateTo(0.15, 10),
                //     //         // cc.scaleTo(0.15, 1),
                //     //         cc.rotateTo(0.15, -10),
                //     //         cc.rotateTo(0.08, 0),
                //     //         cc.callFunc(() => {
                //     //             if (index+1 === shakeNum) {
                //     //                 this.info.animCount++;
                //     //                 // 为防止动画重叠，重新开始动画
                //     //                 if (this.info.animCount >= 8) {
                //     //                     this.info.animCount = 0;
                //     //                     this.setPPShake(progress);
                //     //                 }
                //     //             }
                //     //         }),
                //     //         cc.delayTime(0.65)),
                //     // ));
                //     node.runAction(cc.repeatForever(
                //         cc.sequence(
                //             cc.rotateTo(0.15, 10),
                //             cc.rotateTo(0.15, -10)
                //         )
                //     ));
                // }, index*130);

                /**方案二*/
                node.runAction(cc.repeatForever(
                    cc.sequence(
                        cc.rotateTo(0.15, 10),
                        cc.rotateTo(0.15, -10)
                    )
                ));
            }
        });
        
    },

    /**
     * 设置进度条进度
     * @param {*} num 0-1 进度
     */
    setProgress (num) {
        if (num<0 || num>1) return;
        this.info.targerProgress = num;
        let distance = num - this.info.nowProgress;
        // if (distance === 0) return;
        // 设置加减单位
        this.info.unit = distance > 0 ? Math.abs(this.info.unit) : -Math.abs(this.info.unit);
        this.enabled = true;
    },

    update (dt) {
        if (Math.abs(this.info.targerProgress - this.info.nowProgress) > Math.abs(this.info.unit)) {
            this.info.nowProgress += this.info.unit;
            this.progressBar.progress = this.info.nowProgress;
        } else {
            this.info.nowProgress = this.info.targerProgress;
            this.progressBar.progress = this.info.nowProgress;
            this.enabled = false;
            this.setPPShake(this.info.nowProgress);
        }
    },
});
