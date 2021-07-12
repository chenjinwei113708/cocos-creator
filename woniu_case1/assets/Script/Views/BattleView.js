import { NEXT_FIGHTER } from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        model: cc.Node,
        bg:cc.Node,
        audio: cc.Node
    },

    onLoad () {
        // 节点
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.gameView = cc.find('Canvas/center/game').getComponent('GameView');
        this.failPage = this.node.getChildByName('fail_page');
        this.avatar = this.node.getChildByName('top').getChildByName('progress01').getChildByName('tou').getComponent(cc.Sprite);
        this.audioUtils = this.audio.getComponent('AudioUtils');

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
        const boss = this.model.getChildByName('gosla'); // 获取节点
        snail.parent = this.model;
        const oriPos = snail.position;
        
        // 播放音效
        // this.audioUtils.playEffect('snail_attack');

        // 根据蜗牛类型判断攻击动作
        if (snail.snailType === 'emo') {
            // 获取动画信息
            const animation = snail.getComponent(cc.Animation);
            // console.log(animation._clips.filter(item => item._name === 'attack_emo'))
            let attackTime = animation._clips.filter(item => item._name === 'attack_emo')[0].duration; // 记录播放的事件
            this.audioUtils.playEffect('snail_attack'); // 播放音效
            
            snail.runAction(cc.sequence(
                cc.moveTo(0.2, cc.v2(30, oriPos.y)),
                cc.callFunc(() => {
                    animation.stop();
                    animation.play('attack_emo'); // 第一次攻击
                    setTimeout(() => {
                        animation.stop();
                        animation.play('attack_emo'); // 第二次攻击
                        // boss.getComponent(cc.Animation).play('boss_shake');
                        this.getHurt(boss, false);
                        this.reduceMonsterBlood(0.4) // 扣怪物血量
                        setTimeout(() => { // 设置结束动画之后的事件
                            // 设置好相关属性
                            snail.anchorX = 0.5;
                            snail.anchorY = 0.5
                            snail.zInde = 0;
                            snail.width = -195;
                            snail.height = 165;
                            animation.play('emo_big'); // 播放待机动画
                            // 返回原始位置
                            snail.runAction(cc.moveTo(0.2, oriPos)); // 0.2 跟怪物事件重叠
                            // 怪物攻击
                            this.monsterAttack();
                            this.bgYellow.runAction(cc.fadeOut(0.3));
                            setTimeout(() => {
                                this.bgYellow.active = false;
                            }, 300)
                        }, attackTime * 1000)
                    }, attackTime * 1000)
                })
            ))
            // setTimeout(() => {
            //     // 开始执行动画
            //     animation.stop();
            //     animation.play('attack_emo');
            //     setTimeout(() => {
            //         animation.stop();
            //         animation.play('attack_emo');
            //         this.reduceMonsterBlood(0.4) // 扣怪物血量
            //         setTimeout(() => {
            //             // 设置结束动画之后的事件
            //             console.log(snail)
            //             snail.anchorX = 0.5;
            //             snail.anchorY = 0.5
            //             snail.zInde = 0;
            //             snail.width = -195;
            //             snail.height = 165;
            //             animation.play('emo_big');
        
            //             this.monsterAttack();
            //             this.bgYellow.runAction(cc.fadeOut(0.3));
            //             setTimeout(() => {
            //                 this.bgYellow.active = false;
            //             }, 300)
            //         }, attackTime * 1000)
            //     }, attackTime * 1000)
            // }, 500)
        } else if (snail.snailType === 'yizhong') {
            snail.runAction(cc.sequence(
                cc.delayTime(0.7),
                cc.callFunc(() => {
                    this.audioUtils.playEffect('snail_attack'); // 播放音效
                }),
                cc.moveBy(0.3, cc.v2(-20, 0)),
                cc.moveTo(0.2, cc.v2(60, oriPos.y)),
                cc.callFunc(() => {
                    this.getHurt(boss, false);
                    this.reduceMonsterBlood(0.4);
                }),
                cc.moveBy(0.2, cc.v2(-10, 0)),
                cc.moveTo(0.2, oriPos),
                cc.delayTime(0.3), // 卡怪物张嘴时间
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
        this.nextFighter = null; // 将攻击者指向null

        const boss = this.model.getChildByName('gosla'); // 获取节点
        boss.zIndex = 1; // 让怪兽覆盖蜗牛
        const snail = this.gameView.info.currentSnail; // 获取蜗牛
        const oriPos = boss.position;

        // 播放音效
        // console.log(this.audio)
        // console.log(this.audioUtils)
        // this.audio.pause() // 停止之前的声音
        
        cc.audioEngine.pause(); // 停止之前的音效
        // this.audioUtils.playEffect('boss_attack');

        // 执行动作
        boss.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.audioUtils.playEffect('boss_attack');
            }),
            // cc.delayTime(0.2),
            cc.callFunc(() => {
                this.bgBlue.opacity = 0;
                this.bgBlue.active = true;
                this.bgBlue.runAction(cc.fadeIn(0.3))
            }),
            cc.moveBy(0.3, cc.v2(20, 0)),
            cc.moveTo(0.2, cc.v2(-60, oriPos.y)),
            cc.callFunc(() => {
                this.reducePlayerBlood(0);
                // snail.getComponent(cc.Animation).play('snail_shake');
                this.getHurt(snail, true)
            }),
            cc.moveBy(0.2, cc.v2(10, 0)),
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
        // 播放失败的声音
        this.audioUtils.playEffect('gameOver');

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
    },

    getHurt(node, isReverse) {
        node.runAction(cc.sequence(
            cc.rotateTo(0.2, (isReverse ? -1 : 1) * 20),
            cc.rotateTo(0.2, (isReverse ? -1 : 1) * -5),
            cc.rotateTo(0.2, 0),
        ))
    }
    // update (dt) {},
});