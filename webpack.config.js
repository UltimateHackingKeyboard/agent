// var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');
var webpackFailPlugin = require('webpack-fail-plugin');

module.exports = {
    entry: ['es6-shim', 'zone.js', 'reflect-metadata', './src/boot.ts'],
    output: {
        path: __dirname + "/build",
        publicPath: "/build/",
        filename: "uhk.js"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        alias: {

        },
        modulesDirectories: [
            'node_modules',
            'bower_components'
        ]
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
                'images/icons/**/*.svg'
            ],
            './',
            {
                name: 'compiled_sprite.svg',
                chunk: 'app',
                svgoOptions: {
                    plugins: [
                        { removeTitle: true }
                    ]
                }
            }
        ),
        webpackFailPlugin
    ]

}
