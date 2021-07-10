// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import {
  GAME_LEVEL,
  CELL_TYPE,
  ACTION_TYPE,
  CELL_STATUS,
} from "../Model/ConstValue.js";
import {
  toggleMask,
  shakeOnce,
  shake,
  flyTo,
  foreverScale,
  scaleOut,
  scaleIn,
} from "../Utils/Animation";
cc.Class({
  extends: cc.Component,

  properties: {
    hand: cc.Node, // 指引手
    box: cc.Node, // 棋盘
    mask1: cc.Node, // 棋盘遮罩
    mask2: cc.Node, // 棋盘遮罩
    combos: [cc.Node], // 喝彩
    ppcard: cc.Node, // 金币卡
    touch1: cc.Node, // 触碰点1 (5,3)
    touch2: cc.Node, // 触碰区域
    flyCards: cc.Node, // 奖励卡
    paypal: cc.Node, // 顶部栏
    // 我添加的组件
    gift: cc.Node, //礼物节点
    light: cc.Node,
    // 用来展示 刷新效果
    shipPrefab: cc.Prefab,
    //替换图片
    changepic: cc.SpriteFrame,
    // 烟花
    firework: cc.Prefab,
    // 不同类型的图
    sprite1: cc.SpriteFrame,
    sprite10: cc.SpriteFrame,
    sprite20: cc.SpriteFrame,
    sprite50: cc.SpriteFrame,
    sprite100: cc.SpriteFrame,
    sprite200: cc.SpriteFrame,
    spritePP: cc.SpriteFrame,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 烟花对象池
    this.yanhuaPool = new cc.NodePool();
    this.cashoutView = this.node
      .getChildByName("cashout")
      .getComponent("CashoutView");
    // 控制cash out的倒计时功能
    this.cashoutView.showCashout();
    // 控制礼物节点的抖动
    this.shake(this.gift);

    // this.getArray(this.box);
    // this.showShipToNode(this.gift);
    this.gameInfo = {
      nowLevel: GAME_LEVEL.LEVEL1,
      cellStatus: CELL_STATUS.CAN_MOVE,
      direcDelay: 40, // 判断延时
      lastCheckTime: 0, // 上次判断时间
      checkDistance: 20, // 移动最少的距离
      nowTouch: null, // 上次点击的触碰点
      nowTouchPos: null, // 上次点击的触碰点的位置
    };
    // 不同类型对应的图片
    this.sprites = {
      [CELL_TYPE.C1]: this.sprite1,
      [CELL_TYPE.C10]: this.sprite10,
      [CELL_TYPE.C20]: this.sprite20,
      [CELL_TYPE.C50]: this.sprite50,
      [CELL_TYPE.C100]: this.sprite100,
      [CELL_TYPE.C200]: this.sprite200,
      [CELL_TYPE.CPP]: this.spritePP,
      [CELL_TYPE.CHANGE]: this.changepic,
    };
    // 各个坐标对应的方块，下标0不用，左上角坐标为(1, 1), 顶部为第一行，第一行第二个的坐标为 (1, 2)
    this.cells = [
      [undefined, ...this.box.getChildByName("line0").children], // 这一行是看不见的
      [undefined, ...this.box.getChildByName("line1").children],
      [undefined, ...this.box.getChildByName("line2").children],
      [undefined, ...this.box.getChildByName("line3").children],
      [undefined, ...this.box.getChildByName("line4").children],
      [undefined, ...this.box.getChildByName("line5").children],
    ];

    this.comboTimes = 0;

    // 这一关将要执行的动画
    this.actionList = [];
    // 游戏总共几关
    this.gameLevels = [GAME_LEVEL.LEVEL1, GAME_LEVEL.LEVEL2, GAME_LEVEL.LEVEL3];
    // 每一关对应的动画
    this.actionLevel = [
      [
        // {type: ACTION_TYPE.SWITCH, start: cc.v2(4,2), end: cc.v2(3,2)},
        {
          // 类型
          type: ACTION_TYPE.COMBINE,
          // center: cc.v2(3, 4),
          // 中心点坐标
          center: cc.v2(3, 2),
          // 其他点的坐标
          others: [
            cc.v2(1, 1),
            cc.v2(1, 2),
            cc.v2(1, 3),
            cc.v2(1, 4),
            cc.v2(1, 5),
            cc.v2(2, 1),
            cc.v2(2, 2),
            cc.v2(2, 3),
            cc.v2(2, 4),
            cc.v2(2, 5),
            cc.v2(3, 1),
            cc.v2(3, 3),
            cc.v2(3, 4),
            cc.v2(3, 5),
            cc.v2(4, 1),
            cc.v2(4, 2),
            cc.v2(4, 3),
            cc.v2(4, 4),
            cc.v2(4, 5),
            cc.v2(5, 1),
            cc.v2(5, 2),
            cc.v2(5, 3),
            cc.v2(5, 4),
            cc.v2(5, 5),
          ],
          newType: CELL_TYPE.CHANGE,
        },
      ],
      [
        {
          type: ACTION_TYPE.CHANGE,
          center: cc.v2(0, 0),
          newType: CELL_TYPE.CPP,
        },
      ],
      [{ type: ACTION_TYPE.BOMB }],
    ];

    this.setTouchListener();
    this.changeToNextLevel();
  },

  // ---------------我添加的方法 start---------------------------------------------------------------------------

  // 制造烟花
  createYanhua() {
    // 防止对象池为空
    if (this.yanhuaPool.size() > 0) {
      var yanhua = this.yanhuaPool.get();
    } else {
      var yanhua = cc.instantiate(this.yanhua);
    }
    yanhua.parent = this.node;
    yanhua.x = -568 + 1136 * Math.random();
    yanhua.y = -320 + 640 * Math.random();
    yanhua.getComponent(cc.ParticleSystem).resetSystem();
    this.scheduleOnce(function () {
      yanhua.getComponent(cc.ParticleSystem).stopSystem();
      this.yanhuaPool.put(yanhua);
    }, 4);
  },
  /**左右摇动永久 */
  shake(node) {
    const time = 0.6;
    const maxAngle = 15;
    node.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.rotateTo(time / 4, maxAngle),
          cc.rotateTo(time / 2, -maxAngle),
          cc.rotateTo(time / 4, 0)
        )
      )
    );
  },

  // 用来展示刷新效果
  showShipToNode(node) {
    return new Promise((resolve, reject) => {
      // 不同时间电击并回到中心  时间 0~200ms
      // const randomTime = getRandom(0, 1000);
      setTimeout(() => {
        const shipPrefab = cc.instantiate(this.shipPrefab);
        shipPrefab.active = false;
        shipPrefab.parent = node;
        shipPrefab.position = cc.v2(0, 0);
        shipPrefab.active = true;
        const duration = shipPrefab.getComponent(cc.Animation).defaultClip
          .duration;
        setTimeout(() => {
          this.shipPrefab.active = false;
          // resolve()
        }, 1000);
      }, 1000);
    });
  },
  /**
   *
   * @param {需要被遍历的节点 找出其孩纸节点} box
   */
  setShip(box) {
    let array = [...box.children];
    for (let i = 1; i < array.length; i++) {
      let arr1 = [...array[i].children];
      for (let j = 0; j < arr1.length; j++) {
        let arr2 = arr1[j];
        this.showShipToNode(arr2);
      }
    }
  },
  // ---------------我添加的方法 end---------------------------------------------------------------------------

  setGameController(gameController) {
    this.gameController = gameController;
  },

  changeToNextLevel() {
    if (this.actionLevel.length === 0) {
      // setTimeout(() => {
      //   this.cashoutView.showCashout();
      // }, 600);
      // 将手指指向 cashout
      setTimeout(() => {
        this.cashoutView.clickCashout();
        this.gameController.guideView.showModalHand();
      }, 1000);
      // this.cashoutView.clickCashout();
      // this.gameController.guideView.showModalHand();
      this.offTouchListener();
      return;
    }
    let nextList = this.actionLevel.splice(0, 1)[0];
    this.actionList.push(...nextList);
    this.gameInfo.nowLevel = this.gameLevels.splice(0, 1)[0];

    if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
      this.startGuide();
    } else {
      this.doActions();
    }
  },

  setTouchListener() {
    // this.node.on(cc.Node.EventType.TOUCH_START, function ( event) {
    //     console.log('click, move');
    //     // this.actSwitch(cc.v2(4,2), cc.v2(3,2));
    //     this.doActions();
    // }, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },
  offTouchListener() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  },

  onTouchStart(touch) {
    // console.log(touch);
    if (this.gameInfo.cellStatus === CELL_STATUS.CAN_MOVE) {
      this.gameController.getAudioUtils().playEffect("click", 0.5);
      let touchPos = this.node.convertToNodeSpaceAR(touch.touch._point);
      // console.log('onTouchStart, ', this.gameInfo.nowLevel);
      if (
        this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1 ||
        this.gameInfo.nowLevel === GAME_LEVEL.LEVEL2
      ) {
        // console.log('onTouchStart, touchPos', touchPos);
        if (
          touchPos.x >= this.touch1.position.x - this.touch1.width / 2 &&
          touchPos.x <= this.touch1.position.x + this.touch1.width / 2 &&
          touchPos.y >= this.touch1.position.y - this.touch1.height / 2 &&
          touchPos.y <= this.touch1.position.y + this.touch1.height / 2
        ) {
          console.log("111111");
          this.gameInfo.nowTouch = this.touch1;
          this.gameInfo.lastCheckTime = Date.now();
          this.gameInfo.nowTouchPos = touchPos;
          this.setCellStatus(CELL_STATUS.IS_MOVE);
          // console.log('onTouchStart, doActions');
          this.doActions();
          this.offTouchListener();
        }
      } else if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL3) {
        if (
          touchPos.x >= this.touch2.position.x - this.touch2.width / 2 &&
          touchPos.x <= this.touch2.position.x + this.touch2.width / 2 &&
          touchPos.y >= this.touch2.position.y - this.touch2.height / 2 &&
          touchPos.y <= this.touch2.position.y + this.touch2.height / 2
        ) {
          this.gameInfo.nowTouch = this.touch2;
          this.gameInfo.lastCheckTime = Date.now();
          this.gameInfo.nowTouchPos = touchPos;
          this.setCellStatus(CELL_STATUS.IS_MOVE);
          this.doActions();
        }
      }
    }
  },
  onTouchMove(touch) {
    return;
  },
  onTouchEnd(touch) {
    // if (this.gameInfo.cellStatus === CELL_STATUS.IS_MOVE) {
    //     this.setCellStatus(CELL_STATUS.CAN_MOVE);
    // }
  },

  setCellStatus(status) {
    this.gameInfo.cellStatus = status;
  },

  /**执行动作序列 */
  doActions() {
    //将手隐藏
    this.hideGuide();
    if (this.actionList.length > 0) {
      let action = this.actionList.splice(0, 1)[0];
      switch (action.type) {
        case ACTION_TYPE.SWITCH:
          this.actSwitch(action.start, action.end);
          break;
        case ACTION_TYPE.COMBINE:
          if (action.list) {
            action.list.forEach((each, index) => {
              let isMulti = true;
              if (index >= action.list.length - 1) {
                isMulti = false;
              }

              this.actCombine(each.center, each.others, each.newType, isMulti);
            });
          } else {
            // 一般采用这个 组合到一个点
            /**
             * center 合并的中心点
             * others 这些点都要被合并
             * newType 接下来的动作类型
             */
            this.actCombine(action.center, action.others, action.newType);
          }
          break;
        case ACTION_TYPE.CHANGE:
          this.gameController.getAudioUtils().playEffect("change", 0.5);
          this.showCool();
          setTimeout(() => {
            this.actChange(action.center, action.newType);
          }, 600);
          break;
        case ACTION_TYPE.BOMB:
          this.showBombAnim();
          this.actBomb();
          break;
        case ACTION_TYPE.DOWN:
          action.nodes.forEach((item, index) => {
            let done = false;
            if (index >= action.nodes.length - 1) {
              done = true;
            }
            setTimeout(() => {
              this.actDown(item.start, item.end, item.newType, done);
            }, index * 30);
          });

          break;
        default:
          break;
      }
    } else {
      this.changeToNextLevel();
      this.setCellStatus(CELL_STATUS.CAN_MOVE);
    }
  },

  /**动作：交换节点
   * @ param {cc.v2} start 开始位置坐标
   * @ param {cc.v2} end 结束位置坐标
   */
  actSwitch(start, end) {
    let startNode = this.cells[start.x][start.y];
    let endNode = this.cells[end.x][end.y];
    if (!startNode || !endNode) return;
    let startPos = cc.v2(startNode.position.x, startNode.position.y);
    let endPos = cc.v2(endNode.position.x, endNode.position.y);
    const moveTime = 0.15;
    startNode.runAction(cc.moveTo(moveTime, endPos));
    endNode.runAction(
      cc.sequence(
        cc.moveTo(moveTime, startPos),
        cc.delayTime(0.1),
        cc.callFunc(() => {
          this.cells[start.x][start.y] = endNode;
          this.cells[end.x][end.y] = startNode;
          this.doActions();
        })
      )
    );
  },

  /**动作：合并
   * @ param {cc.v2} center 中心合并位置坐标
   * @ param {[cc.v2]} other 其他点的位置坐标 数组
   * @ param {string} newType 需要合成什么类型
   * @ param {boolean} isMulti 是否同时合成多个
   */
  actCombine(center, others, newType, isMulti = false) {
    // 控制光环的显示 和动画的播放
    this.light.active = true;
    this.setShip(this.box);
    this.light.getComponent(cc.Animation).play();
    // 获取中心合并位置坐标
    let centerNode = this.cells[center.x][center.y];
    if (!centerNode) return;
    let centerPos = cc.v2(centerNode.position.x, centerNode.position.y);
    let otherNodes = others.map((other) => {
      return this.cells[other.x][other.y];
    });
    // 合并的时间
    const moveTime = 0.5;
    let originPos = [];
    // 使用 setTimeout 来延缓合并的时间 （1s 后再合并）
    setTimeout(() => {
      otherNodes.forEach((other, index) => {
        originPos[index] = cc.v2(other.position.x, other.position.y);
        other.runAction(
          cc.sequence(
            cc.moveTo(moveTime, centerPos),
            cc.callFunc(() => {
              other.opacity = 0;
              other.position = originPos[index];
              if (index === otherNodes.length - 1) {
                this.gameController.getAudioUtils().playEffect("merge", 0.4);
                // this.gameController.guideView.showFlyCoin(centerPos);
                this.showFlyCards(7);

                // let cards = this.flyCards.children;
                // for (let i = 0; i < cards.length; i++) {
                //   let card = cards[i].children[0];
                //   console.log(card);
                //   card.opacity = 0;
                //   card.active = false;
                // }

                setTimeout(() => {
                  this.gameController.addCash(100);
                }, 300);
                centerNode.runAction(
                  cc.sequence(
                    cc.scaleTo(0.1, 1.15),
                    cc.scaleTo(0.1, 0.5),
                    cc.scaleTo(0.05, 1),
                    cc.callFunc(() => {
                      if (!isMulti) {
                        this.doActions();
                      }
                    })
                  )
                );
              }
            })
          )
        );
      });
    }, 3000);
  },

  /**动作：下落
   * @ param {cc.v2} start 开始位置坐标
   * @ param {cc.v2} dest 结束位置坐标
   * @ param {string} newType:可选 当需要生成新方块的时候，需要这个参数。新方块的类型
   * @ param {boolean} isDown:可选 当前下落是否全部下落完成
   */
  actDown(start, end, newType, isAllDown = false) {
    let startNode = this.cells[start.x][start.y];
    let endNode = this.cells[end.x][end.y];
    if (!startNode || !endNode) return;
    let moveTime = 0.1 * (end.x - start.x);
    let endPos = cc.v2(endNode.position.x, endNode.position.y);
    if (newType) {
      endNode.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
    } else {
      endNode.getComponent(cc.Sprite).spriteFrame = startNode.getComponent(
        cc.Sprite
      ).spriteFrame;
    }

    endNode.position = cc.v2(startNode.position.x, startNode.position.y);
    endNode.opacity = 255;
    startNode.opacity = 0; //
    endNode.runAction(
      cc.sequence(
        cc.moveTo(moveTime, endPos),
        cc.delayTime(0.1),
        cc.callFunc(() => {
          if (isAllDown) {
            this.doActions();
          }
        })
      )
    );
  },

  /**动作：变换
   * @ param {cc.v2} center 中心位置坐标
   * @ param {string} newType 需要变成什么类型
   */
  actChange(center, newType) {
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        if (i === center.x && j === center.y) {
          continue;
        }
        let node = this.cells[i][j];
        node.runAction(
          cc.sequence(
            cc.scaleTo(0.1, 1.15),
            cc.scaleTo(0.1, 0.5),
            cc.callFunc(() => {
              node.getComponent(cc.Sprite).spriteFrame = this.sprites[newType];
              if (newType === CELL_TYPE.CPP) {
                node.getChildByName("light").active = true;
                node.getChildByName("cppIcon").active = true;
              } else {
                node.getChildByName("light").active = false;
                node.getChildByName("cppIcon").active = false;
              }
              // this.showCombo();
            }),
            cc.scaleTo(0.05, 1),
            cc.callFunc(() => {
              if (i === 5 && j === 5) {
                this.showFlyCards(7);
                setTimeout(() => {
                  this.gameController.addCash(50);
                }, 300);
                this.doActions();
              }
            })
          )
        );
      }
    }
  },

  /**动作：爆炸 */
  actBomb() {
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 5; j++) {
        let node = this.cells[i][j];
        node.runAction(
          cc.sequence(
            cc.scaleTo(0.1, 1.15),
            cc.rotateTo(0.1, 10),
            cc.rotateTo(0.1, -10),
            cc.rotateTo(0.1, 10),
            cc.rotateTo(0.1, -10),
            cc.rotateTo(0.1, 5),
            cc.rotateTo(0.1, 0),
            // cc.scaleTo(0.1, 0.9),
            // cc.scaleTo(0.1, 1.2),
            // cc.scaleTo(0.1, 0.8),
            // cc.scaleTo(0.1, 1.1),
            cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 0.5)),
            cc.callFunc(() => {
              node.getChildByName("light").active = false;
              node.getChildByName("cppIcon").active = false;
              node.scale = 1;
            }),
            cc.callFunc(() => {
              if (i === 5 && j === 5) {
                // this.showFlyCards(11);
                this.showFlyCards(7);
                setTimeout(() => {
                  this.gameController.addCash(50);
                }, 300);
                this.doActions();
              }
            })
          )
        );
      }
    }
  },

  /**开始引导 */
  startGuide(pos) {
    this.hand.scale = 1;
    this.hand.opacity = 0;
    this.hand.active = true;
    this.hand.runAction(
      cc.sequence(
        cc.fadeIn(0.4),
        cc.callFunc(() => {
          this.hand.getComponent(cc.Animation).play();
        })
      )
    );
  },

  /**隐藏引导 */
  hideGuide() {
    this.hand.runAction(
      cc.sequence(
        cc.fadeOut(0.4),
        cc.callFunc(() => {
          this.hand.getComponent(cc.Animation).stop();
        })
      )
    );
    if (this.gameInfo.nowLevel === GAME_LEVEL.LEVEL1) {
      let text = cc.find("Canvas/center/game/text");
      text.runAction(
        cc.sequence(
          cc.fadeOut(0.6),
          cc.callFunc(() => {
            text.active = false;
          })
        )
      );
    }
  },

  /**展示喝彩 */
  showCombo() {
    let combo = this.combos[this.comboTimes % this.combos.length];
    this.comboTimes++;
    combo.opacity = 0;
    combo.active = true;
    combo.scale = 1.2;
    combo.runAction(
      cc.sequence(
        cc.spawn(cc.fadeIn(0.1), cc.scaleTo(0.1, 1)),
        cc.delayTime(0.15),
        cc.spawn(cc.moveTo(0.6, 0, 80), cc.fadeOut(0.6)),
        cc.callFunc(() => {
          combo.position = cc.v2(0, 0);
        })
      )
    );
  },

  /**展示pp卡飞上去 */
  showFlyCards(num = 5) {
    // 预先放置20个烟花
    var initCount = 20;
    for (let i = 0; i < initCount; i++) {
      var yanhua = cc.instantiate(this.firework);
      this.yanhuaPool.put(yanhua);
    }
    // 计时器，从0秒开始，每个1秒放一个，放15+1=16个
    this.schedule(this.createYanhua, 0.1, 15, 0);
    this.gameController.getAudioUtils().playEffect("coin", 0.4);
    // 获取pp卡
    let cards = this.flyCards.children;
    let destPos = this.flyCards.convertToNodeSpaceAR(
      this.paypal.convertToWorldSpaceAR(
        this.paypal.getChildByName("icon").position
      )
    );
    for (let i = 0; i < num; i++) {
      // 获取子节点
      let card = cards[i];
      // 获取 拖尾节点
      let motion = card.children[0];
      motion.active = false;
      // 产生烟花
      setTimeout(() => {
        let posy = -285 + Math.random() * 388;
        let posx = -194 + Math.random() * 388;
        // let ang = -180 + Math.random() * 360;
        card.position = cc.v2(posx, posy);
        // card.angle = ang;
        card.opacity = 0;
        card.active = true;
        // 将拖尾显示
        motion.active = true;
        // console.log('fly ', i, ' pos: ', card.position.x, card.position.y, ' destPos', destPos);
        card.runAction(
          cc.sequence(
            cc.fadeIn(0.1),
            cc.spawn(cc.rotateTo(0.6, 0), cc.moveTo(0.6, destPos)),
            cc.fadeOut(0.15)
            // cc.callFunc(() => {
            //     if (i === num-1) {
            //         this.setCellStatus(CELL_STATUS.CAN_MOVE);
            //     }
            // })
          )
        );
      }, i * 60);
      // yanhua.getComponent(cc.ParticleSystem).stopSystem();
    }
  },

  /**展示cool */
  showCool() {
    let cool = cc.find("Canvas/center/game/cool");
    cool.opacity = 0;
    cool.scale = 0.2;
    cool.active = true;
    cool.runAction(
      cc.sequence(
        cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.35, 1.2)),
        cc.scaleTo(0.15, 0.95),
        cc.scaleTo(0.2, 1.1),
        cc.scaleTo(0.2, 0.95),
        cc.scaleTo(0.2, 1.1),
        cc.spawn(cc.fadeOut(0.4), cc.scaleTo(0.3, 4)),
        cc.callFunc(() => {
          cool.active = false;
        })
      )
    );
  },

  showBombAnim() {
    let ba = cc.find("Canvas/center/game/anim");
    ba.opacity = 0;
    ba.scale = 0.3;
    ba.active = true;
    ba.runAction(
      cc.sequence(
        cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 4)),
        cc.callFunc(() => {
          ba.getComponent(cc.Animation).play();
        })
      )
    );
  },

  start() {},

  // update (dt) {},
});
