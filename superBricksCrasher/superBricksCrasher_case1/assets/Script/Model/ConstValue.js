/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
const GAME_INFO = {
    BRICKS_TAG: 111,
    WALL_TAG: 222,
    CLEAR_WALL_TAG: 333,
    BRICKS_NAME: {
        'brick5': false,
        'brick4': false,
        'brick3': false,
        'brick2': false,
        'brick1': false
    }
}

const GAME_STATUS = {
    DISABLED: 0,
    CAN_CLICK: 1
}

export {
    GAME_INFO,
    GAME_STATUS
}