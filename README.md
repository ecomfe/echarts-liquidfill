# ECharts Liquid Fill Chart

Liquid Fill Chart plugin for [ECharts](https://github.com/ecomfe/echarts).

This type of charts are usually used to represent percentage data.



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
        data: [0.5]
    }]
};
```

![A simple liquid fill chart](http://g.recordit.co/r0DvCuoqSY.gif)

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

![Multiple waves](http://g.recordit.co/1ObSCjLCeG.gif)


### Static Waves

To provent the waves from moving left or right, you may simply set `direction` to be `none`. To disable the animation of waves raising, set `animationDuration` and `animationDurationUpdate` to be 0.

```js
var option = {
    series: [{
        type: 'liquidFill',
        direction: 'none',
        animationDuration: 0,
        animationDurationUpdate: 0,
        data: [0.6, 0.5, 0.4, 0.3]
    }]
};
```


### Still Water

You may set the `amplitude` to be 0 to make still waves.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        amplitude: 0
    }]
};
```

![Still water](http://g.recordit.co/EQ5pnYDAtN.gif)


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

![Change a single wave](http://g.recordit.co/p1fHmfexW4.gif)


### Border Style

You may set `outline.borderDistance` to be 0 to disable the gap between waves and border.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        outline: {
            borderDistance: 0
        }
    }]
};
```

![No border distance](http://g.recordit.co/G8tAPTIdFa.gif)

To hide the border, set `outline.itemStyle.borderWidth` to be 0. You may also change `outline.itemStyle.borderColor` to change border color.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        outline: {
            borderDistance: 0,
            itemStyle: {
                borderWidth: 0
            }
        }
    }]
};
```

![No border](http://g.recordit.co/E8YI6wlvp4.gif)


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
}, 1000);
```

![Update animation](http://g.recordit.co/dGcr25E8J8.gif)


### Change Text

By default, the text label of liquid fill chart displays percentage of the first data. For example, for a chart with data `[0.6, 0.5, 0.4, 0.3]`, default text is `60%`.

To change the text, you may use `label.normal.formatter`, which can be set to a string or function.

If it is a string, `{value}` in the string will be replaced with the first data.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        label: {
            normal: {
                formatter: 'I\'m {value}',
                textStyle: {
                    fontSize: 20
                }
            }
        }
    }]
};
```

The text of the above code is `I'm 0.6`.

If it is a function, the `value` parameter contains all the data.

```js
var option = {
    series: [{
        type: 'liquidFill',
        data: [0.6, 0.5, 0.4, 0.3],
        label: {
            normal: {
                formatter: function(value) {
                    return 'I\'m ' + value;
                },
                textStyle: {
                    fontSize: 20
                }
            }
        }
    }]
};
```

The text of the above code is `I'm 0.6,0.5,0.4,0.3`.


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
    phase: 0,
    speed: 5000,
    direction: 'right',

    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    animationDuration: 2000,
    animationDurationUpdate: 1000,

    outline: {
        borderDistance: 10,
        itemStyle: {
            borderColor: '#294D99',
            borderWidth: 10
        }
    },

    itemStyle: {
        normal: {
            backgroundColor: '#E3F7FF',
            opacity: 0.95
        },
        emphasis: {
            opacity: 0.8
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

Phase of wave, in radian system. By default, each wave has a phase of `Math.PI / 4` larger than the previous one.


### period {number}

Milliseconds that it takes to move forward a wave-length.


### direction {string}

Direction that the waves moving in, which should either be `'right'`, `'left'`, or `'none'` for not moving.


### animationEasing {string}

Easing methods for initial animation, when waves raise from the bottom at the beginning.


### animationEasingUpdate {string}

Easing methods for other animation, for example, when data value changes and wave position changes.


### animationDuration {number}

Initial animation duration, in milliseconds.

### animationDurationUpdate {number}

Other animation duration, in milliseconds.


### outline.borderDistance {number}

Distance between border and inner circle.


### outline.itemStyle.borderColor {string}

Border color.


### outline.itemStyle.borderWidth {number}

Border width.


### itemStyle.normal.backgroundColor {string}

Background color.


### itemStyle.normal.opacity {number}

Wave opacity.


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


### label.emphasis.textStyle.color {string}

Color of text when display on background when hover.


### label.emphasis.textStyle.insideColor {string}

Color of text when display on wave when hover.


### label.emphasis.textStyle.fontSize {number}

Label font size when hover.


### label.emphasis.textStyle.fontWeight {string}

Label font weight when hover.
