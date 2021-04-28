import { BULLET_TYPE } from '../Model/ConstValue';

cc.Class({
  extends: cc.Component,
  properties:{
    purpleBullet: cc.Prefab,
    yellowBullet: cc.Prefab,
  },

  onLoad () {
    this.purpleBulletPool = new cc.NodePool();
    this.yellowBulletPool = new cc.NodePool();
    let initCount = 8;
    for (let i = 0; i < initCount; ++i) {
      let purple = cc.instantiate(this.purpleBullet); // 创建节点
      this.purpleBulletPool.put(purple); // 通过 put 接口放入对象池
      let yellow = cc.instantiate(this.yellowBullet); // 创建节点
      this.yellowBulletPool.put(yellow); // 通过 put 接口放入对象池
    }
  },

  createPurpleBullet: function (parentNode) {
    let enemy = null;
    if (this.purpleBulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
        enemy = this.purpleBulletPool.get();
    } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        enemy = cc.instantiate(this.purpleBullet);
    }
    enemy.parent = parentNode; // 将生成的加入节点树
    return enemy;
  },

  createYellowBullet: function (parentNode) {
    let enemy = null;
    if (this.yellowBulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
        enemy = this.yellowBulletPool.get();
    } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        enemy = cc.instantiate(this.yellowBullet);
    }
    enemy.parent = parentNode; // 将生成的加入节点树
    return enemy;
  },

  onBulletKilled: function (enemy) {
    // enemy 应该是一个 cc.Node
    let name = enemy.name;
    if (name === 'purpleBullet') {
      this.purpleBulletPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    } else if (name === 'yellowBullet') {
      this.yellowBulletPool.put(enemy);
    }
  },

  /**
   * 开火
   * @param {*} startPos 起点坐标
   * @param {number} angle 角度（非弧度）
   * @param {BULLET_TYPE} type 
   * @param {number} speed 子弹速度
   */
  fire (startPos, angle, type, speed) {
    // console.log('fire', startPos, angle, type);
    let bullet = undefined;
    if (type === BULLET_TYPE.PURPLE) {
      bullet = this.createPurpleBullet(this.node);
    } else if (type === BULLET_TYPE.YELLOW) {
      bullet = this.createYellowBullet(this.node);
    } else {
      return;
    }
    startPos = this.node.convertToNodeSpaceAR(startPos);
    bullet.angle = angle;
    let destPos = this.calcuDestPos(startPos, 90+angle);
    bullet.position = startPos;
    // console.log('startPos,', startPos, '   destPos,', destPos);
    // console.log('bullet,', bullet);
    bullet.active = true;
    bullet.runAction(cc.sequence(
      cc.moveTo(speed, destPos),
      cc.callFunc(() => {
        this.onBulletKilled(bullet)
      })
    ));
  },

  /**
   * 计算目标点坐标
   * @param {*} startPos 
   * @param {*} angle 已x轴正方向为起点,角度（非弧度）
   */
  calcuDestPos (startPos, angle) {
    const r = 540; // 斜边长度，子弹射程
    let x = 0;
    let y = 0;
    if (angle === 90) {
      x = 0;
      y = r;
    } else {
      x = r*Math.cos(Math.PI/180*angle);
      y = r*Math.sin(Math.PI/180*angle);
    }
    return cc.v2(startPos.x+x, startPos.y+y);
  },

  // 子弹击中了鱼
  bulletHit (bullet) {
    bullet.stopAllActions();
    this.onBulletKilled(bullet);
  },
})