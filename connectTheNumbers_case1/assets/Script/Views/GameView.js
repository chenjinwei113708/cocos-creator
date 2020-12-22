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
  CELL_TYPE,
  CELL_STATUS
} from '../Model/ConstValue';

cc.Class({
  extends: cc.Component,

  properties: {
    touch: cc.Node, // 用户触碰点
    box: cc.Node, // 棋盘
    boxEffect: cc.Node, // 棋盘效果层
    ppcard: cc.Node, // pp卡
    spriteC150: cc.SpriteFrame,
    spriteC50: cc.SpriteFrame,
    spriteC200: cc.SpriteFrame,
    spriteCPP: cc.SpriteFrame,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    // 用户手势方向
    this.line = cc.find('Canvas/center/game/line').getComponent(cc.Graphics);
    // 实际连接线
    this.path = cc.find('Canvas/center/game/path').getComponent(cc.Graphics);
    this.payapl = cc.find('Canvas/center/UI/paypal');
    // 游戏参数
    this.gameInfo = {
      status: CELL_STATUS.CAN_MOVE,
      nowType: null, // 正在移动的方块类型
      nowBoxPos: null, // 目前选中的方块的棋盘坐标
      nowGamePos: null, // 目前选中的方块的游戏坐标
      selectedArr: [], // 目前选中的所有方块 [boxPos]
    }
    /**棋盘坐标从左上角开始，x代表行，y代表列
     * 左上角坐标为(1,1)，代表第一行的第一列, 0下标不要 */
    this.boxCells = [
      [],
      [undefined, ...this.box.children[0].children],
      [undefined, ...this.box.children[1].children],
      [undefined, ...this.box.children[2].children],
      [undefined, ...this.box.children[3].children],
      [undefined, ...this.box.children[4].children],
    ];
    this.boxEffectCells = [
      [],
      [undefined, ...this.boxEffect.children[0].children],
      [undefined, ...this.boxEffect.children[1].children],
      [undefined, ...this.boxEffect.children[2].children],
      [undefined, ...this.boxEffect.children[3].children],
      [undefined, ...this.boxEffect.children[4].children],
    ];
    this.sprites = {
      [CELL_TYPE.C150]: this.spriteC150,
      [CELL_TYPE.C200]: this.spriteC200,
      [CELL_TYPE.C50]: this.spriteC50,
      [CELL_TYPE.CPP]: this.spriteCPP,
    };
    this.typeColors = {
      [CELL_TYPE.C50]: new cc.color(210, 73, 101),
      [CELL_TYPE.C150]: new cc.color(228, 231, 66),
      [CELL_TYPE.C200]: new cc.color(103, 198, 176),
      [CELL_TYPE.CPP]: new cc.color(134, 188, 90),
    }
  },

  start () {
    this.setTouchListener();
    // 开启碰撞检测系统
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true; // 碰撞debug
    this.initBoxCells();
    this.showGuideHand();
  },

  initBoxCells () {
    let model = this.gameController.gameModel.level1Model;
    this.boxCells.forEach((line, index) => {
      if (index === 0) return;
      line.forEach((cell, index2) => {
        if (index2 === 0) return;
        cell.getComponent('CardView').setInfo(cc.v2(index, index2), model[index][index2]);
      });
    });
  },

  setGameController (gameController) {
    this.gameController = gameController;
  },

  setTouchListener () {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  },

  offTouchListener () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  },

  setCellStatus (status) {
    this.gameInfo.status = status;
  },

  // 监听：开始触碰
  onTouchStart (eventTouch) {
    if (this.gameInfo.status === CELL_STATUS.CAN_MOVE) {
      // this.setCellStatus(CELL_STATUS.IS_MOVE);
      this.hideGuideHand();
      var touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
      // console.log('onTouchStart', touchPos.x, ' ', touchPos.y);
      this.touch.active = true;
      this.touch.position = touchPos;
    }
  },

  // 监听：开始移动
  onTouchMove (eventTouch) {
    if (this.gameInfo.status === CELL_STATUS.IS_MOVE) {
      var touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
      // console.log('onTouchMove', touchPos.x, ' ', touchPos.y);
      this.touch.position = touchPos;
      this.moveUserLine(touchPos);
    }
  },

  // 监听：触碰结束
  onTouchEnd (eventTouch) {
    if (this.gameInfo.status === CELL_STATUS.IS_MOVE) {
      this.setCellStatus(CELL_STATUS.DONE_MOVE);
      var touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
      // console.log('onTouchEnd', touchPos.x, ' ', touchPos.y);
      this.resetUserLine(touchPos, CELL_TYPE.CPP); // 重置用户手势线
      this.initLine(touchPos, CELL_TYPE.CPP); // 重置路径连线
      if (this.gameInfo.selectedArr && this.gameInfo.selectedArr.length > 1) {
        this.cellFlyToTop(this.gameInfo.selectedArr);
      } else {
        if (this.gameInfo.selectedArr[0]) {
          let boxPos = this.gameInfo.selectedArr[0];
          this.boxCells[boxPos.x][boxPos.y].getComponent('CardView').setIsConnected(false);
        }
        this.setCellStatus(CELL_STATUS.CAN_MOVE);
      }
      
      this.touch.active = false;
    } else if (this.gameInfo.status === CELL_STATUS.CAN_MOVE) {
      this.touch.active = false;
    }
  },

  /**
   * 选中一个方块
   * @param {cc.v2} boxPos 方块的棋盘坐标
   * @param {CELL_TYPE} cellType 方块的类型
   * @param {cc.v2} gamePos 方块的游戏坐标
   */
  pickCell (boxPos, cellType, gamePos, callback) {
    // 如果是第一个点
    if (this.gameInfo.status === CELL_STATUS.CAN_MOVE) {
      this.setCellStatus(CELL_STATUS.IS_MOVE);
      this.gameInfo.nowType = cellType;
      this.gameInfo.nowBoxPos = cc.v2(boxPos.x, boxPos.y);
      this.gameInfo.nowGamePos = cc.v2(gamePos.x, gamePos.y);

      this.gameInfo.selectedArr.splice(0); // 清空原数组
      this.gameInfo.selectedArr.push(cc.v2(boxPos.x, boxPos.y));
      this.boxCells[boxPos.x][boxPos.y].getComponent('CardView').setIsConnected(true);

      this.resetUserLine(gamePos, cellType);
      this.initLine(gamePos, cellType);
      // console.log('pickCell CAN_MOVE', boxPos);
    } else if (this.gameInfo.status === CELL_STATUS.IS_MOVE) {
      if (this.gameInfo.nowBoxPos.x === boxPos.x && this.gameInfo.nowBoxPos.y === boxPos.y) return; // 选中同一个方块了，返回
      let canSelect = this.checkCanSelect(boxPos, cellType);
      if (canSelect) {
        this.gameInfo.nowBoxPos = cc.v2(boxPos.x, boxPos.y);
        this.gameInfo.nowGamePos = cc.v2(gamePos.x, gamePos.y);

        this.gameInfo.selectedArr.push(cc.v2(boxPos.x, boxPos.y));
        this.boxCells[boxPos.x][boxPos.y].getComponent('CardView').setIsConnected(true);

        this.resetUserLine(gamePos, cellType);
        this.drawLine(gamePos, callback);
      }
      // console.log('pickCell canSelect', canSelect);
      // console.log('pickCell IS_MOVE', boxPos);
    } 
  },

  /**判断这个方块能不能被选中 */
  checkCanSelect (boxPos, cellType) {
    let result = true;
    // 规则一：类型需要一致
    if (cellType !== this.gameInfo.nowType) {
      result = false;
      return result;
    }
    // 规则二：只能选相邻的8个点
    if (Math.abs(boxPos.x - this.gameInfo.nowBoxPos.x) > 1 || Math.abs(boxPos.y - this.gameInfo.nowBoxPos.y) > 1) {
      result = false;
      return result;
    }
    return result;
  },

  // update (dt) {
  // },

  /**把棋盘坐标转换成游戏坐标 */
  convertToGamePos (boxPos) {
    // 起始(-208, 215), 间隔104
    let x = (boxPos.x-1)*104-208;
    let y = 215-(boxPos.y-1)*104;
    return cc.v2(x, y);
  },

  /**重置用户手势线条 */
  resetUserLine(startPos, type) {
    const graph = this.line;
    graph.clear();
    graph.moveTo(startPos.x, startPos.y);
    graph.strokeColor = this.typeColors[type];
    graph.fillColor = this.typeColors[type];
  },

  /**绘制用户手势线条 */
  moveUserLine(movePos) {
    const graph = this.line;
    graph.clear();
    graph.moveTo(this.gameInfo.nowGamePos.x, this.gameInfo.nowGamePos.y);
    graph.lineTo(movePos.x, movePos.y);
    // graph.lineTo(200, -200);
    graph.stroke();
    // graph.fill();
  },

  /**绘制初始的连线 */
  initLine (startPos, type) {
    const graph = this.path;
    // console.log('tryLine', graph);
    graph.clear();
    graph.moveTo(startPos.x, startPos.y);
    graph.strokeColor = this.typeColors[type];
    graph.fillColor = this.typeColors[type];
    // graph.lineTo(0, 119.79);
    // // graph.lineTo(200, -200);
    // graph.stroke();
    // // graph.fill();
  },

  /**绘制连线路径 */
  drawLine(movePos, callback) {
    // console.log('drawLine', movePos);
    const graph = this.path;
    graph.lineTo(movePos.x, movePos.y);
    // graph.lineTo(200, -200);
    graph.stroke();
    // console.log('drawLine', Date.now());
    if (callback) {
      setTimeout(() => {
        callback && callback();
      }, 100);
    }
    this.gameController.getAudioUtils().playEffect('click', 1);
    // graph.fill();
  },

  /**选中的卡片飞到顶部 */
  cellFlyToTop(arr) {
    let iconloca = this.payapl.getChildByName('loca');
    let destPos = this.node.convertToNodeSpaceAR(this.payapl.convertToWorldSpaceAR(iconloca.position));
    
    arr.forEach((boxPos, index) => {
      let cell = this.boxEffectCells[boxPos.x][boxPos.y];
      let cellbtm = this.boxCells[boxPos.x][boxPos.y];

      cell.opacity = 255;
      cell.active = true;
      cellbtm.opacity = 0;
      cell.getComponent(cc.Sprite).spriteFrame = cellbtm.getComponent(cc.Sprite).spriteFrame;
      if (cellbtm.getComponent('CardView').info.type === CELL_TYPE.CPP) {
        cell.getChildByName('lighty').active = true;
        cell.getChildByName('lightpp').active = true;
      } else {
        cell.getChildByName('lighty').active = false;
        cell.getChildByName('lightpp').active = false;
      }

      let originPos = cc.v2(cell.x, cell.y);
      cell.runAction(cc.sequence(
        cc.delayTime(0.02*index),
        cc.moveTo(0.4, destPos),
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          cell.position = originPos;
          cell.active = false;
          // cellbtm.active = true;
          // cellbtm.position = originPos;
          if (index === (arr.length - 1)) {
            // this.setCellStatus(CELL_STATUS.CAN_MOVE); // 允许用户进行下一次消除
            this.setCellStatus(CELL_STATUS.DONE_MOVE);
            // this.changeAllToCPP();
          }
          if (index === 0) {
            let num = arr.length >= 25 ? 300 : 100; // 如果连接个数大于等于25个
            this.showPPCard(num);
          }
        })
      ));
    });
  },

  // 展示pp卡
  showPPCard (num = 100) {
    const pp = this.ppcard;
    this.gameController.getAudioUtils().playEffect('moneyCard', 0.5);
    pp.getChildByName('text').getComponent(cc.Label).string = '$ '+ num + '.00';
    pp.scale = 0;
    pp.opacity = 0;
    pp.active = true;
    pp.runAction(cc.sequence(
      cc.spawn(cc.scaleTo(0.3, 1.1), cc.fadeIn(0.3)),
      cc.scaleTo(0.1, 0.9),
      cc.scaleTo(0.1, 1),
      cc.delayTime(0.4),
      cc.scaleTo(0.3, 0),
      cc.callFunc(() => {
        this.gameController.addCash(Number(num));
        this.gameController.getAudioUtils().playEffect('coin', 0.5);
        if (num === 100) {
          this.changeAllToCPP();
        } else if (num === 300) {
          this.gameController.guideView.showCashOutHand();
        }
      })
    ));
  },

  /**全部卡片转变成pp卡 */
  changeAllToCPP () {
    this.setCellStatus(CELL_STATUS.DONE_MOVE);
    let index = 0;
    for(let i = 1; i <= 5; i++) {
      for(let j = 1; j <= 5; j++) {
        let cell = this.boxCells[i][j];
        cell.runAction(cc.sequence(
          cc.delayTime(0.015*index),
          cc.scaleTo(0.2, 0),
          cc.callFunc(() => {
            let cardScript = cell.getComponent('CardView');
            cardScript.setInfo(cardScript.info.boxPos, CELL_TYPE.CPP);
            cell.active = true;
            cell.opacity = 255;
          }),
          cc.scaleTo(0.2, 1),
          cc.callFunc(() => {
            // console.log('change index::::::', index);
            if (i===5 && j===5) {
              this.offTouchListener(); // 不允许用户点击
              this.setCellStatus(CELL_STATUS.CAN_MOVE);
              this.autoSelectAll();
            }
          })
        ));
        index++;
      }
    }
  },

  /**自动连接所有方块 */
  autoSelectAll () {
    // console.log('-------- auto');
    let index = 0;
    for(let i = 1; i <= 5; i++) {
      for(let j = 1; j <= 5; j++) {
        let k = i%2 === 0 ? (6-j) : j;
        let cell = this.boxCells[i][k];
        // console.log('auto select', i, ', ', k);
        let cardScript = cell.getComponent('CardView');
        setTimeout(() => {
          let callback = undefined;
          if (i=== 5 && j === 5) {
            callback = () => {
              let touchEvent = {};
              touchEvent.getLocation = () => cc.v2(0,0);
              this.onTouchEnd(touchEvent);
            };
            // setTimeout(callback, 5*5*30);
          }
          cardScript.autoPickCell(callback);
          
        }, 40*index);
        index++;
      }
    }
  },

  showGuideHand () {
    const hand = cc.find('Canvas/center/game/hand');
    hand.opacity = 0;
    hand.active = true;
    hand.getComponent(cc.Animation).play('guide1');
  },

  hideGuideHand () {
    const hand = cc.find('Canvas/center/game/hand');
    hand.getComponent(cc.Animation).stop();
    hand.active = false
  }


});
