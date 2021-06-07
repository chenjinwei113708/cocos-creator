const animInfo = {
  flyTo: { time: 0.5 },
  scaleIn: { time: 0.6, largeTime: 0.4, smallTime: 0.2 },
}

/**可用于飞向pp卡并隐藏 */
function flyTo (node1, node2, cb) {
  return new Promise((resolve, reject) => {
    const flyTime = animInfo.flyTo.time;
    const minOpacity = 100;
    const scaleRatio = 3 / 5; // 开始缩放时飞行时间已经过了多少部分
    const minScale = 0.3;
    const endPos = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    node1.runAction(cc.spawn(
      cc.sequence(
        cc.moveTo(flyTime, endPos),
        cc.callFunc(() => cb && cb())
      ),
      cc.sequence(
        cc.delayTime(flyTime * scaleRatio),
        cc.spawn(
          cc.scaleTo(flyTime * (1 - scaleRatio), minScale),
          cc.fadeTo(flyTime * (1 - scaleRatio), minOpacity),
        ),
        cc.callFunc(() => {
          node1.active = false;
          resolve()
        })
      )
    ))
  })
}

function scaleIn (node, cb) {
  return new Promise((resolve, reject) => {
    const largeTime = 0.3;
    const smallTime = 0.15;
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
    const maxScale = 1.15;
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


function shake (node) {
  const time = 0.8;
  const maxAngle = 15;
  
  node.runAction(cc.repeatForever(cc.sequence(
    cc.rotateTo(time / 4, maxAngle),
    cc.rotateTo(time / 2, -maxAngle),
    cc.rotateTo(time / 4, 0)
  )))
}

/**
 * 
 * @param {cc.Node} node 
 * @param {Number} distance 降落距离
 * @returns 
 */
function fallAnim (node, distance) {
  return new Promise((resolve, reject) => {
    const fallTime1 = 0.4; // 第一次下落的时间
    const backTime1 = 0.1; // 第一次回弹的时间
    const fallTime2 = 0.07; // 第二次下落的时间
    const backBuffer = 7; // 回弹的距离
  
    node.runAction(cc.sequence(
      cc.moveBy(fallTime1, cc.v2(0, -distance)),
      cc.moveBy(backTime1, cc.v2(0, backBuffer)),
      cc.moveBy(fallTime2, cc.v2(0, -backBuffer)),
      cc.callFunc(() => {
        resolve();
      })
    ))
  })
}

export {
  flyTo,
  scaleIn,
  scaleOut,
  shake,
  fallAnim
}