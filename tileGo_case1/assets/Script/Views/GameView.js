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
    CELL_STATUS
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        progress: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.put = this.node.getChildByName('put');
        this.info = {
            status: CELL_STATUS.CAN_MOVE,
            putArr: [], // 下方存放的格子，里面放的是string（格子的图片名称）
        };
    },

    start () {

    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setStatus (status) {
        this.info.status = status;
    },

    clickCell (event) {
        if (this.info.status === CELL_STATUS.CAN_MOVE) {
            this.setStatus(CELL_STATUS.IS_MOVE);
            // console.log(event.target);
            // console.log(event.target.getComponent(cc.Sprite).spriteFrame.name);
            let node = event.target;
            this.addToGroup(node);
        }
    },

    addToGroup (node) {
        let type = node.getComponent(cc.Sprite).spriteFrame.name;
        let index = this.info.putArr.length;
        if (index >= 7) return;
        // 将点击的卡置于最上方
        let grid = node.parent;
        grid.children.splice(grid.children.indexOf(node), 1);
        grid.children.push(node);
        // 将选中类型加入数组
        this.info.putArr.push(type);
        let target = this.put.children[index];
        target.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;
        let originPos = cc.v2(node.position.x, node.position.y);
        let destPos = this.node.convertToNodeSpaceAR(this.put.convertToWorldSpaceAR(target.position));
        node.runAction(cc.sequence(
            cc.moveTo(0.3, destPos),
            cc.callFunc(() => {
                node.position = originPos;
                node.active = false;
                target.active = true;
                this.checkCombine();
            })
        ));
    },

    // 检查是否可以合成
    checkCombine () {
        console.log('');
        this.setStatus(CELL_STATUS.CAN_MOVE);
    },

    // update (dt) {},
});
