<div align="center">

# Node template

[![Build Status](https://img.shields.io/travis/com/AckeeCZ/node-template/master.svg?style=flat-square)](https://travis-ci.com/AckeeCZ/node-template)
[![Coverage](https://img.shields.io/codeclimate/coverage/AckeeCZ/node-template.svg?style=flat-square)](https://codeclimate.com/github/AckeeCZ/node-template)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/AckeeCZ/node-template.svg?style=flat-square)](https://codeclimate.com/github/AckeeCZ/node-template)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AckeeCZ/node-template.svg?style=flat-square)](https://snyk.io/test/github/AckeeCZ/node-template?targetFile=package.json)
[![Dependency Status](https://img.shields.io/david/AckeeCZ/node-template.svg?style=flat-square)](https://david-dm.org/AckeeCZ/node-template)
[![Dev Dependency Status](https://img.shields.io/david/dev/AckeeCZ/node-template.svg?style=flat-square)](https://david-dm.org/AckeeCZ/node-template?type=dev)

Ackee node back-end project template

</div>

# 🚧 Consolidation

- Variants' implementation are located in `variants` folder
- There is a script to run to use one of variants, e.g. `npx ts-node variants/setup cf` to use Cloud functions template; run setup script so see available options
- npm dependencies are kept in top-level package.json, variant-specific are installed during variant setup and added as top-level deps
- variants have their own files for top-level structure, e.g. complete `src`, but also `firebase.json` etc.
- Once set up, structure looks exactly like `node-template-x` (with `variants` folder), so code can be tested with as usually `ENABLE_TESTS=true npm t`
- ⚠️ Variants are incompilable on their own due to not having shared code in it. Lets take a module that is used in all variants, lets call it `config.ts`. This file is imported in a variant module using relative path. Relative path can match either in variant folder, or in shared folder, or each variant has to have its own file clone.

## 🚀 Quick-start

- `npm install`
- Choose your starter: `npx ts-node variant/setup cf` (cf = cloud functions)
- `npm run build`
- `npm start`
- Visit [`http://localhost:3000/`](http://localhost:3000/), [`/healthz`](http://localhost:3000/healthz) or [`/api/hello`](http://localhost:3000/api/hello)

## 📒 Further reading

- [Getting started](./docs/getting-started.md)
- TODO App layers description

## ⚖️ License

This project is published under [MIT license](./LICENSE).
