import { find } from "lodash";
import { LocalClient } from "./LocalClient";
import { TgrokClient } from "./TgrokClient";
import { ControlClient } from "./ControlClient";

class ProxyClient extends TgrokClient {

  protected typeName = "pxy";
  private readonly clientId: string;
  private localClient?: LocalClient;
  private recvBuffer?: Buffer;
  private dataLength = 0;

  private controlClient: ControlClient;

  constructor(ctl: ControlClient) {
    super();
    this.controlClient = ctl;
    this.clientId = ctl.clientId;
  }

  public get tunnelList(): any[] {
    return this.controlClient.tunnelList;
  }

  public onConnect = (): void => {
    this.info(`New connection to ${this.host}:${this.port}`);
    this.send(this.regProxy());
  };

  public onData = (data: Buffer): void => {
    if (this.localClient) {
      this.dataLength += data.length;

      return;
    }
    if (this.recvBuffer) {
      this.recvBuffer = Buffer.concat([this.recvBuffer, data]);
    } else {
      this.recvBuffer = data;
    }
    const headBuffer = this.recvBuffer.slice(0, 8);
    const length = headBuffer.readUInt32LE(0);

    if (this.recvBuffer.length < (8 + length)) {
      return;
    }
    this.info(`reading message with length: ${length}`);
    const raw = this.recvBuffer.slice(8, length + 8).toString();

    this.info(`recv <<<< ${raw}`);
    const json = JSON.parse(raw);

    if (json.Type !== "StartProxy") {
      return;
    }
    const tunnel = find(this.tunnelList, { url: json.Payload.Url });

    if (!tunnel || tunnel.status < 5) {
      if (this.socket) {
        this.socket.destroy();
      }
      if (!tunnel) {
        this.info(`No tunnel for ${json.Payload.Url} found.`);
      } else {
        this.info(`Tunnel for ${json.Payload.Url} is closed.`);
      }

      return;
    }
    if (this.socket != null) {
      this.socket.pause();
    }
    this.localClient = new LocalClient(this, tunnel);
    this.localClient.toSend(this.recvBuffer.slice(8 + length));
    this.recvBuffer = undefined;
    this.localClient.start();
  };

  protected onEnd = (): void => {
    if (!this.localClient) {
      return;
    }
    this.info(`${this.dataLength} bytes data transferred to prv:${this.localClient.name} before closing`);
    this.localClient = undefined;
  };

  private regProxy = () => {
    return {
      Type: "RegProxy",
      Payload: {
        ClientId: this.clientId
      }
    };
  };
}

export {
  ProxyClient
};
