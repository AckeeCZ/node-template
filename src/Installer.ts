import * as fs from 'fs'
import * as childProcess from 'child_process'
import * as path from 'path'

export interface PackageJson {
  json: () => any
  path: string[]
  runScript: (name: string) => void
}

export function createPackageJsonReference(npm: Npm): PackageJson {
  const packagejsonPath = ['package.json']
  if (npm.dir) {
    packagejsonPath.unshift(path.join(...npm.dir))
  }
  const json = () =>
    JSON.parse(fs.readFileSync(path.join(...packagejsonPath), 'utf-8'))
  return {
    path: packagejsonPath,
    json: () => json(),
    runScript: (name: string) => {
      npm.run(['run', name])
    },
  }
}

export function addNpmScript(packageJson: PackageJson, name: string, command: string) {
  const json = packageJson.json()
  json.scripts[name] = command
  log(`> package.json.scripts += "${name}": "${command}"`)
  fs.writeFileSync(
    path.join(...packageJson.path),
    JSON.stringify(json, null, 2),
    'utf-8'
  )
}

export function updateNpmNodeEngine(packageJson: PackageJson, nodeVersion: string) {
  const json = {
    ...packageJson.json(),
    engines: {}
  }
  json.engines.node = nodeVersion
  log(`> package.json.engines.node updated to version ${nodeVersion}`)
  fs.writeFileSync(
    path.join(...packageJson.path),
    JSON.stringify(json, null, 2),
    'utf-8'
  )
}

export function updatePackageJsonMain(packageJson: PackageJson, main: string) {
  const json = packageJson.json()
  json.main = main
  log(`> package.json.main updated to ${main}`)
  fs.writeFileSync(
    path.join(...packageJson.path),
    JSON.stringify(json, null, 2),
    'utf-8'
  )
}

/**
 * Like cp, but second argument does not need to include file name
 * the name is preserved.
 */
export function cpFile(a: string[], b: string[]) {
  const file = a.slice(-1)[0]
  cp(a, [...b, file])
}

export function cp(a: string[], b: string[]) {
  log(`> cp ${path.join(...a)} ${path.join(...b)}`)
  fs.copyFileSync(path.join(...a), path.join(...b))
}

export function log(message: string) {
  console.log(message)
}

export interface Npm {
  run: (args: string[]) => void
  dir?: string[]
}

export function createNpmReference(settings?: NpmOption): Npm {
  return {
    dir: settings?.dir,
    run: args => {
      log(`> npm ${args.join(' ')}`)
      const result = settings?.dir
        ? childProcess.spawnSync('npm', args, {
            cwd: path.join(...settings.dir),
          })
        : childProcess.spawnSync('npm', args)
      if ((result?.status ?? 0) > 0) {
        log(`Failed npm command: npm ${args.join(' ')}. ${String(result.output)}`)
      }
    },
  }
}

export interface NpmOption {
  dir?: string[]
}

export function npmInit(npm: Npm) {
  npm.run(['init', '--yes'])
}

export function npmi(npm: Npm, module?: string) {
  if (!module) {
    return npm.run(['i'])
  }
  const args = ['i', module]
  npm.run(args)
}

export function npmiDev(npm: Npm, module: string) {
  const args = ['i', '-D', module]
  npm.run(args)
}

export function mkdir(
  dirpath: string[],
  option?: {
    /** If exists, remove recursively first */
    overwrite?: boolean
  }
) {
  const p = path.join(...dirpath)
  if (fs.existsSync(path.join(p)) && option?.overwrite) {
    fs.rmSync(p, { recursive: true })
  }
  fs.mkdirSync(p)
}
