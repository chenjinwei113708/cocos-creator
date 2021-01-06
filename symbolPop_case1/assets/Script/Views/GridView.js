import {
    GRID_WIDTH,
    GRID_HEIGHT,
    CELL_WIDTH,
    CELL_HEIGHT,
    GRID_PIXEL_WIDTH,
    GRID_PIXEL_HEIGHT,
    ANITIME,
    TIP,
    TIP_STRATEGY
} from '../Model/ConstValue';


cc.Class({
    extends: cc.Component,
    properties: {
        // 方块的prefab
        aniPre: {
            default: [],
            type: [cc.Prefab]
        },
        // 沙子的prefab
        // sandPre: cc.Prefab,

        // 特效层
        effectLayer: {
            default: null,
            type: cc.Node
        },

    },


    onLoad: function () {
        this.setListener();

        this.lastTouchPos = cc.Vec2(-1, -1);

        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中

        this.effectView = cc.find('Canvas/center/game/effect').getComponent('EffectView'); //特效显示层脚本

        // this.GameController = cc.find('Canvas').getComponent('GameController'); // 游戏控制器脚本

        this.freeTime = 0; //空闲时间，用户有多长时间没有触摸屏幕，单位秒
        // this.myInterval = setInterval(this.addFreeTime.bind(this), 1000);//计时器，用来计算空闲时间
        // 计算所有可以爆炸的区域
        // let tip = this.gameModel.getTipArea(this.gameModel.getLeftBombAreas(), TIP_STRATEGY.MOST_GRADE);
        // this.tip = tip;//提示信息，里面存了需要提示的cellModel
    },
    setGameModel: function (gameModel) {
        //传一个gameModel进来
        this.gameModel = gameModel;
    },
    setGameController: function (gameController) {
        // 游戏控制器脚本
        this.GameController = gameController;
    },
    setTipModels(tipModels) {
        this.tip = tipModels;
    },

    /**
     * 用方块模型列表来初始化格子视图
     * @param {*} cellsModels 方块模型列表，里面的方块类型是用数字来代表的
     */
    initWithCellsModel: function (cellsModels) {
        /**------!!!!!方块视图列表，初定义------*/
        this.cellViews = [];
        let number = 0;
        for (var i = 1; i <= GRID_HEIGHT; i++) { //row y
            this.cellViews[i] = [];
            for (var j = 1; j <= GRID_WIDTH; j++) { // colum x
                var type = cellsModels[i][j].type;
                var aniView = cc.instantiate(this.aniPre[type]); //初始化一个预制资源 
                // type{0:null; 1:star(星星); 2:white(白海螺); 3:blue(蓝海螺); 4:shell(贝壳)}

                // 预制资源的第0个已经被留空，所以直接从1开始
                // 将预制资源的父节点设为当前节点，就是把预制资源绑定到当前节点
                aniView.parent = this.node;
                // 拿到方块预制资源上绑定的组件“CellView”
                var cellViewScript = aniView.getComponent("CellView");
                //初始化某个方块的位置 以及动画效果
                cellViewScript.initWithModel(cellsModels[i][j]);
                cellViewScript.playAppearAnim(number++);
                //把每个方块的视图存到视图列表里面去
                this.cellViews[i][j] = aniView;
            }
        }
    },
    /**
     * 设置触碰监听器
     */
    setListener: function () {
        //监听点击事件，点击方块
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart (eventTouch) {
        var touchPos = eventTouch.getLocation();
        // 将用户点击左边转换成cc.vec2坐标，如(1,1)
        var cellPos = this.convertTouchPosToCell(touchPos);
        this.onClickCell(cellPos)
    },

    /**开始计时 */
    startCounting() {
        this.myInterval = setInterval(this.addFreeTime.bind(this), 1000); //计时器，用来计算空闲时间
    },

    /**
     * 点击格子
     * @param {*} pos 点击格子下标
     * @param {*} waitTime 爆炸时间间隔
     */
    onClickCell(cellPos, waitTime = 550) {
        // console.log('gridview cellPos ', cellPos);
        if (this.isInPlayAni) { //播放动画中，不允许点击
            return true;
        }
        this.isInPlayAni = true;
        let gameRules = this.gameModel.getGameRules();

        if (this.gameModel.curGuideStep >= 4) {
            waitTime = 250; // 如果到第4步之后了，加快爆炸速度
        }
        if (gameRules.limitArea) {
            let isInLimitArea = this.gameModel.checkInLimitArea(gameRules.limitArea, cellPos);
            if (!isInLimitArea) return; // 如果超出限制区域，不允许点击
        }

        // 计算出将要爆炸的格子,拿到格子模型数组
        let bombModels = this.gameModel.selectCell(cellPos);
        // 如果数组长度大于1，说明它周围有同类方块
        if (bombModels.length > 1) {
            // 隐藏指引手
            this.GameController.guideScript.hideHand();
            // 停止提示
            this.stopTip(this.tip);
            clearInterval(this.myInterval);
            // 更新积分显示
            let grade = bombModels.length * bombModels.length * 5;
            // this.GameController.GradeView.addGrade(grade);
            // 计算下移和左移的格子
            let downModels = [];
            let leftModels = [];
            this.gameModel.calculateMoveModels(bombModels, downModels, leftModels);
            // // 计算还有没有可以爆炸的区域
            this.tip = this.gameModel.getTipArea(this.gameModel.getLeftBombAreas(), TIP_STRATEGY.MOST_GRADE);
            // console.log('gridview tip:',this.tip);
            this.effectView.playBombEffect(bombModels, waitTime, function () {
                // 播放下移动画
                let waitTime = 0;
                downModels.forEach(downcell => {
                    let needTime = this.cellViews[downcell.y][downcell.x].getComponent('CellView').move(
                        downcell.moveCmd.direction, downcell.moveCmd.step, cc.v2(downcell.x, downcell.y));
                    waitTime = needTime > waitTime ? needTime : waitTime;
                    // 根据移动位置，更新cellViews，需要下移的格子放到指定位置，原位置的格子置为空
                    this.cellViews[downcell.y - downcell.moveCmd.step][downcell.x] = this.cellViews[downcell.y][downcell.x];
                    this.cellViews[downcell.y][downcell.x] = null;
                });
                // 播放左移动画
                // console.log('gridview zuo，',leftModels);
                leftModels.forEach(leftcell => {
                    this.cellViews[leftcell.y][leftcell.x].getComponent('CellView').move(
                        leftcell.moveCmd.direction, leftcell.moveCmd.step, cc.v2(leftcell.x, leftcell.y), waitTime);
                    // 根据移动位置，更新cellViews，需要左移的格子放到指定位置，原位置的格子置为空
                    this.cellViews[leftcell.y][leftcell.x - leftcell.moveCmd.step] = this.cellViews[leftcell.y][leftcell.x];
                    this.cellViews[leftcell.y][leftcell.x] = null;
                });
                let animEndCallback = () => {
                    this.isInPlayAni = false;
                };
                this.freeTime = 0;
                if (this.tip.length === 0) {
                    this.noMoreBomb();
                    // 显示提现
                    // this.GameController.guideScript.showMoneyCard(gameRules.money);
                    this.GameController.guideScript.showPaypalCardFly(gameRules.money, animEndCallback);

                } else {
                    // 显示提现
                    // this.GameController.guideScript.showMoneyCard(gameRules.money);
                    this.GameController.guideScript.showPaypalCardFly(gameRules.money, animEndCallback);
                    // this.startCounting();
                }
            }.bind(this));
        } else {
            this.isInPlayAni = false;
        }

        // if (cellPos) {
        //     var changeModels = this.selectCell(cellPos);
        //     this.isCanMove = changeModels.length < 3;
        // } else {
        //     this.isCanMove = false;
        // }
        return true;
    },

    // playEffect: function (effectsQueue) {
    //     this.effectView.playEffects(effectsQueue);
    // },

    disableTouch: function () {
        this.isInPlayAni = true;
    },

    // 根据点击的像素位置，转换成网格中的位置
    convertTouchPosToCell: function (pos) {
        pos = this.node.convertToNodeSpaceAR(pos); //将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。
        // 在iphoneX等长屏幕设备上，竖屏时，要重新计算坐标
        // let screen = this.GameController.centerScript.getScreenPixel();
        // if (!this.GameController.gameModel.isLandscape && screen.ratio>1.78){
        //     pos.y = pos.y - (screen.height*(540/screen.width)-960)/2;
        //     console.log('gridview /// convert Pos ',pos);
        // }
        if (pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT) {
            return false;
        }
        var x = Math.floor(pos.x / CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return cc.v2(x, y);
    },

    /**已经没有可以爆炸的区域了 */
    noMoreBomb() {
        console.log('gridView 已经没有可以爆炸的区域了');
    },

    /**增加空闲时间 */
    addFreeTime() {
        this.freeTime++;
        // console.log("addFreeTime", this.freeTime, ' tip', this.tip);
        if (this.freeTime >= TIP.WAIT_TIME && this.tip.length > 1) { //如果空闲时间大于等于某个时间，触发提示
            this.freeTime = 0;
            // console.log('grid showtip ', this.tip);
            this.showTip(this.tip);
            clearInterval(this.myInterval);
        }
    },
    /**
     * 展示提示信息
     * @param {*} showCells 需要提示的节点
     */
    showTip(showCells) {
        showCells.forEach(function (value) {
            this.cellViews[value.y][value.x].getComponent("CellView").setTipHere();
        }, this);
        if (this.gameModel.curOrder === this.gameModel.ORDER.B) {
            this.GameController.guideScript.showHand();
        }
    },
    /**
     * 停止提示信息
     * @param {*} showCells 需要提示的节点
     */
    stopTip(showCells) {
        if (showCells) {
            showCells.forEach(function (value) {
                this.cellViews[value.y][value.x].getComponent("CellView").stopTipHere();
            }, this);
            this.tip = []; // tip需要重新计算
        }
    },

    /**
     * 删除方块
     * @param {*} cellModel 
     */
    deleteCell(cellModel) {
        this.cellViews[cellModel.y][cellModel.x].getComponent('CellView').disappear();
    }


});