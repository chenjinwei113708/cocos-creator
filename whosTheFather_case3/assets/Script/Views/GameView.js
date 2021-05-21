import { COMPARE_ITEMS, LIKE_WHO } from '../Model/ConstValue.js';

cc.Class({
  extends: cc.Component,
  properties: {
    mask1: cc.Node, // 开场遮罩
    hand: cc.Node, // 指引手
    chooseText: cc.Node, // 提示选择的文字
    items: cc.Node, // 比较项
    likeWho: cc.Node, // 选择像谁
    proof: cc.Node, // 证据提示
    picGroup: cc.Node, // 人物头像
    player: cc.Node, // 人物
    sum: cc.Node, // 总结
    ratioNode: cc.Node, // 缩放节点
    talks: cc.Node, // 谈话
    question: cc.Node, // 问题
    blood: cc.Node, // 血型
    tryAgain: cc.Node, // 重试一次
  },
  onLoad () {
    this.info = {
      canClick: false,
      waitItems: [COMPARE_ITEMS.NOSE, COMPARE_ITEMS.BLOOD],
      isFirstClick: true, // 是否第一次点击
      nowCompareItem: undefined, // 当前比较项目
      guideTimeout: undefined, // 提示手的定时器
    };
    this.answers = {
      [COMPARE_ITEMS.NOSE]: LIKE_WHO.RIGHT,
      [COMPARE_ITEMS.BLOOD]: LIKE_WHO.LEFT,
    };
  },
  start () {
    // this.startFirstGuide();
    this.showTakls();
  },
  setGameController (gameController) {
    this.gameController = gameController;
  },
  setCanClick (bool) {
    this.info.canClick = bool;
  },
  startFirstGuide () {
    this.mask1.opacity = 0;
    this.mask1.active = true;
    this.mask1.runAction(cc.sequence(
      cc.fadeTo(0.7, 90),
      cc.callFunc(() => {})
    ));
    this.gameController.guideView.myFadeIn(this.hand, () => {
      this.gameController.guideView.myClickHere(this.hand);
    });
  },
  hideFirstGuide () {
    this.info.isFirstClick = false;
    this.mask1.runAction(cc.sequence(
      cc.fadeOut(0.2),
      cc.callFunc(() => {
        this.mask1.active = false;
      })
    ));
    this.hand.stopMyAnimation && this.hand.stopMyAnimation(() => {
      this.hand.stopAllActions();
      this.hand.active = false;
    });
    this.items.runAction(cc.sequence(
      cc.fadeOut(0.2),
      cc.callFunc(() => {
        this.items.active = false;
      })
    ));
    this.chooseText.runAction(cc.sequence(
      cc.fadeOut(0.2),
      cc.callFunc(() => {
        this.chooseText.active = false;
      })
    ));
  },

  /**
   * 点击比较项目
   * @param {*} event 点击事件
   * @param {COMPARE_ITEMS} itemName 比较项的名字
   * @returns 
   */
  onClickItem (event, itemName) {
    if (this.info.canClick) {
      this.setCanClick(false);
    } else return;
    if (this.info.isFirstClick) {
      this.hideFirstGuide();
    }
    // console.log('onClickItem:', event, itemName);
    this.showProof(itemName);
    this.zoomGame(1.2);
    setTimeout(() => {
      this.showPicsDetail(itemName);
      this.showLikeWhoBtns(() => {
        this.setCanClick(true);
      });
    }, 200);
  },

  /**
   * 点击像左边还是像右边
   * @param {*} event 
   * @param {LIKE_WHO} side 左边还是右边
   * @returns 
   */
  onClickLike (event, side) {
    if (this.info.canClick) {
      this.setCanClick(false);
    } else return;
    // console.log('onClickLike:', event, side);
    if (this.info.nowCompareItem === COMPARE_ITEMS.BLOOD) {
      this.hideBlood();
    }

    if (side === this.answers[this.info.nowCompareItem]) {
      // 答对了
      // console.log('onClickLike 答对了');
      this.switchToNextItem();
      this.showRightOrWrong(side, true, () => {});
      this.gameController.getAudioUtils().playEffect('right', 0.7);
      this.hideGuideHand();
    } else {
      // 答错了
      this.switchToNextItem();
      this.hideGuideHand();
      this.showRightOrWrong(side, false, () => {
        // this.setCanClick(true);
      });
      this.gameController.getAudioUtils().playEffect('wrong', 0.6);
    }
  },

  /**
   * 展现证据提示
   * @param {COMPARE_ITEMS} itemName 比较项的名称
   */
  showProof (itemName) {
    let text = this.proof.getChildByName('text');
    let pic = this.proof.getChildByName('pic');
    console.log('showProof itemName:', itemName);
    console.log('showProof waitItems:', [...this.info.waitItems]);
    console.log('showProof -------');
    // 修改样式
    switch(itemName) {
      case COMPARE_ITEMS.EYE:
        text.position = cc.v2(75.706, -17.76);
        text.getComponent(cc.Label).string = 'Compare with eyes';
        break;
      case COMPARE_ITEMS.NOSE:
        text.position = cc.v2(75.706, -17.76);
        text.getComponent(cc.Label).string = 'Compare with noses';
        break;
      case COMPARE_ITEMS.BLOOD:
        text.position = cc.v2(159.252, -17.76);
        text.getComponent(cc.Label).string = 'Compare with blood type';
        this.showBlood();
        break;
    }
    pic.children.forEach(n => {
      if (n.name === itemName) n.active = true;
      else n.active = false;
    });
    // 出现提示
    let originScle = 0.898;
    this.proof.stopAllActions();
    this.proof.scale = 0;
    this.proof.active = true;
    this.proof.runAction(cc.sequence(
      cc.scaleTo(0.2, 1.1),
      cc.scaleTo(0.1, originScle),
      cc.callFunc(() => {})
    ));
  },

  /**
   * 隐藏证据提示
   */
  hideProof () {
    this.proof.stopAllActions();
    this.proof.runAction(cc.sequence(
      cc.scaleTo(0.2, 0),
      cc.callFunc(() => {
        this.proof.active = false;
      })
    ));
  },

  zoomGame (ratio) {
    if (ratio === this.ratioNode.scale) return;
    let targetPos = cc.v2(0, 0);
    let speed = 0.5; // s
    // let shouldRatio = this.gameController.gameModel.getPositionConfig().game.scale;
    // let targetRatio = 0;
    if (ratio > 1) {
      // targetRatio = ratio*shouldRatio;
      targetPos = cc.v2(this.ratioNode.position.x, this.ratioNode.position.y-100);
    } else if (ratio === 1){
      // targetRatio = shouldRatio;
      targetPos = cc.v2(this.ratioNode.position.x, this.ratioNode.position.y+100);
    }
    this.ratioNode.stopAllActions();
    this.ratioNode.runAction(cc.sequence(
      cc.spawn(cc.moveTo(speed, targetPos), cc.scaleTo(speed, ratio)).easing(cc.easeOut(1.9)),
      cc.callFunc(() => {})
    ));
  },

  /**
   * 展示人物图片细节
   * @param {*} itemName 
   */
  showPicsDetail (itemName) {
    this.info.nowCompareItem = itemName;
    console.log('showPicsDetail, itemName:', itemName);
    console.log('showPicsDetail, waitItems before:', [...this.info.waitItems]);
    if (this.info.waitItems.indexOf(itemName) > -1) {
      this.info.waitItems.splice(this.info.waitItems.indexOf(itemName), 1);
    }
    console.log('showPicsDetail, waitItems left:', [...this.info.waitItems]);
    this.picGroup.children.forEach(child => {
      let pic = child.getChildByName('pic');
      pic.stopAllActions();
      pic.runAction(cc.sequence(
        cc.spawn(cc.scaleTo(0.3, 1.8), cc.moveTo(0.3, cc.v2(0, -10))),
        cc.callFunc(() => {})
      ));
      let nose = pic.getChildByName('nose');
      if (itemName === COMPARE_ITEMS.NOSE) {
        nose.active = true;
      } else {
        nose.active = false;
      }
    });
  },

  /**
   * 展示人物图片的大概
   */
  showPicsOutline () {
    this.picGroup.children.forEach(child => {
      let pic = child.getChildByName('pic');
      pic.stopAllActions();
      pic.runAction(cc.sequence(
        cc.spawn(cc.scaleTo(0.2, 1), cc.moveTo(0.2, cc.v2(0, 0))),
        cc.callFunc(() => {})
      ));
      let nose = pic.getChildByName('nose');
      nose.active = false;
    });
  },

  /**
   * 展示像谁的选项
   */
  showLikeWhoBtns (callback) {
    let originPos = cc.v2(this.likeWho.position.x, this.likeWho.position.y);
    this.likeWho.stopAllActions();
    this.likeWho.opacity = 0;
    this.likeWho.active = true;
    this.likeWho.position = cc.v2(this.likeWho.position.x, this.likeWho.position.y-100);
    this.gameController.getAudioUtils().playEffect('click', 0.7);
    this.likeWho.runAction(cc.sequence(
      cc.spawn(cc.fadeIn(0.2), cc.moveTo(0.2, originPos)),
      cc.callFunc(() => {
        callback && callback();
        this.shouGuideHand(this.answers[this.info.nowCompareItem]);
      })
    )); 
  },

  /**
   * 隐藏像谁的选项
   */
  hideLikeWhoBtns () {
    let originPos = cc.v2(this.likeWho.position.x, this.likeWho.position.y);
    let hidePos = cc.v2(this.likeWho.position.x, this.likeWho.position.y-100);
    this.likeWho.stopAllActions();
    this.likeWho.runAction(cc.sequence(
      cc.spawn(cc.fadeOut(0.2), cc.moveTo(0.2, hidePos)),
      cc.callFunc(() => {
        this.likeWho.position = originPos;
        this.likeWho.active = false;
      })
    )); 
  },

  /**
   * 显示回答正确还是错误
   * @param {LIKE_WHO} side 
   * @param {Boolean} isCorrect 
   * @param {Function} callback
   */
  showRightOrWrong (side, isCorrect, callback) {
    let person = undefined;
    if (side === LIKE_WHO.LEFT) {
      person = this.player.getChildByName('p1');
    } else if (side === LIKE_WHO.RIGHT) {
      person = this.player.getChildByName('p2');
    }
    if (!person) return;
    let ans = isCorrect ? 'right' : 'wrong';
    let ansFlagNode = person.getChildByName('answer').getChildByName(ans);
    ansFlagNode.stopAllActions();
    ansFlagNode.opacity = 0;
    ansFlagNode.active = true;
    ansFlagNode.runAction(cc.sequence(
      cc.blink(0.8, 2),
      cc.callFunc(() => {
        callback && callback();
      })
    ));
  },

  /**
   * 换到下一个比较项
   * @param {*} itemName 
   * @param {*} delay 延时展示
   */
  switchToNextItem (itemName, delay) {
    let name = itemName;
    this.hideLikeWhoBtns();
    this.hideProof();
    this.showPicsOutline();
    console.log('switchToNextItem before:', [...this.info.waitItems]);
    if (this.info.waitItems.length > 0) {
      if (!itemName) {
        name = this.info.waitItems.shift();
        console.log('switchToNextItem left:', [...this.info.waitItems]);
      }
    } else {
      // 没有更多比较项了
      setTimeout(() => {
        this.showSumPage();
      }, 400);
      return;
    }
    setTimeout(() => {
      this.showProof(name);
      this.showPicsDetail(name);
      this.showLikeWhoBtns(() => {
        this.setCanClick(true);
      });
      
    }, delay||1000);
  },

  /**展示总结页 */
  showSumPage () {
    this.gameController.endGame();
    this.gameController.getAudioUtils().playEffect('moneyCard', 0.7);
    this.zoomGame(1);
    this.sum.opacity = 0;
    this.sum.active = true;
    this.sum.runAction(cc.sequence(
      cc.fadeIn(0.4),
      cc.callFunc(() => {
        this.setCanClick(true);
        // this.shouGuideHand(LIKE_WHO.RIGHT, 3000);
      })
    ));
  },

  hideSumPage () {
    this.hideGuideHand();
    this.sum.runAction(cc.sequence(
      cc.fadeOut(0.2),
      cc.callFunc(() => {})
    ));
  },

  /**
   * 选择谁是爸爸
   * @param {LIKE_WHO} side 
   */
  chooseFather (event, side) {
    if (this.info.canClick) {
      this.setCanClick(false);
    } else return;
    
    // if (side === LIKE_WHO.LEFT) {
    //   // 错误
    //   this.gameController.getAudioUtils().playEffect('youAreNot', 0.7);
    // } else if (side === LIKE_WHO.RIGHT) {
    //   // 正确
    //   this.gameController.getAudioUtils().playEffect('youAre', 0.7);
    // }

    // this.gameController.getAudioUtils().playEffect('youAreNot', 0.7);
    this.gameController.download();
    // this.hideSumPage();
    // this.showTryAgain();
    // this.gameController.guideView.showEndPage();
  },


  /**
   * 出现提示手
   * @param {*} side 
   * @param {*} time 延时出现
   */
  shouGuideHand (side, time) {
    let pos = undefined;
    if (!side) {
      side = this.answers[this.info.nowCompareItem];
    };
    if (side === LIKE_WHO.LEFT) {
      pos = cc.v2(-65.659, -425.805);
    } else if (side === LIKE_WHO.RIGHT) {
      pos = cc.v2(180.835, -425.805);
    }
    
    this.info.guideTimeout && clearTimeout(this.info.guideTimeout);
    let timeout = setTimeout(() => {
      if (this.info.guideTimeout !== timeout) return;
      this.hand.position = pos;
      this.gameController.guideView.myFadeIn(this.hand, () => {
        this.gameController.guideView.myClickHere(this.hand);
      });
    }, time || 2000);
    this.info.guideTimeout = timeout;
  },

  /**
   * 隐藏提示手
   */
  hideGuideHand () {
    this.info.guideTimeout && clearTimeout(this.info.guideTimeout);
    this.info.guideTimeout = undefined;
    if (this.hand.stopMyAnimation) {
      this.hand.stopMyAnimation(() => {
        this.hand.stopAllActions();
        this.hand.active = false;
      });
    } else {
      this.hand.stopAllActions();
      this.hand.active = false;
    }
  },

  /**
   * 展示谈话内容
   */
  showTakls () {
    this.showPersonTalk('p1', () => {
      this.showPersonTalk('p2', () => {
        this.playersSit();
        this.showQuestion();
      });
    });
  },

  /**
   * 展示某个人的谈话内容
   * @param {*} person 
   */
  showPersonTalk (person, callback) {
    if (['p1', 'p2'].indexOf(person) === -1 ) return;
    let pNode = this.talks.getChildByName(person);
    let originPos = cc.v2(pNode.position.x, pNode.position.y);
    let startPos = cc.v2(pNode.position.x, pNode.position.y+100);

    pNode.scale = 0;
    pNode.position = startPos;
    pNode.active = true;
    
    pNode.runAction(cc.sequence(
      cc.spawn(cc.scaleTo(0.3, 1), cc.moveTo(0.3, originPos)).easing(cc.easeOut(2)),
      cc.delayTime(1),
      cc.callFunc(() => {
        pNode.opacity = 0;
        callback && callback();
        pNode.active = false;
      })
    ));
  },

  /**
   * 让玩家坐下
   */
  playersSit () {
    ['p1', 'p2'].forEach((name, index) => {
      let person = this.player.getChildByName(name);
      let stand = person.getChildByName('stand');
      let sit = person.getChildByName('sit');
      stand.runAction(cc.sequence(
        cc.fadeOut(0.5),
        cc.callFunc(() => {
          stand.active = false;
        })
      ));
      sit.opacity = 0;
      sit.active = true;
      sit.runAction(cc.sequence(
        cc.fadeIn(0.5),
        cc.callFunc(() => {
          if (index === 1) {
            // 都坐好了
          }
        })
      ));
    });
  },

  /**
   * 展现问题
   */
  showQuestion (callback) {
    let mask = this.question.getChildByName('mask');
    let text = this.question.getChildByName('text');
    mask.opacity = 0;
    mask.active = true;
    mask.runAction(cc.sequence(
      cc.fadeTo(0.2, 200),
      cc.delayTime(0.7),
      cc.fadeOut(0.2),
      cc.callFunc(() => {
        mask.active = false;
      })
    ));
    text.scale = 0;
    text.active = true;
    text.runAction(cc.sequence(
      cc.scaleTo(0.2, 1).easing(cc.easeIn(1.9)),
      cc.scaleTo(0.8, 1.1),
      cc.spawn(cc.scaleTo(0.2, 1.2), cc.fadeOut(0.2)),
      cc.callFunc(() => {
        callback && callback();
        text.active = false;
        // 游戏开始~~~
        this.zoomGame(1.2);
        this.switchToNextItem(undefined, 200);
      })
    ));
  },

  /**
   * 展示血型
   */
  showBlood () {
    this.blood.active = true;
    let mask = this.blood.getChildByName('mask');
    mask.opacity = 0;
    mask.runAction(cc.fadeTo(0.2, 230));
    ['blood1', 'blood2', 'bloodBaby'].forEach((name, index) => {
      let bnode = this.blood.getChildByName(name);
      bnode.scale = 0;
      bnode.runAction(cc.sequence(
        cc.scaleTo(0.3, 0.75).easing(cc.easeIn(1.8)),
        cc.callFunc(() => {
          if (index === 2) {
            // 完成展示
          }
        })
      ));
    }); 
  },

  /**
   * 隐藏血型
   */
  hideBlood () {
    this.blood.runAction(cc.sequence(
      cc.fadeOut(0.2),
      cc.callFunc(() => {
        this.blood.active = false;
      })
    ));
  },

  // 展示重新尝试的页面
  showTryAgain () {
    this.tryAgain.active = true;
    let mask = this.tryAgain.getChildByName('mask');
    let wrong = this.tryAgain.getChildByName('wrong');
    let btn = this.tryAgain.getChildByName('btn');
    let box = this.tryAgain.getChildByName('box');

    mask.opacity = 0;
    mask.runAction(cc.fadeTo(0.3, 200));

    btn.opacity = 0;
    box.opacity = 0;
    wrong.opacity = 0;
    wrong.scale = 2;
    wrong.runAction(cc.sequence(
      cc.spawn(cc.scaleTo(0.5, 1), cc.fadeIn(0.5)).easing(cc.easeIn(2.5)),
      cc.callFunc(() => {
        box.runAction(cc.fadeIn(0.4));
        btn.runAction(cc.sequence(
          cc.fadeIn(0.6),
          cc.callFunc(() => {
            btn.getComponent(cc.Animation).play();
          })
        ));
      })
    ));
  }
})