/**
 * 这个脚本用来存储一些全局都会用到的常量
 */

export const CELL_TYPE = {
    C2: 'c2',
    C4: 'c4',
    C8: 'c8',
    C16: 'c16',
    C32: 'c32',
    C128: 'c128'
};

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};

export const GAME_CAM = {
    vertical: { // 初始化的时候是竖屏
        vertical: {
            game1: {
                // position: cc.v2(0, 0),
                children: {
                    GameCamera: {
                        position: cc.v2(0, 0)
                    }
                },
            }
        },
        horizontal: {
            game1: {
                // position: cc.v2(0, 0),
                children: {
                    GameCamera: {
                        position: cc.v2(-445, 165)
                    }
                },
            }
        },
    },
    horizontal: { // 初始化的时候是横屏
        vertical: {
            game1: {
                // position: cc.v2(0, 0),
                children: {
                    GameCamera: {
                        position: cc.v2(210, -200)
                    }
                },
            }
        },
        horizontal: {
            game1: {
                // position: cc.v2(240, 35),
                children: {
                    GameCamera: {
                        position: cc.v2(-240, -42)
                    }
                }
            }
        },
    }
};

