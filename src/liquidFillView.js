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
            outlineBorderWidth = parsePercent(seriesModel.get('outline.itemStyle.borderWidth'), size);
        }

        var cx = parsePercent(center[0], width);
        var cy = parsePercent(center[1], height);
        var outterRadius = parsePercent(radius, size) / 2;
        var innerRadius = outterRadius - outlineBorderWidth / 2;
        var paddingRadius = parsePercent(outlineDistance, size);

        var wavePath = null;

        if (showOutline) {
            var outline = getOutline();
            outline.style.lineWidth = outlineBorderWidth;
            group.add(getOutline());
        }

        radius = innerRadius - paddingRadius;
        var left = cx - radius;
        var top = cy - radius;

        group.add(getBackground());

        // each data item for a wave
        var oldData = this._data;
        var waves = [];
        data.diff(oldData)
            .add(function (idx) {
                var wave = getWave(idx, false);

                var waterLevel = wave.shape.waterLevel;
                wave.shape.waterLevel = radius;
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

                // Shallow copy shape and style to avoid comparing style.host
                // when animating
                var shape = Object.assign({}, newWave.shape);
                var style = Object.assign({}, newWave.style);
                style.host = null;

                // update old wave with parameters of new wave
                echarts.graphic.updateProps(waveElement, {
                    shape: shape,
                    style: style
                }, seriesModel);
                waveElement.position = newWave.position;
                waveElement.setClipPath(newWave.clipPath);

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

        group.add(getText(waves));

        this._data = data;

        /**
         * Get path for outline, background and clipping
         */
        function getPath(r, isForClipping) {
            var symbol = seriesModel.get('shape');
            if (symbol) {
                // customed symbol path
                if (symbol.indexOf('path://') === 0) {
                    var path = echarts.graphic.makePath(symbol.slice(7), {});
                    var bouding = path.getBoundingRect();
                    var width = bouding.width;
                    var height = bouding.height;
                    if (width > height) {
                        height = r * 2 / width * height;
                        width = r * 2;
                    }
                    else {
                        width = r * 2 / height * width;
                        height = r * 2;
                    }

                    var left = isForClipping ? 0 : cx - width / 2;
                    var top = isForClipping ? 0 : cy - height / 2;
                    path = echarts.graphic.makePath(
                        symbol.slice(7),
                        {},
                        new echarts.graphic.BoundingRect(left, top, width, height)
                    );
                    if (isForClipping) {
                        path.position = [-width / 2, -height / 2];
                    }
                    return path;
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
            var itemModel = data.getItemModel(idx);
            var itemStyleModel = itemModel.getModel('itemStyle');
            var phase = itemModel.get('phase');
            var amplitude = parsePercent(itemModel.get('amplitude'),
                radius * 2);
            var waveLength = parsePercent(itemModel.get('waveLength'),
                radius * 2);

            var value = data.get('value', idx);
            var waterLevel = radius - value * radius * 2;
            phase = oldWave ? oldWave.shape.phase
                : (phase === 'auto' ? idx * Math.PI / 4 : phase);
            var normalStyle = itemStyleModel.getModel('normal').getItemStyle();
            normalStyle.fill = data.getItemVisual(idx, 'color');

            var x = radius * 2;
            var wave = new LiquidLayout({
                shape: {
                    waveLength: waveLength,
                    radius: radius,
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

            var hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
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
            var labelModel = itemModel.getModel('label.normal');
            var textStyle = labelModel.getModel('textStyle');

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
                    width: radius * 2,
                    height: radius * 2
                },
                style: {
                    fill: 'transparent',
                    text: formatLabel(),
                    textAlign: textStyle.get('align'),
                    textVerticalAlign: textStyle.get('baseline')
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
