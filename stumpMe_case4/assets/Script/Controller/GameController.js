import GameModel from "../Model/GameModel";
import { PlayformSDK } from "../Utils/PlayformSDK";

cc.Class({
    extends: cc.Component,
    properties: {
        AudioUtils: cc.Node,
        center: cc.Node,
        item: cc.Node
    },

    onLoad () {
        PlayformSDK.gameStart();
    },

    gameInit () {
        cc.debug.setDisplayStats(false);
        // 游戏开始 等待平台SDK加载后调用gameInit
        // GameModel初始化
        this.gameModel = new GameModel();
        this.gameModel.setGameController(this);
        this.gameModel.gameInit();

        //用centerView脚本来布置整个画面，包括横竖屏的响应方法。
        this.centerScript = this.center.getComponent("CenterView");
        this.centerScript.setGameController(this);

        // 根据model渲染各个元素状态 大小 位置等
        this.centerScript.initWithModel(this.gameModel);

        // 监听横竖屏变化
        if (typeof dapi !== 'undefined') {  // IS平台使用媒体查询事件
            let mql = window.matchMedia("(orientation: portrait)");
            mql.addListener(this.centerScript.orientCb.bind(this.centerScript, true));
        } else {
            window.addEventListener("resize", this.centerScript.orientCb.bind(this.centerScript, true));
        }
        // 绑定拖拽事件
        this.bindDragEvent();
        // 启动点击音效
        this.bindClickEffect();
        // 数据加载完毕
        PlayformSDK.gameReady();
    },

    // 调用View显示操作方法
    gameEnd () {
        // 如果用户疯狂点击，则直接跳转到商店页
        // 弹出结束页
        PlayformSDK.gameFinish();
        this.downloadTimeout = setTimeout(() => {
            PlayformSDK.download();
        }, 2000)
    },

    download () {
        clearTimeout(this.downloadTimeout);
        PlayformSDK.download();
    },

    getAudioUtils () {
        return this.AudioUtils.getComponent('AudioUtils')
    },

    /**绑定点击音效 */
    bindClickEffect () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (touchEvent) {
            this.AudioUtils.getComponent('AudioUtils').playEffect('bgClick', 1)
        }, this)
    },

    bindDragEvent () {
        this.center.on(cc.Node.EventType.TOUCH_START, function (touchEvent) {
            // 判断是否可以拖动 Model
            if( this.gameModel.isDragging() ) return;
            // // 获取正拖动哪个Model
            var touchPos = touchEvent.getTouches()[0].getLocation();    //获得用户的触屏输入点
            // console.log(`file: GameController.js ~ line 78 ~ touchPos`, touchPos);
            let canvasPos = this.node.convertToNodeSpaceAR(touchPos);
            // console.log(`file: GameController.js ~ line 80 ~ canvasPos`, canvasPos);
            let distances = this.gameModel.getDistances(canvasPos);
            
            // 判断是否开始拖拽
            this.gameModel.items.some((item, index) => {
                if ( distances[index] < (item.node.width * item.node.scale / 2) ) {
                    // 是否已经被打破，打破则无法拖动
                    if (!item.isBorken) {
                        this.gameStart();
                        this.gameModel.startPos = item.getPosition();
                        this.gameModel.setDragItem(item);
                        return true;
                    }
                }
                return false;
            });
        }, this);

        //移动事件
        this.item.on(cc.Node.EventType.TOUCH_MOVE, function (touchEvent) {
            if ( this.gameModel.canDragMove() ) { // 已开始拖拽时
                var touches = touchEvent.getTouches();//获得用户的触屏输入点
                var canvasPos = this.node.convertToNodeSpaceAR(touches[0].getLocation());
                if ( this.gameModel.startDrag || (this.gameModel.startPos && canvasPos.sub(this.gameModel.startPos).mag() > 120)) {
                    this.gameModel.startDrag = true;
                    this.centerScript.dragNode(canvasPos);
                }
            }
        }, this);

        //触摸被系统Cancel了
        this.item.on(cc.Node.EventType.TOUCH_CANCEL, function (touchEvent) {
            if ( this.gameModel.canDragMove() ) {
                console.warn("touch_cancel");
                // 恢复可拖动
                this.gameModel.releaseDragItem();
            }
        }, this);

        // 用户结束触摸
        this.item.on(cc.Node.EventType.TOUCH_END, function (touchEvent) {
            if ( this.gameModel.canDragMove() ) {
                let canvasPos = this.node.convertToNodeSpaceAR(touchEvent.getLocation());  // 当前拖拽的位置
                this.centerScript.dropNode(canvasPos);
            }
        }, this);
    },
    
    gameStart () {
        let hand = cc.find('Canvas/center/hand');
        if (hand.active) {
            hand.runAction(
                cc.sequence(cc.fadeOut(.3), cc.callFunc(() => {hand.active = false}))
            );
        }
    },
    showEndPage () {
        // let item = cc.find('Canvas/center/item');
        let piggy = cc.find('Canvas/center/item/3');
        let check = cc.find('Canvas/center/check');
        let modal = cc.find('Canvas/center/modal');
        check.position = piggy.position;
        check.active = true;
        check.runAction(cc.sequence(
            cc.blink(0.6, 2),
            cc.callFunc(() => {
                modal.getChildByName('endPage').active = true;
                modal.active = true;
                modal.runAction(cc.fadeIn(.4));
                this.gameEnd();
            })
        ));
    },
    showTip () {
        if (!this.gameModel.canShowTip) return;
        let modal = cc.find('Canvas/center/modal');
        modal.getChildByName('middlePage').active = true;
        modal.active = true;
        modal.runAction(cc.fadeIn(.4));
    },
    closeTip () {
        let modal = cc.find('Canvas/center/modal');
        modal.runAction(cc.sequence(
            cc.fadeOut(.4),
            cc.callFunc(()=>{
                modal.active = false;
                modal.getChildByName('middlePage').active = false;
            })
        ));
    },
    /**允许出现提示 */
    enableTip () {
        let tip = cc.find('Canvas/center/tip');
        this.gameModel.canShowTip = true;
        tip.getComponent(cc.Animation).play();
    }
});
