import { BULLET_TYPE } from '../Model/ConstValue';

cc.Class({
  extends: cc.Component,
  properties: {
    shootSpeed: 0.3,
    bulletSpeed: 1.8,
    bulletType: 'yellow', // BULLET_TYPE
  },

  onLoad () {
    this.aa = this.node.getChildByName('aa'); // 枪火焰
    this.bulletView = cc.find('Canvas/center/game/bullet').getComponent('BulletView');
    this.shootInterval = undefined; // 射击定时器
  },

  start () {
    // this.node.angle = -30; // 往右偏转
    // setTimeout(() => {
    //   this.setAngle(-18); // setAngle 和 angle 互为相反数
    //   setTimeout(() => {
    //     this.shootLoop();
    //   }, 300);
    // }, 1000);
  },

  // setAngle 和 真正angle 互为相反数
  setAngle (angle) {
    // console.log('angle 1 :', this.node.angle);
    this.node.runAction(cc.sequence(
      cc.rotateTo(0.1, angle),
      cc.callFunc(() => {
        // console.log('angle 2 :', this.node.angle);
      })
    ))
  },

  // 射击一次
  shoot () {
    this.aa.active = true;
    this.aa.opacity = 0;
    this.aa.runAction(cc.sequence(
      cc.fadeIn(0.1),
      cc.fadeOut(0.1)
    ));
    // console.log('shoot: angele,',this.node.angle);
    this.bulletView.fire(
      this.node.convertToWorldSpaceAR(this.aa.position),
      this.node.angle,
      this.bulletType,
      this.bulletSpeed
    );
  },

  // 一直射击
  shootLoop () {
    this.shoot();
    this.shootInterval = setInterval(() => {
      this.shoot();
    }, this.shootSpeed*1000);
  },

  // 停止射击
  stopShoot () {
    this.shootInterval && clearInterval(this.shootInterval);
  },

})