
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameController = cc.find('Canvas').getComponent('GameController');
    },

    // start () {},


    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // console.log('on collision enter');
        // console.log(' --- -- on ground enter, ', other.node._name);
        this.gameController.gameView.dropCoin(other.node.parent);
    },

    // update (dt) {},
});
