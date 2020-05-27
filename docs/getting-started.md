# Getting started

## :seedling: Install

```
npm install
```
Typescript compilation check is ran in `postinstall` script.

`Install` sets up [Husky](https://www.npmjs.com/package/husky)'s git hooks to run prettier and lint over your changes.

## :wrench: Setup config
```bash
export CFG_JSON_PATH="~/.env/my-project.json" # use custom path with existing json file
```
Set custom configuration for the project. See [configuration](./config.md) for more info.

## :rocket: Run
#### Production
```
npm start
```
Start does not perform a static TypeScript type check. For performance boost, it only transpiles the code on start.

 - App uses `ts-node` for runtime and does not require compiled javascript, because it transpiles on the fly.
 - You can trigger the TS check manually via `npm run build`, which does not emit any code

#### Development
```
npm start-lr
```
This starts dev server with auto-reload. Typescript type errors are reported in contrast to production start.


## :heavy_check_mark: Test

Jest framework is used for tests.

- `npm run test`
- `npm run test-lr` (live-reloaded tests)
- `npm run cover` (run tests and collect coverage)
- `npm run ci-test` (CI tests with JUnit reporter, coverage and no snapshot generating)

## :white_check_mark: Lint

Source files are linted via [tslint](https://palantir.github.io/tslint/) with custom [configuration](https://www.npmjs.com/package/tslint-config-ackee).
But you should not worry about that much, since most of the problems are auto-fixed with Husky.

```
npm run lint
```