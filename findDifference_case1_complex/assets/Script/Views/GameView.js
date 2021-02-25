import {
    CORRECT_POS,
    GAME_MODE,
    GAME_INFO
} from '../Model/ConstValue'

cc.Class({
    extends: cc.Component,

    properties: {
        correct1: {
            type: cc.Node,
            default: []
        },
        correct2: {
            type: cc.Node,
            default: []
        },
        correct3: {
            type: cc.Node,
            default: []
        },
        correct4: {
            type: cc.Node,
            default: []
        },
        correct5: {
            type: cc.Node,
            default: []
        },
        guide: cc.Node, // 引导模块
        difference1: cc.Node,
        difference2: cc.Node,
        awardPage: cc.Node, // 游戏结束奖励页
        mask: cc.Node, // 遮罩层
        downloadMask: cc.Node, // 下载遮罩层
        audio: cc.Node // 音效
    },

    onLoad() {
        this.gameViewInit();
        this.bindChildClickEvent(); // 绑定点击事件
        this.showStartGuide(); // 展示开始的引导
    },
    // 初始化gameview
    gameViewInit() {
        // 初始化参数
        this.endProgress = 1; // 初始默认设置为1
        this.currentProgress = 0; // 初始的进度
        this.isPlay = false; // 动画是否正在播放
        this.stopStartGuide = null; // 存储停止提示的变量
        this.isEnd = false; // 表示游戏是否结束了 => 用来防止后面结束方法调用两次
        this.guideView = this.guide.getComponent('GuideView');
        this.awardView = this.awardPage.getComponent('AwardView');
        this.allAward = 0;
        this.audioView = this.audio.getComponent('AudioUtils');
        // 简单模式
        if (GAME_MODE.MODE === GAME_MODE.EASY) {
            this.endProgress = 1;
        }
        // 困难模式
        if (GAME_MODE.MODE === GAME_MODE.DIFFICULTY) {
            this.endProgress = 5;
        }
    },
    // 绑定点击事件
    bindChildClickEvent() {
        this.node.children.forEach(node => {
            node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        })
    },
    onTouchStart(e) {
        const clickPos = e.target.convertToNodeSpaceAR(e.touch._point);
        this.audioView.playEffect('bgClick');
        let name = null;
        if ((name = this.checkClick(clickPos)) && (this.currentProgress < this.endProgress) && !this.isPlay && !this.isEnd) {
            // 点击正确播放good音效
            // this.audioView.playEffect('good');

            name = name.toLowerCase(); // 获取的是CORRECT所以要变成小写，然后作为key用来给this检索

            this.isPlay = true; // 表示动画正在进行
            this.currentProgress++; // 每次点击成功就加
            this.stopStartGuide && this.stopStartGuide(); // 如果存在函数则生效

            this[name].forEach(node => { // 遍历已经存储的correct
                if (!node.isClick) {
                    node.isClick = true; // 为node设置自定义属性
                    node.scale = 0;
                    node.active = true;
                    node.runAction(cc.sequence(
                        cc.scaleTo(0.4, 1.4),
                        cc.scaleTo(0.2, 1),
                        cc.callFunc(() => {
                            // 判断游戏否是结束
                            if (this.currentProgress >= this.endProgress && !this.isEnd) {
                                this.handleEndGame();
                                this.isEnd = true;
                            } else {
                                // 游戏不结束才开放isPlay
                                this.isPlay = false; // 表示动画已经结束
                            }
                        })
                    ))
                }
            })
        }
    },
    // 游戏结束执行函数
    handleEndGame() {
        console.log('结束游戏');
        // 显示遮罩层
        this.mask.opacity = 0;
        this.mask.active = true;
        this.mask.runAction(cc.fadeTo(0.3, 130));
        // 显示奖励页
        this.awardView.showAwardPage(() => {
            this.downloadMask.active = true;
            this.showCashOutHand();
        });
    },
    showStartGuide() {
        this.guideView.startHand.position = this.node.convertToNodeSpaceAR(this.difference1.convertToWorldSpaceAR(this.correct1[0].position));
        this.stopStartGuide = this.guideView.showStartHand();
    },
    showCashOutHand() {
        this.guideView.cashOutHand.position = this.node.convertToNodeSpaceAR(this.awardPage.convertToWorldSpaceAR(this.awardView.button.position))
        this.guideView.showCashOutHand();
    },
    // 获取两点的直线距离
    getDistance(pos1, pos2) {
        // return Math.floor(Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)));
        return {
            x: Math.floor(Math.abs(pos1.x - pos2.x)),
            y: Math.floor(Math.abs(pos1.y - pos2.y))
        }
    },
    checkClick(pos) {
        let result = false;
        Object.keys(CORRECT_POS).forEach(index => {
            const distance = this.getDistance(CORRECT_POS[index], pos);
            if (GAME_INFO.CORRECT_RANGE[index].x >= distance.x && GAME_INFO.CORRECT_RANGE[index].y >= distance.y) result = index
        })
        return result
    },
    start () {

    },
});
