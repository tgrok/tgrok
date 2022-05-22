import randomatic from "randomatic";

const dayjs = require("dayjs");

export const randomId = (pattern: string = "a0", length: number = 8): string => {
  return randomatic(pattern, length);
};

export const timeout = (ms: number): Promise<any> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timestamp = (): Number => {
  return Number.parseInt(((new Date() as any) / 1000).toFixed(), 10);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isNumeric = (n: any): Boolean => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const parseJson = (json: string | object): any => {
  if (typeof json === "object") {
    return json;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    // tslint:disable-next-line no-console
    console.error(e);

    return undefined;
  }
};

export const dateFormat = (fmt: String, date: Date): string => {
  if (!date) {
    date = new Date();
  }

  return dayjs(date).format(fmt);
};

export const isiOS = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  return userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1;
};
