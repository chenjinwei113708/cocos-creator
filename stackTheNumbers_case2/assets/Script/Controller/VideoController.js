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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isUserClicked = false;

        this.videoPlayer = this.node.getComponent(cc.VideoPlayer);

        this.node.on('ready-to-play', this.readyToPlay, this);
        this.node.on('completed', this.completed, this);
        this.node.on('clicked', this.clickToPlay, this);

        this.node.on(cc.Node.EventType.TOUCH_START, this.clickToPlay, this);
    },

    start () {

    },

    /**点击播放 */
    clickToPlay () {
        if (!this.isUserClicked) {
            this.isUserClicked = true;
            this.videoPlayer.play();
            this.node.on('ready-to-play', this.readyToPlay, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.clickToPlay, this);
        }
    },

    /**视频事件回调函数 */
    onVideoPlayerEvent (videoPlayer, eventType, customEventData) {
        console.log('onVideoPlayerEvent videoPlayer', videoPlayer, ' eventType', eventType, ' customEventData', customEventData);
    },

    readyToPlay () {
        try {
            if (this.isUserClicked) this.videoPlayer.play();
        } catch (error) {
            console.error('videoController readyToPlay error', error);
        }
    },

    completed () {
        this.node.runAction(cc.removeSelf());
    },


    // update (dt) {},
});
