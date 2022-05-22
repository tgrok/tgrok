import { randomId } from "@tgrok/utils";
import { event } from "./event";
import { TunnelStatus } from "@tgrok/shared";

class Tunnel {
  public readonly id: string;
  public url = "";
  public localHost: string;
  public localPort: number;
  public requestId: string;

  private readonly hostname: string;
  public readonly subdomain: string;
  public readonly protocol: string;
  private readonly remotePort: number;

  private _status = TunnelStatus.DISCONNECTED;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(config: any) {
    this.id = config.id;
    this.requestId = randomId("a0", 20);
    this.hostname = config.hostname;
    this.subdomain = config.subdomain;
    this.protocol = config.protocol;
    this.localHost = config.lhost;
    this.localPort = config.lport;
    this.remotePort = config.rport;
  }

  public set status(val: number) {
    this._status = val;
    event.emit("info", {
      evt: "tunnel:status",
      payload: {
        id: this.id,
        status: this._status,
        url: this.url,
      },
    });
  }

  public get status(): number {
    return this._status;
  }

  public request = (): object => {
    return {
      Type: "ReqTunnel",
      Payload: {
        ReqId: this.requestId,
        Protocol: this.protocol,
        Hostname: this.hostname,
        Subdomain: this.subdomain,
        HttpAuth: "",
        RemotePort: this.remotePort,
      },
    };
  };
}

export {
  Tunnel,
};
