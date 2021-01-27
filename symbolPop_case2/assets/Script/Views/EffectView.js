import {
    CELL_WIDTH,
    CELL_HEIGHT,
    ANITIME,
    CELL_TYPE,
    TYPE2COLOR
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        bombBlue: cc.Prefab,
        bombGreen: cc.Prefab,
        bombPurple: cc.Prefab,
        bombRed: cc.Prefab,
        bombYellow: cc.Prefab,
        flyGrade: cc.Prefab,
        wavePref: cc.Prefab,
        flyCards: cc.Node,
        paypal: cc.Node,
        ppcard: cc.Node,
        mask: cc.Node,
    },


    onLoad() {
        // this.selectBox = this.node.getChildByName('selectBox');
        this.controller = cc.find('Canvas').getComponent('GameController');
        this.audioUtils = this.controller.getAudioUtils();
        this.gridView = this.controller.getGridViewScript();
        // 爆炸特效数组
        this.bombEffects = {
            [CELL_TYPE.BLUE]: this.bombBlue,
            [CELL_TYPE.GREEN]: this.bombGreen,
            [CELL_TYPE.PURPLE]: this.bombPurple,
            [CELL_TYPE.RED]: this.bombRed,
            [CELL_TYPE.YELLOW]: this.bombYellow,
            [CELL_TYPE.PP]: this.bombBlue
        }
    },

    start() {

    },

    /**
     * 设置选中框出现
     * @param {*} vec 这个位置参数并不是坐标，而是行列参数
     */
    setSelectBoxVisible(vec) {
        this.selectBox.getComponent(cc.Animation).play('selectBox');
        this.selectBox.x = (vec.x - 1) * CELL_WIDTH + CELL_WIDTH * 0.5;
        this.selectBox.y = (vec.y - 1) * CELL_HEIGHT + CELL_HEIGHT * 0.5;
        this.selectBox.active = true;
    },
    //设置选中框消失
    setSelectBoxInvisible() {
        this.selectBox.getComponent(cc.Animation).stop('selectBox');
        this.selectBox.active = false;
    },
    /**
     * 播放爆炸特效
     * @param {*} cells 准备爆照的cellModel
     */
    playBombEffect (cells, waitTime = 550, callback) {
        const delayTime = ANITIME.FADEOUT*cells.length/4.5*waitTime;
        let count = 0;
        setTimeout(() => {
            this.showFlyCards(10, ()=>{
                this.gridView.isInPlayAni = false; // 动画播放完成，允许用户点击
                if (!this.gridView.isCanMove) {
                    this.gridView.isCanMove = true;
                    this.gridView.setListener();
                }
            });
        }, delayTime/3);
        cells.forEach((cell, index) => {
            let t = index === 0 ? 0 : Math.random()*delayTime;
            setTimeout(() => {
                // let gridView = cc.find('Canvas').getComponent('GameController').getGridViewScript();
                let gridView = this.gridView;
                gridView.deleteCell(cell);
                // let bombInstance = cc.instantiate(this.bombEffects[cell.type]);
                // bombInstance.x = (cell.x-0.5) * CELL_WIDTH;
                // bombInstance.y = (cell.y-0.5) * CELL_HEIGHT;
                // bombInstance.parent = this.node;
                if (waitTime < 300) {
                    if (index % 4 === 0) {
                        this.audioUtils.playEffect('bubble', 0.7);
                        let startpos = this.controller.guide.convertToNodeSpaceAR(
                            this.node.convertToWorldSpaceAR(
                                cc.v2((cell.x-0.5) * CELL_WIDTH, (cell.y-0.5) * CELL_HEIGHT)));
                        this.controller.guideScript.flyPPIcon(startpos);
                    }
                    if (index % 9 === 0) {
                        this.showWave(cell);
                    }
                } else {
                    if (index % 3 === 0) {
                        this.audioUtils.playEffect('bubble', 0.7);
                        this.showWave(cell);
                    }
                    
                }
                
                // let flyGrade = cc.instantiate(this.flyGrade);
                // flyGrade.active = true;
                // flyGrade.getComponent('FlyGradeView').init(cc.v2((cell.x-0.5) * CELL_WIDTH, (cell.y-0.5) * CELL_HEIGHT), TYPE2COLOR[cell.type], 10*(index+1)-5);
                // flyGrade.parent = this.node;
                // flyGrade.getComponent('FlyGradeView').fly();
                // if(index === cells.length-1){
                //     callback && callback();
                // }
                count++;
                if (count === cells.length) {
                    setTimeout(()=> {
                        callback && callback();
                    }, 400);
                }
            }, t);
        })
    },

    showWave (cell) {
        let bombInstance = cc.instantiate(this.wavePref);
        bombInstance.x = (cell.x-0.5) * CELL_WIDTH;
        bombInstance.y = (cell.y-0.5) * CELL_HEIGHT;
        bombInstance.parent = this.node;
        bombInstance.scale = 0;
        bombInstance.runAction(cc.sequence(
            cc.scaleTo(0.2, 0.7),
            cc.spawn(cc.scaleTo(0.2, 1.3), cc.fadeOut(0.2)),
            cc.removeSelf()
        ));
    },

    /**展示pp卡飞上去 */
    showFlyCards (num = 5, callback) {
        let cards = this.flyCards.children;
        let destPos = this.flyCards.convertToNodeSpaceAR(
            this.paypal.convertToWorldSpaceAR(this.paypal.getChildByName('boxpp').position));
        for (let i = 0; i < num; i++) {
            setTimeout(() => {
                let card = cards[i];
                let posy = -285+Math.random()*388;
                let posx = -194+Math.random()*388;
                let ang = -180+Math.random()*360;
                card.position = cc.v2(posx, posy);
                card.angle = ang;
                card.opacity = 0;
                card.scale = 0;
                card.active = true;
                // console.log('fly ', i, ' pos: ', card.position.x, card.position.y, ' destPos', destPos);
                let fadeIntime = 0.2*Math.random()+0.1;
                let moveTotime = 0.4*Math.random()+0.4;
                card.runAction(cc.sequence(
                    cc.spawn(cc.fadeIn(fadeIntime), cc.scaleTo(fadeIntime, 1)),
                    cc.spawn(cc.rotateTo(0.6, 0), cc.moveTo(moveTotime, destPos)),
                    cc.fadeOut(0.15),
                    cc.callFunc(() => {
                        if (i === num-1) {
                            callback&& callback();
                        }
                    })
                ));
                if (i === 5) {
                    this.controller.addCash(100);
                    this.controller.getAudioUtils().playEffect('coin', 0.4);
                    this.ppcard.scale = 0;
                    this.ppcard.opacity = 0;
                    this.ppcard.active = true;
                    this.ppcard.runAction(cc.sequence(
                        cc.spawn(cc.scaleTo(0.3, 1.05), cc.fadeTo(0.3, 230)),
                        cc.repeat(cc.sequence(cc.scaleTo(0.2, 0.95), cc.scaleTo(0.2, 1.05)), 2),
                        cc.spawn(cc.scaleTo(0.3, 0.5), cc.fadeOut(0.3, 0)),
                        cc.callFunc(() => {
                            if (this.controller.cashView.targetCash >= 300) {
                                setTimeout(() => {this.show300Card();}, 200);
                            }
                        })
                    ));
                }
            }, i*90);
        }
    },

    show300Card () {
        this.controller.getAudioUtils().playEffect('moneyCard', 0.4);
        this.ppcard.scale = 0;
        this.ppcard.opacity = 0;
        this.ppcard.active = true;
        this.ppcard.stopAllActions();
        this.ppcard.getChildByName('won100').active = false;
        this.ppcard.getChildByName('won300').active = true;
        this.ppcard.getChildByName('withdraw').active = true;
        this.ppcard.getChildByName('congrat').active = true;
        this.ppcard.getChildByName('later').active = true;
        this.ppcard.getChildByName('redeem').active = true;
        this.ppcard.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.4, 1.05), cc.fadeTo(0.3, 255)),
            cc.callFunc(() => {
                // this.ppcard.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.4, 0.98), cc.scaleTo(0.4, 1.02))));
            })
        ));
        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.5, 190));
        // this.ppcard.runAction(cc.spawn(cc.scaleTo(0.3, 1.05), cc.fadeIn(0.3)));
    },

    /**
     * 播放特效
     * @param {*} effectQueue 
     */
    playEffects: function (effectQueue) {
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }
        let isLandscape = this.controller.gameModel.isLandscape;
        // let posConf = isLandscape ? this.controller.gameModel.HorizontalConfig : this.controller.gameModel.VerticalConfig

        // 获取世界坐标
        let skillNode = cc.find('Canvas/center/progress/skillProgress');
        let worldPos = skillNode.convertToWorldSpaceAR(cc.v2(0,0));

        // 计算显示层局部坐标  add为微调到三叉戟的尖部
        let iconPos = cc.find('Canvas/center/grid').convertToNodeSpaceAR(worldPos.add(cc.v2(22,41)));
        
        let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
        effectQueue.forEach(function (cmd) {
            let delayTime = cc.delayTime(cmd.playTime);
            let callFunc = cc.callFunc(function () {
                let instantEffect = null;
                let animation = null;
                if (cmd.action == "thunder") {
                    instantEffect = cc.instantiate(this.thunder);
                    instantEffect.position = iconPos;

                    let targetPos = cc.v2(CELL_WIDTH * (cmd.pos.x - 0.5), CELL_WIDTH * (cmd.pos.y - 0.5))
                    let subVec = iconPos.sub(targetPos);
                    let distance = subVec.mag();
                    let rotation = Math.atan(subVec.y/ subVec.x) * 180 / Math.PI
                    instantEffect.rotation = isLandscape ? -rotation : rotation > 0 ? -rotation : -rotation + 180;
                    // 雷电出现特效
                    
                    !soundMap["clickSkill" + cmd.playTime] && this.audioUtils.playEffect('clickSkill', 1.5);
                    soundMap["clickSkill" + cmd.playTime] = true;

                    let action = cc.sequence(
                            cc.spawn(
                                cc.scaleTo(distance / 2000, distance, 2),
                                cc.delayTime(ANITIME.DIE_SHAKE)
                            ),
                            cc.callFunc(()=>{
                                !soundMap["normalSkill" + cmd.playTime] && this.audioUtils.playEffect('normalSkill', 2);
                                soundMap["normalSkill" + cmd.playTime] = true;
                                instantEffect.destroy();
                            })
                        )
                    instantEffect.runAction(action);

                    // instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5);
                    // instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5);
                    instantEffect.parent = this.node;
                    
                    
                } else if(cmd.action == "thunder2") {
                    // 结束雷电特效
                    !soundMap["clickSkill" + cmd.playTime] && this.audioUtils.playEffect('clickSkill', 1.5);
                    soundMap["clickSkill" + cmd.playTime] = true;
                    let thunderNode = this.node.getChildByName('thunder');
                    thunderNode.runAction(
                        cc.sequence(
                            cc.moveTo(.5, cc.v2(CELL_WIDTH * 4, CELL_HEIGHT * 4)),
                            cc.spawn(
                                cc.scaleBy(.5, 15),
                                cc.fadeOut(.5),
                                cc.callFunc(()=>{
                                    !soundMap["specialSkill" + cmd.playTime] && this.audioUtils.playEffect('specialSkill', 2);
                                    soundMap["specialSkill" + cmd.playTime] = true;
                                    cc.find('Canvas').getComponent('GameController').showEndPage()
                                })
                            )
                        )
                    )



                } else {
                    if (cmd.action == "crush") {
                        instantEffect = cc.instantiate(this.crushEffect);
                        animation = instantEffect.getComponent(cc.Animation);
                        animation.play("bubble");
                        
                        !soundMap["crush" + cmd.playTime] && this.audioUtils.playEliminate(0, 1);
                        soundMap["crush" + cmd.playTime] = true;
    
                    } else if (cmd.action == "rowBomb") {
                        instantEffect = cc.instantiate(this.horseBomb);
                        animation = instantEffect.getComponent(cc.Animation);
                        animation.play("effect_line");

                        !soundMap["crushHorse" + cmd.playTime] && this.audioUtils.playEliminate(3, 3);
                        soundMap["crushHorse" + cmd.playTime] = true;
    
                    } else if (cmd.action == "colBomb") {
                        instantEffect = cc.instantiate(this.horseBomb);
                        animation = instantEffect.getComponent(cc.Animation);
                        animation.play("effect_col");

                        !soundMap["crushHorse" + cmd.playTime] && this.audioUtils.playEliminate(3, 3);
                        soundMap["crushHorse" + cmd.playTime] = true;
                    } else if (cmd.action == "crabBomb") {
                        instantEffect = cc.instantiate(this.crabBomb);
                        animation = instantEffect.getComponent(cc.Animation);
                        animation.play("effect_crab");

                        !soundMap["crushCrab" + cmd.playTime] && this.audioUtils.playEliminate(2, 3);
                        soundMap["crushCrab" + cmd.playTime] = true;

                    } else if (cmd.action == "warpBomb") {
                        instantEffect = cc.instantiate(this.warpBomb);
                        animation = instantEffect.getComponent(cc.Animation);
                        animation.play("effect_warp");

                        !soundMap["crushPuffer" + cmd.playTime] && this.audioUtils.playEliminate(4, 2);
                        soundMap["crushPuffer" + cmd.playTime] = true;
                    }
                    instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5);
                    instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5);
                    instantEffect.parent = this.node;

                    animation.on("finished", function () {
                        if(cmd.step && cmd.step > 3) {
                            !soundMap["niceEffect"] && this.audioUtils.playEffect('niceEffect', 2);
                            soundMap["niceEffect"] = true;
                        }
                        instantEffect.destroy();
                    }, this);
                }
                
                

            }, this);
            this.node.runAction(cc.sequence(delayTime, callFunc));
        }, this);
    },
    showThunder() {
        this.node.getChildByName('thunder').active = true;
    }



    // update (dt) {},
});