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
    DIRECTION
} from '../Model/ConstValue.js';

cc.Class({
    extends: cc.Component,

    properties: {
        coinPrefab: cc.Prefab, // 金币预制资源
        gradePrefab: cc.Prefab, // 积分预制资源
        flyGrades: cc.Node, // 积分所在的父节点
        coins: cc.Node, // 金币所在的父节点
        moveBrick: cc.Node, // 移动的砖块
        allBricks: cc.Node, // 所有砖块
        gold: cc.Node, // 获得的金币
        ppcard50: cc.Node, // 50的现金卡
        ppcard100: cc.Node, // 100的现金卡
        ppcard150: cc.Node, // 150的现金卡
        gameHand: cc.Node, // 游戏指引手
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            shootDelay: 750, // 发射间隔 ms
            lastShootTime: 0, // 上次发射的时间 时间戳 ms
            coinY: 232,  // 金币位置 y
            coinMinX: -173.9, // 金币位置 x1
            coinMaxX: 173.9, // 金币位置 x2
            isUserClick: false, // 用户是否正在点击
            clickNumber: 4, // 用户点击的时候一次掉几个金币
            isPaused: false, // 是否暂停掉金币
            getCashTimes: 1, // 获得现金的次数
            isPPCardShow: false, // 现金卡展示中
            isSeven: false, // 是不是出现了777
            tmpGoldNum: 0, // 第二次点击完pp卡还有多少金币
            isGameStarted: false, // 游戏开始没
            GRADE: { // 每一格各获得多少金币
                grade1: 1,
                grade2: 3,
                grade3: 3,
                grade4: 5,
                grade5: 9,
                grade6: 2,
                grade7: 7,
                grade8: 3,
                grade9: 2,
            },
            stopCoin: [] // 停住的金币
        };
        this.goldView = this.gold.getComponent('GoldView');
        // 金币结点池
        this.coinPool = new cc.NodePool();
        let initCount = 30;
        for (let i = 0; i < initCount; ++i) {
            let coin = cc.instantiate(this.coinPrefab); // 创建节点
            this.coinPool.put(coin); // 通过 put 接口放入对象池
        }
        // console.log('初始化', initCount, ' 个金币');

        // 积分结点池
        this.gradePool = new cc.NodePool();
        for (let i = 0; i < initCount; ++i) {
            let tgrade = cc.instantiate(this.gradePrefab); // 创建节点
            this.gradePool.put(tgrade); // 通过 put 接口放入对象池
        }

        this.startPhysicEngine();
        this.enabled = false; // 允许update
        this.showPPCard(100);
    },

    // start () {},

    setGameController(gameController) {
        this.gameController = gameController;
    },

    startGame () {
        this.gameHand.opacity = 0;
        this.gameHand.active = true;
        this.gameHand.runAction(cc.fadeIn(0.2));
        this.brickStartMove();
        this.setTouchListener();
    },

    /**打开物理引擎 */
    startPhysicEngine () {
        // 开启物理系统
        // cc.director.getPhysicsManager().enabled = true;
        // // 绘制调试信息  | cc.PhysicsManager.DrawBits.e_aabbBit;
        // // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        // // 关闭绘制
        // // cc.director.getPhysicsManager().debugDrawFlags = 0;
        // // 设置重力
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -450);

        // 碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },

    setTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    offTouchListener () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchStart (touch) {
        if (this.gameInfo.isPaused || this.gameInfo.isSeven) return;
        if (!this.gameInfo.isGameStarted) {
            this.gameInfo.isGameStarted = true;
            this.enabled = true;
        }
        this.gameInfo.isUserClick = true;
        this.gameInfo.shootDelay = 400;
        this.sendCoin();
        this.sendCoin();
        // this.allBricks.active = false;
    },

    onTouchEnd (touch) {
        if (this.gameInfo.isSeven) return;
        this.gameInfo.isUserClick = false;
        this.gameInfo.shootDelay = 750;
        this.gameInfo.lastShootTime = Date.now();
        // this.allBricks.active = true;
    },

    /**拿到一个金币 */
    getCoin () {
        let coin = null;
        if (this.coinPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            coin = this.coinPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            coin = cc.instantiate(this.coinPrefab);
        }
        coin.opacity = 255;
        // coin.active = true;
        return coin;
    },

    /**丢弃一个金币 */
    dropCoin (coin) {
        coin.opacity = 0;
        // console.log('++dropCoin', coin);
        coin.getChildByName('pic').position = cc.v2(0, 0);
        coin.getChildByName('shadow').position = cc.v2(0, 0);
        // coin.active = false;
        this.coinPool.put(coin);
    },

    /**金币掉下
     * @ param {cc.Node} coin 金币节点
     * @ param {boolean} isHit 是不是撞到东西
     * @ param {DIRECTION} direction 方向
     * @ param {cc.v2} destPos 目标位置
     */
    fallDownCoin (coin, isHit = false, direction = undefined, destPos = undefined) {
        // console.log('-- fallDownCoin isHit:', isHit);
        coin.stopAllActions();
        let isLeft = Math.random() < 0.5 ? true : false;
        let turnAction = isHit ? cc.sequence(
            cc.moveBy(0.08, cc.v2(5.596 * (isLeft?-1:1), -1.598)),
            cc.moveBy(0.08, cc.v2(3.197 * (isLeft?-1:1), -1.865)),
            cc.moveBy(0.08, cc.v2(3.46 * (isLeft?-1:1), -3.72)),
            cc.moveBy(0.08, cc.v2(1.86 * (isLeft?-1:1), -3.463)),
            cc.moveBy(0.08, cc.v2(1.065 * (isLeft?-1:1), -3.996)),
            cc.moveBy(0.05, cc.v2(0.799 * (isLeft?-1:1), -3.197)),
        ) : cc.callFunc();
        if (direction && direction !== DIRECTION.MIDDLE) {
            turnAction = cc.moveTo(0.2, destPos);
        }
        let fallAction = cc.moveBy(1, 0, -700).easing(cc.easeIn(3.0));
        coin.runAction(cc.spawn(
            turnAction,
            fallAction
        ));
    },

    /**把金币停在障碍物上面 */
    stopCoinOnBrick (coin) {
        this.gameInfo.stopCoin.push(coin);
        coin.stopAllActions();
        if (this.gameInfo.stopCoin.length >= 7) {
            let rmCoin = this.gameInfo.stopCoin.splice(0, 1)[0];
            rmCoin.runAction(cc.sequence(
                cc.fadeOut(0.3),
                cc.callFunc(() => {
                    this.dropCoin(rmCoin);
                })
            ));
        }
    },

    /**把停住的金币落下 */
    releaseCoins () {
        const delay = 50;
        this.gameInfo.stopCoin.forEach((each,index) => {
            setTimeout(() => {
                this.fallDownCoin(each);
            }, index*delay);
        });
    },

    /**拿到一个积分 */
    getGrade () {
        let grade = null;
        if (this.gradePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            grade = this.gradePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            grade = cc.instantiate(this.gradePrefab);
        }
        return grade;
    },

    /**丢弃一个积分 */
    dropGrade (grade) {
        grade.active = false;
        this.gradePool.put(grade);
    },

    /**展示获得的积分
     * @ param {cc.v2} pos 计分点所在位置
     * @ param {number} num 分数
     */
    showFlyGrade (pos, num) {
        let grade = this.getGrade();
        grade.parent = this.flyGrades;
        grade.opacity = 0;
        grade.position = cc.v2(pos.x, pos.y);
        grade.getComponent(cc.Label).string = `+${num}`;
        grade.active = true;
        let moveY = 160 + Math.random() * 90;
        grade.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.35, cc.v2(pos.x, pos.y+moveY)).easing(cc.easeOut(2.5))),
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.dropGrade(grade);
            })
        ));
    },

    /**掉落金币 */
    sendCoin () {
        if (this.gameInfo.isPaused) return;
        let coin = this.getCoin();
        let coinX = this.gameInfo.coinMinX + Math.random() * this.gameInfo.coinMaxX * 2;
        coin.position = cc.v2(coinX, this.gameInfo.coinY);
        coin.parent = this.coins;
        coin.active = true;
        this.fallDownCoin(coin);
        this.gameController.getAudioUtils().playEffect('coinRelease', 0.3);
    },

    /**暂停掉金币 */
    pauseGame () {
        this.gameInfo.isPaused = true;
        this.enabled = false;
    },
    /**继续掉金币 */
    continueGame () {
        this.gameInfo.isPaused = false;
        this.enabled = true;
    },

    /**得分
     * @param {cc.Node} calcuNode 计分结点
     */
    receiveGrade (calcuNode) {
        let gradeName = calcuNode._name;
        let grade = this.gameInfo.GRADE[gradeName];
        this.showFlyGrade(calcuNode.position, grade);
        if (!this.gameInfo.isPaused) {
            this.gameController.getAudioUtils().playEffect('gold', 0.35);
        }
        this.goldView.addCash(grade);
        const target1 = 50;
        const target2 = 150;
        // const target3 = 100;
        // console.log('receiveGrade', this.gameInfo.getCashTimes, ' t:',this.goldView.targetCash);
        if (this.gameInfo.getCashTimes === 2) {
            // console.log('pause 1', this.goldView.targetCash < target1, ' isShow,', this.gameInfo.isPPCardShow);
            if (this.goldView.targetCash < 10+target1 || this.gameInfo.isPPCardShow) return;
            // console.log('pause 2', this.gameInfo.getCashTimes, ' t:',this.goldView.targetCash);
            this.pauseGame();
            this.showPPCard(target1);
        } else if (this.gameInfo.getCashTimes >= 3){
            if (this.goldView.targetCash < 100+target2+this.gameInfo.tmpGoldNum) return;
            if (this.gameInfo.getCashTimes === 3) this.showPPCard(target2);
            this.pauseGame();
            // if (this.goldView.targetCash >= target2+target3+this.gameInfo.tmpGoldNum) {
            //     this.gameHand.active = false;
            //     this.showPPCard(target3);
            //     this.pauseGame();
            // }
            // this.showPPCard(target2);
            // setTimeout(() => {
            //     this.showPPCard(target3);
            // }, 900);
        }
        
        // console.log('加分', grade);
    },

    /**来回移动砖块 */
    brickStartMove () {
        let direction = 'left'; // 目标移动方向
        const leftPos = cc.v2(-146.753, -249);
        const rightPos = cc.v2(158.774, -249);
        const moveTime = 2.7;
        let moveLeft = () => {
            const moveL = cc.moveTo(moveTime, leftPos);
            moveL.easing(cc.easeInOut(2.0));
            this.moveBrick.runAction(cc.sequence(
                moveL,
                cc.callFunc(moveCallback)
            ));
        };
        let moveRight = () => {
            const moveR = cc.moveTo(moveTime, rightPos);
            moveR.easing(cc.easeInOut(2.0));
            this.moveBrick.runAction(cc.sequence(
                moveR,
                cc.callFunc(moveCallback)
            ));
        };
        let moveCallback = () => {
            if (direction === 'left') {
                direction = 'right';
                moveRight();
            } else if (direction === 'right') {
                direction = 'left';
                moveLeft();
            }
        };
        moveCallback();
    },

    /**展示开场现金卡 */
    showPPCard (num) {
        this.gameInfo.isPPCardShow = true;
        num = Number(num);
        let ppcard = num === 50 ? this.ppcard50 : num === 100 ? this.ppcard100 : this.ppcard150;
        if (ppcard.active) return;
        ppcard.opacity = 0;
        ppcard.active = true;
        ppcard.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(() => {
                this.gameController.getAudioUtils().playEffect('moneyCard', 0.4);
            }),
            cc.fadeIn(0.3)
        ));
    },

    /**点击pp现金卡 */
    clickPPCard (event, num) {
        this.gameInfo.isPPCardShow = false;
        num = Number(num);
        let ppcard = num === 50 ? this.ppcard50 : num === 100 ? this.ppcard100 : this.ppcard150;
        ppcard.active = false;
        this.gameController.getAudioUtils().playEffect('income', 0.4);
        // this.setClickListener();
        if (this.gameInfo.getCashTimes === 1) {
            this.startGame();
        } else {
            this.goldView.addCash(0-num);
            this.gameInfo.tmpGoldNum = this.goldView.targetCash;
            if (this.gameInfo.getCashTimes === 2) {
                this.showSevens();
                this.gameHand.active = false;
            }
        }
        this.gameController.addCash(num);
        this.gameInfo.getCashTimes++;
        if (this.gameController.cashView.targetCash >= 300) {
            this.offTouchListener();
            this.enabled = false;
            this.gameController.guideView.showCashOutHand();
        }
        // this.gameHand.opacity = 0;
        // this.gameHand.active = true;
        // this.gameHand.runAction(cc.sequence(
        //     cc.fadeIn(0.9),
        //     cc.callFunc(() => {
        //         // this.gameHand.getComponent(cc.Animation).play();
        //     })
        // ))
    },

    /**展示777 */
    showSevens () {
        let topView = cc.find('Canvas/center/game/top/topBox').getComponent('TopView');
        topView.showSeven();
    },

    /**展示777完毕 */
    completeSevens () {
        this.gameInfo.isSeven = true;
        // 加快掉落金币
        this.gameInfo.isUserClick = true;
        this.gameInfo.shootDelay = 400;
        this.gameInfo.clickNumber = 5;
        this.moveBrick.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(() => {
                this.moveBrick.active = false;
            })
        ));
        this.allBricks.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.releaseCoins();
                this.continueGame();
                this.allBricks.active = false;
            })
        ));
    },

    update (dt) {
        let now = Date.now();
        if (now - this.gameInfo.lastShootTime >= this.gameInfo.shootDelay) {
            // console.log('-- update --, ', now - this.gameInfo.lastShootTime);
            if (this.gameInfo.isUserClick) {
                for (let i = 0; i < this.gameInfo.clickNumber; i++) {
                    let delay = Math.random()/2;
                    setTimeout(() => {
                        this.sendCoin();
                    }, delay*1000);
                }
                //
            } else {
                this.sendCoin();
            }
            this.gameInfo.lastShootTime = now;
        }
    },
});
