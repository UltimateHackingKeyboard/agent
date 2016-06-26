// var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');

module.exports = {
    entry: ['reflect-metadata', 'zone.js', 'es6-shim', "./src/boot.ts"],
    output: {
        path: __dirname + "/build",
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
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'html' },
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
        )
    ]

}