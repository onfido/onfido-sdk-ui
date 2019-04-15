const yn = require('yn')
const ora = require('ora')
const readline = require('readline');
const fs = require('fs')
const { exec, spawn } = require('child_process')
const util = require('util')
const promiseExec = util.promisify(exec)
const chalk = require('chalk')

let sharedVariables = { safeToClearWorkspace: false }

const overrideSharedVariables = (newValue) => sharedVariables = {...newValue, ...sharedVariables}

const question = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log()
  return new Promise(resolve => rl.question(`${query} (y/n) `, answer => {
    const answerAsBoolean = yn(answer) || false
    resolve(answerAsBoolean)
    rl.close()
  }))
}

const exitRelease = async () => {
  if (sharedVariables.safeToClearWorkspace) {
    console.log('Clearing any workspace changes introduced by the release script...')
    await promiseExec('git checkout -- \'*\'')
  }
  process.exit(1)

  // make sure this step never resolves, so `process.exit` calls before this
  // function is "finished" (otherwise later steps can still get called)
  await new Promise()
}

const execAssumeOkay = async cmd => {
  const spinner = ora(cmd).start()

  try {
    const ret = await promiseExec(cmd)
    spinner.stop()
    return ret
  } catch (error) {
    spinner.stop()
    console.error('❌ Oops. Something went wrong with that last command! 🤖😞')
    console.error(`❌ The command was: ${chalk.magenta(cmd)}`)
    console.error(error)
    exitRelease()
  }
}

module.exports = {
  sharedVariables,
  overrideSharedVariables,
  proceedYesNo: async query => {
    const ok = await question(query || 'Is this correct?')
    if (ok) {
      console.log('✅ Great!\n')
    } else {
      console.error('❌ Things were not correct. I don\'t know how to automate this case 🤖😞')
      exitRelease()
    }
  },
  execWithErrorHandling: async (cmd, callback) => {
    const spinner = ora(cmd).start()

    try {
      const ret = await promiseExec(cmd)
      spinner.stop()
      return ret
    } catch (error) {
      spinner.stop()
      callback()
    }
  },
  spawnAssumeOkay: async (cmd, cmdArgs, verbose) => {
    const spinner = ora([cmd].concat(cmdArgs).join(' '))
    if (!verbose) {
      spinner.start()
    }

    let exitInProcess = false
    const handleExit = error => {
      if (exitInProcess) return
      exitInProcess = true

      spinner.fail()
      console.error('❌ Oops. Something went wrong with that last command! 🤖😞')
      console.error(`❌ The command was: ${chalk.magenta(cmd)}`)
      if (error) {
        console.error(error)
      }
      exitRelease()
    }

    await new Promise(resolve => {
      const handle = spawn(cmd, cmdArgs, { cwd: '.' })
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
  },
  replaceInFile: (file, regex, replaceFunc) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Something went wrong trying to load the file!')
        console.error(err)
        exitRelease()
      }

      const result = data.replace(regex, replaceFunc)

      fs.writeFile(file, result, 'utf8',  (err) => {
         if (err) {
           console.error('❌ Something went wrong trying to write to the file!')
           console.error(err)
           exitRelease()
         }
      })
    })
  },
  checkWorkspaceIsClean: async () => {
    const { stdout: workspaceIsUnclean } = await execAssumeOkay('git diff-index --quiet HEAD -- || echo "not clean"')
    if (workspaceIsUnclean) {
      console.error('❌ Your git workspace must be clean before starting a release 🤖😞')
      exitRelease()
    }

    overrideSharedVariables({safeToClearWorkspace: true})
  },
  exitRelease,
  question,
  stepTitle: message => {
    console.log()
    console.log(chalk.magenta('~'.repeat(message.length + 4)))
    console.log(chalk.magenta(`| ${message} |`))
    console.log(chalk.magenta('~'.repeat(message.length + 4)))
    console.log()
  }
}
