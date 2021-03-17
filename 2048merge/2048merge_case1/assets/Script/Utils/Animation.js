/**可用于飞向pp卡并隐藏 */
function flyTo (node1, node2) {
  const flyTime = 0.5;
  const scaleRotio = 4 / 5; // 开始缩放时飞行时间已经过了多少部分
  const endPos = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
  node1.runAction(cc.spawn(
    cc.moveTo(flyTime, endPos),
    cc.sequence(
      cc.delayTime(flyTime * scaleRotio),
      // 开始缩小并变透明
      cc.spawn(
        cc.scaleTo(flyTime * (1 - scaleRotio), 0),
        cc.fadeOut(flyTime * (1 - scaleRotio)),
        cc.sequence(
          cc.delayTime(flyTime * (1 - scaleRotio)),
          cc.callFunc(() => {
            node1.active = false;
          })
        )
      )
    )
  ))
  return flyTime; // 返回飞行总时间
}

function scaleIn (node, cb) {
  const largeTime = 0.4;
  const smallTime = 0.2;
  const maxScale = 1.2;

  node.scale = 0;
  node.active = true;
  node.runAction(cc.sequence(
    cc.scaleTo(largeTime, maxScale),
    cc.scaleTo(smallTime, 1),
    cc.callFunc(() => {
      cb && cb();
    })
  ))
}

function shake (node) {
  const time = 0.6;
  const maxAngle = 15;
  
  node.runAction(cc.repeatForever(cc.sequence(
    cc.rotateTo(time / 4, maxAngle),
    cc.rotateTo(time / 2, -maxAngle),
    cc.rotateTo(time / 4, 0)
  )))
}

export {
  flyTo,
  scaleIn,
  shake
}