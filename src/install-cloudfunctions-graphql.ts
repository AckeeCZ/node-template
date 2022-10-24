import * as Installer from './Installer'

const PROJECT_NAME = 'node-template-cloudfunctions-graphql'

const INSTALL_PATH = ['..', PROJECT_NAME]

Installer.mkdir(INSTALL_PATH, { overwrite: true })
const npm = Installer.createNpmReference({ dir: INSTALL_PATH })
const packageJson = Installer.createPackageJsonReference(npm)
Installer.npmInit(npm)

Installer.updatePackageJsonMain(packageJson, 'lib/index.js')
Installer.updateNpmNodeEngine(packageJson, '16')

Installer.cpFile(['templates', 'cloudfunctions', '.gitignore'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', '.nvmrc'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', 'Dockerfile'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', '.dockerignore'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', 'firebase.json'], INSTALL_PATH)

Installer.npmi(npm, 'firebase-admin')
Installer.npmi(npm, 'firebase-functions')
Installer.addNpmScript(packageJson, 'serve', 'npm run build && firebase emulators:start --only functions')
Installer.addNpmScript(packageJson, 'shell', 'npm run build && firebase functions:shell')
Installer.addNpmScript(packageJson, 'start', 'npm run shell')
Installer.addNpmScript(packageJson, 'deploy', 'firebase deploy --only functions')
Installer.addNpmScript(packageJson, 'logs', 'firebase functions:log')

Installer.npmiDev(npm, 'typescript')
Installer.npmiDev(npm, '@types/node')
Installer.cpFile(['templates', 'cloudfunctions', 'tsconfig.json'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'build', 'tsc')
Installer.addNpmScript(packageJson, 'build:watch', 'tsc --watch')

Installer.npmi(npm, 'apollo-server-cloud-functions')
Installer.npmi(npm, 'graphql')

Installer.npmi(npm, 'configuru')
Installer.npmi(npm, 'cosmas')
Installer.cpFile(['templates', 'cloudfunctions', '.env.jsonc'], INSTALL_PATH)

Installer.npmiDev(npm, 'jest')
Installer.npmiDev(npm, '@types/jest')
Installer.npmiDev(npm, 'ts-jest')
Installer.npmiDev(npm, 'jest-junit')
Installer.cpFile(['templates', 'cloudfunctions', 'jest.config.js'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'test', 'jest --colors --detectOpenHandles')
Installer.addNpmScript(packageJson, 'ci-test', 'npm run test -- --collectCoverage --reporters=default --reporters=jest-junit --ci')
Installer.mkdir([...INSTALL_PATH, 'src'])
Installer.mkdir([...INSTALL_PATH, 'src', 'test'])
Installer.cpFile(['templates', 'cloudfunctions', 'src', 'test', 'helloWorld.test.ts'], [...INSTALL_PATH, 'src', 'test'])

Installer.npmiDev(npm, '@ackee/styleguide-backend-config')
Installer.npmiDev(npm, 'prettier')
// TODO: pinned version due to https://github.com/eslint/eslint/issues/15149
Installer.npmiDev(npm, 'eslint@7.32.0')
Installer.cpFile(['templates', 'cloudfunctions', '.eslint.tsconfig.json'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', '.eslintrc.js'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudfunctions', 'prettier.config.js'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'prettier', 'prettier --check --write \'**/*.{ts,js,json,md}\'')
Installer.addNpmScript(packageJson, 'lint', 'eslint \'**/*.ts\' -f codeframe --fix')
Installer.addNpmScript(packageJson, 'codestyle', 'npm run prettier && npm run lint')
Installer.addNpmScript(packageJson, 'ci-lint', 'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml')

Installer.cpFile(['templates', 'cloudfunctions', 'src', 'config.ts'], [...INSTALL_PATH, 'src'])
Installer.cpFile(['templates', 'cloudfunctions', 'src', 'logger.ts'], [...INSTALL_PATH, 'src'])
Installer.cpFile(['templates', 'cloudfunctions', 'src', 'index.ts'], [...INSTALL_PATH, 'src'])

Installer.mkdir([...INSTALL_PATH, 'src', 'graphql'])
Installer.cpFile(['templates', 'cloudfunctions', 'src', 'graphql', 'index.ts'], [...INSTALL_PATH, 'src', 'graphql'])

packageJson.runScript('build')
packageJson.runScript('codestyle')
packageJson.runScript('ci-lint')