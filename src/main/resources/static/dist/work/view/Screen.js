/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, number_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Access;
    (function (Access) {
        // dot으로 구분된 프로퍼티 읽어오기
        function read(p, obj) {
            var names = typeof p === 'string' ? p.split('.') : p, length = names.length, i = 0;
            for (; i < length; i++) {
                if ((obj = obj[names[i]]) == null)
                    return null;
            }
            return obj;
        }
        Access.read = read;
        Access.primitive = (function () {
            var r_boolean = /^true$|^false$/, r_string = /^['"][^"']+['"]$/, r_date = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, r_string_replace = /["']/g;
            return function (val) {
                if (typeof val === 'string' && val.length > 0) {
                    if (r_string.test(val))
                        return val.replace(r_string_replace, '');
                    if (number_1.r_number.test(val))
                        return parseInt(val);
                    if (r_boolean.test(val))
                        return val === 'true';
                    if (r_date.test(val))
                        return new Date(val);
                }
                return val;
            };
        })();
        var r_a = /\./;
        function access(target, _props, val, force) {
            if (target == null || _props == null || _props === '')
                return target;
            var props = _props.split(r_a), len = props.length - 1, obj = target, temp, i = 0;
            for (; obj != null && i < len; i++) {
                temp = obj[props[i]];
                if (temp == null && force)
                    temp = obj[props[i]] = {};
                obj = temp;
            }
            // [1] getter
            if (arguments.length === 2)
                return obj != null ? obj[props[i]] : obj;
            // [2] setter
            obj != null && (obj[props[i]] = val);
            return target;
        }
        Access.access = access;
    })(Access = exports.Access || (exports.Access = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, access_1, number_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by hellofunc on 2017-03-01.
     */
    var Formats;
    (function (Formats) {
        var primitive = access_1.Access.primitive;
        var rr = /:([\w.]+)/g, second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, __day = ["일", "월", "화", "수", "목", "금", "토"], r_datetime = /yyyy|yy|M{1,2}|d{1,2}|E|HH|mm|ss|a\/p/gi, _zf = function (v) { return v < 10 ? '0' : ''; }, 
        // 숫자 자리수 맞추기
        zeroFill = function (t) { return _zf(t) + t; }, _switch = {
            'yyyy': function (d) { return d.getFullYear(); },
            'yy': function (d) { return zeroFill(d.getFullYear() % 1000); },
            'M': function (d) { return d.getMonth() + 1; },
            'MM': function (d) { return zeroFill(d.getMonth() + 1); },
            'd': function (d) { return d.getDate(); },
            'dd': function (d) { return zeroFill(d.getDate()); },
            'E': function (d) { return __day[d.getDay()]; },
            'HH': function (d) { return zeroFill(d.getHours()); },
            'hh': function (d) { return zeroFill(d.getHours()); },
            'mm': function (d) { return zeroFill(d.getMinutes()); },
            'ss': function (d) { return zeroFill(d.getSeconds()); },
            'a/p': function (d) { return d.getHours() < 12 ? "오전" : "오후"; },
        };
        // 숫자 받아서 파일 크기로... (천단위 쉼표)
        // unit은 단위를 덧붙일 것인지
        Formats.filesize = (function (array) {
            var r = /\B(?=(?:\d{3})+(?!\d))/g;
            return function (size, unit) {
                if (unit === void 0) { unit = true; }
                var t = typeof size;
                if (t !== 'number') {
                    if (t !== 'string' || !/^\d+$/.test(size))
                        return '';
                    size = parseInt(size);
                }
                if (size === 0)
                    return '0 bytes';
                var result = Math.floor(Math.log(size) / Math.log(1024));
                return String((size / Math.pow(1024, result)).toFixed(2)).replace(r, ',')
                    + (unit ? " " + array[result] : '');
            };
        })(['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']);
        // value | number : 'asdf'
        function expValParse(s) {
            var r = [], i = s.indexOf(' | ');
            if (i === -1)
                r[0] = s;
            else {
                r[0] = s.substring(0, i);
                s = s.substring(i + 3, s.length);
                // : 를 찾는다.
                i = s.indexOf(' : ');
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
        Formats.expValParse = expValParse;
        Formats.moneyToKor = (function (hanA, danA) {
            return function (val) {
                if (typeof val === 'number')
                    val = val.toString();
                if (typeof val === 'string' && /^\d+$/.test(val)) {
                    var result = '', han = void 0, str = void 0, i = 0, l = val.length;
                    for (; i < l; i++) {
                        str = '';
                        han = hanA[val[l - (i + 1)]];
                        if (han != "")
                            str = han + danA[i];
                        if (i == 4)
                            str += "만";
                        if (i == 8)
                            str += "억";
                        result = str + result;
                    }
                    return result || '';
                }
                return '';
            };
        })(["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"], ["", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천"]);
        function duration(date, now) {
            if (now === void 0) { now = new Date().getTime(); }
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
        Formats.duration = duration;
        function datetime(_date, f) {
            if (!_date)
                return '';
            var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
            if (!f)
                return datetimeFull(d);
            return f.replace(r_datetime, function ($1) {
                if (temp = _switch[$1])
                    return temp(d);
                else
                    return $1;
            });
        }
        Formats.datetime = datetime;
        ;
        var r_full = /\d{4}[^\d]\d{1,2}[^\d]\d{1,2} \d{2}[^\d]\d{2}[^\d]\d{2}/, r_simple = /\d{4}[^\d]\d{1,2}[^\d]\d{1,2}/, r_split = /[^\d]/g;
        function toDate(str) {
            if (str.length > 10) {
                if (r_full.test(str)) {
                    var _a = str.split(r_split), y = _a[0], m = _a[1], d = _a[2], h = _a[3], mm = _a[4], s = _a[5];
                    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(mm), parseInt(s));
                }
            }
            else {
                if (r_simple.test(str)) {
                    var _b = str.split(r_split), y = _b[0], m = _b[1], d = _b[2];
                    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                }
            }
            return null;
        }
        Formats.toDate = toDate;
        function datetimeFull(val) {
            var m = val.getMonth() + 1, d = val.getDate(), h = val.getHours(), s = val.getSeconds(), M = val.getMinutes();
            return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d, ' ',
                _zf(h), h, ':', _zf(s), s, ':', _zf(M), M].join('');
        }
        function date(val) {
            var m = val.getMonth() + 1, d = val.getDate();
            return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d].join('');
        }
        Formats.date = date;
        function replaceAll(str, val) {
            var v;
            if (val == null)
                return str;
            return str.replace(rr, function (_, prop) {
                v = access_1.Access.access(val, prop);
                return v == null ? '' : v;
            });
        }
        Formats.replaceAll = replaceAll;
        function replace(__value, rg, literal, matcher) {
            var pos = 0, result = __value.replace(rg, function (all, match, index) {
                if (index)
                    literal(__value.substring(pos, index));
                pos = index + all.length;
                return matcher.apply(this, arguments);
                ;
            });
            if (pos < __value.length)
                literal(__value.substring(pos, __value.length));
            return result;
        }
        Formats.replace = replace;
        // {{obj}}
        function replaceByObj(str, obj) {
            var f;
            return str.replace(/{{[^{}]+}}/g, function (_, g) {
                f = obj[g];
                if (f == null)
                    return '';
                else if (typeof f === 'function')
                    return f.call(obj);
                else
                    return '';
            });
        }
        Formats.replaceByObj = replaceByObj;
        // HTML 이스케이프
        Formats._htmlEscape = (function () {
            var escape = /&lt;|&gt;|&nbsp;|&amp;|&quot;|&apos;/g;
            function _change(c) {
                switch (c) {
                    case '&lt;':
                        return '<';
                    case '&gt;':
                        return '>';
                    case '&nbsp;':
                        return ' ';
                    case '&amp;':
                        return '&';
                    case '&quot;':
                        return '"';
                    case '&apos;':
                        return '\'';
                    default:
                        return c;
                }
            }
            return function (str) {
                return str.replace(escape, function (s) { return _change(s); });
            };
        })();
        var r_num_replace = /\B(?=(\d{3})+(?!\d))/g;
        Formats.number = function (val) {
            if (typeof val === 'number')
                val = val.toString();
            if (typeof val === 'string' && number_1.r_number.test(val))
                return val.replace(r_num_replace, ",");
            return '0';
        };
        var r_bg = /('|"|\(|\))/g;
        function bgURL(s) {
            return s.replace(r_bg, '\\$1');
        }
        Formats.bgURL = bgURL;
        var directive = {
            number: Formats.number,
            datetime: datetime,
            duration: duration,
            filesize: Formats.filesize,
            moneyToKor: Formats.moneyToKor,
            bgURL: bgURL
        };
        function getDirective(obj) {
            var r = Object.create(directive), p;
            if (obj) {
                for (p in obj)
                    r[p] = obj[p];
                return r;
            }
            return r;
        }
        Formats.getDirective = getDirective;
    })(Formats = exports.Formats || (exports.Formats = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Formats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var date = Formats_1.Formats.date;
    var datetime = Formats_1.Formats.datetime;
    var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, __day = ["일", "월", "화", "수", "목", "금", "토"], __month = function (year, month, val) {
        var i = 1;
        if (val < 0)
            val = val * (i = -1);
        while (val-- > 0) {
            month = month + i;
            if (month > 11) {
                year++;
                month = 0;
            }
            else if (month < 0) {
                year--;
                month = 11;
            }
        }
        return [year, month];
    };
    var Month = /** @class */ (function () {
        // month는 0부터
        function Month(year, month) {
            this.year = year;
            this.month = month;
        }
        Month.prototype.move = function (val) {
            var _b = __month(this.year, this.month, val), year = _b[0], month = _b[1];
            return new Month(year, month);
        };
        Month.prototype.toArray = function () {
            return Calendar.toArray(this.year, this.month);
        };
        Month.prototype.toString = function () {
            return this.year + '-' + (this.month + 1);
        };
        return Month;
    }());
    exports.Month = Month;
    var Calendar = /** @class */ (function () {
        function Calendar(_value) {
            if (_value == null)
                this.value = new Date();
            else
                this.value = _value instanceof Date ? _value : new Date(_value);
        }
        Object.defineProperty(Calendar.prototype, "year", {
            get: function () {
                return this.value.getFullYear();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "month", {
            get: function () {
                return this.value.getMonth();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "date", {
            get: function () {
                return this.value.getDate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "day", {
            get: function () {
                return this.value.getDay();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Calendar.prototype, "longtime", {
            get: function () {
                return this.value.getTime();
            },
            enumerable: true,
            configurable: true
        });
        // Date와 인터페이스를 맞추기 위한 메서드들
        Calendar.prototype.getFullYear = function () {
            return this.year;
        };
        Calendar.prototype.getMonth = function () {
            return this.month;
        };
        Calendar.prototype.$date = function (num) {
            if (!num)
                return this;
            return new Calendar(new Date(this.longtime + (num * day)));
        };
        Calendar.prototype.$month = function (num) {
            if (!num)
                return this;
            var date = this.date, _b = __month(this.year, this.month, num), year = _b[0], month = _b[1], lastDate = new Date(year, month + 1, -1).getDate();
            return new Calendar(new Date(year, month, date > lastDate ? lastDate : date));
        };
        Calendar.prototype.$year = function (num) {
            if (!num)
                return this;
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            return new Calendar(new Date(year + num, month, date));
        };
        // 주차를 알려준다.
        Calendar.prototype.$week = function () {
            var _b = this, day = _b.day, date = _b.date, year = _b.year, month = _b.month, firstDate = this.getFirstDate().day, // 첫번째 요일
            lastDate = this.getLastDate().date, // 마지막 일
            current = Math.ceil((firstDate + date) / 7), total = Math.ceil((firstDate + lastDate) / 7); // 총 주차 수
            return [current, total];
        };
        Calendar.prototype.getFirstDate = function () {
            return new Calendar(new Date(this.year, this.month, 1));
        };
        Calendar.prototype.getLastDate = function () {
            var _b = __month(this.year, this.month, 1), year = _b[0], month = _b[1];
            return new Calendar(new Date(year, month, 0));
        };
        Calendar.prototype.setTime = function (value) {
            if (value === void 0) {
                value = new Date();
            }
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            return new Calendar(new Date(year, month, date, value.getHours(), value.getMinutes(), value.getSeconds()));
        };
        Object.defineProperty(Calendar.prototype, "isodate", {
            get: function () {
                return date(this.value);
            },
            enumerable: true,
            configurable: true
        });
        Calendar.prototype.year_kr = function (str) {
            if (str === void 0) { str = '년'; }
            return this.year + str;
        };
        Calendar.prototype.month_kr = function (str, zerofill) {
            if (str === void 0) { str = '월'; }
            if (zerofill === void 0) { zerofill = true; }
            var month = this.month + 1, val = month.toString();
            if (zerofill)
                val = (month < 10 ? '0' : '') + month;
            return val + str;
        };
        Calendar.prototype.date_kr = function (str, zerofill) {
            if (str === void 0) { str = '일'; }
            if (zerofill === void 0) { zerofill = true; }
            var date = this.date, val = date.toString();
            if (zerofill)
                val = (date < 10 ? '0' : '') + date;
            return val + str;
        };
        Calendar.prototype.day_kr = function () {
            return __day[this.day];
        };
        Calendar.prototype.durationDate = function (target) {
            var origLong = Math.floor(this.longtime / day) * day, targetLong = Math.floor(target.getTime() / day) * day;
            return (targetLong - origLong) / day;
        };
        Calendar.prototype.durationMonth = function (target) {
            var origY = this.getFullYear() * 12 + this.getMonth(), targetY = target.getFullYear() * 12 + target.getMonth();
            return targetY - origY;
        };
        Calendar.prototype.durationYear = function (target) {
            return target.getFullYear() - this.getFullYear();
        };
        Calendar.prototype.format = function (str) {
            if (str === void 0) {
                str = 'yyyy-MM-dd';
            }
            return datetime(this.value, str);
        };
        Calendar.prototype.equals = function (data) {
            var _a = this, year = _a.year, month = _a.month, date = _a.date;
            if (year !== data.getFullYear())
                return false;
            if (month !== data.getMonth())
                return false;
            if (date !== data.getDate())
                return false;
            return true;
        };
        Calendar.prototype.toString = function () {
            return datetime(this.value);
        };
        Calendar.prototype.clone = function () {
            return new Calendar(this.longtime);
        };
        return Calendar;
    }());
    exports.Calendar = Calendar;
    (function (Calendar) {
        Calendar.format = datetime;
        function create(v1, v2, v3, v4, v5, v6) {
            var v = v1;
            if (typeof v6 === 'number')
                v = new Date(v1, v2 - 1, v3, v4, v5, v6);
            else if (typeof v3 === 'number')
                v = new Date(v1, v2 - 1, v3);
            return new Calendar(v);
        }
        Calendar.create = create;
        function monthInfo(year, month) {
            var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
            return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
        }
        function today(str) {
            if (str === void 0) { str = 'yyyy-MM-dd'; }
            return datetime(new Date(), str);
        }
        // 날짜 계산
        function days(before, after) {
            if (after === void 0) { after = new Date(); }
            return Math.floor((after.getTime() - before.getTime()) / day) + 1;
        }
        Calendar.days = days;
        // 달력을 만들기 위한 배열
        function toArray(y, m) {
            var _a = monthInfo(y, m), fd = _a[1], l = _a[2], start = new Calendar(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
            row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];
            while (row > 0) {
                var r = [];
                for (; i < 7; i++) {
                    r.push(start = start.$date(1));
                }
                result.push(r);
                i = 0;
                row--;
            }
            return result;
        }
        Calendar.toArray = toArray;
        function isodate(y, m, d) {
            var dd = y;
            if (typeof dd === 'number')
                dd = new Date(y, m, d);
            return date(dd);
        }
        Calendar.isodate = isodate;
        function _day(date, opt) {
            if (opt === void 0) { opt = 'kr'; }
            return __day[date.getDay()];
        }
        Calendar._day = _day;
    })(Calendar = exports.Calendar || (exports.Calendar = {}));
    exports.Calendar = Calendar;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // "..." 안의 문자는 제외한 상태에서 char를 찾는다.
    // HTML 문법상 "" 안에는 "는 절대 들어갈 수 없다.
    function indexOfChar(str, char, i) {
        if (i === void 0) { i = 0; }
        var l = str.length;
        for (; i < l; i++) {
            if (str[i] === char)
                return i;
            if (str[i] === '"')
                i = str.indexOf('"', i + 1);
        }
        return -1;
    }
    exports.indexOfChar = indexOfChar;
    function lastIndexOfChar(str, char, i) {
        if (i === void 0) { i = str.length; }
        var l = -1;
        for (; i > l; i--) {
            if (str[i] === char)
                return i;
            if (str[i] === '"')
                i = str.lastIndexOf('"', i);
        }
        return -1;
    }
    exports.lastIndexOfChar = lastIndexOfChar;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(4), __webpack_require__(1), __webpack_require__(2), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, access_1, DOM_1, Formats_1, Arrays_1, _compile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var access = access_1.Access.access;
    var number = Formats_1.Formats.number;
    var datetime = Formats_1.Formats.datetime;
    var expValParse = Formats_1.Formats.expValParse;
    var _forEach = Arrays_1.Arrays._forEach;
    function isAlikeArray(target) {
        if (target && typeof target.length === 'number') {
            return true;
        }
        return false;
    }
    var defaultDirective = (function () {
        var directive = {
            number: function (ele, v) {
                ele.textContent = number(v);
            },
            datetime: function (ele, v, p) {
                ele.textContent = datetime(v, p);
            },
            // 문자열을 통해 엘리먼트 체크
            exp: function (ele, v, opt) {
            }
        };
        return function () { return Object.create(directive); };
    })();
    function $$mapping(prefix, val) {
        return prefix ? prefix + '.' + val : val;
    }
    function $render(ele, mapping, data, $val, Mapping) {
        if (ele.hasAttribute('data-ignore'))
            return;
        var $mapping = ele.getAttribute('data-mapping'), attrVal;
        // mapping정보가 존재하면 data를 변경한다.
        if ($mapping != null) {
            $val = access(data, mapping = $mapping);
        }
        /*
         *
         */
        if ((attrVal = ele.getAttribute('data-directive')) != null) {
            var directive = Mapping.directive, _a = expValParse(attrVal), name_1 = _a[0], filter = _a[1], primitive = _a[2], v = access($val, name_1);
            if (v == null)
                ele.textContent = '';
            else if (filter != null)
                directive[filter] && directive[filter].call(Mapping, ele, v, primitive, mapping);
            else
                ele.textContent = v.toString();
        }
        /*
         *  element.clone(true)
         */
        if ((attrVal = ele.getAttribute('data-template')) != null) {
            var temple_1 = Mapping.template[attrVal], fragment_1 = document.createDocumentFragment();
            ele.textContent = '';
            // ① 배열인 경우
            if (isAlikeArray($val)) {
                _forEach($val, function (v, p) {
                    var c = temple_1(v), prop = $$mapping(mapping, p);
                    $render(c, prop, data, v, Mapping);
                    c.setAttribute('data-mapping', prop);
                    fragment_1.appendChild(c);
                });
            }
            // ② 단일 객체
            else {
                var c = temple_1(ele);
                $render(c, mapping, data, $val, Mapping);
                c.setAttribute('data-mapping', mapping);
                fragment_1.appendChild(c);
            }
            ele.appendChild(fragment_1);
        }
        /*
         *  html 문자열
         */
        else if ((attrVal = ele.getAttribute('data-html')) != null) {
            var html_1 = Mapping.html[attrVal], htmls_1 = [], pos_1 = 0;
            if (isAlikeArray($val)) {
                _forEach($val, function (v, p) { return htmls_1[pos_1++] = html_1(v); });
            }
            else
                htmls_1[pos_1++] = html_1($val);
            ele.innerHTML = htmls_1.join('');
        }
        /*
         *  단순 clone
         */
        else if ((attrVal = ele.getAttribute('data-replace')) != null) {
            var 
            /*
             *  !로 시작하면 맨처음에만 붙이고 그 다음엔 붙이지 않는다.
             */
            noRender = attrVal[0] === '!', clone = Mapping.template[noRender ? attrVal.slice(1) : attrVal]($val);
            $render(clone, mapping, data, $val, Mapping);
            noRender || ele.setAttribute('data-ignore', 'true');
            ele.parentElement.replaceChild(clone, ele);
        }
        else {
            var i = 0, childs = ele.children, l = childs.length;
            for (; i < l; i++) {
                if (childs[i].nodeType === 1)
                    $render(childs[i], mapping, data, $val, Mapping);
            }
        }
    }
    exports.$render = $render;
    ;
    var Mapping = /** @class */ (function () {
        function Mapping() {
            this.html = {};
            this.directive = defaultDirective();
            this.template = {};
        }
        Mapping.prototype.$$preProcess = function (ele, directive) {
            var list = ele.querySelectorAll('[data-pre-process]'), l = list.length, i = 0, u, e;
            for (; i < l; i++) {
                e = list[i];
                if ((u = directive[e.getAttribute('data-pre-process')])) {
                    u.call(directive, e, this, ele);
                }
            }
            return this;
        };
        Mapping.prototype.setData = function (data) {
            this.data = data;
            return this;
        };
        Mapping.prototype.addHTML = function (target) {
            var html = this.html;
            _forEach(target.querySelectorAll('[data-html]'), function (e) {
                html[e.getAttribute('data-html')] = _compile_1._replaceHTML(e.innerText);
            });
            return this;
        };
        Mapping.prototype.addTemplate = function (a, b) {
            if (typeof a === 'string')
                this.template[a] = b;
            else if (a.nodeType === 1)
                this.addTemplate(Mapping.createTemplates(a));
            else {
                var template = this.template, p = void 0;
                for (p in a)
                    template[p] = a[p];
            }
            return this;
        };
        Mapping.prototype.addDirective = function (a, b) {
            if (typeof a === 'string')
                this.directive[a] = b;
            else {
                var directive = this.directive, p = void 0;
                for (p in a)
                    directive[p] = a[p];
            }
            return this;
        };
        Mapping.prototype.readData = function (mapping) {
            return access(this.data, mapping);
        };
        Mapping.prototype.createTemplate = function (name, data) {
            var element = this.template[name](data);
            this.$render(element, data);
            return element;
        };
        Mapping.prototype.$render = function (ele, data) {
            if (data === void 0) { data = this.data; }
            $render(ele, null, this.data, data, this);
            return ele;
        };
        Mapping.prototype.$follow = function (name) {
            var _this = this;
            _forEach(document.querySelectorAll('[data-follow]'), function (e) {
                if (e.getAttribute('data-follow').indexOf(name) !== -1) {
                    _this.$render(e);
                }
            });
            return this;
        };
        return Mapping;
    }());
    exports.Mapping = Mapping;
    (function (Mapping) {
        var createHTML = DOM_1.DOM.createHTML;
        function createTemplate(obj, target) {
            var name = target.getAttribute('data-template'), html = createHTML(target.innerText);
            obj[name] = function () { return html.cloneNode(true); };
            return obj;
        }
        function createTemplates(target) {
            var $templates = {};
            if (target.hasAttribute('data-template'))
                return createTemplate($templates, target);
            _forEach(target.querySelectorAll('[data-template]'), function (e) {
                createTemplate($templates, e);
            });
            return $templates;
        }
        Mapping.createTemplates = createTemplates;
    })(Mapping = exports.Mapping || (exports.Mapping = {}));
    exports.Mapping = Mapping;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Arrays;
    (function (Arrays) {
        var indexOf = Array.prototype.indexOf;
        // 배열을 테이블화 시켜서 순회한다. 행이 존재함
        // 콜백함수 (원소, 전체인덱스, 열넘버, 행넘버) ==>  false 반환시 루프 멈춤
        function cols(array, col, callback) {
            var limit = array.length, i = 0, colNum, row = -1;
            if (col < 1)
                throw new Error('열 수는 1 이상이어야  합니다 :: input Value ==> ' + col);
            for (; i < limit; i++) {
                if ((colNum = i % col) === 0)
                    row++;
                if (callback.call(array, array[i], i, i % col, row) === false)
                    return;
            }
        }
        Arrays.cols = cols;
        function slice(array, col, callback) {
            var c = 0, i = 0, len = Math.ceil(array.length / col), result = [];
            for (; i < len; i++) {
                result[i] = callback.call(array, array.slice(c, c = (i + 1) * col), i);
            }
            return result;
        }
        Arrays.slice = slice;
        /*
         *  DataTransferItemList 때문에 만든 함수
         *  map을 이용함에 있어, 비동기식 콜백으로 값을 받아야 하는 지연값이 있을 경우에 쓴다.
         *  *사용법은 로직 참고
         */
        function promiseMap(array, handler) {
            return new Promise(function (resolve, _) {
                var check, len = check = array.length, result = [];
                var _loop_1 = function () {
                    var index = len;
                    handler(array[index], function (d) {
                        result[index] = d;
                        --check === 0 && resolve(result);
                    });
                };
                while (len-- > 0) {
                    _loop_1();
                }
            });
        }
        Arrays.promiseMap = promiseMap;
        // 숫자배열을 만들어준다.
        // 시작넘버부터 객수
        function rangeBySize(start, size) {
            var array = [];
            for (var i = 0, l = start + size; start < l; start++) {
                array[i++] = start;
            }
            return array;
        }
        Arrays.rangeBySize = rangeBySize;
        // 시작숫자부터 마지막 숫자를 포함한 배열을 반환
        function range_atob(start, lastNum) {
            var reverse = start > lastNum ? true : false, array = [];
            /*
             *  start와 lastNum이 반대로 들어오면 ?    (5, 1)   ==>  [5,4,3,2,1]
             *  일단 뒤짚어서 배열을 만든 후, 내보낼때 reserve()한다.
             */
            if (reverse) {
                var temp = start;
                start = lastNum;
                lastNum = temp;
            }
            for (var i = 0, l = lastNum - start + 1; i < l; i++) {
                array.push(i + start);
            }
            return reverse ? array.reverse() : array;
        }
        Arrays.range_atob = range_atob;
        // drive 배열의 원소만큼 루프를 돌린다.
        // callback함수는  1) drive 배열의 원소와  2) driven배얼, 3) 인덱스를 제공받는다.
        function _with(drive, driven, callback) {
            if (drive == null)
                return;
            for (var i = 0; i < drive.length; i++) {
                callback.call(drive, drive[i], driven, i);
            }
        }
        Arrays._with = _with;
        function fill(length, v) {
            if (v === void 0) { v = null; }
            var i = 0, array = [], handler = v;
            if (typeof v !== 'function')
                handler = function () { return v; };
            for (; i < length; i++) {
                array[i] = handler.call(array, i);
            }
            return array;
        }
        Arrays.fill = fill;
        // 배열을 length의 갯수만큼 나눈다.
        // [1,2,3,4,5,6], 3  ==>  [1,2,3], [4,5,6]
        function split(target, length) {
            var result = [], temp, pos;
            for (var i = 0, l = target.length; i < l; i++) {
                pos = i % length;
                if (!pos)
                    result.push(temp = []);
                temp[pos] = target[i];
            }
            return result;
        }
        Arrays.split = split;
        // target의 앞부터 다 맞으면 오케이
        function startWith(key, target) {
            var i = 0, l = key.length;
            if (target.length < l)
                return false;
            for (; i < l; i++) {
                if (key[i] !== target[i])
                    return false;
            }
            return true;
        }
        Arrays.startWith = startWith;
        function endWith(key, target) {
            var i = 0, l = key.length, r = target.length - l;
            if (r < 0)
                return false;
            for (; i < l; i++, r++) {
                if (key[i] !== target[r])
                    return false;
            }
            return true;
        }
        Arrays.endWith = endWith;
        // 값 비교
        function equals(a, b, valueMatch) {
            if (valueMatch === void 0) { valueMatch = false; }
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            if (a.length != b.length)
                return false;
            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            var i = 0, l = a.length;
            if (valueMatch) {
                for (; i < l; i++) {
                    if (a.indexOf(b[i]) === -1)
                        return false;
                }
            }
            else {
                for (; i < l; i++) {
                    if (a[i] !== b[i])
                        return false;
                }
            }
            return true;
        }
        Arrays.equals = equals;
        /*
         *   [1,2,3,4,5];
         *   ::  (1,2)  (2,3)  (3,4)  (4,5)
         */
        function _zipper(array, handler, r) {
            var length = array.length;
            if (length < 2)
                return;
            var i = 0, l = length - 1;
            while (i < l) {
                r = handler(array[i++], array[i], r);
            }
            return r;
        }
        Arrays._zipper = _zipper;
        function _indexOf(obj, v) {
            return indexOf.call(obj, v);
        }
        Arrays._indexOf = _indexOf;
        function _range(i, l, handler, t) {
            for (; i < l; i++)
                handler(i, t);
            return t;
        }
        Arrays._range = _range;
        // index 위치에 있는 원소를 move 위치로 옮기기
        function _move(obj, index, move) {
            var r = [], i = 0, l = obj.length;
            r[move] = obj[index];
            // 역방향 이동
            if (index > move) {
                for (; i < l; i++) {
                    if (i !== index) {
                        if (i < move)
                            r[i] = obj[i];
                        else if (i > index)
                            r[i] = obj[i];
                        else
                            r[i + 1] = obj[i];
                    }
                }
            }
            // 정방향 이동
            else {
                for (; i < l; i++) {
                    if (i !== index) {
                        if (i < index)
                            r[i] = obj[i];
                        else if (i > move)
                            r[i] = obj[i];
                        else
                            r[i - 1] = obj[i];
                    }
                }
            }
            return r;
        }
        Arrays._move = _move;
        function _makeArray(obj) {
            var r = [], l = obj.length;
            while (l-- > 0)
                r[l] = obj[l];
            return r;
        }
        Arrays._makeArray = _makeArray;
        function _filter(obj, filter) {
            var r = [], i = 0, l = obj.length, pos = 0;
            for (; i < l; i++)
                if (filter(obj[i], i))
                    r[pos++] = obj[i];
            return r;
        }
        Arrays._filter = _filter;
        function _forEach(obj, h) {
            var i = 0, l = obj.length;
            while (i < l) {
                if (h(obj[i], i++) === false)
                    return obj;
            }
            return obj;
        }
        Arrays._forEach = _forEach;
        function _selector(obj, h) {
            var i = 0, l = obj.length, v;
            while (i < l) {
                if (h(v = obj[i], i++))
                    return v;
            }
            return undefined;
        }
        Arrays._selector = _selector;
        function _forEachReverse(obj, h) {
            var i = obj.length;
            while (i-- > 0) {
                if (h(obj[i], i) === false)
                    break;
            }
            return obj;
        }
        Arrays._forEachReverse = _forEachReverse;
        function _loopMap(i, h) {
            var dr = [], p = 0;
            for (; p < i; p++)
                dr[p] = h(p);
            return dr;
        }
        Arrays._loopMap = _loopMap;
        function _loop(i, h, t) {
            for (var p = 0; p < i; p++)
                h(t, p);
            return t;
        }
        Arrays._loop = _loop;
        function _reduce(obj, h, r) {
            var i = 0, l = obj.length;
            while (i < l) {
                r = h(r, obj[i], i++);
            }
            return r;
        }
        Arrays._reduce = _reduce;
        function _reduceN(obj, h, r) {
            var i = 0, l = obj.length;
            while (i < l) {
                h(r, obj[i], i++);
            }
            return r;
        }
        Arrays._reduceN = _reduceN;
        function _map(obj, h) {
            var r = [], i = 0, l = obj.length;
            while (i < l) {
                r[i] = h(obj[i], i++);
            }
            return r;
        }
        Arrays._map = _map;
        function _colMap(values, size, handler) {
            var r = [], v, l = values.length, index = 0, rIndex = 0, vIndex = 0;
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
        Arrays._colMap = _colMap;
        function _colReduce(values, size, handler, r) {
            var v, l = values.length, index = 0, rIndex = 0, vIndex = 0;
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
        Arrays._colReduce = _colReduce;
        function _in(obj, filter, r) {
            var i = 0, l = obj.length;
            while (i < l) {
                if (filter(obj[i], i++) === r)
                    return r;
            }
            return !r;
        }
        // true가 하나라도 있으면
        function _inTrue(obj, filter) {
            return _in(obj, filter, true);
        }
        Arrays._inTrue = _inTrue;
        function _inFalse(obj, filter) {
            return _in(obj, filter, false);
        }
        Arrays._inFalse = _inFalse;
        function _everyTrue(obj, filter) {
            var i = 0, l = obj.length;
            while (i < l) {
                if (filter(obj[i], i++) === false)
                    return false;
            }
            return true;
        }
        Arrays._everyTrue = _everyTrue;
        function _everyFalse(obj, filter) {
            var i = 0, l = obj.length;
            while (i < l) {
                if (filter(obj[i], i++) === true)
                    return false;
            }
            return true;
        }
        Arrays._everyFalse = _everyFalse;
        // sort 순서까지 맞아야하는지
        function _contains(source, target, sort) {
            if (sort === void 0) { sort = true; }
            var limit = source.length, i = target.length;
            if (limit < i)
                return false;
            if (sort) {
                while (i-- > 0) {
                    if (target[i] !== source[i])
                        return false;
                }
            }
            else {
                while (i-- > 0) {
                    if (indexOf.call(source, target[i]) === -1)
                        return false;
                }
            }
            return true;
        }
        Arrays._contains = _contains;
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.r_number = /^[+-]?\d+$/;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DOM;
    (function (DOM) {
        var doc = document;
        function contains(parent, target) {
            var p;
            while (p = target.parentNode) {
                if (parent === p)
                    return true;
            }
            return false;
        }
        DOM.contains = contains;
        function closest(target, handler, limit) {
            if (limit === void 0) { limit = null; }
            var index = 0;
            do {
                if (handler(target, index++))
                    return target;
            } while ((target = target.parentElement) && target !== limit);
            return target;
        }
        DOM.closest = closest;
        function offset(e, parent, extend) {
            if (parent === void 0) { parent = document.body; }
            if (extend === void 0) { extend = false; }
            var l = 0, t = 0, target = e;
            do {
                t += target.offsetTop - target.scrollTop;
                l += target.offsetLeft - target.scrollLeft;
            } while ((target = target.offsetParent) && target !== parent);
            var result = { left: l, top: t };
            if (extend === true) {
                var w = e.offsetWidth, h = e.offsetHeight;
                result['width'] = w;
                result['height'] = h;
                result['right'] = w + l;
                result['bottom'] = t + h;
            }
            return result;
        }
        DOM.offset = offset;
        function isAssignableFrom(target, parent) {
            do {
                if (target === parent)
                    return true;
            } while (target = target.parentElement);
            return false;
        }
        DOM.isAssignableFrom = isAssignableFrom;
        function selector(selector, parent) {
            if (parent === void 0) { parent = document; }
            return toArray(parent.querySelectorAll(selector));
        }
        DOM.selector = selector;
        // NodeList등을 array로!!
        function toArray(elements, result) {
            if (result === void 0) { result = []; }
            var len = elements['length'];
            if (typeof len === 'number') {
                for (var i = 0; i < len; i++) {
                    result.push(elements[i]);
                }
            }
            else
                result.push(elements);
            return result;
        }
        DOM.toArray = toArray;
        // obj는 인터폴레이터용
        function stringToDOM(str, obj) {
            var v, div = document.createElement('div');
            if (obj) {
                str = str.replace(/{{(.+?)}}/g, function (_, p) {
                    if ((v = obj[p]) != null) {
                        if (typeof v === 'function')
                            return v.call(obj);
                        return v;
                    }
                    return '';
                });
            }
            div.innerHTML = str;
            return toArray(div.children);
        }
        DOM.stringToDOM = stringToDOM;
        function hasClass(element, name) {
            var className = element.className.split(c_r), names = Array.isArray(name) ? name : [name];
            return names.every(function (v) { return className.indexOf(v) !== -1; });
        }
        DOM.hasClass = hasClass;
        /*
         *  isAdd가 null이면 toggleClass로 작동한다.
         */
        var c_r = /\s+/, uuid = 1;
        /*
         *  2018-01-20
         *  원래는 <div> 하나의 객체를 만들어서 재활용하는 형태로 사용했었다.
         *  하지만 그렇게 할 경우 ie에서 버그가 생긴다.
         */
        DOM.createHTML = (function () {
            var r = /^<([^\s>]+)/i;
            function get(parent, html, tag) {
                var index;
                switch (tag) {
                    case 'option':
                        index = 2;
                        parent.innerHTML = '<select>' + html + '</select>';
                        break;
                    case 'thead':
                    case 'tbody':
                    case 'tfoot':
                    case 'colgroup':
                    case 'caption':
                        index = 2;
                        parent.innerHTML = '<table>' + html + '</table>';
                        break;
                    case 'col':
                        index = 3;
                        parent.innerHTML = '<table><colgroup>' + html + '</colgroup></table>';
                        break;
                    case 'tr':
                        index = 3;
                        parent.innerHTML = '<table><tbody>' + html + '</tbody></table>';
                        break;
                    case 'td':
                    case 'th':
                        index = 4;
                        parent.innerHTML = '<table><tbody><tr>' + html + '</tr></tbody></table>';
                        break;
                    default:
                        parent.innerHTML = html;
                        return parent.firstElementChild;
                }
                while (index-- > 0)
                    parent = parent.firstElementChild;
                return parent;
            }
            return function (html, safe) {
                if (safe === void 0) { safe = false; }
                var div = document.createElement('div');
                if (safe) {
                    div.innerHTML = html;
                    var c = div.firstElementChild;
                    div.removeChild(c);
                    return c;
                }
                html = html.trim();
                return get(div, html, r.exec(html)[1]);
            };
        })();
        function className(element, value, isAdd) {
            if (element == null)
                return element;
            var className = element.className.trim(), array = className ? className.split(c_r) : [], result;
            if (typeof value === 'function') {
                result = value.call(element, array, element);
            }
            else {
                var values = Array.isArray(value) ? value : [value];
                // ① ['a', 'u']  ==> ['!a', 'b']  ====>  ['u', 'b'];
                if (isAdd == null)
                    result = __toggleClass(array, values);
                else if (isAdd === true)
                    result = __addClass(array, values);
                else
                    result = __removeClass(array, values);
            }
            element.className = result.join(' ');
            return element;
        }
        DOM.className = className;
        function __addClass(array, target) {
            var i = 0, l = target.length;
            for (; i < l; i++) {
                array.indexOf(target[i]) === -1 && array.push(target[i]);
            }
            return array;
        }
        function __removeClass(array, target) {
            var i = 0, l = array.length, result = [], pos = 0;
            for (; i < l; i++) {
                target.indexOf(array[i]) === -1 && (result[pos++] = array[i]);
            }
            return result;
        }
        function __toggleClass(array, values) {
            var l = values.length, i = 0, pos = -1, result = [], v, removal;
            for (; i < l; i++) {
                if (removal = ((v = values[i])[0] === '!')) {
                    if ((pos = array.indexOf(v.slice(1))) !== -1)
                        array.splice(pos, 1);
                }
                else {
                    if ((pos = array.indexOf(v)) === -1)
                        result.push(v);
                }
            }
            return array.concat(result);
        }
        function eachAttrs(ele, handler) {
            var attributes = ele.attributes, length = ele.attributes.length;
            while (length-- > 0)
                if (handler.call(ele, attributes[length].name, attributes[length].value) === false)
                    return;
        }
        DOM.eachAttrs = eachAttrs;
        DOM.attrMap = (function (r_data, r_up, fn) {
            var rename = function (s) { return s.replace(r_data, '').replace(r_up, fn); };
            return function (element) {
                var attributes = element.attributes, length = attributes.length, attr, result = {};
                while (length-- > 0) {
                    attr = attributes[length];
                    result[rename(attr.name)] = attr.value;
                }
                return result;
            };
        })(/^data-/, /-([^-])/g, function (_, i) { return i.toUpperCase(); });
        function _classList(ele, values, isAdd) {
            if (isAdd === void 0) { isAdd = true; }
            var classList = ele.classList;
            if (typeof values === 'string') {
                isAdd ? classList.add(values) : classList.remove(values);
            }
            else {
                var l = values.length;
                while (l-- > 0)
                    isAdd ? classList.add(values[l]) : classList.remove(values[l]);
                return ele;
            }
        }
        DOM._classList = _classList;
    })(DOM = exports.DOM || (exports.DOM = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(13), __webpack_require__(4), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, Mapping_1, DOM_1, Calendar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = DOM_1.DOM.className;
    var directive = {
        datetime: function (ele, v) {
            ele.textContent = Calendar_1.Calendar.format(v.datetime, 'yyyy-MM-dd(E) HH:mm');
        },
        name: function (ele, v) {
            var img = v.img;
            if (img) {
                ele.href = '/workdata/' + v.path + img.getSaveName();
                ele.textContent = img.getOrigName();
            }
            else {
                ele.textContent = '';
            }
        },
        render: function (ele, v) {
            var img = v.img;
            if (img) {
                ele.style.backgroundImage = 'url("/workdata/' + v.path + img.getSaveName() + '")';
            }
            else {
                ele.style.backgroundImage = '';
            }
        }
    };
    var Screen = /** @class */ (function (_super) {
        __extends(Screen, _super);
        function Screen(element, path) {
            var _this = _super.call(this) || this;
            _this.element = element;
            _this.path = path;
            _this.index = 0;
            _this.directive = directive;
            _this.data = _this; // 자신을 data로 사용한다.
            var closeBtn = element.querySelector('.screen-nav-close');
            closeBtn.addEventListener('click', function () { return _this.off(); });
            _this.wheelEvent = new events_1.EventsGroup()
                .register(document, 'mousewheel', function (e) {
                var total = _this.total, move = _this.index + (e['wheelDelta'] < 0 ? 1 : -1);
                if (move > -1 && move < total) {
                    _this.render(move);
                }
                e.preventDefault();
            }).off();
            return _this;
        }
        Screen.prototype.render = function (index) {
            if (index === void 0) { index = this.index; }
            var _a = this, draft = _a.item.draft, element = _a.element, l = draft.length;
            // 파일이 없을때
            if (!l) {
                this.img = null;
                this.index = -1;
                this.current = this.total = 0;
                className(element, 'has-image', false);
            }
            // 파일이 있을때
            else {
                if (index < 0)
                    index = 0;
                if (!(index < l))
                    index = l - 1;
                this.index = index;
                this.img = draft[index];
                this.current = index + 1;
                this.total = l;
                className(element, 'has-image', true);
            }
            _super.prototype.$render.call(this, element);
            return this;
        };
        Screen.prototype.on = function (item, mapper) {
            this.mapper = mapper;
            this.item = item;
            this.element.classList.add('on');
            this.wheelEvent.on();
            return this.render(0);
        };
        Screen.prototype.off = function () {
            this.wheelEvent.off();
            this.element.classList.remove('on');
            return this;
        };
        return Screen;
    }(Mapping_1.Mapping));
    exports.Screen = Screen;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-02-28.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(2), __webpack_require__(0), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, NameMap_1, Arrays_1, access_1, __returnTrue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Events = /** @class */ (function () {
        function Events(target, type, handler) {
            this.target = target;
            this.type = type;
            this.handler = handler;
            this.isActive = false;
            this.on();
        }
        Events.prototype.setTarget = function (t) {
            var _a = this, target = _a.target, isActive = _a.isActive;
            if (t === target)
                return this;
            if (isActive)
                this.off();
            this.target = t;
            if (isActive)
                this.on();
            return this;
        };
        Events.prototype.on = function () {
            if (!this.isActive) {
                this.target.addEventListener(this.type, this.handler);
                this.isActive = true;
            }
            return this;
        };
        Events.prototype.off = function () {
            if (this.isActive) {
                this.target.removeEventListener(this.type, this.handler);
                this.isActive = false;
            }
            return this;
        };
        return Events;
    }());
    exports.Events = Events;
    var EventsGroup = /** @class */ (function () {
        function EventsGroup() {
            this.isActive = true;
            this.map = new NameMap_1.NameMap();
        }
        EventsGroup.prototype.register = function (element, type, handler) {
            if (typeof type === 'string') {
                var e = new Events(element, type.split(/\./)[0], handler);
                if (!this.isActive)
                    e.off();
                this.map.add(type, e);
            }
            else {
                if (!this.isActive)
                    element.off();
                this.map.add(element.type, element);
            }
            return this;
        };
        EventsGroup.prototype.on = function (n) {
            if (!this.isActive) {
                this.map.get(n).forEach(function (v) { return v.on(); });
                this.isActive = true;
            }
            return this;
        };
        EventsGroup.prototype.off = function (n) {
            if (this.isActive) {
                this.map.get(n).forEach(function (v) { return v.off(); });
                this.isActive = false;
            }
            return this;
        };
        return EventsGroup;
    }());
    exports.EventsGroup = EventsGroup;
    var TargetEvent = /** @class */ (function () {
        function TargetEvent() {
            this.isActive = false;
            this.events = [];
        }
        TargetEvent.prototype.register = function (type, handler) {
            this.events.push({ type: type, handler: handler });
            return this;
        };
        TargetEvent.prototype.on = function (own) {
            var target = this.target;
            if (target) {
                if (target === own)
                    return this;
                this.off();
            }
            this.events.forEach(function (v) { return own.addEventListener(v.type, v.handler); });
            this.target = own;
            this.isActive = true;
            return this;
        };
        TargetEvent.prototype.off = function () {
            var target = this.target;
            if (target) {
                this.events.forEach(function (v) { return target.removeEventListener(v.type, v.handler); });
                this.isActive = false;
                this.target = null;
            }
            return this;
        };
        return TargetEvent;
    }());
    exports.TargetEvent = TargetEvent;
    (function (Events) {
        var primitive = access_1.Access.primitive;
        var _makeArray = Arrays_1.Arrays._makeArray;
        function noop(e) {
        }
        function closest(target, selector, ele) {
            var list = target.querySelectorAll(selector), l = list.length;
            while (l-- > 0)
                if (list[l]['contains'](ele))
                    return list[l];
            return null;
        }
        function mine(target, type, handler) {
            return new Events(target, type, function (e) {
                if (e.target === target)
                    return handler.call(this, e);
            });
        }
        Events.mine = mine;
        function bind(target, type, selector, handler) {
            if (handler)
                return new Events(target, type, function (e) {
                    var t = closest(target, selector, e.target);
                    if (t)
                        return handler.call(target, e, t);
                });
            else
                return new Events(target, type, selector);
        }
        Events.bind = bind;
        function map(target, map) {
            var group = new EventsGroup(), p;
            for (p in map)
                typeof map[p] === 'function' && group.register(target, p, map[p].bind(map));
            return group;
        }
        Events.map = map;
        function keydown(ele, handler) {
            var key;
            return new EventsGroup()
                .register(ele, 'keyup', function () { return key = null; })
                .register(ele, 'keypress', function (e) {
                var keyCode = e.keyCode;
                if (keyCode !== key) {
                    key = keyCode;
                    handler.call(ele, e);
                }
            });
        }
        Events.keydown = keydown;
        // noDuplicationd : 같은 문자열 입력은 무시
        function acceptKeys(target, handler, noDuplication) {
            if (noDuplication === void 0) { noDuplication = true; }
            var key = null;
            return new Events(target, 'keyup', function (e) {
                var value = target.value;
                if (!noDuplication || value !== key) {
                    key = value;
                    handler(value, e);
                }
            });
        }
        Events.acceptKeys = acceptKeys;
        /*
         *  키 입력에 따라 핸들러 호출
         */
        Events.catchKey = (function () {
            var KeyEvents = /** @class */ (function (_super) {
                __extends(KeyEvents, _super);
                function KeyEvents(element, keys, handler, upHandler) {
                    var _this = _super.call(this, element, 'keyevent', handler) || this;
                    _this.keys = keys;
                    _this.upHandler = upHandler;
                    _this.count = 0;
                    _this.on();
                    return _this;
                }
                KeyEvents.prototype.down = function () {
                    this.handler(this.count++, this.target);
                    return this;
                };
                KeyEvents.prototype.up = function () {
                    this.upHandler(this.count - 1, this.target);
                    this.count = 0;
                    return this;
                };
                KeyEvents.prototype.on = function () {
                    if (keyListener.indexOf(this) === -1) {
                        keyListener.push(this);
                        KEY_LISTEN.on();
                        this.isActive = true;
                    }
                    return this;
                };
                KeyEvents.prototype.off = function () {
                    var i = keyListener.indexOf(this);
                    if (i !== -1) {
                        keyListener.splice(i, 1);
                        keyListener.length || KEY_LISTEN.off();
                        this.isActive = false;
                    }
                    return this;
                };
                return KeyEvents;
            }(Events));
            var keyListener = [], 
            /*
             *  ① document가 키 입력을 다 받는다.
             *  ② 등록된 element위에 마우스가 위치할때, 해당 키 입력에 따라 handler를 호출한다.
             */
            KEY_LISTEN = (function () {
                var keys = [];
                // 키 이벤트를 받는 그룹
                return new EventsGroup()
                    .register(document, 'keydown', function (e) {
                    var keyCode = e.keyCode, hovers = _makeArray(document.querySelectorAll(':hover'));
                    if (keys.indexOf(keyCode) === -1)
                        keys.push(keyCode);
                    keyListener.forEach(function (v) {
                        if (hovers.indexOf(v.target) !== -1 && Arrays_1.Arrays.equals(v.keys, keys))
                            v.down();
                    });
                })
                    .register(document, 'keyup', function (e) {
                    var i = keys.indexOf(e.keyCode);
                    if (i !== -1)
                        keys.splice(i, 1);
                    if (!keys.length) {
                        keyListener.forEach(function (v) { return v.count !== 0 && v.up(); });
                    }
                }).off();
            })();
            // on/off 컨트롤러를 반환한다.
            return function (element, keys, handler, upHandler) {
                if (upHandler === void 0) { upHandler = noop; }
                return new KeyEvents(element, keys, handler, upHandler);
            };
        })();
        // 해당 횟수만큼 이벤트를 리스닝한다.
        function count(element, type, handler, count) {
            if (count === void 0) { count = 1; }
            if (count < 1)
                return;
            var dispatcher = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                count--;
                var rv = handler.apply(element, args);
                count < 1 && element.removeEventListener(type, dispatcher);
                return rv;
            };
            element.addEventListener(type, dispatcher);
        }
        Events.count = count;
        function listener(element, type, handler) {
            return new Events(element, type, handler);
        }
        Events.listener = listener;
        function listenGroup() {
            return new EventsGroup();
        }
        Events.listenGroup = listenGroup;
        function trigger(target, type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            if (typeof target[type] === 'function')
                target[type]();
            else {
                var e_1 = document.createEvent('Events');
                e_1.initEvent(type, bubbles, cancelable);
                // 이미 진행중인 이벤트가 있다면 버블링 후에 동작하도록
                setTimeout(function () { return target.dispatchEvent(e_1); }, 0);
            }
        }
        Events.trigger = trigger;
        function custom(target, type, detail, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(type, bubbles, cancelable, detail);
            setTimeout(function () { return target.dispatchEvent(e); }, 0);
        }
        Events.custom = custom;
        function eventWorks(element, type, handlers, attrName) {
            if (attrName === void 0) { attrName = 'data-handler'; }
            var target, vName = attrName + '-value', isFun = typeof handlers === 'function' ? handlers : null;
            return new Events(element, type, function (e) {
                target = e.target;
                while (target && target !== element) {
                    if (target.hasAttribute(attrName)) {
                        var prop = target.getAttribute(attrName), val = target.getAttribute(vName);
                        if (isFun)
                            return isFun(prop, val, target, e);
                        else if (handlers[prop])
                            handlers[prop](target.getAttribute(vName), target, e);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        }
        Events.eventWorks = eventWorks;
        /*
         *  event가 발생하면 target 엘리먼트부터 상위엘리먼트로 올라가면서
         *  어트리뷰트를 읽어 데이터맵을 만들어준다.
         */
        var r_read_split = /,\s*/;
        function eventProperty(target, obj) {
            var v;
            // target 자체를
            if (v = target.getAttribute('data-element')) {
                obj[v] = target;
            }
            // property 이름
            if ((v = target.getAttribute('data-value')) && v.indexOf(':') !== -1) {
                var array = v.split(r_read_split), l = array.length;
                while (l-- > 0) {
                    var _a = array[l].split(':'), k = _a[0], v_1 = _a[1];
                    obj[k] = primitive(v_1);
                }
            }
            return obj;
        }
        function getObject() {
            return {};
        }
        function dataEvent(element, type, attr, getObj, dispatcher, directive) {
            // arguments : 4
            if (!dispatcher) {
                directive = getObj;
                getObj = getObject;
                dispatcher = __returnTrue_1.__returnTrue;
            }
            // arguments : 5
            else if (!directive) {
                directive = dispatcher;
                dispatcher = __returnTrue_1.__returnTrue;
            }
            return new Events(element, type, function (e) {
                var target = e.target, attrValue = target.getAttribute(attr), dir = directive[target.getAttribute(attr)];
                if (dir) {
                    var obj = getObj(e, attrValue), limit = element, h = dispatcher;
                    obj['event'] = e;
                    while (target && (limit !== target)) {
                        eventProperty(target, obj);
                        if (h(target, obj, attrValue, e) === 'break')
                            break;
                        target = target.parentElement;
                    }
                    dir.call(directive, obj);
                }
            });
        }
        Events.dataEvent = dataEvent;
        function bubbleEvent(element, type, attr, directive) {
            return new Events(element, type, function (e) {
                var target = e.target, prop, handler, obj;
                do {
                    if (!obj) {
                        if (target.hasAttribute(attr)) {
                            prop = target.getAttribute(attr);
                            handler = directive[prop];
                            if (handler)
                                obj = { target: target };
                        }
                    }
                    obj && eventProperty(target, obj);
                    target = target.parentElement;
                } while (target && target !== element);
                if (obj) {
                    directive['*'] && directive['*'](obj, e);
                    handler.call(directive, obj, e);
                }
            });
        }
        Events.bubbleEvent = bubbleEvent;
        /*
         *  click 이벤트에 의한 focus-in focus-out 토글 이벤트
         *
         */
        Events.onFocus = (function () {
            var elements = [], index = 0;
            document.addEventListener('click', function (e) {
                if (!index)
                    return;
                var i, checks = [], target = e.target;
                while (target) {
                    for (i = 0; i < index; i++) {
                        if (elements[i].ele === target)
                            checks[i] = true;
                    }
                    target = target.parentElement;
                }
                // blur
                for (i = 0; i < index; i++) {
                    if (!checks[i])
                        elements[i].handler(false);
                }
                // focus
                for (i = 0; i < index; i++) {
                    if (checks[i])
                        elements[i].handler(true);
                }
            });
            return function (ele, focusHandler, blurHandler) {
                var active = false;
                elements[index++] = {
                    ele: ele,
                    handler: function (matched) {
                        if (matched) {
                            if (!active) {
                                active = true;
                                ele.classList.add('focus-in');
                                focusHandler();
                            }
                        }
                        else {
                            if (active) {
                                active = false;
                                ele.classList.remove('focus-in');
                                blurHandler();
                            }
                        }
                    }
                };
            };
        })();
        function simpleTrigger(target, type, bubbles, cancelable, data) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            var e = document.createEvent('Event');
            e.initEvent(type, true, true);
            e['data'] = data;
            return target.dispatchEvent(e);
        }
        Events.simpleTrigger = simpleTrigger;
    })(Events = exports.Events || (exports.Events = {}));
    exports.Events = Events;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Arrays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NameMap = /** @class */ (function () {
        function NameMap() {
            this.map = {};
            this.datas = []; // 중복방지를 위한 리스트
        }
        NameMap.prototype.get = function (name) {
            if (typeof name !== 'string')
                return this.datas;
            var map = this.map, _a = name.split(/\./), key = _a[0], args = _a.slice(1), list = map[key];
            if (!list)
                return [];
            return list.filter(function (v) { return Arrays_1.Arrays.startWith(args, v.names); }).map(function (v) { return v.data; });
        };
        NameMap.prototype.add = function (name, data) {
            if (this.datas.indexOf(data) === -1) {
                var map = this.map, _a = name.split(/\./), key = _a[0], args = _a.slice(1);
                (map[key] || (map[key] = [])).push({ names: args, data: data });
                this.datas.push(data);
            }
            return this;
        };
        NameMap.prototype.remove = function (name) {
            var _a = this, map = _a.map, datas = _a.datas, _b = name.split(/\./), key = _b[0], args = _b.slice(1), list = map[key];
            if (list) {
                map[key] = list.filter(function (v) {
                    if (Arrays_1.Arrays.startWith(args, v.names)) {
                        datas.splice(datas.indexOf(v.data), 1);
                        return false;
                    }
                    return true;
                });
            }
            return this;
        };
        return NameMap;
    }());
    exports.NameMap = NameMap;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function __returnTrue(a) {
        return true;
    }
    exports.__returnTrue = __returnTrue;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(12), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, access_1, _indexOf_1, Formats_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var access = access_1.Access.access;
    var expValParse = Formats_1.Formats.expValParse;
    var directive = Formats_1.Formats.getDirective(), ___createFunction = function (exp) { return new Function('_', '$', 'return _ == null ? null : (' + exp + ');'); }, __createFunction = function (str) {
        var _a = expValParse(str), _prop = _a[0], dir = _a[1], opt = _a[2], prop = _prop[0] !== '_' && _prop[0] !== '$' && _prop.indexOf(' ') === -1 && _prop.indexOf('.') === -1
            ? '_.' + _prop : _prop, func = ___createFunction(prop);
        return function (data, opData, directive) {
            var v = func.call(this, data, opData);
            if (directive[dir])
                v = directive[dir](v, opt);
            return v == null ? '' : v;
        };
    }, 
    // "div>"  or "div class=...>"
    // 앞 <는 빼고 올린다.
    __getTagName = function (html, pos) {
        var i = pos;
        while (html[pos] !== ' ' && html[pos] !== '>')
            pos++;
        return html.substring(i, pos);
    }, __parse = function (str) {
        var l = str.length, pos = _indexOf_1.indexOfChar(str, ':');
        if (pos !== -1) {
            pos--;
            // ① :="..."
            if (str[pos + 2] === '=') {
                if (str[pos + 3] === '"') {
                    var d = str.lastIndexOf('"');
                    return [str.substring(0, pos) + str.substring(d + 1, l), '=',
                        str.substring(pos + 4, d)];
                }
            }
            // ② ::prop
            else if (str[pos + 2] === ':') {
                var i = pos + 3;
                while (str[i] !== '/' && str[i++] !== '>')
                    ;
                return [str.substring(0, pos) + str.substring(i - 1, l), '::',
                    str.substring(pos + 3, i - 1)];
            }
            // ③ :prop>   :prop/>   공백이 없어야 함
            else if (str.indexOf(' ', pos + 2) === -1) {
                var i = pos + 2;
                while (str[i] !== '/' && str[i++] !== '>')
                    ;
                return [str.substring(0, pos) + str.substring(i - 1, l), ':',
                    str.substring(pos + 2, i - 1)];
            }
        }
        return [str, ''];
    };
    function __replaceHTML(html, pos, limit, directive) {
        var index = 0, func = [], fi = 0;
        do {
            // ...{{  사이에 문자열이 있으면
            if (index !== pos) {
                func[fi++] = html.substring(index, pos);
            }
            index = pos = pos + 2; // 커서를 {{ 다음으로 옮긴다.
            pos = html.indexOf('}}', index); // }}를 찾는다
            if (pos === -1) {
                throw new Error('표현식이 잘못되었습니다. 닫는 "}}" 문자열이 없습니다' + '\n' + html);
            }
            func[fi++] = __createFunction(html.substring(index, pos));
            index = pos + 2;
            pos = html.indexOf('{{', index);
        } while (pos !== -1 && index < limit);
        if (index < limit) {
            func[fi++] = html.substring(index, limit);
        }
        return function (obj, opt, dir) {
            if (dir == null)
                dir = directive;
            var i = 0, f = func, l = fi, r = [];
            for (; i < l; i++) {
                r[i] = typeof f[i] === 'string' ? f[i] : f[i].call(this, obj, opt, dir);
            }
            return r.join('');
        };
    }
    function __compile(html, directive, idx, lines, tagStack, index) {
        if (idx === void 0) { idx = { val: 0 }; }
        if (lines === void 0) { lines = []; }
        if (tagStack === void 0) { tagStack = []; }
        if (index === void 0) { index = 0; }
        var pos, i = pos = idx.val, e, r = [], rIdx = 0, tag, handler = function (data, opt) {
            var result = [];
            for (var i_1 = 0; i_1 < rIdx; i_1++)
                result[i_1] = r[i_1].call(this, data, opt, directive);
            return result.join('');
        };
        // ① 태그인 경우
        if (index) {
            var _a = __parse(lines[index - 1]), line = _a[0], type = _a[1], exp_1 = _a[2], _handler_1 = handler;
            switch (type) {
                // ① 함수로 변경  :="expression"
                case '=':
                    var fn_1 = ___createFunction(exp_1);
                    handler = function (data, opt) {
                        var d = fn_1.call(this, data, opt);
                        if (d != null)
                            return _handler_1.call(this, d, opt);
                        return '';
                    };
                    break;
                // ② 루프     ::prop
                case '::':
                    handler = function (data, opt) {
                        var _this = this;
                        var val = access(data, exp_1);
                        if (val != null) {
                            if (Array.isArray(val)) {
                                return val.map(function (v, i) { return _handler_1.call((_this.index = i, _this), v, opt); }).join('');
                            }
                            else {
                                var r_1 = [], i_2 = 0, p = void 0;
                                for (p in val) {
                                    this.index = p;
                                    r_1[i_2++] = _handler_1.call(this, val[p], opt);
                                }
                                return r_1.join('');
                            }
                        }
                        return '';
                    };
                    break;
                // ③ 단순 변수  :prop
                case ':':
                    handler = function (data, opt) {
                        var val = access(data, exp_1);
                        return val != null ? _handler_1.call(this, val, opt) : '';
                    };
            }
            r[rIdx++] = _replaceHTML(line);
        }
        while ((pos = html.indexOf('<', pos)) !== -1) {
            e = _indexOf_1.indexOfChar(html, '>', pos) + 1;
            // ① 여는 태그
            if (html[pos + 1] !== '/') {
                // prefix string
                if (i !== pos) {
                    r[rIdx++] = _replaceHTML(html.substring(i, pos));
                }
                lines[index] = html.substring(pos, e);
                tag = tagStack[index] = __getTagName(html, pos + 1);
                idx.val = e;
                r[rIdx++] = __compile(html, directive, idx, lines, tagStack, index + 1);
                e = idx.val;
            }
            // ② 닫는 태그
            else {
                tag = html.substring(pos + 2, e - 1);
                index--;
                // 현재 태그의 끝
                if (tagStack[index] === tag) {
                    r[rIdx++] = _replaceHTML(html.substring(i, e));
                    idx.val = e;
                }
                else {
                    idx.val = i;
                }
                return handler;
            }
            i = pos = e;
        }
        /*
         *   suffix string
         *   남은 문자열 : pos는 -1이 나올 수 있으므로 저장된 i를 쓴다
         *   여기는 document(문서 첫 함수스택)만 접근한다.
         */
        if (i < html.length) {
            r[rIdx++] = _replaceHTML(html.substring(i, html.length));
        }
        return handler;
    }
    /*
     *  단순히 문자열을 치환할때 쓴다.
     */
    function _replaceHTML(html, dir) {
        if (dir === void 0) { dir = directive; }
        var pos = html.indexOf('{{');
        if (pos === -1)
            return function () { return html; };
        return __replaceHTML(html, pos, html.length, dir);
    }
    exports._replaceHTML = _replaceHTML;
    function _compile(html, directive, _opt) {
        var fn = __compile(html, directive);
        return function (data, opt) {
            if (!opt)
                opt = _opt;
            return fn.call({}, data, opt);
        };
    }
    exports._compile = _compile;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ });