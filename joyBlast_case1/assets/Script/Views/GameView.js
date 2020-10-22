// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import {
    GAME_LEVEL,
    CELL_TYPE,
    ACTION_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        hand: cc.Node, // 指引手
        kuais: cc.Node, // 所有方块
        mask1: cc.Node, // 棋盘遮罩
        touch1: cc.Node, // 触碰点1
        touch2: cc.Node, // 触碰点2
        // combos: [cc.Node], // 喝彩
        ppcard: cc.Node, // 金币卡
        effects: cc.Node, // 特效节点
        bombParticleRed: cc.Prefab, // 爆炸粒子特效
        bombParticleGreen: cc.Prefab, // 爆炸粒子特效
        bombParticleYellow: cc.Prefab, // 爆炸粒子特效
        bombParticlePurple: cc.Prefab, // 爆炸粒子特效
        bombParticleBlue: cc.Prefab, // 爆炸粒子特效
        // 不同类型的图
        spriteRed: cc.SpriteFrame,
        spriteGreen: cc.SpriteFrame,
        spriteYellow: cc.SpriteFrame,
        spritePurple: cc.SpriteFrame,
        spriteBlue: cc.SpriteFrame,
        spriteRocket: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.gameInfo = {
            // nowLevel: GAME_LEVEL.LEVEL1,
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            checkDistance: 20, // 移动最少的距离
            nowTouch: null, // 上次点击的触碰点
            nowTouchPos: null, // 上次点击的触碰点的位置
            isAddingCash: false, // 是不是正在加钱
            fireInterval: null, // 烟花定时器
        };
        // 不同类型对应的图片
        this.sprites = {
            [CELL_TYPE.GREEN]: this.spriteGreen,
            [CELL_TYPE.RED]: this.spriteRed,
            [CELL_TYPE.YELLOW]: this.spriteYellow,
            [CELL_TYPE.BLUE]: this.spriteBlue,
            [CELL_TYPE.PURPLE]: this.spritePurple,
            [CELL_TYPE.ROCKET]: this.spriteRocket,
        };
        this.typeParticle = {
            [CELL_TYPE.GREEN]: this.bombParticleGreen,
            [CELL_TYPE.RED]: this.bombParticleRed,
            [CELL_TYPE.YELLOW]: this.bombParticleYellow,
            [CELL_TYPE.BLUE]: this.bombParticleBlue,
            [CELL_TYPE.PURPLE]: this.bombParticlePurple,
        };
        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [undefined, ...this.kuais.getChildByName('cell10').children], // 这一行是看不见的
            [undefined, ...this.kuais.getChildByName('cell9').children],
            [undefined, ...this.kuais.getChildByName('cell8').children],
            [undefined, ...this.kuais.getChildByName('cell7').children],
            [undefined, ...this.kuais.getChildByName('cell6').children],
            [undefined, ...this.kuais.getChildByName('cell5').children],
            [undefined, ...this.kuais.getChildByName('cell4').children],
            [undefined, ...this.kuais.getChildByName('cell3').children],
            [undefined, ...this.kuais.getChildByName('cell2').children],
            [undefined, ...this.kuais.getChildByName('cell1').children],
        ];


        this.comboTimes = 0;

        // 这一关将要执行的动画
        this.actionList = [];
        // 游戏总共几关
        this.gameLevels = [GAME_LEVEL.LEVEL1, GAME_LEVEL.LEVEL2]
        // 每一关对应的动画
        this.actionLevel = [
            [ // 第一关
                {type: ACTION_TYPE.COMBINE, center: cc.v2(6,5), others: [cc.v2(5,3), cc.v2(5,4), cc.v2(5,6), cc.v2(5,7), cc.v2(6,3), cc.v2(6,4), cc.v2(6,6), cc.v2(6,7)], newType: CELL_TYPE.ROCKET},
                {type: ACTION_TYPE.DOWN, nodes: [
                    {start: cc.v2(4,3), end: cc.v2(6,3), newType: undefined},
                    {start: cc.v2(4,4), end: cc.v2(6,4), newType: undefined},
                    {start: cc.v2(4,6), end: cc.v2(6,6), newType: undefined},
                    {start: cc.v2(4,7), end: cc.v2(6,7), newType: undefined},
                    {start: cc.v2(3,3), end: cc.v2(5,3), newType: undefined},
                    {start: cc.v2(3,4), end: cc.v2(5,4), newType: undefined},
                    {start: cc.v2(3,6), end: cc.v2(5,6), newType: undefined},
                    {start: cc.v2(3,7), end: cc.v2(5,7), newType: undefined},
                    {start: cc.v2(2,3), end: cc.v2(4,3), newType: undefined},
                    {start: cc.v2(2,4), end: cc.v2(4,4), newType: undefined},
                    {start: cc.v2(2,6), end: cc.v2(4,6), newType: undefined},
                    {start: cc.v2(2,7), end: cc.v2(4,7), newType: undefined},
                    {start: cc.v2(1,3), end: cc.v2(3,3), newType: undefined},
                    {start: cc.v2(1,4), end: cc.v2(3,4), newType: undefined},
                    {start: cc.v2(1,6), end: cc.v2(3,6), newType: undefined},
                    {start: cc.v2(1,7), end: cc.v2(3,7), newType: undefined},
                    {start: cc.v2(0,3), end: cc.v2(2,3), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,4), end: cc.v2(2,4), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,6), end: cc.v2(2,6), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,7), end: cc.v2(2,7), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,3), end: cc.v2(1,3), newType: CELL_TYPE.RED},
                    {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.RED},
                    {start: cc.v2(0,6), end: cc.v2(1,6), newType: CELL_TYPE.RED},
                    {start: cc.v2(0,7), end: cc.v2(1,7), newType: CELL_TYPE.RED},
                    ]
                },
            ],
            [ // 第二关
                {type: ACTION_TYPE.BOMB, nodes: [
                    [
                        {pos: cc.v2(6, 5), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(6, 4), type: CELL_TYPE.GREEN},
                        {pos: cc.v2(6, 3), type: CELL_TYPE.PURPLE},
                        {pos: cc.v2(6, 2), type: CELL_TYPE.GREEN},
                        {pos: cc.v2(6, 1), type: CELL_TYPE.RED},
                    ],
                    [
                        {pos: cc.v2(6, 6), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(6, 7), type: CELL_TYPE.GREEN},
                        {pos: cc.v2(6, 8), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(6, 9), type: CELL_TYPE.GREEN},
                    ],
                ]
                },
                {type: ACTION_TYPE.DOWN, nodes: [
                    {startLine: 5, endLine: 6, newType: undefined},
                    {startLine: 4, endLine: 5, newType: undefined},
                    {startLine: 3, endLine: 4, newType: undefined},
                    {startLine: 2, endLine: 3, newType: undefined},
                    {startLine: 1, endLine: 2, newType: undefined},
                    {start: cc.v2(0,3), end: cc.v2(1,3), newType: CELL_TYPE.GREEN},
                    {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,5), end: cc.v2(1,5), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,6), end: cc.v2(1,6), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,7), end: cc.v2(1,7), newType: CELL_TYPE.YELLOW},
                    ]
                },
                {type: ACTION_TYPE.BOMB, nodes: [
                    [
                        {pos: cc.v2(7, 1), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(7, 2), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(6, 2), type: CELL_TYPE.BLUE},
                        {pos: cc.v2(6, 3), type: CELL_TYPE.BLUE},
                    ],
                    [
                        {pos: cc.v2(7, 9), type: CELL_TYPE.RED},
                        {pos: cc.v2(6, 9), type: CELL_TYPE.RED},
                        {pos: cc.v2(6, 8), type: CELL_TYPE.RED},
                    ],
                    [
                        {pos: cc.v2(3, 6), type: CELL_TYPE.PURPLE},
                        {pos: cc.v2(3, 7), type: CELL_TYPE.PURPLE},
                        {pos: cc.v2(4, 7), type: CELL_TYPE.PURPLE},
                        {pos: cc.v2(3, 8), type: CELL_TYPE.PURPLE},
                        {pos: cc.v2(3, 9), type: CELL_TYPE.PURPLE},
                    ],
                    [
                        {pos: cc.v2(2, 5), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(1, 5), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(1, 6), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(1, 7), type: CELL_TYPE.YELLOW},
                    ],
                ]
                },
                {type: ACTION_TYPE.DOWN, nodes: [
                    {start: cc.v2(6,1), end: cc.v2(7,1), newType: undefined},
                    {start: cc.v2(5,1), end: cc.v2(6,1), newType: undefined},
                    {start: cc.v2(4,1), end: cc.v2(5,1), newType: undefined},
                    {start: cc.v2(3,1), end: cc.v2(4,1), newType: undefined},
                    {start: cc.v2(2,1), end: cc.v2(3,1), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(5,2), end: cc.v2(7,2), newType: undefined},
                    {start: cc.v2(4,2), end: cc.v2(6,2), newType: undefined},
                    {start: cc.v2(3,2), end: cc.v2(5,2), newType: undefined},
                    {start: cc.v2(2,2), end: cc.v2(4,2), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,2), end: cc.v2(3,2), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(5,3), end: cc.v2(6,3), newType: undefined},
                    {start: cc.v2(4,3), end: cc.v2(5,3), newType: undefined},
                    {start: cc.v2(3,3), end: cc.v2(4,3), newType: undefined},
                    {start: cc.v2(2,3), end: cc.v2(3,3), newType: undefined},
                    {start: cc.v2(1,3), end: cc.v2(2,3), newType: undefined},
                    {start: cc.v2(0,3), end: cc.v2(1,3), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,5), end: cc.v2(2,5), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,5), end: cc.v2(1,5), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,6), end: cc.v2(3,6), newType: undefined},
                    {start: cc.v2(0,6), end: cc.v2(2,6), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,6), end: cc.v2(1,6), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,7), end: cc.v2(4,7), newType: undefined},
                    {start: cc.v2(0,7), end: cc.v2(3,7), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,7), end: cc.v2(2,7), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,7), end: cc.v2(1,7), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(5,8), end: cc.v2(6,8), newType: undefined},
                    {start: cc.v2(4,8), end: cc.v2(5,8), newType: undefined},
                    {start: cc.v2(2,8), end: cc.v2(4,8), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,8), end: cc.v2(3,8), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(5,9), end: cc.v2(7,9), newType: undefined},
                    {start: cc.v2(4,9), end: cc.v2(6,9), newType: undefined},
                    {start: cc.v2(2,9), end: cc.v2(5,9), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,9), end: cc.v2(4,9), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,9), end: cc.v2(3,9), newType: CELL_TYPE.YELLOW},
                    ]
                },
                {type: ACTION_TYPE.BOMB, nodes: [
                    [
                        {pos: cc.v2(1, 5), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(1, 6), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(1, 7), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(2, 7), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(2, 6), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(2, 5), type: CELL_TYPE.YELLOW},
                    ],
                    [
                        {pos: cc.v2(3, 7), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(3, 8), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(3, 9), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(4, 9), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(4, 8), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(5, 9), type: CELL_TYPE.YELLOW},
                        {pos: cc.v2(6, 9), type: CELL_TYPE.YELLOW},
                    ],
                ]
                },
                {type: ACTION_TYPE.DOWN, nodes: [
                    {start: cc.v2(0,5), end: cc.v2(2,5), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,5), end: cc.v2(1,5), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(0,6), end: cc.v2(2,6), newType: CELL_TYPE.BLUE},
                    {start: cc.v2(0,6), end: cc.v2(1,6), newType: CELL_TYPE.BLUE},
                    {start: cc.v2(0,7), end: cc.v2(3,7), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(0,7), end: cc.v2(2,7), newType: CELL_TYPE.GREEN},
                    {start: cc.v2(0,7), end: cc.v2(1,7), newType: CELL_TYPE.GREEN},
                    {start: cc.v2(2,8), end: cc.v2(4,8), newType: CELL_TYPE.BLUE},
                    {start: cc.v2(2,8), end: cc.v2(3,8), newType: CELL_TYPE.RED},
                    {start: cc.v2(2,9), end: cc.v2(6,9), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,9), end: cc.v2(5,9), newType: CELL_TYPE.YELLOW},
                    {start: cc.v2(2,9), end: cc.v2(4,9), newType: CELL_TYPE.PURPLE},
                    {start: cc.v2(2,9), end: cc.v2(3,9), newType: CELL_TYPE.GREEN},
                    ]
                },
                // {type: ACTION_TYPE.COMBINE, list: [
                //     {center: cc.v2(5,3), others: [cc.v2(5,4), cc.v2(5,5)], newType: CELL_TYPE.PEAR},
                //     {center: cc.v2(3,3), others: [cc.v2(3,4), cc.v2(3,5)], newType: CELL_TYPE.TOMATO},
                // ]},
                // {type: ACTION_TYPE.DOWN, nodes: [
                //     {start: cc.v2(4,4), end: cc.v2(5,4), newType: undefined},
                //     {start: cc.v2(4,5), end: cc.v2(5,5), newType: undefined},
                //     {start: cc.v2(2,4), end: cc.v2(4,4), newType: undefined},
                //     {start: cc.v2(2,5), end: cc.v2(4,5), newType: undefined},
                //     {start: cc.v2(1,4), end: cc.v2(3,4), newType: undefined},
                //     {start: cc.v2(1,5), end: cc.v2(3,5), newType: undefined},
                //     {start: cc.v2(0,4), end: cc.v2(2,4), newType: CELL_TYPE.STRAWBERRY},
                //     {start: cc.v2(0,5), end: cc.v2(2,5), newType: CELL_TYPE.GRAPE},
                //     {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.STRAWBERRY},
                //     {start: cc.v2(0,5), end: cc.v2(1,5), newType: CELL_TYPE.GRAPE},
                //     ]
                // },
                // {type: ACTION_TYPE.COMBINE, center: cc.v2(3,4), others: [cc.v2(2,4), cc.v2(1,4)], newType: CELL_TYPE.APPLE},
                // {type: ACTION_TYPE.DOWN, nodes: [
                //     {start: cc.v2(0,4), end: cc.v2(2,4), newType: CELL_TYPE.APPLE},
                //     {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.PEAR},
                //     ]
                // },
                // {type: ACTION_TYPE.COMBINE, center: cc.v2(4,4), others: [cc.v2(3,4), cc.v2(3,5), cc.v2(2,4)], newType: CELL_TYPE.GRAPE},
                // {type: ACTION_TYPE.DOWN, nodes: [
                //     {start: cc.v2(2,5), end: cc.v2(3,5), newType: undefined},
                //     {start: cc.v2(1,5), end: cc.v2(2,5), newType: undefined},
                //     {start: cc.v2(1,4), end: cc.v2(3,4), newType: undefined},
                //     {start: cc.v2(0,5), end: cc.v2(1,5), newType: CELL_TYPE.CARROT},
                //     {start: cc.v2(0,4), end: cc.v2(2,4), newType: CELL_TYPE.STRAWBERRY},
                //     {start: cc.v2(0,4), end: cc.v2(1,4), newType: CELL_TYPE.BANANA},
                //     ]
                // },
            ]
        ];

        this.changeToNextLevel();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    changeToNextLevel () {
        if (this.actionLevel.length === 0){
            this.playFirework();
            this.showPPcard();
            // this.offTouchListener();
            return;
        }
        let nextList = this.actionLevel.splice(0, 1)[0];
        this.actionList.push(...nextList);
        this.showPPcard();
        this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];
        // this.startGuide();
    },

    showPPcard () {
        this.ppcard.opacity = 0;
        this.ppcard.scale = 0;
        this.ppcard.active = true;
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1.1)), 
            cc.scaleTo(0.1, 0.9),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                this.ppcard.getChildByName('hand').runAction(cc.fadeIn(0.2));
                this.ppcard.getChildByName('hand').getComponent(cc.Animation).play();
            })
        ));
    },

    receivePPcard () {
        if (this.gameInfo.isAddingCash) return;
        this.gameInfo.isAddingCash = true;
        this.gameController.addCash(100);
        this.gameController.getAudioUtils().playEffect('coin', 0.5);
        this.ppcard.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(()=>{
                this.ppcard.active = false;
                this.gameInfo.isAddingCash = false;
                if (this.gameController.cashView.targetCash >= 300) {
                    console.log(this.gameController.guideView);
                    this.gameController.guideView.showCashOutHand();
                    return;
                }
                this.startGuide();
                // this.changeToNextLevel();
            })
        ));
    },



    setTouchListener () {
        this.touch1.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },
    offTouchListener () {
        this.touch1.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    setTouch2Listener () {
        this.touch2.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },
    offTouch2Listener () {
        this.touch2.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },


    onTouchStart (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            // let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            // this.gameInfo.nowTouch = this.touch3;
            // this.gameInfo.lastCheckTime = Date.now();
            // this.gameInfo.nowTouchPos = touchPos;
            this.setCellStatus(CELL_STATUS.IS_MOVE);
            this.hideGuide();
            this.doActions();
            // console.log('点击开始');
            if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
                this.flyRocket();
            }
        }
        
    },
    
    setCellStatus (status) {
        this.gameInfo.cellStatus = status;
    },

    /**执行动作序列 */
    doActions () {
        // this.hideGuide();
        if (this.actionList.length > 0) {
            let action = this.actionList.splice(0, 1)[0];
            switch (action.type) {
                case ACTION_TYPE.BOMB:
                    this.actBomb(action.nodes);
                    break;
                case ACTION_TYPE.COMBINE:
                    if (action.list) {
                        action.list.forEach((each, index) => {
                            let isMulti = true;
                            if (index >= action.list.length-1) {isMulti = false;}
                            this.actCombine(each.center, each.others, each.newType, isMulti);
                        })
                    } else {
                        this.actCombine(action.center, action.others, action.newType);
                    }
                    break;
                case ACTION_TYPE.DOWN:
                    action.nodes.forEach((item, index) => {
                        let done = false;
                        if (index >= action.nodes.length-1) {done = true;}
                        setTimeout(() => {
                            if (item.startLine) {
                                for (let k = 1; k <= 9; k++) {
                                    setTimeout(() => {
                                        this.actDown(cc.v2(item.startLine, k), cc.v2(item.endLine, k), item.newType, false);
                                    }, (k-1)*20);
                                }
                            } else {
                                setTimeout(() => {
                                    this.actDown(item.start, item.end, item.newType, done);
                                }, 160);
                            }
                        }, index*20);
                        
                    });
                    break;
                default: break;
            }
        } else {
            this.changeToNextLevel();
            this.setCellStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    /**动作：交换节点
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} end 结束位置坐标
     */
    actSwitch (start, end) {
        // let startNode = this.cells[start.x][start.y];
        // let endNode = this.cells[end.x][end.y];
        // if (!startNode || !endNode) return;
        // let startPos = cc.v2(startNode.position.x, startNode.position.y);
        // let endPos = cc.v2(endNode.position.x, endNode.position.y);
        // const moveTime = 0.15; 
        // startNode.runAction(cc.moveTo(moveTime, endPos));
        // endNode.runAction(cc.sequence(
        //     cc.moveTo(moveTime, startPos),
        //     cc.delayTime(0.1),
        //     cc.callFunc(() => {
        //         this.cells[start.x][start.y] = endNode;
        //         this.cells[end.x][end.y] = startNode
        //         this.doActions();
        //     })
        // ));
    },

    /**动作：爆炸
     * @ param {array} brickList 需要爆炸的所有节点
     */
    actBomb (brickList) {
        // console.log('actBomb', brickList);
        if (brickList.length<=0) return;
        if (brickList[0].pos) {
            // 如果只是一组依次爆炸
            brickList.forEach((brick, index) => {
                setTimeout(() => {
                    this.showBombEffect(brick);
                    if (index >= brickList.length-1) {
                        this.doActions();
                    }
                }, index*30);
            });
        } else {
            // 如果是需要同时爆炸多组
            brickList.forEach((brickArr, arrIndex) => {
                brickArr.forEach((brick, index) => {
                    setTimeout(() => {
                        this.showBombEffect(brick);
                        if (index >= brickArr.length-1 && arrIndex >= brickList.length-1) {
                            this.doActions();
                        }
                    }, index*30);
                });
            });
        }
    },

    /**展示爆炸特效 */
    showBombEffect (brick) {
        let node = this.cells[brick.pos.x][brick.pos.y];
        let particle = cc.instantiate(this.typeParticle[brick.type]);
        this.gameController.getAudioUtils().playEffect('bomb', 0.2);
        node.runAction(cc.sequence(
            cc.fadeOut(0.1),
            cc.callFunc(() => {})
        ));
        particle.position = cc.v2(node.position.x, node.position.y);
        particle.parent = this.effects;
        particle.getComponent(cc.ParticleSystem).resetSystem();
        particle.getComponent(cc.ParticleSystem).scheduleOnce(() => {
            particle.runAction(cc.removeSelf());
        }, 2);
    },

    /**动作：合并
     * @ param {cc.v2} center 中心合并位置坐标
     * @ param {[cc.v2]} other 其他点的位置坐标 数组
     * @ param {[cc.v2]} newType 需要合成什么类型
     * @ param {boolean} isMulti 是否同时合成多个
     */
    actCombine (center, others, newType, isMulti=false) {
        let centerNode = this.cells[center.x][center.y];
        if (!centerNode) return;
        let centerPos = cc.v2(centerNode.position.x, centerNode.position.y);
        let otherNodes = others.map(other => {return this.cells[other.x][other.y];});
        const moveTime = 0.2;
        let originPos = [];
        otherNodes.forEach((other, index) => {
            originPos[index] = cc.v2(other.position.x, other.position.y);
            other.runAction(cc.sequence(
                cc.moveTo(moveTime, centerPos),
                cc.callFunc(() => {
                    other.opacity = 0;
                    other.position = originPos[index];
                    if (index === otherNodes.length-1) {
                        this.gameController.getAudioUtils().playEffect('bomb', 0.4);
                        // this.gameController.guideView.showFlyCoin(centerPos);
                        // let cashNum = this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1 ? 25: 20;
                        // setTimeout(() => {this.gameController.addCash(cashNum);}, 300);
                        // this.gameController.getAudioUtils().playEffect('coin', 0.4);
                        centerNode.runAction(cc.sequence(
                            cc.scaleTo(0.1, 1.15),
                            cc.scaleTo(0.1, 0.5),
                            cc.callFunc(() => {
                                this.showHuan();
                                centerNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
                                
                                // this.showCombo();
                            }),
                            cc.scaleTo(0.05, 1),
                            cc.callFunc(() => {
                                if (!isMulti) {this.doActions();}
                            })
                        ))
                    }
                })
            ));
        });
    },

    /**动作：下落
     * @ param {cc.v2} start 开始位置坐标
     * @ param {cc.v2} dest 结束位置坐标
     * @ param {string} newType:可选 当需要生成新方块的时候，需要这个参数。新方块的类型 
     * @ param {boolean} isDown:可选 当前下落是否全部下落完成
     */
    actDown (start, end, newType, isAllDown = false) {
        let startNode = this.cells[start.x][start.y];
        let endNode = this.cells[end.x][end.y];
        // startNode.stopAllActions();
        endNode.stopAllActions();
        if (!startNode || !endNode) return;
        let moveTime = 0.1 * (end.x - start.x);
        let endPos = cc.v2(endNode.position.x, endNode.position.y);
        if (newType) {
            endNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
        } else {
            endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(cc.Sprite).spriteFrame;
        }
        
        endNode.position = cc.v2(startNode.position.x, startNode.position.y);
        endNode.opacity = 255;
        startNode.opacity = 0; //
        endNode.runAction(cc.sequence(
            cc.spawn(cc.moveTo(moveTime, endPos), cc.scaleTo(0.1, 1, 1.2)),
            cc.scaleTo(0.1, 1, 0.9),
            cc.scaleTo(0.1, 1, 1),
            cc.callFunc(() => {
                if (isAllDown) {
                    this.doActions();
                }
            })
        ));
    },

    /**开始引导 */
    startGuide (pos) {
        let mask = this.mask1;
        // let animName = this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1 ? 'swipeHand2' : 'swipeHand';
        let handPos = this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1 ? cc.v2(90.669, -58.431) : cc.v2(31.011, -58.431);
        if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
            
            mask.opacity = 0;
            mask.active = true;
            mask.runAction(cc.sequence(
                cc.fadeTo(0.4, 255),
                cc.callFunc(() => {
                    this.setTouchListener();
                })
            ));
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
            this.setTouch2Listener();
        }
        this.hand.position = handPos;
        this.hand.opacity = 0;
        this.hand.active = true;
        this.hand.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.callFunc(() => {
                this.hand.getComponent(cc.Animation).play();
            })
        ));
    },

    /**隐藏引导 */
    hideGuide () {
        let mask = this.mask1;
        mask.stopAllActions();
        if (mask.opacity !== 0) {
            mask.runAction(cc.fadeOut(0.1));
        }
        this.hand.stopAllActions();
        this.hand.runAction(cc.sequence(
            cc.fadeOut(0.1),
            cc.callFunc(() => {
                this.hand.getComponent(cc.Animation).stop();
            })
        ));
        if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
            this.offTouchListener();
        } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
            this.offTouch2Listener();
        }
    },

    /**展示喝彩 */
    showCombo () {
        let combo = this.combos[this.comboTimes%this.combos.length];
        this.comboTimes++;
        combo.opacity = 0;
        combo.active = true;
        combo.scale = 1.2;
        combo.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.1), cc.scaleTo(0.1, 1)),
            cc.delayTime(0.15),
            cc.spawn(cc.moveTo(0.6, 0, 80), cc.fadeOut(0.6)),
            cc.callFunc(() => {
                combo.position = cc.v2(0, 0);
            })
        ));
    },

    /**展示光环 */
    showHuan () {
        let huan = cc.find('Canvas/center/game/effects/huan');
        // console.log('huan', huan);
        huan.opacity = 0;
        huan.active = true;
        huan.scale = 0;
        huan.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.1), cc.scaleTo(0.1, 0.6)),
            cc.scaleTo(0.1, 1),
            cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1.3)),
            cc.callFunc(() => {
                huan.active = false;
            })
        ));
    },

    flyRocket () {
        let rocket1 = cc.find('Canvas/center/game/effects/rocket1');
        let rocket2 = cc.find('Canvas/center/game/effects/rocket2');
        rocket1.active = true;
        rocket2.active = true;
        rocket1.runAction(cc.sequence(
            cc.moveBy(0.3, -300, 0),
            cc.callFunc(() => {
                rocket1.active = false;
            })
        ));
        rocket2.runAction(cc.sequence(
            cc.moveBy(0.3, 300, 0),
            cc.callFunc(() => {
                rocket2.active = false;
            })
        ));
    },

    playFirework () {
        let fire1 = cc.find('Canvas/center/game/effects/firework1');
        let fire2 = cc.find('Canvas/center/game/effects/firework2');
        let fire3 = cc.find('Canvas/center/game/effects/firework3');
        let fires = {fire1,fire2,fire3};
        fire1.getComponent(cc.ParticleSystem).resetSystem();
        fire2.getComponent(cc.ParticleSystem).resetSystem();
        this.gameController.getAudioUtils().playEffect('cheer', 0.2);
        this.gameInfo.fireInterval = setInterval(() => {
            for(let i=1; i<=3; i++) {
                setTimeout(() => {
                    let f = fires[`fire${i}`];
                    f.position = cc.v2(Math.random()*600-300, Math.random()*600-300);
                    f.getComponent(cc.ParticleSystem).resetSystem();
                }, Math.random()*1000);
            }
        }, 2500);
    },

    start () {},

    // update (dt) {},
});
