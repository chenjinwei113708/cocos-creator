function upAndDown(node, distance = 10, delay = 0, ratio = 1) {
  const oriPos = node.position;
  setTimeout(() => {
    node.runAction(
      cc.repeatForever(cc.sequence(
        cc.moveTo(0.3 * ratio, cc.v2(oriPos.x, oriPos.y + distance)),
        cc.moveTo(0.6 * ratio, cc.v2(oriPos.x, oriPos.y - distance)),
        cc.moveTo(0.3 * ratio, oriPos)
      )))
  }, delay)
}

export {
  upAndDown
}