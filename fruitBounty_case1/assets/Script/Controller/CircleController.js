// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 每秒旋转多少度 (只需要调整这个参数就可以改变旋转速度)
        speed: {
            type: cc.Integer,
            default: 60
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.config = {
            currentDeg: 0, // 当前角度
        };
        // 不在圆心的水果
        this.apples = this.node.children.filter(child => {
            return (child.position.x !==0 || child.position.y !==0);
        });
        // 每个苹果到圆心的距离(半径)
        this.radius = this.apples.map(each => {
            return Math.sqrt(Math.pow(each.position.x, 2) + Math.pow(each.position.y, 2));
        });
        // 每个苹果的角度
        this.degs = this.apples.map(each => {
            let origin = Math.atan(each.position.y/each.position.x)/Math.PI*180;
            if (each.position.x < 0) { // 二三象限
                origin = 180+origin;
            } else if (each.position.x >= 0 && each.position.y < 0) { // y负半轴 和 第四象限
                origin = 360+origin
            }
            return origin;
        });
        // console.log(this.degs);
    },

    start () {

    },

    // dt单位秒
    update (dt) {
        let newDeg = this.config.currentDeg + dt * this.speed;
        newDeg = newDeg % 360; // 角度限制现在360里
        for (var i=0; i<this.degs.length; i++) {
            let appDeg = (this.degs[i] + newDeg) % 360;
            let newX = this.radius[i]*Math.cos(appDeg/180*Math.PI);
            let newY = this.radius[i]*Math.sin(appDeg/180*Math.PI);
            this.apples[i].position = cc.v2(newX, newY);
        }
        this.config.currentDeg = newDeg;
    },
});
