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

        // itemStyle
        var skyColor = itemModel.get('itemStyle.normal.skyColor');
        var borderColor = itemModel.get('itemStyle.normal.borderColor');
        var borderWidth = itemModel.get('itemStyle.normal.borderWidth');
        var borderDistance = itemModel.get('itemStyle.normal.borderDistance');

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
                setWaveAnimation(idx, wave);

                group.add(wave);
                data.setItemGraphicEl(idx, wave);
                waves.push(wave);
            })
            .update(function (newIdx, oldIdx) {
                var oldWave = oldData.getItemGraphicEl(oldIdx);

                // new wave is used to calculate position, but not added
                var newWave = getWave(newIdx, false, oldWave);
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
        function getWave(idx, isInverse, oldWave) {
            var itemModel = data.getItemModel(idx);

            var phase = itemModel.get('phase');
            var direction = itemModel.get('direction');
            var amplitude = itemModel.get('amplitude');
            var opacity = itemModel.get('itemStyle.normal.opacity');

            var value = data.get('value', idx);
            var waterLevel = radius - value * radius * 2;
            var phase = oldWave ? oldWave.shape.phase : idx * Math.PI / 4;
            var waterColor = data.getItemVisual(idx, 'color');

            var x = direction === 'left' ? radius * 2 : 0;

            var wave = new LiquidLayout({
                shape: {
                    waveLength: waveLength,
                    radius: radius,
                    cx: x,
                    cy: 0,
                    waterLevel: waterLevel,
                    amplitude: amplitude,
                    borderWidth: borderWidth,
                    borderDistance: paddingRadius,
                    phase: phase,
                    inverse: isInverse
                },
                style: {
                    fill: waterColor,
                    opacity: opacity
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
            var itemModel = data.getItemModel(idx);

            var maxSpeed = itemModel.get('speed');
            var direction = itemModel.get('direction');

            var value = data.get('value', idx);
            var value0 = data.get('value', 0);
            var phase = wave.shape.phase || idx * Math.PI / 3;
            var cnt = data.count();
            var speed = cnt === 0 ? maxSpeed : maxSpeed *
                (0.2 + (idx + 1) / cnt * 0.8);

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

            // wave animation of moving left/right
            wave
                .animate()
                .stop();
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
