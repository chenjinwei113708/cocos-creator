
import {
    CARD_STATUS,
    CARD_VALUE,
    CARD_GROUP,
    LOST_GAME_CARD_NUM,
    ACTION_TYPE,
    CELL_TYPE
} from "../Model/ConstValue.js";

cc.Class({
    extends: cc.Component,

    properties: {
        card1: cc.Node, // 卡牌库的下一张卡
        kong1: cc.Node, // 第一组卡牌
        kong2: cc.Node, // 第二组卡牌
        kong3: cc.Node, // 第三组卡牌
        kong4: cc.Node, // 第四组卡牌
        kong5: cc.Node, // 第五组卡牌
        // kongBox: cc.Node, // 提示框
        // excellent: cc.Node, // 优秀
        // hint: cc.Node, // 提示
        // swipe: cc.Node, // 提示
        // golds: cc.Node, // 金币
        cardPrefab: cc.Prefab, // 卡牌预制资源
        cardSprites: [cc.SpriteFrame], // 卡牌图片
        mask1: cc.Node, // 指引遮罩
        mask2: cc.Node, // 指引遮罩
        hand: cc.Node, // 指引手
        lights: cc.Node, // 粒子特效
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.trash = cc.find('Canvas/center/game/trash');
        this.texts = cc.find('Canvas/center/game/texts');
        this.ppcard = cc.find('Canvas/center/game/ppcard');
        this.flycard = cc.find('Canvas/center/UI/flycard');
        
        this.gameInfo = {
            cardStatus: CARD_STATUS.CAN_MOVE, // 可选择卡片的状态
            speed: 2, // 下落一格所需时间 s
            speedFast: 0.1, // 下落一格所需时间 快速 s
            cardDistance: 86, // 卡片的距离
            isGameStarted: false, // 用户有没有开始游戏
            isFirstCard: true, // 是不是第一张卡
            isSecondCard: false, // 是不是第二张卡
            cardWidth: 78,
            cardHeight: 78,
            startPosY: -339, // 发牌的时候 y所在位置
            firstPosY: 263, // 每列的第一个牌的y坐标
            isAutoFall: false, // 是不是自由落下
            fallingCard: null, // 正在下落的牌
            sendCardTimes: 0,
            lightNum: 0, // 目前播放了几次粒子特效
            isReceivingPPCard: false, // 正在收钱
        };
        // 所有动作列表 节点(3,5)代表第3列，从上往下第5个
        this.actionLevel = [
            [
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,5), newType: 16, others: [
                    cc.v2(2,5),
                    cc.v2(3,4),
                    cc.v2(4,5),
                ]},
                {type: ACTION_TYPE.DOWN, nodes: [
                    {start: cc.v2(3,5), end: cc.v2(3,4), newType: undefined}
                ]},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,4), newType: 64, others: [
                    cc.v2(2,4),
                    cc.v2(4,4),
                ]},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,3), newType: 128, others: [
                    cc.v2(3,4),
                ]},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,2), newType: 256, others: [
                    cc.v2(3,3),
                ]},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,2), newType: 1024, others: [
                    cc.v2(2,2),
                    cc.v2(4,2),
                ]},
                {type: ACTION_TYPE.DOWN, nodes: [
                    {start: cc.v2(2,3), end: cc.v2(2,2), newType: undefined},
                    {start: cc.v2(4,3), end: cc.v2(4,2), newType: undefined}
                ]},
                {type: ACTION_TYPE.COMBINE, center: cc.v2(3,1), newType: 2048, others: [
                    cc.v2(3,2),
                ]},
            ],
            [
                {type: ACTION_TYPE.CHANGE, center: cc.v2(0, 0), newType: CELL_TYPE.CPP},
            ]
        ];
        // 下一步要执行的动作列表
        this.actionList = [];
        
        this.showPPcard();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    changeToNextLevel () {
        if (this.actionLevel.length === 0){
            this.gameController.getAudioUtils().playEffect('cheer', 0.55);
            this.gameController.guideView.showCashOutHand();
            // this.offTouchListener();
            return;
        }
        let nextList = this.actionLevel.splice(0, 1)[0];
        this.actionList.push(...nextList);
        this.setCardStatus(CARD_STATUS.CAN_MOVE);
        // this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];
        // this.startGuide();
    },

    /**执行动作序列 */
    doActions () {
        this.hideGuide();
        if (this.actionList.length > 0) {
            let action = this.actionList.splice(0, 1)[0];
            // console.log('doActions action.type::', action.type);
            switch (action.type) {
                case ACTION_TYPE.SWITCH:
                    this.actSwitch(action.start, action.end);
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
                case ACTION_TYPE.CHANGE:
                    // this.gameController.getAudioUtils().playEffect('change', 0.5);
                    // this.showCool();
                    this.actChange(action.center, action.newType);
                    // setTimeout(() => {
                        
                    // }, 900);
                    break;
                case ACTION_TYPE.BOMB:
                    this.showBombAnim();
                    this.actBomb();
                    break;
                case ACTION_TYPE.DOWN:
                    action.nodes.forEach((item, index) => {
                        let done = false;
                        if (index >= action.nodes.length-1) {done = true;}
                        setTimeout(() => {
                            this.actDown(item.start, item.end, item.newType, done);
                        }, index*30);
                    });
                    
                    break;
                default: break;
            }
        } else {
            this.showFlyCard();
            this.clearTrash();
        }
    },

    /**拿到坐标对应的节点
     * @param {cc.v2} pos 坐标,x代表列，y代表从上往下数的第几个
     * @return {cc.Node} 对应的节点
     */
    getPosNode (pos) {
        let zu = this[`kong${pos.x}`];
        let node = zu.children[pos.y-1];
        return node;
    },

    /**发牌 */
    sendCard () {
        if (this.gameInfo.cardStatus === CARD_STATUS.CAN_MOVE) {
            this.gameInfo.sendCardTimes++;
            this.setCardStatus(CARD_STATUS.IS_MOVE);
            let nowCardValue = this.gameController.gameModel.getNowCard();
            let sendGroup = this.gameController.gameModel.getNextGroup();
            let groupName = CARD_GROUP[`KONG${sendGroup}`];
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            // 修改下一准备发的张卡
            this.gameController.gameModel.generateNewCard();
            let nextCardValue = this.gameController.gameModel.getNowCard();
            // this.card1.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(nextCardValue)];
            // 发卡，让卡片自动落下
            let newCard = cc.instantiate(this.cardPrefab);
            this.gameInfo.fallingCard = newCard;
            newCard.parent = this[groupName];
            newCard._name = nowCardValue;
            newCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(nowCardValue)];
            newCard.position = cc.v2(0, this.gameInfo.startPosY);
            newCard.active = true;
            this.gameInfo.isAutoFall = true;
            let fallAction = cc.sequence(
                cc.moveTo(groupLeftBox*this.gameInfo.speed, cc.v2(0, this.gameInfo.firstPosY-(LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    if (this.gameInfo.isAutoFall) {
                        this.gameInfo.isAutoFall = false;
                        this.setCardStatus(CARD_STATUS.DONE_MOVE);
                        // console.log('auto fall done, ', newCard);
                        this.addCardToGroup(groupName, newCard, false, this.completeCard.bind(this));
                    }
                }),
            );
            newCard.runAction(fallAction);
            if (this.gameInfo.isFirstCard) {
                setTimeout(() => {
                    if (this.gameInfo.isFirstCard) {
                        newCard.stopAction(fallAction);
                        this.setGuideMask(1);
                    }
                }, 800);
            } else if (this.gameInfo.isSecondCard) {
                setTimeout(() => {
                    if (this.gameInfo.isSecondCard) {
                        newCard.stopAction(fallAction);
                        this.setGuideMask(2);
                    }
                }, 800);
            }
            
        }
    },

    /**点击切换分组 */
    click2ChangeGroup (touchEvent, groupName) {
        if (this.gameInfo.cardStatus === CARD_STATUS.IS_MOVE && this.gameInfo.isAutoFall) {
            this.setCardStatus(CARD_STATUS.USER_MOVE);
            // console.log('click2ChangeGroup:: ,', groupName);
            if (this.gameInfo.isFirstCard) {
                if (groupName !== CARD_GROUP.KONG3) return;
                // this.gameInfo.isFirstCard = false;
                // this.gameInfo.isSecondCard = true;
                this.hideGuide();
            } else if (this.gameInfo.isSecondCard) {
                if (groupName !== CARD_GROUP.KONG3) return;
                // this.gameInfo.isSecondCard = false;
                this.hideGuide();
            }
            this.gameInfo.isAutoFall = false;
            if (!this.gameInfo.fallingCard) return;
            let card = this.gameInfo.fallingCard;
            let groupLeftBox = this.gameController.gameModel.getLeftDistance(groupName);
            let dropSpeed = 0.15;
            card.stopAllActions();
            if (card.parent._name !== groupName) {
                card.parent = this[groupName];
                card.position = cc.v2(0, this.gameInfo.startPosY);
                dropSpeed = groupLeftBox*this.gameInfo.speedFast;
            }
            card.runAction(cc.sequence(
                cc.moveTo(dropSpeed, cc.v2(0, this.gameInfo.firstPosY-(LOST_GAME_CARD_NUM-groupLeftBox)*this.gameInfo.cardDistance)),
                cc.callFunc(() => {
                    this.setCardStatus(CARD_STATUS.DONE_MOVE);
                    // console.log('click fall done, ', card);
                    this.addCardToGroup(groupName, card, false, this.completeCard.bind(this));
                }),
            ));
        }
    },

    /**当前卡片摆放完成 */
    completeCard () {
        this.gameInfo.fallingCard = null;
        // this.setCardStatus(CARD_STATUS.CAN_MOVE);
        // this.gameController.addCash(80);
        // this.gameController.guideView.showPaypalCardFly(() => {
        //     if (this.gameInfo.sendCardTimes < 3) {
        //         this.sendCard();
        //     } else {
        //         // this.gameController.getAudioUtils().playEffect('cheer', 0.55);
        //         this.gameController.guideView.showCashOutHand();
        //     }
        // });
    },

    /**把牌最终加到某一组里面去 */
    addCardToGroup (groupName, cardNode, isAuto, callback) {
        if (this.gameInfo.cardStatus !== CARD_STATUS.DONE_MOVE) return;
        this.doActions();
        return;
        let combine = this.gameController.gameModel.insertCard(groupName, Number(cardNode._name), isAuto);
        if (combine > 0) { // 合成了新牌
            console.log('combine', combine);
            let lastCard = this[groupName].children[this[groupName].children.length-2]; // 数组的倒数第二张牌
            let destPos = cc.v2(lastCard.position.x, lastCard.position.y);
            lastCard._name = combine;
            lastCard.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(combine)];
            lastCard.position = cc.v2(cardNode.position.x, cardNode.position.y);
            
            cardNode.active = false;
            cardNode.parent = this.node;
            cardNode.destroy();

            // this.gameController.getAudioUtils().playEffect('combine', 0.4);
            lastCard.runAction(cc.sequence(
                cc.repeat(cc.sequence(cc.rotateTo(0.09, 11), cc.rotateTo(0.09, -11)), 3),
                cc.spawn(cc.rotateTo(0.06, 0), cc.moveTo(0.12, destPos)),
                cc.callFunc(() => {
                    this.addCardToGroup(groupName, lastCard, true, callback);
                })
            ));
        } else { // 没合成新牌
            let groupLength = this.gameController.gameModel.getGroupLength(groupName);
            if (groupLength >= LOST_GAME_CARD_NUM) {
                this.lostGame();
            } else {
                callback && callback();
            }
        }
    },

    /**设置提示
     * @ param {number} 第几关，从1开始
     */
    setGuideMask (level) {
        if (this.gameInfo.cardStatus !== CARD_STATUS.IS_MOVE) return;
        if (level === 1 && this.gameInfo.isFirstCard) {
            // 如果是第一张卡
            this.mask1.opacity = 0;
            this.mask1.active = true;
            this.mask1.runAction(cc.fadeTo(0.6, 100));
            this.hand.opacity = 0;
            this.hand.active = true;
            this.hand.position = cc.v2(23.63, 262.299);
            this.hand.runAction(cc.fadeIn(0.3));
            this.hand.getComponent(cc.Animation).play();
        } else if (level === 2 && this.gameInfo.isSecondCard) {
            // 如果是第二张卡
            this.mask2.opacity = 0;
            this.mask2.active = true;
            this.mask2.runAction(cc.fadeTo(0.6, 100));
            this.hand.opacity = 0;
            this.hand.active = true;
            this.hand.position = cc.v2(23.63, 262.299);
            this.hand.runAction(cc.fadeIn(0.3));
            this.hand.getComponent(cc.Animation).play();
        }
    },

    /**隐藏提示 */
    hideGuide () {
        if (this.hand.active) {
            this.mask1.active = false;
            this.mask2.active = false;
            this.hand.getComponent(cc.Animation).stop();
            this.hand.active = false;
        }
    },

    /**
     * 展示粒子特效
     * @param {cc.v2} pos 
     */
    showLightEffect (pos, newNumber=64) {
        let light = this.lights.children[this.gameInfo.lightNum%this.lights.children.length];
        this.gameInfo.lightNum++;
        light.active = true;
        light.position = cc.v2(pos.x, pos.y);
        light.getComponent(cc.ParticleSystem).resetSystem();

        let text = this.texts.children[this.gameInfo.lightNum%this.texts.children.length];
        text.scale = 0.3;
        text.position = cc.v2(0, -250);
        text.active = true;
        text.getComponent(cc.Label).string = `+${newNumber}`;
        text.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.1, 1.15), cc.fadeIn(0.1)),
            cc.spawn(cc.scaleTo(1, 0.8), cc.moveTo(1.2, cc.v2(0, 300)), cc.fadeTo(1, 100)),
            cc.fadeOut(0.1)
        ));

    },

    lostGame () {
        console.log('game lost');
        this.gameInfo.fallingCard = null;
        this.setCardStatus(CARD_STATUS.LOST_GAME);
    },

    /**
     * 把合并的节点从原来的父节点上移除，移到垃圾箱节点。因为不能直接删除节点，否则动作会终止。
     * @param {cc.Node} node 
     */
    removeToTrash (node) {
        node.opacity = 0;
        node.parent = this.trash;
    },

    /**清空垃圾节点里面的子节点 */
    clearTrash () {
        this.trash.children.forEach(each => {
            each.runAction(cc.removeSelf());
        })
    },

    /**设置卡片状态 */
    setCardStatus (status) {
        this.gameInfo.cardStatus = status;
    },

    start () {},

    showPPcard () {
        this.ppcard.opacity = 0;
        this.ppcard.active = true;
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);

        this.mask2.opacity = 0;
        this.mask2.active = true;
        this.mask2.runAction(cc.fadeTo(0.5,180));
        this.ppcard.runAction(cc.sequence(
            cc.fadeIn(0.5),
            cc.callFunc(() => {
                let hand = this.ppcard.getChildByName('hand');
                hand.opacity = 0;
                hand.active = true;
                hand.runAction(cc.fadeIn(0.2));
                hand.getComponent(cc.Animation).play();
            })
        ));
    },

    receivePPcard () {
        if (this.gameInfo.isReceivingPPCard) return;
        this.mask2.active = false;
        this.gameInfo.isReceivingPPCard = true;
        this.gameController.addCash(5000);
        this.gameController.getAudioUtils().playEffect('coin', 0.5);
        this.changeToNextLevel();
        this.sendCard();
        this.ppcard.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(()=>{
                this.gameInfo.isReceivingPPCard = false;
                this.ppcard.active = false;
            })
        ));
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

    /**动作：合并
     * @ param {cc.v2} center 中心合并位置坐标
     * @ param {[cc.v2]} other 其他点的位置坐标 数组
     * @ param {string} newType 需要合成什么类型
     * @ param {boolean} isMulti 是否同时合成多个
     */
    actCombine (center, others, newType, isMulti=false) {
        let centerNode = this.getPosNode(center);
        if (!centerNode) return;
        let centerPos = cc.v2(centerNode.position.x, centerNode.position.y);
        let otherNodes = others.map(other => {return this.getPosNode(other);});
        const moveTime = 0.05;
        let originPos = [];
        otherNodes.forEach((other, index) => {
            originPos[index] = cc.v2(other.position.x, other.position.y);
            other.runAction(cc.sequence(
                cc.moveTo(moveTime, centerPos),
                cc.callFunc(() => {
                    other.opacity = 0;
                    // other.position = originPos[index];
                    if (index === otherNodes.length-1) {
                        this.gameController.getAudioUtils().playEffect('merge', 0.4);
                        // this.gameController.guideView.showFlyCoin(centerPos);
                        // this.showFlyCards(7);
                        // setTimeout(() => {this.gameController.addCash(100);}, 300);
                        centerNode.runAction(cc.sequence(
                            // cc.scaleTo(0.05, 1.1),
                            // cc.scaleTo(0.05, 0.9),
                            cc.callFunc(() => {
                                this.showLightEffect(centerNode.position, newType);
                                centerNode.getComponent(cc.Sprite).spriteFrame = this.cardSprites[CARD_VALUE.indexOf(newType)];
                                // this.showCombo();
                            }),
                            cc.scaleTo(0.05, 1),
                            cc.callFunc(() => {
                                if (!isMulti) {
                                    // console.log('actCombine -> doActions');
                                    setTimeout(() => {this.doActions();}, 60);
                                }
                                // console.log('actCombine -> doActions before remove');
                                this.removeToTrash(other);
                            })
                        ))
                    } else {
                        this.removeToTrash(other);
                    }
                }),
                // cc.delayTime(0.1),
                // cc.callFunc(() => {
                //     if (index === otherNodes.length-1) {
                //         //
                //     } else {
                //         other.runAction(cc.removeSelf());
                //     }
                // })
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
        let startNode = this[`kong${start.x}`].children[this[`kong${start.x}`].children.length-1];
        // let endNode = this.getPosNode(end);
        if (!startNode) return;
        let moveTime = 0.02 * (start.y - end.y);
        let endPos = cc.v2(startNode.position.x, this.gameInfo.firstPosY-(end.y-1)*this.gameInfo.cardDistance);
        // console.log(' --->> end:: y1:', startNode.position.y, '  y2:', endPos.y);
        // if (newType) {
        //     endNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
        // } else {
        //     endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(cc.Sprite).spriteFrame;
        // }
        
        // endNode.position = cc.v2(startNode.position.x, startNode.position.y);
        // endNode.opacity = 255;
        // console.log('actDown ---');
        startNode.opacity = 255;
        startNode.runAction(cc.sequence(
            cc.spawn(cc.moveTo(moveTime, endPos), cc.scaleTo(moveTime, 0.8)),
            cc.scaleTo(0.03, 1),
            cc.delayTime(0.03),
            cc.callFunc(() => {
                if (isAllDown) {
                    this.doActions();
                }
            })
        ));
    },

    /**动作：变换
     * @ param {cc.v2} center 中心位置坐标
     * @ param {string} newType 需要变成什么类型
     */
    actChange (center, newType) {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 7; j++) {
                if (i === center.x && j === center.y) { continue; }
                let node = this.getPosNode(cc.v2(i, j));
                if (newType === CELL_TYPE.CPP) {
                    node.getComponent(cc.Sprite).spriteFrame = this.cardSprites[11];
                }
                node.opacity = 0;
                node.active = true;
                node.runAction(cc.sequence(
                    cc.spawn(cc.scaleTo(0.1, 1.15), cc.fadeIn(0.1)),
                    cc.scaleTo(0.1, 0.5),
                    cc.scaleTo(0.05, 1),
                    cc.rotateTo(0.1, -15),
                    cc.callFunc(() => {
                        node.runAction(cc.repeat(cc.sequence(cc.rotateTo(0.3, 15), cc.rotateTo(0.3, -15)), 5)); 
                        if (i === 5 && j === 7) {
                            setTimeout(() => {this.ppcardFlyToTop();}, 100);
                            // this.showFlyCards(7);
                            // setTimeout(() => {this.gameController.addCash(100);}, 300);
                            // this.doActions();
                        }
                    })
                ));
            }
        }
    },

    /**动作：爆炸 */
    actBomb () {
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                let node = this.getPosNode(cc.v2(i,j));
                node.runAction(cc.sequence(
                    cc.scaleTo(0.1, 1.15),
                    cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 0.5)),
                    cc.callFunc(() => {
                        node.getChildByName('light').active = false;
                        node.getChildByName('cppIcon').active = false;
                        node.scale = 1;
                    }),
                    cc.callFunc(() => {
                        if (i === 5 && j === 5) {
                            this.showFlyCards(11);
                            setTimeout(() => {this.gameController.addCash(500);}, 300);
                            this.doActions();
                        }
                    })
                ));
            }
        }
    },

    /**改变棋盘 */
    changeBoard () {
        let cells1 = cc.find('Canvas/center/game/cells');
        let cells2 = cc.find('Canvas/center/UI/cells2');

        cells2.opacity = 0;
        cells2.active = true;

        this.gameController.getAudioUtils().playEffect('change', 0.4);
        cells1.runAction(cc.sequence(
            cc.fadeOut(0.1),
            cc.callFunc(() => {
                cells2.runAction(cc.sequence(
                    cc.fadeIn(0.1),
                    cc.callFunc(() => {
                        this.removeToTrash(cells1);
                        // this.cells = cells2;
                        this.kong1 = cells2.getChildByName('kong1');
                        this.kong2 = cells2.getChildByName('kong2');
                        this.kong3 = cells2.getChildByName('kong3');
                        this.kong4 = cells2.getChildByName('kong4');
                        this.kong5 = cells2.getChildByName('kong5');
                        // this.sendCard();
                        // this.clearTrash();
                        this.doActions();
                    })
                ))
            })
        ));

    },

    showFlyCard () {
        let ppicon = cc.find('Canvas/center/UI/paypal/icon');
        let pp = cc.find('Canvas/center/UI/paypal');
        let ui = cc.find('Canvas/center/UI');

        let destPos = ui.convertToNodeSpaceAR(pp.convertToWorldSpaceAR(ppicon.position));
        this.flycard.scale = 0.1;
        this.flycard.position = cc.v2(0, 0);
        this.flycard.opacity = 0;
        this.flycard.active = true;
        this.flycard.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.3, 1.1)),
            cc.scaleTo(0.15, 0.9),
            cc.scaleTo(0.15, 1),
            cc.callFunc(() => {
                // this.gameController.getAudioUtils().playEffect('coin', 0.4);
                // this.gameController.addCash(100);
            }),
            cc.delayTime(0.6),
            cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.6)),
            cc.callFunc(() => {
                if (this.gameInfo.isFirstCard) {
                    this.gameInfo.isFirstCard = false;
                    this.gameInfo.isSecondCard = true;
                    this.changeBoard();
                }
                this.changeToNextLevel();
            }),
            cc.fadeOut(0.15),
        ));
    }, 

    /**全部pp卡飞到顶部 */
    ppcardFlyToTop (callback) {
        let index = 0;
        let ppicon = cc.find('Canvas/center/UI/paypal/icon');
        let pp = cc.find('Canvas/center/UI/paypal');
        let ui = cc.find('Canvas/center/UI');

        let destPos = ui.convertToNodeSpaceAR(pp.convertToWorldSpaceAR(ppicon.position));
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 7; j++) {
                let node = this.getPosNode(cc.v2(i, j));
                setTimeout(() => {
                    node.stopAllActions();
                    node.runAction(cc.sequence(
                        cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.6), cc.fadeTo(0.3, 100)).easing(cc.easeOut(2.0)),
                        cc.fadeOut(0.1),
                        cc.callFunc(() => {
                            if (i === 5 && j === 7) {
                                this.gameController.addCash(5000);
                                this.gameController.getAudioUtils().playEffect('coin', 0.4);
                                // this.showFlyCards(7);
                                // setTimeout(() => {}, 300);
                                // this.doActions();
                                callback && callback();
                                this.changeToNextLevel();
                            }
                        })
                    ));
                }, 40*index);
                index++;
            }
        }
    }

    // update (dt) {},
});
