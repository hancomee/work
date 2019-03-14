const
    _toString = Object.prototype.toString,
    isObjectLike = (value) => {
        return typeof value == 'object' && value !== null
    },
    getTag = (value) => {
        if (value == null) {
            return value === undefined ? '[object Undefined]' : '[object Null]'
        }
        return _toString.call(value)
    }


export function _isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) != '[object Object]') {
        return false
    }
    if (Object.getPrototypeOf(value) === null) {
        return true
    }
    let proto = value
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(value) === proto
}
