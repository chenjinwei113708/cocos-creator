const MOVE_DISTANCE = 82.7;

cc.Class({
  extends: cc.Component,
  properties: {
    o68: cc.Node,
    g55: cc.Node,
    n39: cc.Node,
    i18: cc.Node,
    b9: cc.Node,
    leftNum: cc.Node,
  },
  onLoad () {
    this.waitBalls = [this.o68, this.g55, this.n39, this.i18, this.b9]; // 等候出现的球,出场顺序从前往后
    this.tipArea = []; // 球球提示区 [cc.Node]
    this.leftBalls = 26; // 显示剩下的球，并非实际剩下的球
    this.currentClickNum = ''; // 当前需要点击的数值， 比如 o68
    this.canClick = false; // 能否点击数字
    this.gameController = cc.find('Canvas').getComponent('GameController');
  },

  start () {
    // this.pushNextBall();
    // setTimeout(() => {
    //   this.putBall2TipArea(this.waitBalls.shift());
    // }, 1500);
  },

  /**
   * 拿出下一个球，放到展示区
   * @returns 放成功没
   */
  pushNextBall () {
    let ball = this.waitBalls.shift();
    if (ball) {
      this.putBall2TipArea(ball);
      return true;
    } else return false;
  },

  // 拿到第一个球应该所在位置
  getFirstBallPos () {
    return cc.v2(-157.942, 1.026);
  },

  // 设置能否点击
  setCanClick (canClick) {
    this.canClick = canClick;
  },

  getCanClick () {
    return this.canClick;
  },

  /**
   * 把球放入提示区
   * @param {*} node 
   */
  putBall2TipArea (node) {
    if (!node) return;
    this.currentClickNum = node.name; // 比如 o68
    let startPos = this.getFirstBallPos();
    const moveSpeed = 0.4;
    node.position = cc.v2(startPos.x-100, startPos.y);
    node.active = true;
    node.scale = 0;
    if (node.name !== 'o68') {
      this.gameController.getAudioUtils().playEffect(node.name, 1.4);
    }
    
    node.runAction(cc.sequence(
      cc.spawn(cc.moveTo(moveSpeed, startPos), cc.scaleTo(moveSpeed, 1.18)).easing(cc.easeIn(1.1)),
      cc.callFunc(() => {})
    ));
    this.setLeftNum(--this.leftBalls);
    this.tipArea.forEach((ball, index) => {
      let destPos = cc.v2(ball.position.x+MOVE_DISTANCE, ball.position.y);
      ball.runAction(cc.sequence(
        cc.spawn(cc.moveTo(moveSpeed, destPos), cc.scaleTo(moveSpeed, 1)).easing(cc.easeIn(1.1)),
        cc.callFunc(() => {
          if (index === this.tipArea.length - 1) {
            // 移出显示区，把球从数组中去掉
            if (this.tipArea[0].position.x>210) {
              this.tipArea[0].runAction(cc.sequence(
                cc.fadeOut(0.1),
                cc.callFunc(() => {
                  this.tipArea.shift();
                })
              ));
            }
          }
        })
      ));
    });
    this.tipArea.push(node);
    this.setCanClick(true);
  },

  setLeftNum (num) {
    this.leftNum.getComponent(cc.Label).string = num;
  },

  /**
   * 拿到当前正确的点击数
   * @return {string} 
   */
  getCurrentClickNum () {
    return this.currentClickNum;
  },

})