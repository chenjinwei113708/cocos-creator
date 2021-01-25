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
        this.startPhysicEngine();
    },

    start () {
        
    },

    setGameController (gameController) {
        this.gameController = gameController;
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
    // update (dt) {},
});
