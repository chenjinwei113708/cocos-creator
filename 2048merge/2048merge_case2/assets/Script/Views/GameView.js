import {
    BLOCK_INFO,
    GAME_INFO,
    GAME_STATUS
} from '../Model/ConstValue'

import {
    flyTo,
    scaleIn,
    scaleOut,
    shake,
    fallAnim
} from '../Utils/Animation'

import Tools from '../Utils/utils'

cc.Class({
    extends: cc.Component,

    properties: {
        guide: cc.Node, // 引导模块
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node, // 音效
        progress: cc.Node,
        cash: cc.Node,

        ppBoard: cc.Node, // 记分板上icon与logo的父节点
        bomb: cc.Node,
        particles: { type: cc.Prefab, default: [] },
        /**
         * 0: 蓝
         * 1: 紫
         * 2: 红
         * 3: 黄
         * 4: 橙
         */
        // pp$200: cc.Prefab,
        ppBlockImg: cc.SpriteFrame,
        pps: cc.Node,
        downloadButton: cc.Node,
        pps: cc.Node,
        pp: cc.Prefab,
        bombEffect: cc.Prefab,
        ppLogos: cc.Node,
        grid: cc.Node,
        blocks: { type: cc.Prefab, default: [] },
        effect: { type: cc.Node, default: null }, // 存放特效的盒子
        /**
         * 0: 4
         * 1: 8
         * 2: 16
         * 3: 32
         * 4: 64
         */

        click1Nodes: { type: cc.Node, default: [] }, // 存放触发第一次点击的node,用于后面修改active
        click2Nodes: { type: cc.Node, default: [] }, // 存放触发第二次点击的node,用于后面修改active
        /**
         * 0: tip1 开始时候的引导
         * 1: tip2 点击炸弹的引导
         */
        tips: { type: cc.Node, default: [] },
        dash: { type: cc.Node, default: null }
    },  

    onLoad() {
        this.gameViewInit();
    },

    /**初始化gameView */
    gameViewInit() {
        // 获取节点
        this.ppIcon = this.ppBoard.children.filter(node => {
            return node._name.indexOf('icon') !== -1;
        })[0] // 获取将要飞去的ppicon

        // 初始化参数
        this.gameInfo = {
            status: GAME_STATUS.CAN_CLICK_32,
            totalWidth: 5,
            totalHeight: 7,
            bombInfo: {
                pos: cc.v2(1 * BLOCK_INFO.WIDTH, -2 * BLOCK_INFO.HEIGHT)
            },
            clickBlocks1Pos: [
                { x: 3, y: 2 },
                { x: 4, y: 2 },
                { x: 3, y: 3 },
                { x: 4, y: 3 },
                { x: 3, y: 4 },
                { x: 3, y: 5 },
            ],
            fallBlocksInfo1: [
                { x: 3, y: 6, fall: 4 },
                { x: 3, y: 7, fall: 4 },
                { x: 4, y: 4, fall: 1 },
                { x: 4, y: 5, fall: 1 },
                { x: 4, y: 6, fall: 1 },
                { x: 4, y: 7, fall: 1 }
            ],
            // 一开始就生成且原本需要掉落的方块 基于左下角的x, y 换句话说就是数组
            fallBlocksInfo2: [
                { x: 5, y: 4, fall: 3 },
                { x: 5, y: 5, fall: 3 },
                { x: 5, y: 6, fall: 3 },
                { x: 5, y: 7, fall: 3 },
                { x: 4, y: 5, fall: 3 },
                { x: 4, y: 6, fall: 3 },
                { x: 4, y: 7, fall: 3 },
            ],
            // 生成新的方块并掉落, 基于中间的x, y
            newBlocksInfo2: [
                { type: '16', pos: cc.v2(0, 4 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '32', pos: cc.v2(0, 5 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '4', pos: cc.v2(0, 6 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '64', pos: cc.v2(1 * BLOCK_INFO.WIDTH, 4 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '16', pos: cc.v2(1 * BLOCK_INFO.WIDTH, 5 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '16', pos: cc.v2(1 * BLOCK_INFO.WIDTH, 6 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '16', pos: cc.v2(2 * BLOCK_INFO.WIDTH, 4 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '64', pos: cc.v2(2 * BLOCK_INFO.WIDTH, 5 * BLOCK_INFO.HEIGHT), fall: 3 },
                { type: '32', pos: cc.v2(2 * BLOCK_INFO.WIDTH, 6 * BLOCK_INFO.HEIGHT), fall: 3 },
            ],
            newBlocksInfo1: [
                { type: '4', pos: cc.v2(0, 4 * BLOCK_INFO.HEIGHT), fall1: 4, fall2able: true, fall2: 3 },
                { type: '16', pos: cc.v2(0, 5 * BLOCK_INFO.HEIGHT), fall1: 4, fall2able: true, fall2: 3 },
                { type: '32', pos: cc.v2(0, 6 * BLOCK_INFO.HEIGHT), fall1: 4, fall2able: true, fall2: 3 },
                { type: '64', pos: cc.v2(0, 7 * BLOCK_INFO.HEIGHT), fall1: 4, fall2able: true, fall2: 3 },
                { type: '64', pos: cc.v2(1 * BLOCK_INFO.WIDTH, 4 * BLOCK_INFO.HEIGHT), fall1: 1, fall2able: true, fall2: 3 },
            ],
            bombBlocksPos: [
                { x: 3, y: 1 },
                { x: 4, y: 1 },
                { x: 5, y: 1 },
                { x: 5, y: 2 },
                { x: 3, y: 6 },
                { x: 3, y: 7 },
                { x: 4, y: 4 },
                { x: 5, y: 3 },
            ]
        }

        // 获取目标脚本
        this.gameController = cc.find('Canvas').getComponent('GameController');
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.progressView = this.progress.getComponent('ProgressView');
        this.cashView = this.cash.getComponent('CashView');
        this.audioUtils = this.gameController.getAudioUtils();

        this.blockTypes = [
            ['4', '64', '64', '64', '64'],
            ['16', '16', '64', '64', '64'],
            ['32', '32', '4', '64', '4'],
            ['16', '64', '4', '32', '64'],
            ['4', '32', '4', '4', '32'],
            ['16', '8', '4', '4', '64'],
            ['16', '64', '16', '64', '4']
        ]

        this.clickBlocks1 = [];

        this.blocksArr = [];

        /**
         * 0: 4
         * 1: 8
         * 2: 16
         * 3: 32
         * 4: 64
         */
        this.typeInfo = {
            '4': this.blocks[0],
            '8': this.blocks[1],
            '16': this.blocks[2],
            '32': this.blocks[3],
            '64': this.blocks[4],
        }

        this.particleInfo = {
            '4': this.particles[0],
            '8': this.particles[1],
            '16': this.particles[2],
            '32': this.particles[3],
            '64': this.particles[4]
        }

        this.bombBlocks = [
            this.bomb
        ]

        this.fallBlocks2 = [];

        // 节流声音函数
        this.playMoneyMusicByThrottle = this.getMoneyMusicThrottle();
    },

    start () {
        this.initBlocks();
        this.cashView.setIcon({
            head: '',
            end: ''
        });
        this.setGameStatus(GAME_STATUS.CAN_CLICK1);
        this.showHand(this.tips[0]);
        // this.addEventListener();
    },

    getMoneyMusicThrottle () {
        return Tools.getThrottle(() => {
            this.audioUtils.playEffect('money', 0.4);
        }, 100)
    },

    /**初始化方块 */
    initBlocks () {
        this.blockTypes.forEach((arr, index1) => {
            const blockArr = [];
            arr.forEach((type, index2) => {

                const block = cc.instantiate(this.typeInfo[type]); // 创建出方块
                block._type = type;
                blockArr.push(block);
                block.parent = this.grid.children[index1];
                // 根据下标赋予位置 与 预制特效信息
                switch (index2) {
                    case 0:
                        block.position = cc.v2(-146, 0);
                        break;
                    case 1:
                        block.position = cc.v2(-73, 0);
                        break;
                    case 2:
                        block.position = cc.v2(0, 0);
                        break;
                    case 3:
                        block.position = cc.v2(73, 0);
                        break;
                    case 4:
                        block.position = cc.v2(146, 0);
                        break;
                }
                // switch
            })
            this.blocksArr.push(blockArr);
        })
        // console.log(this.fruitsArr)
        this.blocksArr = this.blocksArr.reverse();
        // 将特殊的block放入制定的数组
        this.gameInfo.clickBlocks1Pos.forEach((pos) => {
            this.clickBlocks1.push(this.blocksArr[pos.y - 1][pos.x - 1]);
        })
        // console.log(this.clickBlocks1)
    },

    /**设置游戏状态 */
    setGameStatus (status) {
        this.gameInfo.status = status;
    },

    /**获取游戏状态 */
    getGameStatus () {
        return this.gameInfo.status;
    },

    // 节流函数
    getThrottle (fn, delay = 100) {
        let timer = null;
        return function (...args) {
            const _this = this; // 执行这个函数所在的this
            if (timer) return false;
            timer = setTimeout(() => {
                fn.apply(_this, args);
                clearTimeout(timer);
                timer = null;
            }, delay)
        }
    },

    handleClick1 () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK1 ) {
            this.audioUtils.playEffect('bgClick');
            return false;
        }

        // 点击对之后的一些处理(关闭一些动画)
        this.stopHand();
        this.dash.getComponent(cc.Animation).pause();
        this.dash.runAction(cc.fadeOut(0.1));
        this.audioUtils.playEffect('clear');
        this.click1Nodes.forEach(node => {
            node.active = false;
        })
        this.setGameStatus(GAME_STATUS.DISABLED); // 禁止点击

        // 方块4消失动画
        this.clickBlocks1.forEach(block => {
            block.active = false; // 隐藏
            // 粒子特效
            const particle = cc.instantiate(this.particleInfo[block._type]);
            particle.active = true;
            particle.parent = this.effect;
            particle.position = this.getPosByNode(particle, block);
            // 回收
            setTimeout(() => {
                particle.active = false;
            }, GAME_INFO.PARTICLE_DURATION * 2000)
        })
        // 方块4顶部方块与新生成的方块掉落动画
        
        // 创建炸弹
        scaleIn(this.bomb).then(() => {
            this.bomb.runAction(cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.8, 1.2),
                    cc.scaleTo(0.8, 0.9)
                )
            ))
        });

        // 原有方块掉落
        this.gameInfo.fallBlocksInfo1.forEach(item => {
            fallAnim(this.blocksArr[item.y - 1][item.x - 1], item.fall * BLOCK_INFO.HEIGHT);
        })
        // 新方块掉落
        ;(function () {
            return new Promise((resolve, reject) => {
                this.gameInfo.newBlocksInfo1.forEach(newBlockInfo => {
                    const newBlock = cc.instantiate(this.typeInfo[newBlockInfo.type]);
                    newBlock.active = false;
                    newBlock.parent = this.grid;
                    newBlock.position = newBlockInfo.pos;
                    newBlock.active = true;
                    // 存入下次还需要掉落的方块数组
                    if (newBlockInfo.fall2able) {
                        newBlock._fall2 = newBlockInfo.fall2 // 设置下落距离
                        this.fallBlocks2.push(newBlock);
                    }
                    // 下落动画
                    fallAnim(newBlock, newBlockInfo.fall1 * BLOCK_INFO.HEIGHT).then(() => {
                        // this.setGameStatus(GAME_STATUS.CAN_CLICK2);
                        resolve();
                    })
                })
            })
        }).call(this).then(() => {
            this.showPPFly();
            // 增加金钱 展示pp卡
            return Promise.all([
                this.progressView.setProgress(0.25, 0.5).then(() => {
                    this.shakePPLogo();
                    return this.progressView.setProgress(0.5, 0.5).then(() => {
                        this.shakePPLogo();
                        return Promise.resolve();
                    })
                }),
                this.cashView.addCash(75.64, 1),
                this.showPPFly()
            ])
        }).then(() => {
            this.setGameStatus(GAME_STATUS.CAN_CLICK2);
            this.showHand(this.tips[1]);
            // resolve();
        })
    },

    // 爆炸动画
    handleClick2 () {
        if (this.getGameStatus() !== GAME_STATUS.CAN_CLICK2 ) {
            this.audioUtils.playEffect('bgClick');
            return false;
        }
        this.stopHand();
        this.audioUtils.playEffect('bomb', 0.4);
        this.click2Nodes.forEach(node => {
            node.active = false;
        })
        this.setGameStatus(GAME_STATUS.DISABLED);

        // 周围方块爆炸 并且产生粒子效果 变成pp卡片,飞向pp board
        // 8个原有方块
        const bombableBlocks = [this.bomb, ...this.gameInfo.bombBlocksPos.map(pos => this.blocksArr[pos.y - 1][pos.x - 1])];
        ;(function () {
            return new Promise((resolve, reject) => {
                bombableBlocks.forEach(block => {
                    let done1 = false;
                    let done2 = false;
                    // 消失原来的方块
                    scaleOut(block).then(() => {
                        const oriWorldPos = block.parent.convertToWorldSpaceAR(block);
                        block.parent = cc.find('Canvas/center/UI');
                        block.position = block.parent.convertToNodeSpaceAR(oriWorldPos);
                        block.stopAllActions();
                        block.scale = 0;
                        block.wdith = BLOCK_INFO.WIDTH;
                        block.height = BLOCK_INFO.HEIGHT;
                        block.getComponent(cc.Sprite).spriteFrame = this.ppBlockImg;
                        return scaleIn(block);
                    }).then(() => {
                        return new Promise((resolve_flyPP, reject) => {
                            // 飞向pp
                            setTimeout(() => {
                                flyTo(block, this.ppIcon).then(() => {
                                    this.playMoneyMusicByThrottle();
                                    resolve_flyPP()
                                })
                            }, Tools.getRandom(0, 600))
                        })
                    }).then(() => {
                        done1 = true;
                        if (done1 && done2) resolve();
                    })
                    
                    // 粒子效果
                    const defaultType = '4';
                    const particle = cc.instantiate(this.particleInfo[block._type ? block._type : defaultType]);
                    particle.active = true;
                    particle.parent = this.effect;
                    particle.position = this.getPosByNode(particle, block);

                    // 爆炸效果
                    const bombEffect = cc.instantiate(this.bombEffect);
                    bombEffect.parent = this.effect;
                    bombEffect.position = this.getPosByNode(bombEffect, block);

                    // 回收粒子效果
                    setTimeout(() => {
                        particle.active = false;
                    }, GAME_INFO.PARTICLE_DURATION * 2000)

                    // 回收爆炸效果
                    const effectDuration = bombEffect.getComponent(cc.Animation).defaultClip.duration;
                    setTimeout(() => {
                        bombEffect.active = false;
                        done2 = true;
                        if (done1 && done2) resolve();
                    }, effectDuration * 1000)
                });
            })
            // 掉落效果
        }).call(this).then(() => {
            // 旧原有方块掉落
            this.gameInfo.fallBlocksInfo2.forEach(item => {
                fallAnim(this.blocksArr[item.y - 1][item.x - 1], item.fall * BLOCK_INFO.HEIGHT);
            });
    
            // 之前生成的方块掉落
            this.fallBlocks2.forEach(block => {
                fallAnim(block, block._fall2 * BLOCK_INFO.HEIGHT);
            });
    
            // 生成新的方块并掉落
            this.gameInfo.newBlocksInfo2.forEach(newBlockInfo => {
                const newBlock = cc.instantiate(this.typeInfo[newBlockInfo.type]);
                newBlock.active = false;
                newBlock.parent = this.grid;
                newBlock.position = newBlockInfo.pos;
                newBlock.active = true;
                // 下落动画
                return fallAnim(newBlock, newBlockInfo.fall * BLOCK_INFO.HEIGHT)
            });
        }).then(() => {
            // 进度条效果 金钱
            return Promise.all([
                this.progressView.setProgress(0.75, 0.5).then(() => {
                    this.shakePPLogo();
                    return this.progressView.setProgress(1, 0.5).then(() => this.shakePPLogo())
                }),
                this.cashView.addCashTo(299, 1),
                // this.showPPFly()
            ])
        }).then(() => {
            // 展示奖励页面
            this.audioUtils.playEffect('cheer');
            return this.showAwardPage();
        }).then(() => {
            this.showHand(this.downloadButton);
            this.gameController.endGame();
        })

    },

    /**展现开始的手 */
    showHand (node, type) {
        this.guideView.showHand(node, type)
    },

    /**暂停现有的手 */
    stopHand () {
        this.guideView.stopHand();
    },

    /**展示奖励页 */
    showAwardPage () {
        // console.log('展示奖励页~')
        return this.awardView.showAwardPage()
    },

    /**展示pp飞向icon */
    showPPFly (cb) {
        return new Promise((resolve, reject) => {
            // 初始化参数与会带哦函数
            const ppNum = 8; // 要生成的pp数量
            const delay = 100; // 每个pp延迟100ms
            const flyTime = (ppNum - 1) * delay;
    
            // 循环开始
            for (let i = 0; i < ppNum; i++) {
                const pp = cc.instantiate(this.pp);
                pp.parent = this.pps;
                pp.active = true;
                setTimeout(() => {
                    flyTo(pp, this.ppIcon)
                    setTimeout(() => {
                        this.playMoneyMusicByThrottle()
                        // this.gameController.getAudioUtils().playEffect('money', 0.3);
                    }, 100)
                }, i * delay)
            }
    
            // 回调
            setTimeout(() => {
                resolve();
            }, flyTime)
        })
    },

    // /**展示图标与logo */
    // showPPIconLogo () {
    //     this.ppBoard.children.forEach(node => {
    //         scaleIn(node)
    //     })
    // },

    shakePPLogo () {
        if (!this.ppLogos._shakeIndex) {
            this.ppLogos._shakeIndex = 1;
        } else {
            this.ppLogos._shakeIndex++;
        }
        this.ppLogos.children.forEach((node, index) => {
            if (index <= this.ppLogos._shakeIndex - 1) {
                node.stopAllActions();
                node.runAction(cc.sequence(
                    cc.rotateTo(0.01, 0),
                    cc.callFunc(() => {
                        node.getChildByName('red_point').active = true;
                        shake(node);
                    })
                ))
            }
        })
        
    },

    /**获取两点的直线距离 */
    getDistance (pos1, pos2) {
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },

    /**
     * 获取node在相对于node1中的坐标
     * @param {cc.Node} node1 
     * @param {cc.Node} node2 
     * @returns 
     */
    getPosByNode (node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2));
    }
});
