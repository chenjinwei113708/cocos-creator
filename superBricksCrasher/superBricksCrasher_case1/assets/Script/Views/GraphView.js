cc.Class({
  extends: cc.Component,

  properties: {
    graphic_line: {
      default: null,
      type: cc.Graphics,
    },
    // ballPrefab: {
    //   default: null,
    //   type: cc.Prefab,
    // },
  },

  onLoad() {
    // 开启碰撞检测系统，未开启时无法检测
    cc.director.getCollisionManager().enabled = true;
    // 开启绘图
    cc.director.getPhysicsManager().enabled = true;
    // 设置瞄准线的长度
    this.maxLength = 800;

    // 记录瞄准线长度变化
    this.curLength = 0;

  },

  onTouchStart (touch) {
    this.graphic_line.clear();
  },

  onTouchMove (touch) {
    this.graphic_line.clear();
    this.curLength = 0;
    // 设定初始坐标
    const startLocation = this.node.parent.convertToWorldSpaceAR(this.node.position);
    const location = touch.getLocation();
    // 计算射线
    this.drawRayCast(
      startLocation,
      location.subSelf(startLocation).normalizeSelf()
    );
    this.graphic_line.stroke();
  },

  onTouchEnd (touch) {
    this.graphic_line.clear();
  },

  /**
   * @description 计算射线
   * @param startLocation 起始位置 世界坐标系
   * @param vector_dir 单位方向向量
   */
  drawRayCast(startLocation, vector_dir) {
    // 剩余长度
    const left_length = this.maxLength - this.curLength;
    if (left_length <= 0) return;
    // 计算线的终点位置
    const endLocation = startLocation.add(vector_dir.mul(left_length));
    // 射线测试
    // 检测给定的线段穿过哪些碰撞体，可以获取到碰撞体在线段穿过碰撞体的那个点的法线向量和其他一些有用的信息。
    const results = cc.director
      .getPhysicsManager()
      .rayCast(startLocation, endLocation, cc.RayCastType.Closest);
    if (results.length > 0) {
      const result = results[0];
      // 指定射线与穿过的碰撞体在哪一点相交。
      const point = result.point;
      // 画入射线段
      this.drawAimLine(startLocation, point);
      // 计算长度
      const line_length = point.sub(startLocation).mag();
      // 计算已画长度
      this.curLength += line_length;
      // 指定碰撞体在相交点的表面的法线单位向量。
      const vector_n = result.normal;
      // 入射单位向量
      const vector_i = vector_dir;
      // 反射单位向量
      const vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));
      // 接着计算下一段
      this.drawRayCast(point, vector_r);
    } else {
      // 画剩余线段
      this.drawAimLine(startLocation, endLocation);
    }
  },

  /**
   * @description 画瞄准线
   * @param startLocation 起始位置 世界坐标系
   * @param endLocation 结束位置 世界坐标系
   */
  drawAimLine(startLocation, endLocation) {
    // 转换坐标
    const graphic_startLocation =
      this.graphic_line.node.convertToNodeSpaceAR(startLocation);
    this.graphic_line.moveTo(graphic_startLocation.x, graphic_startLocation.y);
    // 画小圆圆
    // 间隔
    const delta = 20;
    // 方向
    const vector_dir = endLocation.sub(startLocation);
    // 数量
    const total_count = Math.round(vector_dir.mag() / delta);
    // 每次间隔向量​
    vector_dir.normalizeSelf().mulSelf(delta);
    for (let index = 0; index < total_count; index++) {
      graphic_startLocation.addSelf(vector_dir);
      this.graphic_line.circle(
        graphic_startLocation.x,
        graphic_startLocation.y,
        this.graphic_line.node._ballRadiusRatio
      );
    }
  },
});
