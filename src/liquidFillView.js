var echarts = require('echarts');
var numberUtil = require('echarts/lib/util/number');
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
        var oldData = this._data;
        var waves = [];
        data.diff(oldData)
            .add(function (idx) {
                var wave = getWave(idx, false, true);
                setWaveAnimation(idx, wave);

                group.add(wave);
                data.setItemGraphicEl(idx, wave);
                waves.push(wave);
            })
            .update(function (newIdx, oldIdx) {
                var oldWave = oldData.getItemGraphicEl(oldIdx);

                // new wave is used to calculate position, but not added
                var newWave = getWave(newIdx, false);
                // update old wave with parameters of new wave
                echarts.graphic.updateProps(oldWave, {
                    shape: newWave.shape
                }, seriesModel);

                setWaveAnimation(newIdx, oldWave);
                group.add(oldWave);
                data.setItemGraphicEl(newIdx, oldWave);
                waves.push(oldWave);
            })
            .remove(function (idx) {
                var wave = oldData.getItemGraphicEl(idx);
                group.remove(wave);
            })
            .execute();

        group.add(getText(waves));

        this._data = data;

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
        function getWave(idx, isInverse, zeroLevel) {
            var value = data.get('value', idx);
            var waterLevel = radius - value * radius * 2;
            var phase = idx * Math.PI / 3;
            var waterColor = data.getItemVisual(idx, 'color');

            var x = direction === 'left' ? radius * 2 : 0;

            var wave = new LiquidLayout({
                shape: {
                    waveLength: waveLength,
                    radius: radius,
                    cx: x,
                    cy: 0,
                    waterLevel: zeroLevel ? 0 : waterLevel,
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
            wave.shape._waterLevel = waterLevel;

            // clip out the part outside the circle
            wave.setClipPath(new echarts.graphic.Circle({
                shape: {
                    cx: 0,
                    cy: 0,
                    r: radius
                }
            }));

            return wave;
        }

        function setWaveAnimation(idx, wave) {
            var value = data.get('value', idx);
            var value0 = data.get('value', 0);
            var phase = idx * Math.PI / 3;
            var cnt = data.count();
            var speed = cnt === 0 ? maxSpeed : maxSpeed * (idx + 1) / cnt;

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
