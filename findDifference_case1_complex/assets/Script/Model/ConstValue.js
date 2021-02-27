/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
const CORRECT_POS = {
    CORRECT1: { x: -148, y: -111 },
    CORRECT2: { x: 110, y: -28 },
    CORRECT3: { x: 233, y: -45 },
    CORRECT4: { x: -75, y: 140 },
    CORRECT5: { x: 55, y: 72 }
}

const GAME_MODE = {
    EASY: 0, // 简易模式
    DIFFICULTY: 1, // 困难模式
    MODE: 1, // 表示简单模式
    PLAY_TIMES: [1, 5]
}

const GAME_INFO = {
    CLICK_DISTANCE: 30, // 表示点击的时候判定为正确的距离的距离
    CORRECT_RANGE: {
        CORRECT1: { x: 15, y: 15 },
        CORRECT2: { x: 15, y: 20 },
        CORRECT3: { x: 15, y: 15 },
        CORRECT4: { x: 10, y: 30 },
        CORRECT5: { x: 30, y: 8 }
    },
    CASH: [10, 30, 60, 100, 120]
}

const WIN_TXT = {
    CONGRAT: 'YOU WIN!',
    CASH: [10, 30, 60, 100, 120],
    BUTTON: 'CASH OUT'
}

export {
    CORRECT_POS,
    GAME_MODE,
    GAME_INFO,
    WIN_TXT
}

