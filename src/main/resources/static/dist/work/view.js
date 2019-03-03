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
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, access_1, number_1) {
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, number_1) {
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
            var r_boolean = /^true$|^false$/, r_string = /^['"][^"']+['"]$/, r_date = /^\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, r_string_replace = /["']/g;
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
            if (_props == null || _props === '')
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.r_number = /^[+-]?\d+$/;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
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
            return function (html) {
                html = html.trim();
                return get(document.createElement('div'), html, r.exec(html)[1]);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var indexOf = Array.prototype.indexOf;
    function _indexOf(obj, v) {
        var l = obj.length;
        while (l-- > 0)
            if (obj[l] === v)
                return l;
        return -1;
    }
    exports._indexOf = _indexOf;
    function _range(i, l, handler, t) {
        for (; i < l; i++)
            handler(i, t);
        return t;
    }
    exports._range = _range;
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
    exports._move = _move;
    function _makeArray(obj) {
        var r = [], l = obj.length;
        while (l-- > 0)
            r[l] = obj[l];
        return r;
    }
    exports._makeArray = _makeArray;
    function _filter(obj, filter) {
        var r = [], i = 0, l = obj.length, pos = 0;
        for (; i < l; i++)
            if (filter(obj[i], i))
                r[pos++] = obj[i];
        return r;
    }
    exports._filter = _filter;
    function _forEach(obj, h) {
        var i = 0, l = obj.length;
        while (i < l) {
            if (h(obj[i], i++) === false)
                return obj;
        }
        return obj;
    }
    exports._forEach = _forEach;
    function _selector(obj, h) {
        var i = 0, l = obj.length, v;
        while (i < l) {
            if (h(v = obj[i], i++))
                return v;
        }
        return undefined;
    }
    exports._selector = _selector;
    function _forEachReverse(obj, h) {
        var i = obj.length;
        while (i-- > 0) {
            if (h(obj[i], i) === false)
                break;
        }
        return obj;
    }
    exports._forEachReverse = _forEachReverse;
    function _reduce(obj, h, r) {
        var i = 0, l = obj.length;
        while (i < l) {
            r = h(r, obj[i], i++);
        }
        return r;
    }
    exports._reduce = _reduce;
    function _reduceN(obj, h, r) {
        var i = 0, l = obj.length;
        while (i < l) {
            h(r, obj[i], i++);
        }
        return r;
    }
    exports._reduceN = _reduceN;
    function _map(obj, h) {
        var r = [], i = 0, l = obj.length;
        while (i < l) {
            r[i] = h(obj[i], i++);
        }
        return r;
    }
    exports._map = _map;
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
    exports._colMap = _colMap;
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
    exports._colReduce = _colReduce;
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
    exports._inTrue = _inTrue;
    function _inFalse(obj, filter) {
        return _in(obj, filter, false);
    }
    exports._inFalse = _inFalse;
    function _everyTrue(obj, filter) {
        var i = 0, l = obj.length;
        while (i < l) {
            if (filter(obj[i], i++) === false)
                return false;
        }
        return true;
    }
    exports._everyTrue = _everyTrue;
    function _everyFalse(obj, filter) {
        var i = 0, l = obj.length;
        while (i < l) {
            if (filter(obj[i], i++) === true)
                return false;
        }
        return true;
    }
    exports._everyFalse = _everyFalse;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Created by hellofunc on 2017-03-22.
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var class2type = {}, toString = class2type.toString, getProto = Object.getPrototypeOf, hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, ObjectFunctionString = fnToString.call(Object), // function Object() { [native code] }
    objStr = class2type.toString(), // [object Object]
    __onload, __ready = [];
    function $ready(a) {
        if (a) {
            if (__onload)
                a();
            else
                __ready.indexOf(a) === -1 && __ready.push(a);
        }
    }
    exports.$ready = $ready;
    function $$ready() {
        __ready.forEach(function (h) { return h(); });
    }
    (function (onload) {
        __onload = onload;
        if (onload)
            window.setTimeout($$ready);
        else {
            var completed_1 = function () {
                document.removeEventListener("DOMContentLoaded", completed_1);
                window.removeEventListener("load", completed_1);
                __onload = true;
                window.setTimeout($$ready);
            };
            window.addEventListener("load", completed_1);
        }
    })(document.readyState === 'complete');
    exports.ownNames = Object.getOwnPropertyNames;
    function _toString(v) {
        return toString.call(v);
    }
    exports._toString = _toString;
    function __noop(a) {
        return a;
    }
    exports.__noop = __noop;
    function __returnFalse() {
        return false;
    }
    exports.__returnFalse = __returnFalse;
    function __returnTrue() {
        return true;
    }
    exports.__returnTrue = __returnTrue;
    // isPlainOjbect와 다르게 ①Object Map과 ②Class 객체를 골라준다.
    function isObjectType(obj) {
        return toString.call(obj) === objStr;
    }
    exports.isObjectType = isObjectType;
    function isPlainObject(obj) {
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
    exports.isPlainObject = isPlainObject;
    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    exports.isEmptyObject = isEmptyObject;
    function isArrayLike(item) {
        return Array.isArray(item) ||
            (item && typeof item === "object" && typeof (item.length) === "number" && (item.length - 1) in item);
    }
    exports.isArrayLike = isArrayLike;
    var r_fn = /^function\s*([^\s(]+)/;
    function getFunctionName(func) {
        return func.name ? func.name : func.toString().match(r_fn)[1];
    }
    exports.getFunctionName = getFunctionName;
    exports.isObject = function (val) { return toString.call(val) === "[object Object]"; };
    /*
     *  일종의 객체 Decode/Encode
     *  세번째 인자에 해당 프로퍼티를 가공할 함수를 넣어주면, 객체를 복사하면서 값을 처리한다.
     *  이때 함수가 1) 반환값을 가지면, 그 값을 프로퍼티에 입력하고, 2) 반환값이 없으면 그냥 넘어간다.
     *  2)번의 경우는 직접 함수내에서 값 설정을 한다고 가정한다.
     */
    var dummy = {}, converts = {
        number: function (a) { return a ? parseInt(a) : 0; },
    };
    function extend() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var handler = _extend, i = 0, len, temp;
        if (typeof args[0] === 'boolean') {
            if (args[0])
                handler = _deepExtend;
            i = 1;
        }
        temp = args[i++];
        len = args.length;
        for (; i < len; i++) {
            temp = handler(temp, args[i]);
        }
        return temp;
    }
    exports.extend = extend;
    function _extend(dest, source) {
        if (source == null)
            return dest;
        if (isArrayLike(source)) {
            var i = 0, l = source.length;
            for (; i < l; i++) {
                dest[i] = source[i];
            }
        }
        else {
            var p = void 0;
            for (p in source) {
                dest[p] = source[p];
            }
        }
        return dest;
    }
    exports._extend = _extend;
    function _deepExtend(dest, source) {
        if (isArrayLike(source)) {
            var i = 0, l = source.length, d = void 0, s = void 0;
            for (; i < l; i++) {
                s = source[i];
                d = dest[i];
                if (isArrayLike(s))
                    dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
                else if (isPlainObject(s))
                    dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
                else
                    dest[i] = s;
            }
        }
        else {
            var i = void 0, s = void 0, d = void 0;
            for (i in source) {
                s = source[i];
                d = dest[i];
                if (isArrayLike(s))
                    dest[i] = _deepExtend(isArrayLike(d) ? d : [], s);
                else if (isPlainObject(s))
                    dest[i] = _deepExtend(isPlainObject(d) ? d : {}, s);
                else
                    dest[i] = s;
            }
        }
        return dest;
    }
    exports._deepExtend = _deepExtend;
    function $extend(target, source, converts) {
        if (converts === void 0) { converts = dummy; }
        // undefined값이 올때만 패스한다.
        // null이 들어오면 모든 프로퍼티가 null이 된다.
        if (source === void 0)
            return target;
        var p, v, f;
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
                        if (v !== void 0)
                            target[p] = v;
                    }
                    else
                        target[p] = v;
            }
        }
        return target;
    }
    exports.$extend = $extend;
    function __makeArray(dest) {
        if (dest == null)
            return [];
        var l = dest.length, result = [];
        while (l-- > 0)
            result[l] = dest[l];
        return result;
    }
    exports.__makeArray = __makeArray;
    function __map(obj, handler) {
        if (obj == null)
            return obj;
        var r, v, p;
        if (typeof obj.length === 'number') {
            r = [];
            for (var i = 0, l = obj.length; i < l; i++) {
                if ((v = handler.call(obj, obj[i], i, obj)) !== void 0)
                    r.push(v);
            }
        }
        else if (isPlainObject(obj)) {
            r = {};
            for (p in obj) {
                if ((v = handler.call(obj, obj[p], p, obj)) !== void 0)
                    r[p] = v;
            }
        }
        return r || obj;
    }
    exports.__map = __map;
    function __each(obj, handler) {
        if (obj == null)
            return obj;
        var p;
        if (isArrayLike(obj)) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (handler.call(obj, obj[i], i, obj) === false)
                    break;
            }
        }
        else if (isPlainObject(obj)) {
            for (p in obj) {
                if (handler.call(obj, obj[p], p, obj) === false)
                    break;
            }
        }
        return obj;
    }
    exports.__each = __each;
    function __reduce(obj, handler, d) {
        if (obj == null)
            return obj;
        var p;
        if (isArrayLike(obj)) {
            for (var i = 0, l = obj.length; i < l; i++)
                d = handler.call(obj, d, obj[i], i, obj);
        }
        else if (isPlainObject(obj)) {
            for (p in obj)
                d = handler.call(obj, d, obj[p], p, obj);
        }
        return d;
    }
    exports.__reduce = __reduce;
    /*
     *   [1,2,3,4,5];
     *   ::  (1,2)  (2,3)  (3,4)  (4,5)
     */
    function __zipper(array, handler, r) {
        var length = array.length;
        if (length < 2)
            return;
        var i = 0, l = length - 1;
        while (i < l) {
            r = handler(array[i++], array[i], r);
        }
        return r;
    }
    exports.__zipper = __zipper;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Arrays;
    (function (Arrays) {
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
            for (var l = start + size; start < l; start++) {
                array.push(start);
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
        function equals(a, b) {
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            if (a.length != b.length)
                return false;
            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            for (var i = 0, l = a.length; i < l; i++) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        }
        Arrays.equals = equals;
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(9), __webpack_require__(6), __webpack_require__(5), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, NameMap_1, arrays_1, core_1, access_1) {
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
                    var keyCode = e.keyCode, hovers = core_1.__makeArray(document.querySelectorAll(':hover'));
                    if (keys.indexOf(keyCode) === -1)
                        keys.push(keyCode);
                    keyListener.forEach(function (v) {
                        if (hovers.indexOf(v.target) !== -1 && arrays_1.Arrays.equals(v.keys, keys))
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
                dispatcher = core_1.__returnTrue;
            }
            // arguments : 5
            else if (!directive) {
                directive = dispatcher;
                dispatcher = core_1.__returnTrue;
            }
            return new Events(element, type, function (e) {
                var target = e.target, attrValue = target.getAttribute(attr), dir = directive[target.getAttribute(attr)];
                if (dir) {
                    var obj = getObj(e, attrValue), limit = element, h = dispatcher;
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
        function simpleTrigger(target, type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = true; }
            if (cancelable === void 0) { cancelable = true; }
            var e = document.createEvent('Event');
            e.initEvent(type, true, true);
            return target.dispatchEvent(e);
        }
        Events.simpleTrigger = simpleTrigger;
    })(Events = exports.Events || (exports.Events = {}));
    exports.Events = Events;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _func(prop, ele, s, opt, data) {
        var type = typeof opt, list = ele[prop](s), l = list.length;
        if (type === 'number')
            return list[opt];
        var i = l, r = [];
        while (i-- > 0)
            r[i] = list[i];
        if (type === 'function') {
            i++;
            for (; i < l; i++)
                opt.call(ele, r[i], i, data);
            return data;
        }
        return r;
    }
    function getElementById(id) {
        return document.getElementById(id);
    }
    exports.getElementById = getElementById;
    function querySelector(ele, s) {
        return ele.querySelector(s);
    }
    exports.querySelector = querySelector;
    function querySelectorCut(ele, s) {
        var d = ele.querySelector(s);
        if (d)
            d.parentElement.removeChild(d);
        return d;
    }
    exports.querySelectorCut = querySelectorCut;
    function querySelectorAll(ele, s, opt, data) {
        return _func('querySelectorAll', ele, s, opt, data);
    }
    exports.querySelectorAll = querySelectorAll;
    function getElementsByClassName(ele, s, opt, data) {
        return _func('getElementsByClassName', ele, s, opt, data);
    }
    exports.getElementsByClassName = getElementsByClassName;
    function getElementsByTagName(ele, s, opt, data) {
        return _func('getElementsByTagName', ele, s, opt, data);
    }
    exports.getElementsByTagName = getElementsByTagName;
    function getElementsByAttr(target, attrName, c, d) {
        var i = 0, list = target.querySelectorAll('[' + attrName + ']'), l = list.length;
        if (l) {
            if (typeof c === 'function') {
                for (; i < l; i++)
                    c(d, list[i], list[i].getAttribute(attrName), i);
                return d;
            }
            else {
                for (; i < l; i++)
                    c[list[i].getAttribute(attrName)](list[i], target, d);
            }
        }
        return target;
    }
    exports.getElementsByAttr = getElementsByAttr;
    function getElementChilds(ele) {
        var r = [], childNodes = ele.childNodes, l = childNodes.length, i = 0, pos = 0;
        for (; i < l; i++)
            if (childNodes[i].nodeType === 1)
                r[pos++] = childNodes[i];
        return r;
    }
    exports.getElementChilds = getElementChilds;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, arrays_1) {
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
            return list.filter(function (v) { return arrays_1.Arrays.startWith(args, v.names); }).map(function (v) { return v.data; });
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
                    if (arrays_1.Arrays.startWith(args, v.names)) {
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
/* 10 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(1), __webpack_require__(3), __webpack_require__(11), __webpack_require__(0), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, array_1, access_1, dom_1, replaceHTML_1, format_1, _AbstractUtilClass_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var access = access_1.Access.access;
    var expValParse = format_1.Formats.expValParse;
    var number = format_1.Formats.number;
    var datetime = format_1.Formats.datetime;
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
    function render(ele, mapping, data, $val, Mapping) {
        if (ele.hasAttribute('data-ignore'))
            return;
        var $mapping = ele.getAttribute('data-mapping'), attrVal;
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
                directive[filter] && directive[filter].call(Mapping, ele, v, primitive);
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
                array_1._forEach($val, function (v, p) {
                    var c = temple_1(v), prop = $$mapping(mapping, p);
                    render(c, prop, data, v, Mapping);
                    c.setAttribute('data-mapping', prop);
                    fragment_1.appendChild(c);
                });
            }
            // ② 단일 객체
            else {
                var c = temple_1(ele);
                render(c, mapping, data, $val, Mapping);
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
                array_1._forEach($val, function (v, p) { return htmls_1[pos_1++] = html_1(v); });
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
            render(clone, mapping, data, $val, Mapping);
            noRender || ele.setAttribute('data-ignore', 'true');
            ele.parentElement.replaceChild(clone, ele);
        }
        else {
            var i = 0, childs = ele.children, l = childs.length;
            for (; i < l; i++) {
                if (childs[i].nodeType === 1)
                    render(childs[i], mapping, data, $val, Mapping);
            }
        }
    }
    ;
    var Mapping = /** @class */ (function (_super) {
        __extends(Mapping, _super);
        function Mapping() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.html = {};
            _this.directive = defaultDirective();
            _this.template = {};
            return _this;
        }
        Mapping.prototype.setData = function (data) {
            this.data = data;
            return this;
        };
        Mapping.prototype.addHTML = function (target) {
            var html = this.html;
            array_1._forEach(target.querySelectorAll('[data-html]'), function (e) {
                html[e.getAttribute('data-html')] = replaceHTML_1._replaceHTML(e.innerText);
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
            render(ele, null, this.data, data, this);
            return ele;
        };
        Mapping.prototype.$follow = function (name) {
            var _this = this;
            array_1._forEach(document.querySelectorAll('[data-follow]'), function (e) {
                if (e.getAttribute('data-follow').indexOf(name) !== -1) {
                    _this.$render(e);
                }
            });
            return this;
        };
        return Mapping;
    }(_AbstractUtilClass_1.AbstractUtilClass));
    exports.Mapping = Mapping;
    (function (Mapping) {
        var createHTML = dom_1.DOM.createHTML;
        function createTemplate(obj, target) {
            var name = target.getAttribute('data-template'), html = createHTML(target.innerText);
            obj[name] = function () { return html.cloneNode(true); };
            return obj;
        }
        function createTemplates(target) {
            var $templates = {};
            if (target.hasAttribute('data-template'))
                return createTemplate($templates, target);
            array_1._forEach(target.querySelectorAll('[data-template]'), function (e) {
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, format_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var expValParse = format_1.Formats.expValParse;
    var dummy = [null, null], dum = {}, directive = format_1.Formats.getDirective();
    // [create] ==> func(data, directive)
    function createExp(str) {
        var _a = expValParse(str), _prop = _a[0], dir = _a[1], opt = _a[2], prop = (_prop[0] === '_' || _prop[0] === '$') ? _prop : '_.' + _prop, func = new Function('_', '$', 'return _ == null ? null : (' + prop + ');');
        return function (data, directive, opData) {
            var v = func(data, opData);
            if (directive[dir])
                v = directive[dir](v, opt);
            return v == null ? '' : v;
        };
    }
    /*
     *  단순히 문자열을 치환할때 쓴다.
     */
    function _replaceHTML(html) {
        var index = 0, pos = 0, limit = html.length, func = [], fi = 0;
        while (index < limit) {
            pos = html.indexOf('{{', index);
            // {{를 찾았을때
            if (pos !== -1) {
                // ...{{  사이에 문자열이 있으면
                if (index !== pos) {
                    func[fi++] = html.substring(index, pos);
                }
                index = pos = pos + 2; // 커서를 {{ 다음으로 옮긴다.
                pos = html.indexOf('}}', index); // }}를 찾는다
                if (pos === -1) {
                    throw new Error('표현식이 잘못되었습니다. 닫는 "}}" 문자열이 없습니다');
                }
                func[fi++] = createExp(html.substring(index, pos));
                index = pos + 2;
            }
            // {{를 못 찾았다면 이제 끝
            else {
                func[fi++] = html.substring(index, limit);
                index = limit;
            }
        }
        return function (obj, dir, opt) {
            if (dir == null)
                dir = directive;
            var i = 0, f = func, l = fi, r = [];
            for (; i < l; i++) {
                r[i] = typeof f[i] === 'string' ? f[i] : f[i](obj, dir, opt);
            }
            return r.join('');
        };
    }
    exports._replaceHTML = _replaceHTML;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbstractUtilClass = /** @class */ (function () {
        function AbstractUtilClass() {
        }
        AbstractUtilClass.prototype.$$preProcess = function (ele, directive) {
            var list = ele.querySelectorAll('[data-pre-process]'), l = list.length, i = 0, u, e;
            for (; i < l; i++) {
                e = list[i];
                if ((u = directive[e.getAttribute('data-pre-process')])) {
                    u.call(directive, e, this, ele);
                }
            }
            return this;
        };
        return AbstractUtilClass;
    }());
    exports.AbstractUtilClass = AbstractUtilClass;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function $get(url) {
        return new Promise(function (resolve, error) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200)
                        resolve(JSON.parse(xhr.responseText));
                    else
                        error(xhr);
                }
            };
            xhr.open('GET', url, true);
            xhr.send(null);
        });
    }
    exports.$get = $get;
    function $post(url, data) {
        return new Promise(function (resolve, error) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200)
                        resolve(xhr.responseText && JSON.parse(xhr.responseText));
                    else
                        error(xhr);
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        });
    }
    exports.$post = $post;
    function $delete(url) {
        return new Promise(function (resolve, error) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200)
                        resolve();
                    else
                        error(xhr);
                }
            };
            xhr.open('DELETE', url, true);
            xhr.send(null);
        });
    }
    exports.$delete = $delete;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, format_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var date = format_1.Formats.date;
    var datetime = format_1.Formats.datetime;
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function __noop(a) {
    }
    exports.__noop = __noop;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(18), __webpack_require__(19), __webpack_require__(14), __webpack_require__(1), __webpack_require__(15), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, number_1, remap_1, inputs_1, calendar_1, access_1, _noop_1, format_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var date = format_1.Formats.date;
    var forEach = Array.prototype.forEach, dummy = {}, r_date = /\d{4}-\d{1,2}-\d{1,2}/, 
    /*
     *  ① type.name
     *  ② type
     */
    DATA_CONVERT = function (p, value) {
        switch (p) {
            case 'boolean':
                return value === 'true' ? true : false;
            case 'number':
                return number_1.r_number.test(value) ? parseInt(value) : 0;
            case 'date':
                if (!r_date.test(value))
                    return null;
                var _a = value.split('-'), y = _a[0], m = _a[1], d = _a[2];
                return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            default:
                return value;
        }
    }, 
    /*
     *
     *  <input> 엘리먼트에서 값을 읽으면서 형변환을 시켜준다.
     *
     *  input에서 null이 나올리 없으므로
     *  null 반환시 최종 결과객체에 제외된다.
     */
    DEFAULT_GETTER = remap_1._remap({
        file: function (input) {
            if (input.value) {
                if (input.files)
                    return input.files;
                else
                    input.value;
            }
            return null;
        },
        'select-multiple': function (select) {
            var i = 0, length = select.length, array = [];
            for (; i < length; i++) {
                if (select[i].checked)
                    array.push(select[i]);
            }
            return array.length ? array : null;
        },
        date: function (date) {
            var value = date.value.trim();
            console.log(value, date);
            if (!value && date.hasAttribute('data-default')) {
                value = date.getAttribute('data-default');
                if (value === 'now')
                    return new Date();
            }
            if (r_date.test(value))
                return new Date(value);
            return null;
        },
        select: function (select) {
            var selectedIndex = select.selectedIndex;
            if (selectedIndex !== -1)
                return select[selectedIndex].value;
            return null;
        },
        'select-one': 'select',
        radio: function (input) {
            if (input.checked)
                return input.value;
            return null;
        },
        checkbox: function (input) {
            if (input.checked) {
                return input.hasAttribute('data-value') ?
                    input.getAttribute('data-value') :
                    input.value;
            }
            else {
                if (input.hasAttribute('data-null')) {
                    return DATA_CONVERT(input.getAttribute('data-type'), input.getAttribute('data-null'));
                }
            }
            return null;
        },
        number: function (input) {
            var value = input.value;
            if (number_1.r_number.test(value))
                return parseInt(value);
            return 0;
        },
        text: function (input) {
            return DATA_CONVERT(input.getAttribute('data-type'), input.value);
        },
        hidden: function (input) {
            var value = input.value;
            if (input.hasAttribute('identity') && !value)
                return null;
            return DATA_CONVERT(input.getAttribute('data-type'), value);
        },
        textarea: function (input) {
            return input.value;
        }
    }), 
    // <input>값을 셋팅한다.
    DEFAULT_SETTER = remap_1._remap({
        number: function (input, val) {
            if (typeof val === "number")
                val = val.toString();
            else if (val == null || !number_1.r_number.test(val))
                val = '0';
            input.value = val;
        },
        // null값이 들어올 수 있다.
        date: function (input, val) {
            if (val == null)
                input.value = '';
            else {
                if (val instanceof Date)
                    input.value = date(val);
                else
                    input.value = val;
            }
        },
        radio: function (input, val) {
            if (val == null)
                input.checked = input.hasAttribute('checked');
            else {
                var value = input.getAttribute('value');
                if (Array.isArray(val))
                    input.checked = val.indexOf(value) !== -1;
                else
                    input.checked = value == val;
            }
        },
        checkbox: 'radio',
        text: function (input, value) {
            switch (input.getAttribute('data-type')) {
                case 'date':
                    if (value instanceof Date)
                        return input.value = calendar_1.Calendar.isodate(value);
                default:
                    input.value = value || '';
            }
        }
    });
    // 같은 값이 있을때만 배열로
    function $serialize(input, obj, name) {
        if (name === void 0) { name = input.name; }
        var type = input.getAttribute('data-type') || input.type, v, vv;
        if (DEFAULT_GETTER[type]) {
            v = DEFAULT_GETTER[type](input);
            if (v !== null) {
                if (vv = obj[name]) {
                    if (!Array.isArray(vv))
                        obj[name] = vv = [vv];
                    vv.push(v);
                }
                else
                    obj[name] = v;
            }
        }
    }
    // ************************ ▼ Forms Constructor ▼ ************************ //
    function formEach(target, form) {
        if (target.nodeType === 1) {
            if (target.classList.contains('form-group'))
                groupEach(target, form.createGroups(target));
            else if (target.hasAttribute('name')) {
                form.put(target);
            }
            else {
                var children = target.children, length_1 = target.children.length;
                while (length_1-- > 0) {
                    formEach(children[length_1], form);
                }
            }
        }
        return form;
    }
    function groupEach(target, formGroup) {
        if (target.nodeType === 1) {
            var children = target.children, length_2 = target.children.length, i = 0;
            for (; i < length_2; i++) {
                target = children[i];
                if (target.hasAttribute('name') && inputs_1.r_inputs.test(target.tagName)) {
                    formGroup.add(target);
                }
                else
                    groupEach(target, formGroup);
            }
        }
    }
    // ************************ ▲ Forms Constructor ▲ ************************ //
    var Forms = /** @class */ (function () {
        function Forms(element) {
            this.element = element;
            this.groups = [];
            this.defaultHandler = dummy;
            formEach(element, this);
        }
        Forms.prototype.setHandlers = function (handlers) {
            this.defaultHandler = handlers;
            return this;
        };
        Forms.prototype.createGroups = function (target) {
            var g = new FormGroups(target);
            this.groups.push(g);
            return g;
        };
        Forms.prototype.put = function (input) {
            var own = this.own;
            if (!own)
                own = this.own = this.createGroups(this.element);
            own.add(input);
            return this;
        };
        Forms.prototype.values = function (handlers) {
            if (handlers === void 0) { handlers = this.defaultHandler; }
            var result = {};
            this.each(function (p, inputs) {
                if (handlers[p])
                    result[p] = handlers[p].get(inputs);
                else
                    inputs.forEach(function (input) { return $serialize(input, result, p); });
            });
            return result;
        };
        Forms.prototype.reset = function (obj, handlers) {
            if (obj === void 0) { obj = dummy; }
            if (handlers === void 0) { handlers = this.defaultHandler; }
            var v;
            this.each(function (p, inputs) {
                v = obj[p];
                if (handlers[p])
                    handlers[p].set(inputs, v);
                else
                    inputs.forEach(function (input) {
                        Forms.set(input, v);
                    });
            });
            return this;
        };
        Forms.prototype.each = function (handler, obj) {
            var p, inputs;
            this.groups.forEach(function (g) {
                inputs = g.inputs;
                for (p in inputs)
                    obj = handler(p, inputs[p], obj);
            });
            return obj;
        };
        Forms.prototype.valid = function (handler) {
            return Forms.$valid(this, handler);
        };
        Forms.prototype.detach = function () {
            var element = this.element, parent = element.parentElement;
            if (parent)
                parent.removeChild(element);
            return element;
        };
        return Forms;
    }());
    exports.Forms = Forms;
    var FormGroups = /** @class */ (function () {
        function FormGroups(element) {
            this.element = element;
            this.inputs = {};
        }
        FormGroups.prototype.add = function (input) {
            var inputs = this.inputs, name = input.name;
            if (name) {
                (inputs[name] || (inputs[name] = [])).push(input);
            }
            return this;
        };
        return FormGroups;
    }());
    exports.FormGroups = FormGroups;
    (function (Forms) {
        var access = access_1.Access.access;
        var 
        /*
         *  ① attr.type.name
         *  ② attr.type
         *  ③ attr
         */
        input_valid = remap_1._remap({
            // 두번째 인자값은 해당 어트리뷰트의 값
            required: function (target) {
                return !!target.value;
            },
            'required.select-multiple': function (target, v) {
                var length = target.length;
                while (length-- > 0)
                    if (target[length].selected)
                        return true;
                return false;
            },
            'required.select': 'required.select-multiple',
            'required.select-one': 'required.select-multiple',
            'pattern.text': function (target, v) {
                try {
                    return new RegExp(v).test(target.value);
                }
                catch (e) {
                    return true;
                }
            },
            'maxlength.text': function (target, v) {
                if (!number_1.r_number.test(v))
                    return true;
                return !(target.value.length > parseInt(v));
            },
            'maxlength.textarea': 'maxlength.text',
            'minlength.text': function (target, v) {
                if (!number_1.r_number.test(v))
                    return true;
                return !(target.value.length < parseInt(v));
            },
            'minlength.textarea': 'minlength.text',
            'max.select': function (target, v) {
                if (!number_1.r_number.test(v))
                    return true;
                var max = parseInt(v), length = target.length, selected = 0;
                while (length-- > 0)
                    target[length].selected && selected++;
                return !(max < selected);
            },
            'max.select-multiple': 'max.select',
            'max.select-one': 'max.select',
            'min.select': function (target, v) {
                if (!number_1.r_number.test(v))
                    return true;
                var min = parseInt(v), length = target.length;
                while (length-- > 0)
                    if (target[length].selected && --min === 0)
                        return true;
                return false;
            },
            'min.select-multiple': 'min.select',
            'min.select-one': 'min.select',
            'min.number': function (target, v) {
            }
        }), group_valid = remap_1._remap({
            min: function (ele, val) {
            },
            max: function (ele, val) {
            }
        }), error_msg = {
            required: '반드시 필요한 항목입니다.'
        };
        var skipProps = 'name type'.split(' ');
        // 각 key를 조합해 검증 핸들러를 찾는다.
        function getValid(attrName, type, name) {
            return input_valid[attrName + '.' + type + '.' + name] ||
                input_valid[attrName + '.' + type] ||
                input_valid[attrName];
        }
        function _group(group, attrName, attrValue) {
            var fn = group_valid[attrName];
            return fn ? fn(group, attrValue) : true;
        }
        function _message(attrName, attrValue, type, name) {
            var msg = error_msg[attrName + '.' + type + '.' + name] ||
                error_msg[attrName + '.' + type] ||
                error_msg[attrName];
            if (msg)
                return msg.replace(/%/g, attrValue);
            return attrName + ' is wrong.' + '(:' + attrValue + ')';
        }
        function $valid(t, handler) {
            if (handler === void 0) { handler = _noop_1.__noop; }
            var form = t instanceof Forms ? t : Forms.createForms(t), element = form.element, result = true, valid, fn;
            form.groups.forEach(function (group) {
                var name, inputs = group.inputs, e = group.element;
                for (name in inputs) {
                    inputs[name].forEach(function (input) {
                        var type = input.type, attributes = input.attributes, l = input.attributes.length, attr;
                        while (l-- > 0) {
                            attr = attributes[l];
                            if (fn = getValid(attr.name, type, name)) {
                                result = (valid = fn(input, attr.value)) ? result : false;
                                handler(valid, input, e, element);
                            }
                        }
                    });
                }
            });
            return result;
        }
        Forms.$valid = $valid;
        function input(i) {
            var type = i.type, name = i.name, attributes = i.attributes, l = i.attributes.length, fn;
            while (l-- > 0) {
                if (fn = getValid(attributes[l].name, type, name)) {
                    if (!fn(i, attributes[l].value))
                        return false;
                }
            }
            return true;
        }
        Forms.input = input;
        function createForms(target) {
            return new Forms(target);
        }
        Forms.createForms = createForms;
        function reset(inputs, obj) {
            if (obj === void 0) { obj = dummy; }
            forEach.call(inputs, function (v) { return set(v, access(obj, v.name)); });
        }
        Forms.reset = reset;
        function set(input, v) {
            var f = DEFAULT_SETTER[input['getAttribute']('data-type') || input['type']];
            if (f) {
                f(input, v);
            }
            else {
                input['value'] = v == null ? '' : v;
            }
            return input;
        }
        Forms.set = set;
        function serialize(form) {
            var length = form.length, input, name, obj = {};
            while (length-- > 0) {
                input = form[length];
                if (!input.disabled && (name = input.name)) {
                    $serialize(input, obj, name);
                }
            }
            return obj;
        }
        Forms.serialize = serialize;
    })(Forms = exports.Forms || (exports.Forms = {}));
    exports.Forms = Forms;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(0), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, core_1, format_1, _ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var datetime = format_1.Formats.datetime;
    var $disassemble = {
        activetime: function (v) {
            if (!v)
                return null;
            return v instanceof Date ? v : new Date(v);
        },
        datetime: function (v) {
            if (!v)
                return null;
            return v instanceof Date ? v : new Date(v);
        },
        updatetime: function (v) {
            if (!v)
                return null;
            return v instanceof Date ? v : new Date(v);
        },
        // list용
        customer: function (v) {
            this.customer = new Customer(v);
        },
        refs: function (v) {
            var _this = this;
            v.forEach(function (a) { return _this.addRef(new WorkFile(a)); });
        },
        print: function (v) {
            var _this = this;
            v.forEach(function (a) { return _this.addPrint(new WorkFile(a)); });
        },
        draft: function (v) {
            var _this = this;
            v.forEach(function (a) { return _this.addDraft(new WorkFile(a)); });
        },
        items: function (v) {
            var _this = this;
            if (v) {
                v.map(function (a) { return new WorkItem(a).setWork(_this); });
            }
        },
        // work용
        // customer에도 같은 이름이 있으므로 이를 구분하는 분기가 있다.
        memo: function (v) {
            var _this = this;
            if (Array.isArray(v))
                this.memo = v.map(function (a) { return new WorkMemo(a).setWork(_this); });
            else
                this.memo = v;
        },
        uuid: function (v) {
            this.uuid = v;
        },
    }, 
    // 객체를 json data로 변경할때
    $assemble = (function () {
        var $$ = {
            activetime: function (v) {
                return datetime(v);
            },
            datetime: function (v) {
                return datetime(v);
            },
            updatetime: function (v) {
                return datetime(v);
            },
            // work객체는 work_id로 바꾼다.
            work: function (v) {
                v && (this['work_id'] = v.id);
            },
            // draft, print는 json 변환에는 제외시킨다.
            print: false,
            draft: false,
            memo: function (v) {
                if (typeof v === 'string')
                    this['memo'] = v;
            }
        };
        return function (data) { return core_1.$extend({}, data, $$); };
    })();
    //********************** Class **********************//
    var Work = /** @class */ (function () {
        function Work(data) {
            this.price = 0;
            this.total = 0;
            this.vat = 0;
            this.file_len = 0;
            this.item_len = 0;
            this.memo_len = 0;
            this.refs = [];
            this.memo = [];
            this.items = [];
            data && core_1.$extend(this, data, $disassemble);
        }
        Work.prototype.addRef = function (v) {
            this.refs.push(v);
            this.file_len = this.refs.length;
            return this;
        };
        Work.prototype.removeRef = function (v) {
            var refs = this.refs;
            refs.splice(refs.indexOf(v), 1);
            this.file_len = refs.length;
            return this;
        };
        Work.prototype.addMemo = function (v) {
            this.memo.push(v);
            this.memo_len = this.memo.length;
            v.setWork(this);
            return this;
        };
        Work.prototype.removeMemo = function (v) {
            var memo = this.memo;
            memo.splice(memo.indexOf(v), 1);
            this.memo_len = memo.length;
        };
        Work.prototype.compute = function () {
            var price = 0, vat = 0, total = 0;
            this.items.forEach(function (item) {
                price += (item.price * item.count);
                vat += item.vat;
                total += item.total;
            });
            this.price = price;
            this.vat = vat;
            this.total = total;
            return this;
        };
        Work.prototype.addItem = function (item) {
            this.item_len = this.items.push(item);
            return this.compute();
        };
        Work.prototype.removeItem = function (item) {
            var items = this.items;
            items.splice(items.indexOf(item), 1);
            this.item_len = items.length;
            return this.compute();
        };
        return Work;
    }());
    exports.Work = Work;
    var WorkMemo = /** @class */ (function () {
        function WorkMemo(data) {
            data && core_1.$extend(this, data, $disassemble);
        }
        WorkMemo.prototype.setWork = function (work) {
            this.work = work;
            return this;
        };
        return WorkMemo;
    }());
    exports.WorkMemo = WorkMemo;
    var WorkItem = /** @class */ (function () {
        /*
         *  draft와 print에 path를 넣어주기 위해서 어쩔 수 없이 work를 생성인자로..
         */
        function WorkItem(data) {
            this.count = 0;
            this.detail = '';
            this.memo = '';
            this.price = 0;
            this.total = 0;
            this.vat = 0;
            this.priority = 0;
            this.draft = [];
            this.print = [];
            data && core_1.$extend(this, data, $disassemble);
        }
        WorkItem.prototype.setWork = function (work) {
            this.work = work;
            work.addItem(this);
            return this;
        };
        WorkItem.prototype.addDraft = function (v) {
            this.draft.push(v);
            return this;
        };
        WorkItem.prototype.removeDraft = function (v) {
            var draft = this.draft;
            draft.splice(draft.indexOf(v), 1);
            return this;
        };
        WorkItem.prototype.addPrint = function (v) {
            // 인쇄파일은 나중에 등록한 파일이 맨 먼저 나오게 한다.
            this.print.unshift(v);
            return this;
        };
        WorkItem.prototype.removePrint = function (v) {
            var print = this.print;
            print.splice(print.indexOf(v), 1);
            return this;
        };
        return WorkItem;
    }());
    exports.WorkItem = WorkItem;
    var Customer = /** @class */ (function () {
        function Customer(data) {
            data && core_1.$extend(this, data, $disassemble);
        }
        Customer.prototype.setId = function (id) {
            this.id = id;
            return this;
        };
        return Customer;
    }());
    exports.Customer = Customer;
    var WorkFile = /** @class */ (function () {
        function WorkFile(data) {
            data && core_1.$extend(this, data, $disassemble);
        }
        WorkFile.prototype.setId = function (id) {
            this.id = id;
            return this;
        };
        WorkFile.prototype.getOrigName = function () {
            return this.original_name + '.' + this.filetype;
        };
        WorkFile.prototype.getSaveName = function () {
            return this.save_name + '.' + this.filetype;
        };
        return WorkFile;
    }());
    exports.WorkFile = WorkFile;
    // ***************************** namespace ***************************** //
    (function (Work) {
        Work.$state = '작업대기 시안검토 시안완료 제작중 입고 납품 완료'.split(' ');
        function createWork(data) {
            return _ajax_1.$post('/work/db/create', data);
        }
        Work.createWork = createWork;
        function updateState(id, state) {
            return _ajax_1.$post('/work/db/update/state/' + id + '/' + state, null);
        }
        Work.updateState = updateState;
        // 2018-0600442 ==> 2018/06/00442
        function toPath(uuid) {
            var _a = uuid.split(/-/), y = _a[0], m = _a[1];
            return y + '/' + m.substring(0, 2) + '/' + m.substring(2) + '/';
        }
        Work.toPath = toPath;
        function stateStr(num) {
            return Work.$state[typeof num === 'number' ? num : num.state];
        }
        Work.stateStr = stateStr;
        // 리스트 로딩
        function list(query) {
            return _ajax_1.$post('/work/list?' + query, null).then(function (e) {
                var contents = e.contents, price = e.price, count = e.count, today = e.today;
                e.contents = contents.map(function (values) {
                    return {
                        work: new Work(values.work),
                        customer: new Customer(values.customer),
                        draft: values.draft.id ? new WorkFile(values.draft) : null
                    };
                });
                e.states = count.map(function (v, i) {
                    return {
                        index: i,
                        name: Work.$state[i],
                        count: v,
                        price: price[i],
                        today: today[i]
                    };
                });
                return e;
            });
        }
        Work.list = list;
        function remove(id) {
            return _ajax_1.$delete('/work/db/remove/' + id);
        }
        Work.remove = remove;
        function update(val, work) {
            return _ajax_1.$post('/work/db/update/' + work.id, val).then(function () { return core_1.$extend(work, val); });
        }
        Work.update = update;
        // 전체 로딩
        function get(workUUID) {
            // 캐시 방시
            return _ajax_1.$get('/work/view?uuid=' + workUUID + '&' + new Date().getTime()).then(function (data) {
                if (data.work) {
                    var work_1 = new Work(data.work);
                    data.items.forEach(function (item) { return work_1.addItem(new WorkItem(item)); });
                    return work_1;
                }
                else
                    return null;
            });
        }
        Work.get = get;
    })(Work = exports.Work || (exports.Work = {}));
    exports.Work = Work;
    (function (Customer) {
        function search(key) {
            return _ajax_1.$get('/work/db/customer/' + key).then(function (v) {
                return v.map(function (val) { return new Customer(val); });
            });
        }
        Customer.search = search;
        function save(data) {
            return _ajax_1.$post('/work/db/customer', data);
        }
        Customer.save = save;
    })(Customer = exports.Customer || (exports.Customer = {}));
    exports.Customer = Customer;
    /*
     * 메모 입출력은 그냥 간단하게 하자
     */
    (function (WorkMemo) {
        function save(work, memo) {
            return _ajax_1.$post('/work/db/memo/' + work.id, $assemble(memo))
                .then(function (id) {
                memo.id = id;
                return memo;
            });
        }
        WorkMemo.save = save;
        function remove(memo, work) {
            return _ajax_1.$delete('/work/db/memo/' + memo.id + '/' + work.id);
        }
        WorkMemo.remove = remove;
    })(WorkMemo = exports.WorkMemo || (exports.WorkMemo = {}));
    exports.WorkMemo = WorkMemo;
    (function (WorkItem) {
        function save(v, workId) {
            return _ajax_1.$post('/work/db/item/' + workId, $assemble(v)).then(function (id) {
                v.id = id;
            });
        }
        WorkItem.save = save;
        function priority(ids) {
            return _ajax_1.$post('/work/db/item/priority', ids).then(function (v) {
                console.log(v);
            });
        }
        WorkItem.priority = priority;
        function remove(v) {
            return _ajax_1.$delete('/work/db/item/' + v.id);
        }
        WorkItem.remove = remove;
    })(WorkItem = exports.WorkItem || (exports.WorkItem = {}));
    exports.WorkItem = WorkItem;
    (function (WorkFile) {
        function $get(id) {
            return new Promise(function (o, x) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/upload/progress' + (id ? '/' + id : ''));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            o(id ? parseInt(xhr.responseText) : xhr.responseText);
                        }
                    }
                };
                xhr.send(null);
            });
        }
        // File Upload Logic
        function $upload(data, handler) {
            // ① 고유 키를 받아온다.
            return $get().then(function (id) {
                var total = 0, // uploading한 총 파일용량
                time = 10, // sending 체크 시간
                xhr = new XMLHttpRequest(), 
                // 서버측 다운로드 경과
                tHandler = function () {
                    $get(id).then(function (d) {
                        if (total !== -1 && total !== d) {
                            handler.sending(d, total);
                            setTimeout(tHandler, time);
                        }
                        else {
                            handler.sending(total, total);
                        }
                    });
                };
                // 서버 send progress
                xhr.upload.onprogress = function (e) {
                    handler.uploading(e.loaded, e.total);
                };
                xhr.upload.onloadend = function (e) {
                    handler.uploading(e.total, e.total);
                    total = e.total;
                    setTimeout(tHandler, time);
                };
                return new Promise(function (o, x) {
                    xhr.open('POST', '/upload/file/' + id);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                total = -1; // 위의 setTimeout 핸들러를 멈추기 위한 값
                                o(id);
                            }
                        }
                    };
                    xhr.send(data);
                });
            });
        }
        function uploadFile(path, file, handler) {
            var formData = new FormData();
            formData.append('path', 'D:/work/' + path);
            formData.append('file', file.data, file.name);
            return $upload(formData, handler).then(function (id) {
                handler.done();
                return id;
            });
        }
        WorkFile.uploadFile = uploadFile;
        function uploadTest(data) {
            var formData = new FormData();
            formData.append('file', data, data['name']);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                }
            };
            xhr.open('POST', '/upload/file/test', true);
            xhr.send(formData);
        }
        WorkFile.uploadTest = uploadTest;
        function saveFile(type, ownId, workFile) {
            return _ajax_1.$post('/work/db/' + type + '/' + ownId, $assemble(workFile))
                .then(function (id) { return workFile.setId(id); });
        }
        WorkFile.saveFile = saveFile;
        function removeFile(type, id) {
            return _ajax_1.$delete('/work/db/' + type + '/' + id);
        }
        WorkFile.removeFile = removeFile;
        function create(file, orig_name, save_name) {
            var i = orig_name.lastIndexOf('.');
            return new WorkFile({
                datetime: new Date(),
                original_name: orig_name.slice(0, i),
                save_name: save_name,
                filetype: orig_name.slice(i + 1),
                size: file.size,
                content_type: file.type
            });
        }
        WorkFile.create = create;
    })(WorkFile = exports.WorkFile || (exports.WorkFile = {}));
    exports.WorkFile = WorkFile;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _remap(obj) {
        var p, v;
        for (p in obj)
            if (typeof (v = obj[p]) === 'string')
                obj[p] = obj[v];
        return obj;
    }
    exports._remap = _remap;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.r_inputs = /select|textarea|input/i;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, _noop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mapperDispatcher(handler) {
        if (handler === void 0) { handler = _noop_1.__noop; }
        return function (t, o, v, e) {
            var p;
            if (!o.mapping && (p = t.getAttribute('data-mapping'))) {
                o.mapping = p;
            }
            handler(t, o, v, e);
            if ((p = t.getAttribute('data-mapper')) != null) {
                o.mapper = t;
                o.name = p;
                if (!o.mapping)
                    o.mapping = '';
                return 'break';
            }
        };
    }
    exports.mapperDispatcher = mapperDispatcher;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 컨테이너 사이즈에 딱 맞추기
    var _rate = function (N, n) { return (N - n) / n; }, _adjust = function (W, H, w, h) {
        var height = h + (_rate(W, w) * h);
        if (height > H)
            return { w: w + (_rate(H, h) * w), h: H };
        return { w: W, h: height };
    };
    exports.__cover = function (W, H, w, h) {
        var height = h + (_rate(W, w) * h);
        if (height < H)
            return { w: w + (_rate(H, h) * w), h: H };
        return { w: W, h: height };
    }, exports.__adjustTo = function (parent, image, forceSize) {
        if (forceSize === void 0) { forceSize = true; }
        var _a;
        var style = image.style, w = (_a = exports.__adjust(parent.offsetWidth, parent.offsetHeight, image.naturalWidth, image.naturalHeight, forceSize), _a.w), h = _a.h, x = _a.x, y = _a.y;
        style.width = w + 'px';
        style.height = h + 'px';
        style.left = x + 'px';
        style.top = y + 'px';
        style.transform = '';
        return image;
    }, 
    // 외부 사이즈(W,H)에 딱 맞추기
    // 마지막 인자가 true면 무조건 외부사이즈에 맞춤. 아니면 본래 사이즈
    exports.__adjust = function (W, H, w, h, forceSize) {
        if (forceSize === void 0) { forceSize = true; }
        var size, pos;
        // 강제 맞춤옵션이거나, 이미지가 대지보다 클 경우
        if (forceSize || W < w || H < h)
            size = _adjust(W, H, w, h);
        else
            size = { w: w, h: h };
        pos = exports.__center(W, H, size.w, size.h);
        return { w: size.w, h: size.h, x: pos.x, y: pos.y };
    }, 
    // from에서 to로 변할때 val의 변환값
    exports.__resize = function (from, to, val) {
        var ratio = (to - from) / from;
        return Math.floor(val + (val * ratio));
    }, 
    // 가로 사이즈에 딱 맞추기
    exports.__adjustWidth = function (W, H, w, h) {
        return { w: W, h: h + Math.round(_rate(W, w) * h) };
    }, 
    // 세로사이즈에 딱 맞추기
    exports.__adjustHeigth = function (W, H, w, h) {
        return { w: w + Math.round(_rate(H, h) * w), h: H };
    }, 
    // 가운데 맞춤
    exports.__center = function (W, H, w, h) {
        return { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2) };
    }, exports.__transform = function (value) {
        if (value && value.indexOf('rotate') !== -1)
            return parseInt(/\d+/.exec(value)[0]);
        else
            return 0;
    };
    /*
     *  ## 단순히 이미지를 (좌 -> 우)로 박스 쌓듯이 쌓는다.
     *
     *  전체 가로사이즈와 분할갯수를 가지고 이미지 위치를 설정한다.
     *  재사용을 위해 마지막 높이값을 반환한다.
     */
    function __puzzle(values, split, //
    outerWidth, // 전체 가로 사이즈
    call, // 콜백함수
    tops // 시작높이
    ) {
        if (tops === void 0) { tops = []; }
        var width = Math.round(outerWidth / split), index = split;
        while (index-- > 0)
            if (tops[index] == null)
                tops[index] = 0;
        values.forEach(function (v, i) {
            var newHeight = exports.__resize(v.width, width, v.height), pos = i % split;
            call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
            tops[pos] = tops[pos] + newHeight; // 높이 보정
        });
        return tops;
    }
    exports.__puzzle = __puzzle;
    /*
     *  ## [튜닝버전] 높이를 봐가면서 쌓기
     */
    function __puzzleTune(values, split, //
    outerWidth, // 전체 가로 사이즈
    call, // 콜백함수
    tops // 시작높이
    ) {
        if (tops === void 0) { tops = []; }
        var width = Math.floor(outerWidth / split), index = split;
        while (index-- > 0)
            if (tops[index] == null)
                tops[index] = 0;
        values.forEach(function (v, i) {
            var newHeight = exports.__resize(v.width, width, v.height), pos = _min(tops);
            call.call(v, v, tops[pos], width * pos, width, newHeight, index++, pos);
            tops[pos] = tops[pos] + newHeight; // 높이 보정
        });
        return tops;
    }
    exports.__puzzleTune = __puzzleTune;
    function _min(array) {
        var result = 0, i = 1, l = array.length, val = array[0];
        for (; i < l; i++) {
            if (array[i] < val) {
                val = array[result = i];
            }
        }
        return result;
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 정방향
    function cEach(children, n) {
        var l = children.length, i = 0, pos = 1;
        for (; i < l; i++) {
            if (children[i].nodeType === 1) {
                if (pos++ === n)
                    return children[i];
            }
        }
        return null;
    }
    // 역방향
    function cEachReverse(children, n) {
        var l = children.length, pos = 1;
        while (l-- > 0) {
            if (children[l].nodeType === 1) {
                if (pos++ === n)
                    return children[l];
            }
        }
        return null;
    }
    // nth-child(?) 찾기
    /*
     *
     *  젓같은 ie에서는 fragment에 children이 없다. 따라서 childNodes로 한다..
     */
    function nthChildren(context, nth) {
        if (nth < 0)
            return cEachReverse(context.childNodes, nth * -1);
        else
            return cEach(context.childNodes, nth === 0 ? 1 : nth);
    }
    exports.nthChildren = nthChildren;
    /*
     *   :0 첫번째 자식
     *   :-1 마지막 자식
     *   :* 모든 자식
     *
     *   =  querySelector
     *   [1] querySelectorAll
     *   "1"  getElementsByClassName
     *   <2> getElementsById
     */
    function lookup(r, index) {
        if (index < 0) {
            var l = r.length;
            index *= -1;
            index = index % l;
            return index === 0 ? r[0] : r[l - index];
        }
        return r[index];
    }
    function select(context, selector) {
        var sChar = selector[0], i = 0, prefix, r, hasIndex = false;
        if (sChar === '=')
            return context.querySelector(selector.slice(2));
        i = selector.indexOf(' ');
        prefix = selector.substring(0, i);
        selector = selector.slice(i + 1);
        i = prefix.length;
        if (i !== 2) {
            hasIndex = true;
            i = parseInt(prefix.substring(1, i - 1));
        }
        switch (sChar) {
            case '[':
                r = context.querySelectorAll(selector);
                return hasIndex ? lookup(r, i) : r;
            case '"':
                r = context.getElementsByClassName(selector);
                return hasIndex ? lookup(r, i) : r;
            case '<':
                r = context.getElementsByTagName(selector);
                return hasIndex ? lookup(r, i) : r;
        }
    }
    exports.select = select;
    function selectAll(element, arg, handler) {
        var args = [], index = 0, i = 0, l = arg.length, str;
        for (; i < l; i++) {
            str = arg[i];
            // (1) 문자열일 경우
            if (typeof str === 'string') {
                // :1 일 경우 앞선 결과를 element 주체로 사용한다.
                if (str[0] === ':') {
                    var i_1 = str.indexOf(' ');
                    args[index++] = select(args[str.substring(1, i_1)], str.slice(i_1 + 1));
                }
                else
                    args[index++] = select(element, str);
            }
            // (2) 함수일 경우, 결과물을 그대로 보내준다..
            else if (typeof str === 'function')
                args[index++] = str(element, args);
            // (2) 문자열이 아닐 경우 그대로 결과값
            else {
                args[index++] = str;
            }
        }
        return handler ? handler.apply(element, args) : args;
    }
    exports.selectAll = selectAll;
    ;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(10), __webpack_require__(0), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Mapping_1, format_1, selector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var datetime = format_1.Formats.datetime;
    var element = selector_1.getElementById('bill'), types = selector_1.getElementsByClassName(element, 'bill', function (e, i, r) {
        element.removeChild(e);
        r[e.id] = e;
    }, {}), hancome = {
        name: '한컴기획',
        address: '경기도 수원시 권선구 산업로156번길 142-10 수원벤처밸리2 A동 B122호 (고색동 1152)',
        biz_con: '서비스',
        biz_num: '124-53-35359',
        biz_type: '광고기획인쇄',
        owner: '고정철',
    }, date = datetime(new Date(), 'yyyy-MM-dd(E) HH:mm'), $mapping = new Mapping_1.Mapping()
        .addTemplate(selector_1.getElementById('bill-template'))
        .addDirective({
        // 공급자, 공급받는자 구분
        check: function (e, v) {
            if (v.biz_num !== '124-53-35359')
                e.classList.add('send');
        },
        // 견적메모가 없을 경우에는 엘리먼트를 없앤다.
        exists: function (e, work) {
            var text = work.text;
            if (!text.trim())
                e.classList.add('hide');
            else
                e.classList.remove('hide');
        },
        now: function (e, work) {
            e.textContent = date;
        },
    });
    element.addEventListener('click', function (e) {
        if (e.target === element) {
            element.classList.remove('on');
            element.textContent = '';
            document.body.classList.remove('scroll-lock');
        }
    });
    element.textContent = '';
    function $bill($work, type) {
        $work['$hancome'] = hancome;
        $mapping.setData($work);
        $mapping.$render(types[type]);
        element.appendChild(types[type]);
        document.body.classList.add('scroll-lock');
        element.classList.add('on');
    }
    exports.$bill = $bill;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(4), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, array_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Offset = /** @class */ (function () {
        function Offset(element) {
            this.element = element;
            this.reset();
        }
        /*
         *  위치가 이동했을수도 있으므로 재계산용 메서드
         */
        Offset.prototype.reset = function () {
            var element = this.element, s = this.start = dom_1.DOM.offset(element).top, h = element.offsetHeight;
            this.end = s + element.offsetHeight;
            this.center = s + Math.ceil(h / 2);
        };
        Offset.prototype.up = function (pos) {
            return this.end > pos && this.center < pos;
        };
        Offset.prototype.down = function (pos) {
            return this.start < pos && this.center > pos;
        };
        return Offset;
    }());
    var DragSort = /** @class */ (function () {
        function DragSort() {
            var _this = this;
            this.y = 0;
            this.event = new events_1.Events(document, 'dragover', function (e) {
                var isUp = e.pageY < _this.y, y = _this.y = e.pageY, matched = array_1._selector(_this.list, function (offset) { return isUp ? offset.up(y) : offset.down(y); });
                // ① 매치되는게 있으면
                if (matched) {
                    _this.handler(matched.element, isUp);
                    matched.reset();
                }
            }).off();
        }
        DragSort.prototype.on = function (list, handler) {
            this.list = array_1._map(list, function (l) { return new Offset(l); });
            this.handler = handler;
            this.event.on();
            return this;
        };
        DragSort.prototype.off = function () {
            this.event.off();
            return this;
        };
        return DragSort;
    }());
    exports.DragSort = DragSort;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 30 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Imager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageScreen = /** @class */ (function (_super) {
        __extends(ImageScreen, _super);
        function ImageScreen(ele) {
            var _this = _super.call(this, ele) || this;
            _this.events.register(ele, 'click', function (e) {
                if (e.target === ele) {
                    _this.off();
                    _this.onClose && _this.onClose();
                }
            });
            return _this;
        }
        ImageScreen.prototype.on = function () {
            this.element.classList.add('on');
            _super.prototype.on.call(this);
            return this;
        };
        ImageScreen.prototype.off = function () {
            this.element.classList.remove('on');
            _super.prototype.off.call(this);
            return this;
        };
        return ImageScreen;
    }(Imager_1.ImageContainer));
    exports.ImageScreen = ImageScreen;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(21)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, position_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageContainer = /** @class */ (function () {
        function ImageContainer(element) {
            var _this = this;
            this.element = element;
            this.cliendRect = element.getBoundingClientRect();
            var handler, mouseWheelHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.wheelZoom(e);
            };
            this.events = new events_1.EventsGroup().off()
                .register(element, 'mousedown', function (e) {
                if (_this.imager) {
                    handler = _this.move(e);
                    e.stopPropagation();
                }
            })
                .register(document, 'mouseup', function () { return handler = null; })
                .register(document, 'mousemove', function (e) { return handler && handler(e); })
                // 마우스 휠로 확대 축소
                .register(document, 'mousewheel', mouseWheelHandler)
                .register(document, 'DOMMouseScroll', mouseWheelHandler)
                // 더블클릭으로 그림 회전
                .register(element, 'dblclick', function (e) {
                if (_this.imager) {
                    _this.imager.rotate += e.ctrlKey ? -90 : 90;
                    e.stopPropagation();
                }
            })
                // 이미지 움직일때 드래그 이벤트 봉쇄
                .register(element, 'dragstart', function (e) { return _this.imager && e.preventDefault(); });
        }
        ImageContainer.prototype.on = function () {
            this.events.on();
            return this;
        };
        ImageContainer.prototype.off = function () {
            this.events.off();
            return this;
        };
        ImageContainer.prototype.putImage = function (image) {
            var _a = this, element = _a.element, _b = _a.element, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
            this.imager = new Imager(image)
                .setSize(position_1.__adjust(offsetWidth, offsetHeight, image.naturalWidth, image.naturalHeight, true));
            element.textContent = '';
            element.appendChild(image);
            return this;
        };
        // 이미지 줌
        ImageContainer.prototype.wheelZoom = function (e) {
            var img = this.imager, pageX = e.clientX, pageY = e.clientY, _a = this.cliendRect, boundingLeft = _a.left, boundingTop = _a.top, top = img.top, left = img.left, width = img.width, height = img.height, ratioX = (pageX - left - boundingLeft) / width, ratioY = (pageY - top - boundingTop) / height, zoom = e.wheelDelta < 0 ? -1 : 1, widthAdd = (width * .3) * zoom;
            if (width + widthAdd < 300)
                img.setWidth(300);
            else
                img.addWidth(widthAdd);
            img.left = (left - ((img.width - width) * ratioX));
            img.top = (top - ((img.height - height) * ratioY));
        };
        // 이미지 이동
        ImageContainer.prototype.move = function (e, img) {
            if (img === void 0) { img = this.imager; }
            var pageX = e.pageX, pageY = e.pageY, left = img.left, top = img.top;
            return function (e) {
                img.left = left + e.pageX - pageX;
                img.top = top + e.pageY - pageY;
            };
        };
        return ImageContainer;
    }());
    exports.ImageContainer = ImageContainer;
    var Imager = /** @class */ (function () {
        // style을 설정한다.
        function Imager(element) {
            this.element = element;
            this.CSSStyle = element.style;
            this.left = 0;
            this.top = 0;
            this.width = element.naturalWidth;
            this.height = element.naturalHeight;
            this.position = 'relative';
        }
        Object.defineProperty(Imager.prototype, "zIndex", {
            get: function () {
                return parseInt(this.CSSStyle.zIndex);
            },
            set: function (v) {
                this.CSSStyle.zIndex = v.toString();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "left", {
            get: function () {
                return parseInt(this.CSSStyle.left);
            },
            set: function (v) {
                this.CSSStyle.left = v + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "top", {
            get: function () {
                return parseInt(this.CSSStyle.top);
            },
            set: function (v) {
                this.CSSStyle.top = v + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "width", {
            get: function () {
                return parseInt(this.CSSStyle.width);
            },
            set: function (v) {
                this.CSSStyle.width = v + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "height", {
            get: function () {
                return parseInt(this.CSSStyle.height);
            },
            set: function (v) {
                this.CSSStyle.height = v + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "rotate", {
            get: function () {
                return position_1.__transform(this.CSSStyle.transform);
            },
            set: function (v) {
                this.CSSStyle.transform = 'rotate(' + v + 'deg)';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Imager.prototype, "position", {
            get: function () {
                return this.CSSStyle.position;
            },
            set: function (v) {
                this.CSSStyle.position = v;
            },
            enumerable: true,
            configurable: true
        });
        Imager.prototype.setSize = function (_a) {
            var w = _a.w, h = _a.h, x = _a.x, y = _a.y;
            this.left = x;
            this.top = y;
            this.width = w;
            this.height = h;
            return this;
        };
        // 정중앙 정렬
        Imager.prototype.center = function (W, H) {
            var _a = this, width = _a.width, height = _a.height;
            this.left = Math.ceil((W - width) / 2);
            this.top = Math.ceil((H - height) / 2);
            return this;
        };
        Imager.prototype.$setSize = function (drive, change, driven) {
            return { driven: driven + (driven * (change / drive)), drive: drive + change };
        };
        // 가로 사이즈 비율에 맞게 전체 사이즈 조정
        Imager.prototype.setWidth = function (v) {
            return this.addWidth(v - this.width);
        };
        Imager.prototype.setHeight = function (v) {
            return this.addHeight(v - this.height);
        };
        // (+-)v 값만큼 크기 조정.
        Imager.prototype.addWidth = function (v) {
            var _a = this.$setSize(this.width, v, this.height), drive = _a.drive, driven = _a.driven;
            this.width = drive;
            this.height = driven;
            return this;
        };
        Imager.prototype.addHeight = function (v) {
            var _a = this.$setSize(this.height, v, this.width), drive = _a.drive, driven = _a.driven;
            this.width = driven;
            this.height = drive;
            return this;
        };
        return Imager;
    }());
    exports.Imager = Imager;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 32 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(14), __webpack_require__(7), __webpack_require__(10), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, calendar_1, events_1, Mapping_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    var directive = {
        datetime: function (ele, v) {
            ele.textContent = calendar_1.Calendar.format(v.datetime, 'yyyy-MM-dd(E) HH:mm');
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
/* 33 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(16), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Forms_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var className = dom_1.DOM.className;
    var vf_className = ['form-error'], validHandler = function (valid, input, g, f) { return className(input, vf_className, !valid); };
    var ViewForm = /** @class */ (function (_super) {
        __extends(ViewForm, _super);
        function ViewForm(ele) {
            var _this = _super.call(this, ele) || this;
            var handler = _this._handler = function () { return className(ele, vf_className, !_this.valid(validHandler)); };
            ele.addEventListener('keyup', handler);
            ele.addEventListener('change', handler);
            ele.addEventListener('click', function (e) { return e.target['hasAttribute']('data-cancel') && _this.detach(); });
            return _this;
        }
        ViewForm.prototype.reset = function (obj) {
            _super.prototype.reset.call(this, obj);
            this._handler();
            return this;
        };
        ViewForm.prototype.prepend = function (target) {
            target.parentElement.insertBefore(this.element, target);
            return this;
        };
        ViewForm.prototype.appendTo = function (target) {
            target.appendChild(this.element);
            return this;
        };
        return ViewForm;
    }(Forms_1.Forms));
    exports.ViewForm = ViewForm;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(17), __webpack_require__(14), __webpack_require__(5), __webpack_require__(0), __webpack_require__(45), __webpack_require__(32), __webpack_require__(4), __webpack_require__(3), __webpack_require__(7), __webpack_require__(1), __webpack_require__(46), __webpack_require__(47), __webpack_require__(11), __webpack_require__(29), __webpack_require__(21), __webpack_require__(48), __webpack_require__(30), __webpack_require__(33), __webpack_require__(10), __webpack_require__(50), __webpack_require__(8), __webpack_require__(28), __webpack_require__(2), __webpack_require__(23), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Work_1, calendar_1, core_1, format_1, FileUpload_1, Screen_1, array_1, dom_1, events_1, access_1, FormEvent_1, _recieveFiles_1, replaceHTML_1, DragSort_1, position_1, patseImage_1, ImageScreen_1, ViewForm_1, Mapping_1, ComfirmBox_1, selector_1, Bill_1, number_1, _select_1, dispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var createHTML = dom_1.DOM.createHTML;
    var dataEvent = events_1.Events.dataEvent;
    var access = access_1.Access.access;
    var className = dom_1.DOM.className;
    var number = format_1.Formats.number;
    var simpleTrigger = events_1.Events.simpleTrigger;
    var filesize = format_1.Formats.filesize;
    var acceptKeys = events_1.Events.acceptKeys;
    var EventObject = /** @class */ (function () {
        function EventObject(e) {
            this.e = e;
            this.eventTarget = e.target;
        }
        EventObject.$dispatcher = function (e) { return new EventObject(e); };
        return EventObject;
    }());
    function $init($uuid, $path, $work) {
        var body = document.body, element = document.getElementById('view'), nav = selector_1.getElementsByTagName(document.body, 'nav', 0), $uploadProgress = new FileUpload_1.FileUpload(document.getElementById('file-upload')), $screen = new Screen_1.Screen(document.getElementById('screen'), $path), $imageScreen = new ImageScreen_1.ImageScreen(document.getElementById('image-screen')), $confirm = new ComfirmBox_1.ConfirmBox(document.getElementById('confirm-box')), 
        /*
         *  data-directive="prop | {directive}"
         */
        $directive = {
            number: function (ele, v) {
                ele.textContent = number(v);
            },
            datetime: function (ele, v) {
                if (v)
                    ele.textContent = calendar_1.Calendar.format(v, 'yyyy-MM-dd(E) HH:mm');
            },
            len: function (ele, v) {
                var p = ele.parentElement;
                if (v > 0)
                    p.classList.add('active');
                else
                    p.classList.remove('active');
                ele.textContent = v.toString();
            },
            // 견적서로 가는 href 작성
            href: function (ele, v) {
                ele.href = '/work/bill?uuid=' + v + '&type=' +
                    ele.getAttribute('data-href');
            },
            fileSize: function (ele, v) {
                ele.textContent = filesize(v);
            },
            /*
             *  인쇄파일 클릭시 나타나는 드롭다운 엘리먼트를 직접 생성
             */
            print: function (ele, v) {
                var print = v.print, btn = ele.getElementsByTagName('span')[0], dropdown = ele.getElementsByClassName('dropdown-menu')[0];
                if (print.length) {
                    btn.classList.add('active');
                    btn.setAttribute('data-toggle', 'dropdown');
                    dropdown.innerHTML = print.map(function (p, i) {
                        return $$templates['print']({
                            index: i, data: p,
                            path: '/workdata/' + $path + p.getSaveName() + '?attachment=' + p.getOrigName()
                        });
                    }).join('');
                }
                else {
                    btn.classList.remove('active');
                    btn.removeAttribute('data-toggle');
                }
            },
            draft: function (ele, v) {
                if (v.draft.length) {
                    ele.classList.add('active');
                }
            },
            // 참고파일 렌더링
            refThumb: function (ele, v) {
                // ① 이미지 파일일 경우
                if (v.content_type.indexOf('image') !== -1) {
                    ele.classList.remove('file-icon');
                    var image_1 = new Image();
                    image_1.onload = function () {
                        ele.appendChild(position_1.__adjustTo(ele, image_1, true));
                        image_1.onload = null;
                    };
                    image_1.src = '/workdata/' + $path + v.getSaveName();
                }
                // ② 일반 파일
                else {
                    ele.classList.add('file-icon-' + v.filetype);
                    ele.href = '/workdata/' + $path + v.getSaveName() + '?attachment=' + v.getOrigName();
                }
            },
        }, $mapping = new Mapping_1.Mapping()
            .setData($work)
            .addDirective($directive)
            .addTemplate(Mapping_1.Mapping.createTemplates(document.head)), 
        /*
         *   data-pre-processor="{name}"
         *
         */
        preProcessor = {
            $attach: function (e) {
                var _this = this;
                if (e.hasAttribute('data-pre-processor'))
                    this[e.getAttribute('data-pre-processor')](e);
                array_1._forEach(e.querySelectorAll('[data-pre-processor]'), function (e) {
                    _this[e.getAttribute('data-pre-processor')](e);
                });
                return e;
            },
            state: function (ele) {
                var $state = Work_1.Work.$state, _a = _select_1.selectAll(ele, ['<0> span', '<0> ul']), span = _a[0], ul = _a[1], current = $work.state.toString(), $active = function (i) {
                    span.textContent = $state[current = i];
                    array_1._forEach(ul.children, function (e) {
                        if (e.getAttribute('data-dismiss') == i)
                            e.classList.add('active');
                        else
                            e.classList.remove('active');
                    });
                };
                ul.innerHTML = $state.reduce(function (r, v, i) {
                    r[i] = '<li data-dismiss="' + i + '">' + v + '</li>';
                    return r;
                }, []).join('');
                ul.addEventListener('click', function (e) {
                    var i = e.target['getAttribute']('data-dismiss');
                    if (current !== i)
                        Work_1.Work.updateState($work.id, i).then(function () {
                            $active(i);
                        });
                });
                $active(current);
            },
            // 작업 삭제 버튼
            remove: function (ele) {
                ele.addEventListener('click', function (e) {
                    $confirm.on(e, function (flag) {
                        if (flag)
                            Work_1.Work.remove($work.id).then(function () {
                                location.href = '/work/list';
                            });
                    });
                });
            },
            // 숫자만 써지게 한다.
            number: FormEvent_1.FormEvent.numbers,
            /*
             *   ① count와 price가 입력될때마다 vat, total을 계산해넣는다.
             *   ② vat 자체를 수정할 경우에는 total만 변경한다
             */
            compute: function (tr) {
                // [count, price, vat, total]
                var inputs = selector_1.querySelectorAll(tr, '[data-compute]', function (e, i, a) {
                    a[e.getAttribute('data-compute')] = e;
                }, []), read = function (value) {
                    if (number_1.r_number.test(value))
                        return parseInt(value);
                    return 0;
                }, processor = [
                    function (val) { return val[0] == null ? read(inputs[0].value) : val[0]; },
                    function (val) { return val[1] == null ? read(inputs[1].value) : val[1]; },
                    function (val) {
                        if (val[2] == null) {
                            var c = val[0], p = val[1];
                            inputs[2].value = (val[2] = (c * p) / 10).toString();
                        }
                        return val[2];
                    },
                    function (val) { return inputs[3].value = (val[0] * val[1] + val[2]) + ''; }
                ];
                // keyup 이벤트
                array_1._forEach(inputs, function (input, i) {
                    acceptKeys(input, function (val) {
                        if (!val.trim())
                            val = '0';
                        if (number_1.r_number.test(val)) {
                            var values_1 = [];
                            values_1[i] = read(val);
                            array_1._forEach(processor, function (func, i) { return values_1[i] = func(values_1); });
                        }
                    }, false);
                });
            },
            // 메모 textarea와 버튼을 일원화시키기
            memoForm: function (ele) {
                var textarea = ele.querySelector('textarea'), tHandler = function () { return className(ele, 'active', !!textarea.value); };
                textarea.addEventListener('keyup', tHandler);
                textarea.addEventListener('change', tHandler);
            },
            /*
             *  아이템 재정렬 이벤트
             */
            itemSort: function (mapper) {
                var r_tr = /tr/i, $form = $viewForms[mapper.getAttribute('data-mapper')], sort = new DragSort_1.DragSort(), tbody = mapper.getElementsByTagName('tbody')[0], target, index, items, sortHandler = function (ele, moveUp) {
                    if (moveUp)
                        tbody.insertBefore(target, ele);
                    else
                        tbody.insertBefore(ele, target);
                }, endHandler = function () {
                    target && className(target, ['sort-active'], false);
                    upEvent.off();
                    sort.off();
                    var idx = array_1._makeArray(tbody.getElementsByTagName('tr')).indexOf(target);
                    if (index !== idx) {
                        var values_2 = array_1._move(items, index, idx);
                        Work_1.WorkItem.priority(values_2.map(function (v) { return v.id; })).then(function (v) {
                            $work.items = values_2;
                            $mapping.$render(mapper);
                        });
                    }
                }, upEvent = new events_1.EventsGroup().off()
                    .register(document, 'mouseup', endHandler)
                    .register(document, 'dragend', endHandler);
                // ① 마우스다운으로 이벤트 시작
                mapper.addEventListener('mousedown', function (e) {
                    target = e.target;
                    if (target.hasAttribute('draggable') ||
                        target.parentElement.hasAttribute('draggable')) {
                        // ① 열려있는 폼을 닫는다.
                        $form.detach();
                        // ② <tr>을 찾는다.
                        while (!r_tr.test(target.tagName))
                            target = target.parentElement;
                        // ③ <tr class="sort-active">
                        className(target, ['sort-active'], true);
                        // ④ 현재위치 저장
                        items = $work.items;
                        index = items.indexOf(access($work, target.getAttribute('data-mapping')));
                        upEvent.on();
                        sort.on(array_1._filter(array_1._makeArray(tbody.getElementsByTagName('tr')), function (v) { return v !== target; }), sortHandler);
                    }
                });
            },
            /*
             *  ctrl + v 로 시안붙이기
             */
            pasteImage: function (ele) {
                patseImage_1.patseImage(ele, function (a) {
                    var workFileData;
                    if (a.kind === 'file')
                        workFileData = [fileTo(a.file)];
                    else if (a.kind === 'blob')
                        workFileData = [blobTo(a.blob)];
                    else
                        return;
                    $fileUpload('draft', $screen.item.id, workFileData, function (workFile) {
                        $screen.item.addDraft(workFile);
                        $screen.render();
                        $mapping.$render($screen.mapper);
                    });
                });
            },
            /*
             *  참고파일 이미지 크게 보기
             */
            imageScreen: function (ele) {
                var r = /img/i, handler = function (image) {
                    var parent = image.parentElement;
                    $imageScreen
                        .on()
                        .putImage(image)
                        .onClose = function () { return parent.appendChild(position_1.__adjustTo(parent, image, true)); };
                };
                ele.addEventListener('click', function (e) {
                    var image = e.target;
                    r.test(image.tagName) && handler(image);
                });
            },
        }, 
        /*
         *  각 데이터를 수정하는 폼 엘리먼트
         *  각 폼은 자체적으로 검증시스템을 갖추고 있다.
         */
        $viewForms = (function (list) {
            var $forms = {};
            // <script data-form="{}"> 순회
            array_1._forEach(list, function (e) {
                $forms[e.getAttribute('data-form')] =
                    new ViewForm_1.ViewForm(preProcessor.$attach(createHTML(e.innerText)));
            });
            return $forms;
        })(document.head.querySelectorAll('script[data-form]')), 
        /*
         *  HTML문자열
         */
        $$templates = (function (list) {
            var result = {};
            array_1._forEach(list, function (e) {
                result[e.getAttribute('data-template')] = replaceHTML_1._replaceHTML(e.innerText);
            });
            return result;
        })(document.head.querySelectorAll('[data-template]')), fileTo = function (file) { return ({ name: file.name, data: file }); }, blobTo = function (blob) {
            var _a = blob.type.split('/'), type = _a[1];
            return { data: blob, name: 'blob.' + (type === 'jpeg' ? 'jpg' : type) };
        }, $fileUpload = function (type, ownId, files, handler) {
            $uploadProgress.init(files.length).on();
            // ② files 순회
            array_1._reduce(files, function (promise, file, i) {
                return promise.then(function () {
                    return Work_1.WorkFile
                        .uploadFile($path, file, $uploadProgress.start(file.name, i))
                        .then(function (id) { return Work_1.WorkFile.saveFile(type, ownId, Work_1.WorkFile.create(file.data, file.name, id)); })
                        .then(function (workFile) { return handler(workFile); });
                });
            }, Promise.resolve())
                .then(function () { return $uploadProgress.off(); });
        }, 
        /*
         *  실제 서버에 데이터를 입력, 변경, 수정하는 로직을 담은 핸들러.
         *  또한 전역적으로 활용되는 Work를 최신 상태로 유지시키는 역할을 한다.
         *
         */
        CURD = {
            customer: {
                update: function (data, own) {
                    data['id'] = own.id;
                    return Work_1.Customer.save(data)
                        .then(function () { return core_1.$extend(own, data); });
                }
            },
            text: {
                update: function (data, own) {
                    return Work_1.Work.update(data, own);
                },
            },
            title: {
                update: function (data, own) {
                    return Work_1.Work.update(data, own);
                },
            },
            memo: {
                create: function (data, work) {
                    var memo = new Work_1.WorkMemo({
                        value: data,
                        datetime: new Date()
                    });
                    return Work_1.WorkMemo.save(work, memo)
                        .then(function (memo) { return work.addMemo(memo); });
                },
                update: function (data, own) {
                    console.log(data);
                    data.id = own.id;
                    return Work_1.WorkMemo.save(own.work, data)
                        .then(function () { return own.value = data.value; });
                },
                remove: function (own, work) {
                    return Work_1.WorkMemo.remove(own, work).then(function (v) {
                        work.removeMemo(own);
                    });
                },
            },
            items: {
                update: function (data, own) {
                    console.log(data);
                    var work = own.work;
                    data['id'] = own.id;
                    return Work_1.WorkItem.save(data, work.id)
                        .then(function (v) { return core_1.$extend(own, data).work.compute(); });
                },
                create: function (obj, work) {
                    obj['priority'] = work.item_len;
                    return Work_1.WorkItem.save(new Work_1.WorkItem(obj).setWork(work), work.id);
                },
                remove: function (item, work) {
                    return Work_1.WorkItem.remove(item).then(function (v) {
                        work.removeItem(item);
                    });
                },
            },
            /*
             *   여기서는 참고파일만 취급한다.
             *   시안과 인쇄파일은 Screen에서 해결한다.
             */
            refs: {
                remove: function (own, work) {
                    return Work_1.WorkFile.removeFile('ref', own.id).then(function (v) {
                        work.removeRef(own);
                    });
                }
            },
        };
        // ************************************ Start ************************************ //
        document.title = $work.title;
        function $eventTrigger(type, target) {
            var e = document.createEvent('Event');
            e.initEvent(type, false, true);
            target.dispatchEvent(e);
        }
        /*
         *
         */
        var $dataEvent = {
            // 수정 버튼 클릭시
            modify: function (_a) {
                var mapper = _a.mapper, mapping = _a.mapping, name = _a.name, target = _a.target;
                var forms = $viewForms[name].reset(access($work, mapping));
                // mapping이 undefined이거나 null이면 해당 키워드가 문자열로 입력된다. 그럼 문제된다.
                forms.element.setAttribute('data-form-mapping', mapping || '');
                forms.prepend(target);
            },
            // 확인 버튼 클릭시
            confirm: function (_a) {
                var name = _a.name, mapper = _a.mapper;
                var forms = $viewForms[name], element = forms.element;
                // 수정
                if (element.hasAttribute('data-form-mapping')) {
                    var mapping = element.getAttribute('data-form-mapping');
                    CURD[name].update(forms.values(), access($work, mapping)).then(function (v) {
                        forms.detach();
                        $mapping.$render(mapper);
                        $mapping.$follow(name);
                    });
                }
                // 신규
                else {
                    CURD[name].create(forms.values(), $work).then(function (v) {
                        forms.detach();
                        $mapping.$render(mapper);
                        $mapping.$follow(name);
                    });
                }
            },
            // 삭제버튼 클릭시
            remove: function (_a) {
                var mapper = _a.mapper, mapping = _a.mapping, name = _a.name, e = _a.e, eventTarget = _a.eventTarget;
                eventTarget.classList.add('confirm-active');
                $confirm.on(e, function (flag) {
                    if (flag) {
                        CURD[name].remove(access($work, mapping), $work).then(function (v) {
                            $mapping.$render(mapper);
                            $mapping.$follow(name);
                        });
                    }
                    eventTarget.classList.remove('confirm-active');
                });
            },
            // ************************ ▼ Custom Event ▼ ************************ //
            // 아이템추가하기
            addItem: function (_a) {
                var mapper = _a.mapper, name = _a.name;
                var forms = $viewForms[name];
                forms.element.removeAttribute('data-form-mapping');
                forms.reset().appendTo(mapper.querySelector('[data-template]'));
            },
            // 메모추가하기
            addMemo: function (_a) {
                var mapper = _a.mapper, name = _a.name, target = _a.target;
                var textarea = target.querySelector('textarea'), value = textarea.value;
                // 데이터가 전송중일때는 클릭이 안되게 한다.
                if (!value || textarea.hasAttribute('data-sending'))
                    return;
                textarea.setAttribute('data-sending', 'true');
                CURD.memo.create(value, $work).then(function (v) {
                    textarea.value = '';
                    $eventTrigger('change', textarea);
                    $mapping.$render(mapper);
                    $mapping.$follow(name);
                    textarea.removeAttribute('data-sending');
                });
            },
            // 시안파일, 인쇄파일
            screen: function (_a) {
                var name = _a.name, mapping = _a.mapping, mapper = _a.mapper;
                $screen.on(access($work, mapping), mapper);
            },
            // ************************* ▼ 파일 업로드 ▼ ************************* //
            // 참고파일 업로드
            upload: function (_a) {
                var mapper = _a.mapper, name = _a.name;
                _recieveFiles_1._recieveFiles(function (files) {
                    $fileUpload('ref', $work.id, array_1._map(files, fileTo), function (file) {
                        $work.addRef(file);
                        $mapping.$render(mapper);
                        $mapping.$follow(name);
                    });
                });
            },
            // [screen] 시안파일, 인쇄파일 업로드
            screenFile: function (_a) {
                var name = _a.name, mapping = _a.mapping, type = _a.type;
                var item = $screen.item;
                _recieveFiles_1._recieveFiles(function (files) {
                    $fileUpload(type, item.id, array_1._map(files, fileTo), function (file) {
                        if (type === 'print')
                            item.addPrint(file);
                        else
                            item.addDraft(file);
                        $screen.render();
                        $mapping.$render($screen.mapper); // 해당 아이템 엘리먼트도 갱신
                    });
                });
            },
            // 시안 지우기
            removeDraft: function () {
                var img = $screen.img, item = $screen.item;
                Work_1.WorkFile.removeFile('draft', img.id).then(function (v) {
                    item.removeDraft(img);
                    $screen.render();
                    if (!item.draft.length)
                        $mapping.$render($screen.mapper);
                });
            },
            // 인쇄파일 지우기
            removePrint: function (_a) {
                var mapping = _a.mapping, index = _a.index, target = _a.target, print = _a.print, e = _a.e, eventTarget = _a.eventTarget;
                eventTarget.classList.add('confirm-active');
                $confirm.on(e, function (flag) {
                    if (flag) {
                        var item_1 = access($work, mapping), val_1 = item_1.print[index];
                        Work_1.WorkFile.removeFile('print', val_1.id).then(function (v) {
                            item_1.removePrint(val_1);
                            if (!item_1.print.length) {
                                $mapping.$render(target);
                                simpleTrigger(print, 'dropdown-close');
                            }
                            else {
                                // mapping을 갱신해야 하므로, 다시 그린다.
                                $directive.print(print, item_1);
                            }
                        });
                    }
                    eventTarget.classList.remove('confirm-active');
                });
            },
        };
        //************************************** ▼ Events ▼ **************************************//
        dataEvent(element, 'click', 'data-event', EventObject.$dispatcher, dispatcher_1.mapperDispatcher(), $dataEvent);
        dataEvent(nav, 'click', 'data-event', EventObject.$dispatcher, dispatcher_1.mapperDispatcher(), $dataEvent);
        //************************************** ▲ Events ▲ **************************************//
        $mapping.$render(element);
        $mapping.$render(document.querySelector('nav'));
        // 폼 이벤트
        preProcessor.$attach(body);
    }
    Work_1.Work.get(/([^\/]+)\/*$/.exec(location.pathname)[1]).then(function ($work) {
        if ($work) {
            console.log($work);
            $init($work.uuid, Work_1.Work.toPath($work.uuid), $work);
            // 견적서 띄우기
            (function (nav) {
                nav.addEventListener('click', function (e) {
                    var type = e.target['getAttribute']('data-bill');
                    if (type)
                        Bill_1.$bill($work, type);
                });
            })(selector_1.getElementsByTagName(document.body, 'nav', 0));
        }
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, array_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileUpload = /** @class */ (function () {
        /*
         *  서버 송출하는 upload 진행도가 전체에서 차지할 비율
         *  up      : 브라우저 업로드
         *  send    : 서버측 다운로드
         *  rr = 100 * up;
         */
        function FileUpload(element, up, send) {
            if (up === void 0) { up = .6; }
            if (send === void 0) { send = 1 - up; }
            var _this = this;
            this.element = element;
            this.up = up;
            this.send = send;
            this._sending = false;
            this.rr = 100 * up;
            array_1._forEach(element.querySelectorAll('[data-prop]'), function (e) {
                _this[e.getAttribute('data-prop')] = e;
            });
        }
        FileUpload.prototype.init = function (total) {
            this._sending = true;
            this.current.textContent = '1';
            this.total.textContent = total.toString();
            this.bar.style.width = '0%';
            return this;
        };
        FileUpload.prototype.uploading = function (loaded, total) {
            this.loading(Math.floor(loaded / total * 100 * this.up));
            return this;
        };
        FileUpload.prototype.sending = function (loaded, total) {
            this.loading(this.rr + Math.floor(loaded / total * 100 * this.send));
            return this;
        };
        FileUpload.prototype.done = function () {
            this.loading(100);
            this._sending = false;
            return this;
        };
        FileUpload.prototype.isSending = function () {
            return this._sending;
        };
        FileUpload.prototype.loading = function (percent) {
            this.bar.style.width = percent + '%';
        };
        FileUpload.prototype.start = function (name, index) {
            this.current.textContent = (index + 1).toString();
            this.filename.textContent = name;
            this.bar.style.width = '0%';
            return this;
        };
        FileUpload.prototype.on = function () {
            this.element.classList.add('on');
            return this;
        };
        FileUpload.prototype.off = function () {
            this.element.classList.remove('on');
            return this;
        };
        return FileUpload;
    }());
    exports.FileUpload = FileUpload;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormEvent;
    (function (FormEvent) {
        var className = dom_1.DOM.className;
        var forEach = Array.prototype.forEach, placeholder_props = 'text number', func = {
            number: (function (r) {
                return function (s) {
                    var minus = s[0] === '-';
                    s = s.replace(r, '');
                    return minus ? '-' + s : s;
                };
            })(/[^\d]/g),
        };
        // 달력
        function calendar(input) {
        }
        FormEvent.calendar = calendar;
        // 플레이스홀더 설정
        function placeholder(input, val) {
            if (val === void 0) { val = input.getAttribute('data-placeholder'); }
            if (placeholder_props.indexOf(input.getAttribute('data-type') || input.type) === -1)
                return null;
            var isActive, handler = function () {
                if (isActive = !input.value)
                    input.value = val;
                className(input, 'empty', isActive);
            };
            handler();
            return new events_1.EventsGroup()
                .register(input, 'focus', function () { return isActive && (input.value = ''); })
                .register(input, 'change', handler)
                .register(input, 'blur', handler);
        }
        FormEvent.placeholder = placeholder;
        // 사용하면 안되는 문자를 기입한다.
        function replace(input, regHandler) {
            var handler = function () { return input.value = regHandler.call(input, input.value); };
            return new events_1.EventsGroup()
                .register(input, 'keyup', handler)
                .register(input, 'change', handler);
        }
        FormEvent.replace = replace;
        function numbers(input) {
            return replace(input, func.number);
        }
        FormEvent.numbers = numbers;
        function checkLen(inputs, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = inputs.length; }
            var select = [], handler = function (e) {
                var input = e.target, length = select.length;
                // 추가할때
                if (input.checked) {
                    while (length >= max) {
                        select.shift().checked = false;
                        length--;
                    }
                    select[length] = input;
                }
                // 뺄때
                else {
                    if (length > min) {
                        select.splice(select.indexOf(input), 1);
                    }
                    else
                        input.checked = true;
                }
            }, group = new events_1.EventsGroup();
            forEach.call(inputs, function (v) {
                v.checked && select.push(v);
                group.register(v, 'change', handler);
            });
            return group;
        }
        FormEvent.checkLen = checkLen;
    })(FormEvent = exports.FormEvent || (exports.FormEvent = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var input;
    /*
     *  input을 계속 만들되, 하나의 인풋만 body에 달려있도록 한다.
     */
    function _recieveFiles(handler, multiple) {
        if (multiple === void 0) { multiple = true; }
        var body = document.body;
        if (input) {
            body.removeChild(input);
        }
        input = document.createElement('input');
        input.type = 'file';
        input.multiple = multiple;
        input.style.display = 'none';
        input.onchange = function () {
            handler(input.files);
        };
        body.appendChild(input);
        input.click();
    }
    exports._recieveFiles = _recieveFiles;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(15), __webpack_require__(49), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, _noop_1, util_1, array_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var catchKey = events_1.Events.catchKey;
    var r_filename = /\.[^.]+$/, r_https = /^https?:\/\//, r_img = /img/i, r_http = /^http/, r_data = /^data:/, 
    /*
     *  모든 pasteImage는 하나의 엘리먼트를 공유한다.
     *  ctrl key에 따라 body에 탈착된다.
     */
    $ctrl = (function () {
        var $style = {
            overflow: 'hidden',
            position: 'fixed',
            top: '-2px',
            left: '-2px',
            width: '1px',
            height: '1px'
        }, element = (function (element) {
            var style = element.style, p;
            for (p in $style)
                style[p] = $style[p];
            element.setAttribute('contenteditable', 'true');
            return element;
        })(document.createElement('div')), ctrl = {
            element: element,
            on: function () {
                element.textContent = '';
                document.body.appendChild(element);
                element.focus();
            },
            off: function () {
                document.body.removeChild(element);
            }
        };
        return ctrl;
    })(), 
    /*
     *  paste 이벤트시 DataFransferItemList 로딩하기
     *  Promise.all([...])과 같은 역할을 하는 메서드
     */
    readItems = (function () {
        function getAs(item, call) {
            if (item.kind === 'string') {
                item.getAsString(function (v) {
                    call({ kind: 'url', text: v });
                });
            }
            else if (item.kind === 'file') {
                call({ kind: 'file', file: item.getAsFile() });
            }
        }
        return function (items) {
            return new Promise(function (resolve, _) {
                var check, len = check = items.length, result = [];
                var _loop_1 = function () {
                    var index = len;
                    getAs(items[index], function (d) {
                        result[index] = d;
                        --check === 0 && resolve(result);
                    });
                };
                while (len-- > 0) {
                    _loop_1();
                }
            });
        };
    })();
    function __blobSetName(blob, name) {
        var _a = blob.type.split('/'), type = _a[1];
        if (type === 'jpeg')
            type = 'jpg';
        blob['name'] = name + '.' + type;
        return blob;
    }
    function patseImage(ele, handler) {
        var ctrl = $ctrl, contenteditable = ctrl.element, eventGroup = new events_1.EventsGroup()
            .off()
            // ctrl키에 따라 focus()
            .register(catchKey(ele, [17], function (n) { return n === 0 && ctrl.on(); }, function () { return ctrl.off(); }))
            // v키를 업하면 곧바로 editElement를 확인한다.
            .register(catchKey(ele, [17, 86], _noop_1.__noop, function () {
            var child = contenteditable.firstChild, src;
            if (child) {
                // base64는 textNode로 들어온다.
                if (child.nodeType === 3)
                    src = child.nodeValue;
                // <img> 태그만 취급한다.
                if (child.nodeType === 1 && r_img.test(child.tagName)) {
                    src = child.src;
                    // ① http
                    if (r_http.test(src))
                        handler({
                            kind: 'url',
                            url: src
                        });
                }
                // ② base64
                if (r_data.test(src)) {
                    handler({
                        kind: 'blob',
                        blob: util_1.base64ToBlob(src)
                    });
                }
            }
            //$ctrl.off();  ==> 어차피 위에 있는 ctrl 이벤트에 의해서 호출된다.
        }))
            .register(contenteditable, 'paste', function (e) {
            var transfer = e.clipboardData || window['clipboardData'], items = transfer && transfer.items;
            // ② paste이벤트를 지원하는 경우 File로 받아낸다.
            if (items) {
                // 이걸 막지 않으면 같은 이미지를 두번 읽어들이게 된다.
                e.preventDefault();
                /*
                 *  ★ DataTransfer의 아주 중요한 특징이 있다.
                 *  kind = 'file' 객체의 경우, 이벤트 핸들러를 벗어나자마자 객체의 프로퍼티를 없애버린다.
                 *  따라서 getAsString등에 Promise를 사용하면 안된다.
                 */
                if (items.length) {
                    readItems(items).then(function (array) {
                        array_1._forEach(array, function (item) {
                            var kind = item.kind, url = item.url, file = item.file;
                            // ① string && url
                            if (kind === 'url') {
                                // (1) base64
                                if (r_data.test(url)) {
                                    handler({
                                        kind: 'blob',
                                        blob: util_1.base64ToBlob(url)
                                    });
                                    return false;
                                }
                                // paste에서 주소문자열은 무시하자. @2019-02-12 12:31
                                // (2) http
                                // else if (r_http.test(text)) url(text);
                            }
                            // ② file && image
                            else if (kind === 'file') {
                                if (file.type.indexOf('image') !== -1) {
                                    handler({
                                        kind: 'file',
                                        file: file
                                    });
                                    return false;
                                }
                            }
                        });
                    });
                }
            }
        });
        ele.addEventListener('mouseenter', function (e) { return eventGroup.on(); });
        ele.addEventListener('mouseleave', function (e) { return eventGroup.off(); });
    }
    exports.patseImage = patseImage;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var r_data = /^data:/, r_base64_cut = /:([^;]+)/;
    /*
     *
     *   base64 ==> binary data
     *
     *   데이터타입을 유추해야 하므로,
     *   반드시 data:image/png;base64 로 시작하는 텍스트를 입력해야 한다.
     */
    function base64ToBlob(base64) {
        var _a = base64.split(/,/), header = _a[0], src = _a[1], contentType = r_base64_cut.exec(header)[1], byteCharacters = atob(src), offset = 0, len = byteCharacters.length, byteNumbers = new Array(len);
        for (; offset < len; offset++) {
            byteNumbers[offset] = byteCharacters.charCodeAt(offset);
        }
        return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
    }
    exports.base64ToBlob = base64ToBlob;
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    function guid(short) {
        if (short === void 0) { short = false; }
        return short ?
            s4() + s4() + s4() :
            s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    exports.guid = guid;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfirmBox = /** @class */ (function () {
        function ConfirmBox(element) {
            var _this = this;
            this.element = element;
            this._skip = false;
            this.events = new events_1.EventsGroup().off()
                .register(document, 'click', function (e) {
                if (_this._skip) {
                    _this._skip = false;
                    return;
                }
                var target = e.target;
                if (target.hasAttribute('data-submit')) {
                    _this.handler(true);
                    _this.off();
                }
                if (target.hasAttribute('data-cancel') || !element.contains(target)) {
                    _this.handler(false);
                    _this.off();
                }
            });
        }
        ConfirmBox.prototype.on = function (x, y, h) {
            var element = this.element;
            if (!h) {
                h = y;
                y = x.pageY;
                x = x.pageX;
            }
            this._skip = true;
            if (this.handler)
                this.handler(false);
            this.handler = h;
            element.setAttribute('style', 'top: ' + y + 'px; left: ' + x + 'px;');
            element.classList.add('on');
            this.events.on();
            return this;
        };
        ConfirmBox.prototype.off = function () {
            this.element.classList.remove('on');
            this.events.off();
            return this;
        };
        return ConfirmBox;
    }());
    exports.ConfirmBox = ConfirmBox;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);