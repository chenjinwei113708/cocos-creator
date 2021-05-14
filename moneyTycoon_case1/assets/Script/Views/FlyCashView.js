cc.Class({
  extends: cc.Component,
  onLoad () {
    this.cashes = this.node.children;
  },
  getStartPos () {
    let x = -160 + Math.random()*320;
    let y = 170 + Math.random()*80;
    return cc.v2(x, y);
  },
  startFly () {
    this.cashes.forEach((cash, index) => {
      let mydelay = Math.random()*0.3+index*0.2;
      cash.opacity = 0;
      cash.active = true;
      cash.position = this.getStartPos();
      cash.runAction(cc.sequence(
        cc.delayTime(mydelay),
        cc.fadeIn(0.1),
        cc.spawn(cc.moveBy(8, 0, -320), cc.repeat(cc.sequence(cc.spawn(cc.moveBy(0.4, -5, 0), cc.rotateTo(0.4, 10)), cc.spawn(cc.moveBy(0.4, 5, 0), cc.rotateTo(0.4, -10))), 10)),
        cc.fadeOut(0.1),
        cc.callFunc(() => {
          if (index === this.cashes.length-1) {
            //
          }
        })
      ));
    });
  },
  hideSomeMoney () {
    let left = this.cashes.filter(c => !c.isReceived);
    for (let i = 0; i < 6; i++) {
      let ca = left[i];
      ca.isReceived = true;
      
      ca.runAction(cc.sequence(
        cc.fadeOut(0.7),
        cc.callFunc(() => {
          ca.stopAllActions();
          ca.active = false;
        })
      ));
    }
  },
});