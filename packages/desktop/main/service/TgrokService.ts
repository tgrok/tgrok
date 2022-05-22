import { JsRequest } from "@drmer/core";
import { Tunnel } from "@tgrok/core";
import { JsService } from "./JsService";
import { tgrok } from "../tgrok";

class TgrokService extends JsService {

  public boot(req: JsRequest): void {
    tgrok.host = req.strParam("host");
    tgrok.port = req.numParam("port");
    tgrok.start([])
  }

  public reconnect(_req: JsRequest): void {
    tgrok.reconnect(true);
  }

  public open(req: JsRequest): void {
    tgrok.openTunnel(TgrokService.newTunnel(req.params));
  }

  private static newTunnel(conf: any) {
    return new Tunnel({
      id: conf.id,
      protocol: conf.protocol,
      hostname: "",
      subdomain: conf.subdomain,
      rport: 0,
      lhost: conf.localHost,
      lport: conf.localPort,
    });
  }

  public close(req: JsRequest): void {
    tgrok.closeTunnel(req.strParam("id"));
  }

  public remove(req: JsRequest): void {
    tgrok.removeTunnel(req.strParam("id"));
  }

  public status(_req: JsRequest): any {
    return tgrok.status;
  }

}

export {
  TgrokService,
};
