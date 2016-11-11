var echarts = require('echarts');

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
        padding: 0
    },

    style: {
        fill: '#0f0'
    },

    buildPath: function (ctx, shape) {
        drawWave(ctx, shape);
    }
});



function drawWave(ctx, shape) {
    var curves = Math.ceil(2 * shape.radius / shape.waveLength * 4);
    var controls = [[0, 0]];
    var positions = [];
    var left = shape.cx - shape.radius;

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
