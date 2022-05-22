const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const pkg = require("./package.json");

module.exports = {
  outputDir: "build",
  publicPath: "./",

  devServer: {
    writeToDisk: true,
    disableHostCheck: true
  },

  transpileDependencies: [
    "vuetify"
  ],

  // no sourcemap for production
  productionSourceMap: false,

  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new WebpackNotifierPlugin({
        title: pkg.name,
        alwaysNotify: true,
      }),
    ],
  },

  chainWebpack: (config) => {
    config
      .entry("app")
      .clear();

    config.entry("app")
      .add("./playground/main.ts");

    config.resolve.alias
      .set("@", path.resolve("playground"));

    config.resolve.extensions.merge([".json", ".svg"]);
  }

};
