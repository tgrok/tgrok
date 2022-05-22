let debug = false;

class Log {
  static set debug(newValue: boolean) {
    debug = newValue;
  }

  static info(msg: string | object, show?: boolean): void {
    if (!debug && !show) {
      return;
    }
    console.log(msg);
  }

  static error(msg: string | object | number): void {
    console.log(msg);
  }
}

export {
  Log,
}
