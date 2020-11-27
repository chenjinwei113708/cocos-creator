import ItemModel from './ItemModel';

export default class GameModel {
    constructor() {
        // 横竖屏参数
        this.currentTop = 6;
        this.isApplovin = false; // 是不是applovin平台
        this.isLandscape = false;
        //横屏
        this.HorizontalConfig = {
            logo: {
                position: cc.v2(-343, 200)
            },
            level: {
                position: cc.v2(0, 228),
                scale: 0.7
            },
            tip: {
                position: cc.v2(319, 228)
            },
            title: {
                position: cc.v2(5, 144)
            },
            item: {
                children: {
                    1: { position: cc.v2(341, -98) },
                    2: { position: cc.v2(5, -167) },
                    3: { position: cc.v2(119, 14) },
                    4: { position: cc.v2(-310, -131) },
                    5: { position: cc.v2(-172, 15) }
                }
            },
            hand: {
                scale: 0.4,
                position: cc.v2(-180, 14)
            },
            modal: {
                children: {
                    middlePage: {
                        scale: 1
                    },
                    endPage: {
                        scale: .8
                    },
                }
            },
            audioBtn: {
                position: cc.v2(130, 230)
            }
        };
        this.VerticalConfig = {
            logo: {
                position: cc.v2(0, 310)
            },
            level: {
                position: cc.v2(-141, 430),
                scale: 0.7
            },
            tip: {
                position: cc.v2(171, 429)
            },
            title: {
                position: cc.v2(5, 203)
            },
            item: {
                children: {
                    1: { position: cc.v2(116, 35) },
                    2: { position: cc.v2(127, -378) },
                    3: { position: cc.v2(147, -150) },
                    4: { position: cc.v2(-150, -248) },
                    5: { position: cc.v2(-136, -23) }
                }
            },
            hand: {
                scale: 0.4,
                position: cc.v2(-147, -18)
            },
            modal: {
                children: {
                    middlePage: {
                        scale: .8
                    },
                    endPage: {
                        scale: .8
                    }
                }
            },
            audioBtn: {
                position: cc.v2(0, 433)
            }
        };
        this.canShowTip = false; // 能否展示提示
        this.errorArr = []; // 点错物品的数组
        this.isTipShowed = false; // 是否展示过提示框
        this.startPos = null;
        this.startDrag = false;
        this.curDraggingModel = null;
        this.curDraggingNode = null;
        this.playingAnim = false;
    }

    //设置引导脚本
    setGameController (gameController) {
        this.gameController = gameController;
    }

    //初始化游戏模型
    gameInit() {
        // 初始化人物数据
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.initItemModel(this.gameController.item.children);
    }

    canDragOut() {
        return !this.curDraggingNode && !this.playingAnim;
    }

    canDragMove() {
        return this.curDraggingNode && !this.playingAnim;
    }

    isDragging() {
        return this.curDragingNode || this.playingAnim;
    }

    initItemModel(nodes) {
        this.items = nodes.map(node => new ItemModel(node));
    }

    getDistances (pos) {
        let distances = this.items.map(model => {
            return model.getPosition().sub(pos).mag();
        });
        return distances;
    }

    dragSuccessItem (pos) {
    }

    setDragItem (model) {
        this.curDraggingModel = model;
        this.curDraggingNode = model.node;
        this.curDraggingNode.setSiblingIndex(this.currentTop++);
    }

    releaseDragItem () {
        this.curDraggingModel = null;
        this.curDraggingNode = null;
        this.startDrag = false;
        this.startPos = null;
    }

    putInErrorArr (name) {
        if (!name) return;
        if (this.errorArr.indexOf(name) === -1) {
            this.errorArr.push(name);
        }
    }
}