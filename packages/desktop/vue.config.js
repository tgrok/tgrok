const path = require("path");
const rimraf = require("rimraf");
const CopyPlugin = require("copy-webpack-plugin");

const plugins = [];

if (!process.env.WEBPACK_DEV_SERVER) {
  plugins.push(
    new CopyPlugin([
      {
        from: "./www",
        to: "./www",
      },
    ]),
  );
}

module.exports = {
  outputDir: "build",
  publicPath: "./",
  devServer: {
    host: "127.0.0.1",
    disableHostCheck: true,
    contentBase: path.join(__dirname, "www"),
  },
  lintOnSave: false,
  // indexPath: "www/index.html",
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "main/background.ts",
      rendererProcessFile: "playground/main.ts",
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ["../../node_modules", "./node_modules"],
      preload: "preload/index.ts",
      removeElectronJunk: false,
      builderOptions: {
        productName: "Tgrok",
        linux: {
          category: "Utility",
          icon: "./icon.png",
          executableName: "Tgrok",
          artifactName: "${productName}-${version}.${ext}",
        },
        mac: {
          category: "public.app-category.education",
          icon: "./icon.png",
        },
        win: {
          icon: "./icon.png",
        },
        beforePack: async function(context) {
          // remove unused js and files
          const outDir = path.join(context.outDir, "bundled");
          rimraf.sync(path.join(outDir, "js"));
          rimraf.sync(path.join(outDir, "index.html"));
          rimraf.sync(path.join(outDir, "favicon.ico"));
        },
      },
    },
  },
  configureWebpack: {
    plugins: plugins,
  },
  chainWebpack: (config) => {
    if (process.env.WEBPACK_DEV_SERVER) {
      config.plugins.delete("html");
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }

    config.resolve.extensions.merge([".json", ".svg"]);
  },
};
