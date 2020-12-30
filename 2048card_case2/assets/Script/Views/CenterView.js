
cc.Class({
    extends: cc.Component,

    properties: {
        gameController: null,
        cashout_id: cc.SpriteFrame,
        cashout_ms: cc.SpriteFrame,
        cashout_th: cc.SpriteFrame,
        win_id_ms: cc.SpriteFrame,
        win_th: cc.SpriteFrame,
    },


    onLoad () {
       
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
        if( this.gameModel.isLandscape ) {
            cc.view.setDesignResolutionSize(960, 540, screen.resolutionPolicy || cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            cc.view.setDesignResolutionSize(540, 960, screen.resolutionPolicy || cc.ResolutionPolicy.FIXED_WIDTH);
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
        let isLandscape = false;

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
            isLandscape = false
        } else {
            isLandscape = true
        }
        return isLandscape
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
    drawElem (elemConf, path) {
        Object.keys(elemConf).forEach((key) => {
            switch (key) {
                case 'children':
                    Object.keys(elemConf.children).forEach((item)=>{
                        let nextPath = path + '/' + item;
                        this.drawElem(elemConf.children[item], nextPath)
                    })
                    break;
                case 'scale':
                    // console.log(path, elemConf[key])
                    cc.find(path).setScale(elemConf[key]);
                    break;
                case 'spriteFrame':
                    // console.log(key, path, elemConf[key]);
                    cc.find(path).getComponent(cc.Sprite).spriteFrame = this[elemConf[key]];
                    break;
                // case 'progressBarDirection':
                //     cc.find(path).getComponent('cc.ProgressBar').reverse = elemConf[key];
                default: 
                    // console.log(key, path, elemConf[key]);
                    cc.find(path)[key] = elemConf[key];
                    break
            }
        })
    },

    
    // drawDraggingNode(node, pos) {
    //     let SFNode = node.getChildByName('tool');
    //     let dragNode = cc.find('Canvas/center/dragNode');
    //     dragNode.position = pos;
    //     dragNode.getComponent('cc.Sprite').spriteFrame = SFNode.getComponent('cc.Sprite').spriteFrame;
    //     dragNode.width = SFNode.width;
    //     dragNode.height = SFNode.height;
    //     SFNode.active = false;
    //     dragNode.active = true;
    // },

    // resetDragTool(isSuccess) {
    //     if( this.gameModel.curDraggingNode) {
    //         this.gameModel.curDraggingNode.getChildByName('tool').active = !isSuccess;
    //         cc.find('Canvas/center/dragNode').active = false;
    //         this.gameModel.curDraggingNode = null;
    //     }
    // },

    // moveDragNode(pos) {
    //     this.node.getChildByName('dragNode').position = pos;
    // }
    // start () {},

    // update (dt) {},
});
