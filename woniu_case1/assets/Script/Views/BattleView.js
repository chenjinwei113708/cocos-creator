import { NEXT_FIGHTER } from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        model: cc.Node,
        bg:cc.Node
    },

    onLoad () {
        // 节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.gameView = cc.find('Canvas/center/game').getComponent('GameView');
        this.failPage = this.node.getChildByName('fail_page');
        this.avatar = this.node.getChildByName('top').getChildByName('progress01').getChildByName('tou').getComponent(cc.Sprite);

        // 背景
        this.bgYellow = this.bg.getChildByName('bg_yellow');
        this.bgBlue = this.bg.getChildByName('bg_blue');
        
        // 进度条
        this.monsterProgressView = this.node.getChildByName('top').getChildByName('progress02').getComponent('ProgressView');
        this.playerProgressView = this.node.getChildByName('top').getChildByName('progress01').getComponent('ProgressView');
        
        // 表示下一位谁播放动画
        this.nextFighter = NEXT_FIGHTER.SNAIL;
    },

    start () {
    },

    setGameView(gameView) {
        this.gameView = gameView;
    },

    /**玩家攻击 */
    snailAttack() {
        if (this.nextFighter !== NEXT_FIGHTER.SNAIL) return;
        this.nextFighter = NEXT_FIGHTER.BOSS; // 设置状态

        // 设置战斗背景
        this.bgYellow.opacity = 0;
        this.bgYellow.active = true;
        this.bgYellow.runAction(cc.fadeIn(0.3));

        const snail = this.gameView.info.currentSnail;
        console.log(snail, this.gameView.info.currentSnail.snailType)
        snail.parent = this.model;
        const oriPos = snail.position;
        
        console.log('panduan', snail.snailType)
        if (snail.snailType === 'emo') {
            // 获取动画信息
            const animation = snail.getComponent(cc.Animation);
            // console.log(animation._clips.filter(item => item._name === 'attack_emo'))
            let attackTime = animation._clips.filter(item => item._name === 'attack_emo')[0].duration; // 记录播放的次数
            
            // 开始执行动画
            animation.stop();
            animation.play('attack_emo');
            setTimeout(() => {
                animation.stop();
                animation.play('attack_emo');
                this.reduceMonsterBlood(0.4) // 扣怪物血量
                setTimeout(() => {
                    // 设置结束动画之后的事件
                    console.log(snail)
                    snail.anchorX = 0.5;
                    snail.anchorY = 0.5
                    snail.zInde = 0;
                    snail.width = -195;
                    snail.height = 165;
                    animation.play('emo_big');
    
                    this.monsterAttack();
                    this.bgYellow.runAction(cc.fadeOut(0.3));
                    setTimeout(() => {
                        this.bgYellow.active = false;
                    }, 300)
                }, attackTime * 1000)
            }, attackTime * 1000)
        } else if (snail.snailType === 'yizhong') {
            console.log('shiyizhongya1')
            snail.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    // 播放动画
                    this.bgYellow.opacity = 0;
                    this.bgYellow.active = true;
                    this.bgYellow.runAction(cc.fadeIn(0.3));
                }),
                cc.moveBy(0.3, cc.v2(-20, 0)),
                cc.moveTo(0.2, cc.v2(60, oriPos.y)),
                cc.callFunc(() => {
                    this.reduceMonsterBlood(0.4)
                }),
                cc.moveBy(0.1, cc.v2(-10, 0)),
                cc.moveTo(0.2, oriPos),
                cc.callFunc(() => {
                    snail.zInde = 0
                    console.log(snail.getComponent(cc.Animation))
                    snail.getComponent(cc.Animation).play('attack_emo');
                    this.monsterAttack();
                    this.bgYellow.runAction(cc.fadeOut(0.3));
                    setTimeout(() => {
                        this.bgYellow.active = false;
                    }, 300)
                }),
            ))
        }
    },

    /**怪物攻击 */
    monsterAttack() {
        if (this.nextFighter !== NEXT_FIGHTER.BOSS) return;
        this.nextFighter = null;
        console.log('怪物攻击');
        const boss = this.model.getChildByName('gosla');
        boss.zIndex = 1; // 让怪兽覆盖蜗牛
        const oriPos = boss.position;
        boss.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.bgBlue.opacity = 0;
                this.bgBlue.active = true;
                this.bgBlue.runAction(cc.fadeIn(0.3))
            }),
            cc.moveBy(0.3, cc.v2(20, 0)),
            cc.moveTo(0.2, cc.v2(-60, oriPos.y)),
            cc.callFunc(() => {
                this.reducePlayerBlood(0);
            }),
            cc.moveBy(0.1, cc.v2(10, 0)),
            cc.moveTo(0.2, oriPos),
            cc.callFunc(() => {
                this.bgBlue.runAction(cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(() => {
                        this.bgBlue.active = false;
                         // 获取snailView
                        const snailView = this.gameView.info.currentSnailView
                        snailView.snailDeath()
                            .then(() => { this.gameOver() });
                    })
                ))
            }))
        )
    },

    /**游戏结束的动画 */
    gameOver() {
        // 结束页相关
        const mask = this.failPage.getChildByName('mask_fail');
        const button = this.failPage.getChildByName('button');
        const lose = this.failPage.getChildByName('lose');
        const downloadHand = button.getChildByName('hand');
        mask.opacity = 0;
        mask.active = true;
        mask.runAction(cc.sequence(
            cc.fadeTo(0.3, 130),
            cc.callFunc(() => {
                button.active = true;
                lose.active = true;
                lose.runAction(cc.sequence(
                    cc.scaleTo(0.3, 0.5),
                    cc.scaleTo(0.3, 1),
                    cc.callFunc(() => {
                        this.showDownloadHand(downloadHand);
                    })
                ))
            }))
        )
    },

    /**展现最后点击时候的手 */
    showDownloadHand(hand) {
        this.gameController.guideView.myFadeIn(hand, () => {
            this.gameController.guideView.myClickHere(hand);
        });
    },

    /**减少怪物的血 */
    reduceMonsterBlood (num = 0.4) {
        this.monsterProgressView.setProgress(num);
    },
    /**减少玩家的血 */
    reducePlayerBlood(num = 0) {
        this.playerProgressView.setProgress(num);
    }


    // update (dt) {},
});
