import { ipcRenderer } from "electron";

import { JsRequest } from "@drmer/core";

class DesktopBridge {

  constructor() {
    // bridge tgrok event
    ipcRenderer.on("tgrok", (_, message) => {
      if (!(window as any).drmer) {
        return;
      }
      (window as any).drmer.emit("tgrok", message);
    });
  }

  public postMessage(body: string): void {
    const req = new JsRequest(body);

    if (req.id) {
      ipcRenderer.once(req.id, (_evt: any, args: object) => {
        (window as any).drmer.dequeue(req.id, args);
      });
    }
    ipcRenderer.send("call", body);
  }

}

export {
  DesktopBridge,
};
