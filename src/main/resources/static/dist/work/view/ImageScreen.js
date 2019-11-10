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
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
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
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 22:
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
    }, exports.__tilt = function (rotate, r) {
        if (r === void 0) { r = Math.abs(rotate % 360); }
        return r === 90 || r === 270;
    }, exports.__ratio = function (num1, num1c, num2) {
        return num2 + (num2 * ((num1c - num1) / num1));
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
    }, exports.__alignmentTo = function (obj, container) {
        var _a;
        var style = obj.element.style, left = (_a = exports.__alignment(obj.width(), obj.height(), obj.rotate(), container.offsetWidth, container.offsetHeight), _a[0]), top = _a[1], width = _a[2], height = _a[3];
        style.transform = 'rotate(' + obj.rotate() + 'deg)';
        style.width = width + 'px';
        style.height = height + 'px';
        style.left = left + 'px';
        style.top = top + 'px';
        return obj;
    }, exports.__alignment = function (w, h, rotate, W, H) {
        if (exports.__tilt(rotate)) {
            var maxHeight_1 = exports.__ratio(w, H, h);
            if (maxHeight_1 > W) {
                w = exports.__ratio(h, W, w);
                return [(W - w) / 2, (H - W) / 2, w, W];
            }
            else {
                w = H;
                return [(W - w) / 2, (H - maxHeight_1) / 2, w, maxHeight_1];
            }
        }
        var maxHeight = exports.__ratio(w, W, h);
        // 세로를 딱 맞춰야 할 경우
        if (maxHeight > H) {
            w = exports.__ratio(h, H, w);
            return [(W - w) / 2, 0, w, H];
        }
        else {
            h = maxHeight;
            return [0, (H - h) / 2, W, h];
        }
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

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.r_number = /^[+-]?\d+$/;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 40:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(41)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, ImageController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageScreen = /** @class */ (function (_super) {
        __extends(ImageScreen, _super);
        function ImageScreen(ele) {
            var _this = _super.call(this) || this;
            _this.element = ele;
            _this.cliendRect = ele.getBoundingClientRect();
            _this.events.register(ele, 'click', function (e) {
                if (e.target === ele) {
                    _this.off();
                    _this.onClose && _this.onClose();
                }
            });
            return _this;
        }
        ImageScreen.prototype.putImage = function (image) {
            this.element.textContent = '';
            this.element.appendChild(image);
            _super.prototype.setImage.call(this, image);
            return this;
        };
        ImageScreen.prototype.on = function () {
            this.element.classList.add('on');
            this.events.on();
            return this;
        };
        ImageScreen.prototype.off = function () {
            this.element.classList.remove('on');
            this.events.off();
            return this;
        };
        return ImageScreen;
    }(ImageController_1.ImageController));
    exports.ImageScreen = ImageScreen;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, events_1, position_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageController = /** @class */ (function () {
        function ImageController() {
            var _this = this;
            var handler, mouseWheelHandler = function (e) {
                if (e.target === _this.imager.element) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.wheelZoom(e);
                }
            };
            this.events = new events_1.EventsGroup().off()
                .register(document, 'mousedown', function (e) {
                if (_this.element.contains(e.target) && _this.imager) {
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
                .register(document, 'dblclick', function (e) {
                if (_this.element.contains(e.target) && _this.imager) {
                    _this.imager.rotate += e.ctrlKey ? -90 : 90;
                    e.stopPropagation();
                }
            })
                // 이미지 움직일때 드래그 이벤트 봉쇄
                .register(document, 'dragstart', function (e) { return _this.imager && e.preventDefault(); });
        }
        ImageController.prototype.on = function (element) {
            this.element = element;
            this.cliendRect = element.getBoundingClientRect();
            this.events.on();
            return this;
        };
        ImageController.prototype.off = function () {
            this.element = this.cliendRect = this.imager = null;
            this.events.off();
            return this;
        };
        ImageController.prototype.setImage = function (image) {
            //let {element, element: {offsetWidth, offsetHeight}} = this;
            this.imager = new Imager(image);
            // .setSize(__adjust(offsetWidth, offsetHeight, image.naturalWidth, image.naturalHeight, true));
            return this;
        };
        ImageController.prototype.render = function (rotate) {
            if (rotate === void 0) { rotate = 0; }
        };
        // 이미지 줌
        ImageController.prototype.wheelZoom = function (e) {
            var img = this.imager, pageX = e.clientX, pageY = e.clientY, _a = this.cliendRect, boundingLeft = _a.left, boundingTop = _a.top, top = img.top, left = img.left, width = img.width, height = img.height, ratioX = (pageX - left - boundingLeft) / width, ratioY = (pageY - top - boundingTop) / height, zoom = e.wheelDelta < 0 ? -1 : 1, widthAdd = (width * .3) * zoom;
            if (width + widthAdd < 300)
                img.setWidth(300);
            else
                img.addWidth(widthAdd);
            img.left = (left - ((img.width - width) * ratioX));
            img.top = (top - ((img.height - height) * ratioY));
        };
        // 이미지 이동
        ImageController.prototype.move = function (e, img) {
            if (img === void 0) { img = this.imager; }
            var pageX = e.pageX, pageY = e.pageY, left = img.left, top = img.top;
            return function (e) {
                img.left = left + e.pageX - pageX;
                img.top = top + e.pageY - pageY;
            };
        };
        return ImageController;
    }());
    exports.ImageController = ImageController;
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
                obj && handler.call(directive, obj, e);
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


/***/ })

/******/ });