import * as net from "net";
import { Client } from "./Client";
import { ProxyClient } from "./ProxyClient";
import { Tunnel } from "./Tunnel";
import { event } from "./event";

class LocalClient extends Client {

  protected typeName = "prv";
  protected recvBuffer?: Buffer;
  protected isConnected = false;

  private readonly proxyClient: ProxyClient;
  private tunnel: Tunnel;

  constructor(proxy: ProxyClient, tunnel: Tunnel) {
    super();
    this.proxyClient = proxy;
    this.tunnel = tunnel;
  }

  public start = (): void => {
    this.info("connecting");
    try {
      this.socket = net.connect(this.tunnel.localPort, this.tunnel.localHost, this.onConnect);
    } catch (e) {
      console.log(e);
    }
    this.socket.on("data", this.onData);
    this.socket.on("end", this.onEnd);
    this.socket.on("error", this.onError);
  };

  public toSend = (data: Buffer): void => {
    this.recvBuffer = data;
  };

  protected onConnect = (): void => {
    this.isConnected = true;
    this.info(`connected to local`);
    // connect proxy and client
    const proxySocket = this.proxyClient.getSocket();

    if (!this.socket || !proxySocket) {
      return;
    }
    this.socket.pipe(proxySocket);
    proxySocket.pipe(this.socket);

    if (this.recvBuffer) {
      this.socket.write(this.recvBuffer.toString());
    }
    this.recvBuffer = undefined;
    proxySocket.resume();
  };

  protected onEnd = (): void => {
    this.info("closing");
    this.socket = undefined;
    this.isConnected = false;
  };

  protected onError = (_err: Error): void => {
    if (!this.proxyClient || !this.proxyClient.getSocket()) {
      this.info("remote socket not available");

      return;
    }
    const body = `<html>
<body style="background-color: #97a8b9">
  <div style="margin:auto; width:400px;padding: 20px 60px; background-color: #D3D3D3; border: 5px solid maroon;">
    <h2>Tunnel ${this.tunnel.url} unavailable</h2>
    <p>Unable to initiate connection to <strong>${this.tunnel.localPort}</strong>.
    A web server must be running on port <strong>${this.tunnel.localPort}</strong> to complete the tunnel.</p>
`;
    const header = `HTTP/1.0 502 Bad Gateway
  Content-Type: text/html
  Content-Length: ${body.length}

  ${body}`;
    const socket = this.proxyClient.getSocket();

    if (socket) {
      socket.write(header);
      socket.end();
    }
    const error = `A web server must be running on port ${this.tunnel.localPort} to complete the tunnel.`;

    event.emit("info", {
      evt: "tunnel:error",
      payload: {
        id: this.tunnel.id,
        error
      }
    });
    this.info(error, true);
  };
}

export {
  LocalClient
};
