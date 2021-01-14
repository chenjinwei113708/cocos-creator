import { CELL_TYPE, ANITIME, CELL_STATUS} from "./ConstValue";

export default class CellModel {
    constructor() {
        this.type = null;//0:empty; 1:blue; 2:green; 3:purple; 4:red; 5:yellow
        this.status = CELL_STATUS.COMMON;
        this.x = 1;
        this.y = 1;
        this.startX = 1;
        this.startY = 1;
        this.cmd = [];
        this.isDeath = false;
        // this.objecCount = Math.floor(Math.random() * 1000);
        this.hasGold = false; // 是否有金币
        this.moveCmd = { // 移动指令
            step: 0,
            direction: null
        };
    }

    init(type) {
        this.type = type;
    }

    isEmpty() {
        return this.type == CELL_TYPE.EMPTY;
    }

    setEmpty() {
        this.type = CELL_TYPE.EMPTY;
    }
    
    setXY(x, y) {
        this.x = x;
        this.y = y;
    }

    setStartXY(x, y) {
        this.startX = x;
        this.startY = y;
    }

    setStatus(status) {
        this.status = status;
    }

    setHasGold (ifHasGold) {
        this.hasGold = ifHasGold;
    }

    getHasGold () {
        return this.hasGold;
    }

    moveToAndBack(pos) {
        var srcPos = cc.v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    moveTo(pos, playTime) {
        var srcPos = cc.v2(this.x, this.y); 
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    toDie(playTime) {
        this.cmd.push({
            action: "fadeOut",
            playTime: playTime,
            keepTime: ANITIME.FADEOUT
        })
        this.cmd.push({
            action: "toDie",
            playTime: playTime + ANITIME.FADEOUT,
            keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }

    toShake(playTime) {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        });
    }

    toFall(playTime) {
        this.cmd.push({
            action: "fall",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        });
    }

    setVisible(playTime, isVisible) {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }

    // moveToAndDie(pos) {

    // }

    // isBird() {
    //     return this.type == CELL_TYPE.G;
    // }

}
