var echarts = require('echarts');
var layoutUtil = require('echarts/lib/util/layout');

require('./liquidFillSeries');
require('./liquidFillView');

echarts.registerLayout(function (ecModel, api) {
    ecModel.eachSeriesByType('liquidFill', function (seriesModel) {
        var gridRect = layoutUtil.getLayoutRect(
            seriesModel.getBoxLayoutParams(), {
                width: api.getWidth(),
                height: api.getHeight()
            }
        );
        var data = seriesModel.getData();

        var canvas = document.createElement('canvas');
        canvas.width = gridRect.width;
        canvas.height = gridRect.height;

        var ctx = canvas.getContext('2d');

        var sizeRange = seriesModel.get('sizeRange');
        var rotationRange = seriesModel.get('rotationRange');
        var valueExtent = data.getDataExtent('value');

        var DEGREE_TO_RAD = Math.PI / 180;
        var gridSize = seriesModel.get('gridSize');

        seriesModel.layoutInstance = {
            ondraw: null
        };
    });
});
