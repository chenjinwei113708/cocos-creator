import { GAME_INFO, GAME_STATUS } from "../Model/ConstValue";
import {
  toggleMask,
  shakeOnce,
  shake,
  flyTo,
  foreverScale,
  scaleOut,
  scaleIn,
  slideOut
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
    ballPrefab: {
      default: null,
      type: cc.Prefab,
    },
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
      isClear50: false,
      isClear40: false,
      isClear30: false,
      isClear20: false,
      isClear10: false,
      ballNum: 30, // 生成小球的数量
      initV: cc.v2(1000, 1000)
    };
  },

  isClearAll () {
    return this.gameInfo.isClear50 && this.gameInfo.isClear40 && this.gameInfo.isClear30 && this.gameInfo.isClear20 && this.gameInfo.isClear10;
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
    GraphView.onTouchStart(e);
  },

  /**点击事件移动 */
  onTouchMove(e) {
    if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;

    // 移动绘制的线条
    GraphView.onTouchMove(e);
  },

  /**点击事件结束 */
  onTouchEnd(e) {
    if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK) return false;
    this.setGameStatus(GAME_STATUS.DISABLED);
    // 清理引导线
    GraphView.onTouchEnd(e);

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
      // console.log('在里面')
      return true;
    } else {
      // console.log('不在里面');
      return false;
    }
  },

  /**
   * 生成小球
   */
  createBalls (e) {
    console.log('生成小球');
    // console.log(e);
    const diffPos = this.getDiffByNode(this.launchPoint.parent.convertToNodeSpaceAR(e.touch._point), this.launchPoint.position);
    // 计算向量, x为1 并转换为初始速度
    console.log(diffPos)
    const { x: initX, y: initY } = this.gameInfo.initV;
    const vector = { x: (diffPos.x > 0 ? 1 : -1), y: Math.abs(diffPos.y / diffPos.x) * (diffPos.y > 0 ? 1 : -1) }
    console.log('[vector]', vector);
    const calcV = cc.v2(initX * vector.x, initY * vector.y);
    console.log('[calcV]', calcV);
    // for (let i = 0; i < this.gameInfo.ballNum; i++) {

    // }
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
