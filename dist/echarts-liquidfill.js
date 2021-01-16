(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("echarts"));
	else if(typeof define === 'function' && define.amd)
		define(["echarts"], factory);
	else if(typeof exports === 'object')
		exports["echarts-liquidfill"] = factory(require("echarts"));
	else
		root["echarts-liquidfill"] = factory(root["echarts"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE_echarts_lib_echarts__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************************!*\
  !*** ./index.js + 6 modules ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "echarts"
var external_echarts_ = __webpack_require__("echarts/lib/echarts");
;// CONCATENATED MODULE: ./src/liquidFillSeries.js


external_echarts_.extendSeriesModel({

    type: 'series.liquidFill',

    optionUpdated: function () {
        var option = this.option;
        option.gridSize = Math.max(Math.floor(option.gridSize), 4);
    },

    getInitialData: function (option, ecModel) {
        var dimensions = external_echarts_.helper.createDimensions(option.data, {
            coordDimensions: ['value']
        });
        var list = new external_echarts_.List(dimensions, this);
        list.initData(option.data);
        return list;
    },

    defaultOption: {
        color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'],
        center: ['50%', '50%'],
        radius: '50%',
        amplitude: '8%',
        waveLength: '80%',
        phase: 'auto',
        period: 'auto',
        direction: 'right',
        shape: 'circle',

        waveAnimation: true,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        animationDuration: 2000,
        animationDurationUpdate: 1000,

        outline: {
            show: true,
            borderDistance: 8,
            itemStyle: {
                color: 'none',
                borderColor: '#294D99',
                borderWidth: 8,
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.25)'
            }
        },

        backgroundStyle: {
            color: '#E3F7FF'
        },

        itemStyle: {
            opacity: 0.95,
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
        },

        label: {
            show: true,
            color: '#294D99',
            insideColor: '#fff',
            fontSize: 50,
            fontWeight: 'bold',

            align: 'center',
            baseline: 'middle',
            position: 'inside'
        },

        emphasis: {
            itemStyle: {
                opacity: 0.8
            }
        }
    }
});

;// CONCATENATED MODULE: ./node_modules/zrender/lib/core/util.js
var BUILTIN_OBJECT = {
    '[object Function]': true,
    '[object RegExp]': true,
    '[object Date]': true,
    '[object Error]': true,
    '[object CanvasGradient]': true,
    '[object CanvasPattern]': true,
    '[object Image]': true,
    '[object Canvas]': true
};
var TYPED_ARRAY = {
    '[object Int8Array]': true,
    '[object Uint8Array]': true,
    '[object Uint8ClampedArray]': true,
    '[object Int16Array]': true,
    '[object Uint16Array]': true,
    '[object Int32Array]': true,
    '[object Uint32Array]': true,
    '[object Float32Array]': true,
    '[object Float64Array]': true
};
var objToString = Object.prototype.toString;
var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeFilter = arrayProto.filter;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;
var ctorFunction = function () { }.constructor;
var protoFunction = ctorFunction ? ctorFunction.prototype : null;
var methods = {};
function $override(name, fn) {
    methods[name] = fn;
}
var idStart = 0x0907;
function guid() {
    return idStart++;
}
function logError() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (typeof console !== 'undefined') {
        console.error.apply(console, args);
    }
}
function clone(source) {
    if (source == null || typeof source !== 'object') {
        return source;
    }
    var result = source;
    var typeStr = objToString.call(source);
    if (typeStr === '[object Array]') {
        if (!isPrimitive(source)) {
            result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                result[i] = clone(source[i]);
            }
        }
    }
    else if (TYPED_ARRAY[typeStr]) {
        if (!isPrimitive(source)) {
            var Ctor = source.constructor;
            if (Ctor.from) {
                result = Ctor.from(source);
            }
            else {
                result = new Ctor(source.length);
                for (var i = 0, len = source.length; i < len; i++) {
                    result[i] = clone(source[i]);
                }
            }
        }
    }
    else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
        result = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key]);
            }
        }
    }
    return result;
}
function merge(target, source, overwrite) {
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
                && !isBuiltInObject(sourceProp)
                && !isBuiltInObject(targetProp)
                && !isPrimitive(sourceProp)
                && !isPrimitive(targetProp)) {
                merge(targetProp, sourceProp, overwrite);
            }
            else if (overwrite || !(key in target)) {
                target[key] = clone(source[key]);
            }
        }
    }
    return target;
}
function mergeAll(targetAndSources, overwrite) {
    var result = targetAndSources[0];
    for (var i = 1, len = targetAndSources.length; i < len; i++) {
        result = merge(result, targetAndSources[i], overwrite);
    }
    return result;
}
function extend(target, source) {
    if (Object.assign) {
        Object.assign(target, source);
    }
    else {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
function defaults(target, source, overlay) {
    var keysArr = keys(source);
    for (var i = 0; i < keysArr.length; i++) {
        var key = keysArr[i];
        if ((overlay ? source[key] != null : target[key] == null)) {
            target[key] = source[key];
        }
    }
    return target;
}
var createCanvas = function () {
    return methods.createCanvas();
};
methods.createCanvas = function () {
    return document.createElement('canvas');
};
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
function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;
    function F() { }
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();
    for (var prop in clazzPrototype) {
        if (clazzPrototype.hasOwnProperty(prop)) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}
function mixin(target, source, override) {
    target = 'prototype' in target ? target.prototype : target;
    source = 'prototype' in source ? source.prototype : source;
    if (Object.getOwnPropertyNames) {
        var keyList = Object.getOwnPropertyNames(source);
        for (var i = 0; i < keyList.length; i++) {
            var key = keyList[i];
            if (key !== 'constructor') {
                if ((override ? source[key] != null : target[key] == null)) {
                    target[key] = source[key];
                }
            }
        }
    }
    else {
        defaults(target, source, override);
    }
}
function isArrayLike(data) {
    if (!data) {
        return false;
    }
    if (typeof data === 'string') {
        return false;
    }
    return typeof data.length === 'number';
}
function each(arr, cb, context) {
    if (!(arr && cb)) {
        return;
    }
    if (arr.forEach && arr.forEach === nativeForEach) {
        arr.forEach(cb, context);
    }
    else if (arr.length === +arr.length) {
        for (var i = 0, len = arr.length; i < len; i++) {
            cb.call(context, arr[i], i, arr);
        }
    }
    else {
        for (var key in arr) {
            if (arr.hasOwnProperty(key)) {
                cb.call(context, arr[key], key, arr);
            }
        }
    }
}
function map(arr, cb, context) {
    if (!arr) {
        return [];
    }
    if (!cb) {
        return slice(arr);
    }
    if (arr.map && arr.map === nativeMap) {
        return arr.map(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            result.push(cb.call(context, arr[i], i, arr));
        }
        return result;
    }
}
function reduce(arr, cb, memo, context) {
    if (!(arr && cb)) {
        return;
    }
    for (var i = 0, len = arr.length; i < len; i++) {
        memo = cb.call(context, memo, arr[i], i, arr);
    }
    return memo;
}
function filter(arr, cb, context) {
    if (!arr) {
        return [];
    }
    if (!cb) {
        return slice(arr);
    }
    if (arr.filter && arr.filter === nativeFilter) {
        return arr.filter(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (cb.call(context, arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    }
}
function find(arr, cb, context) {
    if (!(arr && cb)) {
        return;
    }
    for (var i = 0, len = arr.length; i < len; i++) {
        if (cb.call(context, arr[i], i, arr)) {
            return arr[i];
        }
    }
}
function keys(obj) {
    if (!obj) {
        return [];
    }
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keyList = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keyList.push(key);
        }
    }
    return keyList;
}
function bindPolyfill(func, context) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return function () {
        return func.apply(context, args.concat(nativeSlice.call(arguments)));
    };
}
var bind = (protoFunction && isFunction(protoFunction.bind))
    ? protoFunction.call.bind(protoFunction.bind)
    : bindPolyfill;
function curry(func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        return func.apply(this, args.concat(nativeSlice.call(arguments)));
    };
}

function isArray(value) {
    if (Array.isArray) {
        return Array.isArray(value);
    }
    return objToString.call(value) === '[object Array]';
}
function isFunction(value) {
    return typeof value === 'function';
}
function isString(value) {
    return typeof value === 'string';
}
function isStringSafe(value) {
    return objToString.call(value) === '[object String]';
}
function isNumber(value) {
    return typeof value === 'number';
}
function isObject(value) {
    var type = typeof value;
    return type === 'function' || (!!value && type === 'object');
}
function isBuiltInObject(value) {
    return !!BUILTIN_OBJECT[objToString.call(value)];
}
function isTypedArray(value) {
    return !!TYPED_ARRAY[objToString.call(value)];
}
function isDom(value) {
    return typeof value === 'object'
        && typeof value.nodeType === 'number'
        && typeof value.ownerDocument === 'object';
}
function isGradientObject(value) {
    return value.colorStops != null;
}
function isPatternObject(value) {
    return value.image != null;
}
function isRegExp(value) {
    return objToString.call(value) === '[object RegExp]';
}
function eqNaN(value) {
    return value !== value;
}
function retrieve() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    for (var i = 0, len = args.length; i < len; i++) {
        if (args[i] != null) {
            return args[i];
        }
    }
}
function retrieve2(value0, value1) {
    return value0 != null
        ? value0
        : value1;
}
function retrieve3(value0, value1, value2) {
    return value0 != null
        ? value0
        : value1 != null
            ? value1
            : value2;
}
function slice(arr) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return nativeSlice.apply(arr, args);
}
function normalizeCssArray(val) {
    if (typeof (val) === 'number') {
        return [val, val, val, val];
    }
    var len = val.length;
    if (len === 2) {
        return [val[0], val[1], val[0], val[1]];
    }
    else if (len === 3) {
        return [val[0], val[1], val[2], val[1]];
    }
    return val;
}
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
function trim(str) {
    if (str == null) {
        return null;
    }
    else if (typeof str.trim === 'function') {
        return str.trim();
    }
    else {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
}
var primitiveKey = '__ec_primitive__';
function setAsPrimitive(obj) {
    obj[primitiveKey] = true;
}
function isPrimitive(obj) {
    return obj[primitiveKey];
}
var HashMap = (function () {
    function HashMap(obj) {
        this.data = {};
        var isArr = isArray(obj);
        this.data = {};
        var thisMap = this;
        (obj instanceof HashMap)
            ? obj.each(visit)
            : (obj && each(obj, visit));
        function visit(value, key) {
            isArr ? thisMap.set(value, key) : thisMap.set(key, value);
        }
    }
    HashMap.prototype.get = function (key) {
        return this.data.hasOwnProperty(key) ? this.data[key] : null;
    };
    HashMap.prototype.set = function (key, value) {
        return (this.data[key] = value);
    };
    HashMap.prototype.each = function (cb, context) {
        for (var key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                cb.call(context, this.data[key], key);
            }
        }
    };
    HashMap.prototype.keys = function () {
        return keys(this.data);
    };
    HashMap.prototype.removeKey = function (key) {
        delete this.data[key];
    };
    return HashMap;
}());

function createHashMap(obj) {
    return new HashMap(obj);
}
function concatArray(a, b) {
    var newArray = new a.constructor(a.length + b.length);
    for (var i = 0; i < a.length; i++) {
        newArray[i] = a[i];
    }
    var offset = a.length;
    for (var i = 0; i < b.length; i++) {
        newArray[i + offset] = b[i];
    }
    return newArray;
}
function createObject(proto, properties) {
    var obj;
    if (Object.create) {
        obj = Object.create(proto);
    }
    else {
        var StyleCtor = function () { };
        StyleCtor.prototype = proto;
        obj = new StyleCtor();
    }
    if (properties) {
        extend(obj, properties);
    }
    return obj;
}
function hasOwn(own, prop) {
    return own.hasOwnProperty(prop);
}
function noop() { }

;// CONCATENATED MODULE: ./node_modules/echarts/lib/util/number.js

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */


var RADIAN_EPSILON = 1e-4;

function _trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function linearMap(val, domain, range, clamp) {
  var subDomain = domain[1] - domain[0];
  var subRange = range[1] - range[0];

  if (subDomain === 0) {
    return subRange === 0 ? range[0] : (range[0] + range[1]) / 2;
  }

  if (clamp) {
    if (subDomain > 0) {
      if (val <= domain[0]) {
        return range[0];
      } else if (val >= domain[1]) {
        return range[1];
      }
    } else {
      if (val >= domain[0]) {
        return range[0];
      } else if (val <= domain[1]) {
        return range[1];
      }
    }
  } else {
    if (val === domain[0]) {
      return range[0];
    }

    if (val === domain[1]) {
      return range[1];
    }
  }

  return (val - domain[0]) / subDomain * subRange + range[0];
}
function parsePercent(percent, all) {
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
}
function round(x, precision, returnStr) {
  if (precision == null) {
    precision = 10;
  }

  precision = Math.min(Math.max(0, precision), 20);
  x = (+x).toFixed(precision);
  return returnStr ? x : +x;
}
function asc(arr) {
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr;
}
function getPrecision(val) {
  val = +val;

  if (isNaN(val)) {
    return 0;
  }

  var e = 1;
  var count = 0;

  while (Math.round(val * e) / e !== val) {
    e *= 10;
    count++;
  }

  return count;
}
function getPrecisionSafe(val) {
  var str = val.toString();
  var eIndex = str.indexOf('e');

  if (eIndex > 0) {
    var precision = +str.slice(eIndex + 1);
    return precision < 0 ? -precision : 0;
  } else {
    var dotIndex = str.indexOf('.');
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex;
  }
}
function getPixelPrecision(dataExtent, pixelExtent) {
  var log = Math.log;
  var LN10 = Math.LN10;
  var dataQuantity = Math.floor(log(dataExtent[1] - dataExtent[0]) / LN10);
  var sizeQuantity = Math.round(log(Math.abs(pixelExtent[1] - pixelExtent[0])) / LN10);
  var precision = Math.min(Math.max(-dataQuantity + sizeQuantity, 0), 20);
  return !isFinite(precision) ? 20 : precision;
}
function getPercentWithPrecision(valueList, idx, precision) {
  if (!valueList[idx]) {
    return 0;
  }

  var sum = reduce(valueList, function (acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  if (sum === 0) {
    return 0;
  }

  var digits = Math.pow(10, precision);
  var votesPerQuota = map(valueList, function (val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100;
  });
  var targetSeats = digits * 100;
  var seats = map(votesPerQuota, function (votes) {
    return Math.floor(votes);
  });
  var currentSum = reduce(seats, function (acc, val) {
    return acc + val;
  }, 0);
  var remainder = map(votesPerQuota, function (votes, idx) {
    return votes - seats[idx];
  });

  while (currentSum < targetSeats) {
    var max = Number.NEGATIVE_INFINITY;
    var maxId = null;

    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    }

    ++seats[maxId];
    remainder[maxId] = 0;
    ++currentSum;
  }

  return seats[idx] / digits;
}
var MAX_SAFE_INTEGER = 9007199254740991;
function remRadian(radian) {
  var pi2 = Math.PI * 2;
  return (radian % pi2 + pi2) % pi2;
}
function isRadianAroundZero(val) {
  return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
}
var TIME_REG = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function parseDate(value) {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'string') {
    var match = TIME_REG.exec(value);

    if (!match) {
      return new Date(NaN);
    }

    if (!match[8]) {
      return new Date(+match[1], +(match[2] || 1) - 1, +match[3] || 1, +match[4] || 0, +(match[5] || 0), +match[6] || 0, +match[7] || 0);
    } else {
      var hour = +match[4] || 0;

      if (match[8].toUpperCase() !== 'Z') {
        hour -= +match[8].slice(0, 3);
      }

      return new Date(Date.UTC(+match[1], +(match[2] || 1) - 1, +match[3] || 1, hour, +(match[5] || 0), +match[6] || 0, +match[7] || 0));
    }
  } else if (value == null) {
    return new Date(NaN);
  }

  return new Date(Math.round(value));
}
function quantity(val) {
  return Math.pow(10, quantityExponent(val));
}
function quantityExponent(val) {
  if (val === 0) {
    return 0;
  }

  var exp = Math.floor(Math.log(val) / Math.LN10);

  if (val / Math.pow(10, exp) >= 10) {
    exp++;
  }

  return exp;
}
function nice(val, round) {
  var exponent = quantityExponent(val);
  var exp10 = Math.pow(10, exponent);
  var f = val / exp10;
  var nf;

  if (round) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }

  val = nf * exp10;
  return exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;
}
function quantile(ascArr, p) {
  var H = (ascArr.length - 1) * p + 1;
  var h = Math.floor(H);
  var v = +ascArr[h - 1];
  var e = H - h;
  return e ? v + e * (ascArr[h] - v) : v;
}
function reformIntervals(list) {
  list.sort(function (a, b) {
    return littleThan(a, b, 0) ? -1 : 1;
  });
  var curr = -Infinity;
  var currClose = 1;

  for (var i = 0; i < list.length;) {
    var interval = list[i].interval;
    var close_1 = list[i].close;

    for (var lg = 0; lg < 2; lg++) {
      if (interval[lg] <= curr) {
        interval[lg] = curr;
        close_1[lg] = !lg ? 1 - currClose : 1;
      }

      curr = interval[lg];
      currClose = close_1[lg];
    }

    if (interval[0] === interval[1] && close_1[0] * close_1[1] !== 1) {
      list.splice(i, 1);
    } else {
      i++;
    }
  }

  return list;

  function littleThan(a, b, lg) {
    return a.interval[lg] < b.interval[lg] || a.interval[lg] === b.interval[lg] && (a.close[lg] - b.close[lg] === (!lg ? 1 : -1) || !lg && littleThan(a, b, 1));
  }
}
function numericToNumber(val) {
  var valFloat = parseFloat(val);
  return valFloat == val && (valFloat !== 0 || typeof val !== 'string' || val.indexOf('x') <= 0) ? valFloat : NaN;
}
function isNumeric(val) {
  return !isNaN(numericToNumber(val));
}
function getRandomIdBase() {
  return Math.round(Math.random() * 9);
}
function getGreatestCommonDividor(a, b) {
  if (b === 0) {
    return a;
  }

  return getGreatestCommonDividor(b, a % b);
}
function getLeastCommonMultiple(a, b) {
  if (a == null) {
    return b;
  }

  if (b == null) {
    return a;
  }

  return a * b / getGreatestCommonDividor(a, b);
}
;// CONCATENATED MODULE: ./src/liquidFillShape.js


/* harmony default export */ const liquidFillShape = (external_echarts_.graphic.extendShape({
    type: 'ec-liquid-fill',

    shape: {
        waveLength: 0,
        radius: 0,
        radiusY: 0,
        cx: 0,
        cy: 0,
        waterLevel: 0,
        amplitude: 0,
        phase: 0,
        inverse: false
    },

    buildPath: function (ctx, shape) {
        if (shape.radiusY == null) {
            shape.radiusY = shape.radius;
        }

        /**
         * We define a sine wave having 4 waves, and make sure at least 8 curves
         * is drawn. Otherwise, it may cause blank area for some waves when
         * wave length is large enough.
         */
        var curves = Math.max(
            Math.ceil(2 * shape.radius / shape.waveLength * 4) * 2,
            8
        );

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
            ctx.lineTo(waveRight + left, shape.cy - shape.radiusY);
            ctx.lineTo(left, shape.cy - shape.radiusY);
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
            ctx.lineTo(waveRight + left, shape.cy + shape.radiusY);
            ctx.lineTo(left, shape.cy + shape.radiusY);
            ctx.lineTo(left, shape.waterLevel);
        }

        ctx.closePath();
    }
}));



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

;// CONCATENATED MODULE: ./src/liquidFillView.js




const liquidFillView_parsePercent = parsePercent;

external_echarts_.extendChartView({

    type: 'liquidFill',

    render: function (seriesModel, ecModel, api) {
        var group = this.group;
        group.removeAll();

        var data = seriesModel.getData();

        var itemModel = data.getItemModel(0);

        var center = itemModel.get('center');
        var radius = itemModel.get('radius');

        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        // itemStyle
        var outlineDistance = 0;
        var outlineBorderWidth = 0;
        var showOutline = seriesModel.get('outline.show');

        if (showOutline) {
            outlineDistance = seriesModel.get('outline.borderDistance');
            outlineBorderWidth = liquidFillView_parsePercent(
                seriesModel.get('outline.itemStyle.borderWidth'), size
            );
        }

        var cx = liquidFillView_parsePercent(center[0], width);
        var cy = liquidFillView_parsePercent(center[1], height);

        var outterRadius;
        var innerRadius;
        var paddingRadius;

        var isFillContainer = false;

        var symbol = seriesModel.get('shape');
        if (symbol === 'container') {
            // a shape that fully fills the container
            isFillContainer = true;

            outterRadius = [
                width / 2,
                height / 2
            ];
            innerRadius = [
                outterRadius[0] - outlineBorderWidth / 2,
                outterRadius[1] - outlineBorderWidth / 2
            ];
            paddingRadius = [
                liquidFillView_parsePercent(outlineDistance, width),
                liquidFillView_parsePercent(outlineDistance, height)
            ];

            radius = [
                Math.max(innerRadius[0] - paddingRadius[0], 0),
                Math.max(innerRadius[1] - paddingRadius[1], 0)
            ];
        }
        else {
            outterRadius = liquidFillView_parsePercent(radius, size) / 2;
            innerRadius = outterRadius - outlineBorderWidth / 2;
            paddingRadius = liquidFillView_parsePercent(outlineDistance, size);

            radius = Math.max(innerRadius - paddingRadius, 0);
        }

        if (showOutline) {
            var outline = getOutline();
            outline.style.lineWidth = outlineBorderWidth;
            group.add(getOutline());
        }

        var left = isFillContainer ? 0 : cx - radius;
        var top = isFillContainer ? 0 : cy - radius;

        var wavePath = null;

        group.add(getBackground());

        // each data item for a wave
        var oldData = this._data;
        var waves = [];
        data.diff(oldData)
            .add(function (idx) {
                var wave = getWave(idx, false);

                var waterLevel = wave.shape.waterLevel;
                wave.shape.waterLevel = isFillContainer ? height / 2 : radius;
                external_echarts_.graphic.initProps(wave, {
                    shape: {
                        waterLevel: waterLevel
                    }
                }, seriesModel);

                wave.z2 = 2;
                setWaveAnimation(idx, wave, null);

                group.add(wave);
                data.setItemGraphicEl(idx, wave);
                waves.push(wave);
            })
            .update(function (newIdx, oldIdx) {
                var waveElement = oldData.getItemGraphicEl(oldIdx);

                // new wave is used to calculate position, but not added
                var newWave = getWave(newIdx, false, waveElement);

                // changes with animation
                var shape = {};
                var shapeAttrs = ['amplitude', 'cx', 'cy', 'phase', 'radius', 'radiusY', 'waterLevel', 'waveLength'];
                for (var i = 0; i < shapeAttrs.length; ++i) {
                    var attr = shapeAttrs[i];
                    if (newWave.shape.hasOwnProperty(attr)) {
                        shape[attr] = newWave.shape[attr];
                    }
                }

                var style = {};
                var styleAttrs = ['fill', 'opacity', 'shadowBlur', 'shadowColor'];
                for (var i = 0; i < styleAttrs.length; ++i) {
                    var attr = styleAttrs[i];
                    if (newWave.style.hasOwnProperty(attr)) {
                        style[attr] = newWave.style[attr];
                    }
                }

                if (isFillContainer) {
                    shape.radiusY = height / 2;
                }

                // changes with animation
                external_echarts_.graphic.updateProps(waveElement, {
                    shape: shape
                }, seriesModel);

                waveElement.useStyle(style);

                // instant changes
                waveElement.position = newWave.position;
                waveElement.setClipPath(newWave.getClipPath());
                waveElement.shape.inverse = newWave.inverse;

                setWaveAnimation(newIdx, waveElement, waveElement);
                group.add(waveElement);
                data.setItemGraphicEl(newIdx, waveElement);
                waves.push(waveElement);
            })
            .remove(function (idx) {
                var wave = oldData.getItemGraphicEl(idx);
                group.remove(wave);
            })
            .execute();

        if (itemModel.get('label.show')) {
            group.add(getText(waves));
        }

        this._data = data;

        /**
         * Get path for outline, background and clipping
         *
         * @param {number} r outter radius of shape
         * @param {boolean|undefined} isForClipping if the shape is used
         *                                          for clipping
         */
        function getPath(r, isForClipping) {
            if (symbol) {
                // customed symbol path
                if (symbol.indexOf('path://') === 0) {
                    var path = external_echarts_.graphic.makePath(symbol.slice(7), {});
                    var bouding = path.getBoundingRect();
                    var w = bouding.width;
                    var h = bouding.height;
                    if (w > h) {
                        h = r * 2 / w * h;
                        w = r * 2;
                    }
                    else {
                        w = r * 2 / h * w;
                        h = r * 2;
                    }

                    var left = isForClipping ? 0 : cx - w / 2;
                    var top = isForClipping ? 0 : cy - h / 2;
                    path = external_echarts_.graphic.makePath(
                        symbol.slice(7),
                        {},
                        new external_echarts_.graphic.BoundingRect(left, top, w, h)
                    );
                    if (isForClipping) {
                        path.position = [-w / 2, -h / 2];
                    }
                    return path;
                }
                else if (isFillContainer) {
                    // fully fill the container
                    var x = isForClipping ? -r[0] : cx - r[0];
                    var y = isForClipping ? -r[1] : cy - r[1];
                    return external_echarts_.helper.createSymbol(
                        'rect', x, y, r[0] * 2, r[1] * 2
                    );
                }
                else {
                    var x = isForClipping ? -r : cx - r;
                    var y = isForClipping ? -r : cy - r;
                    if (symbol === 'pin') {
                        y += r;
                    }
                    else if (symbol === 'arrow') {
                        y -= r;
                    }
                    return external_echarts_.helper.createSymbol(symbol, x, y, r * 2, r * 2);
                }
            }

            return new external_echarts_.graphic.Circle({
                shape: {
                    cx: isForClipping ? 0 : cx,
                    cy: isForClipping ? 0 : cy,
                    r: r
                }
            });
        }
        /**
         * Create outline
         */
        function getOutline() {
            var outlinePath = getPath(outterRadius);
            outlinePath.style.fill = null;

            outlinePath.setStyle(seriesModel.getModel('outline.itemStyle')
                .getItemStyle());

            return outlinePath;
        }

        /**
         * Create background
         */
        function getBackground() {
            // Seperate stroke and fill, so we can use stroke to cover the alias of clipping.
            var strokePath = getPath(radius);
            strokePath.setStyle(seriesModel.getModel('backgroundStyle')
                .getItemStyle());
            strokePath.style.fill = null;

            // Stroke is front of wave
            strokePath.z2 = 5;

            var fillPath = getPath(radius);
            fillPath.setStyle(seriesModel.getModel('backgroundStyle')
                .getItemStyle());
            fillPath.style.stroke = null;

            var group = new external_echarts_.graphic.Group();
            group.add(strokePath);
            group.add(fillPath);

            return group;
        }

        /**
         * wave shape
         */
        function getWave(idx, isInverse, oldWave) {
            var radiusX = isFillContainer ? radius[0] : radius;
            var radiusY = isFillContainer ? height / 2 : radius;

            var itemModel = data.getItemModel(idx);
            var itemStyleModel = itemModel.getModel('itemStyle');
            var phase = itemModel.get('phase');
            var amplitude = liquidFillView_parsePercent(itemModel.get('amplitude'),
                radiusY * 2);
            var waveLength = liquidFillView_parsePercent(itemModel.get('waveLength'),
                radiusX * 2);

            var value = data.get('value', idx);
            var waterLevel = radiusY - value * radiusY * 2;
            phase = oldWave ? oldWave.shape.phase
                : (phase === 'auto' ? idx * Math.PI / 4 : phase);
            var normalStyle = itemStyleModel.getItemStyle();
            if (!normalStyle.fill) {
                var seriesColor = seriesModel.get('color');
                var id = idx % seriesColor.length;
                normalStyle.fill = seriesColor[id];
            }

            var x = radiusX * 2;
            var wave = new liquidFillShape({
                shape: {
                    waveLength: waveLength,
                    radius: radiusX,
                    radiusY: radiusY,
                    cx: x,
                    cy: 0,
                    waterLevel: waterLevel,
                    amplitude: amplitude,
                    phase: phase,
                    inverse: isInverse
                },
                style: normalStyle,
                position: [cx, cy]
            });
            wave.shape._waterLevel = waterLevel;

            var hoverStyle = itemModel.getModel('emphasis.itemStyle')
                .getItemStyle();
            hoverStyle.lineWidth = 0;

            wave.ensureState('emphasis').style = hoverStyle;
            external_echarts_.helper.enableHoverEmphasis(wave);

            // clip out the part outside the circle
            var clip = getPath(radius, true);
            // set fill for clipPath, otherwise it will not trigger hover event
            clip.setStyle({
                fill: 'white'
            });
            wave.setClipPath(clip);

            return wave;
        }

        function setWaveAnimation(idx, wave, oldWave) {
            var itemModel = data.getItemModel(idx);

            var maxSpeed = itemModel.get('period');
            var direction = itemModel.get('direction');

            var value = data.get('value', idx);

            var phase = itemModel.get('phase');
            phase = oldWave ? oldWave.shape.phase
                : (phase === 'auto' ? idx * Math.PI / 4 : phase);

            var defaultSpeed = function (maxSpeed) {
                var cnt = data.count();
                return cnt === 0 ? maxSpeed : maxSpeed *
                    (0.2 + (cnt - idx) / cnt * 0.8);
            };
            var speed = 0;
            if (maxSpeed === 'auto') {
                speed = defaultSpeed(5000);
            }
            else {
                speed = typeof maxSpeed === 'function'
                    ? maxSpeed(value, idx) : maxSpeed;
            }

            // phase for moving left/right
            var phaseOffset = 0;
            if (direction === 'right' || direction == null) {
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

            // wave animation of moving left/right
            if (direction !== 'none' && itemModel.get('waveAnimation')) {
                wave
                    .animate('shape', true)
                    .when(0, {
                        phase: phase
                    })
                    .when(speed / 2, {
                        phase: phaseOffset + phase
                    })
                    .when(speed, {
                        phase: phaseOffset * 2 + phase
                    })
                    .during(function () {
                        if (wavePath) {
                            wavePath.dirty(true);
                        }
                    })
                    .start();
            }
        }

        /**
         * text on wave
         */
        function getText(waves) {
            var labelModel = itemModel.getModel('label');

            function formatLabel() {
                var formatted = seriesModel.getFormattedLabel(0, 'normal');
                var defaultVal = (data.get('value', 0) * 100);
                var defaultLabel = data.getName(0) || seriesModel.name;
                if (!isNaN(defaultVal)) {
                    defaultLabel = defaultVal.toFixed(0) + '%';
                }
                return formatted == null ? defaultLabel : formatted;
            }

            var textRectOption = {
                z2: 10,
                shape: {
                    x: left,
                    y: top,
                    width: (isFillContainer ? radius[0] : radius) * 2,
                    height: (isFillContainer ? radius[1] : radius) * 2
                },
                style: {
                    fill: 'transparent'
                },
                textConfig: {
                    position: labelModel.get('position') || 'inside'
                },
                silent: true
            };
            var textOption = {
                style: {
                    text: formatLabel(),
                    textAlign: labelModel.get('align'),
                    textVerticalAlign: labelModel.get('baseline')
                }
            };
            Object.assign(textOption.style, external_echarts_.helper.createTextStyle(labelModel));

            var outsideTextRect = new external_echarts_.graphic.Rect(textRectOption);
            var insideTextRect = new external_echarts_.graphic.Rect(textRectOption);
            insideTextRect.disableLabelAnimation = true;
            outsideTextRect.disableLabelAnimation = true;

            var outsideText = new external_echarts_.graphic.Text(textOption);
            var insideText = new external_echarts_.graphic.Text(textOption);
            outsideTextRect.setTextContent(outsideText);

            insideTextRect.setTextContent(insideText);
            var insColor = labelModel.get('insideColor');
            insideText.style.fill = insColor;

            var group = new external_echarts_.graphic.Group();
            group.add(outsideTextRect);
            group.add(insideTextRect);

            // clip out waves for insideText
            var boundingCircle = getPath(radius, true);

            wavePath = new external_echarts_.graphic.CompoundPath({
                shape: {
                    paths: waves
                },
                position: [cx, cy]
            });

            wavePath.setClipPath(boundingCircle);
            insideTextRect.setClipPath(wavePath);

            return group;
        }
    },

    dispose: function () {
        // dispose nothing here
    }
});

;// CONCATENATED MODULE: ./src/liquidFill.js


;// CONCATENATED MODULE: ./index.js



/***/ }),

/***/ "echarts/lib/echarts":
/*!**************************!*\
  !*** external "echarts" ***!
  \**************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_echarts_lib_echarts__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./index.js");
/******/ })()
;
});
//# sourceMappingURL=echarts-liquidfill.js.map