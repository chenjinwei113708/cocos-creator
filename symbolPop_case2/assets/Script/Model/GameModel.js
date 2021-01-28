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
        this.isMintegral = false; // 是不是mtg平台
        this.HorizontalConfig = {
            game: {
                position: cc.v2(230.752, 59.781),
                scale: 0.9,
                children: {
                    tool: {
                        position: cc.v2(-523.187, -231.448),
                    },
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 0.9,
                        position: cc.v2(-234.57, 143.662),
                    },
                    flyCash: {
                        position: cc.v2(230.752, 100.269),
                        scale: 0.8,
                    },
                    audioBtn: {
                        position: cc.v2(-410.189, 52.554)
                    },
                    game: {
                        position: cc.v2(230.752, 59.781),
                        scale: 0.9,
                        children: {
                            adsonly: {
                                active: this.isApplovin ? true : false
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, -321.374)
                            }
                        }
                    }
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1,
                children: {
                    tool: {
                        position: cc.v2(0, -393.011),
                    }
                }
            },
            UI: {
                children: {
                    paypal: {
                        scale: 1,
                        position: cc.v2(0, 373.3396),
                    },
                    flyCash: {
                        position: cc.v2(0, 0),
                        scale: 1,
                    },
                    audioBtn: {
                        position: cc.v2(-225.524, 275.209)
                    },
                    game: {
                        position: cc.v2(0, 0),
                        scale: 1,
                        children: {
                            adsonly: {
                                active: this.isApplovin ? true : false
                            },
                            mtg: {
                                active: this.isMintegral,
                                position: cc.v2(0, -321.374)
                            }
                        }
                    }
                }
            }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        

        this.guideScript = null;

        this.curGuideStep = 0;
        /**游戏进行顺序*/
        this.guideList = [
            // (cb) => {
            //     this.guideScript.showWelcomePage();
            //     this.curGuideStep++
            // },
            // (cb) => {
            //     // 第一步引导，引导用户进行第一个三消
            //     this.curGuideFunc = this.guideScript.setGuideMaskPos.bind(this.guideScript, 1);
            //     this.curGuideFunc();
            //     this.curGuideStep++
            // },
            // (cb) => {
            //     // 第二步合成一格
            //     this.curGuideFunc = this.guideScript.setGuideMaskPos.bind(this.guideScript, 2);
            //     this.curGuideFunc();
            //     this.curGuideStep++
            // }
        ]

        // 游戏顺序
        this.ORDER = {
            A: 'a',
            B: 'b',
            C: 'c',
            D: 'd',
        };
        this.curOrder = this.ORDER.A; // 目前游戏进行到哪个顺序了
        // 游戏规则
        this.gameRules = {
            [this.ORDER.A]: {
                money: 50, // 收获金额
                // limitArea: [ // 只允许点击以下格子
                //     // {x: 5, y: 10}, // 单个格子
                //     {from: {x: 1, y: 1}, to: {x: 3, y: 10}}, // 格子区域
                //     {from: {x: 8, y: 1}, to: {x: 10, y: 10}},
                //     {from: {x: 4, y: 5}, to: {x: 7, y: 6}},
                // ]
            },
            [this.ORDER.B]: {
                money: 50
            },
            [this.ORDER.C]: {
                money: 100
            },
            [this.ORDER.D]: {
                money: 100
            }
        }
        // 不同引导步骤对应的提示手坐标
        this.guidePosition = {
            [this.ORDER.A]: { // 第一次点击格子
                landscape: cc.v2(338, 217),
                portrait: cc.v2(125, 217)
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
    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    setGridView(gridScript) {
        this.gridScript = gridScript;
    }
    
    //初始化游戏模型
    gameInit(cellConf) {
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
        let cellInitConf = cellConf || [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 最底下的一行
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 3, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 4, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 5, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 5, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 3, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 4, 1, 1, 1]  // 最顶上的一行
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
                // this.cells[i][j].setHasGold(cellInitCoin[i - 1][j - 1] ? true : false); //按照参数设置金币
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
    }

    /**拿到所有格子的模型 */
    getCellsModel() {
        return this.cells;
    }

    /**拿到游戏规则 */
    getGameRules () {
        return this.gameRules[this.curOrder];
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
     * 检查格子在不在限制区域
     * @param {*} limitArea 限制区域
     * @param {*} cellPos 格子坐标
     * @return {boolean} 在限制区域则返回true，否则false
     */
    checkInLimitArea (limitArea, cellPos) {
        let item = limitArea.find(each => {
            if (each.x) {
                return each.x === cellPos.x && each.y === cellPos.y
            } else if (each.from){
                let x1 = each.from.x > each.to.x ? each.from.x : each.to.x; // 较大的x
                let x2 = each.from.x > each.to.x ? each.to.x :each.from.x; // 较小的x
                let y1 = each.from.y > each.to.y ? each.from.y : each.to.y; // 较大的y
                let y2 = each.from.y > each.to.y ? each.to.y :each.from.y; // 较小的y
                return (cellPos.x >= x2 && cellPos.x <= x1 && cellPos.y >= y2 && cellPos.y <= y1);
            } else {
                return false;
            }
        });
        if (item) return true;
        else return false;
    }

    /**拿到指定的爆炸格子 */
    getMyBombArea () {
        let models = [];
        models.push(this.cells[4][1]);
        models.push(this.cells[5][2]);
        models.push(this.cells[6][3]);
        models.push(this.cells[7][4]);
        models.push(this.cells[8][5]);
        models.push(this.cells[9][6]);
        models.push(this.cells[10][7]);
        let resultModels = JSON.parse(JSON.stringify(models));
        return resultModels;
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


    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    // // 设置通知的位置,要让通知在屏幕顶部
    // setNotificationPos (screen) {
    //     // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
    //     // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
    //     let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
    //     let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
    //     // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
    //     // let y = this.guideScript.notification.height/2 + _screenH;
    //     // let halfHeight = this.guideScript.notification.height/2;
    //     this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
    //     this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    // }
}