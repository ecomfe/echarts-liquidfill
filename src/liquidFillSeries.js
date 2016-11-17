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
        color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'],
        center: ['50%', '50%'],
        radius: '80%',
        amplitude: 10,
        waveLength: '50%',
        phase: 0,
        speed: 2000,
        direction: 'right',

        itemStyle: {
            normal: {
                skyColor: '#C8FFFB',
                borderColor: '#294D99',
                borderWidth: 10,
                borderDistance: 10,
                opacity: 1
            },
            emphasis: {
                skyColor: '#293c55',
                borderColor: '#294D99',
                borderWidth: 10,
                borderDistance: 10,
                opacity: 1
            }
        },

        label: {
            normal: {
                show: true,
                position: 'outer',
                textStyle: {
                    color: '#294D99',
                    insideColor: '#fff',
                    fontSize: 50,
                    fontWeight: 'bold'
                },
                textAlign: 'center',
                textVerticalAlign: 'middle'
            }
        }
    }
});
