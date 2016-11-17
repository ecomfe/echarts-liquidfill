(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["echarts-liquidfill"] = factory(require("echarts"));
	else
		root["echarts-liquidfill"] = factory(root["echarts"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var echarts = __webpack_require__(2);

	__webpack_require__(11);
	__webpack_require__(13);


	echarts.registerVisual(
	    echarts.util.curry(
	        __webpack_require__(15), 'liquidFill'
	    )
	);


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	/**
	 * @module zrender/core/util
	 */


	    // 用于处理merge时无法遍历Date等对象的问题
	    var BUILTIN_OBJECT = {
	        '[object Function]': 1,
	        '[object RegExp]': 1,
	        '[object Date]': 1,
	        '[object Error]': 1,
	        '[object CanvasGradient]': 1,
	        '[object CanvasPattern]': 1,
	        // In node-canvas Image can be Canvas.Image
	        '[object Image]': 1
	    };

	    var objToString = Object.prototype.toString;

	    var arrayProto = Array.prototype;
	    var nativeForEach = arrayProto.forEach;
	    var nativeFilter = arrayProto.filter;
	    var nativeSlice = arrayProto.slice;
	    var nativeMap = arrayProto.map;
	    var nativeReduce = arrayProto.reduce;

	    /**
	     * @param {*} source
	     * @return {*} 拷贝后的新对象
	     */
	    function clone(source) {
	        if (typeof source == 'object' && source !== null) {
	            var result = source;
	            if (source instanceof Array) {
	                result = [];
	                for (var i = 0, len = source.length; i < len; i++) {
	                    result[i] = clone(source[i]);
	                }
	            }
	            else if (
	                !isBuildInObject(source)
	                // 是否为 dom 对象
	                && !isDom(source)
	            ) {
	                result = {};
	                for (var key in source) {
	                    if (source.hasOwnProperty(key)) {
	                        result[key] = clone(source[key]);
	                    }
	                }
	            }

	            return result;
	        }

	        return source;
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} target
	     * @param {*} source
	     * @param {boolean} [overwrite=false]
	     */
	    function merge(target, source, overwrite) {
	        // We should escapse that source is string
	        // and enter for ... in ...
	        if (!isObject(source) || !isObject(target)) {
	            return overwrite ? clone(source) : target;
	        }

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                var targetProp = target[key];
	                var sourceProp = source[key];

	                if (isObject(sourceProp)
	                    && isObject(targetProp)
	                    && !isArray(sourceProp)
	                    && !isArray(targetProp)
	                    && !isDom(sourceProp)
	                    && !isDom(targetProp)
	                    && !isBuildInObject(sourceProp)
	                    && !isBuildInObject(targetProp)
	                ) {
	                    // 如果需要递归覆盖，就递归调用merge
	                    merge(targetProp, sourceProp, overwrite);
	                }
	                else if (overwrite || !(key in target)) {
	                    // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
	                    // NOTE，在 target[key] 不存在的时候也是直接覆盖
	                    target[key] = clone(source[key], true);
	                }
	            }
	        }

	        return target;
	    }

	    /**
	     * @param {Array} targetAndSources The first item is target, and the rests are source.
	     * @param {boolean} [overwrite=false]
	     * @return {*} target
	     */
	    function mergeAll(targetAndSources, overwrite) {
	        var result = targetAndSources[0];
	        for (var i = 1, len = targetAndSources.length; i < len; i++) {
	            result = merge(result, targetAndSources[i], overwrite);
	        }
	        return result;
	    }

	    /**
	     * @param {*} target
	     * @param {*} source
	     * @memberOf module:zrender/core/util
	     */
	    function extend(target, source) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }

	    /**
	     * @param {*} target
	     * @param {*} source
	     * @param {boolen} [overlay=false]
	     * @memberOf module:zrender/core/util
	     */
	    function defaults(target, source, overlay) {
	        for (var key in source) {
	            if (source.hasOwnProperty(key)
	                && (overlay ? source[key] != null : target[key] == null)
	            ) {
	                target[key] = source[key];
	            }
	        }
	        return target;
	    }

	    function createCanvas() {
	        return document.createElement('canvas');
	    }
	    // FIXME
	    var _ctx;
	    function getContext() {
	        if (!_ctx) {
	            // Use util.createCanvas instead of createCanvas
	            // because createCanvas may be overwritten in different environment
	            _ctx = util.createCanvas().getContext('2d');
	        }
	        return _ctx;
	    }

	    /**
	     * 查询数组中元素的index
	     * @memberOf module:zrender/core/util
	     */
	    function indexOf(array, value) {
	        if (array) {
	            if (array.indexOf) {
	                return array.indexOf(value);
	            }
	            for (var i = 0, len = array.length; i < len; i++) {
	                if (array[i] === value) {
	                    return i;
	                }
	            }
	        }
	        return -1;
	    }

	    /**
	     * 构造类继承关系
	     *
	     * @memberOf module:zrender/core/util
	     * @param {Function} clazz 源类
	     * @param {Function} baseClazz 基类
	     */
	    function inherits(clazz, baseClazz) {
	        var clazzPrototype = clazz.prototype;
	        function F() {}
	        F.prototype = baseClazz.prototype;
	        clazz.prototype = new F();

	        for (var prop in clazzPrototype) {
	            clazz.prototype[prop] = clazzPrototype[prop];
	        }
	        clazz.prototype.constructor = clazz;
	        clazz.superClass = baseClazz;
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Object|Function} target
	     * @param {Object|Function} sorce
	     * @param {boolean} overlay
	     */
	    function mixin(target, source, overlay) {
	        target = 'prototype' in target ? target.prototype : target;
	        source = 'prototype' in source ? source.prototype : source;

	        defaults(target, source, overlay);
	    }

	    /**
	     * @param {Array|TypedArray} data
	     */
	    function isArrayLike(data) {
	        if (! data) {
	            return;
	        }
	        if (typeof data == 'string') {
	            return false;
	        }
	        return typeof data.length == 'number';
	    }

	    /**
	     * 数组或对象遍历
	     * @memberOf module:zrender/core/util
	     * @param {Object|Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     */
	    function each(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.forEach && obj.forEach === nativeForEach) {
	            obj.forEach(cb, context);
	        }
	        else if (obj.length === +obj.length) {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                cb.call(context, obj[i], i, obj);
	            }
	        }
	        else {
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    cb.call(context, obj[key], key, obj);
	                }
	            }
	        }
	    }

	    /**
	     * 数组映射
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function map(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.map && obj.map === nativeMap) {
	            return obj.map(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                result.push(cb.call(context, obj[i], i, obj));
	            }
	            return result;
	        }
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {Object} [memo]
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function reduce(obj, cb, memo, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.reduce && obj.reduce === nativeReduce) {
	            return obj.reduce(cb, memo, context);
	        }
	        else {
	            for (var i = 0, len = obj.length; i < len; i++) {
	                memo = cb.call(context, memo, obj[i], i, obj);
	            }
	            return memo;
	        }
	    }

	    /**
	     * 数组过滤
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function filter(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        if (obj.filter && obj.filter === nativeFilter) {
	            return obj.filter(cb, context);
	        }
	        else {
	            var result = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                if (cb.call(context, obj[i], i, obj)) {
	                    result.push(obj[i]);
	                }
	            }
	            return result;
	        }
	    }

	    /**
	     * 数组项查找
	     * @memberOf module:zrender/core/util
	     * @param {Array} obj
	     * @param {Function} cb
	     * @param {*} [context]
	     * @return {Array}
	     */
	    function find(obj, cb, context) {
	        if (!(obj && cb)) {
	            return;
	        }
	        for (var i = 0, len = obj.length; i < len; i++) {
	            if (cb.call(context, obj[i], i, obj)) {
	                return obj[i];
	            }
	        }
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @param {*} context
	     * @return {Function}
	     */
	    function bind(func, context) {
	        var args = nativeSlice.call(arguments, 2);
	        return function () {
	            return func.apply(context, args.concat(nativeSlice.call(arguments)));
	        };
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Function} func
	     * @return {Function}
	     */
	    function curry(func) {
	        var args = nativeSlice.call(arguments, 1);
	        return function () {
	            return func.apply(this, args.concat(nativeSlice.call(arguments)));
	        };
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isArray(value) {
	        return objToString.call(value) === '[object Array]';
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isFunction(value) {
	        return typeof value === 'function';
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isString(value) {
	        return objToString.call(value) === '[object String]';
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isObject(value) {
	        // Avoid a V8 JIT bug in Chrome 19-20.
	        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	        var type = typeof value;
	        return type === 'function' || (!!value && type == 'object');
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isBuildInObject(value) {
	        return !!BUILTIN_OBJECT[objToString.call(value)];
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isDom(value) {
	        return value && value.nodeType === 1
	               && typeof(value.nodeName) == 'string';
	    }

	    /**
	     * If value1 is not null, then return value1, otherwise judget rest of values.
	     * @memberOf module:zrender/core/util
	     * @return {*} Final value
	     */
	    function retrieve(values) {
	        for (var i = 0, len = arguments.length; i < len; i++) {
	            if (arguments[i] != null) {
	                return arguments[i];
	            }
	        }
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {Array} arr
	     * @param {number} startIndex
	     * @param {number} endIndex
	     * @return {Array}
	     */
	    function slice() {
	        return Function.call.apply(nativeSlice, arguments);
	    }

	    /**
	     * @memberOf module:zrender/core/util
	     * @param {boolean} condition
	     * @param {string} message
	     */
	    function assert(condition, message) {
	        if (!condition) {
	            throw new Error(message);
	        }
	    }

	    var util = {
	        inherits: inherits,
	        mixin: mixin,
	        clone: clone,
	        merge: merge,
	        mergeAll: mergeAll,
	        extend: extend,
	        defaults: defaults,
	        getContext: getContext,
	        createCanvas: createCanvas,
	        indexOf: indexOf,
	        slice: slice,
	        find: find,
	        isArrayLike: isArrayLike,
	        each: each,
	        map: map,
	        reduce: reduce,
	        filter: filter,
	        bind: bind,
	        curry: curry,
	        isArray: isArray,
	        isString: isString,
	        isObject: isObject,
	        isFunction: isFunction,
	        isBuildInObject: isBuildInObject,
	        isDom: isDom,
	        retrieve: retrieve,
	        assert: assert,
	        noop: function () {}
	    };
	    module.exports = util;



/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	/**
	 * 数值处理模块
	 * @module echarts/util/number
	 */



	    var number = {};

	    var RADIAN_EPSILON = 1e-4;

	    function _trim(str) {
	        return str.replace(/^\s+/, '').replace(/\s+$/, '');
	    }

	    /**
	     * Linear mapping a value from domain to range
	     * @memberOf module:echarts/util/number
	     * @param  {(number|Array.<number>)} val
	     * @param  {Array.<number>} domain Domain extent domain[0] can be bigger than domain[1]
	     * @param  {Array.<number>} range  Range extent range[0] can be bigger than range[1]
	     * @param  {boolean} clamp
	     * @return {(number|Array.<number>}
	     */
	    number.linearMap = function (val, domain, range, clamp) {
	        var subDomain = domain[1] - domain[0];
	        var subRange = range[1] - range[0];

	        if (subDomain === 0) {
	            return subRange === 0
	                ? range[0]
	                : (range[0] + range[1]) / 2;
	        }

	        // Avoid accuracy problem in edge, such as
	        // 146.39 - 62.83 === 83.55999999999999.
	        // See echarts/test/ut/spec/util/number.js#linearMap#accuracyError
	        // It is a little verbose for efficiency considering this method
	        // is a hotspot.
	        if (clamp) {
	            if (subDomain > 0) {
	                if (val <= domain[0]) {
	                    return range[0];
	                }
	                else if (val >= domain[1]) {
	                    return range[1];
	                }
	            }
	            else {
	                if (val >= domain[0]) {
	                    return range[0];
	                }
	                else if (val <= domain[1]) {
	                    return range[1];
	                }
	            }
	        }
	        else {
	            if (val === domain[0]) {
	                return range[0];
	            }
	            if (val === domain[1]) {
	                return range[1];
	            }
	        }

	        return (val - domain[0]) / subDomain * subRange + range[0];
	    };

	    /**
	     * Convert a percent string to absolute number.
	     * Returns NaN if percent is not a valid string or number
	     * @memberOf module:echarts/util/number
	     * @param {string|number} percent
	     * @param {number} all
	     * @return {number}
	     */
	    number.parsePercent = function(percent, all) {
	        switch (percent) {
	            case 'center':
	            case 'middle':
	                percent = '50%';
	                break;
	            case 'left':
	            case 'top':
	                percent = '0%';
	                break;
	            case 'right':
	            case 'bottom':
	                percent = '100%';
	                break;
	        }
	        if (typeof percent === 'string') {
	            if (_trim(percent).match(/%$/)) {
	                return parseFloat(percent) / 100 * all;
	            }

	            return parseFloat(percent);
	        }

	        return percent == null ? NaN : +percent;
	    };

	    /**
	     * Fix rounding error of float numbers
	     * @param {number} x
	     * @return {number}
	     */
	    number.round = function (x, precision) {
	        if (precision == null) {
	            precision = 10;
	        }
	        // Avoid range error
	        precision = Math.min(Math.max(0, precision), 20);
	        return +(+x).toFixed(precision);
	    };

	    number.asc = function (arr) {
	        arr.sort(function (a, b) {
	            return a - b;
	        });
	        return arr;
	    };

	    /**
	     * Get precision
	     * @param {number} val
	     */
	    number.getPrecision = function (val) {
	        val = +val;
	        if (isNaN(val)) {
	            return 0;
	        }
	        // It is much faster than methods converting number to string as follows
	        //      var tmp = val.toString();
	        //      return tmp.length - 1 - tmp.indexOf('.');
	        // especially when precision is low
	        var e = 1;
	        var count = 0;
	        while (Math.round(val * e) / e !== val) {
	            e *= 10;
	            count++;
	        }
	        return count;
	    };

	    number.getPrecisionSafe = function (val) {
	        var str = val.toString();
	        var dotIndex = str.indexOf('.');
	        if (dotIndex < 0) {
	            return 0;
	        }
	        return str.length - 1 - dotIndex;
	    };

	    /**
	     * @param {Array.<number>} dataExtent
	     * @param {Array.<number>} pixelExtent
	     * @return {number}  precision
	     */
	    number.getPixelPrecision = function (dataExtent, pixelExtent) {
	        var log = Math.log;
	        var LN10 = Math.LN10;
	        var dataQuantity = Math.floor(log(dataExtent[1] - dataExtent[0]) / LN10);
	        var sizeQuantity = Math.round(log(Math.abs(pixelExtent[1] - pixelExtent[0])) / LN10);
	        return Math.max(
	            -dataQuantity + sizeQuantity,
	            0
	        );
	    };

	    // Number.MAX_SAFE_INTEGER, ie do not support.
	    number.MAX_SAFE_INTEGER = 9007199254740991;

	    /**
	     * To 0 - 2 * PI, considering negative radian.
	     * @param {number} radian
	     * @return {number}
	     */
	    number.remRadian = function (radian) {
	        var pi2 = Math.PI * 2;
	        return (radian % pi2 + pi2) % pi2;
	    };

	    /**
	     * @param {type} radian
	     * @return {boolean}
	     */
	    number.isRadianAroundZero = function (val) {
	        return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
	    };

	    /**
	     * @param {string|Date|number} value
	     * @return {Date} date
	     */
	    number.parseDate = function (value) {
	        if (value instanceof Date) {
	            return value;
	        }
	        else if (typeof value === 'string') {
	            // Treat as ISO format. See issue #3623
	            var ret = new Date(value);
	            if (isNaN(+ret)) {
	                // FIXME new Date('1970-01-01') is UTC, new Date('1970/01/01') is local
	                ret = new Date(new Date(value.replace(/-/g, '/')) - new Date('1970/01/01'));
	            }
	            return ret;
	        }

	        return new Date(Math.round(value));
	    };

	    /**
	     * Quantity of a number. e.g. 0.1, 1, 10, 100
	     * @param  {number} val
	     * @return {number}
	     */
	    number.quantity = function (val) {
	        return Math.pow(10, Math.floor(Math.log(val) / Math.LN10));
	    };

	    // "Nice Numbers for Graph Labels" of Graphic Gems
	    /**
	     * find a “nice” number approximately equal to x. Round the number if round = true, take ceiling if round = false
	     * The primary observation is that the “nicest” numbers in decimal are 1, 2, and 5, and all power-of-ten multiples of these numbers.
	     * @param  {number} val
	     * @param  {boolean} round
	     * @return {number}
	     */
	    number.nice = function (val, round) {
	        var exp10 = number.quantity(val);
	        var f = val / exp10; // between 1 and 10
	        var nf;
	        if (round) {
	            if (f < 1.5) { nf = 1; }
	            else if (f < 2.5) { nf = 2; }
	            else if (f < 4) { nf = 3; }
	            else if (f < 7) { nf = 5; }
	            else { nf = 10; }
	        }
	        else {
	            if (f < 1) { nf = 1; }
	            else if (f < 2) { nf = 2; }
	            else if (f < 3) { nf = 3; }
	            else if (f < 5) { nf = 5; }
	            else { nf = 10; }
	        }
	        return nf * exp10;
	    };

	    module.exports = number;


/***/ },
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var completeDimensions = __webpack_require__(12);
	var echarts = __webpack_require__(2);

	echarts.extendSeriesModel({

	    type: 'series.liquidFill',

	    visualColorAccessPath: 'textStyle.normal.color',

	    optionUpdated: function () {
	        var option = this.option;
	        option.gridSize = Math.max(Math.floor(option.gridSize), 4);
	    },

	    getInitialData: function (option, ecModel) {
	        var dimensions = completeDimensions(['value'], option.data);
	        var list = new echarts.List(dimensions, this);
	        list.initData(option.data);
	        return list;
	    },

	    defaultOption: {
	        color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'],
	        center: ['50%', '50%'],
	        radius: '80%',
	        amplitude: 10,
	        waveLength: '50%',
	        phase: 0,
	        speed: 2000,
	        direction: 'right',

	        itemStyle: {
	            normal: {
	                skyColor: '#C8FFFB',
	                borderColor: '#294D99',
	                borderWidth: 10,
	                borderDistance: 10,
	                opacity: 1
	            },
	            emphasis: {
	                skyColor: '#293c55',
	                borderColor: '#294D99',
	                borderWidth: 10,
	                borderDistance: 10,
	                opacity: 1
	            }
	        },

	        label: {
	            normal: {
	                show: true,
	                position: 'outer',
	                textStyle: {
	                    color: '#294D99',
	                    insideColor: '#fff',
	                    fontSize: 50,
	                    fontWeight: 'bold'
	                },
	                textAlign: 'center',
	                textVerticalAlign: 'middle'
	            }
	        }
	    }
	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Complete dimensions by data (guess dimension).
	 */


	    var zrUtil = __webpack_require__(4);

	    /**
	     * Complete the dimensions array guessed from the data structure.
	     * @param  {Array.<string>} dimensions      Necessary dimensions, like ['x', 'y']
	     * @param  {Array} data                     Data list. [[1, 2, 3], [2, 3, 4]]
	     * @param  {Array.<string>} defaultNames    Default names to fill not necessary dimensions, like ['value']
	     * @param  {string} extraPrefix             Prefix of name when filling the left dimensions.
	     * @return {Array.<string>}
	     */
	    function completeDimensions(dimensions, data, defaultNames, extraPrefix) {
	        if (!data) {
	            return dimensions;
	        }

	        var value0 = retrieveValue(data[0]);
	        var dimSize = zrUtil.isArray(value0) && value0.length || 1;

	        defaultNames = defaultNames || [];
	        extraPrefix = extraPrefix || 'extra';
	        for (var i = 0; i < dimSize; i++) {
	            if (!dimensions[i]) {
	                var name = defaultNames[i] || (extraPrefix + (i - defaultNames.length));
	                dimensions[i] = guessOrdinal(data, i)
	                    ? {type: 'ordinal', name: name}
	                    : name;
	            }
	        }

	        return dimensions;
	    }

	    // The rule should not be complex, otherwise user might not
	    // be able to known where the data is wrong.
	    var guessOrdinal = completeDimensions.guessOrdinal = function (data, dimIndex) {
	        for (var i = 0, len = data.length; i < len; i++) {
	            var value = retrieveValue(data[i]);

	            if (!zrUtil.isArray(value)) {
	                return false;
	            }

	            var value = value[dimIndex];
	            if (value != null && isFinite(value)) {
	                return false;
	            }
	            else if (zrUtil.isString(value) && value !== '-') {
	                return true;
	            }
	        }
	        return false;
	    };

	    function retrieveValue(o) {
	        return zrUtil.isArray(o) ? o : zrUtil.isObject(o) ? o.value: o;
	    }

	    module.exports = completeDimensions;



/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var echarts = __webpack_require__(2);
	var numberUtil = __webpack_require__(8);
	var parsePercent = numberUtil.parsePercent;

	var LiquidLayout = __webpack_require__(14);

	function getShallow(model, path) {
	    return model && model.getShallow(path);
	}

	echarts.extendChartView({

	    type: 'liquidFill',

	    render: function (seriesModel, ecModel, api) {
	        var group = this.group;
	        group.removeAll();

	        var data = seriesModel.getData();

	        var itemModel = data.getItemModel(0);

	        var center = itemModel.get('center');
	        var radius = itemModel.get('radius');
	        var phase = itemModel.get('phase');
	        var maxSpeed = itemModel.get('speed');
	        var direction = itemModel.get('direction');

	        // itemStyle
	        var normal = itemModel.get('itemStyle.normal');
	        var waterColor = normal.waterColor;
	        var skyColor = normal.skyColor;
	        var borderColor = normal.borderColor;
	        var borderWidth = normal.borderWidth;
	        var borderDistance = normal.borderDistance;
	        var opacity = normal.opacity;

	        var width = api.getWidth();
	        var height = api.getHeight();
	        var size = Math.min(width, height);
	        var cx = parsePercent(center[0], width);
	        var cy = parsePercent(center[1], height);
	        var borderWidth = parsePercent(borderWidth, size);
	        var outterRadius = parsePercent(radius, size) / 2;
	        var innerRadius = outterRadius - borderWidth;
	        var paddingRadius = parsePercent(borderDistance, size);

	        var wavePath = null;

	        var borderRing = new echarts.graphic.Ring({
	            shape: {
	                cx: cx,
	                cy: cy,
	                r: innerRadius,
	                r0: outterRadius
	            },
	            style: {
	                fill: borderColor
	            }
	        });
	        group.add(borderRing);

	        var radius = innerRadius - paddingRadius;
	        var waveLength = parsePercent(itemModel.get('waveLength'), radius * 2);
	        var amplitude = itemModel.get('amplitude');
	        amplitude = typeof amplitude === 'number' ? [amplitude, amplitude]
	            : amplitude;
	        var left = cx - radius;
	        var top = cy - radius;

	        group.add(getBackground());

	        // each data item for a wave
	        var waves = [];
	        data.each(function (idx) {
	            var wave = getWave(idx, false);
	            group.add(wave);
	            waves.push(wave);
	        });

	        group.add(getText(waves));

	        // data.setItemGraphicEl(0, borderRing);

	        /**
	         * sky circle for wave
	         */
	        function getBackground() {
	            return new echarts.graphic.Circle({
	                shape: {
	                    cx: cx,
	                    cy: cy,
	                    r: radius
	                },
	                style: {
	                    fill: skyColor
	                }
	            });
	        }

	        /**
	         * wave shape
	         */
	        function getWave(idx, isInverse) {
	            var value = data.get('value', idx);
	            var value0 = data.get('value', 0);

	            var waterLevel = radius - value * radius * 2;
	            var phase = idx * Math.PI / 3;
	            var waterColor = data.getItemVisual(idx, 'color');
	            var cnt = data.count();
	            var speed = value0 === 0 ? maxSpeed : maxSpeed * value / value0;

	            var x = direction === 'left' ? radius * 2 : 0;

	            var wave = new LiquidLayout({
	                shape: {
	                    waveLength: waveLength,
	                    radius: radius,
	                    cx: x,
	                    cy: 0,
	                    waterLevel: waterLevel,
	                    amplitude: amplitude[1],
	                    borderWidth: borderWidth,
	                    borderDistance: paddingRadius,
	                    phase: phase,
	                    inverse: isInverse
	                },
	                style: {
	                    fill: waterColor
	                },
	                position: [cx, cy]
	            });

	            // clip out the part outside the circle
	            wave.setClipPath(new echarts.graphic.Circle({
	                shape: {
	                    cx: 0,
	                    cy: 0,
	                    r: radius
	                }
	            }));

	            // phase for moving left/right
	            var phaseOffset = 0;
	            if (direction === 'right' || direction == undefined) {
	                phaseOffset = Math.PI;
	            }
	            else if (direction === 'left') {
	                phaseOffset = -Math.PI;
	            }
	            else if (direction === 'none') {
	                phaseOffset = 0;
	            }
	            else {
	                console.error('Illegal direction value for liquid fill.');
	            }

	            // wave animation of moving left/right and changing amplitude
	            wave.animate('shape', true)
	                .when(0, {
	                    phase: phase,
	                    amplitude: amplitude[1]
	                })
	                .when(speed / 2, {
	                    phase: phaseOffset + phase,
	                    amplitude: amplitude[0]
	                })
	                .when(speed, {
	                    phase: phaseOffset * 2 + phase,
	                    amplitude: amplitude[1]
	                })
	                .during(function () {
	                    if (wavePath) {
	                        wavePath.dirty(true);
	                    }
	                })
	                .start();

	            return wave;
	        }

	        /**
	         * text on wave
	         */
	        function getText(waves) {
	            var labelModel = itemModel.getModel('label.normal');
	            var textStyle = labelModel.getModel('textStyle');

	            var insideStyle = {
	                text: Math.ceil(data.get('value', 0) * 100) + '%',
	                x: cx,
	                y: cy - 50,
	                fill: labelModel.get('textStyle').color,
	                textAlign: labelModel.get('textAlign'),
	                textVerticalAlign: labelModel.get('textVerticalAlign'),
	                textFont: textStyle.getFont()
	            };

	            var outsideText = new echarts.graphic.Text({
	                style: insideStyle,
	                silent: true
	            });
	            console.log(outsideText.getBoundingRect());

	            var insideStyle = Object.assign({}, insideStyle);
	            insideStyle.fill = labelModel.get('textStyle').insideColor;
	            var insideText = new echarts.graphic.Text({
	                style: insideStyle,
	                silent: true
	            });

	            // clip out waves for insideText
	            var boundingCircle = new echarts.graphic.Circle({
	                shape: {
	                    cx: 0,
	                    cy: 0,
	                    r: radius
	                }
	            });

	            wavePath = new echarts.graphic.CompoundPath({
	                shape: {
	                    paths: waves
	                },
	                position: [cx, cy]
	            });

	            wavePath.setClipPath(boundingCircle);
	            insideText.setClipPath(wavePath);

	            var group = new echarts.graphic.Group();
	            group.add(outsideText);
	            group.add(insideText);

	            return group;
	        }
	    }
	});


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var echarts = __webpack_require__(2);

	module.exports = echarts.graphic.extendShape({
	    type: 'ec-liquid-fill',

	    shape: {
	        waveLength: 0,
	        radius: 0,
	        cx: 0,
	        cy: 0,
	        waterLevel: 0,
	        amplitude: 0,
	        borderWidth: 0,
	        borderDistance: 0,
	        phase: 0,
	        inverse: false
	    },

	    style: {
	        fill: '#0f0'
	    },

	    buildPath: function (ctx, shape) {
	        var curves = Math.ceil(2 * shape.radius / shape.waveLength * 4) * 2;
	        var controls = [[0, 0]];
	        var positions = [];

	        // map phase to [-Math.PI * 2, 0]
	        while (shape.phase < -Math.PI * 2) {
	            shape.phase += Math.PI * 2;
	        }
	        while (shape.phase > 0) {
	            shape.phase -= Math.PI * 2;
	        }
	        var phase = shape.phase / Math.PI / 2 * shape.waveLength;

	        var left = shape.cx - shape.radius + phase - shape.radius * 2;

	        /**
	         * top-left corner as start point
	         *
	         * draws this point
	         *  |
	         * \|/
	         *  ~~~~~~~~
	         *  |      |
	         *  +------+
	         */
	        ctx.moveTo(left, shape.waterLevel);

	        /**
	         * top wave
	         *
	         * ~~~~~~~~ <- draws this sine wave
	         * |      |
	         * +------+
	         */
	        var waveLeft = 0;
	        var waveRight = 0;
	        for (var c = 0; c < curves; ++c) {
	            var stage = c % 4;
	            var pos = getWaterPositions(c * shape.waveLength / 4, stage,
	                shape.waveLength, shape.amplitude);
	            ctx.bezierCurveTo(pos[0][0] + left, -pos[0][1] + shape.waterLevel,
	                pos[1][0] + left, -pos[1][1] + shape.waterLevel,
	                pos[2][0] + left, -pos[2][1] + shape.waterLevel);

	            if (c === curves - 1) {
	                waveRight = pos[2][0];
	            }
	        }

	        if (shape.inverse) {
	            /**
	             * top-right corner
	             *                  2. draws this line
	             *                          |
	             *                       +------+
	             * 3. draws this line -> |      | <- 1. draws this line
	             *                       ~~~~~~~~
	             */
	            ctx.lineTo(waveRight + left, shape.cy - shape.radius);
	            ctx.lineTo(left, shape.cy - shape.radius);
	            ctx.lineTo(left, shape.waterLevel);
	        }
	        else {
	            /**
	             * top-right corner
	             *
	             *                       ~~~~~~~~
	             * 3. draws this line -> |      | <- 1. draws this line
	             *                       +------+
	             *                          ^
	             *                          |
	             *                  2. draws this line
	             */
	            ctx.lineTo(waveRight + left, shape.cy + shape.radius);
	            ctx.lineTo(left, shape.cy + shape.radius);
	            ctx.lineTo(left, shape.waterLevel);
	        }

	        ctx.closePath();

	        // ctx.stroke();
	    }
	});



	/**
	 * Using Bezier curves to fit sine wave.
	 * There is 4 control points for each curve of wave,
	 * which is at 1/4 wave length of the sine wave.
	 *
	 * The control points for a wave from (a) to (d) are a-b-c-d:
	 *          c *----* d
	 *     b *
	 *       |
	 * ... a * ..................
	 *
	 * whose positions are a: (0, 0), b: (0.5, 0.5), c: (1, 1), d: (PI / 2, 1)
	 *
	 * @param {number} x          x position of the left-most point (a)
	 * @param {number} stage      0-3, stating which part of the wave it is
	 * @param {number} waveLength wave length of the sine wave
	 * @param {number} amplitude  wave amplitude
	 */
	function getWaterPositions(x, stage, waveLength, amplitude) {
	    if (stage === 0) {
	        return [
	            [x + 1 / 2 * waveLength / Math.PI / 2, amplitude / 2],
	            [x + 1 / 2 * waveLength / Math.PI,     amplitude],
	            [x + waveLength / 4,                   amplitude]
	        ];
	    }
	    else if (stage === 1) {
	        return [
	            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2),
	            amplitude],
	            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1),
	            amplitude / 2],
	            [x + waveLength / 4,                   0]
	        ]
	    }
	    else if (stage === 2) {
	        return [
	            [x + 1 / 2 * waveLength / Math.PI / 2, -amplitude / 2],
	            [x + 1 / 2 * waveLength / Math.PI,     -amplitude],
	            [x + waveLength / 4,                   -amplitude]
	        ]
	    }
	    else {
	        return [
	            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 2),
	            -amplitude],
	            [x + 1 / 2 * waveLength / Math.PI / 2 * (Math.PI - 1),
	            -amplitude / 2],
	            [x + waveLength / 4,                   0]
	        ]
	    }
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	// Pick color from palette for each data item


	    module.exports = function (seriesType, ecModel) {
	        // Pie and funnel may use diferrent scope
	        var paletteScope = {};
	        ecModel.eachRawSeriesByType(seriesType, function (seriesModel) {
	            var dataAll = seriesModel.getRawData();
	            var idxMap = {};
	            if (!ecModel.isSeriesFiltered(seriesModel)) {
	                var data = seriesModel.getData();
	                data.each(function (idx) {
	                    var rawIdx = data.getRawIndex(idx);
	                    idxMap[rawIdx] = idx;
	                });
	                dataAll.each(function (rawIdx) {
	                    // FIXME Performance
	                    var itemModel = dataAll.getItemModel(rawIdx);
	                    var filteredIdx = idxMap[rawIdx];

	                    // If series.itemStyle.normal.color is a function. itemVisual may be encoded
	                    var singleDataColor = filteredIdx != null
	                        && data.getItemVisual(filteredIdx, 'color', true);

	                    if (!singleDataColor) {
	                        var color = itemModel.get('itemStyle.normal.color')
	                            || seriesModel.getColorFromPalette(dataAll.getName(rawIdx), paletteScope);
	                        // Legend may use the visual info in data before processed
	                        dataAll.setItemVisual(rawIdx, 'color', color);

	                        // Data is not filtered
	                        if (filteredIdx != null) {
	                            data.setItemVisual(filteredIdx, 'color', color);
	                        }
	                    }
	                    else {
	                        // Set data all color for legend
	                        dataAll.setItemVisual(rawIdx, 'color', singleDataColor);
	                    }
	                });
	            }
	        });
	    };


/***/ }
/******/ ])
});
;