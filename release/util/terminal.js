const { spawn, exec } = require('child_process')
const util = require('util')
const promiseExec = util.promisify(exec)

exports.spawnShell = (script) =>
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

const execute = async (script) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const output = await promiseExec(script)
      resolve(output)
    } catch (e) {
      reject(e)
    }
  })

exports.execute = execute
exports.gitAdd = async (files) => await execute(`git add ${files}`)
exports.gitDiff = async () => await execute('git diff')
exports.gitStatus = async () => await execute('git status')
