//var webpack = require('webpack');
const path = require("path");

module.exports = {
    entry:
        /*'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',*/
        path.resolve(__dirname, "client/index.ts")
    ,
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "client"),
    },

    devtool: "source-map",

    resolve: {
        extensions: [".js", ".js.map", ".jsx", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                include: [path.resolve(__dirname, "client")],
            }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin()
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin()
    ],
};