import getType from '../Utils/utils';
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
        this.currentHand = this.hand1
        
        // 存放停止动画的变量
        // this.stopHand = null;
        this.stopHandActions = undefined;
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
    
    /** 停止手的运动 */
    stopHand () {
        if (!this.stopHandActions) return false;
        this.stopHandActions();
        this.stopAllActions = undefined; // 停止之后将其设为null
    },

    // 更新hand的坐标
    showHand(node, type = 'parent') {
        // if (this.stopHand) this.stopHand = undefined; // 用于后面存放停止动画的变量
        this.stopHand();
        // console.log(111)
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
                        cc.callFunc(() => {
                        })
                    ),
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
                    this.stopHandActions = undefined
                    cb && cb();
                })
            ))
        }
        // console.log(this)
        this.stopHandActions = stopHandAnimation;
        return stopHandAnimation;
    },

    /**手部拖动 */
    showHandDrag ([node1, node2], type = 'parent') {
        // console.log('hand drag')
        // if (this.stopHand) this.stopHand = undefined; // 用于后面存放停止动画的变量
        this.stopHand();

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
                    this.stopHandActions = undefined
                    cb && cb();
                })
            ))
        }

        this.stopHandActions = stopHandAnimation;
        return stopHandAnimation;
    },

    /**
     * 连续在节点里面点击
     * @param {Array} nodeArr 装有cc.Node的数组
     * @param {*} type 
     * @returns 
     */
    showHand2 (nodeArr, type = 'parent') {
        if (getType(nodeArr) !== 'array') return new Error('请传入一个数组');
        // if (this.stopHand) this.stopHand = undefined; // 用于后面存放停止动画的变量
        this.stopHand();

        // 先出现在第一只手
        if (type === 'parent') {
            this.updateHandByParent(nodeArr[0]);
        } else if (type === 'position') {
            this.updateHandByPos(nodeArr[0]);
        }

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
        const fadeOutTime = 0.3;

        const actionArr = [];
        // 连续点击的动画
        nodeArr.forEach(node => {
            const endPos = this.getNodePosByHand(node); // 获取当前需要移动到的位置
            actionArr.push(
                cc.moveTo(moveTime, endPos),
                cc.sequence(
                    cc.scaleTo(scaleOutTime, maxScale),
                    cc.scaleTo(scaleInTime, 1)
                )
            )
        })

        this.currentHand.runAction(cc.sequence(
            // 进入时候的动画
            cc.spawn(
                cc.scaleTo(scaleInTime, 1),
                cc.fadeIn(scaleInTime)
            ),
            cc.callFunc(() => {
                this.currentHand.runAction(cc.repeatForever(
                    cc.sequence(...actionArr)
                ))
            })
        ));

        let stopHandAnimation = (cb) => {
            this.currentHand.stopAllActions();
            this.currentHand.runAction(cc.sequence(
                cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, maxScale)),
                cc.callFunc(() => {
                    this.currentHand.active = false;
                    this.currentHand.position = oriPos;
                    this.stopHandActions = undefined
                    cb && cb();
                })
            ))
        }

        this.stopHandActions = stopHandAnimation;
        return stopHandAnimation;
    },

    /**
     * 设置用哪一个手
     * @param {*} handName 
     */
    setHand (handName) {
        this.currentHand = this[handName];
    }
});
