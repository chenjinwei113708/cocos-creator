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
        cardGet: cc.Node,
        cardBai: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setCardRotate();
    },

    /**让卡片旋转 */
    setCardRotate () {
        const speed = 60;
        const xuanzhuan = 15;
        let angle = 0;
        let unit = xuanzhuan;
        this.cardGet.is3DNode = true;
        // this.cardGet.setRotation(0, 60, 0, 0);
        
        console.log('cardGet', this.cardGet);
        // this.cardGet.setRotation(0, 10, 0, 0);
        // this.cardGet.setRotation(cc.Quat({x: 0, y: 60, z:0, w: 0}));
        // this.cardGet.rotationY = 88;
        
        angle += unit;
        // this.cardGet.rotationY = angle;
        this.cardGet.eulerAngles = cc.v3(0, angle, 0);
        let inter = setInterval(() => {
            angle += unit;
            // this.cardGet.rotationY = angle;
            this.cardGet.eulerAngles = cc.v3(0, angle, 0);
            if (angle >= 90) {
                unit = 0-xuanzhuan;
                this.cardGet.getChildByName('num').active = true;
                this.cardGet.getChildByName('icon').active = true;
                this.cardGet.getChildByName('pic').active = true;
                this.cardGet.getComponent(cc.Sprite).spriteFrame = this.cardBai;
            } else if (angle <= 0) {
                inter && clearInterval(inter);
            }
        }, speed);
        this.cardGet.runAction(cc.moveTo((180/xuanzhuan)*speed/1000), cc.v3(152.904, 0, 0));
        // this.cardGet.runAction(cc.)setRotation
    },

    start () {

    },

    // update (dt) {},
});
