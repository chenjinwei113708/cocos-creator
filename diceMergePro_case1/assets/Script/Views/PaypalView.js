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
        item1: cc.Node, // 通知1
        item2: cc.Node, // 通知2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 记录信息
        this.info = {
            isPlayingAnim: false, // 是否正在播放动画
            msglist: [], // 消息列表
        };
        this.activeItem = this.item1;
        this.nextItem = this.item2;
        this.lightColor = new cc.color(255, 255, 255);
        this.darkColor = new cc.color(230, 230, 230);
        this.gameController = cc.find('Canvas').getComponent('GameController');
    },

    start () {
        // this.becomeLight();
        setTimeout(() => {
            this.addNewMsg(15);
            this.addNewMsg(10);
            this.addNewMsg(5);
        }, 1000);
        setTimeout(() => {
            this.addNewMsg(33);
            this.addNewMsg(44);
            this.addNewMsg(11);
            this.addNewMsg(12);
            this.addNewMsg(13);
            this.addNewMsg(15);
        }, 4000);
    },

    /**添加新消息 */
    addNewMsg (money) {
        this.info.msglist.push(money);
        if (!this.info.isPlayingAnim) {
            this._playList();
        }
    },

    /**播放列表里面的消息 */
    _playList () {
        this.info.isPlayingAnim = true;
        if (this.info.msglist.length > 0) {
            this._becomeLight();
            let money = this.info.msglist.splice(0, 1)[0];
            this._showNewMsg(money);
        } else {
            this._becomeDark();
            this.info.isPlayingAnim = false;
        }
    },

    /**
     * 展示新消息
     * @param {number} money 金额(整数)
     */
    _showNewMsg (money) {
        console.log('showNewMsg ', money, ' ', this.info.isPlayingAnim);

        // 设置下一条消息的内容
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();

        let nextTime = this.nextItem.getChildByName('time');
        let nextCash = this.nextItem.getChildByName('cash');
        nextTime.getComponent(cc.Label).string = `${year}/${month}/${date}`;
        nextCash.getComponent(cc.Label).string = `${money}.00`;
        this.nextItem.opacity = 255;

        this.gameController.addCash(money);

        [this.nextItem, this.activeItem].forEach((item, index) => {
            item.runAction(cc.sequence(
                cc.moveBy(0.4, 0, item.height),
                cc.delayTime(0.3),
                cc.callFunc(() => {
                    if (index === 1) {
                        this.activeItem.position = cc.v2(0, -this.activeItem.height);
                        let tmp = this.activeItem;
                        this.activeItem = this.nextItem;
                        this.nextItem = tmp;

                        this._playList();
                    }
                })
            ));
        });
    },

    /**
     * 变亮
     * @param {number} delay 变亮的时长，秒
     */
    _becomeLight (delay) {
        this.node.color = this.lightColor;
        if (delay) {
            this.node.runAction(cc.sequence(
                cc.delayTime(delay),
                cc.callFunc(() => {
                    this.node.color = this.darkColor;
                })
            ));
        }
    },

    // 变暗
    _becomeDark () {
        this.node.color = this.darkColor;
    },

    // update (dt) {},
});
