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

        let screen = this.getScreenPixel(isLoad); // 适配不同屏幕所需参数
        let _canvas = cc.find('Canvas');
        // cocos 2.1 的bug，需要手动设置size和position。只靠setDesignResolutionSize方法设置的话，size和position是错误的值
        // 适配了iphoneX等长屏手机 和 ipad等大屏设备
        _canvas.width = screen.canvasWidth;
        _canvas.height = screen.canvasHeight;
        _canvas.x = screen.canvasWidth/2;
        _canvas.y = screen.canvasHeight/2;

        if (this.gameModel.isLandscape) {
            cc.view.setDesignResolutionSize(960, 540, cc.ResolutionPolicy.SHOW_ALL);
        } else {
            cc.view.setDesignResolutionSize(540, 960, cc.ResolutionPolicy.SHOW_ALL);
        }
        //横竖屏对应的控件位置
        let posObj = this.gameModel.isLandscape ? this.gameModel.HorizontalConfig : this.gameModel.VerticalConfig;
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
            if (!isLoad) {
                // iS平台接口的数据延后； 除第一次都反过来；
                w = size.width;
                h = size.height;
            } else {
                h = size.width;
                w = size.height;
            }
        }
        if (w <= h) {
            _isLandscape = false
        } else {
            _isLandscape = true
        }
        return _isLandscape
    },

    /**
     * 得到屏幕尺寸以及长宽比,并且计算合适的屏幕分辨率策略
     * return： {width,height,ratio} (ratio=较长的边/较短的边)
     */
    getScreenPixel (isLoad) {
        const stdRatio = 1.77; // 960/540
        let _s = {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            ratio: document.body.clientHeight > document.body.clientWidth ? 
                document.body.clientHeight/document.body.clientWidth : document.body.clientWidth/document.body.clientHeight
        };
        if (typeof dapi !== 'undefined') {
            let size = dapi.getScreenSize();
            let w;
            let h;
            if (!isLoad) {
                // iS平台接口的数据延后； 除第一次都反过来；
                w = size.width;
                h = size.height;
            } else {
                h = size.width;
                w = size.height;
            }
            _s = {
                width: w,
                height: h,
                ratio: h > w ? 
                    h/w : w/h
            };
        }
        let _land = this.getLandscape();
        let _policy = null;
        if (_land) {
            if (_s.ratio>=stdRatio) _policy = cc.ResolutionPolicy.FIXED_HEIGHT;
            else _policy = cc.ResolutionPolicy.FIXED_WIDTH;
        } else {
            if (_s.ratio>=stdRatio) _policy = cc.ResolutionPolicy.FIXED_WIDTH;
            else _policy = cc.ResolutionPolicy.FIXED_HEIGHT;
        }
        if (_policy === cc.ResolutionPolicy.FIXED_HEIGHT) {
            _s.canvasWidth = _land ? 540/_s.height*_s.width : 960/_s.height*_s.width;
            _s.canvasHeight = _land ? 540 : 960;
        } else if (_policy === cc.ResolutionPolicy.FIXED_WIDTH) {
            _s.canvasWidth = _land ? 960 : 540;
            _s.canvasHeight = _land ? 960/_s.width*_s.height : 540/_s.width*_s.height;
        }
        _s['resolutionPolicy'] = _policy;
        return _s;
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
            let dragNode = this.gameModel.curDraggingNode;
            this.gameModel.putInErrorArr(dragNode.name);
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
        // if ( this.errorTime === 2) {
        //     // 方法2 直接弹窗
        //     this.gameController.showTip();
        // }
        if ( !this.gameModel.isTipShowed && this.gameModel.errorArr.length >= 5) {
            // 方法2 直接弹窗
            this.gameController.enableTip();
            this.gameController.showTip();
            this.gameModel.isTipShowed = true;
        }
    }
});