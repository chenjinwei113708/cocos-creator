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
    FOUR1: 'four1',
    FIVE1: 'five1',
    TWO1: 'two1',
};

export const BRICK_VALUE = {
    [BRICK_TYPE.FOUR1]: [
        {x: 0, y: 0}, // 起点 假设是(0, 0)
        {x: 0, y: -1}, // x代表行，y代表列
        {x: 0, y: -2}, // 跟起点在同一行，比起点少两列
        {x: 0, y: -3},
    ],
    [BRICK_TYPE.FIVE1]: [
        {x: 0, y: 0},
        {x: -1, y: 0},
        {x: -1, y: -1},
        {x: -2, y: 0},
        {x: -3, y: 0},
    ],
    [BRICK_TYPE.TWO1]: [
        {x: 0, y: 0},
        {x: 0, y: -1}
    ]
};
