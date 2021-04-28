cc.Class({
  extends: cc.Component,

  properties: {
    speed: 7,
    startX: -318.5,
    startY: 262.739,
    blood: 2
  },

  onLoad () {
    this.info = {
      x: 0,
      y: 0,
      destX: 0,
      blood: 0
    };
    this.gameController = cc.find('Canvas').getComponent('GameController');
    this.bulletView = cc.find('Canvas/center/game/bullet').getComponent('BulletView');
  },

  start () {
  },

  // 只游一次
  startSwimOnce () {
    this.node.position = this.getStartPos();
    this.node.opacity = 0;
    this.node.active = true;
    this.swim();
  },

  // 拿到/生成起点位置
  getStartPos () {
    let y = 0;
    let x = 0;
    if (this.startX !== 0 && this.startY !== 0) {
      x = this.startX;
      y = this.startY;
    } else {
      x = -270-this.node.width/2;
      y = Math.random()*349-38; // -38 ~ 311;
    }
    this.info.x = x;
    this.info.y = y;
    this.info.destX = 270+this.node.width/2;
    this.info.blood = this.blood;
    return cc.v2(this.info.x, this.info.y);
  },

  swim () {
    // console.log('swim');
    this.node.runAction(cc.sequence(
      cc.spawn(cc.fadeIn(1), cc.moveTo(this.speed, cc.v2(this.info.destX, this.info.y))),
      cc.callFunc(() => {
        // console.log('swim end');
      })
    ));
  },

  /**
   * 当碰撞产生的时候调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionEnter: function (other, self) {
    // console.log('on collision enter');
    // self.node
    if (this.info.blood > 0) {
      this.bulletView.bulletHit(other.node);
      this.onHit();
    }
  },

  onHit (damage = 1) {
    if (this.info.blood<=0) return;
    let nowBlood = this.info.blood-damage;
    this.info.blood = nowBlood;
    let left = nowBlood/this.blood;
    this.node.runAction(cc.sequence(
      cc.fadeTo(0.1, left*255),
      cc.callFunc(() => {
        if (nowBlood === 0) {
          this.gameController.gameView.killFish(this.node);
        }
      })
    ));
  },
})