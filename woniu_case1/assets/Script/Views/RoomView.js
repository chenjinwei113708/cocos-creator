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

    onLoad () {
        // 节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.countDownView = cc.find('Canvas/center/UI/countDown').getComponent('CountDownView'); // 获取计时器
        this.roomHand = this.node.getChildByName('btn01').getChildByName('hand');
        this.level = this.node.getChildByName('level01');
        this.select = this.node.getChildByName('select');
        this.levelCenter = this.level.getChildByName('center');

        // 节点
        this.level = {
            blue01: this.levelCenter.getChildByName('blue01'),
            blue02: this.levelCenter.getChildByName('blue02'),
            blue03: this.levelCenter.getChildByName('blue03'),
            t1: this.levelCenter.getChildByName('t1'),
            t2: this.levelCenter.getChildByName('t2'),
            t3: this.levelCenter.getChildByName('t3'),
            t4: this.levelCenter.getChildByName('t4'),
            t5: this.levelCenter.getChildByName('t5'),
        };

        // 信息记录
        this.info = {
            currentLevel: 1,
            levelInterval: null,
        };

        // 升级配置
        this.levelConfig = {
            level1: {
                sprite: 'blue01',
                number: {t1: 86, t2: 55, t3: 42, t4: 90, t5: 30}
            },
            level2: {
                sprite: 'blue02',
                number: {t1: 99, t2: 78, t3: 102, t4: 96, t5: 125}
            },
            level3: {
                sprite: 'blue03',
                number: {t1: 223, t2: 220, t3: 204, t4: 231, t5: 219}
            },
        }
        this.levelTmp = {t1: 1, t2: 1, t3: 1, t4: 1, t5: 1};

        // 方法
        this.stopRoomHand = null;
    },

    start () {
        this.showRoomHand();
    },
    
    // 展现提示手
    showRoomHand() {
        this.gameController.guideView.myFadeIn(this.roomHand, () => {
            this.stopRoomHand = this.gameController.guideView.myClickHere(this.roomHand);
        });
    },

    updateLevel (callback) {
        // 停止手运动
        this.countDownView.stopCountDown();
        this.stopRoomHand && this.stopRoomHand();
        // 设置计时器
        switch (this.info.currentLevel) {
            case 1: 
                // 设置进化点击手
                this.countDownView.startCountDown(2, this.showRoomHand.bind(this));
                break;
            case 2: 
                this.roomHand = this.select.getChildByName('hand')
                console.log(this.roomHand)
                this.countDownView.startCountDown(2, this.showRoomHand.bind(this));
        }

        this.info.currentLevel++;
        const target = this.info.currentLevel;
        if (target<2 || target>3) return;
        const tLevel = `level${target}`; // 目标等级
        const speed = 1; // s
        const preLevel = `level${target-1}`; // 上一级

        // 图片变化
        const tPic = this.level[this.levelConfig[tLevel].sprite];
        const prePic = this.level[this.levelConfig[preLevel].sprite];
        tPic.opacity = 0;
        tPic.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(speed, 1), cc.fadeIn(speed*0.6)),
            cc.callFunc(() => {
                if (target === 2) {
                    const p3 = this.level[this.levelConfig[`level3`].sprite];
                    p3.scale = 0.4;
                }
                callback && callback();
            })
        ));
        // prePic.runAction(cc.sequence(cc.delayTime(0.4*speed), cc.fadeOut(0.5*speed)));

        // 数字变化
        const fspeed =  60; //ms
        const ftimes = Math.floor(speed*1000/fspeed); // 次数
        const names = ['t1', 't2', 't3', 't4', 't5'];

        clearInterval(this.info.levelInterval);
        names.forEach(name => {
            this.levelTmp[name] = Math.ceil( ( this.levelConfig[tLevel].number[name] - this.levelConfig[preLevel].number[name] ) / ftimes );
        });
        // console.log('this.levelTmp:', this.levelTmp);

        this.info.levelInterval = setInterval(() => {
            let canClear = true;
            names.forEach(name => {
                const label = this.level[name].getComponent(cc.Label);
                const num = Number(label.string);
                const dis = this.levelConfig[tLevel].number[name] - num;
                // console.log('name dis::', name, ' ,', dis);
                if (dis > 0) {
                    if (dis > this.levelTmp[name]) {
                        canClear = false;
                        label.string = num + this.levelTmp[name];
                    } else {
                        label.string = this.levelConfig[tLevel].number[name];
                    }
                }
            });
            if (canClear) {
                clearInterval(this.info.levelInterval);
                // console.log('clearInterval---');
            }
        }, 60);
    },

    // update (dt) {},
});
