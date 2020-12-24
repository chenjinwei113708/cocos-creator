/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const CELL_TYPE = {
    CE: 'CE', // empty
    C1: 'C1',
    C2: 'C2',
    C3: 'C3',
    C4: 'C4',
    C5: 'C5',
    C6: 'C6',
    CPP: 'CPP', // pp卡
}

// 合并会生成什么类型
export const COMBINE_TYPE = {
    C1: 'C2',
    C2: 'C3',
    C3: 'C4',
    C4: 'C5',
    C5: 'C6',
    C6: 'CPP',
}

export const CELL_STATUS = {
    CAN_MOVE: 'CAN_MOVE',
    IS_MOVE : 'IS_MOVE',
    DONE_MOVE: 'DONE_MOVE',
    GAME_OVER: 'GAME_OVER'
}

export const GRID_WIDTH = 5;//列数
export const GRID_HEIGHT = 5;//行数

