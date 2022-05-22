import { DesktopBridge } from "./DesktopBridge";

const bridge = new DesktopBridge();

(window as any).desktopBridge = bridge;
