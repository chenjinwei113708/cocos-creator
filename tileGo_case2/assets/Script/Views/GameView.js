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
    CELL_STATUS,
    CELL_TYPE,
    TYPE_MONEY
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        progress: cc.Node,
        firstNodes: [cc.Node], // 第一次合成要用的方块
        kuangs: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.put = this.node.getChildByName('put');
        this.pp = cc.find('Canvas/center/UI/pp');
        this.paypal = cc.find('Canvas/center/UI/paypal');
        this.hand = this.node.getChildByName('hand');
        this.grid = this.node.getChildByName('grid');
        this.cashes = cc.find('Canvas/center/game/cashes');
        this.info = {
            status: CELL_STATUS.CAN_MOVE,
            putArr: [], // 下方存放的格子，里面放的是string（格子的图片名称）
            bombTimes: 0, // 合成的次数
            isFirstClick: true, // 第一次点击
            waitCount: 0,
            waitTime: 2,  //s
            waitInterval: null, // 定时器
        };
        
    },

    start () {
        this.showFirstHand();
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    setStatus (status) {
        // console.log('--- setStatus', status);
        if (this.info.bombTimes >= 5) {
            setTimeout(() => {
                this.showPPcard();
            }, 600);
            return;
        } else if (this.info.bombTimes >=1){
            this.info.waitInterval && clearInterval(this.info.waitInterval);
            this.info.waitInterval = setInterval(() => {
                this.addWaitTime();
            }, 1000);
        }
        this.info.status = status;
    },

    addWaitTime () {
        this.info.waitCount++;
        if (this.info.waitCount >= this.info.waitTime) {
            this.hideGuideClick();
            this.showGuideClick();
        }
    },

    clickCell (event, data) {
        if (this.info.status === CELL_STATUS.CAN_MOVE) {
            this.setStatus(CELL_STATUS.IS_MOVE);
            // console.log(event.target);
            // console.log(event.target.getComponent(cc.Sprite).spriteFrame.name);
            let node = event.target;
            // 引导步骤
            if (this.info.bombTimes === 0) {
                let type = node.getComponent(cc.Sprite).spriteFrame.name;
                if (type !== CELL_TYPE.LOT) {
                    this.setStatus(CELL_STATUS.CAN_MOVE);
                    return;
                } else {
                    let del = this.firstNodes.findIndex(card => card.position.x === node.position.x && card.position.y === node.position.y);
                    // console.log('data ', data, ' del ', del);
                    this.firstNodes.splice(del, 1);
                    let kuang = this.kuangs.splice(del, 1)[0];
                    kuang.active = false;
                    // console.log('left:',this.firstNodes);
                    setTimeout(() => {
                        if (this.firstNodes.length > 0) {
                            let next = this.firstNodes[0];
                            this.hand.position = cc.v2(next.position.x, next.position.y);
                            this.hand.active = true;
                        }
                    }, 300);
                }
            }
            this.gameController.getAudioUtils().playEffect('bubble', 0.7);
            this.addToGroup(node);
        }
    },

    addToGroup (node) {
        let type = node.getComponent(cc.Sprite).spriteFrame.name;
        
        if (this.info.isFirstClick) {
            this.hideFirstHand();
            this.info.isFirstClick = false;
        }
        this.hideGuideClick();
        let index = this.info.putArr.length;
        if (index >= 7) return;
        // 将点击的卡置于最上方
        let grid = node.parent;
        grid.children.splice(grid.children.indexOf(node), 1);
        grid.children.push(node);
        // 将选中类型加入数组
        this.info.putArr.push(type);
        let target = this.put.children[index];
        target.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;
        let originPos = cc.v2(node.position.x, node.position.y);
        let destPos = this.node.convertToNodeSpaceAR(this.put.convertToWorldSpaceAR(target.position));
        node.runAction(cc.sequence(
            cc.moveTo(0.3, destPos),
            cc.callFunc(() => {
                node.position = originPos;
                node.active = false;
                target.active = true;
                target.scale = 1;
                target.opacity = 255;
                this.checkCombine();
            })
        ));
    },

    // 检查是否可以合成,是否有三个同种方块在数组中
    checkCombine () {
        let count = {};
        let indexes = {};
        let okType = undefined;
        for (let i = 0; i < this.info.putArr.length; i++) {
            // if (isOk) break;
            let type = this.info.putArr[i];
            if (count[type] === undefined) {
                count[type] = 1;
                indexes[type] = [];
                indexes[type].push(i);
            } else {
                count[type] += 1;
                indexes[type].push(i);
                if (count[type] >= 3) {
                    okType = type;
                    break;
                }
            }
        }
        if (okType !== undefined) {
            // console.log('有三个', okType)
            this.info.bombTimes++; // 合成次数加一
            this.gameController.getAudioUtils().playEffect('combine', 0.5);
            if (this.info.bombTimes === 1) {
                this.hideGreenHint();
            }
            let ids = indexes[okType]; // 同类型方块的下标
            let newArr = []; // 新的putArr
            let moveArrIds = []; // 需要移动到前面的方块的下标
            // 修改数据
            for (let i = 0; i < this.info.putArr.length; i++) {
                if (this.info.putArr[i] === okType) continue;
                newArr.push(this.info.putArr[i]);
                moveArrIds.push(i);
            }
            this.info.putArr = newArr;
            // 视图更新
            let destPos = this.pp.convertToNodeSpaceAR(
                this.paypal.convertToWorldSpaceAR(
                    this.paypal.getChildByName('icon').position
                )
            );
            ids.forEach((id, num) => {
                this.showPPFly(id, num, this.info.bombTimes, destPos, okType, ()=>{
                    this.moveCards(moveArrIds, newArr);
                });
            });
        } else {
            // console.log('没有三个')
            this.setStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    /**
     * 展示pp卡飞到顶部
     * @param {*} index 方块下标
     * @param {*} number 此次展示队列中第几个pp卡 (0-2)
     * @param {*} bombTimes 当前总合成次数
     * @param {*} destPos 移动目的地
     * @param {CELL_TYPE} okType 可以合成的类型
     */
    showPPFly (index, number, bombTimes, destPos, okType, callback) {
        // const addMoney = {
        //     1: 5,
        //     2: 15,
        //     3: 50,
        // };
        let card = this.put.children[index];
        let pp = this.pp.children[index];
        // 卡片动画
        card.runAction(cc.sequence(
            cc.repeat(cc.sequence(cc.rotateTo(0.1, 10), cc.rotateTo(0.1, -10)), 4),
            cc.rotateTo(0.05, 0),
            cc.scaleTo(0.3, 0),
            cc.callFunc(() => {
                if (number === 2) {
                    callback && callback();
                    this.gameController.getAudioUtils().playEffect('coin', 0.6);
                }
            })
        ));
        // pp修改文字
        let money = TYPE_MONEY[okType] || 50;
        pp.getChildByName('money').getComponent(cc.Label).string = `$${money}`;
        // pp卡动画
        let ppOri = cc.v2(pp.position.x, pp.position.y);
        pp.opacity = 0;
        pp.scale = 0;
        pp.active = true;
        pp.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1)),
            cc.delayTime(0.5+0.1*number),
            cc.moveTo(0.5, destPos),
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                pp.position = ppOri;
                if (number === 0) {
                    this.gameController.addCash(money*3);
                    // callback && callback();
                }
                if (number === 2) {

                }
            })
        ));
    },

    /**
     * 将底部放置区域右边的卡片全部移到左边
     * @param {*} moveArr 所有未爆炸的卡片(可能需要移动)在原来数组中的下标
     * @param {*} newPutArr 爆炸之后的数组存放的卡片
     */
    moveCards (moveArr, newPutArr) {
        if (moveArr.length>0) {
            let needMoveArr = []; // 需要移动的卡片的序号
            moveArr.forEach((id, num) => {
                if (id === num) return; // 如果是有序的，则无需移动（所在位置就是序号）
                needMoveArr.push(num);
                let node = this.put.children[id];
                node.runAction(cc.scaleTo(0.1, 0));
            });
            newPutArr.forEach((type, number) => {
                if (needMoveArr.indexOf(number) === -1) return; // 不需要移动
                let node = this.put.children[number];
                let sprite = this.put.children[moveArr[number]].getComponent(cc.Sprite).spriteFrame;
                node.getComponent(cc.Sprite).spriteFrame = sprite;
                node.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.scaleTo(0.1, 1),
                    cc.callFunc(() => {
                        if (number === newPutArr.length-1) {
                            this.setStatus(CELL_STATUS.CAN_MOVE);
                        }
                    })
                ));
            });
            if (needMoveArr.length === 0) {
                this.setStatus(CELL_STATUS.CAN_MOVE);
            }
        } else {
            this.setStatus(CELL_STATUS.CAN_MOVE);
        }
    },

    showFirstHand () {
        this.hand.opacity = 0;
        this.hand.active = true;
        let appearState = this.hand.getComponent(cc.Animation).play('appear');
        appearState.on('finished', () => {
            this.hand.getComponent(cc.Animation).play('shake');
        });
    },

    hideFirstHand () {
        this.hand.active = false;
    },

    hideGreenHint () {
        this.node.getChildByName('hint').active = false;
    },

    showPPcard () {
        let mask2 = this.node.getChildByName('mask2');
        let ppcard = this.node.getChildByName('ppcard');
        let money = ppcard.getChildByName('money');
        money.getComponent(cc.Label).string = `$${this.gameController.cashView.targetCash}`;
        mask2.opacity = 0;
        mask2.active = true;
        mask2.runAction(cc.fadeTo(0.4, 160));
        ppcard.scale = 0;
        ppcard.active = true;
        this.gameController.getAudioUtils().playEffect('moneyCard', 0.7);
        ppcard.runAction(cc.sequence(
            cc.scaleTo(0.3, 1.1),
            cc.scaleTo(0.2, 0.9),
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('cheer', 0.5);
            })
        ));
        this.showMoneyFly();
        this.gameController.endGame();
    },

    showGuideClick () {
        let node = this.grid.children.find(each => each.active);
        
        this.hand.position = cc.v2(node.position.x, node.position.y);
        this.hand.opacity = 0;
        this.hand.scale = 1;
        this.hand.active = true;
        this.hand.runAction(cc.fadeIn(0.3));
        // console.log('showGuideClick', this.hand);
        this.hand.getComponent(cc.Animation).play('shake');
    },

    hideGuideClick () {
        this.hand.active = false;
        this.info.waitInterval && clearInterval(this.info.waitInterval);
        this.info.waitCount = 0;
    },

    // 展示现金飘落
    showMoneyFly () {
        this.cashes.children.forEach((node, index) => {
            let oriX = -240 + Math.random() * 480;
            let oriY = 520 + (Math.random()-0.5) * 50;
            let destX = -260 + Math.random() * 520;
            let destY = -720 + (Math.random()-0.5) * 50;
            node.position = cc.v2(oriX, oriY);
            node.scale = 1.3;
            // node.skew.x = -15 + Math.random() * 30;
            // node.skew.y = -15 + Math.random() * 30;
            node.opacity = 0;
            node.active = true;
            node.runAction(cc.sequence(
                cc.delayTime(index*0.01+index*0.2*Math.random()),
                cc.spawn(cc.fadeIn(0.2), cc.moveTo(1.0+2.5*Math.random(), destX, destY), cc.rotateTo(1.5+0.8*Math.random(), 180+360*Math.random())),
                cc.fadeOut(0.2),
            ));
        });
    },

    // update (dt) {},
});
