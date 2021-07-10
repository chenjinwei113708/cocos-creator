cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    // this.speed = 5;
    this.speedX = 3;
    this.speedY = 4;
  },

  
  // // 检测到碰撞的处理函数 只要碰撞了他就会运行
  // onCollisionEnter: function (other, self) {
  //   // 碰撞之后将小球回收到对象池中
  //   if (self.tag == 11) {
  //     GraphView.onBallKilled(self.node);
  //   }
  //   // 调用碰撞事件
  //   this.nodeCollision(other);
  // },

  /**
   * 碰撞事件 碰撞之后的动作
   * @param {Node} other
   */
  nodeCollision(other) {
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
    this.changeBg(other, label.string);
  },

  /**
   *
   * @param {*} other 被碰撞的砖块
   * @param {*} string 内部的数字
   */
  changeBg(other, string) {
    var sprite = other.node.getComponent(cc.Sprite);
    if (string >= 50) {
      sprite.spriteFrame = new cc.SpriteFrame(
        cc.url.raw("resources/box_22.png")
      );
    } else if (string >= 40) {
      sprite.spriteFrame = new cc.SpriteFrame(
        cc.url.raw("resources/box_21.png")
      );
    } else if (string >= 30) {
      sprite.spriteFrame = new cc.SpriteFrame(
        cc.url.raw("resources/box_5.png")
      );
    } else if (string >= 20) {
      sprite.spriteFrame = new cc.SpriteFrame(
        cc.url.raw("resources/box_4.png")
      );
    } else if (string >= 10) {
      sprite.spriteFrame = new cc.SpriteFrame(
        cc.url.raw("resources/box_8.png")
      );
    }
  },
  update(dt) {
    if (GraphView.gameType == 1) {
      // 控制子弹位置的变化 即在y轴方向的速度
      this.node.x += this.speedX;
      this.node.y += this.speedY;
    }
    // if (this.node.y >= 580) {
    //   GraphView.onBallKilled(this.node);
    // }
  },
});
