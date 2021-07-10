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
  },

  // 生命周期回调函数------------------------------------------------------------------------
  /**onLoad会比start快 */
  onLoad() {
    window.GameView = this;
    this.gameViewInit();
    this.handClip = this.hand.getComponent(cc.Animation);
  },

  start() {
    this.addEventListener();
    this.setGameStatus(GAME_STATUS);
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
  getCheerMusicThrottle() {
    return getThrottle(() => {
      this.audioUtils.playEffect("cheer", 0.3);
    }, 100);
  },
  /**初始化游戏参数 */
  gameViewInit() {
    // 初始化参数
    this.gameInfo = {
      status: GAME_STATUS.DISABLED, // 初始设置为不可产生小球状态
    };

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
    this.playCheerMusicByThrottle = this.getCheerMusicThrottle();
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
    // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    // 关闭动画
    this.handClip.pause();
    this.hand.active = false;
    this.bghand.active = false;
  },

  /**点击事件移动 */
  onTouchMove(e) {},

  /**点击事件结束 */
  onTouchEnd(e) {},

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
  getDistance(pos1, pos2) {
    return {
      x: Math.floor(Math.abs(pos1.x - pos2.x)),
      y: Math.floor(Math.abs(pos1.y - pos2.y)),
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
