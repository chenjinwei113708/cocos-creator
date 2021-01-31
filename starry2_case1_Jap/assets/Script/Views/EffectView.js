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
        flyGrade: cc.Prefab
    },


    onLoad() {
        // this.selectBox = this.node.getChildByName('selectBox');
        this.controller = cc.find('Canvas').getComponent('GameController');
        this.audioUtils = this.controller.getAudioUtils();
        this.gridView = this.controller.getGridViewScript();
        this.hand = this.node.getChildByName('hand');
        // 爆炸特效数组
        this.bombEffects = {
            [CELL_TYPE.BLUE]: this.bombBlue,
            [CELL_TYPE.GREEN]: this.bombGreen,
            [CELL_TYPE.PURPLE]: this.bombPurple,
            [CELL_TYPE.RED]: this.bombRed,
            [CELL_TYPE.YELLOW]: this.bombYellow
        }
    },

    start() {

    },

    showClickHand () {
        this.hand.opacity = 0;
        this.hand.active = true;
        this.hand.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 0.7)),
            cc.callFunc(() => {
                this.hand.getComponent(cc.Animation).play();
            })
        ));
    },

    hideClickHand () {
        this.hand.active = false;
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
    playBombEffect (cells, callback) {
        const delayTime = ANITIME.FADEOUT*1000;
        cells.forEach((cell, index) => {
            setTimeout(() => {
                let gridView = cc.find('Canvas').getComponent('GameController').getGridViewScript();
                gridView.deleteCell(cell);
                if (cells.length>4) {
                    if (index % 3 === 0) {
                        let bombInstance = cc.instantiate(this.bombEffects[cell.type]);
                        bombInstance.x = (cell.x-0.5) * CELL_WIDTH;
                        bombInstance.y = (cell.y-0.5) * CELL_HEIGHT;
                        bombInstance.parent = this.node;
                    }
                    if ((index+1) % 3 === 0) {
                        let flyGrade = cc.instantiate(this.flyGrade);
                        flyGrade.active = true;
                        flyGrade.getComponent('FlyGradeView').init(cc.v2((cell.y-0.5) * CELL_HEIGHT, (cell.y-0.5) * CELL_HEIGHT), TYPE2COLOR[cell.type], 10*(index+1)-5);
                        flyGrade.parent = this.node;
                        flyGrade.getComponent('FlyGradeView').fly();
                    }
                    if (index % 2  === 0) {
                        this.audioUtils.playBomb(index, 0.8);
                    }
                } else {
                    if (index % 2 === 0) {
                        let bombInstance = cc.instantiate(this.bombEffects[cell.type]);
                        bombInstance.x = (cell.x-0.5) * CELL_WIDTH;
                        bombInstance.y = (cell.y-0.5) * CELL_HEIGHT;
                        bombInstance.parent = this.node;

                        let flyGrade = cc.instantiate(this.flyGrade);
                        flyGrade.active = true;
                        flyGrade.getComponent('FlyGradeView').init(cc.v2(bombInstance.x, bombInstance.y), TYPE2COLOR[cell.type], 10*(index+1)-5);
                        flyGrade.parent = this.node;
                        flyGrade.getComponent('FlyGradeView').fly();
                    }
                    this.audioUtils.playBomb(index, 0.8);
                }
                
                if(index === cells.length-1){
                    callback && callback();
                }
            }, index*delayTime);
        })
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