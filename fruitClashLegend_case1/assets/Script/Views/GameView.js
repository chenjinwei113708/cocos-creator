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
    GAME_LEVEL,
    CELL_TYPE,
    ACTION_TYPE
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        hand: cc.Node, // 指引手
        box: cc.Node, // 棋盘
        // 不同类型的图
        spriteApple: cc.SpriteFrame,
        spriteBanana: cc.SpriteFrame,
        spriteGrape: cc.SpriteFrame,
        spritePear: cc.SpriteFrame,
        spriteCarrot: cc.SpriteFrame,
        spriteStrawberry: cc.SpriteFrame,
        spriteTomato: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.gameInfo = {
            nowLevel: GAME_LEVEL.LEVEL1
        };
        // 不同类型对应的图片
        this.sprites = {
            [CELL_TYPE.APPLE]: this.spriteApple,
            [CELL_TYPE.BANANA]: this.spriteBanana,
            [CELL_TYPE.STRAWBERRY]: this.spriteStrawberry,
            [CELL_TYPE.GRAPE]: this.spriteGrape,
            [CELL_TYPE.CARROT]: this.spriteCarrot,
            [CELL_TYPE.PEAR]: this.spritePear,
            [CELL_TYPE.TOMATO]: this.spriteTomato,
        };
        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [undefined, ...this.box.getChildByName('a').children], // 这一行是看不见的
            [undefined, ...this.box.getChildByName('b').children],
            [undefined, ...this.box.getChildByName('c').children],
            [undefined, ...this.box.getChildByName('d').children],
            [undefined, ...this.box.getChildByName('e').children],
            [undefined, ...this.box.getChildByName('f').children],
        ];

        this.node.on(cc.Node.EventType.TOUCH_START, function ( event) {
            console.log('click, move');
            // this.actSwitch(cc.v2(4,2), cc.v2(3,2));
            this.doActions();
        }, this);

        this.actionList = [
            {type: ACTION_TYPE.SWITCH, start: cc.v2(4,2), end: cc.v2(3,2)},
            {type: ACTION_TYPE.COMBINE, center: cc.v2(3,2), others: [cc.v2(3,1), cc.v2(3,3), cc.v2(3,4)], newType: CELL_TYPE.STRAWBERRY},
            {type: ACTION_TYPE.DOWN, nodes: [
                {start: cc.v2(2,1), end: cc.v2(3,1), newType: undefined},
                {start: cc.v2(2,3), end: cc.v2(3,3), newType: undefined},
                {start: cc.v2(2,4), end: cc.v2(3,4), newType: undefined},
                {start: cc.v2(1,1), end: cc.v2(2,1), newType: undefined},
                {start: cc.v2(1,3), end: cc.v2(2,3), newType: undefined},
                {start: cc.v2(1,4), end: cc.v2(2,4), newType: undefined},
                {start: cc.v2(0,1), end: cc.v2(1,1), newType: CELL_TYPE.STRAWBERRY},
                {start: cc.v2(0,3), end: cc.v2(1,3), newType: CELL_TYPE.STRAWBERRY},
                {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.STRAWBERRY},
            ]
            },
        ];

        // this.startGuide();
    },
    
    /**执行动作序列 */
    doActions () {
        if (this.actionList.length > 0) {
            let action = this.actionList.splice(0, 1)[0];
            switch (action.type) {
                case ACTION_TYPE.SWITCH:
                    this.actSwitch(action.start, action.end);
                    break;
                case ACTION_TYPE.COMBINE:
                    this.actCombine(action.center, action.others, action.newType);
                    break;
                case ACTION_TYPE.DOWN:
                    action.nodes.forEach((item, index) => {});
                    this.actDown(action.center, action.others, action.newType);
                    break;
                default: break;
            }
        }
    },

    /**动作：交换节点
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} end 结束位置坐标
     */
    actSwitch (start, end) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        if (!startNode || !endNode) return;
        let startPos = cc.v2(startNode.position.x, startNode.position.y);
        let endPos = cc.v2(endNode.position.x, endNode.position.y);
        const moveTime = 0.15; 
        startNode.runAction(cc.moveTo(moveTime, endPos));
        endNode.runAction(cc.sequence(
            cc.moveTo(moveTime, startPos),
            cc.callFunc(() => {
                this.cells[start.x][start.y] = endNode;
                this.cells[end.x][end.y] = startNode
                this.doActions();
            })
        ));
    },

    /**动作：合并
     * @ param {cc.v2} center 中心合并位置坐标
     * @ param {[cc.v2]} other 其他点的位置坐标 数组
     * @ param {[cc.v2]} newType 需要合成什么类型
     */
    actCombine (center, others, newType) {
        let centerNode = this.cells[center.x][center.y];
        if (!centerNode) return;
        let centerPos = cc.v2(centerNode.position.x, centerNode.position.y);
        let otherNodes = others.map(other => {return this.cells[other.x][other.y];});
        const moveTime = 0.2;
        let originPos = [];
        otherNodes.forEach((other, index) => {
            originPos[index] = cc.v2(other.position.x, other.position.y);
            other.runAction(cc.sequence(
                cc.moveTo(moveTime, centerPos),
                cc.callFunc(() => {
                    other.opacity = 0;
                    other.position = originPos[index];
                    if (index === otherNodes.length-1) {
                        centerNode.runAction(cc.sequence(
                            cc.scaleTo(0.1, 1.15),
                            cc.scaleTo(0.1, 0.5),
                            cc.callFunc(() => {
                                centerNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                            }),
                            cc.scaleTo(0.05, 1),
                            cc.callFunc(() => {this.doActions();})
                        ))
                    }
                })
            ));
        });
    },

    /**动作：下落
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} dest 结束位置坐标
     * @ param {string} newType:可选 当需要生成新方块的时候，需要这个参数。新方块的类型 
     * @ param {boolean} isDown:可选 当前下落是否全部下落完成
     */
    actDown (start, end, newType, isDown = false) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        if (!startNode || !endNode) return;
        let moveTime = 0.1 * (end.x - start.x);
        let endPos = cc.v2(endNode.position.x, endNode.position.y);
        endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(cc.Sprite).spriteFrame;
        endNode.position = cc.v2(startNode.position.x, startNode.position.y);
        endNode.opacity = 255;
        startNode.opacity = 0;
        endNode.runAction(cc.sequence(
            cc.moveTo(moveTime, endPos),
            cc.callFunc(() => {
                if (isDown) {
                    this.doActions();
                }
            })
        ));
    },

    /**开始引导 */
    startGuide () {
        // this.mask.runAction(cc.fadeIn(0.4));
        // this.hand.runAction(cc.sequence(
        //     cc.fadeIn(0.3),
        //     cc.callFunc(() => {
        //         this.hand.getComponent(cc.Animation).play();
        //     })
        // ));
    },

    start () {

    },

    // update (dt) {},
});
