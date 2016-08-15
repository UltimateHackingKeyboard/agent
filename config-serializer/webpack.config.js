// var webpack = require("webpack");

module.exports = {
    entry: {
        main: __dirname + '/test-serializer.ts'
    },
    target: 'node',
    output: {
        path: __dirname,
        filename: "test-serializer.js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        alias: {

        },
        modulesDirectories: [
            '../node_modules'
        ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [
        //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ],
    node: {
        fs: "empty"
    }

}