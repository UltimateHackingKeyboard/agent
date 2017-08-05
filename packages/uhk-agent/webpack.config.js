const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = __dirname;

module.exports = {
    entry: [path.resolve(rootDir, 'src/electron-main.ts')],
    output: {
        path: rootDir + "/dist",
        filename: "electron-main.js"
    },
    target: 'electron-main',
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
        modules: ["node_modules"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' , exclude: /node_modules/},
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                {
                    from: 'src/manifest.json',
                    to: 'manifest.json'
                }
            ]
        )
    ],
    node: {
        __dirname: false,
        __filename: false
    }

};
