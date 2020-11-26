
cc.Class({
    extends: cc.Component,

    properties: {
        gameController: null,
        ppTopV: cc.SpriteFrame,
        ppTopH: cc.SpriteFrame,
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
        let screen = this.getScreenPixel(); // 适配不同屏幕所需参数
        let _canvas = cc.find('Canvas');
        if( this.gameModel.isLandscape ) {
            cc.view.setDesignResolutionSize(960, 540, screen.resolutionPolicy || cc.ResolutionPolicy.FIXED_HEIGHT);
            // cocos 2.1 的bug，需要手动设置size和position。只靠setDesignResolutionSize方法设置的话，size和position是错误的值
            _canvas.width = screen.width*(540/screen.height); // 适配iphoneX等长屏手机
            // _canvas.width = 960;
            _canvas.height = 540;
            _canvas.x = screen.width*(540/screen.height)/2; // 适配iphoneX等长屏手机
            // _canvas.x = 960/2;
            _canvas.y = 540/2;
            // 适配ipad等大屏设备
            if (screen.resolutionPolicy === cc.ResolutionPolicy.FIXED_WIDTH) {
                _canvas.width = 960; 
                _canvas.height = screen.height*(960/screen.width);
                _canvas.x = 960/2;
                _canvas.y = screen.height*(960/screen.width)/2;
            }
        } else {
            cc.view.setDesignResolutionSize(540, 960, screen.resolutionPolicy || cc.ResolutionPolicy.FIXED_WIDTH);
            // cocos 2.1 的bug，需要手动设置size和position。只靠setDesignResolutionSize方法设置的话，size和position是错误的值
            _canvas.width = 540;
            // _canvas.height = 960;
            _canvas.height = screen.height*(540/screen.width);
            _canvas.x = 540/2;
            // _canvas.y = 960/2;
            _canvas.y = screen.height*(540/screen.width)/2;
            // 适配ipad等大屏设备
            if (screen.resolutionPolicy === cc.ResolutionPolicy.FIXED_HEIGHT) {
                _canvas.width = screen.width*(960/screen.height); 
                _canvas.height = 960;
                _canvas.x = screen.width*(960/screen.height)/2;
                _canvas.y = 960/2;
            }
        }
        //横竖屏对应的控件位置
        let posObj = this.gameModel.isLandscape ? this.gameModel.HorizontalConfig : this.gameModel.VerticalConfig;

        // 根据横竖屏绘制元素
        this.drawElements(posObj);
        // // 引导的大小
        // if( this.gameModel.isLandscape ) {
        //     cc.find('Canvas/modal/startPage').setScale(1.9);
        //     cc.find('Canvas/modal/endPage').setScale(1.9);
        // } else {
        //     cc.find('Canvas/modal/startPage').setScale(1);
        //     cc.find('Canvas/modal/endPage').setScale(1);
        // }

        // // 修改引导
        // //重置屏幕之后，要刷新引导动作，否则引导动作的位置会保持原来的位置
        // if (this.gameModel.skillGuiding) {
        //     this.gameModel.guideScript.skillGuide(true)
        // }
        // if (this.gameModel.curGuideFunc && this.gameModel.guiding) {
        //     this.gameModel.curGuideFunc();
        // }
        
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
    getScreenPixel () {
        const stdRatio = 1.77; // 960/540
        let _s = {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            ratio: document.body.clientHeight > document.body.clientWidth ? 
                document.body.clientHeight/document.body.clientWidth : document.body.clientWidth/document.body.clientHeight
        };
        let _land = this.getLandscape();
        let _policy = null;
        if (_land) {
            if (_s.ratio>=stdRatio) _policy = cc.ResolutionPolicy.FIXED_HEIGHT;
            else _policy = cc.ResolutionPolicy.FIXED_WIDTH;
        } else {
            if (_s.ratio>=stdRatio) _policy = cc.ResolutionPolicy.FIXED_WIDTH;
            else _policy = cc.ResolutionPolicy.FIXED_HEIGHT;
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
                    if (this[elemConf[key]]) {
                        cc.find(path).getComponent(cc.Sprite).spriteFrame  = this[elemConf[key]];
                    }
                default: 
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
