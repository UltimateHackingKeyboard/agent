// var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');
var webpackFailPlugin = require('webpack-fail-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');



var rootDir = path.resolve(__dirname, '../'); 
console.log(__dirname, rootDir);

module.exports = {
    entry: ['es6-shim', 'zone.js', 'reflect-metadata', './src/boot.ts'],
    output: {
        path: rootDir + "/build",
        publicPath: rootDir + "/build/",
        filename: "uhk.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        modulesDirectories: ['node_modules']
    },
    module: {
        preLoaders: [
            {
                test: /(.js|.ts)$/,
                loader: 'string-replace-loader',
                query: {
                    search: 'moduleId: module.id,',
                    replace: '',
                    flags: 'g'
                }
            }
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html-loader' },
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
        new CleanWebpackPlugin(['build'], {
            root: rootDir
        }),
        new CopyWebpackPlugin([
            { from: './src/*.html', flatten: true },
            { from: './src/*.js', flatten: true }
        ], {
            ignore: ['*.config.js']
        })
    ]

}
