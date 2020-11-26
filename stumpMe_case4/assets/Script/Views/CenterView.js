import {
    BORKEN_NAME,
    BORKE_NAME
} from '../Model/ConstValue';

cc.Class({
    extends: cc.Component,

    properties: {
        gameController: null
    },

    onLoad() {
        this.shouldUpdateView = true;
    },

    initWithModel(gameModel) {
        // 根据model渲染各个元素状态 大小 位置等
        this.gameModel = gameModel;

        // 初次加载不传值
        this.orientCb(false);
    },

    //设置游戏控制器
    setGameController(gameController) {
        this.gameController = gameController;
    },

    //重绘视图
    orientCb(isLoad) {
        this.gameModel.isLandscape = this.getLandscape(isLoad);
        if (this.gameModel.isLandscape) {
            cc.view.setDesignResolutionSize(960, 540, cc.ResolutionPolicy.SHOW_ALL);
        } else {
            cc.view.setDesignResolutionSize(540, 960, cc.ResolutionPolicy.SHOW_ALL);
        }
        //横竖屏对应的控件位置
        let posObj;
        if (this.gameModel.isLandscape) {
            posObj = this.gameModel.HorizontalConfig;
        } else {
            posObj = this.gameModel.VerticalConfig;
        }
        // 根据横竖屏绘制元素
        this.drawElements(posObj);
    },

    /**
     * @param {Boolean} isLoad 是否非第一次加载
     * @returns {Boolean} 是否横屏
     */
    getLandscape(isLoad) {
        var _isLandscape = false;

        let w = document.body.clientWidth;
        let h = document.body.clientHeight;
        if (typeof dapi !== 'undefined') {
            let size = dapi.getScreenSize();
            // if (!isLoad) {
                // iS平台接口的数据延后； 除第一次都反过来；
                w = size.width;
                h = size.height;
            // } else {
            //     h = size.width;
            //     w = size.height;
            // }
        }
        if (w <= h) {
            _isLandscape = false
        } else {
            _isLandscape = true
        }
        return _isLandscape
    },
    /**
     * 遍历渲染对象内元素的位置
     * @param {Object} elemConf 元素的属性对象
     */
    drawElements(posObj) {
        Object.keys(posObj).forEach((item) => {
            let path = 'Canvas/center/' + item
            this.drawElem(posObj[item], path)
        })
    },

    // 递归方法
    drawElem(elemConf, path) {
        Object.keys(elemConf).forEach((key) => {
            switch (key) {
                case 'children':
                    Object.keys(elemConf.children).forEach((item) => {
                        let nextPath = path + '/' + item;
                        this.drawElem(elemConf.children[item], nextPath)
                    })
                    break;
                case 'scale':
                    // console.log(path, elemConf[key])
                    cc.find(path).setScale(elemConf[key]);
                    break;
                // case 'progressBarDirection':
                //     cc.find(path).getComponent('cc.ProgressBar').reverse = elemConf[key];
                default:
                    cc.find(path)[key] = elemConf[key];
                    break;
            }
        });
    },

    dragNode (pos) {
        const dragNode = this.gameModel.curDraggingNode;
        dragNode.position = pos;
        // 拿起的是石头
        if (dragNode.name === BORKE_NAME) {
            // 判断是否击中储钱罐
            let borkenModel = null;
            this.gameModel.items.some(model => {
                if (model.node.name === BORKEN_NAME) {
                    borkenModel = model;
                    return true;
                }
            });
            if (borkenModel.getPosition().sub(pos).mag() < 80) {
                // 两个模块接近
                if (!borkenModel.isBorken) {
                    borkenModel.isBorken = true;
                    borkenModel.node.getComponent('cc.Animation').play();
                }
            }
        }
    },

    dropNode (pos) {
        console.log('error')
        if (!this.gameModel.startDrag) {
            this.errorTime = this.errorTime ? this.errorTime + 1 : 1;
            this.gameModel.playingAnim = true;
            let errorNode = cc.find('Canvas/center/error');
            errorNode.position = this.gameModel.startPos;
            // errorNode.setScale(this.gameModel.curDraggingModel.node.scale);
            errorNode.active = true;
            this.gameController.getAudioUtils().playEffect('errorMusic', 1);
            errorNode.runAction(cc.sequence(
                cc.blink(.6, 2),
                cc.callFunc(()=>{
                    this.tipHighLight();
                    errorNode.active = false;
                    this.gameModel.playingAnim = false;
                })
            ));
        }
        this.gameModel.releaseDragItem();
        // }
    },
    tipHighLight () {
        // if ( [2, 5].includes(this.errorTime) || (this.errorTime > 4 && this.errorTime % 4 === 0)) {
        //     // 方法1 摇晃提示
        //     cc.find('Canvas/center/tip').runAction(
        //         cc.spawn(
        //             cc.repeat(
        //                 cc.sequence(
        //                     cc.scaleTo(.3, 1),
        //                     cc.scaleTo(.3, .6)
        //                 ),
        //                 2
        //             ),
        //             cc.repeat(
        //                 cc.sequence(
        //                     cc.rotateTo(.1, -15),
        //                     cc.rotateTo(.1, 0),
        //                     cc.rotateTo(.1, 15),
        //                     cc.rotateTo(.1, 0),
        //                 ),
        //                 4
        //             )
        //         )
        //     );
        // } 
        // TODO changemodel build again
        if ( this.errorTime === 2) {
            // 方法2 直接弹窗
            this.gameController.showTip();
        }
    }
});