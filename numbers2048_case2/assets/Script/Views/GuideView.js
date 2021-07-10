// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  GRID_PIXEL_WIDTH,
  GRID_PIXEL_HEIGHT,
} from "../Model/ConstValue";

/**
 * 这个脚本是用来播放引导动作的
 */

cc.Class({
  extends: cc.Component,

  properties: {
    modal: cc.Node,
    cashoutHand: cc.Node, // 提现手
    modalHand: cc.Node, // 提现手
    notification: cc.Node,
    notiHand: cc.Node,
    congrat: cc.Node,
    congratBlur: cc.Node,
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    // 记录部分信息
    this.info = {
      isCashout: false, // 是否点击过提现
    };
  },

  setGameController(gameController) {
    this.gameController = gameController;
  },

  /**展示提示手 */
  showCashOutHand() {
    this.gameController.getAudioUtils().playEffect("cheer", 0.4);
    this.cashoutHand.opacity = 0;
    this.cashoutHand.active = true;
    this.cashoutHand.runAction(
      cc.sequence(
        cc.delayTime(0.1),
        cc.callFunc(() => {
          let hereState = this.cashoutHand
            .getComponent(cc.Animation)
            .play("here");
          hereState.on(
            "finished",
            () => {
              this.cashoutHand.getComponent(cc.Animation).play("shake");
            },
            this
          );
        })
      )
    );
  },
  /**展示提示手 */
  showModalHand() {
    this.gameController.getAudioUtils().playEffect("cheer", 0.4);
    this.modalHand.opacity = 0;
    this.modalHand.active = true;
    this.modalHand.runAction(
      cc.sequence(
        cc.delayTime(0.1),
        cc.callFunc(() => {
          let hereState = this.modalHand
            .getComponent(cc.Animation)
            .play("here");
          hereState.on(
            "finished",
            () => {
              this.modalHand.getComponent(cc.Animation).play("shake");
            },
            this
          );
        })
      )
    );
  },

  /**点击提现 */
  clickCashout() {
    if (this.gameController.cashView.cash >= 197 && !this.info.isCashout) {
      this.info.isCashout = true;
      this.cashoutHand.active = false;
      this.gameController.getAudioUtils().playEffect("moneyCard", 0.5);
      // this.showNotification();
      this.showEndPage();
      //   this.gameController.cashView.addCash(-200);
    }
  },

  showNotiHand() {
    const notiHand = this.notification.getChildByName("hand");
    this.showNotiHandTimeout = setTimeout(() => {
      notiHand.opacity = 0;
      notiHand.active = true;
      notiHand.runAction(cc.fadeIn(0.3));
      notiHand.getComponent(cc.Animation).play("guideHand");
    }, 1500);
  },

  hideNotiHand() {
    this.showNotiHandTimeout && clearTimeout(this.showNotiHandTimeout);
  },

  /**展示推送 */
  showNotification() {
    const inMoveTime = 0.3;
    const inFadeTime = 0.2;
    const moveY = -118; // 移动距离
    this.notification.opacity = 0;
    this.notification.active = true;
    this.notification.position = cc.v2(
      this.notification.position.x,
      this.notification.position.y - moveY
    );
    this.notification.runAction(
      cc.spawn(
        cc.callFunc(() => {
          this.showNotiHand();
          // this.gameController.getAudioUtils().playEffect('notification', 0.4);
        }),
        cc.moveBy(inMoveTime, 0, moveY),
        cc.fadeIn(inFadeTime)
      )
    );
  },

  hideNotification() {
    this.notification.runAction(
      cc.sequence(
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          this.notification.active = false;
        })
      )
    );
    this.hideNotiHand();
  },

  // 点击推送
  onCheckMessage() {
    // this.hideHand();
    this.hideNotification();
    this.showEndPage();
    // console.log('onCheckMessage');
  },

  /**展示结束页面，并引导下载 */
  showEndPage() {
    console.log(",,,,");
    //播放结束音乐
    // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
    this.node.runAction(
      cc.callFunc(() => {
        this.modal.opacity = 0;
        this.modal.active = true;
        this.modal.runAction(
          cc.sequence(
            cc.fadeIn(0.5),
            cc.callFunc(() => {
              this.modal.getChildByName("endPage").opacity = 0;
              this.modal.getChildByName("endPage").active = true;
              this.modal.getChildByName("endPage").runAction(cc.fadeIn(0.3));
            })
          )
        );
        this.gameController.endGame();
      })
    );
  },
});
