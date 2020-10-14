import {Access} from "./_access";
import {r_number} from "./_regexp/number";

/**
 * Created by hellofunc on 2017-03-01.
 */

export namespace Formats {

    import primitive = Access.__primitive;

    let rr = /:([\w.]+)/g,
        second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24,
        __day = ["일", "월", "화", "수", "목", "금", "토"],

        r_datetime = /yyyy|yy|M{1,2}|d{1,2}|E|HH|mm|ss|a\/p/gi,
        _zf = (v: number) => v < 10 ? '0' : '',

        // 숫자 자리수 맞추기
        zeroFill = (t) => _zf(t) + t,
        _switch = {
            'yyyy': (d) => d.getFullYear(),
            'yy': (d) => zeroFill(d.getFullYear() % 1000),
            'M': (d) => d.getMonth() + 1,
            'MM': (d) => zeroFill(d.getMonth() + 1),
            'd': (d) => d.getDate(),
            'dd': (d) => zeroFill(d.getDate()),
            'E': (d) => __day[d.getDay()],
            'HH': (d) => zeroFill(d.getHours()),
            'hh': (d) => zeroFill(d.getHours()),
            'mm': (d) => zeroFill(d.getMinutes()),
            'ss': (d) => zeroFill(d.getSeconds()),
            'a/p': (d) => d.getHours() < 12 ? "오전" : "오후",
        }

    // 숫자 받아서 파일 크기로... (천단위 쉼표)
    // unit은 단위를 덧붙일 것인지
    export let __filesize = (function (array) {

        let r = /\B(?=(?:\d{3})+(?!\d))/g;

        return (size: number, unit = true) => {

            let t = typeof size;
            if (t !== 'number') {
                if (t !== 'string' || !/^\d+$/.test(<any>size)) return '';
                size = parseInt(<any>size);
            }

            if (size === 0) return '0 bytes';

            let result = Math.floor(Math.log(size) / Math.log(1024));
            return String(
                (size / Math.pow(1024, result)).toFixed(2)
                ).replace(r, ',')
                + (unit ? " " + array[result] : '');
        }

    })(['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']);

    // value | number : 'asdf'
    export function __expValParse(s: string) {
        let r = [], i = s.indexOf(' | ');

        if (i === -1) r[0] = s;
        else {
            r[0] = s.substring(0, i);
            s = s.substring(i + 3, s.length);

            // : 를 찾는다.
            i = s.indexOf(' : ', i);
            if (i === -1) {
                r[1] = s;
            }
            else {
                r[1] = s.substring(0, i);
                r[2] = primitive(s.substring(i + 3, s.length));
            }
        }
        return r;
    }

    export let __moneyToKor = (function (hanA, danA) {

        return function (val) {

            if (typeof val === 'number') val = val.toString();
            if (typeof val === 'string' && /^\d+$/.test(val)) {

                let result = '', han, str, i = 0, l = val.length;

                for (; i < l; i++) {
                    str = '';
                    han = hanA[val[l - (i + 1)]];
                    if (han != "") str = han + danA[i];
                    if (i == 4) str += "만";
                    if (i == 8) str += "억";
                    result = str + result;
                }

                return result || '';
            }
            return '';
        }
    })(
        ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"],
        ["", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천"]
    );


    export function __duration(date, now = new Date().getTime()) {
        var duration = now - (typeof date === 'number' ? date : new Date(date).getTime());
        if (duration > day)
            return Math.floor(duration / day) + '일 전';
        if (duration > hour)
            return Math.floor(duration / hour) + '시간 전';
        if (duration > minute)
            return Math.floor(duration / minute) + '분 전';
        if (duration > second)
            return Math.floor(duration / second) + '초 전';
    }

    export function __datetime(_date, f?: string) {
        if (!_date) return '';

        var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
        if (!f) return __datetimeFull(d);

        return f.replace(r_datetime, ($1) => {
            if (temp = _switch[$1]) return temp(d);
            else return $1;
        });
    };

    let r_full = /\d{4}[^\d]\d{1,2}[^\d]\d{1,2} \d{2}[^\d]\d{2}[^\d]\d{2}/,
        r_simple = /\d{4}[^\d]\d{1,2}[^\d]\d{1,2}/,
        r_split = /[^\d]/g;

    export function __toDate(str: string) {
        if (str.length > 10) {
            if (r_full.test(str)) {
                let [y, m, d, h, mm, s] = str.split(r_split);
                return new Date(parseInt(y), parseInt(m) - 1, parseInt(d),
                    parseInt(h), parseInt(mm), parseInt(s));
            }
        }
        else {
            if (r_simple.test(str)) {
                let [y, m, d] = str.split(r_split);
                return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            }
        }
        return null;
    }

    function __datetimeFull(val: Date) {
        let m = val.getMonth() + 1, d = val.getDate(),
            h = val.getHours(), s = val.getSeconds(), M = val.getMinutes();

        return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d, ' ',
            _zf(h), h, ':', _zf(s), s, ':', _zf(M), M].join('');
    }

    export function __date(val: Date) {
        let m = val.getMonth() + 1, d = val.getDate();

        return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d].join('');
    }

    export function replaceAll(str: string, val: Object) {
        let v;
        if (val == null) return str;
        return str.replace(rr, function (_, prop) {
            v = Access.__access(val, prop);
            return v == null ? '' : v;
        });
    }


    type REPLASER = (substring: string, ...args: any[]) => string;

    export function __replace(__value: string, rg: RegExp, literal: (s: string) => void, matcher: REPLASER) {
        let
            pos = 0,
            result = __value.replace(rg, function (all, match, index) {
                if (index) literal(__value.substring(pos, index));
                pos = index + all.length;
                return matcher.apply(this, arguments);
                ;
            });
        if (pos < __value.length) literal(__value.substring(pos, __value.length));
        return result;
    }


    // {{obj}}
    export function __replaceByObj(str: string, obj) {
        let f;
        return str.replace(/{{[^{}]+}}/g, function (_, g) {
            f = obj[g];
            if (f == null) return '';
            else if (typeof f === 'function') return f.call(obj);
            else return '';
        });
    }


    // HTML 이스케이프
    export let __htmlEscape = (function () {
        let escape = /&\w+;/g;

        function _change(c: string) {
            switch (c) {
                case '&lt;' :
                    return '<';
                case '&gt;' :
                    return '>';
                case '&nbsp;' :
                    return ' ';
                case '&amp;' :
                    return '&';
                case '&quot;' :
                    return '"';
                case '&apos;' :
                    return '\'';
                default :
                    return c;
            }
        }

        return function (str: string) {
            return str.replace(escape, (s) => _change(s));
        }
    })();

    let r_num_replace = /\B(?=(\d{3})+(?!\d))/g;

    export let __number = (val) => {
        if (typeof val === 'number') val = val.toString();

        if (typeof val === 'string' && r_number.test(val))
            return val.replace(r_num_replace, ",");
        return '0';
    };

    let r_bg = /('|"|\(|\))/g;

    export function __bgURL(s: string) {
        return s.replace(r_bg, '\\$1');
    }

    let directive = {
        number: __number,
        datetime: __datetime,
        duration: __duration,
        filesize: __filesize,
        moneyToKor: __moneyToKor,
        bgURL: __bgURL
    };

    export function __getDirective(obj?) {
        let r = Object.create(directive), p;
        if (obj) {
            for (p in obj) r[p] = obj[p];
            return r;
        }
        return r;
    }
}
