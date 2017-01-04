# ECharts Liquid Fill Chart

Liquid Fill Chart plugin for [ECharts](https://github.com/ecomfe/echarts), which is usually used to represent data in percentage.

![Rendering Results](http://g.recordit.co/zHeMqqlh4j.gif)

## Setup

To use ECharts plugins, you need to include the plugin JavaScript file after ECharts file.

```html
<script src='https://cdn.bootcss.com/echarts/3.2.2/echarts.js'></script>
<script src='./dist/echarts-liquidfill.js'></script>
```

You may download the lastest ECharts files on [ECharts official site](http://echarts.baidu.com/download.html) and download this plugin in [dist directory](https://github.com/ecomfe/echarts-liquidfill/tree/master/dist). Note that if you need tooltip for Liquid Fill Chart, you need the complete ECharts version. Otherwise, simple version will do.



## Setting Options

### A Simple Example

To create a Liquid Fill Chart, you need to have a series with type of `'liquidFill'`. A basic option may be:

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6]
    }]
};
```

![A simple liquid fill chart](http://g.recordit.co/RsjUlo69JN.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xr1XplzB4e)


### Examples on Gallery

[View more examples](http://gallery.echartsjs.com/explore.html#tags=liquidFill~sort=rank~timeframe=all~author=all).

### Multiple Waves

It is easy to create a liquid fill chart will multiple waves, either to represent multiple data, or to improve the visual effect of the chart.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3]
    }]
};
```

This creates a chart wit waves at position of 60%, 50%, 40%, and 30%.

![Multiple waves](http://g.recordit.co/HJ3z3ITqzL.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xSyIEWMBNl)


### Color and Opacity

To set colors for liquid fill chart series, set `color` to be an array of colors. To set opacity, use `itemStyle.normal.opacity` and `itemStyle.emphasis.opacity` for normal style and hover style.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.5, 0.4, 0.3],
        color: ['red', '#0f0', 'rgb(0, 0, 255)'],
        itemStyle: {
            normal: {
                opacity: 0.6
            },
            emphasis: {
                opacity: 0.9
            }
        }
    }]
};
```

![Color and opacity](http://g.recordit.co/ZVRBdxO6oY.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xrJpDC704l)

You may also set the color and opacity of a single data item by:

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.5, 0.4, {
            value: 0.3,
            itemStyle: {
                normal: {
                    color: 'red',
                    opacity: 0.6
                },
                emphasis: {
                    opacity: 0.9
                }
            }
        }]
    }]
};
```

![Color and opacity of a single data item](http://g.recordit.co/Smz5G8ypvO.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xBJPCRXR4l)


### Static Waves

To provent the waves from moving left or right, you may simply set `waveAnimation` to be `false`. To disable the animation of waves raising, set `animationDuration` and `animationDurationUpdate` to be 0.

```js
var option = {
    series: [{
        type: 'liquidFill',
        waveAnimation: false,
        animationDuration: 0,
        animationDurationUpdate: 0,
        data: [0.6, 0.5, 0.4, 0.3]
    }]
};
```

![Static waves](http://g.recordit.co/Wze7eblLPM.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xH1VfVVREx)


### Still Water

You may set the `amplitude` to be 0 to make still waves.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        amplitude: 0,
        waveAnimation: 0
    }]
};
```

It is recommended to set `waveAnimation` to be false in this case to disable animation for performance consideration.

![Still water](http://g.recordit.co/EQ5pnYDAtN.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xHy1NHVCNx)

### Change A Single Wave

To change a single wave, overwrite the options in data item.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, {
            value: 0.5,
            direction: 'left',
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
        }, 0.4, 0.3]
    }]
};
```

![Change a single wave](http://g.recordit.co/31VHgsRV2y.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xry6CHNCVl)

### Background Style

You can use backgroundStyle option to set the stroke, fill style of background shape.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'red',
            color: 'yellow'
        }
    }]
};
```

![Change border width and color](http://g.recordit.co/nXCxOcV4IQ.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xSkJoa_kBx)

### Outline Style

To hide the outline, just set `outline.show` to be `false`.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        outline: {
            show: false
        }
    }]
};
```

![No outline](http://g.recordit.co/nIxiw5KAGC.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xSySxR_JBg)


### Animation

Generally speaking, there are two types of animations in liquid fill charts.

The first type is initial animation, which has the effect of wave raising. The easing method of this animation is controlled with `animationEasing` and its duration with `animationDuration`.

The second type is the update animation, which is usually used when data changes and wave height changes. They are controlled with `animationEasingUpdate` and `animationDurationUpdate`.

For example, to disable the raising animation and set update animation time to be two seconds with `cubicOut` easing, you can use the following option:

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        animationDuration: 0,
        animationDurationUpdate: 2000,
        animationEasingUpdate: 'cubicOut'
    }]
};
chart.setOption(option);
setTimeout(function () {
    chart.setOption({
        series: [{
            type: 'liquidFill',
            data: [0.8, 0.6, 0.4, 0.2]
        }]
    })
}, 3000);
```

![Update animation](http://g.recordit.co/qt87aYQ9SO.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xSk8I5JcHe)

### Change Text

By default, the text label of liquid fill chart displays percentage of the first data. For example, for a chart with data `[0.6, 0.5, 0.4, 0.3]`, default text is `60%`.

To change the text, you may use `label.normal.formatter`, which can be set to a string or function.

If it is a string, `{a}` refers to series name, `{b}` to data name, and `{c}` to data value.

```js
var option = {
    series: [{
        type: 'liquidFill',
        name: 'Liquid Fill',
        data: [{
            name: 'First Data',
            value: 0.6
        }, 0.5, 0.4, 0.3],
        label: {
            normal: {
                formatter: '{a}\n{b}\nValue: {c}',
                textStyle: {
                    fontSize: 28
                }
            }
        }
    }]
};
```

Label text of this example is `'Liquid Fill\nFirst Data\nValue: 0.6'`.

![Label formatter as string](http://g.recordit.co/3Zcftu8tpL.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xrkwSn1qHx)

This has the same result as using `formatter` as a function:

```js
var option = {
    series: [{
        type: 'liquidFill',
        name: 'Liquid Fill',
        data: [{
            name: 'First Data',
            value: 0.6
        }, 0.5, 0.4, 0.3],
        label: {
            normal: {
                formatter: function(param) {
                    return param.seriesName + '\n'
                        + param.name + '\n'
                        + 'Value:' + param.value;
                },
                textStyle: {
                    fontSize: 28
                }
            }
        }
    }]
};
```

[Run](http://gallery.echartsjs.com/editor.html?c=xHk5831cHg)

Text position is at the center by default. `label.normal.position` can be set to be `'inside'`, `'left'`, `'right'`, `'top'`, `'bottom'`, or horizontal and vertical positions like `['10%', '20%']`, which means `'10%'` to the left (controlled by `label.normal.textStyle.align`, which can be `'left'`, `'center'`, or `'right'`) and `'20%'` to the top (controlled by `label.normal.textStyle.baseline`, which can be `'top'`, `'middle'`, or `'bottom'`).


### Shadow

By default, waves and outline have shadow on them. Here's how to change them.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        itemStyle: {
            normal: {
                shadowBlur: 0
            }
        },
        outline: {
            borderDistance: 0,
            itemStyle: {
                borderWidth: 5,
                borderColor: '#156ACF',
                shadowBlur: 20,
                shadowColor: 'rgba(255, 0, 0, 1)'
            }
        }
    }]
};
```

![Change shadow](http://g.recordit.co/nIy6lZaS8C.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xrJO4CyqSl)

### Tooltip

To add tooltip:

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6],
        name: 'Liquid Fill'
    }],
    tooltip: {
        show: true
    }
};
```

~[Tooltip](http://g.recordit.co/S1zQTS6B0G.gif)

[Run](http://gallery.echartsjs.com/editor.html?c=xSJqXeg5He)


## API

Default option for liquid fill charts are:

```js
{
    data: [],

    color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'],
    center: ['50%', '50%'],
    radius: '50%',
    amplitude: 20,
    waveLength: '80%',
    phase: 'auto',
    period: 'auto',
    direction: 'right',

    waveAnimation: true,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    animationDuration: 2000,
    animationDurationUpdate: 1000,

    outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
            color: 'none',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
    },

    backgroundStyle: {
        color: '#E3F7FF'
    },

    itemStyle: {
        normal: {
            opacity: 0.95,
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
        },
        emphasis: {
            opacity: 0.8
        }
    },

    label: {
        normal: {
            show: true,
            textStyle: {
                color: '#294D99',
                insideColor: '#fff',
                fontSize: 50,
                fontWeight: 'bold',

                align: 'center',
                baseline: 'middle'
            },
            position: 'inside'
        }
    }
}
```


### data {(number|Object)[]}

Value of each data item should be between 0 and 1.

The data item can also be an object to configure the option for a single item.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, {
            value: 0.5,
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
        }, 0.4, 0.3]
    }]
};
```

This defines a chart with the second wave of red color.


### color {string[]}

Wave colors.


### center {string[]}

Position of the chart. The first value is x position, the second one is the y position. Each of the values can be a relative value like `'50%'`, which is relative to the smaller value of container width and height, or an absolute value like `100px`.


### radius {string}

Radius of the chart, which can be a relative value like `'50%'`, which is relative to the smaller value of container width and height, or an absolute value like `100px`.


### amplitude {number}

Amplitude of the wave, in pixels.


### waveLength {string|number}

Wave length of the wave, which can be a relative value like `'50%'`, which is relative to the diameter, or an absolute value like `'100px'` or `100`.


### phase {number}

Phase of wave, in radian system. By default, it is set to be `'auto'`, when each wave has a phase of `Math.PI / 4` larger than the previous one.


### period {number|'auto'|function}

Milliseconds that it takes to move forward a wave-length. By default, it is set to be `'auto'`, when the wave at the front has a greater speed.

It can also be a formatter function.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        radius: '70%',
        phase: 0,
        period: function (value, index) {
            // This function is called four times, each for a data item in series.
            // `value` is 0.6, 0.5, 0.4, 0.3, and `index` is 0, 1, 2, 3.
            return 2000 * index + 1000;
        }
    }]
}
```


### direction {string}

Direction that the waves moving in, which should either be `'right'`, or `'left'`.


### waveAnimation {boolean}

Whether to enable wave from moving left or right.


### animationEasing {string}

Easing methods for initial animation, when waves raise from the bottom at the beginning.


### animationEasingUpdate {string}

Easing methods for other animation, for example, when data value changes and wave position changes.


### animationDuration {number}

Initial animation duration, in milliseconds.

### animationDurationUpdate {number}

Other animation duration, in milliseconds.


### outline.show {boolean}

Whether to display outline.


### outline.borderDistance {number}

Distance between border and inner circle.


### outline.itemStyle.borderColor {string}

Border color.


### outline.itemStyle.borderWidth {number}

Border width.


### outline.itemStyle.shadowBlur {number}

Outline shadow blur size.


### outline.itemStyle.shadowColor {string}

Outline shadow color.

### backgroundStyle.color {string}

Background fill color.

### backgroundStyle.borderWidth {string}

Background stroke line width.

### backgroundStyle.borderColor {string}

Background stroke line width.

### backgroundStyle.itemStyle.shadowBlur {number}

Background shadow blur size.

### backgroundStyle.itemStyle.shadowColor {string}

Background shadow color.

### backgroundStyle.itemStyle.opacity {number}

Background opacity.


### itemStyle.normal.opacity {number}

Wave opacity.


### itemStyle.normal.shadowBlur {number}

Wave shadow width.


### itemStyle.normal.shadowColor {string}

Wave shadow color.


### itemStyle.emphasis.opacity {number}

Wave opacity when hover.


### label.normal.show {boolean}

Whether to display label text.


### label.normal.textStyle.color {string}

Color of text when display on background.


### label.normal.textStyle.insideColor {string}

Color of text when display on wave.


### label.normal.textStyle.fontSize {number}

Label font size.


### label.normal.textStyle.fontWeight {string}

Label font weight.


### label.normal.textStyle.align {string}

Text align, which should be `'left'`, `'center'`, or `'right'`.


### label.normal.textStyle.baseline {string}

Text vertical align, which should be `'top'`, `'middle'`, or `'bottom'`.


### label.position {string|string[]}

Text position is at the center by default. `label.position` can be set to be `'inside'`, `'left'`, `'right'`, `'top'`, `'bottom'`, or horizontal and vertical positions like `['10%', '20%']`, which means `'10%'` to the left and `'20%'` to the top.


## Build

For development:
```
$ webpack
```

For release:

```
$ webpack -p
```
