<div align="center">


# Node template: Cloud functions
[![Build Status](https://img.shields.io/travis/com/AckeeCZ/node-template/master.svg?style=flat-square)](https://travis-ci.com/AckeeCZ/node-template)
[![Coverage](https://img.shields.io/codeclimate/coverage/AckeeCZ/node-template.svg?style=flat-square)](https://codeclimate.com/github/AckeeCZ/node-template)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/AckeeCZ/node-template.svg?style=flat-square)](https://codeclimate.com/github/AckeeCZ/node-template)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AckeeCZ/node-template.svg?style=flat-square)](https://snyk.io/test/github/AckeeCZ/node-template?targetFile=package.json)
[![Dependency Status](https://img.shields.io/david/AckeeCZ/node-template.svg?style=flat-square)](https://david-dm.org/AckeeCZ/node-template)
[![Dev Dependency Status](https://img.shields.io/david/dev/AckeeCZ/node-template.svg?style=flat-square)](https://david-dm.org/AckeeCZ/node-template?type=dev)

Ackee node back-end project template

</div>

## :rocket: Quick-start

### Start serverless

- `npm install`
- `firebase emulators:start` to [Run functions locally
](https://firebase.google.com/docs/functions/local-emulator)
- Visit emulated functions on proposed addreses, which may look like [`http://localhost:5001/{firebase_project}/{region}/healthz/healthz`](http://localhost:5001/{firebase_project}/{region}/healthz/healthz) or [`http://localhost:5001/{firebase_project}/{region}/api/hello`](http://localhost:5001/{firebase_project}/{region}/api/hello)

⚠️ Local development only.

⚠️ The double `/healthz/healthz` because the function name is `healthz` and the handler responds to routes starting with [`healthz`](https://github.com/smoliji/node-healthz/issues/1).

### Start server

Simulator takes it's time to start and is harder to debug. To ease the development process, project is designed to decompose the serving from the logic. To start the Express as you are used to, set `SERVER_PORT=3000` before the start.

 - `npm install`
 - `SERVER_PORT=3000 npm start`
 - Visit [`http://localhost:3000/`](http://localhost:3000/), [`/healthz`](http://localhost:3000/healthz) or [`/api/hello`](http://localhost:3000/api/hello)

ℹ️ The branching is done in [here](./src/index.ts). For both the [Cloud functions setup](./src/server.cf.ts) and the [Express setup](./src/server.app.ts), sharing the same [route handlers](./src/config/routes.ts). Don't forget to keep these in sync ☝️.

### Deploy serverless

- `firebase deploy`

Want to know more? See [getting started](./docs/getting-started.md).

## :book: Further reading

 - [Configuration](./docs/config.md)
 - [Debugging](./docs/debug.md)

## ⚖️ License

This project is published under [MIT license](./LICENSE).