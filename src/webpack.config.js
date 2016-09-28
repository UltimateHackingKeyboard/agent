// var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');
var webpackFailPlugin = require('webpack-fail-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var rootDir = path.resolve(__dirname, '../');

module.exports = {
    entry: ['core-js', 'zone.js', './src/main.ts'],
    output: {
        path: rootDir + "/dist",
        filename: "uhk.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        modules: [ path.join(rootDir, "node_modules") ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html-loader?attrs=false' },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
        new SvgStore(
            [
                rootDir + '/images/icons/**/*.svg'
            ],
            './',
            {
                name: 'assets/compiled_sprite.svg',
                chunk: 'app',
                svgoOptions: {
                    plugins: [
                        { removeTitle: true }
                    ]
                }
            }
        ),
        webpackFailPlugin,
        new CopyWebpackPlugin([
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
                from: 'node_modules/bootstrap/dist',
                to: 'vendor/bootstrap'
            },
            {
                from: 'node_modules/jquery/dist/jquery.min.*',
                to: 'vendor/jquery',
                flatten: true
            },
            {
                from: 'node_modules/select2/dist',
                to: 'vendor/select2'
            },
            {
                from: 'images',
                to: 'images'
            },
        ], {
                ignore: ['*.config.js']
            })
    ]

}
