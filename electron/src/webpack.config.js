var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var rootDir = path.resolve(__dirname, '../');

module.exports = {
    entry: {
        polyfills: path.resolve(rootDir, 'src/shared/polyfills.ts'),
        vendor: path.resolve(rootDir, 'src/vendor.ts'),
        app: path.resolve(rootDir, 'src/main.ts')
    },
    output: {
        path: rootDir + "/dist",
        filename: "[name].uhk.js"
    },
    target: 'electron-renderer',
    externals: {
        usb: 'usb'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
        modules: ["node_modules"],
        alias: {
            jquery: 'jquery/dist/jquery.min.js',
            select2: 'select2/dist/js/select2.full.min.js',
            'file-saver': 'filesaver.js/FileSaver.min.js'
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: ['ts-loader', 'angular2-template-loader'], exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html-loader?attrs=false' },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'sass-loader']
            },
            { test: /jquery/, loader: 'expose-loader?$!expose-loader?jQuery' },
            { test: require.resolve("usb"), loader: "expose-loader?usb" }
        ]
    },
    plugins: [
        //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
        new SvgStore({
            svgoOptions: {
                plugins: [
                    { removeTitle: true }
                ]
            }
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: path.join(__dirname, 'index.html'), flatten: true
                },
                {
                    from: 'node_modules/font-awesome/css/font-awesome.min.css',
                    to: 'vendor/font-awesome/css/font-awesome.min.css'
                },
                {
                    from: 'node_modules/font-awesome/fonts',
                    to: 'vendor/font-awesome/fonts'
                },
                {
                    from: 'node_modules/bootstrap/dist/',
                    to: 'vendor/bootstrap'
                },
                {
                    from: 'images',
                    to: 'images'
                },
                {
                    from: 'rules',
                    to: 'rules'
                },
                {
                    from: 'node_modules/usb',
                    to: 'vendor/usb'
                },
                {
                    from: 'electron/src/package.json',
                    to: 'package.json'
                }
            ]
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        })
    ]

}
