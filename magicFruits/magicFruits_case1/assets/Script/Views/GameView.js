import { GAME_INFO, GAME_STATUS } from '../Model/ConstValue';
import { toggleMask, shakeOnce, shake, flyTo, foreverScale, scaleOut, scaleIn } from '../Utils/Animation';
import { getRandom, getThrottle } from '../Utils/utils';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: { type: cc.Node, default: null },
        /**
         * 0: 橙子,
         * 1: 葡萄,
         * 2: 苹果,
         */
        fruits: { type: cc.Prefab, default: [] },
        grid: { type: cc.Node, default: null },
        fresh: { type: cc.Prefab, default: null },
        clickPos: { type: cc.Node, default: [] },
        pp_bomb: { type: cc.Node, default: null },
        spinLight: { type: cc.Node, default: null },
        ppImg: { type: cc.SpriteFrame, default: null },
        pps: { type: cc.Node, default: null },
        pp: { type: cc.Prefab, default: null },
        ppIcon: { type: cc.Node, default: null }
    },  

// 生命周期回调函数------------------------------------------------------------------------
    /**onLoad会比start快 */
    onLoad () {
        this.gameViewInit();
    },

    start () {
        this.cashView.setIcon('', 'head');
        // this.showHandDrag();
        // this.addEventListener();
        this.setGameStatus(GAME_STATUS.CAN_CLICK1);
        this.initFruits();
        this.showHand(this.pp_bomb, 'parent');
        foreverScale(this.pp_bomb);
    },
// 生命周期函数结束---------------------------------------------------------------------
    
// 工具函数----------------------------------------------------------------------------
    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    getGameStatus () {
        return this.gameInfo.status;
    },

    /**初始化游戏参数 */
    gameViewInit() {
        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.DISABLED, // 初始设置为不可点击状态
            totalWidth: 6,
            totalHeight: 6,
            firstClickPos: { x: 3, y: 3 },
            ppNum: 10,
        }

        this.fruitsPos = [
            ['orange', 'apple', 'orange', 'grape', 'apple', 'apple'],
            ['orange', 'grape', 'grape', 'grape', 'orange', 'grape'],
            ['grape', 'orange', 'grape', 'orange', 'orange', 'orange'],
            ['grape', 'apple', 'orange', 'grape', 'orange', 'orange'],
            ['grape', 'orange', 'apple', 'apple', 'apple', 'apple'],
            ['grape', 'apple', 'orange', 'grape', 'apple', 'apple']
        ]

        // 存放水果的数组
        this.fruitsArr = [];

        // type对应水果
        this.typeInfo = {
            'orange': this.fruits[0],
            'grape': this.fruits[1],
            'apple': this.fruits[2]
        }

        // 获得脚本
        this.gameController.setScript(this, 
            'audioUtils',
            'guideView',
            'awardView',
            'progressView',
            'cashView'
        )

        
        this.playFreshMusicByThrottle = this.getFreshMusicThrottle();
        this.playCombineMusicByThrottle = this.getCombineMusicThrottle();
        this.playMoneyMusicByThrottle = this.getMoneyMusicThrottle();
    },

    getMoneyMusicThrottle () {
        return getThrottle(() => {
            this.audioUtils.playEffect('money');
        }, 50)
    },

    getFreshMusicThrottle () {
        return getThrottle(() => {
            this.audioUtils.playEffect('fresh', 0.2)
        }, 100)
    },

    getCombineMusicThrottle () {
        return getThrottle(() => {
            this.audioUtils.playEffect('combine', 0.3)
        }, 100)
    },

    /**渲染水果 */
    initFruits () {
        this.fruitsPos.forEach((arr, index1) => {
            const floorArr = [];
            arr.forEach((type, index2) => {
                if (index1 === this.gameInfo.totalHeight - (this.gameInfo.firstClickPos.y ) && index2 === this.gameInfo.firstClickPos.x - 1) {
                    floorArr.push(undefined)
                } else {
                    const fruit = cc.instantiate(this.typeInfo[type]); // 创建出水果
                    floorArr.push(fruit);
                    fruit.parent = this.grid.children[index1];
                    // 根据下标赋予位置
                    switch (index2) {
                        case 0:
                            fruit.position = cc.v2(-175, 0);
                            break;
                        case 1:
                            fruit.position = cc.v2(-105, 0);
                            break;
                        case 2:
                            fruit.position = cc.v2(-35, 0);
                            break;
                        case 3:
                            fruit.position = cc.v2(35, 0);
                            break;
                        case 4:
                            fruit.position = cc.v2(105, 0);
                            break;
                        case 5:
                            fruit.position = cc.v2(175, 0);
                            break;
                    }
                }
                // switch
            })
            this.fruitsArr.push(floorArr);
        })
        // console.log(this.fruitsArr)
        this.fruitsArr.reverse();
    },

    /**切换mask的显示状态 
     * @param type 如果为 in 则表示显示 如果为out 则表示隐藏
    */
     toggleGameMask (type) {
        return toggleMask(this.mask, type)
    },
// 工具函数结束---------------------------------------------------------------------------

// 点击事件相关-------------------------------------------------------------------------
    /**增加点击事件 */
    addEventListener () {
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    /**点击事件start */
    onTouchStart (e) {
        // this.gameController.getAudioUtils().playEffect('bgClick', 0.8);
    },

    /**点击事件移动 */
    onTouchMove (e) {

    },

    /**点击事件结束 */
    onTouchEnd (e) {

    },

    handleClick1 () {
        this.audioUtils.playEffect('bgClick');
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK1) return;
        this.setGameStatus(GAME_STATUS.DISABLED);
        this.stopHand();

        let isCallback1 = false;
        let isCallback2 = false;

        // 动画:
        this.fruitsArr.forEach((fruits, index1) => {
            fruits.forEach((fruit, index2) => {
                // 排除点击正确的
                if (!(index1 === (this.gameInfo.firstClickPos.y - 1) && index2 === (this.gameInfo.firstClickPos.x - 1))) {
                    // 闪电效果
                    if (!isCallback1) {
                        isCallback1 = true;
                        this.pp_bomb.stopAllActions();
                        this.pp_bomb.runAction(cc.sequence(
                            cc.scaleTo(0.2, 0),
                            cc.callFunc(() => {
                                this.showSpinLightToPPBomb();
                            })
                        ))
                    }
                    this.showFreshToNode(fruit).then(() => {
                        // 飞向中间
                        return flyTo(fruit, this.clickPos[0]);
                    }).then(() => {
                        this.playCombineMusicByThrottle(); // 飞到过去并且播放声音
                        if (isCallback2) return new Promise(() => {});
                        isCallback2 = true;
                        setTimeout(() => {
                            // 设置延迟
                            return this.showPps()
                        }, 500)
                    }).then(() => {
                        // 增加金币, 设置进度条
                        return Promise.all([
                            this.progressView.setProgress(0.33, 0.33).then(() => {
                                console.log(0.33)
                                return this.progressView.setProgress(0.66, 0.33);
                            }).then(() => {
                                return this.progressView.setProgress(1, 0.33);
                                console.log(0.66)
                            }),
                            this.cashView.addCash(100, 1)
                        ])
                    }).then(() => {
                        // 停止动画
                        this.spinLight.getComponent(cc.Animation).pause();
                        return scaleOut(this.spinLight);
                        // return this.awardView()
                    }).then(() => {
                        console.log('游戏结束');
                        // 设置延迟
                        setTimeout(() => {
                            this.audioUtils.playEffect('cheer');
                            return this.awardView.showAwardPage().then(() => this.gameController.endGame())
                        }, 1000)
                    })
                    
                }
            })
        })
    },

    showPps () {
        return new Promise((resolve, reject) => {
            let isPlayMusic = false;

            for (let i = 0; i < this.gameInfo.ppNum; i++) {
                // if (!isPlayMusic) {
                //     isPlayMusic = true;
                //     this.audioUtils.playEffect('money');
                // }
                const pp = cc.instantiate(this.pp);
                pp.active = false;
                pp.scale = 0;
                pp.parent = this.pps;
                pp.position = cc.v2(0, 0);
                scaleIn(pp).then(() => {
                    setTimeout(() => {
                        flyTo(pp, this.ppIcon).then(() => {
                            this.playMoneyMusicByThrottle();
                            resolve()
                        })
                    }, 100 * i)
                })
            }
        })
    },

    // 电击周围的水果并且让其变成pp
    showFreshToNode (node) {
        return new Promise((resolve, reject) => {
            // 不同时间电击并回到中心  时间 0~200ms
            const randomTime = getRandom(0, 1000);
            setTimeout(() => {
                const fresh = cc.instantiate(this.fresh);
                fresh.active = false;
                fresh.parent = node;
                fresh.position = cc.v2(0, 0);
                fresh.active = true;
                // 播放闪电声音
                this.playFreshMusicByThrottle();
                // 检测播放动画时间
                scaleOut(node).then(() => {
                    console.log(node.getComponent(cc.Sprite).spriteFrame)
                    node.getComponent(cc.Sprite).spriteFrame = this.ppImg;
                    return scaleIn(node);
                }).then(() => {
                    return shakeOnce(node);
                }).then(() => {
                    resolve();
                })
                const duration = fresh.getComponent(cc.Animation).defaultClip.duration;
                setTimeout(() => {
                    this.fresh.active = false;
                    // resolve()
                }, duration * 1000)
            }, randomTime)
        })
    },

    showSpinLightToPPBomb () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 延迟
                const scaleTime = 0.5;
    
                this.spinLight.active = true;
                this.spinLight.scale = 0;
                this.spinLight.parent = this.clickPos[0];
                this.spinLight.position = cc.v2(0, 0);
                // 播放声音
                this.audioUtils.playEffect('light', 1);
                // 播放动画
                this.spinLight.runAction(cc.sequence(
                    cc.scaleTo(scaleTime, 1),
                    cc.callFunc(() => {
                        const anim = this.spinLight.getComponent(cc.Animation);
                        anim.play(anim.defaultClip.name)
                        // console.log(this.spinLight.getComponent(cc.Animation));
                        resolve();
                    })
                ))
            }, 400)
        })
    },

    /**
     * 判断点击是否在node里面
     * @param {*} e 点击事件
     * @param {cc.Node} node 判断点击事件是否在里面的节点
     * @returns {Boolean}
     */
    checkPosByNode (e, node) {
        const touchPos = e.touch._point;
        const pos = node.parent.convertToWorldSpaceAR(node.position);
        const offsetX = node.width / 2;
        const offsetY = node.height / 2;

        if (touchPos.x <= pos.x + offsetX && touchPos.x >= pos.x - offsetX && touchPos.y <= pos.y + offsetY && touchPos.y >= pos.y - offsetY) {
            // console.log('在里面')
            return true;
        } else {
            // console.log('不在里面');
            return false;
        }
    },
// 点击事件相关结束---------------------------------------------------------------------

// guide相关----------------------------------------------------------------------------
    /**显示手 */
    showHand (node, type) {
      this.guideView.showHand(node, type)
    },

    /**显示拖拽手 */
    showHandDrag (nodeArr, type) {
        this.guideView.showHandDrag(nodeArr, type);
    },

    stopHand () {
        this.guideView.stopHandActions();
    },

// guide相关结束---------------------------------------------------------------------------
    
// award相关--------------------------------------------------------------------------------
    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        this.awardView.showAwardPage()
    },
// award相关结束-----------------------------------------------------------------------------

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },

    getPosByNode (node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    }
});
