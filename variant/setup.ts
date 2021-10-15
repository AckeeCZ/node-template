import * as fs from 'fs'
import * as util from 'util'
import * as path from 'path'
import * as childProcess from 'child_process'

const setupDefault = async () => {
  await copyFilesRec('./default', '..')
}

const setupCloudFunctions = async () => {
  await setupDefault()
  await copyFilesRec('./cloud-functions', '..')
  await installDependencies(['firebase-functions@3.13.2'])
  await installDevDependencies(['firebase-functions-test@0.2.0'])
}

const copyFile = util.promisify(fs.copyFile)
const mkdir = util.promisify(fs.mkdir)
const copyFile2 = async (aPath: string, bPath: string) => {
  const dirname = path.dirname(bPath)
  await fsStat(dirname).catch(_error => {
    // TODO Check not exists error
    return mkdir(dirname, { recursive: true })
  })
  return copyFile(aPath, bPath)
}
const fsStat = util.promisify(fs.stat)
const isDir = async (path: string) => (await fsStat(path)).isDirectory()
const readDir = util.promisify(fs.readdir)
const listDirectoryFilesDeep = async (dir: string): Promise<string[]> => {
  if (!(await isDir(dir))) return []
  const items = (await readDir(dir, { withFileTypes: true })).map(x =>
    Object.assign(x, { absolutePath: path.join(dir, x.name) })
  )

  const files: string[] = []
  for (const item of items) {
    if (!item.isDirectory()) files.push(item.absolutePath)
  }

  const children = await items.reduce<Promise<string[]>>(
    async (children, x) => {
      return (await children).concat(
        await listDirectoryFilesDeep(x.absolutePath)
      )
    },
    Promise.resolve([])
  )
  return files.concat(children)
}
const echo = (str: string) => console.log(str)
const echoWrap = async (
  messageBefore: string,
  task: () => Promise<any>,
  messageAfter: string
) => {
  process.stdout.write(messageBefore)
  await task()
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  echo(messageAfter)
}

const copyFilesRec = async (aPath: string, bPath: string) => {
  const aPathAbsolute = path.join(__dirname, aPath)
  const bPathAbsolute = path.join(__dirname, bPath)
  echo(`Copying files ${aPathAbsolute} -> ${bPathAbsolute}`)
  if (!(await isDir(aPathAbsolute))) {
    await copyFile(aPathAbsolute, bPathAbsolute)
    return
  }
  const files = await listDirectoryFilesDeep(aPathAbsolute)

  for (const file of files) {
    const destFile = path.join(bPathAbsolute, file.replace(aPathAbsolute, ''))
    await echoWrap(
      `Copying ${file} -> ${destFile}`,
      () => copyFile2(file, destFile),
      `OK ${file} -> ${destFile}`
    )
  }
}

const installDependencies = async (deps: string[]) => {
  const cpExec = util.promisify(childProcess.exec)
  const dependencies = deps.join(' ')
  await echoWrap(
    `Installing dependencies npm install ${dependencies}`,
    () => cpExec(`npm install ${dependencies}`),
    `Installed dependencies ${dependencies}`
  )
}

const installDevDependencies = async (deps: string[]) => {
  const cpExec = util.promisify(childProcess.exec)
  const dependencies = deps.join(' ')
  await echoWrap(
    `Installing dependencies npm install ${dependencies}`,
    () => cpExec(`npm install -D ${dependencies}`),
    `Installed dependencies ${dependencies}`
  )
}

if (require.main === module) {
  const argValue = process.argv[2]
  const argOption = {
    default: setupDefault,
    cf: setupCloudFunctions,
  }
  const arg = argOption[argValue as keyof typeof argOption]
  if (!arg) {
    echo(
      `\nInvalid argument. Usage:\n\nsetup VARIANT\n\nVARIANT\tOne of ${Object.keys(
        argOption
      ).join(', ')}\n`
    )
  }
}
