// 记录所有的时间

const animInfo = {
  flyTo: { time: 0.5 },
  scaleIn: { time: 0.6, largeTime: 0.4, smallTime: 0.2 },
}

/**可用于飞向pp卡并隐藏 */
function flyTo (node1, node2, cb) {
  return new Promise((resolve, reject) => {
    const flyTime = animInfo.flyTo.time;
    const minOpacity = 0;
    const scaleRatio = 4 / 5; // 开始缩放时飞行时间已经过了多少部分
    const minScale = 0.6;
    const endPos = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    node1.runAction(cc.sequence(
      cc.moveTo(flyTime * scaleRatio, endPos),
      cc.sequence(
        cc.spawn(
          cc.scaleTo(flyTime * (1 - scaleRatio), minScale),
          cc.fadeTo(flyTime * (1 - scaleRatio), minOpacity),
        ),
        cc.callFunc(() => {
          node1.active = false;
            cb && cb();
            resolve();
        })
      ),
      // cc.sequence(
      //   cc.delayTime(flyTime * scaleRatio),
      //   // 开始缩小并变透明
      //   cc.sequence(
      //     cc.spawn(
      //       cc.scaleTo(flyTime * (1 - scaleRatio), minScale),
      //       cc.fadeTo(flyTime * (1 - scaleRatio), minOpacity),
      //     ),
      //     cc.callFunc(() => {
      //       node1.active = false;
      //         cb && cb();
      //         resolve();
      //     })
      //   )
      // )
    ))
  })
}

/**一直放大缩小 */
function foreverScale (node, cb) {
  return new Promise((resolve, reject) => {
    const maxScale = 1.1;
    const minScale = 0.9;
    const largeTime = 0.25;
    const smalleTime = 0.5;
    const recoverTime = 0.25

    node.runAction(cc.repeatForever(cc.sequence(
      cc.scaleTo(largeTime, maxScale),
      cc.scaleTo(smalleTime, minScale),
      cc.scaleTo(recoverTime, 1)
    )))
  })
}

/**从小到大 */
function scaleIn (node, cb) {
  return new Promise((resolve, reject) => {
    const largeTime = animInfo.scaleIn.largeTime;
    const smallTime = animInfo.scaleIn.smallTime;
    const maxScale = 1.2;
  
    node.scale = 0;
    node.active = true;
    node.runAction(cc.sequence(
      cc.scaleTo(largeTime, maxScale),
      cc.scaleTo(smallTime, 1),
      cc.callFunc(() => {
        cb && cb();
        resolve();
      })
    ))
  })
}

/**从大到小消失 */
function scaleOut (node, cb) {
  return new Promise((resolve, reject) => {
    const maxScale = 1.05;
    const sclaeTime1 = 0.3;
    const scaleTime2 = 0.3;

    node.runAction(cc.sequence(
      cc.scaleTo(sclaeTime1, maxScale),
      cc.scaleTo(scaleTime2, 0),
      cc.callFunc(() => {
        node.active = false;
        cb && cb();
        resolve();
      })
    ))
  })
}

/**左右摇动永久 */
function shake (node) {
    const time = 0.6;
    const maxAngle = 15;
    
    node.runAction(cc.repeatForever(cc.sequence(
      cc.rotateTo(time / 4, maxAngle),
      cc.rotateTo(time / 2, -maxAngle),
      cc.rotateTo(time / 4, 0)
    )))
}

/**左右摇动一次 */
function shakeOnce (node) {
  return new Promise((resolve, reject) => {
    const time = 0.6;
    const maxAngle = 20;
    
    node.runAction(cc.sequence(
      cc.rotateTo(time / 4, maxAngle),
      cc.rotateTo(time / 2, -maxAngle),
      cc.rotateTo(time / 4, 0),
      cc.rotateTo(time / 4, maxAngle),
      cc.rotateTo(time / 2, -maxAngle),
      cc.rotateTo(time / 4, 0),
      cc.callFunc(() => {
        resolve();
      })
    ))
  })
}

/**从右边滑入进来 */
function slideInto (node, cb) {
  return new Promise((resolve, reject) => {
    const moveTime = 0.4;
    const buffer = 15;
    const bufferTime = 0.3;
    const canvas = cc.find('Canvas');
    node.position = cc.v2((canvas.width / 2) + (node.width / 2), 0); // 让其在整个页面的右边
    node.active = true;
    node.runAction(cc.sequence(
        cc.moveTo(moveTime, cc.v2(-buffer, 0)),
        cc.moveTo(bufferTime, cc.v2(0, 0)),
        cc.callFunc(() => {
            resolve();
            cb && cb();
        })
    ))    
  })
}

/**从右侧滑出去 */
function slideOut (node, cb) {
  return new Promise((resolve, reject) => {
    const moveTime = 0.2;
    const canvas = cc.find('Canvas');
    const endPos  = cc.v2((canvas.width / 2) + (node.width / 2), 0);
    node.runAction(cc.sequence(
      cc.moveTo(moveTime, endPos),
      cc.callFunc(() => {
        node.active = false;
        cb && cb();
        resolve();
      })
    ))
  })
}

/**我的moveBy 带有缓冲 */
function myMoveBy (node, options = { x: 0, y: 0 }, cb) {
  return new Promise((resolve, reject) => {
    const time = 0.23;
    node.runAction(cc.sequence(
      cc.moveBy(time, cc.v2(options.x, options.y)),
      cc.callFunc(() => {
        cb && cb();
        resolve();
      })
    ))
    // return time;
  })
}

/**闪烁方法 */
function blink (node, cb) {
  return new Promise((resolve, reject) => {
    const minOpacity = 0;
    const maxOpacity = 255;
    const blinkTime = 0.2; // 闪烁一次的事件
    const blinkTimes = 5; // 闪烁次数
    const blinkArr = [];
    for (let i = 0; i < blinkTimes; i++) {
      blinkArr.push(
        cc.fadeTo(blinkTime / 2, minOpacity),
        cc.fadeTo(blinkTime / 2, maxOpacity)
      )
    }
    blinkArr.push(
      cc.fadeOut(blinkTime / 2),
      cc.callFunc(() => {
        node.active = 0;
        cb && cb();
        resolve();
      }
    ))
    node.runAction(cc.sequence(...blinkArr))
  })
}

/**
 * 切换显示隐藏遮罩层 
 * @param {cc.Node} node cc节点
 * @param {String} type 为 in 的话为显示，为 out 的话为隐藏
 */
function toggleMask (node, type) {
  return new Promise((resolve, reject) => {
    const fadeTime = 0.5;
    const maxOpacity = 125;
    const isActive = node.active;
    // 包含了opacity不为125的情况
    if ( (node.opacity !== 0) && (type === 'out' || (type === undefined && isActive === true))) {
      // 隐藏
      node.stopAllActions();
      node.runAction(cc.sequence(
          cc.fadeOut(fadeTime),
          cc.callFunc(() => {
              node.active = false;
              resolve();
          })
      ))
      // 如果active 为 false则直接显示
    } else {
      node.stopAllActions();
      if (type === undefined || isActive === false) {
        node.opacity = 0;
        node.active = true;
        // 如果为in
      } else if (type === 'in' && node.opacity !== maxOpacity) {
        node.stopAllActions();
      }
      node.runAction(cc.sequence(
        cc.fadeTo(fadeTime, maxOpacity),
        cc.callFunc(() => {
            // this.mask.active = true;
            resolve();
        })
      ))
    }
  })
}

export {
  flyTo,
  scaleIn,
  scaleOut,
  shake,
  shakeOnce,
  blink,
  myMoveBy,
  slideInto,
  slideOut,
  toggleMask,
  foreverScale,
  animInfo
}