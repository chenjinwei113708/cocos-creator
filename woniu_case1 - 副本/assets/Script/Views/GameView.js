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
    SNAIL_LEVEL,
    GAME_STATUS,
    GAME_SCENE
} from "../Model/ConstValue.js";

cc.Class({
    extends: cc.Component,

    properties: {
        bookSnail: cc.Node,
        // roomSnail: cc.Node,
        battleSnail: cc.Node,
        // jiujiSprite: cc.SpriteFrame,
        // chaojiujiSprite: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.book = cc.find('Canvas/center/game/book'); // 场景一：书本
        this.room = cc.find('Canvas/center/game/room'); // 场景二：改造房间
        this.battle = cc.find('Canvas/center/game/battle'); // 场景三：战场
        this.countDownView = cc.find('Canvas/center/UI/countDown').getComponent('CountDownView'); // 获取计时器
        this.bookHand = this.book.getChildByName('hand');
        this.arrows = this.book.getChildByName('arrow').children;
        this.roomView = this.room.getComponent('RoomView');
        this.battleView = this.room.getComponent('BattleView');

        this.leftLevels = [SNAIL_LEVEL.JIUJI, SNAIL_LEVEL.CHAOJIUJI]; // 还未进化的等级

        // 游戏信息
        this.info = {
            status: GAME_STATUS.CAN_CLICK,
            snailLevel: SNAIL_LEVEL.CHENGSHU, // 蜗牛等级
            levelSprite: { // 不同等级对应的图片
                [SNAIL_LEVEL.JIUJI]: this.jiujiSprite,
                [SNAIL_LEVEL.CHAOJIUJI]: this.chaojiujiSprite,
            },
            currentSnail: this.bookSnail, // 当前展示的蜗牛节点
            currentSnailView: null,
            gameScene: GAME_SCENE.BOOK,
        };

        // 变量
        this.stopBookHand = null; // 存储停止开始执行手的变量
    },

    start () {
        this.countDownView.startCountDown(3, this.showBookHand.bind(this));
        this.arrowShake();
    },

    /**箭头摆动 */
    arrowShake() {
        this.arrows.forEach((node, index) => {
            const isReserve = index % 2 !== 0;
            node.runAction(cc.repeatForever(cc.sequence(
                cc.rotateTo(0.2, -1 * (isReserve ? 10 : -10)),
                cc.rotateTo(0.4, isReserve ? 10 : -10),
                cc.rotateTo(0.2, 0)
            )))
        })
    },

    showBookHand() {
        this.gameController.guideView.myFadeIn(this.bookHand, () => {
            this.stopBookHand = this.gameController.guideView.myClickHere(this.bookHand);
        });
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setGameStatus (status) {
        this.info.status = status;
    },

    setGameScene (scene) {
        this.info.gameScene = scene;
    },

    /**选择蜗牛 */
    pickSnail (e) {
        if (this.info.status === GAME_STATUS.CAN_CLICK && this.info.gameScene === GAME_SCENE.BOOK) {
            const speed = 0.7
            const endScale = 2
            // console.log(e)
            // 把蜗牛切换到room的平台上面
            this.info.currentSnailView = e.target.getComponent('SnailView');
            this.currentSnail = this.info.currentSnailView.snail;
            this.currentSnail.parent = this.node;
            this.currentSnail.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.scaleTo(speed, endScale),
                        cc.moveTo(speed, cc.v2(130, 0))
                    ),
                    cc.callFunc(() => {
                        this.setGameStatus(GAME_STATUS.CAN_CLICK);
                        this.info.currentSnailView.showBgParticle(); // 展示粒子效果
                    })
                )
            );

            this.setGameStatus(GAME_STATUS.IS_PLAYING);
            this.bookHand.stopMyAnimation && this.bookHand.stopMyAnimation(); // 停止指引手
            this.change2Room(); // 切换到room
        }
    },

    /**把场景切换到改造房间 */
    change2Room () {
        // 关闭book的引导手
        this.stopBookHand && this.stopBookHand();
        this.countDownView.stopCountDown();
        // 关闭书本
        this.book.runAction(cc.sequence(
            cc.fadeOut(1),
            cc.callFunc(() => {
                console.log('this.book deactive');
                this.book.acitve = false;
                
            })
        ));
        // 从右边移到左边
        const oriRoomPos =  cc.v2(this.room.position.x, this.room.position.y);
        this.room.active = true;
        this.room.position = cc.v2(oriRoomPos.x+300, oriRoomPos.y);
        this.room.runAction(cc.sequence(
            cc.moveTo(0.2, cc.v2(oriRoomPos.x-30, oriRoomPos.y)),
            cc.moveTo(0.1, oriRoomPos),
            cc.callFunc(() => {

                this.info.currentSnail = this.roomSnail; // 设置当前节点
                this.setGameScene(GAME_SCENE.ROOM); // 设置游戏状态
                // this.setGameStatus(GAME_STATUS.CAN_CLICK);
            })
        ));
    },

    /**把场景切换到战场 */
    change2Battle () {
        this.room.runAction(cc.sequence(
            cc.fadeOut(1),
            cc.callFunc(() => {
                this.room.acitve = false;
            })
        ));
        const oriBattlePos =  cc.v2(this.battle.position.x, this.battle.position.y);
        this.battle.active = true;
        this.battle.position = cc.v2(oriBattlePos.x+300, oriBattlePos.y);
        this.battle.runAction(cc.sequence(
            cc.moveTo(0.2, cc.v2(oriBattlePos.x-20, oriBattlePos.y)),
            cc.moveTo(0.1, oriBattlePos),
            cc.callFunc(() => {
                this.info.currentSnail = this.battleSnail;
                this.setGameScene(GAME_SCENE.BATTLE);
                this.setGameStatus(GAME_STATUS.CAN_CLICK);
            })
        ));
    },

    /**进化 */
    click2Upgrade () {
        if (this.info.status === GAME_STATUS.CAN_CLICK && this.leftLevels.length > 0 && this.info.gameScene === GAME_SCENE.ROOM) {
            this.setGameStatus(GAME_STATUS.IS_PLAYING);
            const level = this.leftLevels.splice(0, 1)[0];
            // const sprite = this.info.levelSprite[level];
            // const snail = this.info.currentSnail;
            // 蜗牛变形
            this.info.currentSnailView.showNextForm()

            this.updateWord(); // 更新文字
            this.roomView.stopRoomHand(); // 隐藏room提示手

            // 设置可以点击状态 / 出现选择boss页面
            this.roomView.updateLevel(() => {
                if (this.leftLevels.length > 0) {
                    // 还可以进化
                    this.setGameStatus(GAME_STATUS.CAN_CLICK);
                } else {
                    // 进化完了
                    setTimeout(() => {
                        this.showSelection();
                    }, 200);
                }
            })
        }
    },

    /**更新蜗牛进化时的文字 */
    updateWord() {
        const box = this.room.getChildByName('box');
        let wordIndex = this.leftLevels.length === 0 ? 2 : 1;
        let prev = box.children[wordIndex - 1];
        let next = box.children[wordIndex];
        let oriPos = next.position;
        next.opacity = 0
        next.position = cc.v2(next.x, next.y - 40);
        prev.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(0.3, cc.v2(0, 40)),
                cc.fadeOut(0.3)
            ),
            cc.callFunc(() => {
                prev.active = false;
                next.active = true;
                next.runAction(cc.spawn(
                    cc.fadeIn(0.1),
                    cc.moveTo(0.1, oriPos)
                ))
            })
        ))
    },


    /**展示选择boss的界面 */
    showSelection () {
        const btn = this.room.getChildByName('btn01');
        const level = this.room.getChildByName('level01');
        const select = this.room.getChildByName('select');
        [btn, level].forEach(item => {
            item.runAction(cc.sequence(
                cc.spawn(cc.moveBy(0.2, 0, -100), cc.fadeOut(0.3)),
                cc.callFunc(() => {
                    item.active = false;
                })
            ));
        });
        select.opacity = 0;
        select.active = true;
        select.position = cc.v2(select.position.x, select.position.y-100);
        select.runAction(cc.sequence(
            cc.spawn(cc.moveBy(0.2, 0, 100), cc.fadeIn(0.3)),
            cc.callFunc(() => {
                this.setGameStatus(GAME_STATUS.CAN_CLICK);
            })
        ))
    },

    /**点击选择了boss */
    clickSelectBoss () {
        if (this.info.status === GAME_STATUS.CAN_CLICK && this.info.gameScene === GAME_SCENE.ROOM) {
            this.setGameStatus(GAME_STATUS.IS_PLAYING);
            this.change2Battle();
        }
    },

    // update (dt) {},
});
