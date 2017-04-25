var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        "./index.ts",
    ],
    output: {
        filename: "index.js",
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
};