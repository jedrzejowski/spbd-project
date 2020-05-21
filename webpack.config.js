const path = require("path");

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const commonConfig = {
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            use: "ts-loader",
            exclude: /node_modules/,
        }, {
            test: /\.(scss|sass|css)$/i,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader",
            ],
        }, {
            test: /\.(png|jpeg|jpg|gif)$/i,
            use: [{
                loader: "file-loader",
            }],
        },]
    },
    resolve: {
        extensions: [
            ".js", ".ts",
            ".tsx", ".jsx",
            ".json",
            ".sass", ".scss", ".css"
        ]
    },
    node: {
        __dirname: false
    }
}


module.exports = [{
    ...commonConfig,
    target: "electron-main",
    entry: {
        main: "./src/electron/index.ts"
    },
}, {
    ...commonConfig,
    target: "electron-renderer",
    entry: {
        gui: "./src/gui/index.tsx",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "SPBD Navi",
            filename: "index.html",
            chunks: ["gui"],
        })
    ]
}];