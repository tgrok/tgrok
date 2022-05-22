import { ipcMain, BrowserWindow } from "electron";

import { JsRequest } from "@drmer/core";
import {
  PageService,
  TgrokService,
} from "./service";

class ServiceAdapter {
  private readonly windowId: number;

  private readonly services: Map<String, any> = new Map();

  constructor(window: BrowserWindow) {
    this.windowId = window.id;

    this.services.set("PageService", new PageService());
    this.services.set("TgrokService", new TgrokService());
    ipcMain.on("call", this.handleMessage);
  }

  private handleMessage = (evt: any, body: string) => {
    if (evt.sender.id != this.windowId) {
      return;
    }
    const req = new JsRequest(body);
    const service = this.services.get(req.clsName);

    if (!service) {
      // tslint:disable-next-line: no-console
      console.log(`${req.clsName} not found`);

      return;
    }
    if (typeof (service as any)[req.clsMethod] !== "function") {
      // tslint:disable-next-line: no-console
      console.log(`Method ${req.clsMethod} in ${req.clsName} not found.`);

      return;
    }
    // tslint:disable-next-line: no-console
    // console.log(req);
    // tslint:disable-next-line: no-console
    // console.log('========================================');
    (async () => {
      try {
        const data = await (service as any)[req.clsMethod](req);
        // console.log(data);
        // console.log('<---------- sending back');

        if (req.id) {
          evt.sender.send(req.id, data);
        }
      } catch (err) {
        // tslint:disable-next-line no-console
        console.log(err);
      }
    })();
  };

}

export {
  ServiceAdapter,
};
