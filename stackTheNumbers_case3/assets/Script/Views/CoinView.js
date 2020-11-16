
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        // this.showDollar();
        
    },

    showDollar (pos, callFunc) {
        let maxLength = this.node.children.length;
        this.node.position = pos;
        this.node.children.forEach((each, index) => {
            // console.log('this.node.children each', each);
            // return;
            each.position = cc.v2(0, 0);
            each.opacity = 0;
            each.scale = 0.1;
            each.active = true;
            let xx = -70 + Math.random() * 140;
            let yy = -70 + Math.random() * 140;
            let out = cc.spawn(cc.moveTo(0.6, cc.v2(xx, yy)), cc.scaleTo(0.6, 0.7), cc.fadeOut(0.7));
            out.easing(cc.easeOut(1.7));
            each.runAction(cc.sequence(
                cc.spawn(cc.fadeIn(0.1), cc.scaleTo(0.1, 1)),
                out,
                cc.callFunc(() => {
                    if (index === maxLength-1) {
                        // console.log('结束动画');
                        callFunc && callFunc();
                    }
                })
            ));
        });
    },

    // start () {},

    // update (dt) {},
});
