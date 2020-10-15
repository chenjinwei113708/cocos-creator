/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const CELL_TYPE = {
    EMPTY : 0,
}

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};

export const BRICK_TYPE = {
    FOUR1: 'four1'
};

export const BRICK_VALUE = {
    [BRICK_TYPE.FOUR1]: [
        {x: 0, y: 0},
        {x: 0, y: -1},
        {x: 0, y: -2},
        {x: 0, y: -3},
    ]
};
