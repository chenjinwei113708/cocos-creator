cc.Class({
  extends: cc.Component,

  properties: {
    gun11: cc.Node, // 第一行第一支枪
    gun12: cc.Node,
    gun12b: cc.Node,
    gun13: cc.Node,
    gun14: cc.Node,
    gun15: cc.Node,
    gun21: cc.Node,
    gunBubble: cc.Node,
    ff1: cc.Node, // 第一次游泳的鱼
    ff2: cc.Node, // 第2次游泳的鱼
    pps: cc.Node, // pp奖励
    ppfly: cc.Node, // pp卡奖励
    paypal: cc.Node, // 顶部栏
    hand: cc.Node, // 指引手
    towerMask: cc.Node, // 武器区遮罩
    bombMask: cc.Node, // 武器遮罩
    bombMask2: cc.Node, // 武器遮罩2
    cashoutHand: cc.Node, // 提现手
    cashoutBtn: cc.Node,
  },

  onLoad () {
    this.info = {
      killedFishNum: 0, // 干掉了几条鱼
      finishFirstKill: false, // 完成第一次击杀没
      finishSecondKill: false, // 完成第二次击杀没
      killFishMoney: 30, // 干掉一条鱼有多少钱
    };
    this.gunSoundId = 0; // 枪声音效id
    this.canClickBubble = false; // 能否点击气泡
    this.canClickCashout = false; // 能否点击提现
    this.turnView =  cc.find('Canvas/center/game/turn_box').getComponent('TurnView');
    this.enableCollision();
   
  },

  start () {
    this.firstFishSwim();
    this.firstShoot();
  },

  setGameController (gameController) {
    this.gameController = gameController;
  },

  // 允许碰撞检测
  enableCollision () {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
  },

  killFish (fishNode) {
    // console.log('killfish: ', fishNode);
    this.info.killedFishNum += 1;
    this.showPPFly(cc.v2(fishNode.position.x, fishNode.position.y), this.info.killFishMoney);
    fishNode.active = false;
    if (this.info.killedFishNum >= this.ff1.children.length && !this.info.finishFirstKill) {
      // 第一次显示射击完成
      this.info.finishFirstKill = true;
      this.info.killFishMoney = 12;
      setTimeout(() => {
        this.gameController.addCash(10);
        this.stopFirstShoot();
      }, 0);
      setTimeout(() => {
        this.showGunBubble();
      }, 600);
    } else if ((this.info.killedFishNum >= this.ff2.children.length+this.ff1.children.length) && !this.info.finishSecondKill) {
      // 第二次射击完成
      this.info.finishSecondKill = true;
      setTimeout(() => {
        this.gameController.addCash(4);
        this.stopSecondShoot();
        setTimeout(() => {
          this.turnView.showTurn();
        }, 300);
      }, 0);
    }
  },

  firstFishSwim () {
    this.ff1.active = true;
    this.ff1.children.forEach(c => {
      let script = c.getComponent('FishView');
      script.startSwimOnce();
    });
  },

  // 第一次开始射击
  firstShoot () {
    // 第一行第一支枪
    setTimeout(() => {
      let gun11View = this.gun11.getComponent('GunView');
      gun11View.setAngle(8);
      setTimeout(() => {
        gun11View.shootLoop();
        this.playGunSound();
      }, 100);
    }, 300);

    // 第一行第四支枪
    setTimeout(() => {
      let gun14View = this.gun14.getComponent('GunView');
      gun14View.setAngle(-18);
      setTimeout(() => {
        gun14View.shootLoop();
      }, 100);
    }, 600);
  },

  // 停止第一次射击
  stopFirstShoot () {
    let gun11View = this.gun11.getComponent('GunView');
    gun11View.stopShoot();
    let gun14View = this.gun14.getComponent('GunView');
    gun14View.stopShoot();
    this.stopGunSound();
  },

  // 展示pp图标飞到顶部
  showPPFly (startPos, money=10) {
    let destPos = this.node.convertToNodeSpaceAR(this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('pp')));
    let ppcards = this.pps.children.filter(c=>!c.isOccupied).slice(0,3);
    // console.log('ppcards :', ppcards.length);
    ppcards.forEach((p, index) => {
      let xx = Math.random()*100-50;
      p.isOccupied = true;
      p.position = startPos;
      p.scale = 0;
      p.opacity = 255;
      p.active = true;
      p.runAction(cc.sequence(
        cc.delayTime(index*0.1),
        cc.spawn(cc.scaleTo(0.2, 0.4), cc.moveBy(0.2, cc.v2(xx, 50))),
        cc.spawn(cc.scaleTo(0.2, 0.8), cc.moveBy(0.2, cc.v2(xx*(-1.3), 50))),
        cc.spawn(cc.scaleTo(0.3, 1), cc.moveTo(0.3, destPos)),
        cc.fadeOut(0.3),
        cc.callFunc(() => {
          p.isOccupied = false;
          if (index === 0) {
            this.gameController.addCash(money);
            this.gameController.getAudioUtils().playEffect('coin', 0.4);
          } else if (index === ppcards.length - 1) {
            //
          }
        })
      ));
    });
  },

  // 出现底部的泡泡枪
  showGunBubble () {
    this.towerMask.opacity = 0;
    this.towerMask.active = true;
    this.towerMask.runAction(cc.sequence(
      cc.fadeTo(0.3, 130),
      cc.delayTime(0.2),
      cc.callFunc(() => {
        this.gunBubble.scale = 0;
        this.gunBubble.active = true;
        this.gunBubble.runAction(cc.sequence(
          cc.scaleTo(0.3, 1),
          cc.callFunc(() => {
            this.gameController.guideView.myFadeIn(this.hand, () => {
              this.gameController.guideView.myClickHere(this.hand, () => {
                this.canClickBubble = true;
              });
            });
          })
        ));
      })
    ));
    
    this.bombMask.opacity = 0;
    this.bombMask.active = true;
    this.bombMask.runAction(cc.fadeTo(0.4, 130));
  },

  // 点击泡泡枪
  clickGunBubble () {
    if (!this.canClickBubble) return;
    this.canClickBubble = false;
    this.towerMask.active = false;
    this.bombMask.active = false;
    this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
      this.hand.active = false;
    });
    this.gameController.getAudioUtils().playEffect('bubble', 0.6);
    this.gunBubble.runAction(cc.sequence(
      cc.moveTo(0.4, cc.v2(this.gun13.position.x, this.gun13.position.y)).easing(cc.easeOut(1.9)),
      cc.callFunc(() => {
        this.gun13.active = true;
        this.gunBubble.active = false;
        this.showHandMoveGun();
      })
    ));
  },

  // 展示动画，手引导枪合成
  showHandMoveGun () {
    this.towerMask.opacity = 0;
    this.towerMask.active = true;
    this.towerMask.runAction(cc.fadeTo(0.4, 130));
    this.bombMask2.opacity = 0;
    this.bombMask2.active = true;
    this.bombMask2.runAction(cc.fadeTo(0.4, 130));

    this.hand.opacity = 0;
    this.hand.active = true;
    this.hand.getComponent(cc.Animation).play('handMove');
  },

  // 合并枪
  combineGun19 () {
    this.towerMask.active = false;
    this.bombMask2.active = false;
    this.hand.getComponent(cc.Animation).stop();
    this.hand.runAction(cc.sequence(
      cc.fadeOut(0.1),
      cc.callFunc(() => {
        this.hand.active = false;
      })
    ));
    this.gameController.getAudioUtils().playEffect('combine', 0.6);
    this.gun13.runAction(cc.sequence(
      cc.moveTo(0.1, this.gun12.position),
      cc.callFunc(() => {
        this.gun13.opacity = 0;
        this.gun12.opacity = 0;
        this.gun12b.active = true;
        this.gun12b.runAction(cc.sequence(
          cc.scaleTo(0.2, 1.1),
          cc.scaleTo(0.2, 1),
          cc.callFunc(() => {
            this.secondFishSwim();
            this.secondShoot();
            let gun12 = this.gun12;
            this.gun12 = this.gun12b;
            this.gun13.active = false;
            gun12.active = false;
          })
        ));
      })
    ));
  },

  secondFishSwim () {
    this.ff2.active = true;
    this.ff2.children.forEach(c => {
      let script = c.getComponent('FishView');
      script.startSwimOnce();
    });
  },

  // 第2次开始射击
  secondShoot () {
    setTimeout(() => {
      let gun11View = this.gun11.getComponent('GunView');
      gun11View.setAngle(0);
      setTimeout(() => {
        gun11View.shootLoop();
      }, 100);
    }, 0);

    setTimeout(() => {
      let gun12View = this.gun12.getComponent('GunView');
      gun12View.setAngle(8);
      setTimeout(() => {
        gun12View.shootLoop();
      }, 600);
    }, 150);

    setTimeout(() => {
      let gun14View = this.gun14.getComponent('GunView');
      gun14View.shootLoop();
      this.playGunSound();
    }, 150);

    setTimeout(() => {
      let gun15View = this.gun15.getComponent('GunView');
      gun15View.setAngle(-50);
      setTimeout(() => {
        gun15View.shootLoop();
      }, 200);
    }, 150);

    setTimeout(() => {
      let gun21View = this.gun21.getComponent('GunView');
      gun21View.setAngle(17);
      setTimeout(() => {
        gun21View.shootLoop();
      }, 500);
    }, 150);
  },

  // 停止第2次射击
  stopSecondShoot () {
    this.gun11.getComponent('GunView').stopShoot();
    this.gun12.getComponent('GunView').stopShoot();
    this.gun14.getComponent('GunView').stopShoot();
    this.gun15.getComponent('GunView').stopShoot();
    this.gun21.getComponent('GunView').stopShoot();
    this.stopGunSound();
  },

  // 播放枪声
  playGunSound () {
    this.gunSoundId = cc.audioEngine.play(this.gameController.getAudioUtils().gun, true, 0.4);
  },
  // 停止播放枪声
  stopGunSound () {
    cc.audioEngine.stop(this.gunSoundId)
  },

  /**展示几张pp卡从一个地方飞到指定位置，最后缩小消失 */
  showPPcardFly (startPos) {
    let destPos = this.ppfly.convertToNodeSpaceAR(
        this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('pp').position)
    );
    // let oriPos = cc.v2(0, 0);
    this.ppfly.children.forEach((node, index) => {
        node.opacity = 0;
        node.scale = 1;
        node.active = true;
        node.position = startPos;
        node.runAction(cc.sequence(
            cc.delayTime(0.1*index),
            cc.fadeIn(0.2),
            cc.spawn(cc.moveTo(0.3, destPos), cc.scaleTo(0.3, 0.5)),
            cc.spawn(cc.scaleTo(0.2, 0.3), cc.fadeOut(0.2), cc.moveBy(0.2, -50, -20)),
            cc.callFunc(() => {
                if (index === 0) {
                    this.gameController.getAudioUtils().playEffect('coin', 0.6);
                    this.gameController.addCash(200);
                }
                if (index === this.ppfly.children.length-1) {
                  setTimeout(() => {
                    this.canClickCashout = true;
                    this.showCashoutHand();
                  }, 500);
                }
            })
        ))
    });
  },

  // 提现指引手势
  showCashoutHand () {
    this.gameController.endGame();
    this.cashoutBtn.getComponent(cc.Animation).play();
    this.gameController.guideView.myFadeIn(this.cashoutHand, () => {
      this.gameController.guideView.myClickHere(this.cashoutHand);
    });
  },

  // 点击提现
  clickCashout () {
    if (this.canClickCashout) {
      this.gameController.download();
    }
  },
  
})