
cc.Class({
    extends: cc.Component,

    properties: {
        snail: cc.Node,
        nextForm: {
            type: cc.Prefab,
            default: []
        }
    },

    onLoad() {
        this.info = {
            currentForm: this.node // 记录当前形态
        }
    },

    // 展示下个形态
    showNextForm() {
        this.info.currentForm.runAction(cc.sequence(
            cc.scaleTo(0.5, 0),
            cc.callFunc(() => {
                // console.log(111)
                // const form = cc.instantiate(this.nextForm.shift());
                // console.log(from, form.parent, this.node.parent)
                // form.parent = this.node.parent;
                // form.position = this.form.position;
                // this.info.currentForm = form
                // this.info.currentForm.active = true;
            })
        ))
    }

});
