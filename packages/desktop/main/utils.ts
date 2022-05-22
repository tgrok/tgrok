import path from "path";
import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { ServiceAdapter } from "./ServiceAdapter";

export function createWindow(): BrowserWindow {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 375,
    minHeight: 667,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  new ServiceAdapter(win);

  (async () => {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      // await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
      await win.loadURL("http://127.0.0.1:8080");
      // if (!process.env.IS_TEST) {
      //   win.webContents.openDevTools()
      // }
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      await win.loadURL("app://./index.html");
    }
  })();

  return win;
}
