//var webpack = require("webpack");
var webpackFailPlugin = require('webpack-fail-plugin');
var path = require('path');

var rootDir = path.resolve(__dirname, '../');

module.exports = {
    entry: [ path.resolve(rootDir, 'src/electron-main.ts')],
    output: {
        path: rootDir + "/dist",
        filename: "electron-main.js"
    },
    target: 'electron-main',
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        modules: [path.join(rootDir, "node_modules")]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader?' + JSON.stringify({ configFileName: 'tsconfig-electron-main.json' }), exclude: /node_modules/ },
    ]},
    plugins: [
        //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
        webpackFailPlugin
    ],
    node: {
        __dirname: false,
        __filename: false
    }

}
