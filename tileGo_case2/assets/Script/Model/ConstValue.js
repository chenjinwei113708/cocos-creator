/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const CELL_TYPE = {
    GOLD : 'cgold',
    CASH : 'cwallet',
    DIAMOND : 'cdiamond',
    LOT : 'clot',
    OUT : 'cout',
}

export const TYPE_MONEY = {
    [CELL_TYPE.GOLD] : 15,
    [CELL_TYPE.CASH] : 5,
    [CELL_TYPE.DIAMOND] : 5,
    [CELL_TYPE.LOT] : 25,
    [CELL_TYPE.OUT] : 5,
}

export const CELL_STATUS = {
    CAN_MOVE : 'CAN_MOVE',
    IS_MOVE : 'IS_MOVE',
    DONE_MOVE: 'DONE_MOVE',
    GAME_OVER: 'GAME_OVER',
}
