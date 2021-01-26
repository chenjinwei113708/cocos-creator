// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import {
    CELL_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lightnings = this.node.getChildByName('effectL').children;
        this.balls = this.node.getChildByName('balls').children;
        this.ball8 = this.balls.filter((each) => each.name === 'cc8');

        this.info = {
            cellStatus: CELL_STATUS.CAN_MOVE,
        };

        this.startPhysicEngine();
    },

    start () {
        // console.log('this.ball8', this.ball8);
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setCellStatus (status) {
        this.info.cellStatus = status;
        // console.log(' ***** setCellStatus cellStatus:', this.gameInfo.cellStatus);
    },

    /**打开物理引擎 */
    startPhysicEngine () {
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 绘制调试信息  | cc.PhysicsManager.DrawBits.e_aabbBit;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        // // 关闭绘制
        // // cc.director.getPhysicsManager().debugDrawFlags = 0;
        // 设置重力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -450);

        // 碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // console.log('开启物理引擎');
    },

    // 点击气泡炸弹
    onClickBomb () {
        if (this.info.cellStatus === CELL_STATUS.CAN_MOVE) {
            console.log('点击爆炸');
            this.setCellStatus(CELL_STATUS.IS_MOVE);
            this.showLigtning();
        }
    },

    // 展示雷电特效
    showLigtning () {
        this.gameController.getAudioUtils().playEffect('lightning', 0.65);
        this.ball8.forEach((node, index) => {
            let lightning = this.lightnings[index];
            lightning.position = node.position;
            let rand = Math.random();
            setTimeout(() => {
                let animState = lightning.getComponent(cc.Animation).play();
                node.runAction(cc.sequence(
                    cc.rotateBy(0.1, 15),
                    cc.rotateBy(0.1, -15),
                    cc.rotateBy(0.1, 20),
                    cc.rotateBy(0.1, -20),
                    cc.rotateBy(0.1, 8),
                    cc.rotateBy(0.1, -8),
                    cc.rotateBy(0.1, 10),
                    cc.rotateBy(0.1, -10),
                ));
                animState.on('finished', () => {
                    node.runAction(cc.sequence(
                        cc.fadeOut(0.1),
                        cc.callFunc(() => {
                            if (index === this.ball8.length-1) {
                                console.log('结束lightning');
                            }
                            node.active = false;
                        })
                    ));
                });
            }, rand*300);
            
            
        });
    }
    // update (dt) {},
});
