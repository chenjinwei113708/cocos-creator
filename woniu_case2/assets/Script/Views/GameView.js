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
        this.hand = this.node.getChildByName('hand');
        this.red = this.node.getChildByName('red');
        this.redBtn = this.red.getChildByName('btn');
        this.redBox = this.red.getChildByName('box');
        this.redLight = this.redBox.getChildByName('light');
        this.green = this.node.getChildByName('green');
        this.greenBtn = this.green.getChildByName('btn');
        this.greenBox = this.green.getChildByName('box');
        this.greenLight = this.greenBox.getChildByName('light');
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    start () {
        this.handMove();
    },

    getRedBtnPosInGame () {
        return this.node.convertToNodeSpaceAR(this.red.convertToWorldSpaceAR(this.redBtn.position));
    },

    getGreenBtnPosInGame () {
        return this.node.convertToNodeSpaceAR(this.green.convertToWorldSpaceAR(this.greenBtn.position));
    },

    /**
     * 突出显示
     * @param {*} box 需要放大的区域
     * @param {*} light 需要播放动画的光效
     */
    highlight (box, light) {
        box.runAction(cc.sequence(
            cc.scaleTo(0.3, 1.1),
            cc.scaleTo(0.3, 1),
        ));
        const oriScale = light.scale;
        light.opacity = 0;
        light.scale = 0;
        light.active = true;
        light.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.1)),
            cc.callFunc(() => {
                light.scale = oriScale;
                let state = light.getComponent(cc.Animation).play();
                state.on('finished', () => {
                    light.active = false;
                })
            })
        ))
    },

    // 让手在两个按钮之间移动，会先停止上一次的动作，再重新开始移动
    handMove () {
        const redBtnPos = this.getRedBtnPosInGame();
        const greenBtnPos = this.getGreenBtnPosInGame();
        const speed = 0.7;
        const delayDuration = 0.5;
        this.hand.stopAllActions();
        this.hand.position = cc.v2(redBtnPos.x, -329.472);
        this.hand.position = cc.v2(0, -329.472);
        

        this.hand.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(speed, greenBtnPos),
            cc.callFunc(() => {
                this.highlight(this.greenBox, this.greenLight);
            }),
            cc.delayTime(delayDuration),
            cc.moveTo(speed, redBtnPos),
            cc.callFunc(() => {
                this.highlight(this.redBox, this.redLight);
            }),
            cc.delayTime(delayDuration),
        )));
    },

    // update (dt) {},
});
