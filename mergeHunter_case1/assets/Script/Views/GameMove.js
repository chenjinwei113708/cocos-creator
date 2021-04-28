import {CELL_STATUS} from '../Model/ConstValue';

cc.Class({
  extends: cc.Component,

  properties: {
    startMove: cc.Node,
    // endMove: cc.Node,
  },

  onLoad () {
    this.status = CELL_STATUS.DONE_MOVE;
    this.x1 = this.startMove.position.x-this.startMove.width/2;
    this.x2 = this.startMove.position.x+this.startMove.width/2;
    this.y1 = this.startMove.position.y-this.startMove.height/2;
    this.y2 = this.startMove.position.y+this.startMove.height/2;
    this.startTouchPos = undefined;
    this.gameController = cc.find('Canvas').getComponent('GameController');
    this.setCanMove(true);
  },

  setStatus (status) {
    this.status = status;
  },

  setCanMove (bool=false) {
    if (bool) {
      this.onTouchListener();
      this.setStatus(CELL_STATUS.CAN_MOVE);
    } else {
      this.offTouchListener();
      this.setStatus(CELL_STATUS.DONE_MOVE);
    }
  },

  onTouchListener () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
  },

  offTouchListener () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
  },

  touchStart (event) {
    // console.log('touchStart, ', event);
    let touchPos = this.node.convertToNodeSpaceAR(event.touch._point);
    if (this.status === CELL_STATUS.CAN_MOVE) {
      // console.log(' touchStart touchPos', touchPos);
      if (touchPos.x >= this.x1 && touchPos.x <= this.x2 && touchPos.y >= this.y1 && touchPos.y <= this.y2) {
        this.setStatus(CELL_STATUS.IS_MOVE);
        this.startTouchPos = touchPos;
      }
    }
  },

  touchMove (event) {
    // console.log('touchMove, ', event);
    let touchPos = this.node.convertToNodeSpaceAR(event.touch._point);
    if (this.status === CELL_STATUS.IS_MOVE) {
      // console.log(' touchMove touchPos', touchPos);
      if (Math.abs(touchPos.y-this.startTouchPos.y)<30 && (this.startTouchPos.x-touchPos.x) >= 40) {
        // console.log('1111');
        this.gameController.gameView.combineGun19();
        this.setStatus(CELL_STATUS.DONE_MOVE);
      }
    }
  },

  touchEnd (event) {
    // console.log('touchEnd, ', event);
    // let touchPos = this.node.convertToNodeSpaceAR(event.touch._point);
    if (this.status === CELL_STATUS.IS_MOVE) {
      this.setStatus(CELL_STATUS.CAN_MOVE);
    }
  },
})