import { EventEmitter } from "@drmer/core";
import { ControlClient } from "./ControlClient";
import { Log } from "./Log";
import { Tunnel } from "./Tunnel";
import { event } from "./event";

interface TgrokStatus {
  status: number,
  tunnels: any[],
}

class Tgrok extends EventEmitter {
  public host: string = "ngrok.local";
  public port: number = 4443;
  public config: any = {};
  public context: any = {};

  private started = false;

  private controlClient?: ControlClient;
  private timerId: any;
  private retryTimes = 0;

  public set debug(v: boolean) {
    Log.debug = v;
  }

  /**
   * Deprecated, use `start` in favor.
   */
  public startLocal = (lport?: number | string, domain?: string): void => {
    this.start(lport, domain);
  };

  public start = (lport?: number | string | Tunnel[], domain?: string): void => {
    // no repeated start
    if (this.started) {
      Log.error("\n\tAlready Started!!!\n");

      return;
    }
    this.started = true;

    let tunnels: Tunnel[] = [];

    if (typeof lport === "object") {
      tunnels = lport as Tunnel[];
    } else {
      let localPort = 80;
      let subdomain = domain;

      if (typeof lport === "number") {
        localPort = lport;
      } else {
        subdomain = lport as string;
      }
      tunnels.push(new Tunnel({
        protocol: "http",
        hostname: "",
        subdomain,
        rport: 0,
        lhost: "127.0.0.1",
        lport: localPort,
      }));
    }

    const client = new ControlClient(this.config, tunnels);

    client.on("connect", this.onConnect);
    client.on("error", this.onError);
    client.on("end", this.onEnd);
    this.controlClient = client;
    this.connect();
  };

  protected connect = (): void => {
    if (!this.controlClient) {
      return;
    }
    this.controlClient.start(this.host, this.port, this.context);
  };

  protected onConnect = (): void => {
    this.retryTimes = 0;
  };

  protected onEnd = (): void => {
    event.emit("info", {
      evt: "master:error",
      payload: `reconnect after ${this.timeout}s`,
    });
    Log.error(`main socket onEnd, reconnect after ${this.timeout}s`);
    this.reconnect(false);
  };

  protected onError = (_err: Error): void => {
    event.emit("info", {
      evt: "master:error",
      payload: `reconnect after ${this.timeout}s`,
    });
    Log.error(`main socket onError, reconnect after ${this.timeout}s`);
    this.reconnect(false);
  };

  public reconnect = (clear: boolean): void => {
    if (clear) {
      clearTimeout(this.timerId);
      this.retryTimes = 0;
      this.timerId = undefined;
    }
    // master socket run into a problem.
    if (this.timerId) {
      // has already restart
      return;
    }
    this.timerId = setTimeout(() => {
      this.timerId = undefined;
      this.connect();
    }, this.timeout * 1000);
    this.retryTimes += 1;
  };

  private get timeout() {
    const timeList = [1, 1, 2, 3, 5, 8, 13, 21];

    if (this.retryTimes >= timeList.length) {
      return timeList[timeList.length - 1];
    }

    return timeList[this.retryTimes];
  }

  public openTunnel = (tunnel: Tunnel): void => {
    if (!this.controlClient) {
      return;
    }
    this.controlClient.openTunnel(tunnel);
  };

  public closeTunnel = (id: string): void => {
    if (!this.controlClient) {
      return;
    }
    this.controlClient.closeTunnel(id);
  };

  public removeTunnel = (id: string): void => {
    if (!this.controlClient) {
      return;
    }
    this.controlClient.removeTunnel(id);
  };

  public get status(): TgrokStatus {
    if (!this.controlClient) {
      return {
        status: 0,
        tunnels: [],
      };
    }
    const tunnels: any[] = [];

    this.controlClient.tunnelList.forEach((tunnel) => {
      tunnels.push({
        id: tunnel.id,
        status: tunnel.status,
      });
    });

    return {
      status: this.controlClient.status,
      tunnels,
    };
  }
}

export {
  Tgrok,
};
