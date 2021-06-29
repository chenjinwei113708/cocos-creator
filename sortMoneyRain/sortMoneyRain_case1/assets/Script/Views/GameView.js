import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';
import { toggleMask, flyTo, scaleIn, scaleOut } from '../Utils/Animation';
import { getThrottle } from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null },
        ppIcon: { type: cc.Node, default: null },
        pps: { type: cc.Node, default: null },
        money: { type: cc.Node, default: null },
        moneys: { type: cc.Node, default: null },
        moneyMask: { type: cc.Node, default: null },
        tips: { type: cc.Node, default: [] },
        moneyTip: { type: cc.Prefab, default: null },
        addMoneyTipBox: { type: cc.Node, default: null }, // 存放增加金币提醒的盒子
        ppPrefab: { type: cc.Prefab, default: null },
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad () {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('$ ', 'head');
        // this.showHandDrag();
        this.showHand(this.money, 'position');
        this.setGameStatus(GAME_STATUS.CAN_CLICK_MONEY);
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
            status: GAME_STATUS.DISABLED // 初始设置为不可点击状态
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView',
            'paypalCashView'
        );

        // 获取声音方法
        this.playMoneyMusic = this.getMoneyMusicThrottle(150);
    },

    getMoneyMusicThrottle (delay = 500) {
        return getThrottle(() => this.audioUtils.playEffect('money'), delay);
    },

    /**切换mask的显示状态 
     * @param type 如果为 in 则表示显示 如果为out 则表示隐藏
    */
     toggleGameMask (type) {
        return toggleMask(this.mask, type)
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
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

    /**
     * 最开始点击到提示的金钱
     */
    handleClickMoney () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK_MONEY) return;
        this.stopHand();
        // this.playMoneyMusic();
        this.audioUtils.playEffect('bgClick');
        toggleMask(this.moneyMask);

        // 处理金币飞向money box
        flyTo(this.money, this.tips[0]).then(() => {
            this.playMoneyMusic();
            return this.createMoneyTip(this.tips[1], '+$1000');
        }).then(() => Promise.all([
            this.cashView.addCash(1000, 1),
            this.paypalCashView.addCashTo(10, 1),
            this.progressView.setProgress(0.3, 1)
        ])).then(() => {
            return this.receiveAllMoney();
        }).then(() => Promise.all([
            this.paypalCashView.addCashTo(500, 2),
            this.progressView.setProgress(1, 2)
        ])).then(() => {
            this.awardView.showAwardPage();
        }).then(() => {
            this.audioUtils.playEffect('cheer');
            this.awardView.showDownloadMask();
            this.gameController.endGame();
        })
    },

    /**
     * 创建金币提示
     * @param {*} node 要在哪个位置显示
     * @param {*} str 显示的文字
     */
    createMoneyTip (node, str = '') {
        return new Promise((resolve, reject) => {
            const moneyTip = cc.instantiate(this.moneyTip);
            const txt = moneyTip.getChildByName('txt');
            // 生成文字
            txt.getComponent(cc.Label).string = str;
            moneyTip.parent = this.addMoneyTipBox;
            moneyTip.position = this.getPosByNode(moneyTip, node);
            // 动画结束的时候消失
            console.log(txt.getComponent(cc.Animation));
            setTimeout(() => {
                moneyTip.active = false;
                resolve();
            }, txt.getComponent(cc.Animation).defaultClip.duration * 1000);
        })
    },

    /**所有金币变成pp并回收 */
    receiveAllMoney () {
        return new Promise((resolve, reject) => {
            const delay = 60;
            const promiseAll = [];
            this.moneys.children.forEach((money, index) => {
                setTimeout(() => {
                    scaleOut(money).then(() => {
                        const ppIcon = cc.instantiate(this.ppPrefab);
                        const ratio = 2; // 放大倍数
                        ppIcon.width = ratio * ppIcon.width;
                        ppIcon.height = ratio * ppIcon.height;
                        ppIcon.angle = money.angle;
                        ppIcon.scale = 0;
                        ppIcon.parent = this.pps;
                        ppIcon.position = this.getPosByNode(ppIcon, money);
                        return scaleIn(ppIcon).then(() => Promise.resolve(ppIcon));
                    }).then((ppIcon) => {
                        flyTo(ppIcon, this.ppIcon, (time) => [cc.rotateTo(time, 360)]);
                    }).then(() => {
                        this.playMoneyMusic();
                        resolve();
                    })
                }, index * delay);
            });
        })
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

    stopHand () {
        this.guideView.stopHand();
    },

// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage();
    },
// award相关结束-----------------------------------------------------------------------------

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },
    
    /**
     * @param {cc.Node} ndoe1 
     * @param {cc.Node} node2 
     * @returns 转换后的pos
     */
    getPosByNode (ndoe1, node2) {
        return ndoe1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position));
    }
});
