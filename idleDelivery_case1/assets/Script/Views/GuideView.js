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
        hand: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () { 

    },
    // start () {},
    /**展示欢迎页面 */
    showWelcomePage(){
        this.modal.active = true;
        this.modal.runAction(cc.sequence(
            cc.callFunc(() => {
                this.modal.getChildByName('startPage').active = true;
            }),
            cc.fadeIn(.3)
        ));
    },
    /**开始游戏的画面 */
    startGame(){
        this.modal.runAction(cc.sequence(
            cc.fadeOut(.2),
            cc.callFunc(() => {
                this.modal.active = false;
                this.modal.getChildByName('startPage').active = false;
            })
        ));
    },
    /**展示结束页面，并引导下载 */
    showEndPage(){
        //播放结束音乐
        // if (isAudioEnabled) cc.audioEngine.playEffect(this.endingMusic, false, 2);
        this.modal.active = true;
        this.modal.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => {
                this.modal.getChildByName('endPage').active = true;
            }),
            cc.fadeIn(.5),
        ));
    },

    /**
     * 初始化引导节点
     * @param {Number} step 步数 1 / 2
     */
    setGuideMaskPos(step) {
        if (step != 1 && step != 2) {
            return false;
        }
        let target = step == 1 ? cc.v2(2,7) : cc.v2(3,3);
        let handTarget = step == 1 ? cc.v2(3,7) : cc.v2(5,3);

        let targetPos = this.translatePosition(target, false);
        let handTargetPos = this.translatePosition(handTarget, true);

        let targetNode = this.node.getChildByName(`guideMask${step}`);
        // targetNode.active = false;

        // 绑定拖拽事件
        this.registerTouchEvent(targetNode, step);
        
        this.showTip('tipStart');

        this.hand.stopAllActions();
        this.hand.position = handTargetPos;

        targetNode.active = false;
        targetNode.position = targetPos;
        
        this.showGuideNode(targetNode);
    },

    

    /**显示引导节点 */
    showGuideNode(targetNode) {
        this.node.opacity = 0;
        this.node.active = true;
        this.hand.active = true;
        let handAction = cc.repeatForever(
            cc.sequence(
                cc.moveBy(.5, 0, CELL_HEIGHT),
                cc.delayTime(.2),
                cc.moveBy(.3, 0, -CELL_HEIGHT),
                cc.delayTime(.2),
            )
        )
        this.hand.runAction(handAction);
        // 遮罩重新出现（mask有bug 直接调透明度会失去遮罩，写一个延时
        this.node.runAction(
            cc.spawn(
                cc.fadeIn(.5),
                cc.sequence(
                    cc.delayTime(.2),
                    cc.callFunc(()=>{
                        targetNode.getChildByName('bg').opacity = 0;
                        targetNode.active = true;
                        targetNode.getChildByName('bg').runAction(cc.fadeTo(.3, 150))
                    })
                )
            )
        );
        
    },
    showTip(tipName) {
        let _node = null;
        this.node.getChildByName('tip').children.forEach((node)=>{
            if(node.name == tipName) {
                _node = node;
                node.active = true;
            } else {
                node.active = false;
            }
        })
        return _node
    },

    registerTouchEvent(targetNode, step) {
        let firstPos, secondPos;
        if (step == 1) {
            firstPos = cc.v2(3,7);
            secondPos = cc.v2(3,8);
        } else if ( step == 2 ) {
            firstPos = cc.v2(5,4);
            secondPos = cc.v2(5,3);
        } else {
            return false;
        }
        
        targetNode.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
            
            
        }, this);
        
    },

    isSamePos(pos1, pos2) {
        return pos1.x == pos2.x && pos1.y == pos2.y
    },
    
    /**结束引导 */
    endGuide() {
        let tipEnd = cc.find('Canvas/center/tipEnd');
        tipEnd.active=true;
        // console.log('endGuide',tipEnd.active);
        // this.showTip('tipEnd');
    },

    
});
