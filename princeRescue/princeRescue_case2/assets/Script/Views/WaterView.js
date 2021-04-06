
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.waterViewInit();
    },

    start () {
        // this.startCollision();
    },

    waterViewInit() {
        // 获得节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.gameView = this.gameController.gameView

        // 获得变成石头的图片
        this.stoneImg = this.gameView.stoneImg;
        this.vapour = this.gameView.vapour
    },
    
    /**变成石头 */
    turnToStone () {
        this.node.getComponent(cc.Sprite).spriteFrame = this.stoneImg;
        this.gameView.addStoneNum();

        if (this.gameView.gameInfo.currentStoneNum % 6 === 0) {
            // 生成水蒸气
            const vapour = cc.instantiate(this.vapour);
            vapour.parent = this.node.parent;
            vapour.position = cc.v2(this.node.position.x, this.node.position.y + 20); // 20 为y方向修正数
            setTimeout(() => {
                vapour.active = false;
            }, 1000)
        }


        // 不生效
        // this.node.getComponent(cc.PhysicsCircleCollider).radius = this.node.width * 20;
        // console.log(this.node.getComponent(cc.PhysicsCircleCollider).radius);
    },

    // update (dt) {},
    onCollisionEnter (other, self) {
        if (other.node._name !== 'lava') return false;

        this.turnToStone();
    }
});
