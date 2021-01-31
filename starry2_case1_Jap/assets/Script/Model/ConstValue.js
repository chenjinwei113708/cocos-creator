/**
 * 这个脚本用来存储一些全局都会用到的常量
 */
export const CELL_TYPE = {
    EMPTY : 0,
    BLUE : 1,
    GREEN : 2,
    PURPLE : 3,
    RED : 4,
    YELLOW : 5
}
export const CELL_BASENUM = 6;
export const CELL_STATUS = {
    COMMON: 0
} 

export const TIP={
    WAIT_TIME:3 //等待多少秒开始提示
}

// 提示策略，
export const TIP_STRATEGY={
    MOST_COIN: 'most_coin', //提示金币最多的区域
    MOST_GRADE: 'most_grade', //提示积分最多的区域（格子数量最多）
    AREA: 'area' //某个区域
}

export const GRID_WIDTH = 10;//列数
export const GRID_HEIGHT = 10;//行数

export const CELL_WIDTH = 50;
export const CELL_HEIGHT = 50;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;

export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

// ********************   时间表  animation time 单位秒 **************************
export const ANITIME = {
    FADEOUT: 0.05,
    MOVE: 0.1, //移动一格的时间
    NUM_FLY_TIME: 1.3 //数字飞到指定位置的时间
}

/**类型转颜色 */
export const TYPE2COLOR = {
    [CELL_TYPE.BLUE]: 'BLUE',
    [CELL_TYPE.GREEN]: 'GREEN',
    [CELL_TYPE.PURPLE]: 'PURPLE',
    [CELL_TYPE.RED]: 'RED',
    [CELL_TYPE.YELLOW]: 'YELLOW'
}
/**颜色 */
export const COLOR = {
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    PURPLE: 'PURPLE',
    RED: 'RED',
    YELLOW: 'YELLOW'
}
/**颜色值 */
export const COLOR_VALUE = {
    BLUE: {r: 42, g: 157, b: 253},
    GREEN: {r: 72, g: 214, b: 36},
    PURPLE: {r: 191, g: 41, b: 238},
    RED: {r: 250, g: 38, b: 94},
    YELLOW: {r: 254, g: 186, b: 7}
}
