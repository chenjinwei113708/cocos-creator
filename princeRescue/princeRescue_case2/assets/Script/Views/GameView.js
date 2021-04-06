import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue'
import { scaleIn, flyTo, animInfo } from '../Utils/Animation'
// import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        prince: { type: cc.Node, default: null }, // 王子
        princess: { type: cc.Node, default: null }, // 公主
        littlePrince: { type: cc.Node, default: null }, // pypal的小王子
        littlePrincess: { type: cc.Node, default: null },
        pillar1Tip1: { type: cc.Node, default: null }, // 提示移动手1
        pillar1Tip2: { type: cc.Node, default: null }, // 提示移动手2
        pillar2Ttp1: { type: cc.Node, default: null }, // 提示cashout的手
        pillar2Tip2: { type: cc.Node, default: null },
        clickable: { type: cc.Node, default: null }, // 可以点击的范围
        // heart: { type: cc.Node, default: null }, // 游戏结束出现的爱心
        PPNodes: {
            type: cc.Node,
            default: []
        },
        treasure: { type: cc.Node, default: null }, // 展示爱心时候消失的宝物
        pps: { type: cc.Node, default: null },
        ppIcon: { type: cc.Node, default: null },
        
        // 复杂版
        pillar1: { type: cc.Node, default: null }, // 点击正确之后移动的柱子
        pillar2: { type: cc.Node, default: null },
        stoneImg: { type: cc.SpriteFrame, default: null }, // 变成石头的图片
        water: { type: cc.Node, default: null },
        lava: { type: cc.Node, default: null },
        vapour: { type: cc.Prefab, default: null }, // 水蒸气
        destination: {
            type: cc.Node,
            default: []
        }
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad() {
        this.startCollision();
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('', '');
        // this.reverseNode(this.prince);
        // this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_SPIN);
        
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /** 暴露给其他接口使用 */
    showDrag1 () {
        this.showHandDrag([this.pillar1Tip1, this.pillar1Tip2]);
    },

    showDrag2 () {
        this.showHandDrag([this.pillar2Ttp1, this.pillar2Tip2]);
    },

    /**获取游戏状态 */
    getGameStatus () {
        return this.gameInfo.status;
    },

    startCollision () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;

    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED, // 初始设置为不可点击状态
            currentLightPPNode: 0,
            currentStoneNum: 0,
            stoneLength: this.water.children.length,
            currentProgress: 0,
            endProrgess: 5,
            isHideLava: false,
            isClickPillar1: false,
            isClickPillar2: false
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )
    },

    /** 将node转向 */
    reverseNode (node) {
        node.width = -node.width;
        node.position = cc.v2(-node.position.x, node.position.y);
        if (node.children.length !== 0) {
            for (let i = 0; i < node.children.length; i++) {
                this.reverseNode(node.children[i]);
            }
        }
    },

    /** 给waterView用的添加gameInfo的里面的石头数量 */
    addStoneNum () {
        this.gameInfo.currentStoneNum++;
        if ((this.gameInfo.currentStoneNum >= this.gameInfo.stoneLength / 2) && !this.gameInfo.isHideLava) {
            this.gameInfo.isHideLava = true;
            // 让火消失
            this.hideLava();
        }
    },

    /**隐藏火 并且 开启下一阶段 */
    hideLava () {
        // 消失声音
        this.audioUtils.playEffect('vapour', 0.6);
        // 消失时间
        const fadeOutTime = 0.3;
        return new Promise((resolve, reject) => {
            this.lava.runAction(cc.sequence(
                cc.fadeOut(fadeOutTime),
                cc.callFunc(() => {
                    // 显示拖拽的手
                    this.showDrag2();
                    // this.showHandDrag([this.pillar2Ttp1, this.pillar2Tip2]);
                    // 开启下一阶段
                    this.setGameStatus(GAME_STATUS.CAN_CLICK2)
                    resolve();
                })
            ))
        })
    },

    /**节流函数 */
    getThrottle (fn, delay = 100) {
        let timer = null;
        return function (...args) {
            const _this = this; // 执行这个函数所在的this
            if (timer) return false;
            timer = setTimeout(() => {
                fn.apply(_this, args);
                clearTimeout(timer);
                timer = null;
            }, delay)
        }
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        const status = this.getGameStatus();
        this.audioUtils.playEffect('bgClick');
        if (!((status === GAME_STATUS.CAN_CLICK1 && this.checkPosByNode(e, this.pillar1)) || (status === GAME_STATUS.CAN_CLICK2 && this.checkPosByNode(e, this.pillar2)))) return false;
        this.setGameStatus(GAME_STATUS.DISABLED); // 点击完设置游戏状态

        this.handleClick(status);
        this.guideView.stopHand(); // 隐藏手

        // this.audioUtils.playEffect('bgClick');
        // this.handleClickRight(); // 处理点击正确之后的方法
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },

    /**点击事件移动 */
    onTouchMove (e) {
        // console.log('touch move')
    },

    /**点击事件结束 */
    onTouchEnd (e) {
        // console.log('touch end')
    },

    /**
     * 判断点击是否在node里面
     * @param {*} e 点击事件
     * @param {cc.Node} node 判断点击事件是否在里面的节点
     * @returns {Boolean}
     */
    checkPosByNode (e, node) {
        const touchPos = e.touch._point;
        const pos = node.parent.convertToWorldSpaceAR(node.position);
        const offsetX = node.width / 2;
        const offsetY = node.height / 2;

        if (touchPos.x <= pos.x + offsetX && touchPos.x >= pos.x - offsetX && touchPos.y <= pos.y + offsetY && touchPos.y >= pos.y - offsetY) {
            // console.log('在里面')
            return true;
        } else {
            // console.log('不在里面');
            return false;
        }
    },

    /** 点击到第一个pillar */
    handleClick (e) {
        const name = e.target.parent._name;
        const status = this.getGameStatus();

        if (status === GAME_STATUS.CAN_CLICK1) {
            if (name !== 'pillar1') return false;
            this.setGameStatus(GAME_STATUS.DISABLED);
        } else if (status === GAME_STATUS.CAN_CLICK2) {
            if (name !== 'pillar2') return false;
            this.setGameStatus(GAME_STATUS.DISABLED);
        } else {
            return false;
        }
        // console.log('过来了')
        this.guideView.stopHand && this.guideView.stopHand(); // 隐藏手
        this.audioUtils.playEffect('bgClick');

        const direction = GAME_INFO.DIRECTION[status]; // 根据状态获得方向
        // 移动pillar
        this.pillarMove({ 
            [GAME_STATUS.CAN_CLICK1]: this.pillar1,
            [GAME_STATUS.CAN_CLICK2]: this.pillar2 }[status],
        direction).then(() => {
            // 如果为第二部的话, 触发王子先抢捡金币
            if (status !== GAME_STATUS.CAN_CLICK2) return false;
            setTimeout(() => {
                // console.log('捡金币');
                this.handlePrinceWin();
            }, 2000) // 等一秒为下落得时间
        });
    },

    /**
     * 
     * @param {String} type 表示向左还是向右
     */
    pillarMove(pillar, type = 'right') {
        const moveTime = 0.65;
        const moveDistance = pillar.width;

        // 如果方向是向右则为 1 如果是向左则为 -1
        const direction = (type === 'right')
            ? (1)
            : (type === 'left') 
                ? (-1)
                : (0)

        return new Promise((resolve, reject) => {
            // 让柱子移动并消失
            pillar.runAction(cc.sequence(
                cc.moveBy(moveTime * (2 / 3), cc.v2(direction * moveDistance * (2 / 3))),
                cc.spawn(
                    cc.moveBy(moveTime * (1 / 3), cc.v2(direction * moveDistance * (1 / 3))),
                    cc.fadeOut(moveTime * (1 / 3))
                ),
                cc.callFunc(() => {
                    resolve();
                })
            ))
        })
    },

    /**王子胜利 */
    handlePrinceWin () {
        // 初始化参数
        const runTime = 0.6;
        const fallTime = 0.4;
        const princeBox = this.prince.parent; // 获取其父节点用于cc的运动

        var anim = this.prince.getComponent(cc.Animation);
        anim.play(GAME_INFO.PRINCE_ANIM_INFO.RUN); // 跑步动画

        princeBox.runAction(cc.sequence(
            cc.moveTo(runTime, this.getPos(princeBox, this.destination[0])),
            cc.moveTo(fallTime, this.getPos(princeBox, this.destination[1])),
            cc.callFunc(() => {
                // console.log('走到了');
                // 先播放一段待机然后再胜利
                anim.play(GAME_INFO.PRINCE_ANIM_INFO.NORMAL);
                setTimeout(() => {
                    // 胜利的动作
                    anim.play(GAME_INFO.PRINCE_ANIM_INFO.WIN);
                    // 爆出pp
                    this.showPPs(princeBox).then(() => {
                        this.cashView.addCash(200, GAME_INFO.EACH_LIGHT_TIME * 3);
                        // this.progressView.setProgress(4 / 5);
                        // this.handleLittlePrinceWalk(4);
                        this.setProgress(3).then(() => {
                            this.awardView.showPPCardPage2().then(() => {
                                this.audioUtils.playEffect('cheer');
                                this.guideView.showHand2([this.awardView.tip_PPCard2_1, this.awardView.tip_PPCard2_2]);
                                this.gameController.endGame();
                            }); // 胜利
                        });
                    })
                }, 350)
            })
        ))
    },

    setProgress (num) {
        return new Promise((resolve, reject) => {
            const differ = num - this.gameInfo.currentProgress; // 获得与当前的差值
            // 每走过一个点亮一个灯
            this.littlePrince.runAction(cc.sequence(
                cc.moveBy(GAME_INFO.EACH_LIGHT_TIME * differ, cc.v2(GAME_INFO.PP_NODE_DISTANCE * differ, 0)),
                cc.callFunc(() => {
                    // resolve();
                })
            ))
    
            // 点亮灯
            for (let i = 1; i <= differ; i ++) {
                const light = this.PPNodes[this.gameInfo.currentProgress + i].getChildByName('light');
                setTimeout(() => {
                    light.active = true
                }, i * GAME_INFO.EACH_LIGHT_TIME * 1000)
            }
            
            /**最后的回调 */
            setTimeout(() => {
                resolve();
            }, differ * GAME_INFO.EACH_LIGHT_TIME * 1000)

            // 最后再设置好currentProgress
            this.gameInfo.currentProgress += num;
        })
    },

    /**点亮paypal */
    // lightPPNodes (differ) {
    //     // 小人走路的时候已经添加了currentProgress
    //     const delay = GAME_INFO.ADD_CASH_TIME * 1000 / (this.PPNodes.length - 1);
    //     this.PPNodes.forEach((node, index) => {
    //         if (index <= this.gameInfo.currentProgress - 1) {
    //             const light = node.getChildByName('light')
    //             setTimeout(() => {
    //                 light.active = true;
    //                 // node.active = false;
    //             }, (index - differ) * delay)
    //         }
    //     })
    // },

    /**
     * 展示pp图标并飞向icon
     * @param {cc.Node} node 让pps绑定到的节点
     */
    showPPs (node, cb) {
        return new Promise((resolve, reject) => {
            // 重置所有pp
            this.pps.children.forEach((pp) => {
                pp.position = cc.v2(0, 0);
                pp.scale = 1;
                pp.opacity = 255;
                pp.active = true;
            })

            // 跟新pps的位置
            
            // 适配横竖屏, 取消这一属性
            // const pos = this.pps.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node));
            // this.pps.position = pos;

            // 执行动画的函数
            const delay = 100; // 延迟
            let isCallback = false;
    
            scaleIn(this.pps).then(() => {
                this.pps.children.forEach((node, index) => {
                    setTimeout(() => {
                        this.audioUtils.playEffect('money', 0.6);
                        flyTo(node, this.ppIcon);
                    }, delay * index)
                })
            })
            setTimeout(() => {
                cb && cb();
                resolve();
            }, animInfo.flyTo.time * 1000)
        })
    },

    /** 获取坐标 */
    getPos (node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    },

    /**paypal的小王子走路 */
    handleLittlePrinceWalk (num) {
        const differ = num - this.gameInfo.currentProgress; // 先计算差值
        this.gameInfo.currentProgress += num;

        this.lightPPNodes(differ);

        this.littlePrince.runAction(cc.sequence(
            cc.moveBy(GAME_INFO.ADD_CASH_TIME * (differ / this.gameInfo.endProrgess), cc.v2(GAME_INFO.PP_NODE_DISTANCE * differ, 0)),
            cc.callFunc(() => {
                
                // this.littlePrince.runAction(cc.fadeOut(disappearTime));
                // this.littlePrincess.runAction(cc.fadeOut(disappearTime));
            })    
        ))
    },

    /**添加金额获取数量 */
// 点击事件相关结束---------------------------------------------------------------------

// guide相关----------------------------------------------------------------------------
    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**显示拖拽手 */
    showHandDrag (nodeArr, type) {
        this.guideView.showHandDrag(nodeArr, type);
    },

    /**隐藏手 */
    stopHand () {
        this.guideView.stopHand && this.guideView.stopHand();
    },
// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
        return this.awardView.showAwardPage();
    },
    
    /**展现下载页面 */
    showDownloadMask () {
        this.awardView.showDownloadMask();
    },
// award相关结束-----------------------------------------------------------------------------

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    }
});
