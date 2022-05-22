import * as tls from "tls";
import { Client } from "./Client";

class TgrokClient extends Client {

  protected host?: string;
  protected port?: number;
  protected context?: object;

  public start(host: string, port?: number | object, context?: object): void {
    this.host = host;
    this.port = 4443;
    if (typeof port === "object") {
      context = port;
    } else if (typeof port === "number") {
      this.port = port;
    }
    this.context = context;
    this.connect();
  }

  public connect(): void {
    this.info("connecting");
    if (this.port == null) {
      return;
    }
    try {
      this.socket = tls.connect(this.port, this.host, this.context, this.onConnect);
    } catch (e) {
      this.info("Error: " + e.toString());
      this.info("connect failed, retry after 500s");
      setTimeout(this.connect, 500);

      return;
    }
    this.socket.on("data", this.onData);
    this.socket.on("end", this.onEnd);
    this.socket.on("error", this.onError);
  }

  protected send(data: object | string): void {
    if (this.socket == null) {
      return;
    }
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    const headBuffer = Buffer.alloc(8);

    headBuffer.writeUInt32LE(Buffer.byteLength(data), 0);
    this.socket.write(headBuffer);
    // this.info(headBuffer.toString())
    // console.log(Buffer.byteLength(data))
    this.info(`send >>>> ${data}`);
    this.socket.write(data);
  }

  protected onEnd = (): void => {
    this.socket = undefined;
  };
}

export {
  TgrokClient
};
