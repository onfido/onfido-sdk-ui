const { spawn, exec } = require('child_process')
const util = require('util')
const promiseExec = util.promisify(exec)

exports.spawnShell = (script, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(script, {
      shell: true,
      cwd,
    })

    child.stderr.pipe(process.stderr)
    child.stdout.pipe(process.stdout)
    child.on('exit', resolve)
    child.on('close', reject)
    child.on('exit', reject)

    child.on('error', reject)
  })

exports.execute = async (script, cwd) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      console.log('execute script=', script, ' cwd=', cwd)
      const output = await promiseExec(script, cwd && { cwd })
      resolve(output)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
