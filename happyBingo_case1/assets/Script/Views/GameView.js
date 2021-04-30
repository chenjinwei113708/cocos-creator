const MOVE_DISTANCE = 82.7;

cc.Class({
  extends: cc.Component,
  properties: {
    award: cc.Node,
    circle: cc.Node, // 指引圈圈
    hand: cc.Node, // 指引手
    bingo: cc.Node, // 欢呼
    ppcard: cc.Node, // 提现卡 
    mask: cc.Node, // 遮罩
  },
  onLoad () {
    this.waitView = cc.find('Canvas/center/game/waitArea').getComponent('WaitView');
    this.freeInterval = undefined; // 自动出球
    this.info = {
      isFirstClick: true, // 是不是第一次点击
      killedBalls: [], // 消除的数字 [string]
      showedBalls: [], // 出现过的数字,
      isCashCardShow: false, // 提现卡出现没
    };
    this.bindClickEffect();
  },

  start () {
    this.firstGuide();
  },

  setGameController (gameController) {
    this.gameController = gameController;
  },

  bindClickEffect () {
    this.node.on(cc.Node.EventType.TOUCH_START, () => {
      this.gameController.getAudioUtils().playEffect('click', 0.6);
    }, this);
  },

  /**
   * 点击数字
   * @param {*} value 
   */
  onClickNum (event, value) {
    if (!this.waitView.getCanClick()) return;
    let correct = this.waitView.getCurrentClickNum();
    // if (value !== correct) return;
    // console.log('value:', value, ' Balls:',this.info.showedBalls);
    if (this.info.showedBalls.indexOf(value) === -1 || this.info.killedBalls.indexOf(value) > -1) {
      this.gameController.getAudioUtils().playEffect('click', 0.6);
      return;
    }
    // console.log('correct, value:', value);
    // this.waitView.setCanClick(false);
    this.showPPAward(value);
    this.hideTip();
    this.gameController.getAudioUtils().playEffect('bubble', 0.6);
  },

  /**
   * 拿到需要提示的坐标
   * @param {*} value 当前需要点击的值
   * @returns 点击的值所处的坐标
   */
  getCorrectHintPos (value) {
    return this.award.getChildByName(value).position;
  },

  // 第一步引导
  firstGuide () {
    this.waitView.pushNextBall();
    let current = this.waitView.getCurrentClickNum();
    this.info.showedBalls.push(current);
    let hintPos = this.getCorrectHintPos(current);
    this.showTip(hintPos);
  },

  // 开启自由模式
  startFreeGame () {
    const delay = 2600;
    let shoot = () => {
      let success = this.waitView.pushNextBall();
      if (!success) {
        // 牌出完了
        this.freeInterval && clearInterval(this.freeInterval);
        if (this.info.killedBalls.length < 5) {
          this.showCashCard();
        }
        return;
      }
      this.hideTip();
      let origin = this.waitView.getCurrentClickNum();
      this.info.showedBalls.push(origin);
      setTimeout(() => {
        let current = this.waitView.getCurrentClickNum();
        if (current === origin && this.info.killedBalls.indexOf(current) === -1) {
          this.hideTip();
          let hintPos = this.getCorrectHintPos(current);
          this.showTip(hintPos, false);
        }
      }, 1300);
    };
    shoot();
    this.freeInterval = setInterval(shoot, delay);
  },

  /**
   * 展示提示信息
   * @param {*} pos 
   */
  showTip (pos, withHand=true) {
    this.circle.position = cc.v2(pos.x, pos.y);
    this.circle.opacity = 0;
    this.circle.active = true;
    this.circle.getComponent(cc.Animation).play();

    if (withHand) {
      this.hand.position = cc.v2(pos.x, pos.y);
      this.gameController.guideView.myFadeIn(this.hand, () => {
        this.gameController.guideView.myClickHere(this.hand);
      });
    }
  },

  hideTip () {
    this.circle.getComponent(cc.Animation).stop();
    this.circle.active = false;
    this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
      this.hand.stopAllActions();
      this.hand.active = false;
    });
  },

  /**
   * 展示pp标记
   * @param {string} name 
   */
  showPPAward (name) {
    this.info.killedBalls.push(name);
    let ppaward = this.award.getChildByName(name);
    ppaward.active = true;
    ppaward.opacity = 0;
    ppaward.scale = 0;
    ppaward.runAction(cc.sequence(
      cc.spawn(cc.fadeTo(0.1, 255), cc.scaleTo(0.1, 1.1)),
      cc.spawn(cc.fadeTo(0.1, 255), cc.scaleTo(0.1, 1)),
      cc.callFunc(() => {
        if (this.info.isFirstClick) {
          this.info.isFirstClick = false;
          this.startFreeGame();
        }
      })
    ));
    if (name === 'b9') {
      if (this.info.killedBalls.length === 5) {
        // 全部集齐
        this.gameController.addCash(60);
        this.showBingo();
      } else {
        // 没全部集齐
        this.showCashCard();
      }
      
    } else {
      this.gameController.addCash(10);
    }
    this.gameController.getAudioUtils().playEffect('coin', 0.6);
  },

  // 游戏结束
  gameFinish () {
    this.gameController.endGame();
  },

  showBingo () {
    this.gameController.getAudioUtils().playEffect('cheer', 0.6);
    this.bingo.scale = 0;
    this.bingo.active = true;
    this.bingo.runAction(cc.sequence(
      cc.scaleTo(0.2, 1.1).easing(cc.easeOut(1.9)),
      cc.scaleTo(0.2, 1).easing(cc.easeIn(1.9)),
      cc.scaleTo(0.2, 1.1).easing(cc.easeOut(1.9)),
      cc.scaleTo(0.2, 1).easing(cc.easeIn(1.9)),
      cc.scaleTo(0.2, 1.1).easing(cc.easeOut(1.9)),
      cc.spawn(cc.scaleTo(1.2, 7), cc.fadeOut(1.1)).easing(cc.easeIn(2.2)),
      cc.callFunc(() => {
        this.showCashCard();
      })
    ));
  },

  // 展示现金卡
  showCashCard () {
    if (this.info.isCashCardShow) return;
    this.info.isCashCardShow = true;
    this.gameFinish();
    this.gameController.getAudioUtils().playEffect('moneyCard', 0.6);
    const text = this.ppcard.getChildByName('text');
    text.getComponent(cc.Label).string = '$ '+this.gameController.cashView.targetCash+'';
    this.ppcard.scale = 0;
    this.ppcard.active = true;
    this.ppcard.runAction(cc.sequence(
      cc.scaleTo(0.2, 1.1),
      cc.scaleTo(0.1, 1),
      cc.callFunc(() => {
        this.hand.position = cc.v2(14.32, -153);
        this.gameController.guideView.myFadeIn(this.hand, () => {
          this.gameController.guideView.myClickHere(this.hand);
        });
      })
    ));
    this.mask.opacity = 0;
    this.mask.active = true;
    this.mask.runAction(cc.fadeTo(0.2, 160));
  }

})