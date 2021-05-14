cc.Class({
  extends: cc.Component,
  properties: {
    hand: cc.Node, // 指引手
    bag: cc.Node, // 钱袋
    player: cc.Node, // 玩家
    progress: cc.Node,
    ppcard: cc.Node, // pp卡
    mask: cc.Node,
  },
  onLoad () {
    this.flyCashView = this.node.getChildByName('flycash').getComponent('FlyCashView');
    this.progressView = this.progress.getComponent('ProgressView');

    this.showHandClickBag();
    this.info = {
      jumpTimes: 0,
      isBagClicked: false,
    };
  },
  setGameController (gameController) {
    this.gameController = gameController;
  },
  showHandClickBag () {
    this.gameController.guideView.myFadeIn(this.hand, () => {
      this.gameController.guideView.myClickHere(this.hand);
    });
  },
  // 点击钱袋
  onClickBag () {
    if (this.info.isBagClicked) return;
    this.info.isBagClicked = true;
    this.bag.getComponent(cc.Animation).stop();
    this.bag.runAction(cc.sequence(
      cc.spawn(cc.scaleTo(0.1, 1), cc.moveTo(0.1, 0, 220), cc.rotateTo(0.1, 0)),
      cc.callFunc(() => {
        let state = this.bag.getComponent(cc.Animation).play('pour');
        this.flyCashView.startFly();
        setTimeout(() => {
          this.playerJump();
        }, 600);
        
        state.on('finished', () => {
          console.log('done');
          this.bag.active = false;
        });
      })
    ));
    this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
      this.hand.active = false;
    });
  },
  playerJump () {
    let jumpState = this.player.getComponent(cc.Animation).play();

    setTimeout(() => {
      this.info.jumpTimes++;
      // console.log('timeout, ', this.info.jumpTimes);
      this.gameController.addCash(66);
      this.gameController.getAudioUtils().playEffect('coin', 0.7);
      this.progressView.setProgress(this.gameController.cashView.targetCash/200);
      this.flyCashView.hideSomeMoney();
    }, 1000);

    let finishCB = () => {
      // console.log('finished, ', this.info.jumpTimes);
      if (this.info.jumpTimes === 1) {
        this.moveAndJump(-120);
      } else if (this.info.jumpTimes === 2) {
        this.moveAndJump(190);
      } else if (this.info.jumpTimes === 3) {
        this.gameController.addCash(2);
        this.showPPcard();
      }
      jumpState.off('finished', finishCB, this);
    };

    jumpState.on('finished', finishCB, this);
  },
  moveAndJump (moveByX) {
    this.player.runAction(cc.sequence(
      cc.moveBy(0.6, moveByX, 0).easing(cc.easeInOut(2.0)),
      cc.callFunc(() => {
        this.playerJump();
      })
    ));
  },
  showPPcard () {
    // console.log('showPPcard');
    this.gameController.endGame();
    this.gameController.getAudioUtils().playEffect('cheer', 0.7);
    this.mask.opacity = 0;
    this.mask.active = true;
    this.mask.runAction(cc.fadeTo(0.6, 150));
    this.ppcard.scale = 0;
    this.ppcard.active = true;
    this.ppcard.runAction(cc.sequence(
      cc.scaleTo(0.7, 1).easing(cc.easeIn(1.9)),
      cc.callFunc(() => {
        this.hand.position = cc.v2(122, -244.9);
        this.gameController.guideView.myFadeIn(this.hand, () => {
          this.gameController.guideView.myClickHere(this.hand);
        });
      })
    ));
  },

})