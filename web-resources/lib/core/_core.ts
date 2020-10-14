/**
 * Created by hellofunc on 2017-03-22.
 */

let class2type = {},
    toString = class2type.toString,
    getProto = Object.getPrototypeOf,
    hasOwn = class2type.hasOwnProperty,
    fnToString = hasOwn.toString,
    ObjectFunctionString = fnToString.call(Object),     // function Object() { [native code] }
    objStr = class2type.toString();                     // [object Object]



export let ownNames = Object.getOwnPropertyNames;

export function __toString(v) {
    return toString.call(v);
}

// isPlainOjbect와 다르게 ①Object Map과 ②Class 객체를 골라준다.
export function __isObjectType(obj) {
    return toString.call(obj) === objStr;
}

export function __isPlainObject(obj) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    proto = getProto(obj);

    // Objects with no prototype (e.g., `Object.newInstance( null )`) are plain
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}


export function __isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

export function __isArrayLike(item) {
    return Array.isArray(item) ||
        (item && typeof item === "object" && typeof (item.length) === "number" && (item.length - 1) in item);
}

let r_fn = /^function\s*([^\s(]+)/;
export function __getFunctionName(func) {
    return func.name ? func.name : func.toString().match(r_fn)[1]
}

export let __isObject = (val) => toString.call(val) === "[object Object]";

/*
 *  일종의 객체 Decode/Encode
 *  세번째 인자에 해당 프로퍼티를 가공할 함수를 넣어주면, 객체를 복사하면서 값을 처리한다.
 *  이때 함수가 1) 반환값을 가지면, 그 값을 프로퍼티에 입력하고, 2) 반환값이 없으면 그냥 넘어간다.
 *  2)번의 경우는 직접 함수내에서 값 설정을 한다고 가정한다.
 */


let dummy = {},
    converts = {
        number: (a: string) => a ? parseInt(a) : 0,
    };
type EXTEND_CONFIG<T> = { [index: string]: ((v: any, o: T) => void) | boolean }


export function extend(...args: {}[])
export function extend(deep: boolean, ...args: {}[])
export function extend(...args: any[]) {

    let handler = __extend, i = 0, len: number, temp;

    if (typeof args[0] === 'boolean') {
        if (args[0]) handler = __deepExtend;
        i = 1;
    }

    temp = args[i++];
    len = args.length;


    for (; i < len; i++) {
        temp = handler(temp, args[i]);
    }

    return temp;
}

export function __extend<T>(dest: ArrayLike<T>, source: ArrayLike<T>): ArrayLike<T>
export function __extend<T>(dest: {}, source: T): T
export function __extend(dest, source): any {

    if(source == null) return dest;

    if (__isArrayLike(source)) {
        let i = 0, l = source.length;
        for (; i < l; i++) {
            dest[i] = source[i];
        }
    }
    else {
        let p;
        for (p in source) {
            dest[p] = source[p];
        }
    }

    return dest;
}


export function __deepExtend<T>(dest: ArrayLike<T>, source: ArrayLike<T>): ArrayLike<T>
export function __deepExtend<T>(dest: {}, source: T): T
export function __deepExtend(dest, source): any {

    if (__isArrayLike(source)) {
        let i = 0, l = source.length, d, s;
        for (; i < l; i++) {
            s = source[i];
            d = dest[i];
            if (__isArrayLike(s)) dest[i] = __deepExtend(__isArrayLike(d) ? d : [], s);
            else if (__isPlainObject(s)) dest[i] = __deepExtend(__isPlainObject(d) ? d : {}, s);
            else dest[i] = s;
        }
    }
    else {
        let i, s, d;
        for (i in source) {
            s = source[i];
            d = dest[i];
            if (__isArrayLike(s)) dest[i] = __deepExtend(__isArrayLike(d) ? d : [], s);
            else if (__isPlainObject(s)) dest[i] = __deepExtend(__isPlainObject(d) ? d : {}, s);
            else dest[i] = s;
        }
    }

    return dest;
}


// $extend(target, null)  ==>  모두 null값으로 대체
export function $extend<T>(target: T, source): T;
export function $extend<T>(target: T, source, converts: EXTEND_CONFIG<T>): T
export function $extend<T>(target: T, source, converts: EXTEND_CONFIG<T> = <any>dummy): T {

    // undefined값이 올때만 패스한다.
    // null이 들어오면 모든 프로퍼티가 null이 된다.
    if (source === void 0) return target;

    let p, v, f;

    // source가 단순 값일 경우!
    if (source === null) {
        for (p in target) {
            if (p[0] !== '_' && p[0] !== '$' && typeof (v = target[p]) !== 'function')
                target[p] = source;
        }
    }

    // source가 객체 혹은 valueMap일 경우
    else {
        for (p in source) {
            if (p[0] !== '_' && p[0] !== '$' && typeof (v = source[p]) !== 'function' && (f = converts[p]) !== false)
                if (typeof f === 'function') {
                    v = f.call(target, source[p], target);
                    if (v !== void 0) target[p] = v;
                }
                else target[p] = v
        }
    }

    return target;
}


