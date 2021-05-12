// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT } from '../Model/ConstValue';

/**
 * 这个脚本是用来播放引导动作的
 */

cc.Class({
    extends: cc.Component,

    properties: {
        modal:cc.Node,
        // hand: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () { 
    },

    setGameController (gameController) {
        this.gameController = gameController;
    },
    // start () {},
    /**展示欢迎页面 */
    // showWelcomePage(){
    //     this.modal.active = true;
    //     this.modal.runAction(cc.sequence(
    //         cc.callFunc(() => {
    //             this.modal.getChildByName('startPage').active = true;
    //         }),
    //         cc.fadeIn(.3)
    //     ));
    // },
    /**开始游戏的画面 */
    // startGame(){
    //     this.modal.runAction(cc.sequence(
    //         cc.fadeOut(.2),
    //         cc.callFunc(() => {
    //             this.modal.active = false;
    //             this.modal.getChildByName('startPage').active = false;
    //         })
    //     ));
    // },
    /**展示结束页面，并引导下载 */
    // showEndPage(){
    //     //播放结束音乐
    //     // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
    //     this.modal.active = true;
    //     this.modal.runAction(cc.sequence(
    //         cc.delayTime(1),
    //         cc.callFunc(() => {
    //             this.modal.getChildByName('endPage').active = true;
    //         }),
    //         cc.fadeIn(.5),
    //     ));
    // },

    /**
     * （从下方）渐入
     * @param {*} node 
     */
    myFadeIn (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        node.opacity = 0;
        node.position = cc.v2(oriPos.x, oriPos.y-node.height*1.5);
        node.active = true;
        node.runAction(cc.sequence(
            cc.spawn(cc.fadeIn(0.3), cc.moveBy(0.4, 0, node.height*1.5)).easing(cc.easeIn(2)),
            cc.callFunc(() => {
                callback && callback();
            })
        ));
    },

    /**
     * 提示点击
     * @param {*} node 
     */
    myClickHere (node, callback) {
        let oriPos = cc.v2(node.position.x, node.position.y);
        let movePos = cc.v2(oriPos.x+node.width*0.6, oriPos.y-node.height*0.8);
        node.runAction(cc.repeatForever(
            cc.sequence(
                cc.spawn(cc.moveTo(0.5, movePos), cc.scaleTo(0.5, 1.2)),
                cc.spawn(cc.moveTo(0.3, oriPos), cc.scaleTo(0.3, 1))
            )
        ));
        callback && callback();
        let stopMyAnimation = (cb) => {
            node.stopAllActions();
            node.runAction(cc.sequence(
                cc.spawn(cc.scaleTo(0.1, 1), cc.moveTo(0.1, oriPos)),
                cc.callFunc(() => {
                    node.stopMyAnimation = undefined;
                    cb && cb();
                })
            ));
        }
        node.stopMyAnimation = stopMyAnimation;
        return stopMyAnimation;
    },

    /**展示结束页面，并引导下载 */
    showEndPage(){
        //播放结束音乐
        // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.congrat.x = this.congrat.x + this.congrat.width;
                this.congrat.opacity = 0;
                this.congrat.scale = 0.75;
                this.congrat.active = true;
                let opacityAction = null;
                let posConfig = this.gameController.gameModel.getPositionConfig();
                opacityAction = cc.fadeTo(0.2, posConfig.UI.children.congrat.opacity);
                this.congrat.runAction(cc.spawn(
                    opacityAction,
                    cc.moveBy(0.3, -this.congrat.width, 0),
                    cc.scaleTo(0.2, 1)
                ));
                // this.gameController.getAudioUtils().playEffect('moneyCard', 0.3);
            }),
            cc.delayTime(1.2),
            cc.spawn(
                cc.callFunc(() => {
                    this.congratBlur.active = true;
                    this.congrat.runAction(cc.sequence(
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {this.congrat.active = false;})
                    ))
                }),
                cc.callFunc(() => {
                    this.modal.opacity = 0;
                    this.modal.active = true;
                    this.modal.runAction(cc.sequence(
                        cc.fadeIn(.7),
                        cc.callFunc(() => {
                            this.modal.getChildByName('endPage').opacity = 0;
                            this.modal.getChildByName('endPage').active = true;
                            this.modal.getChildByName('endPage').runAction(cc.fadeIn(0.3));
                        })
                    ));
                    this.gameController.endGame();
                }),
            ),
        ));
    }
    
});
