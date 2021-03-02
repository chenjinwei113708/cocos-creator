
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.monsterProgressView = this.node.getChildByName('top').getChildByName('progress02').getComponent('ProgressView');
        this.playerProgressView = this.node.getChildByName('top').getChildByName('progress01').getComponent('ProgressView');
        this.gameView = cc.find('Canvas/center/game').getComponent('GameView');    
    },

    start () {
    },

    setGameView(gameView) {
        this.gameView = gameView;
    },

    /**玩家攻击 */
    snailAttack() {
        const snail = this.gameView.info.currentSnail;
        const oriPos = snail.position;
        snail.runAction(cc.sequence(
            cc.moveBy(0.6, cc.v2(-20, 0)),
            cc.moveTo(0.5, cc.v2(60, oriPos.y)),
            cc.moveBy(0.1, cc.v2(-10, 0)),
            cc.moveTo(0.2, oriPos),
            cc.callFunc(() => {
                this.monsterAttack()
                console.log(snail.position)
            })
        ))
    },

    /**怪物攻击 */
    monsterAttack() {
        console.log('怪物攻击')
    },

    /**减少怪物的血 */
    reduceMonsterBlood (num = 0.4) {
        this.monsterProgressView.setProgress(num);
    },
    /**减少玩家的血 */
    reducePlayerBlood(num = 0) {
        this.monsterProgressView.setProgress(num);
    }


    // update (dt) {},
});
