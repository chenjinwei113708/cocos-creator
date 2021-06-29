import { GAME_INFO, GAME_STATUS } from "../Model/ConstValue";
import {
  toggleMask,
  shakeOnce,
  shake,
  flyTo,
  foreverScale,
  scaleOut,
  scaleIn,
  slideInto1,
  slideOut,
  blink,
} from "../Utils/Animation";
import { getRandom, getThrottle } from "../Utils/utils";
cc.Class({
  extends: cc.Component,

  properties: {
    mask: { type: cc.Node, default: null },
    bghand: { type: cc.Node, default: null },
    hand: { type: cc.Node, default: null },
    pp: { type: cc.Prefab, default: null },
    ppIcon: { type: cc.Node, default: null },
    pps: { type: cc.Node, default: null },
    launchPoint: { type: cc.Node, default: null },
    img0to10: { type: cc.SpriteFrame, default: null },
    img10to20: { type: cc.SpriteFrame, default: null },
    img20to30: { type: cc.SpriteFrame, default: null },
    img30to40: { type: cc.SpriteFrame, default: null },
    img40to50: { type: cc.SpriteFrame, default: null },
    ballPrefab: { type: cc.Prefab, default: null },
    underWall: { type: cc.Node, default: null },
    ppCardPrefab: { type: cc.Prefab, default: null },
  },

  // 生命周期回调函数------------------------------------------------------------------------
  /**onLoad会比start快 */
  onLoad() {
    window.GameView = this;
    this.gameViewInit();
    this.handClip = this.hand.getComponent(cc.Animation);
    // 设置进度条全局变量
    this.timeBegin = 0;
    // 设置金额全局变量
    // this.cashBegin = 0;
    // this.cashView.addCash(150,1);

    // 获取gameConteoller
    cc.$getGameController().setScript(this, "graphView");
    // this.showPPcard();
  },

  start() {
    // this.cashView.setIcon("$ ", "head");
    // this.showHandDrag();
    this.addEventListener();
    this.setGameStatus(GAME_STATUS.CAN_CLICK);
    // 开启动画
    this.bghand.active = true;
    this.handClip.play();
  },
  // 生命周期函数结束---------------------------------------------------------------------

  // 工具函数----------------------------------------------------------------------------
  /**设置游戏状态 */
  setGameStatus(status) {
    this.gameInfo.status = status;
    // console.log('[status]', status);
  },

  getGameStatus() {
    return this.gameInfo.status;
  },
  getMoneyMusicThrottle() {
    return getThrottle(() => {
      this.audioUtils.playEffect("money");
    }, 50);
  },

  getFreshMusicThrottle() {
    return getThrottle(() => {
      this.audioUtils.playEffect("fresh", 0.2);
    }, 100);
  },

  getCombineMusicThrottle() {
    return getThrottle(() => {
      this.audioUtils.playEffect("combine", 0.3);
    }, 100);
  },
  getCorrectMusicThrottle() {
    return getThrottle(() => {
      this.audioUtils.playEffect("correct", 0.3);
    }, 100);
  },

  /**初始化游戏参数 */
  gameViewInit() {
    // 获得脚本
    this.gameController.setScript(
      this,
      "audioUtils",
      "guideView",
      "awardView",
      "progressView",
      "cashView"
    );

    this.playFreshMusicByThrottle = this.getFreshMusicThrottle();
    this.playCombineMusicByThrottle = this.getCombineMusicThrottle();
    this.playMoneyMusicByThrottle = this.getMoneyMusicThrottle();
    this.playCorrectMusicByThrottle = this.getCorrectMusicThrottle();

    // 初始化参数
    this.gameInfo = {
      status: GAME_STATUS.DISABLED, // 初始设置为不可点击状态
      isClear: GAME_INFO.BRICKS_NAME,
      isClear50: false,
      isClear40: false,
      isClear30: false,
      isClear20: false,
      isClear10: false,
      ballNum: 20, // 生成小球的数量
      // initV: 1000, // 初始速度
      initV: 1000,
      currentBallNum: 0, // 存在且没有被消除的ball的个数
    };
  },

  /**切换mask的显示状态
   * @param type 如果为 in 则表示显示 如果为out 则表示隐藏
   */
  toggleGameMask(type) {
    return toggleMask(this.mask, type);
  },
  // 工具函数结束---------------------------------------------------------------------------

  // 点击事件相关-------------------------------------------------------------------------
  /**增加点击事件 */
  addEventListener() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  },

  /**点击事件start */
  onTouchStart(e) {
    if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;
    // 关闭动画
    this.handClip.pause();
    this.hand.active = false;
    this.bghand.active = false;
    // 绘制
    // graphView.onTouchStart(e);
    this.graphView.onTouchMove(e);
  },

  /**点击事件移动 */
  onTouchMove(e) {
    if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;

    // 移动绘制的线条
    this.graphView.onTouchMove(e);
  },

  /**点击事件结束 */
  onTouchEnd(e) {
    if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;
    this.setGameStatus(GAME_STATUS.DISABLED);
    // 开启underwall
    this.underWall.active = true;

    // 清理引导线
    this.graphView.onTouchEnd(e);

    // 生成小球
    this.createBalls(e);
  },

  /**
   * 判断点击是否在node里面
   * @param {*} e 点击事件
   * @param {cc.Node} node 判断点击事件是否在里面的节点
   * @returns {Boolean}
   */
  checkPosByNode(e, node) {
    const touchPos = e.touch._point;
    const pos = node.parent.convertToWorldSpaceAR(node.position);
    const offsetX = node.width / 2;
    const offsetY = node.height / 2;

    if (
      touchPos.x <= pos.x + offsetX &&
      touchPos.x >= pos.x - offsetX &&
      touchPos.y <= pos.y + offsetY &&
      touchPos.y >= pos.y - offsetY
    ) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 生成小球
   */
  createBalls(e) {
    const delay = 100;
    // console.log(e);
    const diffPos = this.getDiffByNode(
      this.launchPoint.parent.convertToNodeSpaceAR(e.touch._point),
      this.launchPoint.position
    );
    // 避免无限接近于0的数
    const calcV = {};
    if (Math.abs(diffPos.x) < 1) {
      calcV.x = 0;
      calcV.y = this.gameInfo.initV * (diffPos.y > 0 ? 1 : -1);
    } else {
      // 获取xy的比例
      const radio = Math.abs(diffPos.y / diffPos.x);
      // console.log('[radio]', radio);
      calcV.x =
        (this.gameInfo.initV / Math.sqrt(1 + Math.pow(radio, 2))) *
        (diffPos.x > 0 ? 1 : -1);
      calcV.y = Math.abs(radio * calcV.x) * (diffPos.y > 0 ? 1 : -1);
    }
    // console.log('[calcV]', calcV)

    // 发射
    for (let i = 0; i < this.gameInfo.ballNum; i++) {
      setTimeout(() => {
        const ball = cc.instantiate(this.ballPrefab);
        ball.parent = this.launchPoint;
        ball.position = cc.v2(0, 0);
        const RigidBody = ball.getComponent(cc.RigidBody);
        RigidBody.linearVelocity = cc.v2(calcV.x, calcV.y);
        this.gameInfo.currentBallNum++;
      }, i * delay);
    }
  },

  /**
   * @param {*} brick 要被消除的brick
   */
  clearBrick(brickNode) {
    // console.log('[brickNode._name]', brickNode._name);
    brickNode.active = false;
    this.gameInfo.isClear[brickNode._name] = true;
    this.showPps(brickNode.position);
    return Promise.all([
      this.progressView.addProgress(1 / 5, 1),
      this.cashView.addCash(30, 1),
    ]);
  },

  /**
   * @returns 是否完全被删除的布尔值
   */
  isClearAll() {
    return Object.keys(this.gameInfo.isClear).every(
      (key) => this.gameInfo.isClear[key]
    );
  },

  handleClearAll() {
    // console.log('[handleClearAll]');
    this.awardView.showAwardPage().then(() => {
      this.gameController.endGame();
    });
  },

  resetGame() {
    this.underWall.active = false;
    this.setGameStatus(GAME_STATUS.CAN_CLICK);
  },

  // 点击事件相关结束---------------------------------------------------------------------

  // guide相关----------------------------------------------------------------------------
  /**显示手 */
  showHand(node, type) {
    this.guideView.showHand(node, type);
  },

  /**显示拖拽手 */
  showHandDrag(nodeArr, type) {
    this.guideView.showHandDrag(nodeArr, type);
  },

  // guide相关结束---------------------------------------------------------------------------

  // award相关--------------------------------------------------------------------------------
  /**展示奖励页 */
  showAwardPage() {
    // console.log('展示奖励页~')
    this.awardView.showAwardPage();
  },
  showPPcard(other) {
    var position = other.node.position;
    console.log(other.node.position);
    this.setPPCard(this.launchPoint, cc.v2(position.x + 150, position.y + 250));
  },

  setPPCard(parent, position) {
    const ppCard = cc.instantiate(this.ppCardPrefab);
    ppCard.parent = parent;
    // ppCard.position = position;
    ppCard.position = cc.v2(0, 0);
    // slideInto1(ppCard, position);
    scaleOut(ppCard);
  },
  // award相关结束-----------------------------------------------------------------------------

  /**获取两点的直线距离 */
  /**
   * 获取亮点之间的相对距离
   * @param {*} pos1
   * @param {*} pos2
   * @returns
   */
  getDiffByNode(pos1, pos2) {
    return {
      x: Math.round(pos1.x - pos2.x),
      y: Math.round(pos1.y - pos2.y),
    };
  },

  /**
   * 展示pp卡
   * @param {Node} startPosition
   * @returns
   */
  showPps(startPosition) {
    return new Promise((resolve, reject) => {
      let isPlayMusic = false;
      // 使用这个可以控制pp卡飞向终点的先后效果
      for (let i = 0; i < 5; i++) {
        if (!isPlayMusic) {
          isPlayMusic = true;
          this.audioUtils.playEffect("money");
        }
        const pp = cc.instantiate(this.pp);
        pp.active = false;
        pp.scale = 0;
        pp.parent = this.pps;
        // pp.position = cc.v2(200, 0);
        pp.position = startPosition;
        scaleIn(pp).then(() => {
          setTimeout(() => {
            flyTo(pp, this.ppIcon).then(() => {
              this.playMoneyMusicByThrottle();
              resolve();
            });
          }, 100 * i);
        });
      }
    });
  },
});
