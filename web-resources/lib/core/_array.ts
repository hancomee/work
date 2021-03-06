export namespace Arrays {


    let {indexOf, slice} = Array.prototype;

    type arrayClas_call<T> = (value: T, index: number, colNum?: number, rowNum?: number) => boolean | any

    // 배열을 테이블화 시켜서 순회한다. 행이 존재함
    // 콜백함수 (원소, 전체인덱스, 열넘버, 행넘버) ==>  false 반환시 루프 멈춤
    export function __cols<T>(array: T[], col: number, callback: arrayClas_call<T>) {

        let {length: limit} = array,
            i = 0, colNum, row = -1;

        if (col < 1) throw new Error('열 수는 1 이상이어야  합니다 :: input Value ==> ' + col)

        for (; i < limit; i++) {
            if ((colNum = i % col) === 0) row++;
            if (callback.call(array, array[i], i, colNum, row) === false) return;
        }
    }


    /*
     *   ( [1, 2, 3, 4, 5, 6, 7, 8, 9], 3) ==> [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
     *   1 2 3
     *   4 5 6
     *   7 8 9
     */
    export function __colsR<T>(values: T[], col: number) {
        let result = __loop(col, (r, i) => r[i] = [], []);
        __cols(values, col, (v, index, colNum, rowNum) => {
            result[colNum][rowNum] = v;
        });
        return result;
    }


    export function __slice<T, A>(array: T[], col: number, callback: (this: T[], v: T[], i: number) => A) {
        let c = 0, i = 0, len = Math.ceil(array.length / col), result: A[] = [];
        for (; i < len; i++) {
            result[i] = callback.call(array, array.slice(c, c = (i + 1) * col), i);
        }
        return result;
    }

    /*
     *  DataTransferItemList 때문에 만든 함수
     *  map을 이용함에 있어, 비동기식 콜백으로 값을 받아야 하는 지연값이 있을 경우에 쓴다.
     *  *사용법은 로직 참고
     */
    export function __promiseMap<T, U>(array: ArrayLike<T>, handler: (val: T, call: (d: U) => void) => void) {

        return new Promise<U[]>((resolve, _) => {
            let check: number, len = check = array.length, result: U[] = [];
            while (len-- > 0) {
                let index = len;
                handler(array[index], (d) => {
                    result[index] = d;
                    --check === 0 && resolve(result);
                });
            }
        });

    }


    // 숫자배열을 만들어준다.
    // 시작넘버부터 객수
    export function __rangeBySize(start: number, size: number): number[] {
        let array: number[] = [];
        for (let i = 0, l = start + size; start < l; start++) {
            array[i++] = start;
        }
        return array;
    }

    // 시작숫자부터 마지막 숫자를 포함한 배열을 반환
    export function __range_atob(start: number, lastNum: number): number[] {

        let
            reverse = start > lastNum ? true : false,
            array: number[] = [];

        /*
         *  start와 lastNum이 반대로 들어오면 ?    (5, 1)   ==>  [5,4,3,2,1]
         *  일단 뒤짚어서 배열을 만든 후, 내보낼때 reserve()한다.
         */
        if (reverse) {
            let temp = start;
            start = lastNum;
            lastNum = temp;
        }

        for (let i = 0, l = lastNum - start + 1; i < l; i++) {
            array.push(i + start);
        }
        return reverse ? array.reverse() : array;
    }


    // drive 배열의 원소만큼 루프를 돌린다.
    // callback함수는  1) drive 배열의 원소와  2) driven배얼, 3) 인덱스를 제공받는다.
    export function __with<T, A>(drive: T[], driven: A[], callback: (val: T, driven: A, index: number) => void) {
        if (drive == null) return
        for (let i = 0; i < drive.length; i++) {
            callback.call(drive, drive[i], driven, i);
        }
    }


    // length(갯수)만큼 배열을 채워준다.
    // (number) => T 핸들러를 인자로 제공하면, 매 array 인덱스마다 이 핸들러를 호출해서 직접 값을 받는다.
    // 함수가 아닌 값을 인자로 제공하면, 단일 값으로 배열을 채운다.
    export function __fill<T>(length: number, handler: (v: number) => T): T[]
    export function __fill<T>(length: number, value: T): T[]
    export function __fill(length: number): any[]
    export function __fill<T>(length: number, v = null) {

        let
            i = 0,
            array = [],
            handler: (v: number) => T = v;

        if (typeof v !== 'function') handler = () => v

        for (; i < length; i++) {
            array[i] = handler.call(array, i);
        }

        return array;

    }


    // 배열을 length의 갯수만큼 나눈다.
    // [1,2,3,4,5,6], 3  ==>  [1,2,3], [4,5,6]
    export function __split<T>(target: T[], length: number): T[][] {

        let
            result: T[][] = [],
            temp: T[],
            pos: number;

        for (let i = 0, l = target.length; i < l; i++) {
            pos = i % length;
            if (!pos) result.push(temp = []);
            temp[pos] = target[i];
        }

        return result;
    }

    // target의 앞부터 다 맞으면 오케이
    export function __startWith(key: any[], target: any[]) {
        let i = 0, l = key.length;

        if (target.length < l) return false;

        for (; i < l; i++) {
            if (key[i] !== target[i]) return false;
        }

        return true;
    }

    export function __endWith(key: any[], target: any[]) {
        let i = 0, l = key.length, r = target.length - l;

        if (r < 0) return false;

        for (; i < l; i++, r++) {
            if (key[i] !== target[r]) return false;
        }

        return true;
    }

    // 값 비교
    export function __equals(a: any[], b: any[], valueMatch = false) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        let i = 0, l = a.length;
        if (valueMatch) {
            for (; i < l; i++) {
                if (a.indexOf(b[i]) === -1) return false;
            }
        } else {
            for (; i < l; i++) {
                if (a[i] !== b[i]) return false;
            }
        }
        return true;
    }


    /*
     *   [1,2,3,4,5];
     *   ::  (1,2)  (2,3)  (3,4)  (4,5)
     */
    export function __zipper<T, R>(array: ArrayLike<T>, handler: (before: T, after: T, r: R) => R, r?: R) {
        let {length} = array;
        if (length < 2) return;

        let i = 0, l = length - 1;
        while (i < l) {
            r = handler(array[i++], array[i], r);
        }
        return r;
    }

    export function __indexOf(obj: ArrayLike<any>, v) {
        return indexOf.call(obj, v);
    }


    // (1,1) => [1]    //   (1,4) => [1,2,3,4]
    export function __range(start: number, end: number): number[] {
        let result = [], pos = 0;
        end++;
        for (; start < end; start++)
            result[pos++] = start;
        return result;
    }

    // index 위치에 있는 원소를 move 위치로 옮기기
    export function __move<T>(obj: ArrayLike<T>, index: number, move: number): T[] {

        let r: T[] = [], i = 0, l = obj.length;

        r[move] = obj[index];

        // 역방향 이동
        if (index > move) {
            for (; i < l; i++) {
                if (i !== index) {
                    if (i < move) r[i] = obj[i];
                    else if (i > index) r[i] = obj[i];
                    else r[i + 1] = obj[i];
                }
            }
        }

        // 정방향 이동
        else {
            for (; i < l; i++) {
                if (i !== index) {
                    if (i < index) r[i] = obj[i];
                    else if (i > move) r[i] = obj[i];
                    else r[i - 1] = obj[i];
                }
            }
        }

        return r;
    }

    export function __concat<T>(...args: (ArrayLike<T> | T)[]): T[] {
        let r = [], pos = 0;
        args.forEach(v => {
            if (Array.isArray(v)) v.forEach(v => r[pos++] = v);
            else r[pos++] = v;
        })
        return r;
    }

    export function __flapMap<T>(obj: ArrayLike<T>, handler: (a: T, i: number) => T[]) {
        let i = 0, l = obj.length, r: T[] = [];
        for (; i < l; i++) {
            r.concat(handler(obj[i], i));
        }
        return r;
    }

    export function __makeArray<T>(obj: ArrayLike<T>): T[] {
        return slice.call(obj);
    }

    export function __filter<T>(obj: ArrayLike<T>, filter: (o: T, i: number) => boolean): T[] {
        let r = [], i = 0, l = obj.length, pos = 0;
        for (; i < l; i++)
            if (filter(obj[i], i)) r[pos++] = obj[i];
        return r;
    }

    export function __forEach<T>(obj: ArrayLike<T>, h: (t: T, i: number) => any) {
        let i = 0, l = obj.length;
        while (i < l) {
            if (h(obj[i], i++) === false)
                return obj;
        }
        return obj;
    }

    export function __selector<T>(obj: ArrayLike<T>, h: (t: T, i: number) => boolean): T {
        let i = 0, l = obj.length, v;
        while (i < l) {
            if (h(v = obj[i], i++))
                return v;
        }
        return undefined;
    }

    export function __forEachR<T>(obj: ArrayLike<T>, h: (t: T, i: number) => any) {
        let i = obj.length;
        while (i-- > 0) {
            if (h(obj[i], i) === false)
                break;
        }
        return obj;
    }


    export function __loopMap<T>(i: number, h: (i: number) => T): T[] {
        let dr = [], p = 0;
        for (; p < i; p++)
            dr[p] = h(p);
        return dr;
    }

    export function __loop<T>(i: number, h: (t: T, i: number) => void, t?: T): T {
        for (let p = 0; p < i; p++)
            h(t, p);
        return t;
    }

    export function __reduce<T, R>(obj: ArrayLike<T>, h: (r: R, t: T, i: number) => R, r: R): R {
        let i = 0, l = obj.length;
        while (i < l) {
            r = h(r, obj[i], i++);
        }
        return r;
    }

    export function __reduceN<T, R>(obj: ArrayLike<T>, h: (r: R, t: T, i: number) => any, r: R): R {
        let i = 0, l = obj.length;
        while (i < l) {
            h(r, obj[i], i++);
        }
        return r;
    }

    export function __map<T, R>(obj: ArrayLike<T>, h: (t: T, i: number) => R): R[] {
        let r = [], i = 0, l = obj.length;
        while (i < l) {
            r[i] = h(obj[i], i++);
        }
        return r;
    }

    export function __toArray<T, R>(obj: {[index: string]: T}, h: (p: string, v: T,  i: number) => R): R[] {
        let r = [], rr = 0, i = 0, p, rv;
        for(p in obj) {
            rv = h(p, obj[p], i++);
            if(rv !== null) r[rr++] = rv;
        }
        return r;
    }

    export function __colMap<T, R>(values: ArrayLike<R>, size: number, handler: (array: R[], i: number) => T): T[] {
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

    export function __colReduce<T, R>(values: ArrayLike<R>, size: number, handler: (r: T, array: R[], i: number) => T, r: T): T {
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

    function __in<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean, r: boolean): boolean {
        let i = 0, l = obj.length;
        while (i < l) {
            if (filter(obj[i], i++) === r) return r;
        }
        return !r;
    }

    // true가 하나라도 있으면
    export function __inTrue<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
        return __in(obj, filter, true);
    }

    export function __inFalse<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
        return __in(obj, filter, false);
    }

    export function __everyTrue<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
        let i = 0, l = obj.length;
        while (i < l) {
            if (filter(obj[i], i++) === false) return false;
        }
        return true;
    }

    export function __everyFalse<T>(obj: ArrayLike<T>, filter: (t: T, i: number) => boolean): boolean {
        let i = 0, l = obj.length;
        while (i < l) {
            if (filter(obj[i], i++) === true) return false;
        }
        return true;
    }


    // sort 순서까지 맞아야하는지
    export function __contains(source: ArrayLike<any>, target: ArrayLike<any>, sort = true) {
        let limit = source.length, i = target.length;
        if (limit < i) return false;

        if (sort) {
            while (i-- > 0) {
                if (target[i] !== source[i]) return false;
            }
        } else {
            while (i-- > 0) {
                if (indexOf.call(source, target[i]) === -1) return false;
            }
        }

        return true;
    }
}
