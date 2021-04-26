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
        target: { type: cc.Integer, default: 6 }, // 目标选项，从0开始
        selectBox: cc.Node, // 选中框,
        ppProgress: cc.Node, // pp 进度
        pps: cc.Node, // pp卡 飞向顶部
        paypal: cc.Node, // 顶部栏
        getBtn: cc.Node, // get按钮
        activeBtnSprite: cc.SpriteFrame, // 激活按钮图
        hand: cc.Node, // 指引手
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pos = [
            cc.v2(-157.563, 121.903),
            cc.v2(3.289, 121.903),
            cc.v2(169.649, 121.903),
            cc.v2(169.649, 11.73),
            cc.v2(169.649, -114.969),
            cc.v2(8.789, -114.969),
            cc.v2(-157.563, -114.969),
            cc.v2(-157.563, 11.73),
        ];
        this.index = 0; // 当前位置
        this.round = 8; // 循环一次的数量
        this.from = (this.target+2)%this.round; // 从什么地方开始停止
        this.speed = 100; // 速度 ms
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.clickedStop = false; // 是否点击了停止
        this.progressView = this.ppProgress.getComponent('ProgressView');
        this.canGet = false;
        this.canClickStop = true;
    },

    start () {
        // setTimeout(() => {
        //     this.startSpin();
        // }, 1000);
    },

    // 出现抽奖转盘
    comeShow () {
        this.node.active = true;
        this.node.scale = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.5, 1.2).easing(cc.easeIn(1.2)),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                this.startSpin();
                this.gameController.guideView.myFadeIn(this.hand, () => {
                    this.gameController.guideView.myClickHere(this.hand, () => {
                        // this.canClickStop = true;
                    })
                });
            })
        ));

    },

    // 开始转圈
    startSpin () {
        this.selectBox.active = true;
        this.selectBox.position = cc.v2(this.pos[this.index].x, this.pos[this.index].y);
        this.moveToNext();
        let s0 = 3.2*this.speed;
        let s1 = 2.8*this.speed;
        let s2 = 2*this.speed;
        let s3 = 1.5*this.speed;
        setTimeout(() => {
            this.moveToNext();
            setTimeout(() => {
                this.moveToNext();
                setTimeout(() => {
                    this.moveToNext();
                    setTimeout(() => {
                        this.moveToNext();
                        setTimeout(() => {
                            this.repeat();
                        }, this.speed);
                    }, s3);
                }, s2);
            }, s1);
        }, s0);
    },

    moveToNext () {
        this.selectBox.position = cc.v2(this.pos[this.index].x, this.pos[this.index].y);
        this.gameController.getAudioUtils().playEffect('merge', 0.1);
        this.index = (this.index+1)%this.round; // 计算下一个的index
    },

    repeat () {
        this.moveToNext();
        if (this.clickedStop && (this.index-1) === this.from) {
            const dist = this.target > this.from ? (this.target-this.from) : (this.target+this.round-this.from);
            this.startStop(dist);
        } else {
            setTimeout(() => {
                this.repeat();
            }, this.speed);
        }
        
    },

    // 点击结束转圈
    clickStop () {
        this.clickedStop = true;
        setTimeout(() => {
            this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
                this.hand.active = false;
            });
        }, 100);
    },

    startStop (dist, i=1) {
        let s = this.speed+70*i;
        // console.log('startStop, s:',s, ' , i:', i, ' , dist:', dist);
        setTimeout(() => {
            this.moveToNext();
            if (i>=dist) {
                this.receiveAward();
            } else {
                this.startStop(dist, i+1);
            }
        }, s);
    },

    // 接收奖品
    receiveAward () {
        this.showPPFly(() => {
            this.hideBoard();
        })
    },

    hideBoard () {
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 0),
            cc.callFunc(() => {
                this.gameController.gameView.showEndPage();
                this.canGet = true;
            })
        ));
    },

    /**展示几张pp卡从一个地方飞到指定位置，最后缩小消失 */
    showPPFly (cb) {
        let destPos = this.pps.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('ppicon').position)
        );
        let oriPos = cc.v2(0, 0);
        this.pps.children.forEach((node, index) => {
            node.opacity = 0;
            node.scale = 1;
            node.active = true;
            node.position = oriPos;
            node.runAction(cc.sequence(
                cc.delayTime(0.1*index),
                cc.fadeIn(0.2),
                cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.5)),
                cc.spawn(cc.scaleTo(0.2, 0.3), cc.fadeOut(0.2), cc.moveBy(0.2, -50, -20)),
                cc.callFunc(() => {
                    if (index === 0) {
                        this.gameController.getAudioUtils().playEffect('coin', 0.6);
                        // this.gameController.addCash(200);
                        this.progressView.setProgress(1);
                        this.gameController.addCash(3);
                    }
                    if (index === this.pps.children.length-1) {
                        this.getBtn.getComponent(cc.Sprite).spriteFrame = this.activeBtnSprite;
                        cb && cb();
                        // console.log('finish');
                    }
                })
            ))
        });
        
    },

    // 点击获得现金
    clickGet () {
        if (this.canGet) {
            this.gameController.download();
        }
    },

    // allowUpdate () {
    //     this.enabled = true;
    // },

    // stopUpdate () {
    //     this.enabled = false;
    // },

    // update (dt) {
    // },
});
