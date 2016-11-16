var completeDimensions = require('echarts/lib/data/helper/completeDimensions');
var echarts = require('echarts');

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
        direction: 'right',

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
