
cc.Class({
    extends: cc.Component,

    properties: {
        snail: cc.Node,
        avatar: cc.SpriteFrame, // 存放战斗时候的头像
        type: 'emo',
        nextForm: {
            type: cc.Prefab,
            default: []
        },
        upDistance: 10
    },

    onLoad() {
        // 获取粒子节点
        this.bgParticle = cc.find('Canvas/center/game/bg_particle')

        // 设置粒子节点总在蜗牛之上
        this.bgParticle.zIndex = 1;
        // console.log(this.type)
    },

    // 展示下个形态
    showNextForm() {
        this.snail.runAction(cc.sequence(
            cc.scaleTo(0.5, 0),
            cc.callFunc(() => {
                this.snail.active = false;
                const form = cc.instantiate(this.nextForm.shift());
                form.parent = this.snail.parent;
                form.position = cc.v2(this.snail.position.x, this.snail.position.y + this.upDistance);
                this.snail = form;
                this.snail.active = true;
                this.snail.scale = 0;
                this.snail.snailType = this.type; // 设置当前蜗牛的状态
                this.snail.runAction(cc.scaleTo(0.5, 1));
            })
        ))
    },

    /**展示粒子效果 */
    showBgParticle() {
        const speed = 0.5;
        this.bgParticle.opacity = 0;
        this.bgParticle.active = true;
        this.bgParticle.runAction(cc.fadeIn(speed));
    },

    /**隐藏粒子效果 */
    hideBgParticle() {
        const speed = 0.5;
        this.bgParticle.runAction(cc.sequence(
            cc.fadeOut(speed),
            cc.callFunc(() => {
                this.bgParticle.active = false;
            })
        ))
    },

    /**蜗牛死亡 */
    snailDeath() {
        return new Promise((resolve, reject) => {
            const animation = this.snail.getComponent(cc.Animation);
            animation.stop(animation.currentClip); // 停止当前动画
            animation.play('snail_gg'); // 播放死亡动画
            const deathTime = animation.currentClip.duration; // 记录死亡事件
            this.snail.runAction(cc.sequence(
                cc.moveBy(deathTime, cc.v2(-50, 0)),
                cc.callFunc(() => {
                    resolve(); // 执行回调
                })
            ));
        })
    }

});
