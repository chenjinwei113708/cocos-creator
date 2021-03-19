/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
const GAME_INFO = {
    GRID_WIDTH: 27,
    GRID_HEIGHT: 27,
    CELL_WIDTH: 54,
    CELL_HEIGHT: 54,
    MIN_OFFSET_X: 14,
    END_OFFSET_X: -54,
    MAX_DISTANCEX: 0,
    MIN_DISTANCEX: -54
}

const GAME_STATUS = {
    DISABLED: 0,
    CAN_DRAG: 1,
    IS_DRAGING: 2
}

export {
    GAME_INFO,
    GAME_STATUS
}
