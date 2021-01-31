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
    COLOR_VALUE,
    ANITIME,
    GRID_PIXEL_WIDTH,
    GRID_PIXEL_HEIGHT,
    CELL_WIDTH
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.setColor(COLOR.BLUE);
        // this.gameModel = cc.find('Canvas').getComponent('GameController').gameModel;
        // console.log('this.gameModel', this.gameModel);
    },

    init (position, color, number) {
        this.node.x = position.x;
        this.node.y = position.y;
        this.node.color = new cc.Color(COLOR_VALUE[color].r, COLOR_VALUE[color].g, COLOR_VALUE[color].b);
        this.node.active = true;
        this.node.getComponent(cc.Label).string = number;
        // console.log(`(${this.node.x},${this.node.y}), active ${this.node.active}`);
    },

    start () {

    },


    fly () {
        const gameController = cc.find('Canvas').getComponent('GameController');
        const gameModel = gameController.gameModel;
        let grid = gameController.grid;
        let desPos = gameModel.isLandscape ? gameModel.HorizontalConfig.grade.position : gameModel.VerticalConfig.grade.position;
        // 生成随机数
        const variable = Math.floor(Math.random()*(CELL_WIDTH/2))+1;
        // 将grid下的坐标转换成center下的坐标
        desPos = cc.v2(desPos.x-grid.x+variable*2, desPos.y-grid.y+variable);
        let distance = Math.abs(this.node.x - desPos.x)+Math.abs(this.node.y - desPos.y);
        distance = distance/1000;
        cc.tween(this.node)
            .then(cc.spawn(
                cc.moveTo(ANITIME.NUM_FLY_TIME*distance, desPos.x, desPos.y),
                cc.scaleTo(ANITIME.NUM_FLY_TIME*distance, 0.8),
                cc.fadeTo(ANITIME.NUM_FLY_TIME*distance+0.5, 0.3)
            ))
            .then(cc.fadeTo(0.2, 0))
            .removeSelf()
            .start();
    }

    // update (dt) {},
});
