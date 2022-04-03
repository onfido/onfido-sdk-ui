import { spawn, exec } from 'child_process'
import * as util from 'util'
const promiseExec = util.promisify(exec)

export const spawnShell = (script: string) =>
  new Promise((resolve, reject) => {
    const child = spawn(script, {
      shell: true,
    })

    child.stderr.pipe(process.stderr)
    child.stdout.pipe(process.stdout)
    child.on('exit', resolve)
    child.on('close', reject)
    child.on('exit', reject)

    child.on('error', reject)
  })

export const execute = async (script: string): Promise<{ stdout: string }> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const output = await promiseExec(script)
      resolve(output)
    } catch (e) {
      reject(e)
    }
  })

export const gitAdd = async (files: string) => await execute(`git add ${files}`)
export const gitDiff = async () => await execute('git diff')
export const gitStatus = async () => await execute('git status')
