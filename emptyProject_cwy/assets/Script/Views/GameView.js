import {
    CORRECT_POS,
    GAME_MODE,
    GAME_INFO
} from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        guide: cc.Node, // 引导模块
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node, // 音效
        progress: cc.Node,
        cash: cc.Node
    },

    onLoad() {
        this.gameViewInit();
    },
    // 初始化gameview
    gameViewInit() {
        // 初始化参数
        this.endProgress = 1; // 初始默认设置为1
        this.currentProgress = 0; // 初始的进度
        this.stopStartGuide = null; // 存储停止提示方法的变量
        this.stopCashOutHand = null ; // 存储停止cashoutHand方法的变量
        this.isShowingCorrect = false; // 表示正在展示正确页

        // 获取目标脚本
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.audioUtils = this.audio.getComponent('AudioUtils');
        this.progressView = this.progress.getComponent('ProgressView'); // 获取其脚本文件
        this.cashView = this.cash.getComponent('CashView')    
    },
    // 获取两点的直线距离
    getDistance(pos1, pos2) {
        // return Math.floor(Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)));
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },
    // 切换遮罩层
    toggleMask() {
    }
});
