var echarts = require('echarts/lib/echarts');
var numberUtil = echarts.number;
var symbolUtil = require('echarts/lib/util/symbol');
var parsePercent = numberUtil.parsePercent;

var LiquidLayout = require('./liquidFillLayout');

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

        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        // itemStyle
        var outlineDistance = 0;
        var outlineBorderWidth = 0;
        var showOutline = seriesModel.get('outline.show');

        if (showOutline) {
            outlineDistance = seriesModel.get('outline.borderDistance');
            outlineBorderWidth = parsePercent(
                seriesModel.get('outline.itemStyle.borderWidth'), size
            );
        }

        var cx = parsePercent(center[0], width);
        var cy = parsePercent(center[1], height);

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
                parsePercent(outlineDistance, width),
                parsePercent(outlineDistance, height)
            ];

            radius = [
                Math.max(innerRadius[0] - paddingRadius[0], 0),
                Math.max(innerRadius[1] - paddingRadius[1], 0)
            ];
        }
        else {
            outterRadius = parsePercent(radius, size) / 2;
            innerRadius = outterRadius - outlineBorderWidth / 2;
            paddingRadius = parsePercent(outlineDistance, size);

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
                echarts.graphic.initProps(wave, {
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
                echarts.graphic.updateProps(waveElement, {
                    shape: shape
                }, seriesModel);

                waveElement.useStyle(style);

                // instant changes
                waveElement.position = newWave.position;
                waveElement.setClipPath(newWave.clipPath);
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
                    var path = echarts.graphic.makePath(symbol.slice(7), {});
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
                    path = echarts.graphic.makePath(
                        symbol.slice(7),
                        {},
                        new echarts.graphic.BoundingRect(left, top, w, h)
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
                    return symbolUtil.createSymbol(
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
                    return symbolUtil.createSymbol(symbol, x, y, r * 2, r * 2);
                }
            }

            return new echarts.graphic.Circle({
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

            var group = new echarts.graphic.Group();
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
            var amplitude = parsePercent(itemModel.get('amplitude'),
                radiusY * 2);
            var waveLength = parsePercent(itemModel.get('waveLength'),
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
            var wave = new LiquidLayout({
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
            echarts.graphic.setHoverStyle(wave, hoverStyle);

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

            var textOption = {
                z2: 10,
                shape: {
                    x: left,
                    y: top,
                    width: (isFillContainer ? radius[0] : radius) * 2,
                    height: (isFillContainer ? radius[1] : radius) * 2
                },
                style: {
                    fill: 'transparent',
                    text: formatLabel(),
                    textAlign: labelModel.get('align'),
                    textVerticalAlign: labelModel.get('baseline')
                },
                silent: true
            };

            var outsideTextRect = new echarts.graphic.Rect(textOption);
            var color = labelModel.get('color');
            echarts.graphic.setText(outsideTextRect.style, labelModel, color);

            var insideTextRect = new echarts.graphic.Rect(textOption);
            var insColor = labelModel.get('insideColor');
            echarts.graphic.setText(insideTextRect.style, labelModel, insColor);
            insideTextRect.style.textFill = insColor;

            var group = new echarts.graphic.Group();
            group.add(outsideTextRect);
            group.add(insideTextRect);

            // clip out waves for insideText
            var boundingCircle = getPath(radius, true);

            wavePath = new echarts.graphic.CompoundPath({
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
