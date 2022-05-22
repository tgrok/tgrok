import { LowSync } from "lowdb/lib/LowSync"
import { LocalStorage } from "lowdb/lib/adapters/LocalStorage"

class Config {

  private readonly db: LowSync;
  private readonly data: any;
  private saving = false;

  constructor() {
    const adapter = new LocalStorage("tgrok");

    this.db = new LowSync(adapter);

    this.db.read();

    this.data = this.db.data;

    if (!this.data) {
      this.data = {
        server: {
          host: "t.drmer.net",
          port: 4443,
        },
        tunnels: [],
      };
    }
  }

  public load(): any {
    return this.data;
  }

  public set(key: string, value: any) {
    if (this.saving) {
      // another process is saving config
      // retry after 500ms
      setTimeout(() => {
        this.set(key, value);
      }, 500);

      return;
    }
    this.data[key] = value;
    this.flush();
  }

  public get(key: string) {
    return this.data[key];
  }

  public flush() {
    this.saving = true;
    this.db.data = this.data;
    this.db.write();
    this.saving = false;
  }

}

export const config = new Config();
