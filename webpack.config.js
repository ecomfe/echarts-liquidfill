module.exports = env => {
    return {
        mode: env.production ? 'production' : 'development',
        entry: {
            'echarts-liquidfill': __dirname + '/index.js'
        },
        output: {
            libraryTarget: 'umd',
            library: ['echarts-liquidfill'],
            path: __dirname + '/dist',
            filename: env.production ? '[name].min.js' : '[name].js'
        },
        externals: {
            'echarts/lib/echarts': 'echarts'
        },
        devtool: 'source-map',
        resolve: {
            alias: {
                'echarts/lib/echarts': 'echarts'
            }
        },
        optimization: {
            minimize: env.production
        }
    }
};
