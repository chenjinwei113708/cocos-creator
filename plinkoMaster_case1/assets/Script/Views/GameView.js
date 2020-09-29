// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        coinPrefab: cc.Prefab, // 金币预制资源
        coins: cc.Node, // 金币所在的父节点
        moveBrick: cc.Node, // 移动的砖块
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameInfo = {
            shootDelay: 600, // 发射间隔 ms
            lastShootTime: 0, // 上次发射的时间 时间戳 ms
            coinY: 232, 
            coinMinX: -173.9,
            coinMaxX: 173.9,
            GRADE: {
                grade1: 1,
                grade2: 2,
                grade3: 3,
                grade4: 4,
                grade5: 5,
                grade6: 6,
                grade7: 7,
                grade8: 8,
                grade9: 9,
            }
        };
        this.coinPool = new cc.NodePool();
        let initCount = 5;
        for (let i = 0; i < initCount; ++i) {
            let coin = cc.instantiate(this.coinPrefab); // 创建节点
            this.coinPool.put(coin); // 通过 put 接口放入对象池
        }

        this.startPhysicEngine();
        this.brickStartMove();
    },

    start () {
        this.enabled = true; // 允许update
    },

    /**打开物理引擎 */
    startPhysicEngine () {
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 绘制调试信息  | cc.PhysicsManager.DrawBits.e_aabbBit;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        // 关闭绘制
        // cc.director.getPhysicsManager().debugDrawFlags = 0;
        // 设置重力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -350);

        // 碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
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
        coin.active = false;
        this.coinPool.put(coin);
    },

    /**掉落金币 */
    sendCoin () {
        let coin = this.getCoin();
        let coinX = this.gameInfo.coinMinX + Math.random() * this.gameInfo.coinMaxX * 2;
        coin.position = cc.v2(coinX, this.gameInfo.coinY);
        coin.parent = this.coins;
        
    },

    /**得分 */
    receiveGrade (gradeName) {
        let grade = this.gameInfo.GRADE[gradeName];
        console.log('加分', grade);
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

    update (dt) {
        let now = Date.now();
        if (now - this.gameInfo.lastShootTime >= this.gameInfo.shootDelay) {
            this.sendCoin();
            this.gameInfo.lastShootTime = now;
        }
    },
});
