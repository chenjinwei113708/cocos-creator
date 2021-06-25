cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad() {
    this.isUp = true;
  },

  // 检测到碰撞的处理函数 只要碰撞了他就会运行
  onCollisionEnter: function (other, self) {
    if (other.node._name === 'underwall') return self.isLaunch = true;
    // 碰撞之后将小球回收到对象池中
    if (self.tag == 11) {
      // 由于无法用传统的方法来进行回弹 直接记录该坐标, 生成新的小球回弹即可
      // GraphView.createSpringbackBall(self.node);
      // 消除小球
      // GraphView.onBallKilled(self.node);
      this.isUp = false;
    }
    // cnosole.log()
    // 调用碰撞事件
    this.nodeCollision(other);
  },

  /**
   * 碰撞事件 碰撞之后的动作
   * @param {Node} other
   */
  nodeCollision(other) {
    // console.log('碰撞')
    // 识别砖块 并得到其第一个孩子节点
    var children = other.node.children;
    var label = children[0].getComponent(cc.Label);
    // 获取节点的坐标
    var startPosition = other.node.getPosition();
    // 控制结束后小球停止生成
    if (other.tag == 5) {
      if (label.string <= 0) {
        GraphView.gameType = 0;
        GraphView.removeAllBall();
      }
    }
    if (label.string > 0) {
      // 节点递减
      label.string--;
      this.changeBg(other, label.string);
      GameView.playCorrectMusicByThrottle();
      // 每一次增加的幅度
      GameView.timeBegin += 0.0067;
      GameView.progressView.setProgress(GameView.timeBegin, 0.1);
    } else {
      // 开始播放 pp卡收取的动作
      GameView.showPps(startPosition)
        .then(() => {
          // 开始增加cash金额
          return GameView.cashView.addCash(other.tag * 20, 0.5);
        })
        .then(() => {
          if (other.tag == 5) {
            console.log("游戏结束");
            GraphView.removeAllBall();
            // 设置延迟
            setTimeout(() => {
              GameView.audioUtils.playEffect("cheer");
              return GameView.awardView
                .showAwardPage()
                .then(() => GameView.gameController.endGame());
            }, 1000);
          }
        });

      other.node.active = false;
    }
    // 用来控制砖块背景的变化
    // this.changeBg(other, label.string);
  },

  /**
   *
   * @param {*} other 被碰撞的砖块
   * @param {*} string 内部的数字
   */
  changeBg(other, string) {
    var sprite = other.node.getComponent(cc.Sprite);
    if (string > 30 && string <= 40 && sprite.spriteFrame !== GraphView.img30to40) {
      sprite.spriteFrame = GraphView.img30to40;
    } else if (string > 20 && string <= 30 && sprite.spriteFrame !== GraphView.img20to30) {
      sprite.spriteFrame = GraphView.img20to30;
    } else if (string > 10 && string <= 20 && sprite.spriteFrame !== GraphView.img10to20) {
      sprite.spriteFrame = GraphView.img10to20;
    } else if (string <= 10 && sprite.spriteFrame !== GraphView.img0to10) {
      sprite.spriteFrame = GraphView.img0to10;
    }
  },

  update(dt) {
    if (GraphView.gameType == 1) {
      // 控制子弹位置的变化 即在y轴方向的速度
      this.node.y += this.isUp ? 20 : -20;
    }
    if (this.node.y >= 580) {
      GraphView.onBallKilled(this.node);
    }
  },
});
