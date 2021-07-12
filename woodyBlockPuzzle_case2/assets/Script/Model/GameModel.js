import {
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.HorizontalConfig = {
            game: {
                position: cc.v2(226.014, 31.264),
                scale: 0.754
            },
            UI: {
                children: {
                    paypal: {
                        width: 662,
                        height: 588,
                        position: cc.v2(-353, 6),
                        children: {
                            progress: {
                                position: cc.v2(31.22, 71.519)
                            },
                            play2win: {
                                position: cc.v2(31.175, 155),
                            },
                            ppcard: {
                                position: cc.v2(251.495, 126.907),
                            },
                            arrow: {
                                position: cc.v2(149.948, 174.82)
                            }
                        }
                    },
                    banner: {
                        children: {
                            icon: {
                                position: cc.v2(-356.685, -110.577),
                            },
                            logo: {
                                position: cc.v2(-359.301, -188.815),
                            },
                            btn: {
                                position: cc.v2(-168.451, -192.761),
                            },
                        }
                    },
                    notification: {},
                    audioBtn: {
                        position: cc.v2(-431.024, 222.084),
                    },
                    congrat: {
                        // angle: 90,
                        // opacity: 255,
                        width: 277.38,
                        height: 540,
                        opacity: 190
                    },
                    congratBlur: {
                        // angle: 90,
                        // opacity: 255,
                        width: 277.38, // applovin
                        height: 540,
                        opacity: 190
                    },
                }
            }
        }
        this.VerticalConfig = {
            game: {
                position: cc.v2(0, 0),
                scale: 1
            },
            UI: {
                children: {
                    paypal: {
                        width: 551,
                        height: 318,
                        position: cc.v2(0, 464),
                        children: {
                            progress: {
                                position: cc.v2(-108.1, -122.1)
                            },
                            play2win: {
                                position: cc.v2(-108.145, -42.297),
                            },
                            ppcard: {
                                position: cc.v2(196.322, -71.713),
                            },
                            arrow: {
                                position: cc.v2(85.58, -67.939)
                            }
                        }
                    },
                    banner: {
                        children: {
                            icon: {
                                position: cc.v2(-208.378, -435.595),
                            },
                            logo: {
                                position: cc.v2(-54.53, -438.431),
                            },
                            btn: {
                                position: cc.v2(149.002, -440.538),
                            },
                        }
                    },
                    notification: {},
                    audioBtn: {
                        position: cc.v2(0, 450.422),
                    },
                    congrat: {
                        // angle: 0,
                        // opacity: 255,
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    },
                    congratBlur: {
                        // angle: 0,
                        // opacity: 255,
                        width: 603, // applovin
                        height: 1170,
                        opacity: 255
                    },
                }
            }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        

        this.guideScript = null;

        /**格子模型，不用下标为0的行和列， 
         * 一维代表视图中的行 bricks[n] 第n行
         * 二维代表视图中的列 bricks[n][m] 第n行 第m列
         * 0代表空格，1代表占位
         * 视图左上角为第一行第一列*/
        this.brickModel = [
            [9, 9, 9, 9, 9, 9, 9, 9, 9],
            [9, 1, 1, 0, 1, 1, 0, 0, 0],
            [9, 0, 1, 0, 0, 1, 0, 1, 1],
            [9, 1, 1, 1, 1, 1, 0, 1, 1],
            [9, 0, 0, 1, 1, 1, 1, 1, 1],
            [9, 1, 1, 1, 1, 1, 0, 1, 0],
            [9, 1, 1, 1, 1, 1, 1, 1, 0],
            [9, 0, 0, 0, 0, 0, 1, 0, 0],
            [9, 0, 1, 1, 1, 1, 1, 1, 0],
        ];

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

    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {
    }

    // 设置通知的位置,要让通知在屏幕顶部
    setNotificationPos (screen) {
        // this.HorizontalConfig.guide.children.notification1.position = cc.v2(0, _pos.y+moveY);
        // this.HorizontalConfig.guide.children.notification2.position = cc.v2(0, _pos.y+moveY);
        let long = screen.canvasHeight > screen.canvasWidth ? screen.canvasHeight : screen.canvasWidth;
        let short = screen.canvasHeight > screen.canvasWidth ? screen.canvasWidth : screen.canvasHeight;
        // let _screenH = screen.ratio >= 1.77 ? long*(540/short)/2 : 960/2;
        // let y = this.guideScript.notification.height/2 + _screenH;
        let halfHeight = this.guideScript.notification.height/2;
        this.VerticalConfig.UI.children.notification.position = cc.v2(0, long/2 - halfHeight);
        this.HorizontalConfig.UI.children.notification.position = cc.v2(0, short/2 - halfHeight);
    }

    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    /**把方块数据放进格子模型，看能否放进去
     * @param {cc.v2} startPos {x: 行, y: 列} 方块起点(右下角)放在哪个位置
     * @param {BRICK_VALUE} brickValue 方块类型所代表的数据
     * @param {boolean} isPutDown 是否放下，还是在上方移过
     * @return {boolean} 是否放得下
     */
    placeInto (startPos ,brickValue, isPutDown  = false) {
        if (!startPos) return false;
        if (this.brickModel[startPos.x][startPos.y] !== 0 ) {
            return false; // 格子模型这一格不为空，返回
        }
        let canPut = true; // 能不能放下，初始值为true
        if (brickValue.length > 1) {
            // 找一个格子被占用的坐标
            let exception = brickValue.find((each, index) => {
                if (index === 0) return false;
                let pos = cc.v2(startPos.x+each.x, startPos.y+each.y);
                if (this.brickModel[pos.x][pos.y] !== 0 ) {
                    return true; // 格子模型这一格不为空
                }
            });
            if (exception) {
                canPut = false; // 有方块放不进格子里，格子被占用了
                return false;
            }
        }
        // 如果运行到这里，说明格子都放得下
        // 用户是否要将方块放入格子
        if (isPutDown) {
            brickValue.forEach(each => {
                let pos = cc.v2(startPos.x+each.x, startPos.y+each.y);
                this.brickModel[pos.x][pos.y] = 1;
            });
        }
        return true;
    }

    /**找到爆炸区域
     * @param {cc.v2} startPos {x: 行, y: 列}  方块起点(右下角)放在哪个位置
     * @param {BRICK_VALUE} brickValue 方块类型所代表的数据
     * @return {object} 可以消除的行和列 格式：{row: [1], column: [1], bricks: [{x,y}]} （例：第一行和第一列）
     *  如果没有可以消除的方块，则返回null
     */
    findBomb (startPos, brickValue) {
        let rows = []; // 需要检查的行
        let columns = []; // 需要检查的列
        brickValue.forEach(each => {
            let pos = cc.v2(startPos.x+each.x, startPos.y+each.y);
            if (rows.indexOf(pos.x) === -1) {
                rows.push(pos.x);
            }
            if (columns.indexOf(pos.y) === -1) {
                columns.push(pos.y);
            }
            this.brickModel[pos.x][pos.y];
        });
        // console.log('findBomb rows', rows);
        // console.log('findBomb columns', columns);
        let newRows = []; // 需要返回的行
        let newColumns = []; // 需要返回的列
        let bricks = [];
        // 查找每一行里面有没有空格子
        rows.forEach(row => {
            let empty = this.brickModel[row].findIndex(i => i === 0);
            if (empty === -1) {
                // 没有找到空格子
                newRows.push(row);
                for (let i = 1; i <= this.brickModel.length - 1; i++) {
                    bricks.push({x: row, y: i});
                };
            }
        });
        // console.log('findBomb newRows', newRows);
        // 查找每一列里面有没有空格子
        columns.forEach(column => {
            let empty = this.brickModel.findIndex((eachRow, index) => {
                if (index === 0) return false;
                return eachRow[column] === 0;
            });
            if (empty === -1) {
                // 没有找到空格子
                newColumns.push(column);
                for (let i = 1; i <= this.brickModel.length - 1; i++) {
                    if (newRows.indexOf(i) === -1) {
                        bricks.push({x: i, y: column});
                    }
                };
            }
        });
        // console.log('findBomb newColumns', newColumns);
        if (bricks.length > 0) {
            return {
                row: newRows,
                column: newColumns,
                bricks: bricks
            };
        } else {
            return null;
        }
    }

    /**将爆炸的区域的格子置为空
     * @param {[{x,y}]} bombBricks 爆炸方块的坐标数组
     */
    bomb (bombBricks) {
        bombBricks.forEach(each => {
            this.brickModel[each.x][each.y] = 0;
        });
    }
}