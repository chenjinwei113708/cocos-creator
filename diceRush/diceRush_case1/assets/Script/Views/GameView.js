import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';
import { animInfo, toggleMask, foreverMoveBy } from '../Utils/Animation';
import { getRandom } from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null },
        camera: { type: cc.Node, default: null },
        person1: { type: cc.Node, default: null },
        dices: { type: cc.Node, default: [] }, // 0: 一开始的紫色骰子，1: 后面掉出去的5
        treasureBoxPos1: { type: cc.Node, default: null },
        treasureBoxPos2: { type: cc.Node, default: null },
        treasureBox1: { type: cc.Prefab, default: null },
        treasureBox2: { type: cc.Prefab, default: null },
        treasureBoxLight: { type: cc.Prefab, default: null },
        treasureBoxs: { type: cc.Node, default: null }, // 存放宝箱的节点
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad () {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('$ ', 'head');
        // this.showHandDrag();
        // this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_CLICK2);
        this.initTreasureBox();
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    getGameStatus () {
        return this.gameInfo.status;
    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED, // 初始设置为不可点击状态
        }

        this.animInfo = {
            dice1ScaleOutTime: 0.5,
            dice2ScaleInTime: 0.6,
            dice2MoveByPos: cc.v2(0, -20),
        }

        // 渲染宝箱的数据 根据传入的pos坐标 特效渲染的位置  11, 13
        this.treasureBox1Info = [
            // 缩放
            { scale: 0.14, effectPos: { x: 11, y: 13 } },
            { scale: 0.15, effectPos: { x: 11, y: 13 } },
            { scale: 0.16, effectPos: { x: 11, y: 13 } },
        ]

        this.treasureBox2Info = [
            // 缩放
            { scale: 0.04, effectPos: { x: -25, y: 16 }, animRatio: 1 },
            { scale: 0.038, effectPos: { x: -25, y: 16 }, animRatio: 0.95 },
            { scale: 0.036, effectPos: { x: -25, y: 16 }, animRatio: 0.9 },
            { scale: 0.034, effectPos: { x: -25, y: 16 }, animRatio: 0.85 },
            { scale: 0.032, effectPos: { x: -25, y: 16 }, animRatio: 0.8 },
            { scale: 0.025, effectPos: { x: -25, y: 16 }, animRatio: 0.55 },
            { scale: 0.02, effectPos: { x: -25, y: 16 }, animRatio: 0.45 },
            { scale: 0.017, effectPos: { x: -25, y: 16 }, animRatio: 0.45 },
            { scale: 0.015, effectPos: { x: -25, y: 16 }, animRatio: 0.3 },
        ]

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )
    },

    initTreasureBox () {
        // 初始化宝箱1
        this.treasureBox1Info.forEach((info, index) => {
            const treasureBox = cc.instantiate(this.treasureBox1);
            const treasureBoxLight = cc.instantiate(this.treasureBoxLight);
            treasureBox.parent = this.treasureBoxs;
            treasureBoxLight.parent = treasureBox;
            treasureBoxLight.position = cc.v2(info.effectPos.x, info.effectPos.y);
            treasureBox.scale = info.scale;
            // console.log(this.treasureBoxPos1.children[index].position);
            this.updatePos(treasureBox, this.treasureBoxPos1.children[index]);

            // 宝箱动画
            setTimeout(() => {
                foreverMoveBy(treasureBox, [ cc.v2(0, 15), cc.v2(0, -15) ]);
            }, getRandom(0, 600));
        });

        this.treasureBox2Info.forEach((info, index) => {
            const treasureBox = cc.instantiate(this.treasureBox2);
            const treasureBoxLight = cc.instantiate(this.treasureBoxLight);
            treasureBox.parent = this.treasureBoxs;
            treasureBoxLight.parent = treasureBox;
            treasureBoxLight.position = cc.v2(info.effectPos.x, info.effectPos.y);
            treasureBox.scale = info.scale;
            // console.log(this.treasureBoxPos1.children[index].position);
            this.updatePos(treasureBox, this.treasureBoxPos2.children[index]);

            // 宝箱动画
            setTimeout(() => {
                foreverMoveBy(treasureBox, [ cc.v2(0, 5 * info.animRatio), cc.v2(0, -5 * info.animRatio) ]);
            }, getRandom(0, 1500));
        })
    },

    /**
     * 
     * @param {cc.Node} node1 需要改变坐标的
     * @param {cc.Node} node2 作为参照坐标的
     */
    updatePos (node1, node2) {
        // console.log(node1, node1.parent);
        // console.log(node2, node2.parent);
        const endPos = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
        node1.position = endPos
        return endPos;
    },

    /**切换mask的显示状态 
     * @param type 如果为 in 则表示显示 如果为out 则表示隐藏
    */
     toggleGameMask (type) {
        return toggleMask(this.mask, type)
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },
    /**点击事件移动 */
    onTouchMove (e) {

    },
    /**点击事件结束 */
    onTouchEnd (e) {

    },

    /**点击之后骰子调出 固定为5 */
    handleClick2 () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK2) return false;
        this.setGameStatus(GAME_STATUS.DISABLED);
        console.log('click2');

        const [ dice1, dice2 ] = this.dices;
        dice2.scale = 0;
        console.log(dice1, dice2);
        // 点击后原有骰子消失
        // 骰子掉出动画
        new Promise((resolve, reject) => {
            dice1.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(this.animInfo.dice1ScaleOutTime, 0),
                    cc.fadeOut(this.animInfo.dice1ScaleOutTime),
                    cc.callFunc(() => {
                        // console.log('dice2!!')
                        dice2.active = true;
                        dice2.runAction(cc.spawn(
                            cc.scaleTo(this.animInfo.dice2ScaleInTime, 1),
                            cc.moveBy(this.animInfo.dice2ScaleInTime, this.animInfo.dice2MoveByPos)
                        ))
                    })
                ),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    resolve();
                })
            ))

        }).then(() => {
            return new Promise((resolve, reject) => {
                // 人物行走动画
                const cameraAnim = this.camera.getComponent(cc.Animation);
                const personAnim = this.person1.getComponent(cc.Animation);

                cameraAnim.play();
                personAnim.play();
            })
        })

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

// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage()
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
