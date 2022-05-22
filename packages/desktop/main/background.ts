import { app, protocol, BrowserWindow } from "electron";
import { createWindow } from "./utils";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { tgrok } from "./tgrok";
import { event as tgrokEvent } from "@tgrok/core";

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true,
      stream: true,
    },
  },
]);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: any;

tgrokEvent.on("info", (evt: any) => {
  if (!win) {
    return;
  }
  win.webContents.send("tgrok", evt);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    win = createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  tgrok.debug = isDevelopment;
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  win = createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
