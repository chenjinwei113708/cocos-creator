import GameModel from "../Model/GameModel";
import { PlayformSDK } from "../Utils/PlayformSDK";

cc.Class({
    extends: cc.Component,
    properties: {
        center:cc.Node, // 横竖屏适配
        
        game: cc.Node, // 游戏主要部分
        audio: cc.Node, // 音频
        guide: cc.Node, // 引导
        cash: cc.Node, // 金币 / 分数
        award: cc.Node, // 奖励相关
        progress: cc.Node, // 进度条
        countDown: cc.Node, // 倒计时
        turnBox: cc.Node // 转盘
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

        // 获取脚本
        this.gameView = this.game.getComponent('GameView');
        this.guideView = this.guide.getComponent('GuideView');
        this.cashView = this.cash.getComponent('CashView');
        this.centerScript = this.center.getComponent("CenterView");
        this.audioUtils = this.audio.getComponent('AudioUtils');
        this.awardView = this.award.getComponent('AwardView');
        this.progressView = this.progress.getComponent('ProgressView');
        this.countDownView = this.countDown.getComponent('CountDownView');
        this.turnView = this.turnBox.getComponent('TurnView');

        // 设置gameController引用
        this.setGameController(
            this.gameView,
            this.guideView,
            this.cashView,
            this.centerScript,
            this.audioUtils,
            this.awardView,
            this.progressView,
            this.countDownView,
            this.turnView
        );

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

        // 数据加载完毕
        PlayformSDK.gameReady();
    },

    /**设置脚本绑定gameController引用 */
    setGameController (...scripts) {
        scripts.forEach(script => {
            script.gameController = this
        })
    },

    /**
     * 用来绑定脚本之间的相互引用
     * @param {*} that 需要绑定的脚本this
     * @param {*} scriptName 脚本名字
     */
    setScript (that, ...scriptNames) {
        scriptNames.forEach(scriptName => {
            that[scriptName] = this[scriptName];
        })
    },

    /**调用下载方法 */
    download () {
        this.endGame();
        PlayformSDK.download();
    },

    /**调用结束游戏时的方法 */
    endGame () {
        PlayformSDK.gameFinish();
    },
});
