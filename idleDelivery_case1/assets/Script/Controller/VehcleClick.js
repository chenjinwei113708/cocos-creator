// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button,
        hand: cc.Node,
        riderDown5: cc.Node,
        riderDown6: cc.Node,
        riderDown: cc.Node,

        riderDown5_2: cc.SpriteFrame,
        riderDown5_repeat: cc.SpriteFrame,

        riderDown6_2: cc.SpriteFrame,
        riderDown6_repeat: cc.SpriteFrame,

        riderDown_2: cc.SpriteFrame,
        riderDown_repeat: cc.SpriteFrame,

        goldPrefab: cc.Prefab
    },


    onLoad () {
        
        
        
        this.gameControl = cc.find("Canvas").getComponent('GameController');
        let clickFlag = true;
        
        this.button.node.on('click', button => {
            if(clickFlag){
                //初始化金币
                

                this.gameControl.gameModel.handShow = false;
                let handAction = cc.sequence(cc.fadeOut(1), cc.moveTo(1, 31.686, -297.811));
                this.hand.runAction(handAction);


                //新增人物
                let action = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(4, -57.087, -197.061), 
                        // cc.moveTo(2, -18.553, 40.379),
                        cc.callFunc(() => {
                            this.riderDown.getComponent(cc.Sprite).spriteFrame = this.riderDown_repeat;
                        }),
                        cc.moveTo(2, 47.96, -321.561),
                        cc.callFunc(() => {
                            this.riderDown.getComponent(cc.Sprite).spriteFrame = this.riderDown_2;
                        }),
                        cc.moveTo(0, 343.647, -43.382),
                ));

                let action1 = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(3.5, -18.553, 40.379), 
                        cc.moveTo(2, -18.553, 40.379),
                        cc.callFunc(() => {
                            this.riderDown5.getComponent(cc.Sprite).spriteFrame = this.riderDown5_repeat;
                        }),
                        cc.moveTo(3.5, 329.087, 177.201),
                        cc.callFunc(() => {
                            this.riderDown5.getComponent(cc.Sprite).spriteFrame = this.riderDown5_2;
                        })
                ));

                let action2 = cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(2.5, 164.064, 22.889), 
                        cc.moveTo(2, 164.064, 22.889),
                        cc.callFunc(() => {
                            this.riderDown6.getComponent(cc.Sprite).spriteFrame = this.riderDown6_repeat;
                        }),
                        cc.moveTo(2.5, 296.478, 77.412),
                        cc.callFunc(() => {
                            this.riderDown6.getComponent(cc.Sprite).spriteFrame = this.riderDown6_2;
                        }),
                        cc.moveTo(0, 343.212, -117.314)
                ));
                // this.riderDown.runAction(action);
                this.riderDown.runAction(action);
                this.riderDown5.runAction(action1);
                this.riderDown6.runAction(action2);
                

                
                clickFlag = false;

                setTimeout(()=>{
                    cc.find('Canvas/center/game/coins').getComponent('Coins').goldCoinInit();
                }, 2000)
                
            }  
        }, this);
        
        
    },

    start () {

    },

    // update (dt) {},
});
