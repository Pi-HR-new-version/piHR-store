const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: "./src/main",
  mode: "development",
  // mode: "production",
  target: "web",
  // devtool: "eval-source-map",
  devtool: false,
  // output: {
  //   // library: {type: 'var'},
  //   libraryExport: "main",
  //   publicPath: "http://localhost:5000/",
  // },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  optimization: {
    minimize: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512_000,
    maxAssetSize: 512_000,
  },
  // library: { type: "module" },
  // target: "es2020",
  // experiments: {
  //   outputModule: true,
  // },
  module: {
    rules: [
      {
        test: /\.svg/,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: [["@babel/preset-react", { runtime: "automatic" }]],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: path.resolve(__dirname, "./dist/index.html"),
    }),
    new ModuleFederationPlugin({
      name: "store",
      filename: "remoteEntry.js",
      remotes: {
        // viteRemote: `promise import("http://localhost:5001/assets/remoteEntry.js")`,
      },
      exposes: {
        "./store": "./src/store.jsx",
        "./api": "./src/services/apiService.js",
        "./redux": "./src/redux.js",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
        "@reduxjs/toolkit": {
          singleton: true,
        },
        "react-redux": {
          singleton: true,
        },
      },
    }),
  ],
  devServer: {
    port: 8080,
    hot: false,
    liveReload: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};
