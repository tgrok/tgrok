class ControlStatus {
  static get PENDING(): number {
    return 0;
  }

  static get CONNECTED(): number {
    return 2;
  }

  static get END(): number {
    return 3;
  }

  static get AUTH_FAILED(): number {
    return 6;
  }

  static get READY(): number {
    return 10;
  }
}

export {
  ControlStatus,
};
