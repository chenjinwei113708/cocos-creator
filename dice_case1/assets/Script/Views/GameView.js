import {
    // GAME_LEVEL,
    CELL_TYPE,
    ACTION_TYPE,
    CELL_STATUS
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        ppcard: cc.Node, // 现金卡片
        box: cc.Node, // 棋盘
        paypal: cc.Node, // 顶部栏
        // 不同类型的图
        sprite5: cc.SpriteFrame,
        sprite10: cc.SpriteFrame,
        sprite20: cc.SpriteFrame,
        sprite50: cc.SpriteFrame,
        sprite100: cc.SpriteFrame,
        spritePP: cc.SpriteFrame,
        spritePPcard: cc.SpriteFrame,
        spritePPlight: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            // nowLevel: GAME_LEVEL.LEVEL1,
            cellStatus: CELL_STATUS.CAN_MOVE,
            direcDelay: 40, // 判断延时
            lastCheckTime: 0,  // 上次判断时间
            checkDistance: 20, // 移动最少的距离
            isPPcardReceived: false, // pp卡收取没有
            // nowTouch: null, // 上次点击的触碰点
            // nowTouchPos: null, // 上次点击的触碰点的位置
        };

        // 不同类型对应的图片
        this.sprites = {
            [CELL_TYPE.C5]: this.sprite5,
            [CELL_TYPE.C10]: this.sprite10,
            [CELL_TYPE.C20]: this.sprite20,
            [CELL_TYPE.C50]: this.sprite50,
            [CELL_TYPE.C100]: this.sprite100,
            [CELL_TYPE.CPP]: this.spritePP,
        };

        // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
        this.cells = [
            [undefined, ...this.box.getChildByName('kong0').children], // 这一行是看不见的
            [undefined, ...this.box.getChildByName('kong1').children],
            [undefined, ...this.box.getChildByName('kong2').children],
            [undefined, ...this.box.getChildByName('kong3').children],
            [undefined, ...this.box.getChildByName('kong4').children],
            [undefined, ...this.box.getChildByName('kong5').children],
        ];

        this.showPPcard();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setTouchListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, function ( event) {
        //     console.log('click, move');
        //     // this.actSwitch(cc.v2(4,2), cc.v2(3,2));
        //     this.doActions();
        // }, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
            this.gameController.getAudioUtils().playEffect('click', 0.5);
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            // console.log('onTouchStart, ', this.gameInfo.nowLevel);
            if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1 || this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
                // console.log('onTouchStart, touchPos', touchPos);
                if (touchPos.x >= this.touch1.position.x - this.touch1.width/2 &&
                    touchPos.x <= this.touch1.position.x + this.touch1.width/2 &&
                    touchPos.y >= this.touch1.position.y - this.touch1.height/2 &&
                    touchPos.y <= this.touch1.position.y + this.touch1.height/2) {
                        this.gameInfo.nowTouch = this.touch1;
                        this.gameInfo.lastCheckTime = Date.now();
                        this.gameInfo.nowTouchPos = touchPos;
                        this.setCellStatus(CELL_STATUS.IS_MOVE);
                        // console.log('onTouchStart, doActions');
                        this.doActions();
                        this.offTouchListener();
                }
            } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL3) {
                if (touchPos.x >= this.touch2.position.x - this.touch2.width/2 &&
                    touchPos.x <= this.touch2.position.x + this.touch2.width/2 &&
                    touchPos.y >= this.touch2.position.y - this.touch2.height/2 &&
                    touchPos.y <= this.touch2.position.y + this.touch2.height/2) {
                        this.gameInfo.nowTouch = this.touch2;
                        this.gameInfo.lastCheckTime = Date.now();
                        this.gameInfo.nowTouchPos = touchPos;
                        this.setCellStatus(CELL_STATUS.IS_MOVE);
                        this.doActions();
                }
            }
        }
        
    },
    onTouchMove (touch) {
        return;
        if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE &&
            Date.now() - this.gameInfo.lastCheckTime >= this.gameInfo.direcDelay) {
            let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
            if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
                if (this.gameInfo.nowTouch === this.touch1) {
                    if (touchPos.y - this.gameInfo.nowTouchPos.y > this.gameInfo.checkDistance) {
                        this.setCellStatus(CELL_STATUS.DONE_MOVE);
                        this.doActions();
                    }
                } else if (this.gameInfo.nowTouch === this.touch2) {
                    if (this.gameInfo.nowTouchPos.y - touchPos.y > this.gameInfo.checkDistance) {
                        this.setCellStatus(CELL_STATUS.DONE_MOVE);
                        this.doActions();
                    }
                }
            }
            if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2) {
                if (this.gameInfo.nowTouch === this.touch2) {
                    if (touchPos.x - this.gameInfo.nowTouchPos.x > this.gameInfo.checkDistance) {
                        this.setCellStatus(CELL_STATUS.DONE_MOVE);
                        this.doActions();
                    }
                } else if (this.gameInfo.nowTouch === this.touch4) {
                    if (this.gameInfo.nowTouchPos.x - touchPos.x > this.gameInfo.checkDistance) {
                        this.setCellStatus(CELL_STATUS.DONE_MOVE);
                        this.doActions();
                    }
                }
            }
        }
    },
    onTouchEnd (touch) {
        // if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
        //     this.setCellStatus(CELL_STATUS.CAN_MOVE);
        // }
    },



    showPPcard () {
        this.gameInfo.isPPcardReceived = false;
        this.ppcard.opacity = 0;
        this.ppcard.scale = 0;
        this.ppcard.active = true;
        // this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.4), cc.scaleTo(0.3, 1)),
            cc.callFunc(() => {
                let anim = this.ppcard.getComponent(cc.Animation).play();
                anim.on('finished', () => {
                    if (this.gameInfo.isPPcardReceived) return;
                    let hand = this.ppcard.getChildByName('hand');
                    hand.opacity = 0;
                    hand.active = true;
                    hand.runAction(cc.fadeIn(0.2));
                    hand.getComponent(cc.Animation).play();
                });
            })
        ));
    },

    receivePPcard () {
        if (this.gameInfo.isPPcardReceived) return;
        this.gameInfo.isPPcardReceived = true;
        this.gameController.addCash(100);
        this.gameController.getAudioUtils().playEffect('coin', 0.5);
        this.ppcard.getChildByName('hand').getComponent(cc.Animation).stop();
        this.ppcard.getChildByName('hand').active = false;
        this.ppcard.getComponent(cc.Animation).stop();
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 0)),
            cc.callFunc(()=>{
                this.ppcard.active = false;
            })
        ));
    },

    // start () {},

    // update (dt) {},
});
