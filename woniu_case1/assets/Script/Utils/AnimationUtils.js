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

function bigAndSmall(node, maxScale = 1.1, minScale = 0.9, delay = 0, ratio = 1) {
  setTimeout(() => {
    console.log(node)
    node.runAction(
      cc.repeatForever(cc.sequence(
        cc.scaleTo(0.3 * ratio, maxScale),
        cc.scaleTo(0.6 * ratio, minScale),
        cc.scaleTo(0.3 * ratio, 1)
      ))
    )
  }, delay)
}

export {
  upAndDown,
  bigAndSmall
}