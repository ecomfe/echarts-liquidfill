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
	var layoutUtil = __webpack_require__(3);

	__webpack_require__(11);
	__webpack_require__(13);

	echarts.registerLayout(function (ecModel, api) {
	    ecModel.eachSeriesByType('liquidFill', function (seriesModel) {
	        var gridRect = layoutUtil.getLayoutRect(
	            seriesModel.getBoxLayoutParams(), {
	                width: api.getWidth(),
	                height: api.getHeight()
	            }
	        );
	        var data = seriesModel.getData();

	        var canvas = document.createElement('canvas');
	        canvas.width = gridRect.width;
	        canvas.height = gridRect.height;

	        var ctx = canvas.getContext('2d');

	        var sizeRange = seriesModel.get('sizeRange');
	        var rotationRange = seriesModel.get('rotationRange');
	        var valueExtent = data.getDataExtent('value');

	        var DEGREE_TO_RAD = Math.PI / 180;
	        var gridSize = seriesModel.get('gridSize');

	        seriesModel.layoutInstance = {
	            ondraw: null
	        };
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Layout helpers for each component positioning


	    var zrUtil = __webpack_require__(4);
	    var BoundingRect = __webpack_require__(5);
	    var numberUtil = __webpack_require__(8);
	    var formatUtil = __webpack_require__(9);
	    var parsePercent = numberUtil.parsePercent;
	    var each = zrUtil.each;

	    var layout = {};

	    var LOCATION_PARAMS = ['left', 'right', 'top', 'bottom', 'width', 'height'];

	    function boxLayout(orient, group, gap, maxWidth, maxHeight) {
	        var x = 0;
	        var y = 0;
	        if (maxWidth == null) {
	            maxWidth = Infinity;
	        }
	        if (maxHeight == null) {
	            maxHeight = Infinity;
	        }
	        var currentLineMaxSize = 0;
	        group.eachChild(function (child, idx) {
	            var position = child.position;
	            var rect = child.getBoundingRect();
	            var nextChild = group.childAt(idx + 1);
	            var nextChildRect = nextChild && nextChild.getBoundingRect();
	            var nextX;
	            var nextY;
	            if (orient === 'horizontal') {
	                var moveX = rect.width + (nextChildRect ? (-nextChildRect.x + rect.x) : 0);
	                nextX = x + moveX;
	                // Wrap when width exceeds maxWidth or meet a `newline` group
	                if (nextX > maxWidth || child.newline) {
	                    x = 0;
	                    nextX = moveX;
	                    y += currentLineMaxSize + gap;
	                    currentLineMaxSize = rect.height;
	                }
	                else {
	                    currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
	                }
	            }
	            else {
	                var moveY = rect.height + (nextChildRect ? (-nextChildRect.y + rect.y) : 0);
	                nextY = y + moveY;
	                // Wrap when width exceeds maxHeight or meet a `newline` group
	                if (nextY > maxHeight || child.newline) {
	                    x += currentLineMaxSize + gap;
	                    y = 0;
	                    nextY = moveY;
	                    currentLineMaxSize = rect.width;
	                }
	                else {
	                    currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
	                }
	            }

	            if (child.newline) {
	                return;
	            }

	            position[0] = x;
	            position[1] = y;

	            orient === 'horizontal'
	                ? (x = nextX + gap)
	                : (y = nextY + gap);
	        });
	    }

	    /**
	     * VBox or HBox layouting
	     * @param {string} orient
	     * @param {module:zrender/container/Group} group
	     * @param {number} gap
	     * @param {number} [width=Infinity]
	     * @param {number} [height=Infinity]
	     */
	    layout.box = boxLayout;

	    /**
	     * VBox layouting
	     * @param {module:zrender/container/Group} group
	     * @param {number} gap
	     * @param {number} [width=Infinity]
	     * @param {number} [height=Infinity]
	     */
	    layout.vbox = zrUtil.curry(boxLayout, 'vertical');

	    /**
	     * HBox layouting
	     * @param {module:zrender/container/Group} group
	     * @param {number} gap
	     * @param {number} [width=Infinity]
	     * @param {number} [height=Infinity]
	     */
	    layout.hbox = zrUtil.curry(boxLayout, 'horizontal');

	    /**
	     * If x or x2 is not specified or 'center' 'left' 'right',
	     * the width would be as long as possible.
	     * If y or y2 is not specified or 'middle' 'top' 'bottom',
	     * the height would be as long as possible.
	     *
	     * @param {Object} positionInfo
	     * @param {number|string} [positionInfo.x]
	     * @param {number|string} [positionInfo.y]
	     * @param {number|string} [positionInfo.x2]
	     * @param {number|string} [positionInfo.y2]
	     * @param {Object} containerRect
	     * @param {string|number} margin
	     * @return {Object} {width, height}
	     */
	    layout.getAvailableSize = function (positionInfo, containerRect, margin) {
	        var containerWidth = containerRect.width;
	        var containerHeight = containerRect.height;

	        var x = parsePercent(positionInfo.x, containerWidth);
	        var y = parsePercent(positionInfo.y, containerHeight);
	        var x2 = parsePercent(positionInfo.x2, containerWidth);
	        var y2 = parsePercent(positionInfo.y2, containerHeight);

	        (isNaN(x) || isNaN(parseFloat(positionInfo.x))) && (x = 0);
	        (isNaN(x2) || isNaN(parseFloat(positionInfo.x2))) && (x2 = containerWidth);
	        (isNaN(y) || isNaN(parseFloat(positionInfo.y))) && (y = 0);
	        (isNaN(y2) || isNaN(parseFloat(positionInfo.y2))) && (y2 = containerHeight);

	        margin = formatUtil.normalizeCssArray(margin || 0);

	        return {
	            width: Math.max(x2 - x - margin[1] - margin[3], 0),
	            height: Math.max(y2 - y - margin[0] - margin[2], 0)
	        };
	    };

	    /**
	     * Parse position info.
	     *
	     * @param {Object} positionInfo
	     * @param {number|string} [positionInfo.left]
	     * @param {number|string} [positionInfo.top]
	     * @param {number|string} [positionInfo.right]
	     * @param {number|string} [positionInfo.bottom]
	     * @param {number|string} [positionInfo.width]
	     * @param {number|string} [positionInfo.height]
	     * @param {number|string} [positionInfo.aspect] Aspect is width / height
	     * @param {Object} containerRect
	     * @param {string|number} [margin]
	     *
	     * @return {module:zrender/core/BoundingRect}
	     */
	    layout.getLayoutRect = function (
	        positionInfo, containerRect, margin
	    ) {
	        margin = formatUtil.normalizeCssArray(margin || 0);

	        var containerWidth = containerRect.width;
	        var containerHeight = containerRect.height;

	        var left = parsePercent(positionInfo.left, containerWidth);
	        var top = parsePercent(positionInfo.top, containerHeight);
	        var right = parsePercent(positionInfo.right, containerWidth);
	        var bottom = parsePercent(positionInfo.bottom, containerHeight);
	        var width = parsePercent(positionInfo.width, containerWidth);
	        var height = parsePercent(positionInfo.height, containerHeight);

	        var verticalMargin = margin[2] + margin[0];
	        var horizontalMargin = margin[1] + margin[3];
	        var aspect = positionInfo.aspect;

	        // If width is not specified, calculate width from left and right
	        if (isNaN(width)) {
	            width = containerWidth - right - horizontalMargin - left;
	        }
	        if (isNaN(height)) {
	            height = containerHeight - bottom - verticalMargin - top;
	        }

	        // If width and height are not given
	        // 1. Graph should not exceeds the container
	        // 2. Aspect must be keeped
	        // 3. Graph should take the space as more as possible
	        if (isNaN(width) && isNaN(height)) {
	            if (aspect > containerWidth / containerHeight) {
	                width = containerWidth * 0.8;
	            }
	            else {
	                height = containerHeight * 0.8;
	            }
	        }

	        if (aspect != null) {
	            // Calculate width or height with given aspect
	            if (isNaN(width)) {
	                width = aspect * height;
	            }
	            if (isNaN(height)) {
	                height = width / aspect;
	            }
	        }

	        // If left is not specified, calculate left from right and width
	        if (isNaN(left)) {
	            left = containerWidth - right - width - horizontalMargin;
	        }
	        if (isNaN(top)) {
	            top = containerHeight - bottom - height - verticalMargin;
	        }

	        // Align left and top
	        switch (positionInfo.left || positionInfo.right) {
	            case 'center':
	                left = containerWidth / 2 - width / 2 - margin[3];
	                break;
	            case 'right':
	                left = containerWidth - width - horizontalMargin;
	                break;
	        }
	        switch (positionInfo.top || positionInfo.bottom) {
	            case 'middle':
	            case 'center':
	                top = containerHeight / 2 - height / 2 - margin[0];
	                break;
	            case 'bottom':
	                top = containerHeight - height - verticalMargin;
	                break;
	        }
	        // If something is wrong and left, top, width, height are calculated as NaN
	        left = left || 0;
	        top = top || 0;
	        if (isNaN(width)) {
	            // Width may be NaN if only one value is given except width
	            width = containerWidth - left - (right || 0);
	        }
	        if (isNaN(height)) {
	            // Height may be NaN if only one value is given except height
	            height = containerHeight - top - (bottom || 0);
	        }

	        var rect = new BoundingRect(left + margin[3], top + margin[0], width, height);
	        rect.margin = margin;
	        return rect;
	    };

	    /**
	     * Position group of component in viewport
	     *  Group position is specified by either
	     *  {left, top}, {right, bottom}
	     *  If all properties exists, right and bottom will be igonred.
	     *
	     * @param {module:zrender/container/Group} group
	     * @param {Object} positionInfo
	     * @param {number|string} [positionInfo.left]
	     * @param {number|string} [positionInfo.top]
	     * @param {number|string} [positionInfo.right]
	     * @param {number|string} [positionInfo.bottom]
	     * @param {Object} containerRect
	     * @param {string|number} margin
	     */
	    layout.positionGroup = function (
	        group, positionInfo, containerRect, margin
	    ) {
	        var groupRect = group.getBoundingRect();

	        positionInfo = zrUtil.extend(zrUtil.clone(positionInfo), {
	            width: groupRect.width,
	            height: groupRect.height
	        });

	        positionInfo = layout.getLayoutRect(
	            positionInfo, containerRect, margin
	        );

	        group.attr('position', [
	            positionInfo.x - groupRect.x,
	            positionInfo.y - groupRect.y
	        ]);
	    };

	    /**
	     * Consider Case:
	     * When defulat option has {left: 0, width: 100}, and we set {right: 0}
	     * through setOption or media query, using normal zrUtil.merge will cause
	     * {right: 0} does not take effect.
	     *
	     * @example
	     * ComponentModel.extend({
	     *     init: function () {
	     *         ...
	     *         var inputPositionParams = layout.getLayoutParams(option);
	     *         this.mergeOption(inputPositionParams);
	     *     },
	     *     mergeOption: function (newOption) {
	     *         newOption && zrUtil.merge(thisOption, newOption, true);
	     *         layout.mergeLayoutParam(thisOption, newOption);
	     *     }
	     * });
	     *
	     * @param {Object} targetOption
	     * @param {Object} newOption
	     * @param {Object|string} [opt]
	     * @param {boolean} [opt.ignoreSize=false] Some component must has width and height.
	     */
	    layout.mergeLayoutParam = function (targetOption, newOption, opt) {
	        !zrUtil.isObject(opt) && (opt = {});
	        var hNames = ['width', 'left', 'right']; // Order by priority.
	        var vNames = ['height', 'top', 'bottom']; // Order by priority.
	        var hResult = merge(hNames);
	        var vResult = merge(vNames);

	        copy(hNames, targetOption, hResult);
	        copy(vNames, targetOption, vResult);

	        function merge(names) {
	            var newParams = {};
	            var newValueCount = 0;
	            var merged = {};
	            var mergedValueCount = 0;
	            var enoughParamNumber = opt.ignoreSize ? 1 : 2;

	            each(names, function (name) {
	                merged[name] = targetOption[name];
	            });
	            each(names, function (name) {
	                // Consider case: newOption.width is null, which is
	                // set by user for removing width setting.
	                hasProp(newOption, name) && (newParams[name] = merged[name] = newOption[name]);
	                hasValue(newParams, name) && newValueCount++;
	                hasValue(merged, name) && mergedValueCount++;
	            });

	            // Case: newOption: {width: ..., right: ...},
	            // or targetOption: {right: ...} and newOption: {width: ...},
	            // There is no conflict when merged only has params count
	            // little than enoughParamNumber.
	            if (mergedValueCount === enoughParamNumber || !newValueCount) {
	                return merged;
	            }
	            // Case: newOption: {width: ..., right: ...},
	            // Than we can make sure user only want those two, and ignore
	            // all origin params in targetOption.
	            else if (newValueCount >= enoughParamNumber) {
	                return newParams;
	            }
	            else {
	                // Chose another param from targetOption by priority.
	                // When 'ignoreSize', enoughParamNumber is 1 and those will not happen.
	                for (var i = 0; i < names.length; i++) {
	                    var name = names[i];
	                    if (!hasProp(newParams, name) && hasProp(targetOption, name)) {
	                        newParams[name] = targetOption[name];
	                        break;
	                    }
	                }
	                return newParams;
	            }
	        }

	        function hasProp(obj, name) {
	            return obj.hasOwnProperty(name);
	        }

	        function hasValue(obj, name) {
	            return obj[name] != null && obj[name] !== 'auto';
	        }

	        function copy(names, target, source) {
	            each(names, function (name) {
	                target[name] = source[name];
	            });
	        }
	    };

	    /**
	     * Retrieve 'left', 'right', 'top', 'bottom', 'width', 'height' from object.
	     * @param {Object} source
	     * @return {Object} Result contains those props.
	     */
	    layout.getLayoutParams = function (source) {
	        return layout.copyLayoutParams({}, source);
	    };

	    /**
	     * Retrieve 'left', 'right', 'top', 'bottom', 'width', 'height' from object.
	     * @param {Object} source
	     * @return {Object} Result contains those props.
	     */
	    layout.copyLayoutParams = function (target, source) {
	        source && target && each(LOCATION_PARAMS, function (name) {
	            source.hasOwnProperty(name) && (target[name] = source[name]);
	        });
	        return target;
	    };

	    module.exports = layout;


/***/ },
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @module echarts/core/BoundingRect
	 */


	    var vec2 = __webpack_require__(6);
	    var matrix = __webpack_require__(7);

	    var v2ApplyTransform = vec2.applyTransform;
	    var mathMin = Math.min;
	    var mathAbs = Math.abs;
	    var mathMax = Math.max;
	    /**
	     * @alias module:echarts/core/BoundingRect
	     */
	    function BoundingRect(x, y, width, height) {

	        if (width < 0) {
	            x = x + width;
	            width = -width;
	        }
	        if (height < 0) {
	            y = y + height;
	            height = -height;
	        }

	        /**
	         * @type {number}
	         */
	        this.x = x;
	        /**
	         * @type {number}
	         */
	        this.y = y;
	        /**
	         * @type {number}
	         */
	        this.width = width;
	        /**
	         * @type {number}
	         */
	        this.height = height;
	    }

	    BoundingRect.prototype = {

	        constructor: BoundingRect,

	        /**
	         * @param {module:echarts/core/BoundingRect} other
	         */
	        union: function (other) {
	            var x = mathMin(other.x, this.x);
	            var y = mathMin(other.y, this.y);

	            this.width = mathMax(
	                    other.x + other.width,
	                    this.x + this.width
	                ) - x;
	            this.height = mathMax(
	                    other.y + other.height,
	                    this.y + this.height
	                ) - y;
	            this.x = x;
	            this.y = y;
	        },

	        /**
	         * @param {Array.<number>} m
	         * @methods
	         */
	        applyTransform: (function () {
	            var min = [];
	            var max = [];
	            return function (m) {
	                // In case usage like this
	                // el.getBoundingRect().applyTransform(el.transform)
	                // And element has no transform
	                if (!m) {
	                    return;
	                }
	                min[0] = this.x;
	                min[1] = this.y;
	                max[0] = this.x + this.width;
	                max[1] = this.y + this.height;

	                v2ApplyTransform(min, min, m);
	                v2ApplyTransform(max, max, m);

	                this.x = mathMin(min[0], max[0]);
	                this.y = mathMin(min[1], max[1]);
	                this.width = mathAbs(max[0] - min[0]);
	                this.height = mathAbs(max[1] - min[1]);
	            };
	        })(),

	        /**
	         * Calculate matrix of transforming from self to target rect
	         * @param  {module:zrender/core/BoundingRect} b
	         * @return {Array.<number>}
	         */
	        calculateTransform: function (b) {
	            var a = this;
	            var sx = b.width / a.width;
	            var sy = b.height / a.height;

	            var m = matrix.create();

	            // 矩阵右乘
	            matrix.translate(m, m, [-a.x, -a.y]);
	            matrix.scale(m, m, [sx, sy]);
	            matrix.translate(m, m, [b.x, b.y]);

	            return m;
	        },

	        /**
	         * @param {(module:echarts/core/BoundingRect|Object)} b
	         * @return {boolean}
	         */
	        intersect: function (b) {
	            if (!(b instanceof BoundingRect)) {
	                // Normalize negative width/height.
	                b = BoundingRect.create(b);
	            }

	            var a = this;
	            var ax0 = a.x;
	            var ax1 = a.x + a.width;
	            var ay0 = a.y;
	            var ay1 = a.y + a.height;

	            var bx0 = b.x;
	            var bx1 = b.x + b.width;
	            var by0 = b.y;
	            var by1 = b.y + b.height;

	            return ! (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
	        },

	        contain: function (x, y) {
	            var rect = this;
	            return x >= rect.x
	                && x <= (rect.x + rect.width)
	                && y >= rect.y
	                && y <= (rect.y + rect.height);
	        },

	        /**
	         * @return {module:echarts/core/BoundingRect}
	         */
	        clone: function () {
	            return new BoundingRect(this.x, this.y, this.width, this.height);
	        },

	        /**
	         * Copy from another rect
	         */
	        copy: function (other) {
	            this.x = other.x;
	            this.y = other.y;
	            this.width = other.width;
	            this.height = other.height;
	        },

	        plain: function () {
	            return {
	                x: this.x,
	                y: this.y,
	                width: this.width,
	                height: this.height
	            };
	        }
	    };

	    /**
	     * @param {Object|module:zrender/core/BoundingRect} rect
	     * @param {number} rect.x
	     * @param {number} rect.y
	     * @param {number} rect.width
	     * @param {number} rect.height
	     * @return {module:zrender/core/BoundingRect}
	     */
	    BoundingRect.create = function (rect) {
	        return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
	    };

	    module.exports = BoundingRect;


/***/ },
/* 6 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;

	    /**
	     * @typedef {Float32Array|Array.<number>} Vector2
	     */
	    /**
	     * 二维向量类
	     * @exports zrender/tool/vector
	     */
	    var vector = {
	        /**
	         * 创建一个向量
	         * @param {number} [x=0]
	         * @param {number} [y=0]
	         * @return {Vector2}
	         */
	        create: function (x, y) {
	            var out = new ArrayCtor(2);
	            if (x == null) {
	                x = 0;
	            }
	            if (y == null) {
	                y = 0;
	            }
	            out[0] = x;
	            out[1] = y;
	            return out;
	        },

	        /**
	         * 复制向量数据
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        copy: function (out, v) {
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },

	        /**
	         * 克隆一个向量
	         * @param {Vector2} v
	         * @return {Vector2}
	         */
	        clone: function (v) {
	            var out = new ArrayCtor(2);
	            out[0] = v[0];
	            out[1] = v[1];
	            return out;
	        },

	        /**
	         * 设置向量的两个项
	         * @param {Vector2} out
	         * @param {number} a
	         * @param {number} b
	         * @return {Vector2} 结果
	         */
	        set: function (out, a, b) {
	            out[0] = a;
	            out[1] = b;
	            return out;
	        },

	        /**
	         * 向量相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        add: function (out, v1, v2) {
	            out[0] = v1[0] + v2[0];
	            out[1] = v1[1] + v2[1];
	            return out;
	        },

	        /**
	         * 向量缩放后相加
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} a
	         */
	        scaleAndAdd: function (out, v1, v2, a) {
	            out[0] = v1[0] + v2[0] * a;
	            out[1] = v1[1] + v2[1] * a;
	            return out;
	        },

	        /**
	         * 向量相减
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        sub: function (out, v1, v2) {
	            out[0] = v1[0] - v2[0];
	            out[1] = v1[1] - v2[1];
	            return out;
	        },

	        /**
	         * 向量长度
	         * @param {Vector2} v
	         * @return {number}
	         */
	        len: function (v) {
	            return Math.sqrt(this.lenSquare(v));
	        },

	        /**
	         * 向量长度平方
	         * @param {Vector2} v
	         * @return {number}
	         */
	        lenSquare: function (v) {
	            return v[0] * v[0] + v[1] * v[1];
	        },

	        /**
	         * 向量乘法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        mul: function (out, v1, v2) {
	            out[0] = v1[0] * v2[0];
	            out[1] = v1[1] * v2[1];
	            return out;
	        },

	        /**
	         * 向量除法
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         */
	        div: function (out, v1, v2) {
	            out[0] = v1[0] / v2[0];
	            out[1] = v1[1] / v2[1];
	            return out;
	        },

	        /**
	         * 向量点乘
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        dot: function (v1, v2) {
	            return v1[0] * v2[0] + v1[1] * v2[1];
	        },

	        /**
	         * 向量缩放
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {number} s
	         */
	        scale: function (out, v, s) {
	            out[0] = v[0] * s;
	            out[1] = v[1] * s;
	            return out;
	        },

	        /**
	         * 向量归一化
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        normalize: function (out, v) {
	            var d = vector.len(v);
	            if (d === 0) {
	                out[0] = 0;
	                out[1] = 0;
	            }
	            else {
	                out[0] = v[0] / d;
	                out[1] = v[1] / d;
	            }
	            return out;
	        },

	        /**
	         * 计算向量间距离
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distance: function (v1, v2) {
	            return Math.sqrt(
	                (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1])
	            );
	        },

	        /**
	         * 向量距离平方
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @return {number}
	         */
	        distanceSquare: function (v1, v2) {
	            return (v1[0] - v2[0]) * (v1[0] - v2[0])
	                + (v1[1] - v2[1]) * (v1[1] - v2[1]);
	        },

	        /**
	         * 求负向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         */
	        negate: function (out, v) {
	            out[0] = -v[0];
	            out[1] = -v[1];
	            return out;
	        },

	        /**
	         * 插值两个点
	         * @param {Vector2} out
	         * @param {Vector2} v1
	         * @param {Vector2} v2
	         * @param {number} t
	         */
	        lerp: function (out, v1, v2, t) {
	            out[0] = v1[0] + t * (v2[0] - v1[0]);
	            out[1] = v1[1] + t * (v2[1] - v1[1]);
	            return out;
	        },

	        /**
	         * 矩阵左乘向量
	         * @param {Vector2} out
	         * @param {Vector2} v
	         * @param {Vector2} m
	         */
	        applyTransform: function (out, v, m) {
	            var x = v[0];
	            var y = v[1];
	            out[0] = m[0] * x + m[2] * y + m[4];
	            out[1] = m[1] * x + m[3] * y + m[5];
	            return out;
	        },
	        /**
	         * 求两个向量最小值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        min: function (out, v1, v2) {
	            out[0] = Math.min(v1[0], v2[0]);
	            out[1] = Math.min(v1[1], v2[1]);
	            return out;
	        },
	        /**
	         * 求两个向量最大值
	         * @param  {Vector2} out
	         * @param  {Vector2} v1
	         * @param  {Vector2} v2
	         */
	        max: function (out, v1, v2) {
	            out[0] = Math.max(v1[0], v2[0]);
	            out[1] = Math.max(v1[1], v2[1]);
	            return out;
	        }
	    };

	    vector.length = vector.len;
	    vector.lengthSquare = vector.lenSquare;
	    vector.dist = vector.distance;
	    vector.distSquare = vector.distanceSquare;

	    module.exports = vector;



/***/ },
/* 7 */
/***/ function(module, exports) {

	
	    var ArrayCtor = typeof Float32Array === 'undefined'
	        ? Array
	        : Float32Array;
	    /**
	     * 3x2矩阵操作类
	     * @exports zrender/tool/matrix
	     */
	    var matrix = {
	        /**
	         * 创建一个单位矩阵
	         * @return {Float32Array|Array.<number>}
	         */
	        create : function() {
	            var out = new ArrayCtor(6);
	            matrix.identity(out);

	            return out;
	        },
	        /**
	         * 设置矩阵为单位矩阵
	         * @param {Float32Array|Array.<number>} out
	         */
	        identity : function(out) {
	            out[0] = 1;
	            out[1] = 0;
	            out[2] = 0;
	            out[3] = 1;
	            out[4] = 0;
	            out[5] = 0;
	            return out;
	        },
	        /**
	         * 复制矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m
	         */
	        copy: function(out, m) {
	            out[0] = m[0];
	            out[1] = m[1];
	            out[2] = m[2];
	            out[3] = m[3];
	            out[4] = m[4];
	            out[5] = m[5];
	            return out;
	        },
	        /**
	         * 矩阵相乘
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} m1
	         * @param {Float32Array|Array.<number>} m2
	         */
	        mul : function (out, m1, m2) {
	            // Consider matrix.mul(m, m2, m);
	            // where out is the same as m2.
	            // So use temp variable to escape error.
	            var out0 = m1[0] * m2[0] + m1[2] * m2[1];
	            var out1 = m1[1] * m2[0] + m1[3] * m2[1];
	            var out2 = m1[0] * m2[2] + m1[2] * m2[3];
	            var out3 = m1[1] * m2[2] + m1[3] * m2[3];
	            var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	            var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	            out[0] = out0;
	            out[1] = out1;
	            out[2] = out2;
	            out[3] = out3;
	            out[4] = out4;
	            out[5] = out5;
	            return out;
	        },
	        /**
	         * 平移变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        translate : function(out, a, v) {
	            out[0] = a[0];
	            out[1] = a[1];
	            out[2] = a[2];
	            out[3] = a[3];
	            out[4] = a[4] + v[0];
	            out[5] = a[5] + v[1];
	            return out;
	        },
	        /**
	         * 旋转变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {number} rad
	         */
	        rotate : function(out, a, rad) {
	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];
	            var st = Math.sin(rad);
	            var ct = Math.cos(rad);

	            out[0] = aa * ct + ab * st;
	            out[1] = -aa * st + ab * ct;
	            out[2] = ac * ct + ad * st;
	            out[3] = -ac * st + ct * ad;
	            out[4] = ct * atx + st * aty;
	            out[5] = ct * aty - st * atx;
	            return out;
	        },
	        /**
	         * 缩放变换
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         * @param {Float32Array|Array.<number>} v
	         */
	        scale : function(out, a, v) {
	            var vx = v[0];
	            var vy = v[1];
	            out[0] = a[0] * vx;
	            out[1] = a[1] * vy;
	            out[2] = a[2] * vx;
	            out[3] = a[3] * vy;
	            out[4] = a[4] * vx;
	            out[5] = a[5] * vy;
	            return out;
	        },
	        /**
	         * 求逆矩阵
	         * @param {Float32Array|Array.<number>} out
	         * @param {Float32Array|Array.<number>} a
	         */
	        invert : function(out, a) {

	            var aa = a[0];
	            var ac = a[2];
	            var atx = a[4];
	            var ab = a[1];
	            var ad = a[3];
	            var aty = a[5];

	            var det = aa * ad - ab * ac;
	            if (!det) {
	                return null;
	            }
	            det = 1.0 / det;

	            out[0] = ad * det;
	            out[1] = -ab * det;
	            out[2] = -ac * det;
	            out[3] = aa * det;
	            out[4] = (ac * aty - ad * atx) * det;
	            out[5] = (ab * atx - aa * aty) * det;
	            return out;
	        }
	    };

	    module.exports = matrix;



/***/ },
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	

	    var zrUtil = __webpack_require__(4);
	    var numberUtil = __webpack_require__(8);
	    var textContain = __webpack_require__(10);

	    var formatUtil = {};
	    /**
	     * 每三位默认加,格式化
	     * @type {string|number} x
	     */
	    formatUtil.addCommas = function (x) {
	        if (isNaN(x)) {
	            return '-';
	        }
	        x = (x + '').split('.');
	        return x[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,')
	               + (x.length > 1 ? ('.' + x[1]) : '');
	    };

	    /**
	     * @param {string} str
	     * @return {string} str
	     */
	    formatUtil.toCamelCase = function (str) {
	        return str.toLowerCase().replace(/-(.)/g, function(match, group1) {
	            return group1.toUpperCase();
	        });
	    };

	    /**
	     * Normalize css liked array configuration
	     * e.g.
	     *  3 => [3, 3, 3, 3]
	     *  [4, 2] => [4, 2, 4, 2]
	     *  [4, 3, 2] => [4, 3, 2, 3]
	     * @param {number|Array.<number>} val
	     */
	    formatUtil.normalizeCssArray = function (val) {
	        var len = val.length;
	        if (typeof (val) === 'number') {
	            return [val, val, val, val];
	        }
	        else if (len === 2) {
	            // vertical | horizontal
	            return [val[0], val[1], val[0], val[1]];
	        }
	        else if (len === 3) {
	            // top | horizontal | bottom
	            return [val[0], val[1], val[2], val[1]];
	        }
	        return val;
	    };

	    formatUtil.encodeHTML = function (source) {
	        return String(source)
	            .replace(/&/g, '&amp;')
	            .replace(/</g, '&lt;')
	            .replace(/>/g, '&gt;')
	            .replace(/"/g, '&quot;')
	            .replace(/'/g, '&#39;');
	    };

	    var TPL_VAR_ALIAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

	    var wrapVar = function (varName, seriesIdx) {
	        return '{' + varName + (seriesIdx == null ? '' : seriesIdx) + '}';
	    };

	    /**
	     * Template formatter
	     * @param  {string} tpl
	     * @param  {Array.<Object>|Object} paramsList
	     * @return {string}
	     */
	    formatUtil.formatTpl = function (tpl, paramsList) {
	        if (!zrUtil.isArray(paramsList)) {
	            paramsList = [paramsList];
	        }
	        var seriesLen = paramsList.length;
	        if (!seriesLen) {
	            return '';
	        }

	        var $vars = paramsList[0].$vars || [];
	        for (var i = 0; i < $vars.length; i++) {
	            var alias = TPL_VAR_ALIAS[i];
	            tpl = tpl.replace(wrapVar(alias),  wrapVar(alias, 0));
	        }
	        for (var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++) {
	            for (var k = 0; k < $vars.length; k++) {
	                tpl = tpl.replace(
	                    wrapVar(TPL_VAR_ALIAS[k], seriesIdx),
	                    paramsList[seriesIdx][$vars[k]]
	                );
	            }
	        }

	        return tpl;
	    };


	    /**
	     * @param {string} str
	     * @return {string}
	     * @inner
	     */
	    var s2d = function (str) {
	        return str < 10 ? ('0' + str) : str;
	    };

	    /**
	     * ISO Date format
	     * @param {string} tpl
	     * @param {number} value
	     * @inner
	     */
	    formatUtil.formatTime = function (tpl, value) {
	        if (tpl === 'week'
	            || tpl === 'month'
	            || tpl === 'quarter'
	            || tpl === 'half-year'
	            || tpl === 'year'
	        ) {
	            tpl = 'MM-dd\nyyyy';
	        }

	        var date = numberUtil.parseDate(value);
	        var y = date.getFullYear();
	        var M = date.getMonth() + 1;
	        var d = date.getDate();
	        var h = date.getHours();
	        var m = date.getMinutes();
	        var s = date.getSeconds();

	        tpl = tpl.replace('MM', s2d(M))
	            .toLowerCase()
	            .replace('yyyy', y)
	            .replace('yy', y % 100)
	            .replace('dd', s2d(d))
	            .replace('d', d)
	            .replace('hh', s2d(h))
	            .replace('h', h)
	            .replace('mm', s2d(m))
	            .replace('m', m)
	            .replace('ss', s2d(s))
	            .replace('s', s);

	        return tpl;
	    };

	    /**
	     * Capital first
	     * @param {string} str
	     * @return {string}
	     */
	    formatUtil.capitalFirst = function (str) {
	        return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
	    };

	    formatUtil.truncateText = textContain.truncateText;

	    module.exports = formatUtil;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	

	    var textWidthCache = {};
	    var textWidthCacheCounter = 0;
	    var TEXT_CACHE_MAX = 5000;

	    var util = __webpack_require__(4);
	    var BoundingRect = __webpack_require__(5);
	    var retrieve = util.retrieve;

	    function getTextWidth(text, textFont) {
	        var key = text + ':' + textFont;
	        if (textWidthCache[key]) {
	            return textWidthCache[key];
	        }

	        var textLines = (text + '').split('\n');
	        var width = 0;

	        for (var i = 0, l = textLines.length; i < l; i++) {
	            // measureText 可以被覆盖以兼容不支持 Canvas 的环境
	            width = Math.max(textContain.measureText(textLines[i], textFont).width, width);
	        }

	        if (textWidthCacheCounter > TEXT_CACHE_MAX) {
	            textWidthCacheCounter = 0;
	            textWidthCache = {};
	        }
	        textWidthCacheCounter++;
	        textWidthCache[key] = width;

	        return width;
	    }

	    function getTextRect(text, textFont, textAlign, textBaseline) {
	        var textLineLen = ((text || '') + '').split('\n').length;

	        var width = getTextWidth(text, textFont);
	        // FIXME 高度计算比较粗暴
	        var lineHeight = getTextWidth('国', textFont);
	        var height = textLineLen * lineHeight;

	        var rect = new BoundingRect(0, 0, width, height);
	        // Text has a special line height property
	        rect.lineHeight = lineHeight;

	        switch (textBaseline) {
	            case 'bottom':
	            case 'alphabetic':
	                rect.y -= lineHeight;
	                break;
	            case 'middle':
	                rect.y -= lineHeight / 2;
	                break;
	            // case 'hanging':
	            // case 'top':
	        }

	        // FIXME Right to left language
	        switch (textAlign) {
	            case 'end':
	            case 'right':
	                rect.x -= rect.width;
	                break;
	            case 'center':
	                rect.x -= rect.width / 2;
	                break;
	            // case 'start':
	            // case 'left':
	        }

	        return rect;
	    }

	    function adjustTextPositionOnRect(textPosition, rect, textRect, distance) {

	        var x = rect.x;
	        var y = rect.y;

	        var height = rect.height;
	        var width = rect.width;

	        var textHeight = textRect.height;

	        var halfHeight = height / 2 - textHeight / 2;

	        var textAlign = 'left';

	        switch (textPosition) {
	            case 'left':
	                x -= distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'right':
	                x += distance + width;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'top':
	                x += width / 2;
	                y -= distance + textHeight;
	                textAlign = 'center';
	                break;
	            case 'bottom':
	                x += width / 2;
	                y += height + distance;
	                textAlign = 'center';
	                break;
	            case 'inside':
	                x += width / 2;
	                y += halfHeight;
	                textAlign = 'center';
	                break;
	            case 'insideLeft':
	                x += distance;
	                y += halfHeight;
	                textAlign = 'left';
	                break;
	            case 'insideRight':
	                x += width - distance;
	                y += halfHeight;
	                textAlign = 'right';
	                break;
	            case 'insideTop':
	                x += width / 2;
	                y += distance;
	                textAlign = 'center';
	                break;
	            case 'insideBottom':
	                x += width / 2;
	                y += height - textHeight - distance;
	                textAlign = 'center';
	                break;
	            case 'insideTopLeft':
	                x += distance;
	                y += distance;
	                textAlign = 'left';
	                break;
	            case 'insideTopRight':
	                x += width - distance;
	                y += distance;
	                textAlign = 'right';
	                break;
	            case 'insideBottomLeft':
	                x += distance;
	                y += height - textHeight - distance;
	                break;
	            case 'insideBottomRight':
	                x += width - distance;
	                y += height - textHeight - distance;
	                textAlign = 'right';
	                break;
	        }

	        return {
	            x: x,
	            y: y,
	            textAlign: textAlign,
	            textBaseline: 'top'
	        };
	    }

	    /**
	     * Show ellipsis if overflow.
	     *
	     * @param  {string} text
	     * @param  {string} containerWidth
	     * @param  {string} textFont
	     * @param  {number} [ellipsis='...']
	     * @param  {Object} [options]
	     * @param  {number} [options.maxIterations=3]
	     * @param  {number} [options.minChar=0] If truncate result are less
	     *                  then minChar, ellipsis will not show, which is
	     *                  better for user hint in some cases.
	     * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
	     * @return {string}
	     */
	    function truncateText(text, containerWidth, textFont, ellipsis, options) {
	        if (!containerWidth) {
	            return '';
	        }

	        options = options || {};

	        ellipsis = retrieve(ellipsis, '...');
	        var maxIterations = retrieve(options.maxIterations, 2);
	        var minChar = retrieve(options.minChar, 0);
	        // FIXME
	        // Other languages?
	        var cnCharWidth = getTextWidth('国', textFont);
	        // FIXME
	        // Consider proportional font?
	        var ascCharWidth = getTextWidth('a', textFont);
	        var placeholder = retrieve(options.placeholder, '');

	        // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
	        // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
	        var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
	        for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
	            contentWidth -= ascCharWidth;
	        }

	        var ellipsisWidth = getTextWidth(ellipsis);
	        if (ellipsisWidth > contentWidth) {
	            ellipsis = '';
	            ellipsisWidth = 0;
	        }

	        contentWidth = containerWidth - ellipsisWidth;

	        var textLines = (text + '').split('\n');

	        for (var i = 0, len = textLines.length; i < len; i++) {
	            var textLine = textLines[i];
	            var lineWidth = getTextWidth(textLine, textFont);

	            if (lineWidth <= containerWidth) {
	                continue;
	            }

	            for (var j = 0;; j++) {
	                if (lineWidth <= contentWidth || j >= maxIterations) {
	                    textLine += ellipsis;
	                    break;
	                }

	                var subLength = j === 0
	                    ? estimateLength(textLine, contentWidth, ascCharWidth, cnCharWidth)
	                    : lineWidth > 0
	                    ? Math.floor(textLine.length * contentWidth / lineWidth)
	                    : 0;

	                textLine = textLine.substr(0, subLength);
	                lineWidth = getTextWidth(textLine, textFont);
	            }

	            if (textLine === '') {
	                textLine = placeholder;
	            }

	            textLines[i] = textLine;
	        }

	        return textLines.join('\n');
	    }

	    function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
	        var width = 0;
	        var i = 0;
	        for (var len = text.length; i < len && width < contentWidth; i++) {
	            var charCode = text.charCodeAt(i);
	            width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
	        }
	        return i;
	    }

	    var textContain = {

	        getWidth: getTextWidth,

	        getBoundingRect: getTextRect,

	        adjustTextPositionOnRect: adjustTextPositionOnRect,

	        truncateText: truncateText,

	        measureText: function (text, textFont) {
	            var ctx = util.getContext();
	            ctx.font = textFont || '12px sans-serif';
	            return ctx.measureText(text);
	        }
	    };

	    module.exports = textContain;


/***/ },
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
	        center: ['50%', '50%'],
	        radius: '80%',
	        amplitude: 10,
	        waveLength: '50%',
	        phase: 0,
	        speed: 2000,

	        itemStyle: {
	            normal: {
	                waterColor: 'red',
	                backgroundColor: 'yellow',
	                borderColor: 'blue',
	                borderWidth: 10,
	                borderDistance: 10,
	                opacity: 1
	            },
	            emphasis: {
	                waterColor: 'red',
	                backgroundColor: 'yellow',
	                borderColor: 'blue',
	                borderWidth: 10,
	                borderDistance: 10,
	                opacity: 1
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
	        var speed = itemModel.get('speed');

	        var normal = itemModel.get('itemStyle.normal');
	        var waterColor = normal.waterColor;
	        var backgroundColor = normal.backgroundColor;
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

	        var borderRing = new echarts.graphic.Ring({
	            shape: {
	                cx: cx,
	                cy: cy,
	                r: innerRadius,
	                r0: outterRadius
	            },
	            style: {
	                fill: '#2D99D9'
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
	        var waterLevel = radius - data.get('value', 0) * radius * 2;

	        var backCircle = new echarts.graphic.Circle({
	            shape: {
	                cx: cx,
	                cy: cy,
	                r: radius
	            },
	            style: {
	                fill: '#C8FFFB'
	            }
	        });
	        group.add(backCircle);

	        var wave = new LiquidLayout({
	            shape: {
	                waveLength: waveLength,
	                radius: radius,
	                cx: 0,
	                cy: 0,
	                waterLevel: waterLevel,
	                amplitude: amplitude[1],
	                borderWidth: borderWidth,
	                borderDistance: paddingRadius,
	                phase: phase
	            },
	            style: {
	                fill: '#2D99D9'
	            },
	            position: [cx, cy]
	        });
	        wave.setClipPath(new echarts.graphic.Circle({
	            shape: {
	                cx: 0,
	                cy: 0,
	                r: radius
	            }
	        }));
	        wave.animate('shape', true)
	            .when(0, {
	                phase: 0,
	                amplitude: amplitude[1]
	            })
	            .when(speed / 2, {
	                phase: Math.PI,
	                amplitude: amplitude[0]
	            })
	            .when(speed, {
	                phase: Math.PI * 2,
	                amplitude: amplitude[1]
	            })
	            .start();

	        group.add(wave);

	        var text = new echarts.graphic.Text({
	            style: {
	                text: Math.ceil(data.get('value', 0) * 100) + '%',
	                x: cx,
	                y: waterLevel + cy - 30,
	                fill: '#2D99D9',
	                textAlign: 'center',
	                textVerticalAlign: 'middle',
	                textFont: '32px Arial'
	            },
	            silent: true
	        });
	        group.add(text);

	        // data.setItemGraphicEl(0, borderRing);
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
	        phase: 0
	    },

	    style: {
	        fill: '#0f0'
	    },

	    buildPath: function (ctx, shape) {
	        drawWave(ctx, shape);
	    }
	});



	function drawWave(ctx, shape) {
	    var curves = Math.ceil(2 * shape.radius / shape.waveLength * 4) * 2;
	    var controls = [[0, 0]];
	    var positions = [];
	    var phase = shape.phase / Math.PI / 2 * shape.waveLength;
	    var left = shape.cx - shape.radius + phase - shape.radius * 2;

	    ctx.moveTo(left, shape.waterLevel);

	    // top wave
	    for (var c = 0; c < curves; ++c) {
	        var stage = c % 4;
	        var pos = getWaterPositions(c * shape.waveLength / 4, stage,
	            shape.waveLength, shape.amplitude);
	        ctx.bezierCurveTo(pos[0][0] + left, -pos[0][1] + shape.waterLevel,
	            pos[1][0] + left, -pos[1][1] + shape.waterLevel,
	            pos[2][0] + left, -pos[2][1] + shape.waterLevel);
	    }

	    ctx.lineTo(shape.cx + shape.radius, shape.cy + shape.radius);
	    ctx.lineTo(shape.cx - shape.radius, shape.cy + shape.radius);
	    ctx.lineTo(shape.cx - shape.radius, shape.waterLevel);

	    ctx.stroke();
	}



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


/***/ }
/******/ ])
});
;