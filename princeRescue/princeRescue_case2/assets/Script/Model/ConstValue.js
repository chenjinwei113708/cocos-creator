/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
const GAME_INFO = {
    PILLAR_MOVE_DISTANCE: 180,
    PP_NODE_DISTANCE: 70,
    ADD_CASH_TIME: 2,
    EACH_LIGHT_TIME: 0.5, // 进度条每点亮一个灯的时间
    DIRECTION: [
        null,
        null,
        'right',
        'left'
    ],
    PRINCE_ANIM_INFO: {
        NORMAL: 'prince_normal',
        RUN: 'prince_run',
        WIN: 'prince_win',
        RUN_DISTANCE: 120
    }
}

const GAME_STATUS = {
    DISABLED: 0,
    // CAN_DRAG: 1,
    CAN_SPIN: 1,
    CAN_CLICK1: 2,
    CAN_CLICK2: 3
}

export {
    GAME_INFO,
    GAME_STATUS
}