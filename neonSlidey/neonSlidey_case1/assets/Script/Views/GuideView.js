/**
 * 这个脚本是用来播放引导动作的
 */
cc.Class({
    extends: cc.Component,

    properties: {
        hand1: cc.Node,
        hand2: cc.Node
    },
    onLoad () {
        // 初始化信息
        // this.info = {
        //     isCashout: false, // 是否点击过提现
        // };

        this.stopHand; // 存放停止动作的变量
        this.currentHand = this.hand1
        // 存放停止动画的变量
    },

    /**让手的位置与传入节点相同并视为其子节点 */
    updateHandByParent(node) {
        const oriWordPos = node.parent.convertToWorldSpaceAR(this.node.position)
        this.currentHand.parent = node;
        this.currentHand.position = node.parent.convertToNodeSpaceAR(oriWordPos);
    },

    /**用一个不是添加为其子元素的方法来更新其位置 */
    updateHandByPos(node) {
        // const endPos = this.currentHand.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node));
        this.currentHand.position = this.getNodePosByHand(node);
    },

    getNodePosByHand (node) {
        return this.currentHand.parent.convertToNodeSpaceAR(node.parent.convertToWorldSpaceAR(node.position));
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
        let oriPos = cc.v2(this.currentHand.position.x, this.currentHand.position.y);
        // 运动时移动的动画
        let movePos = cc.v2(oriPos.x + this.currentHand.width * 0.6, oriPos.y - this.currentHand.height*0.8);

        // 设置hand初始参数
        this.currentHand.stopAllActions();
        this.currentHand.opacity = 0;
        this.currentHand.scale = 1;
        this.currentHand.active = true;
        // 运动方法
        this.currentHand.runAction(cc.sequence(
            cc.fadeIn(0.5), // 出现动画
            // 永久执行动画
            cc.callFunc(() =>{
                this.currentHand.runAction(cc.repeatForever(
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
            this.currentHand.stopAllActions();
            this.currentHand.runAction(cc.sequence(
                cc.sequence(cc.fadeOut(0.3), cc.moveTo(0.4, oriPos)),
                cc.callFunc(() => {
                    this.currentHand.active = false;
                    this.stopHand = undefined
                    cb && cb();
                })
            ))
        }
        // console.log(this)
        this.stopHand = stopHandAnimation;
        return stopHandAnimation;
    },

    /**手部拖动 */
    showHandDrag ([node1, node2], type = 'parent') {
        // console.log('hand drag')
        if (this.stopHand) this.stopHand = undefined; // 用于后面存放停止动画的变量

        // 根据模式更新hand的坐标
        if (type === 'parent') {
            this.updateHandByParent(node1);
        } else if (type === 'position') {
            this.updateHandByPos(node1);
        }

        // 获取需要移动到的距离
        let oriPos = cc.v2(this.currentHand.position.x, this.currentHand.position.y);
        let endPos = this.getNodePosByHand(node2);

        // 设置hand初始参数
        this.currentHand.stopAllActions();
        this.currentHand.opacity = 0;
        this.currentHand.scale = 2;
        this.currentHand.active = true;

        // 初始化运动的参数
        const scaleInTime = 0.3;
        const maxScale = 1.3;
        const moveTime = 0.8;
        const scaleOutTime = 0.5;

        this.currentHand.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(scaleInTime, 1),
                    cc.fadeIn(scaleInTime)
                ),
                cc.moveTo(moveTime, endPos),
                cc.spawn(
                    cc.scaleTo(scaleOutTime, maxScale),
                    cc.fadeOut(scaleOutTime)
                ),
                cc.callFunc(() => {
                    this.currentHand.position = oriPos;
                })
            )
        ))

        let stopHandAnimation = (cb) => {
            this.currentHand.stopAllActions();
            this.currentHand.runAction(cc.sequence(
                cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, maxScale)),
                cc.callFunc(() => {
                    this.currentHand.active = false;
                    this.currentHand.position = oriPos;
                    this.stopHand = undefined
                    cb && cb();
                })
            ))
        }

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

    setHand () {
        
    }
});
