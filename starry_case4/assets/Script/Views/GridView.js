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

        this.effectView = cc.find('Canvas/center/effect').getComponent('EffectView'); //特效显示层脚本

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
        // console.log('gridview setGameModel', this.gameModel);
    },
    setGameController: function (gameController) {
        // 游戏控制器脚本
        this.GameController = gameController;
    },
    setTipModels (tipModels) {
        this.tip = tipModels;
    },

    // /**
    //  * 用沙子模型列表来初始化格子视图
    //  * @param {*} cellsModels 沙子模型列表，里面的沙子类型是用数字来代表的
    //  */
    // initWithSandsModel(sandModel) {
    //     for (var i = 1; i <= sandModel.length; i++) {
    //         if (sandModel[i] != undefined || sandModel[i] != null) {
    //             for (var j = 1; j <= sandModel[i].length; j++) {
    //                 if (sandModel[i][j] != undefined || sandModel[i][j] != null) {//如果模型中这个位置存在沙子
    //                     var sand = cc.instantiate(this.sandPre);
    //                     sand.parent = this.node.getChildByName('bg').getChildByName('sandLayer');
    //                     var sandView = sand.getComponent("SandView"); //拿到沙子预制资源上绑定的组件“SandView”
    //                     sandView.initWithModel(sandModel[i][j]); //初始化某个沙子的位置
    //                     sandModel[i][j].setSandView(sandView);
    //                 }
    //             }
    //         }
    //     }
    // },

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
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
            var touchPos = eventTouch.getLocation();
            // 将用户点击左边转换成cc.vec2坐标，如(1,1)
            var cellPos = this.convertTouchPosToCell(touchPos);
            this.onClickCell(cellPos)
        }, this);
    },

    /**开始计时 */
    startCounting () {
        this.myInterval = setInterval(this.addFreeTime.bind(this), 1000);//计时器，用来计算空闲时间
    },

    /**
     * 点击格子
     * @param {*} pos 点击格子下标
     * @param {*} waitTime 爆炸时间间隔
     */
    onClickCell (cellPos, waitTime = 550) {
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
        // console.log('gridview cellPos ',cellPos);
        // 计算出将要爆炸的格子,拿到格子模型数组
        let bombModels = this.gameModel.selectCell(cellPos);
        // 如果数组长度大于1，说明它周围有同类方块
        if(bombModels.length>1){
            // 隐藏指引手
            this.GameController.guideScript.hideHand();
            // 停止提示
            this.stopTip(this.tip);
            clearInterval(this.myInterval);
            // 更新积分显示
            let grade = bombModels.length * bombModels.length *5;
            this.GameController.GradeView.addGrade(grade);
            // 计算下移和左移的格子
            let downModels = [];
            let leftModels = [];
            this.gameModel.calculateMoveModels(bombModels, downModels, leftModels);
            // // 计算还有没有可以爆炸的区域
            this.tip = this.gameModel.getTipArea(this.gameModel.getLeftBombAreas(), TIP_STRATEGY.MOST_GRADE);
            // console.log('gridview tip:',this.tip);
            this.effectView.playBombEffect(bombModels, waitTime, function(){
                // 播放下移动画
                let waitTime = 0;
                downModels.forEach(downcell => {
                    let needTime = this.cellViews[downcell.y][downcell.x].getComponent('CellView').move(
                        downcell.moveCmd.direction, downcell.moveCmd.step, cc.v2(downcell.x, downcell.y));
                    waitTime = needTime > waitTime? needTime:waitTime;
                    // 根据移动位置，更新cellViews，需要下移的格子放到指定位置，原位置的格子置为空
                    this.cellViews[downcell.y-downcell.moveCmd.step][downcell.x] = this.cellViews[downcell.y][downcell.x];
                    this.cellViews[downcell.y][downcell.x] = null;
                });
                // 播放左移动画
                // console.log('gridview zuo，',leftModels);
                leftModels.forEach(leftcell => {
                    this.cellViews[leftcell.y][leftcell.x].getComponent('CellView').move(
                        leftcell.moveCmd.direction, leftcell.moveCmd.step, cc.v2(leftcell.x, leftcell.y), waitTime);
                    // 根据移动位置，更新cellViews，需要左移的格子放到指定位置，原位置的格子置为空
                    this.cellViews[leftcell.y][leftcell.x-leftcell.moveCmd.step] = this.cellViews[leftcell.y][leftcell.x];
                    this.cellViews[leftcell.y][leftcell.x] = null;
                });
                let animEndCallback = () => {
                    this.isInPlayAni = false;
                };
                this.freeTime = 0;
                if(this.tip.length === 0){
                    this.noMoreBomb();
                    // 显示提现
                    // this.GameController.guideScript.showMoneyCard(gameRules.money);
                    this.GameController.guideScript.showPaypalCardFly(gameRules.money, animEndCallback);

                }else{
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

    /**消除贝壳和海洋生物之后，进行计数,并展示在进度条上 */
    // updateProgress: function () {
    //     let shell = 0,
    //         chazi = 0,
    //         count = this.gameModel.cellCrushCount;
    //     Object.keys(count).forEach((key) => {
    //         if (key == '4') {
    //             shell = count[key];
    //         } else if (key == '6' || key == '7' || key == '8') {
    //             chazi += count[key];
    //         }
    //     });
    //     // let guideScript = cc.find('Canvas/center/guide').getComponent('GuideView');
    //     let progressNode = cc.find('Canvas/center/progress');
    //     let text = progressNode.getChildByName('collectProgress').getChildByName('text').getComponent('cc.Label');

    //     if (chazi / 5 >= 1) {
    //         this.gameModel.chaziPercent = 1;
    //         // if (shell / 30 < 1) {
    //         //     guideScript.skillGuide();
    //         // }
    //     } else {
    //         this.gameModel.chaziPercent = chazi / 5;
    //     }

    //     if (shell / 30 >= 1) {
    //         // console.log('update shell percent = 1');
    //         if (this.gameModel.canPlaySkillAudio) {//只播放一次集齐音乐
    //             this.gameModel.canPlaySkillAudio = false;
    //             let audioUtils = cc.find('Canvas').getComponent('GameController').getAudioUtils();
    //             audioUtils.playEffect('progressFull', 2);
    //         }
    //         text.string = '30/30';
    //         this.gameModel.shellPercent = 1;
    //         // if (this.gameModel.chaziPercent == 1) {//如果贝壳收集完的同时，叉子也集满了，就取消点击叉子提醒
    //         //     guideScript.stopSkillGuide();
    //         // }
    //         // 进度条设置成1
    //         this.gameModel.chaziPercent = 1;
    //         // gameEnd display
    //         // this.effectView.showThunder();
    //         // guideScript.endGuide();//引导用户结束
    //     } else {
    //         text.string = `${shell}/30`;
    //         this.gameModel.shellPercent = Number.parseFloat((shell / 30).toFixed(1));
    //     }
    //     let skillPB = progressNode.getChildByName('skillProgress').getComponent('cc.ProgressBar'),
    //         shellPB = progressNode.getChildByName('collectProgress').getComponent('cc.ProgressBar');
    //     skillPB.progress = this.gameModel.chaziPercent;
    //     shellPB.progress = this.gameModel.shellPercent;
    // },

    /**计数完成之后，展示提示等 */
    // updateProgressView() {
    //     let shell = 0,
    //         chazi = 0,
    //         count = this.gameModel.cellCrushCount;
    //     Object.keys(count).forEach((key) => {
    //         if (key == '4') {
    //             shell = count[key];
    //         } else if (key == '6' || key == '7' || key == '8') {
    //             chazi += count[key];
    //         }
    //     });
    //     let guideScript = cc.find('Canvas/center/guide').getComponent('GuideView');

    //     if (chazi / 5 >= 1) {
    //         this.gameModel.chaziPercent = 1;
    //         if (shell / 30 < 1) {
    //             guideScript.skillGuide();
    //         }
    //     } else {
    //         this.gameModel.chaziPercent = chazi / 5;
    //     }

    //     if (shell / 30 >= 1) {
    //         // console.log('update view shell =1');
    //         if (this.gameModel.canPlaySkillEffect) {
    //             this.gameModel.canPlaySkillEffect = false;
    //             this.gameModel.shellPercent = 1;
    //             // 进度条设置成1
    //             this.gameModel.chaziPercent = 1;
    //             // gameEnd display
    //             this.effectView.showThunder();
    //             guideScript.endGuide();//引导用户结束
    //         }


    //     }
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

    // // 正常击中格子后的操作
    // selectCell: function (cellPos) {
    //     //gameModel
    //     var result = this.gameModel.selectCell(cellPos); // 直接先丢给model处理数据逻辑
    //     var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
    //     var effectsQueue = result[1]; // 各种特效
    //     if (changeModels.length > 3) {//用户找到连在一起的格子
    //         //停止提示
    //         this.stopTip(this.tip);
    //         //停止累计空闲时间。等动画播放完，再重新开始计时
    //         this.freeTime = 0;
    //         clearInterval(this.myInterval);
    //     }
    //     this.playEffect(effectsQueue);
    //     // console.log('Grid playEff');
    //     this.disableTouch(changeModels, this.getStep(effectsQueue));
    //     this.updateView(changeModels);
    //     // console.log('Grid updateVi');

    //     this.gameModel.cleanCmd();

    //     if (changeModels.length >= 2) {
    //         this.effectView.setSelectBoxInvisible(cellPos); //隐藏选中框
    //         // this.updateSelect(cc.v2(-1, -1));
    //         // this.audioUtils.playSwap();
    //     } else {
    //         // this.updateSelect(cellPos);
    //         // this.audioUtils.playClick();
    //         // this.effectView.setSelectBoxInvisible(); //隐藏选中框
    //         this.effectView.setSelectBoxVisible(cellPos); //显示选中框
    //     }
    //     // console.log('grid select:',changeModels);

    //     return changeModels;
    // },

    // // 移动格子
    // updateView: function (changeModels) {
    //     // // 清除提示；
    //     // this.stopTip(this.tip);

    //     let newCellViewInfo = [];
    //     for (var i in changeModels) {
    //         var model = changeModels[i];
    //         var viewInfo = this.findViewByModel(model);
    //         var view = null;

    //         // 如果原来的cell不存在，则新建
    //         if (!viewInfo) {
    //             var type = model.type;
    //             var aniView = cc.instantiate(this.aniPre[type]);
    //             aniView.parent = this.node;
    //             var cellViewScript = aniView.getComponent("CellView");
    //             cellViewScript.initWithModel(model);
    //             view = aniView;
    //         }
    //         // 如果已经存在
    //         else {
    //             view = viewInfo.view;
    //             this.cellViews[viewInfo.y][viewInfo.x] = null;
    //         }

    //         var cellScript = view.getComponent("CellView");
    //         cellScript.updateView(); // 执行移动动作
    //         if (!model.isDeath) {
    //             newCellViewInfo.push({
    //                 model: model,
    //                 view: view
    //             });
    //         }
    //     }
    //     // 重新标记this.cellviews的信息
    //     newCellViewInfo.forEach(function (ele) {
    //         let model = ele.model;
    //         this.cellViews[model.y][model.x] = ele.view;
    //     }, this);
    // },

    /**
     * 根据cell的model返回对应的view
     */
    // findViewByModel: function (model) {
    //     for (var i = 1; i <= GRID_WIDTH; i++) {
    //         for (var j = 1; j <= GRID_HEIGHT; j++) {
    //             if (this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model) {
    //                 return {
    //                     view: this.cellViews[i][j],
    //                     x: j,
    //                     y: i
    //                 };
    //             }
    //         }
    //     }
    //     return null;
    // },

    // getPlayAniTime: function (changeModels) {
    //     if (!changeModels) {
    //         return 0;
    //     }
    //     var maxTime = 0;
    //     changeModels.forEach(function (ele) {
    //         ele.cmd.forEach(function (cmd) {
    //             // console.log(cmd.playTime, cmd.keepTime, cmd.action);
    //             if (maxTime < cmd.playTime + cmd.keepTime) {
    //                 maxTime = cmd.playTime + cmd.keepTime;
    //             }
    //         }, this)
    //     }, this);
    //     // console.log(changeModels,'time', maxTime);
    //     return maxTime;
    // },

    // 获得爆炸次数， 同一个时间算一个
    // getStep: function (effectsQueue) {
    //     if (!effectsQueue) {
    //         return 0;
    //     }
    //     return effectsQueue.reduce(function (maxValue, efffectCmd) {
    //         return Math.max(maxValue, efffectCmd.step || 0);
    //     }, 0);
    // },

    /**已经没有可以爆炸的区域了 */
    noMoreBomb () {
        console.log('gridView 已经没有可以爆炸的区域了');
    },
    
    /**增加空闲时间 */
    addFreeTime() {
        this.freeTime++;
        // console.log("addFreeTime", this.freeTime, ' tip', this.tip);
        if (this.freeTime >= TIP.WAIT_TIME && this.tip.length>1) {//如果空闲时间大于等于某个时间，触发提示
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
    deleteCell (cellModel) {
        this.cellViews[cellModel.y][cellModel.x].getComponent('CellView').disappear();
    }


});