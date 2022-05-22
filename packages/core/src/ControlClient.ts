import { find, remove, forEach } from "lodash";
import { ProxyClient } from "./ProxyClient";
import { TgrokClient } from "./TgrokClient";
import { Tunnel } from "./Tunnel";
import { event } from "./event";
import { ControlStatus, TunnelStatus } from "@tgrok/shared";

class ControlClient extends TgrokClient {

  private _clientId = "";
  protected typeName = "ctl";
  private recvBuffer?: Buffer;
  private timerId: any;
  public readonly tunnelList: Tunnel[] = [];
  private config: any;
  private _status = 0;

  constructor(config: object, tunnels: Tunnel[]) {
    super();
    this.config = config;
    this.tunnelList = tunnels;
  }

  public get clientId(): string {
    return this._clientId;
  }

  public get status(): number {
    return this._status;
  }

  public set status(val: number) {
    this._status = val;
    event.emit("info", {
      evt: "control:status",
      payload: val,
    });
  }

  protected onConnect = (): void => {
    super.onConnect();
    this.status = ControlStatus.CONNECTED;
    this.send(this.auth());
  };

  protected onData = (data: Buffer): void => {
    if (data.length <= 0) {
      return;
    }

    if (this.recvBuffer) {
      this.recvBuffer = Buffer.concat([this.recvBuffer, data]);
    } else {
      this.recvBuffer = data;
    }

    let length = 0;

    do {
      const headBuffer = this.recvBuffer.slice(0, 8);

      length = headBuffer.readUInt32LE(0);

      if (this.recvBuffer.length < 8 + length) {
        return;
      }
      this.info(`reading message with length: ${length}`);
      const raw = this.recvBuffer.slice(8, length + 8);

      this.recvBuffer = this.recvBuffer.slice(length + 8);
      this.handleData(raw.toString());

      if (this.recvBuffer.length < 8) {
        return;
      }

      length = this.recvBuffer.slice(0, 8).readUInt32LE(0);
    } while (this.recvBuffer.length >= (8 + length));
  };

  protected onEnd = (): void => {
    this.emit("end");
    this.status = ControlStatus.END;
    this.clearTimer();
  };

  protected onError = (err: Error): void => {
    this.emit("error", err);
    this.status = ControlStatus.END;
    this.clearTimer();
  };

  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  private handleData = (raw: string) => {
    this.info(`recv <<<< ${raw}`);
    const json = JSON.parse(raw);
    const payload = json.Payload;

    switch (json.Type) {
      case "AuthResp":
        this._clientId = payload.ClientId;
        event.emit("info", {
          evt: "auth:resp",
          payload: payload.Error,
        });
        if (payload.Error) {
          this.status = ControlStatus.AUTH_FAILED;

          return;
        }
        this.status = ControlStatus.READY;
        // start timer
        this.startTimer();
        // register tunnels
        this.registerTunnels();
        break;
      case "ReqProxy":
        this.regProxy();
        event.emit("info", {
          evt: "proxy:req",
        });
        break;
      case "NewTunnel":
        event.emit("info", {
          evt: "tunnel:resp",
          payload: payload.Error,
        });
        if (payload.Error) {
          this.info(`Add tunnel failed, ${payload.Error}`, true);

          return;
        }
        this.newTunnel(payload);
        break;
      default:
        break;
    }
  };

  private regProxy = () => {
    if (!this.host) {
      return;
    }
    const proxy = new ProxyClient(this);

    proxy.start(this.host, this.port, this.context);
  };

  private newTunnel = (payload: any) => {
    const tunnel = find(this.tunnelList, { requestId: payload.ReqId });

    if (!tunnel) {
      this.info(`No tunnel found for requestId ${payload.ReqId}`, true);

      return;
    }
    tunnel.url = payload.Url;
    tunnel.status = TunnelStatus.CONNECTED;
    this.info(`Add tunnel OK, type: ${payload.Protocol} url: ${payload.Url}`, true);
  };

  private auth = () => {
    return {
      Type: "Auth",
      Payload: {
        Version: "2",
        MmVersion: "1.7",
        User: this.config.token,
        Password: "",
        OS: "darwin",
        Arch: "amd64",
        ClientId: this.clientId,
      },
    };
  };

  private startTimer = () => {
    if (this.timerId) {
      return;
    }
    this.timerId = setInterval(() => {
      this.send(this.ping());
    }, 20 * 1000);
  };

  private ping = () => {
    return {
      Type: "Ping",
      Payload: {},
    };
  };

  private registerTunnels = () => {
    forEach(this.tunnelList, (tunnel) => {
      this.registerTunnel(tunnel);
    });
  };

  private registerTunnel = (tunnel: Tunnel) => {
    tunnel.status = TunnelStatus.CONNECTING;
    this.send(tunnel.request());
  };

  public openTunnel = (tunnel: Tunnel): void => {
    this.info(`opening tunnel for ${tunnel.subdomain}`);
    const oldTunnel = find(this.tunnelList, {
      id: tunnel.id,
    });

    if (oldTunnel) {
      if (oldTunnel.status !== 0) {
        // in changing state
        return;
      }
      this.tunnelList.splice(
        this.tunnelList.indexOf(oldTunnel),
        1,
      );
    }
    this.tunnelList.push(tunnel);
    if (oldTunnel && oldTunnel.subdomain === tunnel.subdomain && oldTunnel.url) {
      // tunnel is already successfully registered
      tunnel.url = oldTunnel.url;
      tunnel.status = TunnelStatus.CONNECTED;

      return;
    }
    // console.log(this.tunnelList)
    this.registerTunnel(tunnel);
  };

  public closeTunnel = (id: string): void => {
    this.info(`closing tunnel for ${id}`);
    const tunnel = find(this.tunnelList, {
      id,
    });

    if (tunnel) {
      tunnel.status = TunnelStatus.DISCONNECTED;
    }
    // console.log(this.tunnelList)
  };

  public removeTunnel = (id: string): void => {
    remove(this.tunnelList, {
      id,
    });
    // console.log(this.tunnelList)
    event.emit("info", {
      evt: "tunnel:removed",
      payload: id,
    });
  };

}

export {
  ControlClient,
};
