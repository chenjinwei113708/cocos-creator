/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const CARD_STATUS = {
    CAN_MOVE: 0, // 可以发牌
    IS_MOVE: 1, // 自己移动
    USER_MOVE: 1, // 用户移动
    DONE_MOVE: 3, // 移动完毕
    LOST_GAME: 4, // 游戏输了
};

export const CARD_GROUP = {
    KONG1: 'kong1',
    KONG2: 'kong2',
    KONG3: 'kong3',
    KONG4: 'kong4',
    KONG5: 'kong5',
};

export const CARD_GROUP_INDEX = {
    [CARD_GROUP.KONG1]: 0,
    [CARD_GROUP.KONG2]: 1,
    [CARD_GROUP.KONG3]: 2,
    [CARD_GROUP.KONG4]: 3,
    [CARD_GROUP.KONG5]: 4,
};

export const LOST_GAME_CARD_NUM = 6; // 输掉游戏的条件，一组里面放了6张牌

export const CARD_VALUE = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

