import GameModel from "../Model/GameModel";
import { PlayformSDK } from "../Utils/PlayformSDK";
import { TIP_STRATEGY } from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,
    properties: {
        //与音频相绑定的结点
        AudioUtils: cc.Node,
        //与游戏顺序和游戏引导相关的结点
        guide: cc.Node,
        //整个游戏场景结点
        center:cc.Node

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
        //是否显示左下方fps信息
        cc.debug.setDisplayStats(false);

        this.grid=cc.find('Canvas/center/grid');

        // GameModel初始化
        this.gameModel = new GameModel();
        this.gameModel.gameInit();
        
        // this.toolList = this.gameModel.getTools();
        //在方格中生成格子视图
        this.gridScript = this.grid.getComponent("GridView");
        this.gridScript.setGameModel(this.gameModel);//将游戏模型传给格子视图
        this.gridScript.setGameController(this);//将游戏模型传给格子视图
        // gridScript.initWithSandsModel(this.gameModel.getSandsModel());//用沙子模型列表来初始化沙子
        this.gridScript.initWithCellsModel(this.gameModel.getCellsModel());//用动物模型列表来初始化格子视图
        this.gameModel.setGridView(this.gridScript);

        this.guideScript = this.guide.getComponent("GuideView");
        this.gameModel.setGuideView(this.guideScript);

        // this.effectView = this.effectLayer.getComponent('EffectView');
        // //得到GuideView脚本
        // this.GuideView = this.guide.getComponent('GuideView');

        // 拿到计分脚本 gradeView
        this.GradeView = cc.find('Canvas/center/grade').getComponent('GradeView');
        // 拿到现金余额脚本 gradeView
        this.CashView = cc.find('Canvas/center/wallet/cash').getComponent('CashView');

        //用centerView脚本来布置整个画面，包括横竖屏的响应方法。
        this.centerScript = this.center.getComponent("CenterView");
        this.centerScript.setGameController(this);
        this.gameModel.setNotificationPos(this.centerScript.getScreenPixel()); // 设置通知消息的位置

        // 根据model渲染各个元素状态 大小 位置等
        this.centerScript.initWithModel(this.gameModel);

        // 监听横竖屏变化
        if (typeof dapi !== 'undefined') {
            // IS平台使用媒体查询事件
            let mql = window.matchMedia("(orientation: portrait)");
            mql.addListener( this.centerScript.orientCb.bind(this.centerScript, true) );
        } else {
            window.addEventListener("resize", this.centerScript.orientCb.bind(this.centerScript, true));
        }

        // // 启动点击音效
        this.bindClickEffect();

        // 数据加载完毕
        PlayformSDK.gameReady();

        this.gotoNextStep();
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
        this.AudioUtils.getComponent('AudioUtils').playEffect('startMusic', 0.6);
        this.GuideView.startGame();
        this.gotoNextStep();
    },



    download() {
        PlayformSDK.download();
    },

    // 音频类方法
    getAudioUtils() {
        return this.AudioUtils.getComponent('AudioUtils');
    },

    // 获取gridView脚本
    getGridViewScript() {
        return this.gridScript;
    },

    // 调用View显示操作方法
    showEndPage() {
        this.AudioUtils.getComponent('AudioUtils').playEffect('endMusic', 0.6);
        PlayformSDK.gameFinish();
        this.GuideView.showEndPage();


    },

    // 调用Model数据操作方法

    /**绑定点击音效 */
    bindClickEffect() {
        // this.node.on(cc.Node.EventType.TOUCH_START, function (touchEvent) {
        //     this.AudioUtils.getComponent('AudioUtils').playEffect('bgClick', 2)
        // }, this)
    },

    gameEndDisplay() {
        this.grid.getComponent('cc.Mask').enabled = false;

        cc.find('Canvas/center/tipEnd').active = false;//让结束引导消失

    }

});
