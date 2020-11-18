/**
 * Created by hellofunc on 2017-03-01.
 */
import {r_number} from "./_regexp/number";

export namespace Access {

    // dot으로 구분된 프로퍼티 읽어오기

    export function __read(p: string, obj)
    export function __read(p: string[], obj)
    export function __read(p, obj) {
        if(!p) return obj;
        let names = typeof p === 'string' ? p.split('.') : p,
            {length} = names, i = 0;
        for (; i < length; i++) {
            if ((obj = obj[names[i]]) == null) return null;
        }
        return obj;
    }


    export let __primitive = (function () {
        let
            r_boolean = /^true$|^false$/,
            r_string = /^['"][^"']+['"]$/;

        return (val) => {
            if (typeof val === 'string' && val) {
                if (r_string.test(val)) return val.slice(1, -1);
                if (r_number.test(val)) return parseInt(val);
                if (r_boolean.test(val)) return val === 'true';
            }
            return val;
        };
    })();

    let r_a = /\./;

    export function __access(target, _props: string): any
    export function __access<T>(target: T, _props: string, val, force: boolean): T
    export function __access(target, _props: string, val?, force?: boolean) {

        if (target == null || _props == null || _props === '') return target;

        let
            props = _props.split(r_a),
            len = props.length - 1,
            obj = target, temp,
            i = 0;

        for (; obj != null && i < len; i++) {
            temp = obj[props[i]];
            if (temp == null && force) temp = obj[props[i]] = {};
            obj = temp;
        }

        // [1] getter
        if (arguments.length === 2) return obj != null ? obj[props[i]] : obj;

        // [2] setter
        obj != null && (obj[props[i]] = val);
        return target;
    }
}



