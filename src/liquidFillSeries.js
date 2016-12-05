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
        radius: '50%',
        amplitude: 20,
        waveLength: '80%',
        phase: 0,
        speed: 5000,
        direction: 'right',

        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        animationDuration: 2000,
        animationDurationUpdate: 1000,

        itemStyle: {
            normal: {
                skyColor: '#E3F7FF',
                borderColor: '#294D99',
                borderWidth: 10,
                borderDistance: 10,
                opacity: 0.9
            },
            emphasis: {
                borderColor: '#294D99',
                borderWidth: 10,
                borderDistance: 10,
                opacity: 0.95
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
            },
            emphasis: {
                textStyle: {
                    color: '#156ACF',
                    insideColor: '#E3F7FF',
                    fontSize: 50,
                    fontWeight: 'bold'
                }
            }
        }
    }
});
