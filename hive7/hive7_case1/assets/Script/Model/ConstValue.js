/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const GAME_LEVEL = {
    LEVEL1: 'level1',
    LEVEL2: 'level2',
    LEVEL3: 'level3',
    LEVEL4: 'level4',
    LEVEL5: 'level5',
};

export const CELL_TYPE = {
    C2: 'c2',
    C3: 'c3',
    C4: 'c4',
    C5: 'c5',
    C6: 'c6',
    C7: 'c7',
    CStar: 'cStar',
    CPP: 'cpp'
};

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};

export const ACTION_TYPE = {
    SWITCH: 'switch',
    COMBINE: 'combine',
    DOWN: 'down',
    CHANGE: 'change',
    BOMB: 'bomb',
};

