
cc.Class({
    extends: cc.Component,

    properties: {
        snail: cc.Node,
        nextForm: {
            type: cc.Prefab,
            default: []
        },
        upDistance: 10
    },

    onLoad() {
        // 获取粒子节点
        this.bgParticle = cc.find('Canvas/center/game/bg_particle')
        this.info = {
            currentForm: this.snail // 记录当前形态
        }

        // 设置粒子节点总在蜗牛之上
        this.bgParticle.zIndex = 1;
    },

    // 展示下个形态
    showNextForm() {
        console.log(this.info.currentForm)
        this.info.currentForm.runAction(cc.sequence(
            cc.scaleTo(0.5, 0),
            cc.callFunc(() => {
                const form = cc.instantiate(this.nextForm.shift());
                // console.log(from, form.parent, this.node.parent)
                form.parent = this.info.currentForm.parent;
                form.position = cc.v2(this.info.currentForm.position.x, this.info.currentForm.position.y + this.upDistance);
                this.info.currentForm = form
                this.info.currentForm.active = true;
                this.info.currentForm.scale = 0
                this.info.currentForm.runAction(cc.scaleTo(0.5, 1))
            })
        ))
    },

    /**展示粒子效果 */
    showBgParticle() {
        const speed = 0.5
        this.bgParticle.opacity = 0;
        this.bgParticle.active = true
        this.bgParticle.runAction(cc.fadeIn(0.5));
    }

});
