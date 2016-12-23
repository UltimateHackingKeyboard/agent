var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');
var webpackFailPlugin = require('webpack-fail-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

var rootDir = path.resolve(__dirname, '../');

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        vendor: './src/vendor.ts',
        app: './src/main.ts'
    },
    output: {
        path: rootDir + "/dist",
        filename: "[name].uhk.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        modules: [path.join(rootDir, "node_modules")],
        alias: {
            jquery: 'jquery/dist/jquery.min.js',
            select2: 'select2/dist/js/select2.full.min.js'
        }
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html-loader?attrs=false' },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader']
            },
            { test: /jquery/, loader: 'expose?$!expose?jQuery' }
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
        webpackFailPlugin,
        new CopyWebpackPlugin(
            [
                { from: './src/*.html', flatten: true },
                { from: './src/*.js', flatten: true },
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
            ],
            {
                ignore: ['*.config.js']
            }
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
