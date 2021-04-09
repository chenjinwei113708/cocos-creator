/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
const GAME_INFO = {
    END_DISTANCE: 75,
    BUFFER: 20,
    ADD_CASH_TIME: 1,
    AWARD_PAGE1_TXT: [
        null,
        null,
        { PP_CARD: '$ 100', BUTTON: 'GET  $100' },
        null,
        null,
        { PP_CARD: '$ 200', BUTTON: 'CASH OUT' },
    ]
}

const GAME_STATUS = {
    DISABLED: 0,
    CAN_SPIN: 1,
    CAN_RECEIVE1: 2,
    CAN_DRAG: 3,
    IS_MOVING: 4,
    GAME_OVER: 5
}

export {
    GAME_INFO,
    GAME_STATUS
}