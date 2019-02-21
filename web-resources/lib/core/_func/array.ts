let {indexOf} = Array.prototype;

export function _indexOf(obj: ArrayLike<any>, v) {
    let l = obj.length;
    while (l-- > 0)
        if (obj[l] === v) return l;
    return -1;
}


// index 위치에 있는 원소를 move 위치로 옮기기
export function _move<T>(obj: ArrayLike<T>, index: number, move: number): T[] {

    let r: T[] = [], i = 0, l = obj.length;

    r[move] = obj[index];

    // 역방향 이동
    if(index > move) {
        for(;i<l;i++) {
            if(i !== index) {
                if(i < move) r[i] = obj[i];
                else if(i > index) r[i] = obj[i];
                else r[i + 1] = obj[i];
            }
        }
    }

    // 정방향 이동
    else {
        for(;i<l;i++) {
            if(i !== index) {
                if(i < index) r[i] = obj[i];
                else if(i > move) r[i] = obj[i];
                else r[i - 1] = obj[i];
            }
        }
    }

    return r;
}

export function _makeArray<T>(obj: ArrayLike<T>): T[] {
    let r = [], l = obj.length;
    while (l-- > 0) r[l] = obj[l];
    return r;
}

export function _filter<T>(obj: ArrayLike<T>, filter: (o: T, i: number) => boolean): T[] {
    let r = [], i = 0, l = obj.length, pos = 0;
    for (; i < l; i++)
        if (filter(obj[i], i)) r[pos++] = obj[i];
    return r;
}

export function _forEach<T>(obj: ArrayLike<T>, h: (t: T, i: number) => any) {
    let i = 0, l = obj.length;
    while (i < l) {
        if (h(obj[i], i++) === false)
            return obj;
    }
    return obj;
}

export function _selector<T>(obj: ArrayLike<T>, h: (t: T, i: number) => boolean): T {
    let i = 0, l = obj.length, v;
    while (i < l) {
        if (h(v = obj[i], i++))
            return v;
    }
    return undefined;
}

export function _forEachReverse<T>(obj: ArrayLike<T>, h: (t: T, i: number) => any) {
    let i = obj.length;
    while (i-- > 0) {
        if (h(obj[i], i) === false)
            break;
    }
    return obj;
}

export function _reduce<T, R>(obj: ArrayLike<T>, h: (r: R, t: T, i: number) => R, r: R): R {
    let i = 0, l = obj.length;
    while (i < l) {
        r = h(r, obj[i], i++);
    }
    return r;
}

export function _reduceN<T, R>(obj: ArrayLike<T>, h: (r: R, t: T, i: number) => any, r: R): R {
    let i = 0, l = obj.length;
    while (i < l) {
        h(r, obj[i], i++);
    }
    return r;
}

export function _map<T, R>(obj: ArrayLike<T>, h: (t: T, i: number) => R): R[] {
    let r = [], i = 0, l = obj.length;
    while (i < l) {
        r[i] = h(obj[i], i++);
    }
    return r;
}

export function _colMap<T, R>(values: ArrayLike<R>, size: number, handler: (array: R[], i: number) => T): T[] {
    let r = [], v, l = values.length,
        index = 0, rIndex = 0, vIndex = 0;

    while (index < l) {
        if (index % size === 0) {
            v && (r[rIndex] = handler(v, rIndex++));
            v = [];
            vIndex = 0;
        }
        v[vIndex++] = values[index++];
    }

    v && (r[rIndex] = handler(v, rIndex++));

    return r;
}

export function _colReduce<T, R>(values: ArrayLike<R>, size: number, handler: (r: T, array: R[], i: number) => T, r: T): T {
    let v, l = values.length,
        index = 0, rIndex = 0, vIndex = 0;

    while (index < l) {
        if (index % size === 0) {
            v && (r = handler(r, v, rIndex++));
            v = [];
            vIndex = 0;
        }
        v[vIndex++] = values[index++];
    }

    v && (r = handler(r, v, rIndex++));

    return r;
}

function _in<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean, r: boolean): boolean {
    let i = 0, l = obj.length;
    while (i < l) {
        if (filter(obj[i], i++) === r) return r;
    }
    return !r;
}

// true가 하나라도 있으면
export function _inTrue<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
    return _in(obj, filter, true);
}

export function _inFalse<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
    return _in(obj, filter, false);
}

export function _everyTrue<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
    let i = 0, l = obj.length;
    while (i < l) {
        if (filter(obj[i], i++) === false) return false;
    }
    return true;
}

export function _everyFalse<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
    let i = 0, l = obj.length;
    while (i < l) {
        if (filter(obj[i], i++) === true) return false;
    }
    return true;
}
