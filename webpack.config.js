// var webpack = require("webpack");
var SvgStore = require('webpack-svgstore-plugin');

module.exports = {
    entry: ['reflect-metadata', 'zone.js', 'es6-shim', "./src/boot.ts"],
    output: {
        path: __dirname + "/bundle",
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
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
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