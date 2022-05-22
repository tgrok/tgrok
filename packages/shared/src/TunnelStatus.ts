class TunnelStatus {
  static get DISCONNECTED(): number {
    return 0;
  }

  static get DISCONNECTING(): number {
    return 4;
  }

  static get CONNECTING(): number {
    return 6;
  }

  static get CONNECTED(): number {
    return 10;
  }
}

export {
  TunnelStatus,
};
