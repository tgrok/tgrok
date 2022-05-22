import { randomId } from "@tgrok/utils";

class Tunnel {
  public id = randomId("a0", 30);
  public name = "Tgrok Tunnel";

  public protocol = "http";
  public subdomain = "";

  public localHost = "127.0.0.1";
  public localPort = "80";

  public paused = false;

  public status = 0;

  public static randomDomain(): string {
    return randomId();
  }

}

export {
  Tunnel,
};
