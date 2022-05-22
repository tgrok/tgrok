#!/usr/bin/env node

const arg = require("arg");
const chalk = require("chalk");

const { Tgrok } = require("@tgrok/core");
const pkg = require("./package");

const tgrok = new Tgrok();

const getHelp = () => chalk`
  {bold.cyan tgrok} - Tunneling service

  {bold USAGE}

      {bold $} {cyan tgrok} --help
      {bold $} {cyan tgrok} --version
      {bold $} {cyan tgrok} 8000
      {bold $} {cyan tgrok} --subdomain=test 8080

      By default, {cyan tgrok} will tunnel port 80 with a random domain to your local device

  {bold OPTIONS}

      --help                              Shows this help message

      -v, --version                       Displays the current version of tgrok

      --subdomain                         Specify a subdomain for easy remembery

      --server                            Specify a ngrok server to connect

      -p --port                           Ngrok server port to connect

      -d, --debug                         Show debugging information
`;

tgrok.context = {
  family: 4, // you can speed up your local network connection
  rejectUnauthorized: false // required if your server is using a self-signed certificate
};

let args = null;

try {
  args = arg({
    "--help": Boolean,
    "--server": String,
    "--version": Boolean,
    "--port": Number,
    "--subdomain": String,
    "--debug": Boolean,
    "-h": "--help",
    "-v": "--version",
    "-d": "--debug",
    "-s": "--server",
    "-p": "--port"
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

if (args["--version"]) {
  console.log(pkg.version);

  return;
}

if (args["--help"]) {
  console.log(getHelp());

  return;
}

const host = args["--server"];

if (!host) {
  console.log("You must specify the server");

  return;
}
tgrok.host = host;
tgrok.port = args["--port"] || 4443;

tgrok.debug = !!args["--debug"];

let port = args._.length > 0 ? args._[0] * 1 : 80;

if (!port) {
  console.log("Port must be a number");

  return;
}

tgrok.start(port, args["--subdomain"]);
