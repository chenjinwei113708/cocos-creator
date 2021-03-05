/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const GAME_LEVEL = {
    LEVEL1: 'level1',
    LEVEL2: 'level2',
    LEVEL3: 'level3',
};

export const CELL_TYPE = {
    CYELLOW: 'cyellow',
    CBLUE: 'cblue',
    CPURPLE: 'cpurple',
    CGREEN: 'cgreen',
    CRED: 'cred'
};

export const ACTION_TYPE = {
    SWITCH: 'switch',
    COMBINE: 'combine',
    DOWN: 'down',
    CHANGE: 'change',
    BOMB: 'bomb',
};

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};
