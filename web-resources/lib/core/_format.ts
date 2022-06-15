import {Access} from "./_access";

/**
 * Created by hellofunc on 2017-03-01.
 */

export namespace Formats {

    import __read = Access.__read;
    import primitive = Access.__primitive;

    let
        __f = (a) => a,
        rr = /:([\w.]+)/g,
        rn = /[^\d\.]+/g,
        today = new Date(),
        second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, year = 365 * day,
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
        },

        __DUMMY = {},
        _DEFAULT_FILTER = {

            toLowerCase(val) {
                return val ? val.toString().toLowerCase() : '';
            },

            filesize: (function (array) {

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

            })(['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']),

            moneyKo: (function (hanA, danA) {

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
            ),

            duration(date, now = today.getTime()) {
                var duration = now - (typeof date === 'number' ? date : date.getTime());
                if (duration > year)
                    return Math.floor(duration / year) + '년 전';
                if (duration > day)
                    return Math.floor(duration / day) + '일 전';
                if (duration > hour)
                    return Math.floor(duration / hour) + '시간 전';
                if (duration > minute)
                    return Math.floor(duration / minute) + '분 전';
                if (duration > second)
                    return Math.floor(duration / second) + '초 전';
            },

            datetime(_date, f?: string) {
                if (!_date) return '';

                var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
                if (!f) return __datetimeFull(d);

                return f.replace(r_datetime, ($1) => {
                    if (temp = _switch[$1]) return temp(d);
                    else return $1;
                });
            },
            // zero : 0을 빈문자열로 반환할지
            number(val, zero = false) {
                if (typeof val === "number") {
                    val = val.toString().replace(r_num_replace, ",");
                    if(zero && val === '0') val = '';
                    return val;
                }
                return '';
            },
            separator(val, nums: number[], str: string) {
                if (typeof val !== 'string' || !val) return '';
                let r = [], ri = 0, s = 0, e = 0, i = 0, l = nums.length, limit = val.length;
                for (; i < l; i++) {
                    e = s + nums[i];
                    if (e > limit) break;
                    else r[ri++] = val.slice(s, s = e);
                }
                if (e < limit) r[ri] = val.slice(e);

                return r.join(str);
            },
            valuesMap(val, values) {
                return values[val] || '';
            },
            log(val, value) {
                console.log(val, value);
                return ''
            }
        };


    // 숫자 받아서 파일 크기로... (천단위 쉼표)
    // unit은 단위를 덧붙일 것인지
    export let __filesize = _DEFAULT_FILTER.filesize,
        __moneyKo = _DEFAULT_FILTER.moneyKo,
        __duration = _DEFAULT_FILTER.duration,
        __datetime = _DEFAULT_FILTER.datetime,
        __number = _DEFAULT_FILTER.number;


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
            } else {
                r[1] = s.substring(0, i);
                r[2] = primitive(s.substring(i + 3, s.length));
            }
        }
        return r;
    }

    // data.val?func("asdfasf")
    export function __filterParser(str: string): [string, string, any] {
        let result = [], i = str.indexOf('?');
        if (i === -1) result[0] = str;
        else {
            let i2;
            result[0] = str.slice(0, i++);
            if ((i2 = str.indexOf('(', i)) !== -1) {
                result[2] = str.slice(i2 + 1, -1);
                result[1] = str.slice(i, i2);
            } else result[1] = str.slice(i);
        }
        return result as any;
    }


    export function __filterFunction(str: string) {

        if(str.indexOf('?') === -1)
            return (data) => __read(str, data);

        let [prop, filter] = str.split('?'),
            name, args,
            i;
        if ((i = filter.indexOf('(')) !== -1) {
            name = filter.substring(0, i);
            args = JSON.parse('[' + filter.substring(i + 1, -1) + ']');
        } else {
            name = filter;
            args = [];
        }

        return (data, filter = __DUMMY) => {
            let f = filter[name] || _DEFAULT_FILTER[name] || __f;
            return f.apply(f, [__read(prop, data)].concat(args));
        }
    }


    // prop?function("args...")
    export function __filterApply(str: string, obj, filter: any = __DUMMY) {
        let i = str.indexOf('?');
        if (i === -1) obj = __read(str, obj);
        else {
            if ((obj = __read(str.slice(0, i), obj)) != null) {
                let func = str.slice(i + 1), args;
                if ((i = func.indexOf('(')) !== -1) {
                    args = JSON.parse('[' + func.slice(i + 1, -1) + ']');
                    func = func.slice(0, i);

                }
                if (filter[func]) {
                    obj = filter[func].apply(filter, [obj].concat(args));
                }
                if (_DEFAULT_FILTER[func]) {
                    obj = _DEFAULT_FILTER[func].apply(_DEFAULT_FILTER, [obj].concat(args));
                }
            }
        }
        return obj;
    }


    export function __erase_image_str(str: string) {
        return str && str.replace(/[^\u0000-\uD7FF\uE000-\uFFFF]/g, '');
    }

    export function __erase_window_ban(str: string, char: string = '') {
        return str && str.replace(/[\\/:*?"<>|]/g, char);
    }

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
        } else {
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
            _zf(h), h, ':', _zf(M), M, ':', _zf(s), s].join('');
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

    let r_num_replace = /\B(?=(\d{3})+(?!\d))/g,
        r_bg = /('|"|\(|\))/g;

    export function __bgURL(s: string) {
        return s.replace(r_bg, '\\$1');
    }

    let directive = {
        number: __number,
        datetime: __datetime,
        duration: __duration,
        filesize: __filesize,
        moneyToKor: __moneyKo,
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
