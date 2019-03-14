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
/******/ 	return __webpack_require__(__webpack_require__.s = 52);
/******/ })
/************************************************************************/
/******/ ({

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run(fns, nums) {
        return fns.map(function (f) {
            var startTime = new Date().getTime(), i = 0;
            for (; i < nums; i++) {
                f();
            }
            var endTime = new Date().getTime();
            return endTime - startTime;
        });
    }
    var __findClose = function (html, pos) {
        var t;
        while ((t = html[pos++]) !== '>') {
            if (t === '"')
                pos = html.indexOf('"', pos) + 1;
        }
        return pos;
    }, str = ['<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}">',
        '<input :="asdf adf"/>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" ::df>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :="_ + 5">',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :adf>',
        '<li class="{{_ == $ ? \'active\' : \'\'}}" data-dismiss="{{_}}" :>'];
    function str2(str) {
        var l = str.length, pos = str.lastIndexOf(' :');
        if (pos !== -1) {
            // ① :="..."
            if (str[pos + 2] === '=') {
                console.log('=');
                if (str[pos + 3] === '"') {
                    var d = str.lastIndexOf('"');
                    return [str.substring(0, pos) + str.substring(d + 1, l), '=',
                        str.substring(pos + 4, d)];
                }
            }
            // ② ::prop
            else if (str[pos + 2] === ':') {
                console.log('::');
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
        return [str, 'none'];
    }
    var B = /** @class */ (function () {
        function B() {
        }
        return B;
    }());
    document.addEventListener('click', function (e) {
        var target = e.target;
        bounding(target);
    });
    /*
     *
     */
    function _offset(ele, limit, overflow) {
        if (limit === void 0) { limit = document.body; }
        if (overflow === void 0) { overflow = false; }
        var top = 0, left = 0;
        while (ele !== limit && ele != null) {
            console.log(ele, ele.offsetTop, ele.offsetLeft, ele.offsetWidth, ele.offsetHeight);
            top += ele.offsetTop;
            left += ele.offsetLeft;
            ele = ele.parentElement;
        }
        console.log(top, left);
    }
    function bounding(ele) {
        if (ele == null)
            return;
        var width = ele.offsetWidth, height = ele.offsetHeight, top = ele.offsetTop, left = ele.offsetLeft;
        bounding(ele.parentElement);
        console.log(ele.tagName, 'width:', width, 'height:', height, 'top:', top, 'left', left);
    }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ });