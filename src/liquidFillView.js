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
        var speed = itemModel.get('speed');
        var direction = itemModel.get('direction');

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

        group.add(getBackground());
        group.add(getWave());
        group.add(getText());

        // data.setItemGraphicEl(0, borderRing);

        function getBackground() {
            return new echarts.graphic.Circle({
                shape: {
                    cx: cx,
                    cy: cy,
                    r: radius
                },
                style: {
                    fill: '#C8FFFB'
                }
            });
        }

        function getWave() {
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
                    phase: phase
                },
                style: {
                    fill: '#2D99D9'
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
            var halfPhase = 0;
            if (direction === 'right' || direction == undefined) {
                halfPhase = Math.PI;
            }
            else if (direction === 'left') {
                halfPhase = -Math.PI;
            }
            else if (direction === 'none') {
                halfPhase = 0;
            }
            else {
                console.error('Illegal direction value for liquid fill.');
            }

            // wave animation of moving left/right and changing amplitude
            wave.animate('shape', true)
                .when(0, {
                    phase: 0,
                    amplitude: amplitude[1]
                })
                .when(speed / 2, {
                    phase: halfPhase,
                    amplitude: amplitude[0]
                })
                .when(speed, {
                    phase: halfPhase * 2,
                    amplitude: amplitude[1]
                })
                .start();

            return wave;
        }

        function getText() {
            return new echarts.graphic.Text({
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
        }
    }
});




