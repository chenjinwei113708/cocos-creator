import GameModel from "../Model/GameModel";
import { PlayformSDK } from "../Utils/PlayformSDK";


cc.Class({
    extends: cc.Component,
    properties: {
        //与音频相绑定的结点
        AudioUtils: cc.Node,
        //与游戏顺序和游戏引导相关的结点
        guide: cc.Node,
        //整个视图
        center:cc.Node,
        //整个游戏结点
        game: cc.Node,
        // 金币结点
        cash: cc.Node,
        paypal: cc.Node,

    },

    onLoad() {
        // 游戏开始 等待平台SDK加载后调用gameInit
        PlayformSDK.gameStart();
    },

    gameInit() {
        // cc.director.setDisplayStats(false);
        //是否显示左下方fps信息
        cc.debug.setDisplayStats(false);


        // GameModel初始化
        this.gameModel = new GameModel();
        this.gameModel.gameInit();
        // this.toolList = this.gameModel.getTools();


        //得到GuideView脚本
        this.guideView = this.guide.getComponent('GuideView');
        this.guideView.setGameController(this);
        this.gameModel.setGuideView(this.guideView);

        // 游戏节点
        this.gameView = this.game.getComponent('GameView');
        this.gameView.setGameController(this);

        // 金币节点
        this.cashView = this.cash.getComponent('CashView');

        this.paypalView = this.paypal.getComponent('PaypalView');
    
        //用centerView脚本来布置整个画面，包括横竖屏的响应方法。
        this.centerScript = this.center.getComponent("CenterView");
        this.centerScript.setGameController(this);
        // 设置顶部推送消息的位置
        this.gameModel.setNotificationPos(this.centerScript.getScreenPixel());

        // 根据model渲染各个元素状态 大小 位置等
        this.centerScript.initWithModel(this.gameModel);

        // 监听横竖屏变化
        if (typeof dapi !== 'undefined') {
            // IS平台使用媒体查询事件
            let mql = window.matchMedia("(orientation: portrait)");
            mql.addListener(this.centerScript.orientCb.bind(this.centerScript, true));
        } else {
            window.addEventListener("resize", this.centerScript.orientCb.bind(this.centerScript, true));
        }

        // // 启动点击音效
        // this.bindClickEffect();

        // 数据加载完毕
        PlayformSDK.gameReady();

        // this.guideView.showWelcomePage();

        // this.gotoNextStep();
    },

    start () {
    },

    /**执行任务队列 */
    gotoNextStep: function () {
        let guideList = this.gameModel.guideList;
        if (guideList.length > 0) {
            (guideList.shift())(this.gotoNextStep);
            // this.currStep++;
        }
    },
    /**点击开始游戏 */
    clickStartGame() {
        //播放开场音效
        // this.AudioUtils.getComponent('AudioUtils').playEffect('startMusic', 0.6);
        // this.GuideView.startGame();
        // this.gotoNextStep();
    },



    download() {
        this.endGame();
        PlayformSDK.download();
    },

    // 音频类方法
    getAudioUtils() {
        return this.AudioUtils.getComponent('AudioUtils')
    },

    // 调用View显示操作方法
    // showEndPage() {
    //     this.AudioUtils.getComponent('AudioUtils').playEffect('endMusic', 0.6);
    //     PlayformSDK.gameFinish();
    //     this.GuideView.showEndPage();
    // },

    addCash (number) {
        // let nowMoney = this.cashView.addCash(number);
        // setTimeout(() => {
        //     this.gameView.textBling();
        // }, 800);
        // setTimeout(() => {
        //     this.gameView.showPPcard();
        // }, 1300)
        
        // 转盘新增
        this.cashView.addCash(number);
        // 转盘新增结束

        // this.getAudioUtils().playEffect('money', 0.6);
        // console.log('addCash progress,', this.gameView.gameInfo.progress);
        // if (this.gameView.gameInfo.progress >= 1) {
        //     this.gameView.stopGame();
        //     this.gameView.textBling();
        //     this.guideView.changeTextNum(this.cashView.targetCash);
        //     this.guideView.showCashOutHand();
        // }
    },

    addCash100 () {
        this.cashView.addCash(100);
        this.getAudioUtils().playEffect('money', 0.6);
        this.guideView.hideWelcomePage();
    },

    // 调用Model数据操作方法

    /**绑定点击音效 */
    bindClickEffect() {
        // this.node.on(cc.Node.EventType.TOUCH_START, function (touchEvent) {
        //     this.AudioUtils.getComponent('AudioUtils').playEffect('bgClick', 2)
        // }, this)
    },

    gameEndDisplay() {
        // this.grid.getComponent('cc.Mask').enabled = false;
        // cc.find('Canvas/center/tipEnd').active = false;//让结束引导消失
    },

    endGame () {
        PlayformSDK.gameFinish();
    }

});