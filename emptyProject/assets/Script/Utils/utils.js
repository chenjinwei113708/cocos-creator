const Tools = {
	// 获取数据类型
  getType(obj) {
    let type = typeof obj;
    // 不等于object则表示为基础数据类型
    if (type !== 'object') return type;
    // 用正则来截取其类型部分，且变成小写
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, $1).toLowerCase()
  },
  // 浅拷贝
  shallowClone(target) {
		if (typeof target !== 'object' || target === null) return target;
		const cloneTarget = Array.isArray(target) ? [] : {};
		for (const key in target) {
			if (target.hasOwnProperty(key)) {
				cloneTarget[key] = target[key]
			}
		}
		return cloneTarget
  },
  // 深拷贝
  deepClone(obj, hash = new WeakMap()) {
    if (!((typeof obj === 'object' || typeof obj === 'function') && obj !== null)) return obj; // 如果不是复杂类型数据，则直接返回
    // 检测是否为Date
    if (obj.constructor === Date) return new Date(obj);
    // 检测是否为正则
    if (obj.constructor === RegExp) return new RegExp(obj);
    // 检测是否是循环对象
    if (hash.has(obj)) return hash.get(obj);
    // 浅拷贝一个放进hash
    const cloneObj = Object.create(Reflect.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
    hash.set(obj, cloneObj)
    // 递归复制
    for (const key of Reflect.ownKeys(obj)) {
      cloneObj[key] = this.deepClone(obj[key], hash)
    }
    return cloneObj
  },
  // 只能传入时间戳或者
  timeFormat(time = new Date()) {
    if (!(time instanceof Date) && time.toString().length === 13 && !(time.toString().indexOf('.') > -1)) {
      time = new Date(Number(time));
    }
    var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
    var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
    var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
    var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  },
  // 获取随机数
  getRandom(min, max) {
  	if (!(typeof min === 'number' || typeof max === 'number')) return console.log('getRandom: 请传入数字');
  	min = Math.floor(min)
  	max = Math.ceil(max)
  	return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

// export default Tools

export default Tools