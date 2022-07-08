import * as Installer from './Installer'

const INSTALL_PATH = ['..', 'node-template-cloudrun-rest']

Installer.mkdir(INSTALL_PATH, { overwrite: true })
const npm = Installer.createNpmReference({ dir: INSTALL_PATH })
const packageJson = Installer.createPackageJsonReference(npm)
Installer.npmInit(npm)
Installer.cpFile(['templates', 'cloudrun', '.gitignore'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudrun', '.nvmrc'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudrun', 'Dockerfile'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudrun', '.dockerignore'], INSTALL_PATH)

Installer.npmiDev(npm, 'typescript')
Installer.npmiDev(npm, '@types/node')
Installer.npmi(npm, 'source-map-support')
Installer.cpFile(['templates', 'cloudrun', 'tsconfig.json'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'build', 'tsc')
Installer.addNpmScript(packageJson, 'start', 'node -r source-map-support/register dist/index.js')

Installer.npmi(npm, 'configuru')
Installer.npmi(npm, 'cosmas')
Installer.cpFile(['templates', 'cloudrun', '.env.jsonc'], INSTALL_PATH)
Installer.mkdir([...INSTALL_PATH, 'src'])
Installer.cpFile(['templates', 'cloudrun', 'src', 'config.ts'], [...INSTALL_PATH, 'src'])
Installer.cpFile(['templates', 'cloudrun', 'src', 'logger.ts'], [...INSTALL_PATH, 'src'])
Installer.cpFile(['templates', 'cloudrun', 'src', 'index.ts'], [...INSTALL_PATH, 'src'])

packageJson.runScript('build')
packageJson.runScript('start')

Installer.npmiDev(npm, 'jest')
Installer.npmiDev(npm, '@types/jest')
Installer.npmiDev(npm, 'ts-jest')
Installer.npmiDev(npm, 'jest-junit')
Installer.cpFile(['templates', 'cloudrun', 'jest.config.js'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'test', 'jest --colors --detectOpenHandles')
Installer.addNpmScript(packageJson, 'ci-test', 'npm run test -- --collectCoverage --reporters=default --reporters=jest-junit --ci')
Installer.mkdir([...INSTALL_PATH, 'src', 'test'])
Installer.cpFile(['templates', 'cloudrun', 'src', 'test', 'helloWorld.test.ts'], [...INSTALL_PATH, 'src', 'test'])

packageJson.runScript('test')
packageJson.runScript('ci-test')

Installer.npmiDev(npm, '@ackee/styleguide-backend-config')
Installer.npmiDev(npm, 'prettier')
Installer.npmiDev(npm, 'eslint')
Installer.cpFile(['templates', 'cloudrun', '.eslint.tsconfig.json'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudrun', '.eslintrc.js'], INSTALL_PATH)
Installer.cpFile(['templates', 'cloudrun', 'prettier.config.js'], INSTALL_PATH)
Installer.addNpmScript(packageJson, 'prettier', 'prettier --check --write \'**/*.{ts,js,json,md}\'')
Installer.addNpmScript(packageJson, 'lint', 'eslint \'**/*.ts\' -f codeframe --fix')
Installer.addNpmScript(packageJson, 'codestyle', 'npm run prettier && npm run lint')
Installer.addNpmScript(packageJson, 'ci-lint', 'npm run lint -- -f checkstyle -o ./output/checkstyle-result.xml')

packageJson.runScript('codestyle')
packageJson.runScript('ci-lint')

// cpFile(['templates', 'cloudrun', 'dangerfile.ts'], ['build'])
