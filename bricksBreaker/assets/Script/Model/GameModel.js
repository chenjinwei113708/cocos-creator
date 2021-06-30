import {} from "./ConstValue";

// import SandModel from "./SandModel";

export default class GameModel {
  // state
  constructor() {
    // 初始化state
    // 横竖屏参数
    this.isLandscape = false;
    this.isMintegral = true; // 检测是不是isMintegral平台
    this.isApplovin = false; // 是不是applovin平台
    this.HorizontalConfig = {
      background: {
        scale: 0.75,
        position: cc.v2(240, 0),
      },
      graphics: {
        scale: 1,
        _ballRadiusRatio: 0.75,
      },
      game: {
        scale: 0.75,
        position: cc.v2(240, 0),
        children: {
          grid: {
            children: {
              // wall: { physicsBoxColliderScale: 0.75 },
              // underwall: { physicsBoxColliderScale: 0.75 },
              // brick5: { physicsBoxColliderScale: 0.75 },
              // brick4: { physicsBoxColliderScale: 0.75 },
              // brick3: { physicsBoxColliderScale: 0.75 },
              // brick2: { physicsBoxColliderScale: 0.75 },
              // brick1: { physicsBoxColliderScale: 0.75 }
              wall: { hasPhysicsBoxCollider: true },
              underwall: { hasPhysicsBoxCollider: true },
              brick5: { hasPhysicsBoxCollider: true },
              brick4: { hasPhysicsBoxCollider: true },
              brick3: { hasPhysicsBoxCollider: true },
              brick2: { hasPhysicsBoxCollider: true },
              brick1: { hasPhysicsBoxCollider: true },
            },
          },
        },
      },
      UI: {
        children: {
          paypal: {
            scale: 0.89,
            position: cc.v2(-220, 210),
          },
          banner: {
            scale: 0.89,
            position: cc.v2(-220, -210),
          },
          awardPage_box: {
            scale: 0.75,
          },

          pps: {
            scale: 0.75,
            position: cc.v2(240, 0),
          },
        },
      },
    };
    this.VerticalConfig = {
      background: {
        scale: 1,
        position: cc.v2(0, 0),
      },
      graphics: {
        scale: 1,
        _ballRadiusRatio: 0.75,
      },
      game: {
        scale: 1,
        position: cc.v2(0, 0),
        children: {
          grid: {
            children: {
              // graphics: {
              //     scale: 1,
              //     _ballRadiusRatio: 1
              // },
              wall: { hasPhysicsBoxCollider: true },
              underwall: { hasPhysicsBoxCollider: true },
              brick5: { hasPhysicsBoxCollider: true },
              brick4: { hasPhysicsBoxCollider: true },
              brick3: { hasPhysicsBoxCollider: true },
              brick2: { hasPhysicsBoxCollider: true },
              brick1: { hasPhysicsBoxCollider: true },
            },
          },
        },
      },
      UI: {
        children: {
          paypal: {
            scale: 1,
            position: cc.v2(0, 405),
          },
          banner: {
            scale: 1,
            position: cc.v2(0, -410),
          },
          awardPage_box: {
            scale: 1,
          },
          pps: {
            scale: 1,
            position: cc.v2(0, 0),
          },
        },
      },
    };

    //guiding用来记录是否还需要继续进行拖动手势引导

    this.guideScript = null;
  }

  //设置引导脚本
  setGuideView(guideScript) {
    this.guideScript = guideScript;
  }

  //初始化游戏模型
  gameInit() {}
}
