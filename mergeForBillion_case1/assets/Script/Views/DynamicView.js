cc.Class({
  extends: cc.Component,

    properties: {
      balls:cc.Node,
      sprite16: cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.isContacted = false;
      // this.rigidbody = .enabledContactListener = true;
      this.gameView = cc.find('Canvas/center/game').getComponent('GameView');
    },

    /**
     * 当碰撞产生的时候调用
     * 只在两个碰撞体开始接触时被调用一次
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onBeginContact: function (contact, selfCollider, otherCollider) {
      // console.log('contact:',contact);
      // 只允许触发一次碰撞事件
      if (!this.isContacted) {
        this.isContacted = true;
        let current = selfCollider.node;
        let currentPos = cc.v2(current.position.x, current.position.y);
        // console.log('selfCollider:',selfCollider.node.name);
        // console.log('otherCollider:',otherCollider.node.name);
        let ciblings = this.balls.children.filter(c => c.name === 'cc8'&&c.active);
        // console.log('ciblings:', ciblings);
        // console.log('finish ------ \n');
        ciblings.forEach((card, index) => {
          card.runAction(cc.sequence(
            cc.callFunc(() => {

            }),
            cc.spawn(cc.moveTo(0.6, currentPos), cc.fadeTo(0.6, 0), cc.scaleTo(0.4, 0.1)),
            cc.callFunc(() => {
              if (index === ciblings.length - 1) {
                current.runAction(cc.sequence(
                  cc.callFunc(() => {
                    current.getComponent(cc.Sprite).spriteFrame = this.sprite16;
                  }),
                  cc.scaleTo(0.5, 1.15),
                  cc.callFunc(() => {
                    this.gameView.showPPcard();
                  })
                ));
                card.active = false;
              } else {
                card.active = false;
              }
            })
          ))
        });
      }
    },
});