const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "index.tsx"),
    output: {
        filename: "index.js",
        path: path.resolve(__dirname)
    },

    devtool: "source-map",

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [],
};