# cli

tunneling service node cli for [tgrok](https://github.com/tgrok/tgrok.git)

## Installation

```bash
npm install -g https://github.com/tgrok/cli
```

## Usage

```bash
tgrok
```
Tgrok will tunnel a random domain to your local port 80.

To see the list of all available options, you need to run:

```bash
tgrok --help
```

## Development

1. [clone](https://help.github.com/articles/cloning-a-repository/) this repository to your device
2. Uninstall `tgrok` if it's already installed: `npm uninstall -g tgrok-cli`
3. Link to the global module directory: `npm link`
