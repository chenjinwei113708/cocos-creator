import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';

cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad() {
    // this.isUp = true;
    this.ballViewInit();
  },

  ballViewInit () {
    // 获取gameConteoller
    cc.$getGameController().setScript(
      this,
      'gameView'
    );

    this.ballInfo = {
      // isLaunch: false,
      colsWallTimes: 0, // 撞到墙的次数, 超过10次则消除
      maxColsWall: 55
    }
  },

  /**
   * 检测碰撞
   * @param {*} contact 
   * @param {*} self 
   * @param {*} other 
   * @returns 
   */
  onPostSolve (contact, self, other) {
    const tag = other.tag || 0;
    if (tag === undefined) return;
    switch (tag) {
      case GAME_INFO.BRICKS_TAG:
        this.handleColsBrick(other);
        break;
      case GAME_INFO.CLEAR_WALL_TAG:
        this.handleColsClearWall(self);
        break;
      case GAME_INFO.WALL_TAG:
        this.handleColsWall();
        break;
      default:
        break;
    }
  },

  handleColsBrick (other) {
    this.ballInfo.colsWallTimes = 0;
    // 处理brick被撞击的方法
    const sprite = other.node.getComponent(cc.Sprite);
    const label = other.node.getChildByName('word').getComponent(cc.Label);
    if (label.string > 30 && label.string <= 40 && sprite.spriteFrame !== this.gameView.img30to40) {
      sprite.spriteFrame = this.gameView.img30to40;
    } else if (label.string > 20 && label.string <= 30 && sprite.spriteFrame !== this.gameView.img20to30) {
      sprite.spriteFrame = this.gameView.img20to30;
    } else if (label.string > 10 && label.string <= 20 && sprite.spriteFrame !== this.gameView.img10to20) {
      sprite.spriteFrame = this.gameView.img10to20;
    } else if (label.string > 1 && label.string <= 10 && sprite.spriteFrame !== this.gameView.img0to10) {
      sprite.spriteFrame = this.gameView.img0to10;
    } else if (label.string === '1') {
      this.gameView.clearBrick(other.node);
    }
    label.string--;
  },

  handleColsClearWall () {
    // 消除的操作
    const rigidBody = this.node.getComponent(cc.RigidBody);
    rigidBody.enabledContactListener = false;
    rigidBody.linearVelocity = cc.v2(0, 0);
    this.node.active = false;
    this.checkClearOne();
  },

  checkClearOne() {
    ;(--this.gameView.gameInfo.currentBallNum === 0) && (this.gameView.isClearAll()
    ? this.gameView.handleClearAll()
    : this.gameView.setGameStatus(GAME_STATUS.CAN_CLICK));
  },

  handleColsWall () {
    if (this.ballInfo.colsWallTimes > this.ballInfo.maxColsWall) {
      this.node.active = false;
      this.checkClearOne();
    } {
      this.ballInfo.colsWallTimes++;
    }
  },

});
