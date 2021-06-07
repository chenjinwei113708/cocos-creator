import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT } from '../Model/ConstValue';

/**
 * 这个脚本是用来播放引导动作的
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // cashOutHand: cc.Node, // 提现手
        // congrat: cc.Node,
        // startHand: cc.Node, // 游戏开始时引导手
        hand: cc.Node,
    },
    onLoad () {
        // 初始化信息
        this.info = {
            isCashout: false, // 是否点击过提现
        };
        this.stopHand; // 存放停止动作的变量
        // 存放停止动画的变量
    },

    /**让手的位置与传入节点相同并视为其子节点 */
    updateHandByParent(node) {
        const oriWordPos = node.parent.convertToWorldSpaceAR(this.node.position)
        this.hand.parent = node;
        this.hand.position = node.parent.convertToNodeSpaceAR(oriWordPos);
    },

    /**用一个不是添加为其子元素的方法来更新其位置 */
    updateHandByPos(node) {
        const endPos = this.hand.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node));
        this.hand.position = endPos;
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },

    /**
     * @param {cc.Node} node coscos的节点 
     * @param {*} type 为parent使用updateHandByParent 为position使用updateHandByPos来确认坐标
     * @param {Function} cb 回调函数
     */
    
    // 更新hand的坐标
    showHand(node, type = 'parent') {
        if (this.stopHand) this.stopHand = undefined; // 用于后面存放停止动画的变量

        // 根据模式更新hand的坐标
        if (type === 'parent') {
            this.updateHandByParent(node);
        } else if (type === 'position') {
            this.updateHandByPos(node);
        }
        // 获取原始坐标
        let oriPos = cc.v2(this.hand.position.x, this.hand.position.y);
        // 运动时移动的动画
        let movePos = cc.v2(oriPos.x + this.hand.width * 0.6, oriPos.y - this.hand.height*0.8);

        // 设置hand初始参数
        this.hand.stopAllActions();
        this.hand.opacity = 0;
        this.hand.scale = 1;
        this.hand.active = true;
        // 运动方法
        this.hand.runAction(cc.sequence(
            cc.fadeIn(0.5), // 出现动画
            // 永久执行动画
            cc.callFunc(() =>{
                this.hand.runAction(cc.repeatForever(
                    cc.sequence(
                        cc.spawn(cc.moveTo(0.5, movePos), cc.scaleTo(0.5, 1.2)),
                        cc.spawn(cc.moveTo(0.5, oriPos), cc.scaleTo(0.5, 1)),
                        // cc.callFunc(() => {
                        // })
                    )
                ))
            })
        ));

        // 为动画制定结束方法
        let stopHandAnimation = (cb) => {
            this.hand.stopAllActions();
            this.hand.runAction(cc.sequence(
                cc.sequence(cc.fadeOut(0.3), cc.moveTo(0.4, oriPos)),
                cc.callFunc(() => {
                    this.hand.active = false;
                    this.stopHand = undefined
                    cb && cb();
                })
            ))
        }
        // console.log(this)
        this.stopHand = stopHandAnimation;
        return stopHandAnimation;
    },

    /**
     * （从下方）渐入
     * @param {*} node 
     */
    myFadeIn (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        node.opacity = 0;
        node.position = cc.v2(oriPos.x, oriPos.y-node.height*1.5);
        node.active = true;
        node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.4, 0, node.height*1.5)).easing(cc.easeIn(2)),
            cc.callFunc(() => {
                callback && callback();
            })
        ));
    },

    /**
     * 提示点击
     * @param {*} node 
     */
    myClickHere (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        let movePos = cc.v2(oriPos.x+node.width*0.6, oriPos.y-node.height*0.8);
        node.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(cc.moveTo(0.5, movePos), cc.scaleTo(0.5, 1.2)),
                cc.spawn(cc.moveTo(0.3, oriPos), cc.scaleTo(0.3, 1))
            )
        ));
        callback && callback();
        let stopMyAnimation = (cb) => {
            node.stopAllActions();
            node.runAction(cc.sequence(
                cc.sequence(cc.fadeOut(0.1), cc.moveTo(0.2, oriPos)),
                cc.callFunc(() => {
                    node.stopMyAnimation = undefined;
                    cb && cb();
                })
            ));
        }
        // node.stopMyAnimation = stopMyAnimation;
        return stopMyAnimation;
    },

    /**展示提示手 */
    // showCashOutHand () {
    //     this.cashOutHand.opacity = 0;
    //     this.cashOutHand.active = true;
    //     this.cashOutHand.runAction(cc.sequence(
    //         cc.fadeIn(0.4),
    //         cc.callFunc(() => {
    //             this.cashOutHand.getComponent(cc.Animation).play('shake');
    //         })
    //     ));
    //     // 返回一个停止动画的操作
    //     return function () {
    //         this.cashOutHand.getComponent(cc.Animation).stop('shake');
    //         this.cashOutHand.runAction(cc.spawn(
    //             cc.scaleTo(0.2, 1),
    //             cc.fadeTo(0.2),
    //         ))
    //         setTimeout(() => {
    //             this.cashOutHand.active = false;
    //         }, 200)
    //     }
    // },

    /**展示结束页面，并引导下载 */
    // showEndPage(){
    //     //播放结束音乐
    //     // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
    //     this.node.runAction(cc.sequence(
    //         cc.callFunc(() => {
    //             this.congrat.x = this.congrat.x + this.congrat.width;
    //             this.congrat.opacity = 0;
    //             this.congrat.scale = 0.75;
    //             this.congrat.active = true;
    //             let opacityAction = null;
    //             let posConfig = this.gameController.gameModel.getPositionConfig();
    //             opacityAction = cc.fadeTo(0.2, posConfig.UI.children.congrat.opacity);
    //             this.congrat.runAction(cc.spawn(
    //                 opacityAction,
    //                 cc.moveBy(0.35, -this.congrat.width, 0),
    //                 cc.scaleTo(0.2, 1)
    //             ));
    //             this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
    //         }),
    //         cc.delayTime(1.2),
    //         cc.spawn(
    //             cc.callFunc(() => {
    //                 this.congratBlur.active = true;
    //                 this.congrat.runAction(cc.sequence(
    //                     cc.fadeOut(0.3),
    //                     cc.callFunc(() => {this.congrat.active = false;})
    //                 ))
    //             }),
    //             cc.callFunc(() => {
    //                 this.modal.opacity = 0;
    //                 this.modal.active = true;
    //                 this.modal.runAction(cc.sequence(
    //                     cc.fadeIn(.5),
    //                     cc.callFunc(() => {
    //                         this.modal.getChildByName('endPage').opacity = 0;
    //                         this.modal.getChildByName('endPage').active = true;
    //                         this.modal.getChildByName('endPage').runAction(cc.fadeIn(0.3));
    //                     })
    //                 ));
    //                 this.gameController.endGame();
    //             }),
    //         ),
    //     ));
    // }    
});
