# tgrok-desktop

Tgrok client for desktop

## Development

1. clone this repo `git clone https://github.com/tgrok/desktop.git`
2. install dependencies `npm install`
3. build and start app `npm run start`

### For developers in China

**_F\*\*K GFW_**

If you have trouble in downloading files for electron or electron-builder,
try add these lines in your `npm` config file.
```
registry = "https://registry.npm.taobao.org/"
disturl = "https://npm.taobao.org/dist"
electron_builder_binaries_mirror = "http://npm.taobao.org/mirrors/electron-builder-binaries/"
electron_mirror = "https://cdn.npm.taobao.org/dist/electron/"
```

To show your config file path or confirm your setting, run `npm config list`
