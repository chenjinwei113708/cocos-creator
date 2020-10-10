import {
    DIRECTION
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        shadow: cc.Node, // 影子
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.enabled = true;
    },

    // start () {},


    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        if (other.node._name === 'pic' || other.node._name.indexOf('grade')>-1) return;
        // console.log('on collision enter other,', other.node._name);
        // console.log('on collision enter, ', self.node._name);
        if (other.node._name === 'brick') {
            this.gameController.gameView.stopCoinOnBrick(self.node._parent);
        } else {
            // 根据金币和圆柱接触的坐标，判断金币要往哪个方向滚动
            let distance = self.node._parent.position.x - other.node.position.x;
            let direction = Math.abs(distance) < 3 ? DIRECTION.MIDDLE : distance > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
            let destPos = direction === DIRECTION.LEFT ? cc.v2(other.node.position.x - other.node.width/2 - self.node.width/2, other.node.position.y) :
            cc.v2(other.node.position.x + other.node.width/2 + self.node.width/2, other.node.position.y);
            this.gameController.gameView.fallDownCoin(self.node._parent, true, direction, destPos);
        }
        
    },

    update (dt) {
        this.shadow.position = cc.v2(this.node.position.x+3.482, this.node.position.y-7.733);
    },
});

// 105.98 185.48
// 111.577 183.882  5.596 1.598
// 114.774 182.017  3.197 1.865
// 118.237 178.288  3.46  3.72
// 120.102 174.825  1.86 3.463
// 121.167 170.829  1.065 3.996
// 121.966 167.632  0.799 3.197