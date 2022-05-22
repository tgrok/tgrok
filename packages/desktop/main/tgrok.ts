import { Tgrok } from "@tgrok/core";

const tgrok = new Tgrok();

tgrok.context = {
  family: 4, // you can speed up your local network connection
  rejectUnauthorized: false, // required if your server is using a self-signed certificate
};

export {
  tgrok,
};
