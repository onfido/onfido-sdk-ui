const ora = require('ora')
const { exec, spawn } = require('child_process')
const util = require('util')
const promiseExec = util.promisify(exec)
const terminalUI = require('./terminalUI')
const config = require('../releaseConfig')

const { somethingWentWrong } = terminalUI

const execWithErrorHandling = async (cmd, callback) => {
  const spinner = ora(cmd).start()

  try {
    const ret = await promiseExec(cmd)
    spinner.stop()
    return ret
  } catch (error) {
    spinner.stop()
    callback()
  }
}

const exitRelease = async () => {
  if (config.data.safeToClearWorkspace) {
    console.log('Clearing any workspace changes introduced by the release script...')
    await promiseExec('git checkout -- \'*\'')
  }
  process.exit(1)

  // make sure this step never resolves, so `process.exit` calls before this
  // function is "finished" (otherwise later steps can still get called)
  await new Promise()
}

const spawnAssumeOkay = async (cmd, cmdArgs, verbose) => {
  const spinner = ora([cmd].concat(cmdArgs).join(" "))
  if (!verbose) {
    spinner.start()
  }

  let exitInProcess = false
  const handleExit = error => {
    if (exitInProcess) return
    exitInProcess = true

    spinner.fail()
    somethingWentWrong(cmd)
    if (error) {
      console.error(`${error}\n`)
    }
    exitRelease()
  }

  await new Promise(resolve => {
    const handle = spawn(cmd, cmdArgs, { cwd: '.', shell: true})
    if (verbose) {
      handle.stdout.pipe(process.stdout);
    }
    handle.stderr.pipe(process.stderr);

    const onClose = code => {
      if (code === 0) {
        spinner.succeed()
        resolve()
      } else {
        handleExit()
      }
    }
    handle.on('close', onClose)
    handle.on('exit', onClose)

    handle.on('error', handleExit)
  })
}

const execAssumeOkay = async cmd => {
  const spinner = ora(cmd).start()

  try {
    const ret = await promiseExec(cmd)
    spinner.stop()
    return ret
  } catch (error) {
    spinner.stop()
    somethingWentWrong(cmd)
    console.error(error)
    exitRelease()
  }
}

module.exports = {
  spawnAssumeOkay,
  execAssumeOkay,
  execWithErrorHandling,
  exitRelease
}
