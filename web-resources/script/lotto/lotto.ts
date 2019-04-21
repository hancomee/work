import {_everyTrue} from "../../lib/core/_func/array";
import {$get} from "../../lib/core/_util/_ajax";

let _nTable = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42],
    [43, 44, 45, null, null, null, null],
];

export class Lotto {
    id: number
    date: string

    num1: number
    num2: number
    num3: number
    num4: number
    num5: number
    num6: number
    bonus: number

    nums: number[]

    rTable

    count: number
    money: number

    million: string


    constructor(v) {
        for (let p in v)
            this[p] = v[p];

        let nums = this.nums = [v.num1, v.num2, v.num3, v.num4, v.num5, v.num6];
        this.million = (v.money / 100000000).toFixed(1);

        this.rTable = _nTable.map(row => {
            return row.map(val => {
                return {
                    num: val || '',
                    check: nums.indexOf(val) !== -1
                }
            });
        });
    }

    check(n: number[]) {
        let {nums} = this;
        return _everyTrue(n, (v) => nums.indexOf(v) !== -1)
    }


}


export namespace Lotto {

    let _array45 = (function (n) {
        let r = [];
        while (n-- > 0) r[n] = 0;
        return r;
    })(45);
    export let nTable = _nTable;

    export function array45() {
        return _array45.slice();
    }

    // 1...45
    export let loop = (function (v) {
        return (h: (i: number) => void) => {
            for (let i = 1; i < v; i++) h(i);
        }
    })(46);


    export function $data(): Promise<any[]> {
        return $get('/lotto/values').then( (v: any[]) => v.reverse());
    }

    export function $list(): Promise<Lotto[]> {
        return $data().then(v => v.map(a => new Lotto(a)));
    }
}