import {
    CELL_TYPE,
    CELL_BASENUM,
    CELL_STATUS,
    GRID_WIDTH,
    GRID_HEIGHT,
    ANITIME,
    TIP,
    TIP_STRATEGY,
    DIRECTION
} from "./ConstValue";
import CellModel from "./CellModel";
// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isApplovin = true; // 是不是applovin平台
        this.HorizontalConfig = {
            // // 横屏
            background: {
                position: cc.v2(0, 0),
                angle: -90,
                width: 540,
                height: 1169.3
            },
            grid: {
                position: cc.v2(-38, -250),
            },
            effect: {
                position: cc.v2(-38, -250),
            },
            audioBtn: {
                position: cc.v2(-433.948, 46)
            },
            score: {
                position: cc.v2(-411, -77)
            },
            grade: {
                position: cc.v2(-343, -74.3)
            },
            download: {
                position: cc.v2(-272, -175.6),
                width: 419,
                height: 187,
                children: {
                    btn: {
                        position: cc.v2(85.6, 3.7),
                        width: 213,
                        height: 63
                    },
                    logo: {
                        position: cc.v2(-104.253, -14.776),
                        width: 136,
                        height: 136
                    },
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            guide: {
                children: {
                    mask: {
                        position: cc.v2(212, 0),
                    },
                    money: {
                        position: cc.v2(223, 0)
                    },
                    hand: {
                        position: cc.v2(288, 67)
                    },
                    play: {
                        position: cc.v2(220, 106)
                    },
                    notification1: {
                        position: cc.v2(0, 329)
                    },
                    notification2: {
                        position: cc.v2(0, 329)
                    },
                    congrat: {
                        width: 603,
                        height: 1170,
                        position: cc.v2(0, 0),
                        angle: 90
                    },
                    winPrize: {
                        position: cc.v2(211.312, -81.166)
                    },
                    congratBlur: {
                        // width: 293,
                        // height: 634.4,
                        // position: cc.v2(0, 0),
                        width: 603,
                        height: 1170,
                        position: cc.v2(0, 0),
                        angle: 90
                    },
                    ppCard: {
                        position: cc.v2(208, -114)
                    }
                }
            },
            wallet: {
                position: cc.v2(-272, 23),
                // spriteFrame: 'ppTopH',
                children: {
                    paypal: {
                        position: cc.v2(-158.331, 160.816)
                    },
                    pp: {
                        scale: 0.762,
                        position: cc.v2(-8.396, 166.53)
                    },
                    progress: {
                        scale: 0.75,
                        position: cc.v2(-5.577, 84.991)
                    }
                }
            }
        }
        this.VerticalConfig = {
            background: {
                position: cc.v2(0, 0),
                width: 540,
                height: 1169.3,
                angle: 0,
            },
            grid: {
                position: cc.v2(-250, -263.3),
            },
            effect: {
                position: cc.v2(-250, -250),
            },
            audioBtn: {
                position: cc.v2(0, 269.4)
            },
            score: {
                position: cc.v2(-197.58, 268.9)
            },
            grade: {
                position: cc.v2(-130.1, 271)
            },
            download: {
                position: cc.v2(0, -366),
                width: 556,
                height: 248,
                children: {
                    btn: {
                        position: cc.v2(95.7, -9.7),
                        width: 247,
                        height: 73
                    },
                    logo: {
                        position: cc.v2(-140, -21),
                        width: 173,
                        height: 173
                    },
                    adsonly: {
                        active: this.isApplovin ? true : false
                    }
                }
            },
            guide: {
                children: {
                    mask: {
                        position: cc.v2(0, -13.3),
                    },
                    money: {
                        position: cc.v2(0, 0)
                    },
                    hand: {
                        position: cc.v2(75, 67)
                    },
                    play: {
                        position: cc.v2(41.3, 81.4)
                    },
                    notification1: {
                        position: cc.v2(0, 536)
                    },
                    notification2: {
                        position: cc.v2(0, 536)
                    },
                    congrat: {
                        width: 603,
                        height: 1170,
                        position: cc.v2(0, 0),
                        angle: 0
                    },
                    winPrize: {
                        position: cc.v2(0, -81.166)
                    },
                    congratBlur: {
                        width: 603,
                        height: 1170,
                        position: cc.v2(0, 0),
                        angle: 0
                    },
                    ppCard: {
                        position: cc.v2(0, -150)
                    }
                }
            },
            wallet: {
                position: cc.v2(0, 434),
                // spriteFrame: 'ppTopV',
                children: {
                    paypal: {
                        position: cc.v2(-208.331, -10.816)
                    },
                    pp: {
                        scale: 1,
                        position: cc.v2(0, -27)
                    },
                    progress: {
                        scale: 1,
                        position: cc.v2(0, -123)
                    }
                }
            }
        }

        //格子参数
        this.cells = null; // cellModel List

        // this.cellBgs = null;
        this.lastPos = cc.v2(-1, -1);
        this.lastClickTime = null; //上一次点击的时间,用来优化双击的时间距离

        this.cellTypeNum = 5; //方块种类，有5种方块
        this.cellCreateType = [1, 2, 3, 4, 5]; // 生成种类只在这个数组里面查找
        this.cellCrushCount = {}; // 类型方块消除计数 key: CELL_TYPE  value: Number

        this.curGuideStep = 0;
        this.curGuideFunc = null;
        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        this.canPlaySkillEffect = true;
        this.canPlaySkillAudio =true;//只能播放一次成功音效 

        this.guideScript = null;
        this.gridScript = null;
        // this.toolBar = cc.find('Canvas/center/toolBarBox/toolBar');
        // this.fix= cc.find('Canvas/center/fix');
        // 游戏顺序
        this.ORDER = {
            A: 'a',
            B: 'b',
            C: 'c',
            D: 'd',
        };
        this.curOrder = this.ORDER.A; // 目前游戏进行到哪个顺序了
        // 不同引导步骤对应的提示手坐标
        this.guidePosition = {
            [this.ORDER.A]: { // 第一次点击格子
                landscape: cc.v2(238, 217),
                portrait: cc.v2(25, 217)
            },
            [this.ORDER.B]: { // 第二次点击格子
                landscape: cc.v2(138, -80),
                portrait: cc.v2(-80,-90)
            },
            [this.ORDER.C]: { // 第三次点击
                landscape: cc.v2(-12, -230),
                portrait: cc.v2(-230,-240)
            },
            [this.ORDER.D]: { // 提现按钮
                landscape: cc.v2(-190, -45),
                portrait: cc.v2(211, 340)
            }
        };
        // 不同引导步骤对应的应提示的格子下标, x:第几列，y:第几行
        this.guideCellPos = {
            [this.ORDER.A]: cc.v2(5, 10),
            [this.ORDER.B]: cc.v2(4, 4),
        };
        // 游戏规则
        this.gameRules = {
            [this.ORDER.A]: {
                money: 100, // 收获金额
                // limitArea: [ // 只允许点击一下格子
                //     {x: 5, y: 10},
                //     {x: 6, y: 10},
                //     {x: 5, y: 9},
                //     {x: 6, y: 9},
                // ]
            },
            [this.ORDER.B]: {
                money: 100
            },
            [this.ORDER.C]: {
                money: 100
            },
            [this.ORDER.D]: {
                money: 100
            }
        }
        /**游戏进行顺序*/
        this.guideList = [
            (cb) => {
                // 第零步引导，出现提现卡片
                // this.guideScript.showMoneyCard(25); // 显示金额卡，设置金额为25元
                setTimeout(() => {
                    this.gameController.gridScript.effectView.showClickHand();
                }, 800);
                this.curGuideStep++; //1
                // this.curOrder = this.ORDER.B;
            },
            (cb) => {
                // 第一步引导，显示引导手，开始格子提示
                // 爆炸区域提示
                let tipModels = this.getTipArea(this.getLeftBombAreas(), TIP_STRATEGY.AREA, this.guideCellPos[this.curOrder]);
                // this.gridScript.setTipModels(tipModels);
                // this.gridScript.showTip(tipModels);
                this.HorizontalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].landscape;
                this.VerticalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].portrait;
                let orient = this.isLandscape ? 'landscape' : 'portrait';
                // this.guideScript.setHandPos(this.guidePosition[this.curOrder][orient]);
                // this.guideScript.showHand();
                // this.guideScript.showPlay(); // 邀请试玩文字
                this.curGuideStep++; //2
            },
            (cb) => {
                this.curOrder = this.ORDER.B;
                // 第二步，重置引导手位置，自定义需要提示的格子,开启倒计时提示功能
                let tipModels = this.getTipArea(this.getLeftBombAreas(), TIP_STRATEGY.AREA, this.guideCellPos[this.curOrder]);
                this.gridScript.setTipModels(tipModels);
                this.HorizontalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].landscape;
                this.VerticalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].portrait;
                let orient = this.isLandscape ? 'landscape' : 'portrait';
                this.guideScript.setHandPos(this.guidePosition[this.curOrder][orient]);
                this.gridScript.startCounting();
                this.curGuideStep++; //3
            },
            (cb) => {
                // 第三步，重置引导手位置，自定义需要提示的格子,开启倒计时提示功能
                this.curOrder = this.ORDER.C;
                this.curGuideStep++; //4
                let orient = this.isLandscape ? 'landscape' : 'portrait';
                this.HorizontalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].landscape;
                this.VerticalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].portrait;
                this.guideScript.setHandPos(this.guidePosition[this.curOrder][orient]);
                this.gridScript.startCounting();
            },
            (cb) => {
                // 第四步，重置引导手位置到提现，禁止点击格子
                this.curOrder = this.ORDER.D;
                let orient = this.isLandscape ? 'landscape' : 'portrait';
                this.HorizontalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].landscape;
                this.VerticalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].portrait;
                this.guideScript.setHandPos(this.guidePosition[this.curOrder][orient]);
                this.gridScript.disableTouch();
                setTimeout(() => {this.guideScript.showHand();}, 1200);
                this.curGuideStep++; //5
            },
            (cb) => {
                // 第五步，重置引导手位置到通知消息，
                this.curOrder = this.ORDER.D;
                this.HorizontalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].landscape;
                this.VerticalConfig.guide.children.hand.position = this.guidePosition[this.curOrder].portrait;
                let orient = this.isLandscape ? 'landscape' : 'portrait';
                this.guideScript.setHandPos(this.guidePosition[this.curOrder][orient]);
                // this.guideScript.showNotification();
                this.curGuideStep++; //6
            }
        ];
    }

    //初始化游戏模型
    gameInit() {
        this.cells = []; //所有格子的模型，
        // this.sands = []; //所有沙子的模型
        // this.sandsNum = 9; //沙子的数量

        // //格子的初始化参数（里面存的是格子的类型type）
        // let cellInitConf = [
        //     [3, 3, 2, 3, 3, 5, 2, 3, 1, 1], // 最底下的一行
        //     [2, 1, 3, 1, 5, 2, 5, 1, 1, 1],
        //     [5, 4, 5, 2, 4, 5, 1, 1, 1, 1],
        //     [5, 2, 4, 4, 2, 4, 1, 2, 1, 1],
        //     [2, 3, 2, 1, 4, 3, 2, 2, 1, 1],
        //     [3, 5, 1, 5, 4, 1, 2, 3, 1, 1],
        //     [3, 1, 4, 3, 1, 2, 5, 2, 1, 1],
        //     [2, 4, 3, 4, 2, 4, 1, 4, 1, 1],
        //     [1, 3, 3, 4, 5, 5, 5, 4, 1, 3],
        //     [1, 4, 3, 4, 2, 2, 1, 5, 3, 3]  // 最顶上的一行
        // ];// 最左边
        //格子的初始化参数（里面存的是格子的类型type）
        let cellInitConf = [
            [3, 3, 2, 2, 2, 2, 2, 2, 3, 3], // 最底下的一行
            [3, 2, 2, 2, 4, 4, 2, 2, 2, 3],
            [2, 2, 2, 4, 4, 4, 4, 2, 2, 2],
            [2, 2, 4, 4, 1, 1, 4, 4, 2, 2],
            [2, 4, 4, 1, 1, 1, 1, 4, 4, 2],
            [4, 4, 4, 1, 1, 1, 1, 4, 4, 4],
            [4, 4, 4, 4, 1, 1, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [2, 4, 4, 4, 5, 5, 4, 4, 4, 2],
            [2, 2, 4, 4, 5, 5, 4, 4, 2, 2]  // 最顶上的一行
        ];// 最左边

        //格子的初始化金币参数（格子里有没有金币）
        let cellInitCoin = [
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // 最底下的一行
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]  // 最顶上的一行
        ];// 最左边

        for (var i = 1; i <= GRID_WIDTH; i++) { //
            this.cells[i] = [];
            for (var j = 1; j <= GRID_HEIGHT; j++) { //
                this.cells[i][j] = new CellModel(); //新生产一个星星模型
            }
        } // 生成10*10个星星模型，这些模型的位置现在都是(1,1)

        // cells[0][0]不存放元素，所有0号下标都不存放元素
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                this.cells[i][j].init(cellInitConf[i - 1][j - 1]); //按照参数生成一个格子模型
                this.cells[i][j].setHasGold(cellInitCoin[i - 1][j - 1] ? true : false); //按照参数设置金币
                //传进来的点顺序 （1,1），（1,2），（1,3），...（2,1），（2,2）...
                this.cells[i][j].setXY(j, i); //设置星星初始位置。 

                //因为在显示视图里面，每个星星的位置下标是这样子的：
                //cells[9]= //[(1,9)(2,9)(3,9)...(9,9)]
                //cells[n]= //.
                //cells[2]= //.
                //cells[1]= //[(1,1)(2,1)(3,1)...(9,1)]

                this.cells[i][j].setStartXY(j, i); //设置星星开始移动的位置？
            }
        }

        // let sandConf = [
        //     [3, 3],
        //     [3, 4],
        //     [3, 5],
        //     [4, 3],
        //     [4, 4],
        //     [4, 5],
        //     [5, 3],
        //     [5, 4],
        //     [5, 5]
        // ];
        // //this.sands和this.cells的构造是一样的
        // for (var i = 1; i <= GRID_WIDTH; i++) {
        //     this.sands[i] = [];
        // }
        // for (var i = 0; i < sandConf.length; i++) {
        //     this.sands[sandConf[i][1]][sandConf[i][0]] = new SandModel(sandConf[i][0], sandConf[i][1]); //传入沙子的x,y
        // }


    }

    // 设置通知的位置,要让通知在屏幕顶部
    setNotificationPos (screen) {
        // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
        // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
        // let long = screen.height > screen.width ? screen.height : screen.width;
        // let short = screen.height > screen.width ? screen.width : screen.height;
        // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
        // let y = this.guideScript.notification1.height/2 + _screenH;
        // this.VerticalConfig.guide.children.notification1.position = cc.v2(0, y);
        // this.VerticalConfig.guide.children.notification2.position = cc.v2(0, y);
        // this.guidePosition[this.ORDER.D].portrait.y = y-this.guideScript.notification1.height;
    }

    // 重新设置通知的位置
    resetNotificationPos (moveY) {
        // let _pos = this.HorizontalConfig.guide.children.notification2.position;
        // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
        // _pos = this.VerticalConfig.guide.children.notification2.position;
        // this.VerticalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
    }

    // 随机生成一个类型
    getRandomCellType() {
        // 略微提高贝壳出现的概率
        var index = Math.floor(Math.random() * (this.cellTypeNum + 1));
        if (index == this.cellTypeNum) {
            index = 3;
        }
        // console.log(index);
        // var index = Math.floor(Math.random() * this.cellTypeNum);
        return this.cellCreateType[index];
    }

    /**获取不同方向的位置参数 */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    /**拿到游戏规则 */
    getGameRules () {
        return this.gameRules[this.curOrder];
    }

    /**拿到所有格子的模型 */
    getCellsModel() {
        return this.cells;
    }

    // /**拿到所有沙子的模型 */
    // getSandsModel() {
    //     return this.sands;
    // }

    // nextGuideStep() {
    //     this.curGuideStep++;
    // }

    setGridView(gridScript) {
        this.gridScript = gridScript;
    }

    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    setGameController (gameController) {
        this.gameController = gameController;
    }

    /**
     * 点击某个格子之后，要进行的数据处理
     * 返回需要爆炸的格子模型数组
     * @param {*} pos {x, y} 选中格子的行列位置
     */
    selectCell(pos) {
        let bombModels = []; // 需要爆炸的格子模型(cellModel)
        // 如果点击的不是空格子，就去计算周围有没有同类格子
        if(this.cells[pos.y][pos.x].type !== CELL_TYPE.EMPTY){
            let bombCount = this.getBombArea(this.cells, pos, bombModels);
        }
        let resultModels = JSON.parse(JSON.stringify(bombModels));
        // console.log('gameModel selectCell count', bombCount, ' resultModels', resultModels);
        return resultModels; // 返回一个深拷贝的结果
    }

    /**
     * 计算爆炸的区域
     * 需要爆炸的格子模型(cellModel)会存在resultModels
     * @param {*} cells 所有格子模型
     * @param {*} pos 初始格子的位置
     * @param {*} resultModels 结果数组
     * @return 有多少格子需要爆炸，如果结果为1，说明它周围没有同类格子
     */
    getBombArea(cells, pos, resultModels) {
        // let x = pos.y;
        // let y = pos.x;
        let count = 0;
        if(resultModels.indexOf(cells[pos.y][pos.x])===-1){
            resultModels.push(cells[pos.y][pos.x]);
            ++count;
        }
        //上
        if(pos.y < GRID_HEIGHT){
            //当前这个和上一个相同
            if(cells[pos.y][pos.x].type===cells[pos.y+1][pos.x].type){
                //上一个还没加进数组
                if(resultModels.indexOf(cells[pos.y+1][pos.x])===-1){
                    resultModels.push(cells[pos.y+1][pos.x]);
                    ++count;
                    count += this.getBombArea(cells, {x: pos.x, y: pos.y+1}, resultModels);
                }
            }
        }
        //下
        if(pos.y > 1){
            if(cells[pos.y][pos.x].type===cells[pos.y-1][pos.x].type){
                if(resultModels.indexOf(cells[pos.y-1][pos.x])===-1){
                    resultModels.push(cells[pos.y-1][pos.x]);
                    ++count;
                    count += this.getBombArea(cells, {x: pos.x, y: pos.y-1}, resultModels);
                }
            }
        }
        //左
        if(pos.x > 1){
            if(cells[pos.y][pos.x].type===cells[pos.y][pos.x-1].type){
                if(resultModels.indexOf(cells[pos.y][pos.x-1])===-1){
                    resultModels.push(cells[pos.y][pos.x-1]);
                    ++count;
                    count += this.getBombArea(cells, {x: pos.x-1, y: pos.y}, resultModels);
                }
            }
        }
        //右
        if(pos.x < GRID_WIDTH){
            if(cells[pos.y][pos.x].type===cells[pos.y][pos.x+1].type){
                if(resultModels.indexOf(cells[pos.y][pos.x+1])===-1){
                    resultModels.push(cells[pos.y][pos.x+1]);
                    ++count;
                    count += this.getBombArea(cells, {x: pos.x+1, y: pos.y}, resultModels);
                }
            }
        }
        return count;
    }

    /**
     * 计算需要移动的格子,计算完之后，this.cells会发生相应的改变
     * @param {*} bombModels 将要爆炸的格子
     * @param {*} downModels 需要下移的格子
     * @param {*} leftModels 需要左移的格子
     */
    calculateMoveModels (bombModels, downModels, leftModels) {
        // 先在格子模型数组中把爆炸掉的格子类型设置为空
        if(bombModels.length<=1) return;
        bombModels.forEach(cell => {
            this.cells[cell.y][cell.x].type = CELL_TYPE.EMPTY;
        });
        // console.log('gameModel calcu, cells,', this.cells);
        //先检查每一列有没有空格子
        let moveLeftStep = 0; // 左边空格子个数
        for(let x=1; x<=GRID_WIDTH; x++){ // colum
            let moveDownStep = 0; // 下面空格子个数
            for(let y=1; y<=GRID_HEIGHT; y++){ // row
                // 格子在视图中位置(x,y),格子在模型中的下标(y,x)
                // 视图中 每一列从底到顶，检查每一行（格）是否为空
                // 如果当前格子为空
                if (this.cells[y][x].type === CELL_TYPE.EMPTY) {
                    // 上面的格子需要下移的步数加一
                    moveDownStep++;
                    // console.log('gameModel calcu,', `cells[${y}][${x}] type${this.cells[y][x].type} step`);
                    // 如果一整列的格子都是空
                    if (moveDownStep===GRID_HEIGHT) {
                        // 右边的格子需要左移的步数加一
                        moveLeftStep++;
                    }
                } else {
                    // 如果格子不为空，但是它的底下有空格子,那它需要下落
                    if (moveDownStep>0) {
                        // 深拷贝一份格子模型
                        let needMoveCell = JSON.parse(JSON.stringify(this.cells[y][x]));
                        // 设置移动参数
                        needMoveCell.moveCmd = {
                            step: moveDownStep,
                            direction: DIRECTION.DOWN
                        };
                        // 放到待下落格子数组里去
                        downModels.push(needMoveCell);
                        // 修改格子模型数组，将需要下落的格子放到正确的位置，原来的位置的格子置为空
                        let newY = y-moveDownStep;
                        this.cells[newY][x] = JSON.parse(JSON.stringify(this.cells[y][x]));
                        this.cells[newY][x].y = newY;
                        this.cells[y][x].type = CELL_TYPE.EMPTY;
                    }
                    // 如果格子下移完之后，左边还有空列(一整列都是空格子),那它需要左移
                    if (moveLeftStep>0) {
                        // 深拷贝一份格子模型(这个格子是下落完之后格子的位置)
                        let newY = y-moveDownStep;
                        let newX = x-moveLeftStep;
                        let needMoveCell = JSON.parse(JSON.stringify(this.cells[newY][x]));
                        // 设置移动参数
                        needMoveCell.moveCmd = {
                            step: moveLeftStep,
                            direction: DIRECTION.LEFT
                        };
                        leftModels.push(needMoveCell);
                        // 修改格子模型，将需要左移的格子放到正确的位置,原来位置的格子置为空
                        this.cells[newY][newX] = JSON.parse(JSON.stringify(this.cells[newY][x]));
                        this.cells[newY][newX].x = newX;
                        this.cells[newY][x].type = CELL_TYPE.EMPTY;
                    }
                }
            }
        }
    }

    /**
     * 计算剩余还可以爆炸的区域
     */
    getLeftBombAreas () {
        let bombAreas = [];
        //遍历每一列
        for (let x=1; x<=GRID_WIDTH; x++) {
            //遍历每一列的从底到顶
            for (let y=1; y<=GRID_HEIGHT; y++) {
                // console.log(`model(${x},${y} type ${this.cells[y][x].type})`);
                if ( !this.cells[y][x] || this.cells[y][x].type === CELL_TYPE.EMPTY ) {
                    // 如果是某一列的第一个为空，那它后面所有列都是空，就不用遍历后面的列了
                    if (y===1) {
                        x = GRID_WIDTH+1; // 直接把遍历条件加到最大，跳出此次循环
                    } else {
                        // 如果是某一列的非第一个为空，那它上面所有行都是空，就不用遍历这一列剩下的几行了
                        y = GRID_HEIGHT+1; // 直接把遍历条件加到最大，跳出此次循环
                    }
                } else {
                    // 检查当前格子是否已经在爆炸区域数组里面，避免重复计算
                    let bombIndex = bombAreas.findIndex(area => {
                        return area.indexOf(this.cells[y][x]) !== -1;
                    });
                    // 当前格子不在已有的爆炸区域里，说明需要检查它
                    if (bombIndex === -1) {
                        let bombModels = [];
                        this.getBombArea(this.cells, cc.v2(x,y), bombModels);
                        if (bombModels.length>1) {
                            bombAreas.push(bombModels);
                        }
                    }
                }
            }
        }
        // console.log('gamemodel left areas：',bombAreas);
        return bombAreas;
    }

    /**
     * 计算需要提示的区域
     * @param {*} bombAreas 所有可以爆炸的区域
     * @param {*} tipStrategy 提示策略
     * @param {*} posInArea 如果是第三种策略，找固定爆炸区域，就要传一个区域内的格子的坐标进来
     */
    getTipArea (bombAreas, tipStrategy, posInArea) {
        if (bombAreas.length===0) return [];
        let areaIndex = 0;
        let max = 0;
        // console.log('gamemodel, bombAreas', bombAreas);
        switch (tipStrategy) {
            case TIP_STRATEGY.MOST_COIN:
                // 找出金币最多的区域
                bombAreas.forEach((area, index) => {
                    let curCoin = 0;
                    area.forEach(cell => {
                        if (cell.hasGold) curCoin++;
                    });
                    if (curCoin>max) {
                        max = curCoin;
                        areaIndex = index;
                    }
                });
                if(max===0){
                    //如果都没有金币
                    return this.getTipArea(bombAreas, TIP_STRATEGY.MOST_GRADE);
                }else return bombAreas[areaIndex];
            case TIP_STRATEGY.MOST_GRADE:
                // 找出格子最多的区域（积分最多）
                bombAreas.forEach((area, index) => {
                    if (area.length>max) {
                        max = area.length;
                        areaIndex = index;
                    }
                });
                // console.log('gamemodel, tiparea', bombAreas[areaIndex]);
                return bombAreas[areaIndex];
            case TIP_STRATEGY.AREA:
                // 找出某个点所在区域的格子
                posInArea = posInArea || cc.v2(0, 0);
                bombAreas.forEach((area, index) => {
                    let has = area.findIndex(cell => {
                        if (cell.x===posInArea.x && cell.y===posInArea.y) return true;
                    });
                    if (has !== -1) {
                        areaIndex = index;
                    }
                });
                return bombAreas[areaIndex];
        }
    }

    /**
     * 点击某个格子之后，要进行的数据处理
     * @param {*} pos 选中格子的行列位置
     */
    // selectCell(pos) {
    //     this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作
    //     this.effectsQueue = []; // 星星消失，爆炸等特效
    //     var lastPos = this.lastPos;
    //     var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);

    //     let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子(需要判断是否双击)

    //     let isFirstClickBomb = (curClickCell.status == 'crab' || curClickCell.status == 'puffer') && lastPos.x == -1;

    //     if (delta > 1 || isFirstClickBomb) {
    //         //非相邻格子 且第一次点击螃蟹或河豚时
    //         this.lastClickTime = new Date();
    //         this.lastPos = pos;
    //         return [
    //             [],
    //             []
    //         ];
    //     }

    //     let lastClickCell = this.cells[lastPos.y][lastPos.x];
    //     // 上一次点击的格子

    //     let nowClickTime;
    //     // if (curClickCell.status == 'crab' || curClickCell.status == 'puffer') {
    //     //     nowClickTime = new Date();

    //     //     // if(!this.lastClickTime){
    //     //     //     nowClickTime-this.lastClickTime
    //     //     // }
    //     //     // this.lastClickTime = new Date();
    //     //     // console.log(this.lastClickTime);
    //     // }


    //     if (lastClickCell.x == curClickCell.x && lastClickCell.y == curClickCell.y) {
    //         if (curClickCell.status !== 'crab' && curClickCell.status !== 'puffer') {
    //             return [
    //                 [],
    //                 []
    //             ];
    //         }
    //         nowClickTime = new Date();
    //         if (nowClickTime.getTime() - this.lastClickTime.getTime() < 800) {//双击时间间隔小于800毫秒，属于双击
    //             // 双击时
    //             this.lastPos = cc.v2(-1, -1);
    //             var checkPoint = [pos];
    //             // 发生消除
    //             this.curTime = 0; // 动画播放的当前时间
    //             this.pushToChangeModels(curClickCell);

    //             this.processCrush(checkPoint);
    //             // setTimeout(this.updateProgress.bind(this), this.curTime*1000-800);
    //             // console.log('return', this.changeModels)
    //             return [this.changeModels, this.effectsQueue];
    //         }else{
    //             this.lastClickTime = nowClickTime;
    //             return [
    //                 [],
    //                 []
    //             ];
    //         }


    //     } else {
    //         // 非双击时
    //         this.exchangeCell(lastPos, pos);

    //         var result1 = this.checkPoint(pos.x, pos.y)[0];
    //         var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];

    //         this.curTime = 0; // 动画播放的当前时间
    //         this.pushToChangeModels(curClickCell);
    //         this.pushToChangeModels(lastClickCell);

    //         // 判断这两个是否有特殊方块
    //         let isCanBomb = curClickCell.status != CELL_STATUS.COMMON || lastClickCell.status != CELL_STATUS.COMMON;

    //         // let isCanBomb = false;
    //         if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
    //             //不会发生消除的情况
    //             // 交换回来
    //             this.exchangeCell(lastPos, pos);
    //             // 设置动画
    //             curClickCell.moveToAndBack(lastPos);
    //             lastClickCell.moveToAndBack(pos);

    //             this.lastPos = cc.v2(-1, -1);
    //             return [this.changeModels];
    //         } else {
    //             this.lastPos = cc.v2(-1, -1);
    //             // 设置动画
    //             curClickCell.moveTo(lastPos, this.curTime);
    //             lastClickCell.moveTo(pos, this.curTime);
    //             var checkPoint = [pos, lastPos];
    //             this.curTime += ANITIME.TOUCH_MOVE;
    //             // 发生消除
    //             this.processCrush(checkPoint);
    //             // setTimeout(this.updateProgress.bind(this), this.curTime*1000-800);
    //             // console.log('GameModel',this.curTime);
    //             return [this.changeModels, this.effectsQueue];
    //         }
    //     }

    // }

    // updateProgress(){
    //     this.gridScript.updateProgress();
    // }


    // 消除
    processCrush(checkPoint) {
        let cycleCount = 0;
        while (checkPoint.length > 0) {
            let bombModels = [];
            // console.log(checkPoint, bombModels);
            if (cycleCount == 0 && checkPoint.length == 1) { //螃蟹和河豚的双击引爆
                let pos1 = checkPoint[0];
                let model1 = this.cells[pos1.y][pos1.x];
                // model1.direction = 'H'
                bombModels.push(model1);

            } else if (cycleCount == 0 && checkPoint.length == 2) { // 其他
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];


                if (model1.status == CELL_STATUS.HORSE || model2.status == CELL_STATUS.HORSE) {
                    // 河马
                    if (pos1.x == pos2.x) {
                        // 水平移动 河马横向引爆
                        if (model1.status == CELL_STATUS.HORSE) {
                            model1.direction = 'v'; // 设置爆炸的方向 h和v
                            bombModels.push(model1);
                        } else {
                            model2.direction = 'v'; // 设置爆炸的方向 h和v
                            bombModels.push(model2);
                        }
                        // model1.type = model2.type;
                    } else {
                        // 竖向移动 河马竖向引爆
                        if (model1.status == CELL_STATUS.HORSE) {
                            model1.direction = 'h'; // 设置爆炸的方向 h和v
                            bombModels.push(model1);
                        } else {
                            model2.direction = 'h'; // 设置爆炸的方向 h和v
                            bombModels.push(model2);
                        }

                    }

                } else if (model1.status == CELL_STATUS.CRAB || model2.status == CELL_STATUS.CRAB) {
                    // 螃蟹
                    if (model1.status == CELL_STATUS.CRAB) {
                        bombModels.push(model1);
                    } else {
                        bombModels.push(model2);
                    }
                } else if (model1.status == CELL_STATUS.PUFFER || model2.status == CELL_STATUS.PUFFER) {
                    // 河豚
                    if (model1.status == CELL_STATUS.PUFFER) {
                        bombModels.push(model1);
                    } else {
                        bombModels.push(model2);
                    }
                }
            }

            for (var i in checkPoint) {
                var pos = checkPoint[i];
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                var [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);
                // 检查每一个点的结果
                if (result.length < 3) {
                    continue;
                }
                for (var j in result) {
                    var model = this.cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(pos, newCellStatus, newCellType);

            }
            // console.log(bombModels);
            this.processBomb(bombModels, cycleCount);
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
    }

    /**
     * 三叉戟消除全屏单种元素
     * @param {Number} type 要清除元素的ID
     */
    crushAllEle(type) {

        this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 星星消失，爆炸等特效
        let cycleCount = 0;
        // 遍历全屏消除所有对应的type
        // let crushCount = 0;
        this.curTime = 0;
        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cells[i][j] && this.cells[i][j].type == type) {
                    let model = this.cells[i][j];
                    // crushCount++;
                    this.addThunder(this.curTime, cc.v2(model.x, model.y))
                    this.crushCell(model.x, model.y, true, cycleCount);
                    // 添加一道闪电
                }
            }
        }
        this.curTime += ANITIME.DIE_SHAKE;
        // this.curTime += ANITIME.DIE_SHAKE;
        let checkPoint = this.down();
        while (checkPoint.length > 0) {
            // 三叉戟不会触发爆炸元素
            for (var i in checkPoint) {
                var pos = checkPoint[i];
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                var [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);
                // 检查每一个点的结果
                if (result.length < 3) {
                    continue;
                }
                for (var j in result) {
                    var model = this.cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                }
                this.createNewCell(pos, newCellStatus, newCellType);
            }
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
        return [this.changeModels, this.effectsQueue];
    }
    /**清除所有格子的命令 */
    cleanCmd() {
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
        // console.log(this.cellCrushCount['4']);
    }

    /**
     * 交换格子
     * @param {*} pos1 上一个格子
     * @param {*} pos2 当前格子
     */
    exchangeCell(pos1, pos2) {
        var tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }
    /**
     * 尝试交换格子,并没有真正交换
     * @param {*} cells 要在哪个格子模型上进行尝试
     * @param {*} pos1 上一个格子
     * @param {*} pos2 当前格子
     */
    tryExchangeCell(cells, pos1, pos2) {
        var tmpModel = cells[pos1.y][pos1.x];
        cells[pos1.y][pos1.x] = cells[pos2.y][pos2.x];
        cells[pos1.y][pos1.x].x = pos1.x;
        cells[pos1.y][pos1.x].y = pos1.y;
        cells[pos2.y][pos2.x] = tmpModel;
        cells[pos2.y][pos2.x].x = pos2.x;
        cells[pos2.y][pos2.x].y = pos2.y;
        return cells;
    }
    /**
     * 检查某个点，是否满足消除的条件
     * @param {*} x 
     * @param {*} y 
     * @returns [result：连在一起的点的行列坐标, newCellStatus：新生成的星星, this.cells[y][x].type]
     */
    checkPoint(x, y) {
        /**
         * 检查某个点的某个方位上 是否有连在一起的点
         * @param {*} x 
         * @param {*} y 
         * @param {*} direction 一组方向，cc.v2(1, 0)代表右，cc.v2(0, -1)代表下-
         */
        let checkWithDirection = function (x, y, direction) {
            let queue = []; //这个数组里面存放了一组位置，代表相连星星的位置
            let inQueue = []; //这个数组存放一组状态，记录某个位置是否已经在queue里面了，避免重复插入
            queue.push(cc.v2(x, y)); //将当前星星的位置放入queue数组
            inQueue[x + y] = true; //记录当前位置已放入queue数组
            let front = 0;
            while (front < queue.length) {
                let point = queue[front];
                let cellModel = this.cells[point.y][point.x]; //取出格子模型
                front++;
                if (!cellModel) {
                    continue;
                }
                for (let i = 0; i < direction.length; i++) { //每个子循环都判断一个方向上有几个星星相连
                    let tmpX = point.x + direction[i].x; //下一个点的x位置
                    let tmpY = point.y + direction[i].y; //下一个点的y
                    if (tmpX < 1 || tmpX > GRID_WIDTH //超出范围
                        ||
                        tmpY < 1 || tmpY > GRID_HEIGHT //超出范围
                        ||
                        inQueue[tmpX + tmpY] //下一个点已经放进queue里面了
                        ||
                        !this.cells[tmpY][tmpX] //下一个点不存在
                    ) {
                        continue; //退出当前循环
                    }
                    if (cellModel.type == this.cells[tmpY][tmpX].type) { //如果上|下|左|右的星星和当前的星星种类一样
                        queue.push(cc.v2(tmpX, tmpY)); //将和它类型一致的星星放进数组
                        inQueue[tmpX + tmpY] = true;
                    }
                }
            }
            return queue;
        }
        let rowResult = checkWithDirection.call(this, x, y, [cc.v2(1, 0), cc.v2(-1, 0)]); //检查这个点的左右方向 有没有连在一起的点
        let colResult = checkWithDirection.call(this, x, y, [cc.v2(0, -1), cc.v2(0, 1)]); //检查这个点的上下方向 有没有连在一起的点
        let result = [];
        let newCellStatus = ""; //组成的新星星的类型是什么
        if ((rowResult.length >= 4 && colResult.length >= 3) || (rowResult.length >= 3 && colResult.length >= 4)) {
            // 六个以上组成河豚炸弹
            newCellStatus = CELL_STATUS.PUFFER;
        } else if ((rowResult.length >= 5 || colResult.length >= 5) || (rowResult.length >= 3 && colResult.length >= 3)) {
            // 五个组成一只海马
            newCellStatus = CELL_STATUS.HORSE;
        } else if (rowResult.length >= 4 || colResult.length >= 4) {
            //如果有4个相同的星星连成一条线,组成一只蟹
            newCellStatus = CELL_STATUS.CRAB;
        }

        if (rowResult.length >= 3) {
            result = rowResult;
        }
        if (colResult.length >= 3) {
            let tmp = result.concat(); //concat数组合并，返回一个新数组
            //检查一下colResult的结果是不是已经在result(rowResult)里面了
            colResult.forEach(function (newEle) {
                let flag = false;
                tmp.forEach(function (oldEle) {
                    if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                        flag = true;
                        // break;
                    }
                }, this);
                //如果不在result里面，才放进result
                if (!flag) {
                    result.push(newEle);
                }
            }, this);
        }
        return [result, newCellStatus, this.cells[y][x].type];
    }

    /**
     * 将没放入changeModels的格子模型放进去
     * @param {*} model 
     */
    pushToChangeModels(model) {
        //如果传进来的格子还没放入this.changeModels的话
        if (this.changeModels.indexOf(model) == -1) this.changeModels.push(model);
    }
    // cell消除逻辑
    crushCell(x, y, needShake, step) {
        let model = this.cells[y][x];
        this.pushToChangeModels(model);
        if (needShake) {
            model.toShake(this.curTime)
        }
        // 种类消除计数

        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;

        model.toDie(this.curTime + shakeTime);
        // console.log('cell to die at'+this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), 'crush', step);
        this.cells[y][x] = null;
        // if (this.sandsNum > 0 && this.sands[y][x] != undefined && this.sands[y][x].isExist) {
        //     this.sands[y][x].isExist = false;
        //     this.sands[y][x].toDie(this.curTime + shakeTime); //设置沙子模型将要执行的动画
        //     // console.log('sand '+ x+','+y+'to die at'+this.curTime + shakeTime);
        //     // this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y),'sand', step);
        //     this.sands[y][x].sandView.updateView(); //让沙子模型执行动画，更新视图
        //     this.sandsNum--;
        // }
        // //沙子消除完毕，游戏结束
        // if (this.sandsNum == 0) {
        //     console.log('沙子都被消除完了');
        // }
    }
    /**
     * 计算各个种类消除的数量
     * @param {Number} type 消除的种类
     */
    countCrushType(type) {
        if (this.cellCrushCount[type]) {
            this.cellCrushCount[type]++
        } else {
            this.cellCrushCount[type] = 1;
        }
    }

    /**
     * 添加消除特效
     * @param {开始播放的时间} playTime 
     * @param {*cell位置} pos 
     * @param {*} action 指定消除动画
     * @param {*第几次消除，用于播放音效} step 
     * @param {*是否贝壳} isShell
     */
    addCrushEffect(playTime, pos, action, step) {
        this.effectsQueue.push({
            playTime,
            pos,
            action,
            step
        });
    }
    addRowBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "rowBomb"
        });
    }
    addColBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "colBomb"
        });
    }
    addCrabBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "crabBomb"
        });
    }
    addWarpBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "warpBomb"
        });
    }
    addThunder(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "thunder"
        });
    }

    /**
     * 生成新的cell
     * @param {*} pos 
     * @param {*} status 
     * @param {*} type 
     */
    createNewCell(pos, status, type) {
        if (status == "") {
            return;
        }
        if (status == CELL_STATUS.CRAB) {
            type = CELL_TYPE.CRAB
        } else if (status == CELL_STATUS.HORSE) {
            type = CELL_TYPE.HORSE
        } else if (status == CELL_STATUS.PUFFER) {
            type = CELL_TYPE.PUFFER
        }

        let model = new CellModel();
        this.cells[pos.y][pos.x] = model
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
    }

    processBomb(bombModels, cycleCount) {
        var i = 0;
        while (bombModels.length > 0) {
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombModels.forEach(function (model) {
                if (model.status == CELL_STATUS.HORSE) {
                    // 海马
                    let length = model.direction == 'h' ? GRID_WIDTH : GRID_HEIGHT;
                    for (let i = 1; i <= length; i++) {
                        if (model.direction == 'h') {
                            // 水平
                            if (this.cells[model.y][i]) {
                                if (this.cells[model.y][i].status != CELL_STATUS.COMMON && i != model.x) {
                                    this.cells[model.y][i].direction = 'v'
                                    newBombModel.push(this.cells[model.y][i]);
                                } else {
                                    this.crushCell(i, model.y, false, cycleCount);
                                }
                                this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
                            }
                        } else {
                            // 竖向消除
                            if (this.cells[i][model.x]) {
                                if (this.cells[i][model.x].status != CELL_STATUS.COMMON && i != model.y) {
                                    this.cells[i][model.x].direction = 'h'
                                    newBombModel.push(this.cells[i][model.x]);
                                } else {
                                    this.crushCell(model.x, i, false, cycleCount);
                                }
                                this.addColBomb(this.curTime, cc.v2(model.x, model.y));
                            }
                        }

                    }


                } else if (model.status == CELL_STATUS.CRAB) {
                    // 螃蟹
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (Math.abs(i) + Math.abs(j) < 2 && this.cells[model.y + j] && this.cells[model.y + j][model.x + i]) {
                                // 十字消除
                                if (this.cells[model.y + j][model.x + i].status != CELL_STATUS.COMMON && (i != 0 || j != 0)) {
                                    if (Math.abs(i) >= Math.abs(j)) {
                                        this.cells[model.y + j][model.x + i].direction = 'v'
                                    } else {
                                        this.cells[model.y + j][model.x + i].direction = 'h'
                                    }
                                    newBombModel.push(this.cells[model.y + j][model.x + i]);
                                } else {
                                    this.crushCell(model.x + i, model.y + j, false, cycleCount);
                                }
                                this.addCrabBomb(this.curTime, cc.v2(model.x, model.y));
                            }
                        }
                    }
                } else if (model.status == CELL_STATUS.PUFFER) {
                    // 河豚
                    for (let i = -3; i <= 3; i++) {
                        for (let j = -3; j <= 3; j++) {
                            if (Math.abs(i) + Math.abs(j) < 4 && this.cells[model.y + j] && this.cells[model.y + j][model.x + i]) {
                                // 范围消除
                                if (this.cells[model.y + j][model.x + i].status != CELL_STATUS.COMMON && (i != 0 || j != 0)) {
                                    if (Math.abs(i) >= Math.abs(j)) {
                                        this.cells[model.y + j][model.x + i].direction = 'v'
                                    } else {
                                        this.cells[model.y + j][model.x + i].direction = 'h'
                                    }
                                    newBombModel.push(this.cells[model.y + j][model.x + i]);
                                } else {
                                    this.crushCell(model.x + i, model.y + j, false, cycleCount);
                                }
                                this.addWarpBomb(this.curTime, cc.v2(model.x, model.y));
                            }
                        }
                    }
                }

            }, this);

            if (bombModels.length > 0) {
                this.curTime += bombTime;
            }
            bombModels = newBombModel;
        }
    }

    /**
     * 寻找提示
     */

    // 下落
    down() {
        let newCheckPoint = [];
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j] == null) {
                    var curRow = i;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        if (this.cells[k][j]) {
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(cc.v2(j, curRow), this.curTime);
                            curRow++;
                        }
                    }
                    var count = 1;
                    for (var k = curRow; k <= GRID_HEIGHT; k++) {
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].init(this.getRandomCellType());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(cc.v2(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }

                }
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        return newCheckPoint;
    }

    findTip() {
        let tipShell = [];
        let tipOthers = [];

        let cells = this.cells;
        let result;

        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {

                if (i + 1 <= GRID_HEIGHT) {//如果没有超界
                    result = this.trySelectCell(cells, cc.v2(j, i), cc.v2(j, i + 1))//尝试和上面的点进行交换

                    if (result.length >= 2) {//有连在一起的点
                        result.forEach(function (value) {
                            if (value.length >= 3) {
                                if (cells[value[0].y][value[0].x].type == CELL_TYPE.SHELL) {
                                    tipShell.push(value);
                                } else {
                                    tipOthers.push(value);
                                }
                            }
                        });
                        // endPosResult = result[0];//一个数组，里面是连在一起的点的坐标
                        // startPosResult = result[1];
                        // if (endPosResult.length >= 3) {
                        //     if (cells[i + 1][j].type == CELL_TYPE.SHELL) {
                        //         tipShell.push(endPosResult);
                        //     } else {
                        //         tipOthers.push(endPosResult);
                        //     }
                        // }
                        // if (startPosResult.length >= 3) {

                        // }
                    }
                    // var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
                    // console.log('up ',j,' ',i,changeModels);
                    // if(changeModels.length>2){//有连在一起的点
                    //     console.log('tip',cells[j][i], cells[j][i + 1]);
                    // }
                    //首要判断是不是能把贝壳连起来
                    // if (cells[j][i].type == CELL_TYPE.SHELL || cells[j][i + 1].type == CELL_TYPE.SHELL) {

                    // }
                    // return changeModels;
                }
                if (j + 1 <= GRID_WIDTH) {//如果没有超界
                    cells = this.cells.concat();
                    result = this.trySelectCell(cells, cc.v2(j, i), cc.v2(j + 1, i));//尝试和右边的点进行交换
                    if (result.length >= 2) {//有连在一起的点
                        result.forEach(function (value) {
                            if (value.length >= 3) {
                                if (cells[value[0].y][value[0].x].type == CELL_TYPE.SHELL) {
                                    tipShell.push(value);
                                } else {
                                    tipOthers.push(value);
                                }
                            }
                        });
                        // endPosResult = result[0];//一个数组，里面是连在一起的点的坐标
                        // startPosResult = result[1];
                        // if (endPosResult.length >= 3) {
                        //     if (cells[i + 1][j].type == CELL_TYPE.SHELL) {
                        //         tipShell.push(endPosResult);
                        //     } else {
                        //         tipOthers.push(endPosResult);
                        //     }
                        // }
                        // if (startPosResult.length >= 3) {

                        // }
                    }
                    // var changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
                    // console.log('right', j, ' ', i, changeModels);

                    // if (changeModels.length > 2) {//有连在一起的点
                    //     console.log('tip', cells[j][i], cells[j + 1][i]);
                    // }
                    // //首要判断是不是能把贝壳连起来
                    // if (cells[j][i].type == CELL_TYPE.SHELL || cells[j + 1][i].type == CELL_TYPE.SHELL) {

                    // }
                }

            }
        }
        //对结果数组进行排序
        let descend = function (a, b) {//降序
            return b.length - a.length;
        }
        tipShell.sort(descend);
        tipOthers.sort(descend);
        if (tipShell.length > 0) {//如果有连在一起的贝壳，优先提示贝壳
            return tipShell[0];
        } else {//如果没有，则提示其他的。
            return tipOthers[0];
        }
    }
    /**
     * 尝试寻找连在一起的点，尝试交换两个点
     * @param {*} oldCells 格子模型
     * @param {*} startPos 开始点
     * @param {*} endPos 结束点 
     * @returns [result1:endPos的连在一起的点,带有提示status;result2:startPos的连在一起的点，带有提示status]or[changeModels:没有连在一起的点]
     */
    trySelectCell(oldCells, startPos, endPos) {
        let cells = JSON.parse(JSON.stringify(oldCells));//拷贝一份cells模型的值，不改变原cells
        let changeModels = []; // 发生改变的model，将作为返回值，给view播动作
        // let effectsQueue = []; // 星星消失，爆炸等特效
        var lastPos = startPos;
        var delta = Math.abs(endPos.x - lastPos.x) + Math.abs(endPos.y - lastPos.y);

        let curClickCell = cells[endPos.y][endPos.x]; //当前点击的格子(需要判断是否双击)

        let isFirstClickBomb = (curClickCell.status == 'crab' || curClickCell.status == 'puffer') && lastPos.x == -1;

        if (delta > 1 || isFirstClickBomb) {
            //非相邻格子 且非双击螃蟹和河豚时
            lastPos = endPos;
            return [
                [],
                []
            ];
        }

        let lastClickCell = cells[lastPos.y][lastPos.x];

        let curTime;

        // 上一次点击的格子
        // console.log(curClickCell,lastClickCell);
        if (lastClickCell.x == curClickCell.x && lastClickCell.y == curClickCell.y) {
            // console.log('clean', changeModels);

            // // 双击时
            // // lastPos = cc.v2(-1, -1);
            // var checkPoint = [endPos];
            // // 发生消除
            // curTime = 0; // 动画播放的当前时间
            // this.tryPushToChangeModels(changeModels, curClickCell);

            // this.tryProcessCrush(cells, changeModels, checkPoint);
            // console.log('return', changeModels)
            // return [changeModels, effectsQueue];

        } else {
            // 非双击时
            cells = this.tryExchangeCell(cells, lastPos, endPos);
            var result1 = this.tryCheckPoint(cells, endPos.x, endPos.y)[0];
            var result2 = this.tryCheckPoint(cells, lastPos.x, lastPos.y)[0];

            curTime = 0; // 动画播放的当前时间
            this.tryPushToChangeModels(changeModels, curClickCell);
            this.tryPushToChangeModels(changeModels, lastClickCell);

            // 判断这两个是否有特殊方块
            let isCanBomb = curClickCell.status != CELL_STATUS.COMMON || lastClickCell.status != CELL_STATUS.COMMON;

            // let isCanBomb = false;
            if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
                //不会发生消除的情况
                // 交换回来
                cells = this.tryExchangeCell(cells, lastPos, endPos);
                // // 设置动画
                // curClickCell.moveToAndBack(lastPos);
                // lastClickCell.moveToAndBack(endPos);

                // lastPos = cc.v2(-1, -1);
                return [changeModels];
            } else {
                let new1 = [],
                    new2 = [];
                // console.log('trySelect,',result1,result2);
                if (result1.length >= 3) {
                    result1.forEach(function (value) {
                        var tmp = {
                            x: value.x,
                            y: value.y,
                            status: TIP.HERE
                        }
                        if (value.x == endPos.x && value.y == endPos.y) {//设置关键点的移动方向
                            tmp.x = lastPos.x;
                            tmp.y = lastPos.y;
                            tmp.status = TIP.UP;
                            if (endPos.x > startPos.x) {
                                tmp.status = TIP.RIGHT;
                            }
                        }
                        // console.log('tmp',tmp);
                        new1.push(tmp);
                    });
                }
                if (result2.length >= 3) {
                    result2.forEach(function (value) {
                        var tmp = {
                            x: value.x,
                            y: value.y,
                            status: TIP.HERE
                        }
                        if (value.x == startPos.x && value.y == startPos.y) {
                            tmp.x = endPos.x;
                            tmp.y = endPos.y;
                            tmp.status = TIP.DOWN;
                            if (endPos.x > startPos.x) {
                                tmp.status = TIP.LEFT;
                            }
                        }
                        // console.log('tmp',tmp);
                        new2.push(tmp);
                    });
                }
                // console.log('trySelect >=3', new1, new2);
                return [new1, new2];

                // // lastPos = cc.v2(-1, -1);
                // // 设置动画
                // curClickCell.moveTo(lastPos, this.curTime);
                // lastClickCell.moveTo(endPos, this.curTime);
                // var checkPoint = [endPos, lastPos];
                // curTime += ANITIME.TOUCH_MOVE;
                // // 发生消除
                // // this.tryProcessCrush(cells, changeModels, checkPoint);
                // return [changeModels, effectsQueue];
            }
        }

    }
    /**
     * 尝试检查某个点，是否满足消除的条件，用于寻找潜在的能连接点
     * @param {*} cells 需要检查的格子模型
     * @param {*} x 
     * @param {*} y 
     * @returns [result：连在一起的点的行列坐标, newCellStatus：新生成的星星, this.cells[y][x].type]
     */
    tryCheckPoint(cells, x, y) {
        /**
         * 检查某个点的某个方位上 是否有连在一起的点
         * @param {*} x 
         * @param {*} y 
         * @param {*} direction 一组方向，cc.v2(1, 0)代表右，cc.v2(0, -1)代表下
         */
        let checkWithDirection = function (x, y, direction) {
            let queue = []; //这个数组里面存放了一组位置，代表相连星星的位置
            let inQueue = []; //这个数组存放一组状态，记录某个位置是否已经在queue里面了，避免重复插入
            queue.push(cc.v2(x, y)); //将当前星星的位置放入queue数组
            inQueue[x + y] = true; //记录当前位置已放入queue数组
            let front = 0;
            while (front < queue.length) {
                let point = queue[front];
                let cellModel = cells[point.y][point.x]; //取出格子模型
                front++;
                if (!cellModel) {
                    continue;
                }
                for (let i = 0; i < direction.length; i++) { //每个子循环都判断一个方向上有几个星星相连
                    let tmpX = point.x + direction[i].x; //下一个点的x位置
                    let tmpY = point.y + direction[i].y; //下一个点的y
                    if (tmpX < 1 || tmpX > GRID_WIDTH //超出范围
                        ||
                        tmpY < 1 || tmpY > GRID_HEIGHT //超出范围
                        ||
                        inQueue[tmpX + tmpY] //下一个点已经放进queue里面了
                        ||
                        !cells[tmpY][tmpX] //下一个点不存在
                    ) {
                        continue; //退出当前循环
                    }
                    if (cellModel.type == cells[tmpY][tmpX].type) { //如果上|下|左|右的星星和当前的星星种类一样
                        queue.push(cc.v2(tmpX, tmpY)); //将和它类型一致的星星放进数组
                        inQueue[tmpX + tmpY] = true;
                    }
                }
            }
            return queue;
        }
        let rowResult = checkWithDirection.call(this, x, y, [cc.v2(1, 0), cc.v2(-1, 0)]); //检查这个点的左右方向 有没有连在一起的点
        let colResult = checkWithDirection.call(this, x, y, [cc.v2(0, -1), cc.v2(0, 1)]); //检查这个点的上下方向 有没有连在一起的点
        let result = [];
        let newCellStatus = ""; //组成的新星星的类型是什么
        if ((rowResult.length >= 4 && colResult.length >= 3) || (rowResult.length >= 3 && colResult.length >= 4)) {
            // 六个以上组成河豚炸弹
            newCellStatus = CELL_STATUS.PUFFER;
        } else if ((rowResult.length >= 5 || colResult.length >= 5) || (rowResult.length >= 3 && colResult.length >= 3)) {
            // 五个组成一只海马
            newCellStatus = CELL_STATUS.HORSE;
        } else if (rowResult.length >= 4 || colResult.length >= 4) {
            //如果有4个相同的星星连成一条线,组成一只蟹
            newCellStatus = CELL_STATUS.CRAB;
        }

        if (rowResult.length >= 3) {
            result = rowResult;
        }
        if (colResult.length >= 3) {
            let tmp = result.concat(); //concat数组合并，返回一个新数组
            //检查一下colResult的结果是不是已经在result(rowResult)里面了
            colResult.forEach(function (newEle) {
                let flag = false;
                tmp.forEach(function (oldEle) {
                    if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                        flag = true;
                        // break;
                    }
                }, this);
                //如果不在result里面，才放进result
                if (!flag) {
                    result.push(newEle);
                }
            }, this);
        }
        return [result, newCellStatus, cells[y][x].type];
    }
    /**
     * 尝试将没放入changeModels的格子模型放进去
     * @param {*} model 
     */
    /**
     * 尝试将格子模型放进某个changeModels去
     * @param {*} changeModels 
     * @param {*} model 
     */
    tryPushToChangeModels(changeModels, model) {
        //如果传进来的格子还没放入changeModels的话
        if (changeModels.indexOf(model) == -1) changeModels.push(model);
    }
    // 消除
    // tryProcessCrush(cells, changeModels, checkPoint) {
    //     // console.log('tryProCrush', checkPoint);
    //     let cycleCount = 0;
    //     while (checkPoint.length > 0) {
    //         let bombModels = [];
    //         // console.log(checkPoint, bombModels);
    //         if (cycleCount == 0 && checkPoint.length == 1) { //螃蟹和河豚的双击引爆
    //             let pos1 = checkPoint[0];
    //             let model1 = cells[pos1.y][pos1.x];
    //             // model1.direction = 'H'
    //             bombModels.push(model1);
    //         } else if (cycleCount == 0 && checkPoint.length == 2) { // 其他
    //             let pos1 = checkPoint[0];
    //             let pos2 = checkPoint[1];
    //             let model1 = cells[pos1.y][pos1.x];
    //             let model2 = cells[pos2.y][pos2.x];


    //             if (model1.status == CELL_STATUS.HORSE || model2.status == CELL_STATUS.HORSE) {
    //                 // 河马
    //                 if (pos1.x == pos2.x) {
    //                     // 水平移动 河马横向引爆
    //                     if (model1.status == CELL_STATUS.HORSE) {
    //                         model1.direction = 'v'; // 设置爆炸的方向 h和v
    //                         bombModels.push(model1);
    //                     } else {
    //                         model2.direction = 'v'; // 设置爆炸的方向 h和v
    //                         bombModels.push(model2);
    //                     }
    //                     // model1.type = model2.type;
    //                 } else {
    //                     // 竖向移动 河马竖向引爆
    //                     if (model1.status == CELL_STATUS.HORSE) {
    //                         model1.direction = 'h'; // 设置爆炸的方向 h和v
    //                         bombModels.push(model1);
    //                     } else {
    //                         model2.direction = 'h'; // 设置爆炸的方向 h和v
    //                         bombModels.push(model2);
    //                     }

    //                 }

    //             } else if (model1.status == CELL_STATUS.CRAB || model2.status == CELL_STATUS.CRAB) {
    //                 // 螃蟹
    //                 if (model1.status == CELL_STATUS.CRAB) {
    //                     bombModels.push(model1);
    //                 } else {
    //                     bombModels.push(model2);
    //                 }
    //             } else if (model1.status == CELL_STATUS.PUFFER || model2.status == CELL_STATUS.PUFFER) {
    //                 // 河豚
    //                 if (model1.status == CELL_STATUS.PUFFER) {
    //                     bombModels.push(model1);
    //                 } else {
    //                     bombModels.push(model2);
    //                 }
    //             }
    //         }

    //         for (var i in checkPoint) {
    //             var pos = checkPoint[i];
    //             if (!cells[pos.y][pos.x]) {
    //                 continue;
    //             }
    //             var [result, newCellStatus, newCellType] = this.tryCheckPoint(cells, pos.x, pos.y);
    //             // 检查每一个点的结果
    //             if (result.length < 3) {
    //                 continue;
    //             }
    //             for (var j in result) {
    //                 var model = cells[result[j].y][result[j].x];
    //                 this.tryCrushCell(cells, changeModels, result[j].x, result[j].y, false, cycleCount);
    //                 if (model.status != CELL_STATUS.COMMON) {
    //                     bombModels.push(model);
    //                 }
    //             }
    //             this.tryCreateNewCell(cells, changeModels, pos, newCellStatus, newCellType);

    //         }
    //         // console.log(bombModels);
    //         this.tryProcessBomb(cells, changeModels, bombModels, cycleCount);
    //         this.curTime += ANITIME.DIE;
    //         checkPoint = this.down();
    //         cycleCount++;
    //     }
    // }
    // cell消除逻辑
    tryCrushCell(cells, changeModels, x, y, needShake, step) {
        let model = cells[y][x];
        this.tryPushToChangeModels(changeModels, model);
        if (needShake) {
            model.toShake(this.curTime)
        }
        // 种类消除计数
        // this.countCrushType(model.type);


        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        // console.log('cell to die at'+this.curTime + shakeTime);
        // this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), 'crush', step);
        cells[y][x] = null;

        // if (this.sandsNum > 0 && this.sands[y][x] != undefined && this.sands[y][x].isExist) {
        //     this.sands[y][x].isExist = false;
        //     this.sands[y][x].toDie(this.curTime + shakeTime); //设置沙子模型将要执行的动画
        //     // console.log('sand '+ x+','+y+'to die at'+this.curTime + shakeTime);
        //     // this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y),'sand', step);
        //     this.sands[y][x].sandView.updateView(); //让沙子模型执行动画，更新视图
        //     this.sandsNum--;
        // }
        // //沙子消除完毕，游戏结束
        // if (this.sandsNum == 0) {
        //     console.log('沙子都被消除完了');
        // }

    }
    /**
     * 尝试生成新的cell
     * @param {*} cells 
     * @param {*} changeModels 
     * @param {*} pos 
     * @param {*} status 
     * @param {*} type 
     */
    // tryCreateNewCell(cells, changeModels, pos, status, type) {
    //     if (status == "") {
    //         return;
    //     }
    //     if (status == CELL_STATUS.CRAB) {
    //         type = CELL_TYPE.CRAB
    //     } else if (status == CELL_STATUS.HORSE) {
    //         type = CELL_TYPE.HORSE
    //     } else if (status == CELL_STATUS.PUFFER) {
    //         type = CELL_TYPE.PUFFER
    //     }

    //     let model = new CellModel();
    //     cells[pos.y][pos.x] = model
    //     model.init(type);
    //     model.setStartXY(pos.x, pos.y);
    //     model.setXY(pos.x, pos.y);
    //     model.setStatus(status);
    //     model.setVisible(0, false);
    //     model.setVisible(this.curTime, true);
    //     changeModels.push(model);
    // }
    // TODO bombModels去重
    // tryProcessBomb(cells, changeModels, bombModels, cycleCount) {
    //     var i = 0;
    //     while (bombModels.length > 0) {
    //         let newBombModel = [];
    //         let bombTime = ANITIME.BOMB_DELAY;
    //         bombModels.forEach(function (model) {
    //             if (model.status == CELL_STATUS.HORSE) {
    //                 // 海马
    //                 let length = model.direction == 'h' ? GRID_WIDTH : GRID_HEIGHT;
    //                 for (let i = 1; i <= length; i++) {
    //                     if (model.direction == 'h') {
    //                         // 水平
    //                         if (cells[model.y][i]) {
    //                             if (cells[model.y][i].status != CELL_STATUS.COMMON && i != model.x) {
    //                                 cells[model.y][i].direction = 'v'
    //                                 newBombModel.push(cells[model.y][i]);
    //                             } else {
    //                                 this.tryCrushCell(cells, changeModels, i, model.y, false, cycleCount);
    //                             }
    //                         }
    //                     } else {
    //                         // 竖向消除
    //                         if (cells[i][model.x]) {
    //                             if (cells[i][model.x].status != CELL_STATUS.COMMON && i != model.y) {
    //                                 cells[i][model.x].direction = 'h'
    //                                 newBombModel.push(this.cells[i][model.x]);
    //                             } else {
    //                                 this.tryCrushCell(cells, changeModels, model.x, i, false, cycleCount);
    //                             }

    //                         }
    //                     }

    //                 }

    //                 // this.addRowBomb(this.curTime, cc.v2(model.x, model.y));

    //             } else if (model.status == CELL_STATUS.CRAB) {
    //                 // 螃蟹
    //                 for (let i = -1; i <= 1; i++) {
    //                     for (let j = -1; j <= 1; j++) {
    //                         if (Math.abs(i) + Math.abs(j) < 2 && cells[model.y + j] && cells[model.y + j][model.x + i]) {
    //                             // 十字消除
    //                             if (cells[model.y + j][model.x + i].status != CELL_STATUS.COMMON && (i != 0 || j != 0)) {
    //                                 if (Math.abs(i) >= Math.abs(j)) {
    //                                     cells[model.y + j][model.x + i].direction = 'v'
    //                                 } else {
    //                                     cells[model.y + j][model.x + i].direction = 'h'
    //                                 }
    //                                 newBombModel.push(cells[model.y + j][model.x + i]);
    //                             } else {
    //                                 this.tryCrushCell(cells, changeModels, model.x + i, model.y + j, false, cycleCount);
    //                             }

    //                         }
    //                     }
    //                 }
    //                 // this.crushCell(model.x, model.y);
    //             } else if (model.status == CELL_STATUS.PUFFER) {
    //                 // 河豚
    //                 for (let i = -3; i <= 3; i++) {
    //                     for (let j = -3; j <= 3; j++) {
    //                         if (Math.abs(i) + Math.abs(j) < 4 && cells[model.y + j] && cells[model.y + j][model.x + i]) {
    //                             // 范围消除
    //                             if (cells[model.y + j][model.x + i].status != CELL_STATUS.COMMON && (i != 0 || j != 0)) {
    //                                 if (Math.abs(i) >= Math.abs(j)) {
    //                                     cells[model.y + j][model.x + i].direction = 'v'
    //                                 } else {
    //                                     cells[model.y + j][model.x + i].direction = 'h'
    //                                 }
    //                                 newBombModel.push(cells[model.y + j][model.x + i]);
    //                             } else {
    //                                 this.tryCrushCell(cells, changeModels, model.x + i, model.y + j, false, cycleCount);
    //                             }

    //                         }
    //                     }
    //                 }
    //                 // this.crushCell(model.x, model.y);
    //             }

    //         }, this);

    //         if (bombModels.length > 0) {
    //             this.curTime += bombTime;
    //         }
    //         bombModels = newBombModel;
    //     }
    // }
}