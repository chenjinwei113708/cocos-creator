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
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        box: cc.Node,
        touchStartArea: cc.Node,
        spriteC1: cc.SpriteFrame,
        spriteC2: cc.SpriteFrame,
        spriteC3: cc.SpriteFrame,
        spriteC4: cc.SpriteFrame,
        spriteC5: cc.SpriteFrame,
        spriteC6: cc.SpriteFrame,
        spriteCPP: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    // 加载
    onLoad () {
        // 记录信息
        this.info = {
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 30, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            currentDices: [{relatPos: cc.v2(0,0), type: CELL_TYPE.C1}], // 现在的筛子组合
            nextDices: [{relatPos: cc.v2(0,-1), type: CELL_TYPE.C1}, {relatPos: cc.v2(0,0), type: CELL_TYPE.C1}], // 下一个筛子组合
            currentMove: null, // 当前移动的结点
            currentTurn: null, // 当前放在转盘的结点
        };
        this.sprites = {
           [CELL_TYPE.C1]: this.spriteC1,
           [CELL_TYPE.C2]: this.spriteC2,
           [CELL_TYPE.C3]: this.spriteC3,
           [CELL_TYPE.C4]: this.spriteC4,
           [CELL_TYPE.C5]: this.spriteC5,
           [CELL_TYPE.C6]: this.spriteC6,
           [CELL_TYPE.CPP]: this.spriteCPP,
        };

        // 骰子组合
        let nextnode = this.node.getChildByName('nextdice');
        let movenode = this.node.getChildByName('move');
        let turnnode = this.node.getChildByName('turnbox');
        // 摆放骰子组合的三个不同区域
        this.movec = {
            one: movenode.getChildByName('one'),
            twoV: movenode.getChildByName('twoV'),
            twoH: movenode.getChildByName('twoH'),
        };
        this.turnc = {
            one: turnnode.getChildByName('one'),
            twoV: turnnode.getChildByName('twoV'),
            twoH: turnnode.getChildByName('twoH'),
        };
        this.nextc = {
            one: nextnode.getChildByName('one'),
            twoV: nextnode.getChildByName('twoV'),
            twoH: nextnode.getChildByName('twoH'),
        };

        /** 方块节点，（1， 1）代表第一行，第一列 */
        this.cells = [
            [],
            [undefined, ...this.box.getChildByName('line1').children],
            [undefined, ...this.box.getChildByName('line2').children],
            [undefined, ...this.box.getChildByName('line3').children],
            [undefined, ...this.box.getChildByName('line4').children],
            [undefined, ...this.box.getChildByName('line5').children],
        ];
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    // 开始
    start () {
        this.initWithModel(this.gameController.gameModel.cellModel);
        let cards = [
            {relatPos: cc.v2(0, 0), type: CELL_TYPE.C1},
            {relatPos: cc.v2(-1, 0), type: CELL_TYPE.C1},
            {relatPos: cc.v2(-1, +1), type: CELL_TYPE.C1},
        ];
        // this.gameController.gameModel.putCardIntoModel(cc.v2(3,4), cards);
        this.getNextDices();
        this.setTouchListener();
    },

    initWithModel (model) {
        for (let i=1; i<=5; i++) {
            for (let j=1; j<=5; j++) {
                if (model[i][j] !== CELL_TYPE.CE) {
                    let node = this.cells[i][j];
                    node.active = true;
                    node.getComponent(cc.Sprite).spriteFrame = this.sprites[model[i][j]];
                }
            }
        }
    },

    setCellStatus (status) {
        this.info.cellStatus = status;
    },

    setTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.info.cellStatus === CELL_STATUS.CAN_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (touchPos.x >= this.touchStartArea.position.x - this.touchStartArea.width/2 &&
                touchPos.x <= this.touchStartArea.position.x + this.touchStartArea.width/2 &&
                touchPos.y >= this.touchStartArea.position.y - this.touchStartArea.height/2 &&
                touchPos.y <= this.touchStartArea.position.y + this.touchStartArea.height/2) {
                    this.info.lastCheckTime = Date.now();
                    this.setCellStatus(CELL_STATUS.IS_MOVE);
                    this.info.currentMove.opacity = 255;
                    this.info.currentMove.active = true;
                    
                    this.info.currentMove.position = cc.v2(touchPos.x, touchPos.y+80);
                    this.info.currentTurn.active = false;
            }
        }
        
    },

    onTouchMove (touch) {
        if (this.info.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.info.lastCheckTime >= this.info.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            // this.four1.position = touchPos;
            // this.checkInPos(touchPos, false);
            this.info.currentMove.position = cc.v2(touchPos.x, touchPos.y+80);
            this.info.lastCheckTime = Date.now();
        }
    },
    
    onTouchEnd (touch) {
        if (this.info.cellStatus === CELL_STATUS.IS_MOVE) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            // this.info.currentMove.opacity = 255;
            this.info.currentMove.active = false;
            this.info.currentTurn.active = true;
            // let inDest = this.checkInPos(touchPos, true);
            // if (inDest) {
            //     // 放对位置了
            //     this.four1.scale = 1;
            //     this.four1.position = this.info.four1Pos;
            //     this.four1.active = false;
            //     this.setCellStatus(CELL_STATUS.DONE_MOVE);
            //     this.hand.getComponent(cc.Animation).stop();
            //     this.hand.active = false;
            //     setTimeout(() => {this.showBomb();}, 100);
            // } else {
            //     this.four1.scale = 1;
            //     this.four1.position = this.info.four1Pos;
            //     this.setCellStatus(CELL_STATUS.CAN_MOVE);
            // }
            this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    /**拿到下一组新的骰子 */
    getNextDices () {
        let next = this.gameController.gameModel.getNextCards();
        if (next.length < 0 || next.length > 2) return false;
        this.info.currentDices = this.info.nextDices;
        this.info.nextDices = next;

        this.renderNewDices('nextc', this.info.nextDices);
        this.info.currentTurn = this.renderNewDices('turnc', this.info.currentDices);
        this.info.currentMove = this.renderNewDices('movec', this.info.currentDices);
    },

    /**
     * 渲染骰子组
     * @param {*} area 区域 'movec' | 'turnc' | 'nextc'
     * @param {*} model 骰子组模型数组 [{relatPos: cc.v2, type: CELL_TYPE}]
     * @return cc.Node 返回对应的节点。如果渲染失败，返回null
     */
    renderNewDices (area, model) {
        let areacont = this[area];
        if (!areacont) return null; // 区域不存在
        if (model.length < 0 || model.length > 2) return null; // 模型长度违规

        let kind = 'one';
        if (model.length === 2) {
            kind = 'two';
            // 中点要放在右下角，也就是数组的第二个。如果第一个就是中点，就返回false
            if (model[0].relatPos.x === 0 && model[0].relatPos.y === 0) return null;
            if (model[0].relatPos.x !== 0) {
                kind = kind+'V';
            } else if (model[0].relatPos.y !== 0) {
                kind = kind+'H';
            }
        }
        // console.log('renderNewDices area: ', area,'  kind : ', kind);
        model.forEach((item, index) => {
            
            let dice = areacont[kind].children[index];
            dice.getComponent(cc.Sprite).spriteFrame = this.sprites[item.type];
        });
        // console.log('node: ', areacont[kind]);
        if (area === 'movec') {
            areacont[kind].active = true;
            areacont[kind].opacity = 0;
        } else {
            areacont[kind].active = true;
            areacont[kind].opacity = 255;
        }
        return areacont[kind];
    },

    // update (dt) {},
});
