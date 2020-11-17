/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const GAME_LEVEL = {
    LEVEL1: 'level1',
    LEVEL2: 'level2',
};

export const CELL_TYPE = {
    APPLE: 'apple',
    BANANA: 'banana',
    STRAWBERRY: 'strawberry',
    GRAPE: 'grape',
    CARROT: 'carrot',
    PEAR: 'pear',
    TOMATO: 'tomato',
};

export const CELL_STATUS = {
    CAN_MOVE: 0,
    IS_MOVE: 1,
    DONE_MOVE: 2,
    LOST_GAME: 3,
};

export const COMBINE_TYPE = {
    APPLE: CELL_TYPE.GRAPE,
    BANANA: CELL_TYPE.STRAWBERRY,
    STRAWBERRY: CELL_TYPE.APPLE,
    GRAPE: CELL_TYPE.CARROT,
    CARROT: CELL_TYPE.PEAR,
    PEAR: CELL_TYPE.TOMATO,
};

export const ACTION_TYPE = {
    SWITCH: 'switch',
    COMBINE: 'combine',
    DOWN: 'down',
};
