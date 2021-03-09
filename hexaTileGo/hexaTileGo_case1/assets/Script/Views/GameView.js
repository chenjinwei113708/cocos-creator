import {
    GAME_STATUS
} from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        guide: cc.Node, // 引导模块
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node, // 音效
        progress: cc.Node,
        pps: cc.Node,
        cash: cc.Node,
        downloadMask: cc.Node
    },

    onLoad() {
        this.gameViewInit();
        this.changeStartHandPos();
        this.showStartHand();
        this.bind$50Prop();
    },
    // 初始化gameview
    gameViewInit() {
        // 初始化参数
        this.stopGuide = null; // 存储停止提示方法的变量
        this.isShowingCorrect = false; // 表示正在展示正确页
        this.canShowGuide = true; // 表示是否可以改变手的位置

        // 获取节点
        this.arr_$50 = this.node.getChildByName('dollar').getChildByName('$50').children;
        this.inputs = this.node.getChildByName('input');
        this.paypal = cc.find('Canvas/center/UI/paypal');
        
        // 获取目标脚本
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.audioUtils = this.audio.getComponent('AudioUtils');
        this.cashView = this.cash.getComponent('CashView');

        // 存储方法
        this.stopStartHand = null;

        this.info = {
            status: GAME_STATUS.CAN_CLICK,
            currentSpaceIndex: 0, // 在input里面存放$50的节点的index
            endGameNumber: 3, // 代表结束游戏存放的数量
            hasClickedArr: [], // 存放已经被点击的$50
        }
    },

    /**为%50的节点绑定上自定义属性 */
    bind$50Prop() {
        this.arr_$50.forEach(node => {
            node.is$50 = true;
        })
    },

    /**点击六边形发生动画并产生回调 */
    handleClick(e) {
        // 检测是否可以点击
        if (this.info.status !== GAME_STATUS.CAN_CLICK) return false;
        this.setGameStatus(GAME_STATUS.IS_PLAYING); // 设置状态
        this.audioUtils.playEffect('bgClick')

        // 设置运动参数
        const target = e.target;
        const speed = 0.2;
        const endScale = 1.3;
        const minScale = 0.8;
        const endAngle = 30;

        // 设置为可以覆盖其他节点
        target.zIndex = 1;
        target.parent.zIndex = 1;

        // 自身缩放动画
        target.runAction(cc.spawn(
            cc.sequence(
                cc.scaleTo(speed, endScale),
                cc.scaleTo(speed, 1),
                cc.callFunc(() => {
                    if (target.is$50) return false;
                    this.setGameStatus(GAME_STATUS.CAN_CLICK);
                    target.zIndex = 0;
                    target.parent.zIndex = 0;
                })
            ),
            cc.callFunc(() => {
                if (target.is$50) {
                    target.isClick = true; // 表示已经被点击

                    // 隐藏手
                    if (target.isGuide) {
                        this.canShowGuide = true;
                        this.stopStartHand(() => {
                            this.changeStartHandPos();
                        });
                    } else {

                    }


                    // 播放动画
                    target.runAction(cc.spawn(
                        cc.rotateBy(speed * 2, -endAngle),
                        cc.callFunc(() => {
                            target.getChildByName('reverse_rotate_box').runAction(cc.sequence(
                                cc.rotateTo(speed * 2, endAngle),
                                cc.callFunc(() => {
                                    this.get$50(target)
                                })
                            ))
                        })
                    ))
                }
            })
        ))
    },

    get$50(node) {
        // const oriPos = node.position; // 记录初始坐标
        const endPos = node.parent.convertToNodeSpaceAR(this.inputs.convertToWorldSpaceAR(this.inputs.children[this.info.currentSpaceIndex]))
        // 判断input有没有空的
        const endNode = this.inputs.children[this.info.currentSpaceIndex++];
        // node.parent = endNode;

        const speed = 0.3

        node.runAction(cc.sequence(
            cc.moveTo(speed, endPos),
            cc.callFunc(() => {
                this.info.hasClickedArr.push(node);
                // 检查是否结束游戏
                if (this.info.currentSpaceIndex === this.info.endGameNumber) {
                    this.setGameStatus(GAME_STATUS.END_GAME); // 设置状态为结束游戏
                    this.disappear$50(this.showPPsFly); // 让node消失并且获得奖励
                } else {
                    this.setGameStatus(GAME_STATUS.CAN_CLICK);
                    this.showStartHand(); // 重新展示指引手
                }
            })
        ))
    },

    /**让$50消失 */
    disappear$50(cb) {
        // 消失前播放合成的音效
        this.audioUtils.playEffect('combine');

        const speed = 0.5;
        const shakeOpacity = 0.6 * 255;
        const maxScale = 1.2;
        
        let isCallback = false;

        this.info.hasClickedArr.forEach(node => {
            node.runAction(cc.sequence(
                cc.spawn(cc.fadeTo(speed, shakeOpacity), cc.scaleTo(speed, maxScale)),
                cc.spawn(cc.fadeTo(speed, 255), cc.scaleTo(speed, 1)),
                cc.spawn(cc.fadeTo(speed, shakeOpacity), cc.scaleTo(speed, maxScale)),
                cc.spawn(cc.fadeTo(speed, 255), cc.scaleTo(speed, 1), cc.callFunc(() => this.showPPs.call(this, speed))),
                cc.fadeOut(speed),
                cc.callFunc(() => {
                    if (!isCallback) {
                        isCallback = true;
                        cb && cb.call(this);
                    }
                })
            ))
        })
    },

    /**显示pps */
    showPPs(speed) {
        this.pps.children.forEach((node, index) => {
            node.opacity = 0;
            node.scale = 0;
            node.active = true;
            node.runAction(cc.spawn(
                cc.fadeIn(speed),
                cc.scaleTo(speed, 1)
            ))
        })
    },

    /**让pps飞 */
    showPPsFly() {
        // 时间参数
        const speed1 = 0.3;
        const speed2 = 0.2;
        const delay = 0.15;
        let isCallback = false;

        const endPos = this.pps.convertToNodeSpaceAR(this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('ppIcon').position))
        
        this.pps.children.forEach((node, index) => {
            setTimeout(() => {
                node.runAction(cc.sequence(
                    cc.moveTo(speed1, endPos),
                    cc.callFunc(() => {
                        this.audioUtils.playEffect('money')
                        if (isCallback) return false;
                        isCallback = true;
                        this.cashView.addCash(150);
                        setTimeout(() => {
                            this.guideCashOut(); // 诱导点击cashout
                            this.awardView.showAwardPage(() => {
                                this.guideView.showEndHand();
                                this.downloadMask.active = true
                            }); // 展现奖励页
                        }, delay * 1000 * this.pps.children.length - 1)
                        this.guideCashOut()
                    }),
                    cc.fadeOut(speed2)
                ))
            }, delay * 1000 * index)
        })
    },

    setGameStatus(status) {
        this.info.status = status;
    },

    // 展示开始时的引导手
    showStartHand() {
        if (!this.canShowGuide) return false;
        this.canShowGuide = false
        this.stopStartHand = this.guideView.showStartHand();
    },

    /**让cashout动起来 */
    guideCashOut() {
        const speed = 0.3;
        const maxScale = 1.1;
        const minScale = 0.9;

        this.paypal.getChildByName('cashout').runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(speed, maxScale),
                cc.scaleTo(speed * 2, minScale),
                cc.scaleTo(speed, 1)
            )
        ))
    },

    // 展示获取奖励的引导手
    showCashOutHand() {
    },

    // 获取奖励
    getAward() {
    },

    // 切换开始手的位置
    changeStartHandPos() {
        const toBeGuide = this.arr_$50.filter(node => {
            return node.isGuide === undefined;
        })[0];
        if (toBeGuide) {
            toBeGuide.isGuide = true;
            this.guideView.startHand.position = this.guideView.startHand.parent.convertToNodeSpaceAR(toBeGuide.parent.convertToWorldSpaceAR(toBeGuide.position))
        }
    },
    // 获取两点的直线距离
    // getDistance(pos1, pos2) {
    //     // return Math.floor(Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)));
    //     return {
    //         x: Math.floor(Math.abs(pos1.x - pos2.x)),
    //         y: Math.floor(Math.abs(pos1.y - pos2.y))
    //     }
    // },
    // 切换遮罩层
    toggleMask() {
    },
});
