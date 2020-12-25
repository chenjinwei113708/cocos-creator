import {
    GRID_WIDTH,
    GRID_HEIGHT,
    CELL_TYPE,
    COMBINE_TYPE
} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
    // state
    constructor() {
        // 初始化state
        // 横竖屏参数
        this.isLandscape = false;
        this.isApplovin = false; // 是不是applovin平台
        this.HorizontalConfig = {
            // game: {
            //     position: cc.v2(239.546, 79.659),
            //     scale: 0.88,
            //     children: {
            //         adsonly: {
            //             active: this.isApplovin ? true : false
            //         }
            //     }
            // },
            // UI: {
            //     children: {
            //         congrat: this.isApplovin ? {
            //             width: 277.38, // applovin
            //             height: 540,
            //             opacity: 190
            //         } : {
            //             opacity: 255,
            //             angle: 90,
            //         },
            //         congratBlur: this.isApplovin ? {
            //             width: 277.38, // applovin
            //             height: 540,
            //             opacity: 190
            //         } : {
            //             opacity: 255,
            //             angle: 90,
            //         },
            //         notification: {},
            //         paypal: {
            //             position: cc.v2(-283.1, 127.459),
            //             children: {
            //                 laoren: {
            //                     width: 160,
            //                     height: 89,
            //                     position: cc.v2(392.037, 117.86)
            //                 },
            //                 icon: {
            //                     position: cc.v2(-67.054, -7.471)
            //                 },
            //                 btn: {
            //                     position: cc.v2(137.034, -40.34)
            //                 },
            //                 cash: {
            //                     position: cc.v2(135.994, 31.177)
            //                 }
            //             }
            //         },
            //         banner: {
            //             position: cc.v2(-261.323, -242.363),
            //             children: {
            //                 icon: {
            //                     position: cc.v2(-70.997, 131.491)
            //                 },
            //                 logo: {
            //                     position: cc.v2(76.109, 130.311)
            //                 },
            //                 btn: {
            //                     position: cc.v2(17.395, 25.327)
            //                 }
            //             }
            //         },
            //         audioBtn: {
            //             position: cc.v2(-415.577, 212.604)
            //         }
            //     }
            // }
        }
        this.VerticalConfig = {
            // game: {
            //     position: cc.v2(0, 0),
            //     scale: 1,
            //     children: {
            //         adsonly: {
            //             active: this.isApplovin ? true : false
            //         }
            //     }
            // },
            // UI: {
            //     children: {
            //         congrat: this.isApplovin ? {
            //             width: 603, // applovin
            //             height: 1170,
            //             opacity: 255
            //         } : {
            //             opacity: 255,
            //             angle: 0,
            //         },
            //         congratBlur: this.isApplovin ? {
            //             width: 603, // applovin
            //             height: 1170,
            //             opacity: 255
            //         } : {
            //             opacity: 255,
            //             angle: 0,
            //         },
            //         // notification: {},
            //         paypal: {
            //             position: cc.v2(0, 396.319),
            //             children: {
            //                 laoren: {
            //                     width: 319.4,
            //                     height: 177.4,
            //                     position: cc.v2(-0.75, -186.539)
            //                 },
            //                 icon: {
            //                     position: cc.v2(-155.976, -7.471)
            //                 },
            //                 btn: {
            //                     position: cc.v2(137.034, -40.34)
            //                 },
            //                 cash: {
            //                     position: cc.v2(135.994, 31.177)
            //                 }
            //             }
            //         },
            //         banner: {
            //             position: cc.v2(0, -458.318),
            //             children: {
            //                 icon: {
            //                     position: cc.v2(-197, 27)
            //                 },
            //                 logo: {
            //                     position: cc.v2(-49.894, 28.893)
            //                 },
            //                 btn: {
            //                     position: cc.v2(148.009, 28.4)
            //                 }
            //             }
            //         },
            //         audioBtn: {
            //             position: cc.v2(0, 403.152)
            //         }
            //     }
            // }
        }

        //guiding用来记录是否还需要继续进行拖动手势引导
        this.guiding = true;
        this.isSkillGuided = false;
        this.skillGuiding = false;
        

        this.guideScript = null;

        /** 方块模型，（1， 1）代表第一行，第一列，为坐标原点
         * 'CE'代表空格子，下标0不用
         */
        this.cellModel = [
            [],
            [undefined, 'CE', 'CE', 'CE', 'CE', 'CE'],
            [undefined, 'CE', 'CE', 'CE', 'CE', 'CE'],
            [undefined, 'CE', 'CE', 'C1', 'CE', 'CE'],
            [undefined, 'CE', 'CE', 'CE', 'CE', 'CE'],
            [undefined, 'CE', 'CE', 'CE', 'CE', 'CE'],
            []
        ];

        /**等待出现的组合
         * (0,0)代表中心，x加/减代表列的加/减，y加/减代表行的加/减，
         * 注意：目前最多只能有两个格子的组合，就是数组长度不能超过2，
         * 注意：而且(0,0)只能放数组末尾
         */
        this.nextCardsList = [
            [{relatPos: cc.v2(0,0), type: CELL_TYPE.C2}],
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

    //设置游戏控制器
    setGameController(gameController) {
        this.gameController = gameController;
    }

    //设置引导脚本
    setGuideView(guideScript) {
        this.guideScript = guideScript;
    }

    //初始化游戏模型
    gameInit() {}
    
    /**获得坐标config */
    getPositionConfig () {
        return this.isLandscape ? this.HorizontalConfig : this.VerticalConfig;
    }

    /**
     * 检查能否将卡片组放进格子模型
     * @param {cc.v2} boxPos 棋盘坐标，放置的位置
     * @param {*} cards [{relatPos: cc.v2, type: CELL_TYPE}]  卡片组：[{相对位置，类型}]
     * @param {boolean} ifPutDown 是否要放下，如果为true的话，则在能放入的前提下，会修改格子模型
     * @return 如果可以放下，则返回放得下的格子的坐标数组，否则返回null
     */
    checkIfCanPut (boxPos, cards, ifPutDown = false) {
        if (!boxPos || !cards || cards.length === 0) return null;

        let canput = true; // 记录能否放下牌组
        let putRecord = [];
        let canPutArr = [];
        cards.forEach((card, index) => {
            let newPos =cc.v2(boxPos.x+card.relatPos.x, boxPos.y+card.relatPos.y);
            if (this.cellModel[newPos.x][newPos.y] !== CELL_TYPE.CE) { // 此处非空格
                canput = false;
            } else if (ifPutDown) { // 此处是空格，而且要放下方块
                this.cellModel[newPos.x][newPos.y] = card.type;
                putRecord.push(newPos);
            }
            canPutArr.push(newPos);
        });
        if (!canput) { // 如果这个组合放不下，就还原格子模型
            putRecord.forEach((cardPos, index) => {
                this.cellModel[cardPos.x][cardPos.y] = CELL_TYPE.CE; // 把刚才放下的位置变成空格子
            });
            return null;
        } else {
            return canPutArr;
        }
    }

    /**
     * 把卡片放进模型
     * @param {cc.v2} boxPos 放置的位置(棋盘坐标)
     * @param {*} cards [{relatPos: cc.v2, type: CELL_TYPE}]  卡片组：[{相对位置，类型}]
     * @return result 返回一个数组，里面是可以合并的点的坐标，数组第一个元素是中心点。如果没有可以合并的点，则返回null
     */
    putCardIntoModel (boxPos, cards) {
        let putArr = this.checkIfCanPut(boxPos, cards, true);
        if (!putArr) return null;
        this.gameController.gameView.showCells(boxPos, cards);
        let connectArr = this.getConnectArr(boxPos);
        // console.log('putCardIntoModel, boxPos:', boxPos, ' cards', cards);
        // console.log('putCardIntoModel, connectArr:', connectArr);
        return connectArr;
    }

    /**
     * 拿到可以合并的卡片组的坐标。
     * @param {?cc.v2} center 中心点，也可以不传。如果传的话，会以中心点来检查。如果不传的话，会遍历整个棋盘的格子
     * @return result 返回一个数组，里面是可以合并的点的坐标，数组第一个元素是中心点。如果没有可以合并的点，则返回null
     */
    getConnectArr (center) {
        let area =  null;
        if (!center) {
            let r = 1;
            while (r <= GRID_HEIGHT && area === null) {
                let c = 1;
                while (c <= GRID_WIDTH && area === null) {
                    center = cc.v2(r, c);
                    area = this.checkConnectArea(center);
                    c++;
                }
                r++;
            }
        } else {
            area =  this.checkConnectArea(center);
        }
        // console.log('getConnectArr area', area);
        if (area) {
            let result = [];
            result.push(cc.v2(center.x, center.y));
            for (let i = 1; i <= GRID_HEIGHT; i++) {
                for (let j = 1; j <= GRID_WIDTH; j++) {
                    if (center.x === i && center.y === j) continue;
                    // console.log('**(', i, ', ', j, ')', area[i][j]);
                    if (area[i][j] === 1) {
                        // console.log('   push++,(', i, ', ', j, ')');
                        result.push(cc.v2(i, j));
                    }
                }
            }
            // console.log('getConnectArr result arr ::: ', result);
            if (result.length >= 3) return result;
            else return null;
        } else return null;
    }

    /**
     * 检查中心点周围有无可以合成的点，也就是上下左右是不是同类型的点
     * @param {cc.v2} center 检查中心点、起点的位置
     * @param {*} resultArr 第一次调用的时候不用传，会自动生成新的
     * @param {*} info 第一次调用的时候不用传，会自动生成新的
     * @return resultArr 二维数组，值为1的点的坐标就是可以合成的区域。如果中心点周围没有可以合成的点或者中心是空格子，就会返回null
     */
    checkConnectArea (center, resultArr, info) {
        let type = this.cellModel[center.x][center.y];
        // console.log(' --- checkConnectArea: (', center.x,', ', center.y, ')');
        // 如果中心点是空格子，返回null
        if (type === CELL_TYPE.CE) return null;
        // 如果上下左右都不是同类型
        if (this.cellModel[center.x-1][center.y] !== type &&
            this.cellModel[center.x+1][center.y] !== type &&
            this.cellModel[center.x][center.y-1] !== type &&
            this.cellModel[center.x][center.y+1] !== type) {
                return null;
            }
        if (!resultArr) {
            // 0:还未检查，1：同类型，2：不同类型
            resultArr = [
                [],
                [undefined, 0, 0, 0, 0, 0],
                [undefined, 0, 0, 0, 0, 0],
                [undefined, 0, 0, 0, 0, 0],
                [undefined, 0, 0, 0, 0, 0],
                [undefined, 0, 0, 0, 0, 0],
                []
            ];
            resultArr[center.x][center.y] = 1;
        }
        if (!info) {
            info = {
                number: 1, // 相同牌的个数
            }
        }
        // 如果上面的牌还没检查过
        if (resultArr[center.x-1][center.y] === 0) {
            if (this.cellModel[center.x-1][center.y] === type) { //上面的牌和中心牌是同类
                resultArr[center.x-1][center.y] = 1; // 把上面的牌记为同类
                info.number++;
                this.checkConnectArea(cc.v2(center.x-1, center.y), resultArr, info); // 以上面的牌为中心展开检查
            } else { // 否则
                resultArr[center.x-1][center.y] = 2; // 把上面的牌记为异类
            }
        }
        // 下面
        if (resultArr[center.x+1][center.y] === 0) {
            if (this.cellModel[center.x+1][center.y] === type) {
                resultArr[center.x+1][center.y] = 1;
                info.number++;
                this.checkConnectArea(cc.v2(center.x+1, center.y), resultArr, info);
            } else {
                resultArr[center.x+1][center.y] = 2;
            }
        }
        // 左面
        if (resultArr[center.x][center.y-1] === 0) {
            if (this.cellModel[center.x][center.y-1] === type) {
                resultArr[center.x][center.y-1] = 1;
                info.number++;
                this.checkConnectArea(cc.v2(center.x, center.y-1), resultArr, info);
            } else {
                resultArr[center.x][center.y-1] = 2;
            }
        }
        // 右面
        if (resultArr[center.x][center.y+1] === 0) {
            if (this.cellModel[center.x][center.y+1] === type) {
                resultArr[center.x][center.y+1] = 1;
                info.number++;
                this.checkConnectArea(cc.v2(center.x, center.y+1), resultArr, info);
            } else {
                resultArr[center.x][center.y+1] = 2;
            }
        }
        if (info && info.number >= 3){
            // 要有至少3个相邻牌才可以合并
            // console.log('--- ', info.number);
            return resultArr;
        } else return null;
    }

    /**
     * 将一组卡片进行合并，并返回合并生成的卡片类型
     * @param {[cc.v2]} cardsPos 卡片坐标数组，第一个元素是中心卡片，其他卡片会合并到中心
     * @return 成功则返回新生成的卡片类型，否则返回null
     */
    combineCards (cardsPos) {
        if (cardsPos.length <= 0) return null;
        let type = this.cellModel[cardsPos[0].x][cardsPos[0].y];
        let sameType = true;
        let sameTypeIndex = [];
        cardsPos.forEach((pos, index) => {
            if (this.cellModel[pos.x][pos.y] !== type) {
                // 如果合并的格子当中有不同类型的卡
                sameType = false;
            } else {
                sameTypeIndex.push(index);
                if (index === 0) {
                    // 合并之后，中点变成新类型
                    this.cellModel[pos.x][pos.y] = COMBINE_TYPE[type];
                } else {
                    this.cellModel[pos.x][pos.y] = CELL_TYPE.CE; // 合并之后，原来的位置变成空格子
                }
                
            }
        });
        if (!sameType) { // 如果合成失败，存在不同类型的卡片
            // 则把刚才变成空格子的地方还原成原来的卡片
            cardsPos.forEach((pos, index) => {
                if (sameTypeIndex.indexOf(index) > -1) {
                    this.cellModel[pos.x][pos.y] = type;
                }
            });
            return null;
        } else {
            return COMBINE_TYPE[type];
        }
    }

    /**拿到下一组卡牌
     * @return 返回一个数组，数组里面存了一组卡牌信息 [{relatPos: cc.v2, type: CELL_TYPE}]
     */
    getNextCards () {
        const typelist = [CELL_TYPE.C1, CELL_TYPE.C2, CELL_TYPE.C3, CELL_TYPE.C4, CELL_TYPE.C5, CELL_TYPE.C6];
        if (this.nextCardsList.length > 0) {
            return this.nextCardsList.splice(0, 1)[0];
        } else {
            let rand = Math.floor(Math.random()*6);
            return [{relatPos: cc.v2(0,0), type: typelist[rand]}]
        }
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