import { JsService } from "./JsService";
import { JsRequest } from "@drmer/core";
import { shell } from "electron";

class PageService extends JsService {

  public external(req: JsRequest): boolean {
    shell.openExternal(req.strParam("url"));

    return true;
  }

  public config(): null {
    return null;
  }

}

export {
  PageService,
};
