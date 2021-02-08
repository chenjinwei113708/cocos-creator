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
        fresh: cc.Node,
        audio: cc.Node
    },

    onLoad () {
        this.time = 0
        this.canFill = false
        this.fillTime = 0
        this.speed = 0
        this.progressBar = this.node.getComponent(cc.ProgressBar)
    },

    fillProgressBar (time, cb) {
        return new Promise((resolve, reject) => {
            this.audio.getComponent('AudioUtils').playEffect('freshMusic', 0.3)
            this.fresh.active = true
            this.canFill = true
            this.fillTime = time || 1000
            setTimeout(() => {
                this.progressBar.progress = 1
                this.canFill = false
                this.fillTime = 0
                this.fresh.active = false
                resolve(cb)
            }, time) 
        })
    },

    start () {

    },

    update (dt) {
        if (!this.canFill || this.fullTime === 0) return
        this.progressBar.progress += dt * this.fillTime / 1000
    },
});
