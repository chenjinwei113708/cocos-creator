
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//     },

//     onLoad () {
//         this.mainCameraViewInit();
//     },

//     mainCameraViewInit () {
//         // 获取节点 / 组件
//         this.cameraCpn = this.node.getComponent(cc.Camera);

//         // 初始化view属性
//         this.cameraInfo = {
//             targetZoomRatio: 1,
//             currentZoomRatio: 1,
//             isPlues: true,
//             duration: 1,
//             isChangeable: false,
//             eachChangeByDT: 
//         };
//     },
    
//     start () {
        
//     },

//     setChangeable (status) {
//         this.cameraInfo.isChangeable = status;
//     },

//     setZoomRatio(num, duration = 1, cb) {
//         return new Promise((resolve, reject) => {
//             const info = this.cameraInfo;
//             info.currentZoomRatio = this.cameraCpn.zoomRatio;
//             info.targetZoomRatio = num;
//             info.duration = duration;
//             this.setChangeable(true);

//             info.isPlus = info.targetZoomRatio > info.currentZoomtargetZoomRatio ? true : false;

//         })
//     },

//     update (dt) {

//     },
// });
