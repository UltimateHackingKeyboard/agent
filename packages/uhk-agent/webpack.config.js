const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin")

const webpackHelper = require('../../scripts/webpack-helper');

const rootDir = __dirname;

module.exports = {
    mode: 'production',
    entry: [path.resolve(rootDir, 'src/electron-main.ts')],
    output: {
        path: rootDir + "/dist",
        filename: "electron-main.js"
    },
    target: 'electron-main',
    externals: {
        "node-hid": "require('node-hid')"
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
        modules: ["node_modules"],
        mainFields: ["main", "module"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' , exclude: /node_modules/},
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/manifest.json',
                    to: 'manifest.json'
                },
                {
                    from: 'src/package.json',
                    to: 'package.json'
                },
                {
                    from: 'src/preload.js',
                    to: 'preload.js'
                }
            ]
        }),
        new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            webpackHelper.root(__dirname, './src') // location of your src
        )
    ],
    node: {
        __dirname: false,
        __filename: false
    }

}
