import GameModel from "../Model/GameModel";
import { PlayformSDK } from "../Utils/PlayformSDK";

cc.Class({
  extends: cc.Component,
  properties: {
    //与音频相绑定的结点
    AudioUtils: cc.Node,
    //与游戏顺序和游戏引导相关的结点
    guide: cc.Node,
    //整个游戏场景结点
    center: cc.Node,
    game: cc.Node,
    cash: cc.Node,
  },

  onLoad() {
    // 游戏开始 等待平台SDK加载后调用gameInit
    PlayformSDK.gameStart();
  },

  // start () {
  //     // 初始化完成调用下平台SDK
  //     PlayformSDK.gameReady();
  // },

  gameInit() {
    // cc.director.setDisplayStats(false);
    //是否显示左下方fps信息
    cc.debug.setDisplayStats(false);

    // GameModel初始化
    this.gameModel = new GameModel();
    this.gameModel.gameInit();
    // this.toolList = this.gameModel.getTools();

    //得到GuideView脚本
    this.guideView = this.guide.getComponent("GuideView");
    this.guideView.setGameController(this);
    this.gameModel.setGuideView(this.guideView);

    // 主游戏
    this.gameView = this.game.getComponent("GameView");
    this.gameView.setGameController(this);

    // 进度条
    this.ballView = cc
      .find("Canvas/center/game/ball")
      .getComponent("ProgressView");

    // 现金
    this.cashView = this.cash.getComponent("CashView");

    //用centerView脚本来布置整个画面，包括横竖屏的响应方法。
    this.centerScript = this.center.getComponent("CenterView");
    this.centerScript.setGameController(this);

    // 根据model渲染各个元素状态 大小 位置等
    this.centerScript.initWithModel(this.gameModel);

    // 监听横竖屏变化
    if (typeof dapi !== "undefined") {
      // IS平台使用媒体查询事件
      let mql = window.matchMedia("(orientation: portrait)");
      mql.addListener(this.centerScript.orientCb.bind(this.centerScript, true));
    } else {
      window.addEventListener(
        "resize",
        this.centerScript.orientCb.bind(this.centerScript, true)
      );
    }

    // // 启动点击音效
    // this.bindClickEffect();
    // 暴露获取gameController的方法
    cc.$getGameController = () => this;
    // 数据加载完毕
    PlayformSDK.gameReady();

    this.gotoNextStep();
  },

  /**
   * 用来绑定脚本之间的相互引用
   * @param {*} that 需要绑定的脚本this
   * @param {*} scriptName 脚本名字
   */
  setScript(that, ...scriptNames) {
    scriptNames.forEach((scriptName) => {
      that[scriptName] = this[scriptName];
    });
  },
  /**执行任务队列 */
  gotoNextStep: function () {
    let guideList = this.gameModel.guideList;
    if (guideList.length > 0) {
      guideList.shift()(this.gotoNextStep);
      // this.currStep++;
    }
  },
  /**点击开始游戏 */
  clickStartGame() {
    //播放开场音效
    this.AudioUtils.getComponent("AudioUtils").playEffect("startMusic", 0.6);
    this.GuideView.startGame();
    this.gotoNextStep();
  },

  download() {
    PlayformSDK.download();
  },

  // 音频类方法
  getAudioUtils() {
    return this.AudioUtils.getComponent("AudioUtils");
  },

  // 调用View显示操作方法
  endGame() {
    // this.AudioUtils.getComponent('AudioUtils').playEffect('endMusic', 0.6);
    PlayformSDK.gameFinish();
    // this.GuideView.showEndPage();
  },

  // 调用Model数据操作方法

  /**绑定点击音效 */
  bindClickEffect() {
    this.node.on(
      cc.Node.EventType.TOUCH_START,
      function (touchEvent) {
        this.AudioUtils.getComponent("AudioUtils").playEffect("bgClick", 2);
      },
      this
    );
  },

  /**加钱 */
  addCash(num) {
    this.cashView.addCash(num);
    this.ballView.setProgress(this.cashView.targetCash / 200);
  },
});
