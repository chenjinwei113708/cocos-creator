import { GAME_INFO, GAME_STATUS } from "../Model/ConstValue";
cc.Class({
  extends: cc.Component,

  properties: {
    graphic_line: {
      default: null,
      type: cc.Graphics,
    },
    ballPrefab: {
      default: null,
      type: cc.Prefab,
    },
  },

  onLoad() {
    // 开启碰撞检测系统，未开启时无法检测
    cc.director.getCollisionManager().enabled = true;
    // cc.director.getCollisionManager().enabledDebugDraw = true;
    // 开启绘图
    cc.director.getPhysicsManager().enabled = true;
    // cc.director.getPhysicsManager().debugDrawFlags = 1;

    // 设置瞄准线的长度
    this.AIM_LINE_MAX_LENGTH = 800;

    // 记录瞄准线长度变化
    this.curLength = 0;

    // 标记界面是否暂停   0:stop;   1:play;   2:向下运行
    this.gameType = 0;

    // 创建小球的对象池
    this.ballPool = new cc.NodePool();
    // 控制小球创建的时间间隔 变量
    this.ballTime = 0;
    // 设置全局
    window.GraphView = this;
    // this.message = cc.v2(0, 0);
    this.graphic_line.node.on(
      cc.Node.EventType.TOUCH_START,
      function (touch) {
        this.graphic_line.clear();
        this.gameType = 0;
        this.removeAllBall();
      },
      this
    );
    this.graphic_line.node.on(
      cc.Node.EventType.TOUCH_MOVE,
      function (touch) {
        this.graphic_line.clear();
        this.curLength = 0;
        // const startLocation = touch.getStartLocation();
        // 设定虚线初始坐标
        const startLocation = cc.v2(270, 220);
        const location = touch.getLocation();
        this.message = location;
        // 计算射线
        this.drawRayCast(
          startLocation,
          location.subSelf(startLocation).normalizeSelf()
        );
        this.graphic_line.stroke();
        this.gameType = 0;
      },
      this
    );
    this.graphic_line.node.on(
      cc.Node.EventType.TOUCH_END,
      function (touch) {
        this.graphic_line.clear();
        if (this.gameType == 0) {
          this.gameType = 1;
        }
      },
      this
    );
    this.graphic_line.node.on(
      cc.Node.EventType.TOUCH_CANCEL,
      function (touch) {
        this.graphic_line.clear();
        this.gameType = 1;
      },
      this
    );
  },

  /**
   * @description 计算射线
   * @param startLocation 起始位置 世界坐标系
   * @param vector_dir 单位方向向量
   */
  drawRayCast(startLocation, vector_dir) {
    // 剩余长度
    const left_length = this.AIM_LINE_MAX_LENGTH - this.curLength;
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
        2
      );
    }
  },

  /**
   *  使用小球预制件
   */
  // 创建小球 对象池 方法
  creatBall: function () {
    let ball = null;
    if (this.ballPool.size() > 0) {
      // 通过 size 接口判断对象池中是否有空闲的对象
      ball = this.ballPool.get();
    } else {
      // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
      ball = cc.instantiate(this.ballPrefab);
    }

    // 设置父节点
    ball.parent = this.node;
    var pos = this.node.getPosition();
    ball.setPosition(cc.v2(0, 0));
  },

  /**
   * 移除小球
   */
  removeAllBall: function () {
    // 获取子节点
    var children = this.node.children;
    for (let i = children.length - 1; i >= 0; i--) {
      // 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
      // 传入参数也可以是脚本的名称。
      var js = children[i].getComponent("BallView");
      if (js) {
        this.onBallKilled(children[i]);
      }
    }
  },
  /**
   * 移除小球，有动画效果
   */
  removeBallScale: function () {
    // 获取子节点
    var children = this.node.children;
    for (let i = children.length - 1; i >= 0; i--) {
      // 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
      // 传入参数也可以是脚本的名称。
      var js = children[i].getComponent("BallView");
      if (js) {
        this.onBallKilled(children[i]);
      }
    }
  },
  // 将对象返回对象池 方法
  onBallKilled: function (ball) {
    // bullet 应该是一个 cc.Node
    this.ballPool.put(ball); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
  },
  update() {
    // 控制子弹创建的时间间隔
    this.ballTime++;
    if (this.ballTime == 5) {
      // bulletTime重置为0
      this.ballTime = 0;
      if (this.gameType == 1) {
        this.creatBall();
      }
    }
    // console.log(this.node.children.length);
  },
});
