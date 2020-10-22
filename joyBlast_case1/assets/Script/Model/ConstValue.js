/**
 * 这个脚本用来存储一些全局都会用到的常量
 */

export const CELL_TYPE = {
    GREEN: 'green',
    RED: 'red',
    YELLOW: 'yellow',
    BLUE: 'blue',
    PURPLE: 'purple',
    ROCKET: 'rocket',
};

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};

export const ACTION_TYPE = {
    COMBINE: 'combine',
    DOWN: 'down',
    BOMB: 'bomb',
};

export const GAME_LEVEL = {
    LEVEL1: 'level1',
    LEVEL2: 'level2',
};