import { EventEmitter } from "@drmer/core";
import * as net from "net";
import * as tls from "tls";
import dayjs from "dayjs";
import { randomId } from "@tgrok/utils";
import { Log } from "./Log";

class Client extends EventEmitter {

  public name = "";
  protected typeName = "";
  protected socket?: tls.TLSSocket | net.Socket;

  constructor() {
    super();
    this.name = randomId();
  }

  public static get EVT_CONNECT(): string {
    return "connect";
  }

  public static get EVT_END(): string {
    return "end";
  }

  public getSocket = (): tls.TLSSocket | net.Socket => {
    return this.socket;
  };

  protected info = (msg: string, show?: boolean): void => {
    const time = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

    Log.info(`[${time}] [${this.typeName}:${this.name}] ${msg}`, show);
  };

  protected onConnect(): void {
    this.emit(Client.EVT_CONNECT, this.socket);
  }

  protected onData = (_data: Buffer): void => {
    // on data
  };

  protected onEnd = (): void => {
    this.emit(Client.EVT_END);
  };

  protected onError = (err: Error): void => {
    this.info("error");
    console.log(err);
    // this.emit("error", err)
  };
}

export {
  Client
};
