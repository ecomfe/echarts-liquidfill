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
        var start = new Date();
        var group = this.group;
        group.removeAll();

        var data = seriesModel.getData();

        var itemModel = data.getItemModel(0);

        var center = itemModel.get('center');
        var radius = itemModel.get('radius');
        var borderWidth = itemModel.get('borderWidth');
        var padding = itemModel.get('padding');

        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        var cx = parsePercent(center[0], width);
        var cy = parsePercent(center[1], height);
        var borderWidth = parsePercent(borderWidth, size);
        var outterRadius = parsePercent(radius, size) / 2;
        var innerRadius = outterRadius - borderWidth;
        var paddingRadius = parsePercent(padding, size);

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
                amplitude: amplitude,
                borderWidth: borderWidth,
                padding: paddingRadius
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
        group.add(wave);

        var text = new echarts.graphic.Text({
            style: {
                text: Math.ceil(data.get('value', 0) * 100) + '%',
                x: cx,
                y: waterLevel + cy - 20,
                fill: '#2D99D9',
                textAlign: 'center',
                textVerticalAlign: 'middle',
                textFont: '24px Arial'
            },
            silent: true
        });
        group.add(text);

        console.log(new Date() - start);
        // data.setItemGraphicEl(0, borderRing);
    }
});
