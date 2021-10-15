# Getting started

## 🌱 Install

```
npm install
```

Typescript compilation check is ran in `postinstall` script.

`Install` sets up [Husky](https://www.npmjs.com/package/husky)'s git hooks to run prettier and lint over your changes.

## 🔧 Run with config

You can override default configuration [`.env.jsonc`](../.env.jsonc) (which is always applied as default values) by specifying variables directly:

```bash
SERVER_PORT=8080 npm start
```

Or you can have a file with those overrides and specify it with `CFG_JSON_PATH` variable:

```bash
CFG_JSON_PATH="~/node-template-conf.jsonc" npm start
```

Or combine those two

```bash
CFG_JSON_PATH="~/node-template-conf.jsonc" SERVER_PORT=8080 npm start
```

For more information on how configuration loading works see [configuru](https://github.com/AckeeCZ/configuru) loader.

## 🚀 Run

#### Production

```bash
npm start # prod
npm run start-lr # dev live-reload
```

This starts dev server with auto-reload. Typescript type errors are reported. You can trigger build manually with `npm run build`.

## ✅ Test

Jest framework is used for tests.

- `npm run test`
- `npm run test-lr` (live-reloaded tests)
- `npm run cover` (run tests and collect coverage)
- `npm run ci-test` (CI tests with JUnit reporter, coverage and no snapshot generating)

💡 You can use config overrides with tests the same way

## ☑️ Lint

```
npm run lint
```
