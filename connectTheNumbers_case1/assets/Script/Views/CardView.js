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
    CELL_TYPE
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /**棋盘坐标从左上角开始，x代表行，y代表列
         * 左上角坐标为(1,1)，代表第一行的第一列 */
        this.info = { // 卡片参数
            boxPos: null, // 棋盘中的坐标
            // gamePos: this.node.position, // 游戏中的坐标
            type: null,
            isConnected: false, // 是否已经被连接
        }
        this.gameController = cc.find('Canvas').getComponent('GameController');
    },

    /**
     * 设置卡片参数
     * @param {cc.v2} boxPos 棋盘中的坐标
     * @param {CELL_TYPE} type 类型
     */
    setInfo (boxPos, type) {
        this.info.boxPos = boxPos;
        this.info.type = type;
        this.node.getComponent(cc.Sprite).spriteFrame = this.gameController.gameView.sprites[type];
        this.setIsConnected(false);
        if (type === CELL_TYPE.CPP) {
            this.node.getChildByName('lighty').active = true;
            this.node.getChildByName('lightpp').active = true;
        } else {
            this.node.getChildByName('lighty').active = false;
            this.node.getChildByName('lightpp').active = false;
        }
    },

    // 设置为已经连中
    setIsConnected (isConnected) {
        this.info.isConnected = isConnected;
    },

    start () {
        // console.log(' cardview,', this.node.position, this.info);
    },

    /**自动选择当前方块 */
    autoPickCell (callback) {
        if (!this.info.isConnected) {
            this.gameController.gameView.pickCell(this.info.boxPos, this.info.type, this.node.position, callback);
        }
        // if (callback) {
        //     setTimeout(callback, 500);
        // }
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        // console.log('on collision enter', this.info.boxPos, self.node);
        if (!this.info.isConnected) {
            this.gameController.gameView.pickCell(this.info.boxPos, this.info.type, this.node.position);
        }
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
    },
    // update (dt) {
    // },
});
