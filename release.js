#!/usr/bin/env node

const yn = require('yn')
const chalk = require('chalk')
const ora = require('ora')
const readline = require('readline');
const fs = require('fs')
const util = require('util')
const { exec, spawn } = require('child_process')
const promiseExec = util.promisify(exec)

const { VERSION, VERSION_RC, S3_BUCKET } = process.env

let safeToClearWorkspace = false

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


const proceedYesNo = async query => {
  const ok = await question(query || 'Is this correct?')
  if (ok) {
    console.log('✅ Great!')
  } else {
    console.error('❌ Things were not correct. I don\'t know how to automate this case 🤖😞')
    exitRelease()
  }
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

const spawnAssumeOkay = async (cmd, cmdArgs, verbose) => {
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
}

const exitRelease = async () => {
  if (safeToClearWorkspace) {
    console.log('Clearing any workspace changes introduced by the release script...')
    await promiseExec('git checkout -- \'*\'')
  }
  process.exit(1)

  // make sure this step never resolves, so `process.exit` calls before this
  // function is "finished" (otherwise later steps can still get called)
  await new Promise()
}

const replaceInFile = (file, regex, replaceFunc) => {
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
}

const welcomeMessage = () => {
  console.log('Beep boop. Release Bot at your service. Let\'s release the SDK 🤖👋')
}

const checkWorkspaceIsClean = async () => {
  const { stdout: workspaceIsUnclean } = await execAssumeOkay('git diff-index --quiet HEAD -- || echo "not clean"')
  if (workspaceIsUnclean) {
    console.error('❌ Your git workspace must be clean before starting a release 🤖😞')
    exitRelease()
  }

  safeToClearWorkspace = true
}

const checkRequiredParams = () => {
  const required = ['S3_BUCKET', 'VERSION']
  const missingEnvKeys = required.filter(reqEnv => !process.env[reqEnv])
  if (missingEnvKeys.length) {
    console.error(`These are required environment variables! ${missingEnvKeys.join(', ')}`)
    exitRelease()
  }
}

const stepTitle = message => {
  console.log()
  console.log(chalk.magenta('~'.repeat(message.length + 4)))
  console.log(chalk.magenta(`| ${message} |`))
  console.log(chalk.magenta('~'.repeat(message.length + 4)))
  console.log()
}

const confirmReleaseVersion = async () => {
  stepTitle('Release Type & Version')

  if (!VERSION_RC) {
    console.log(`This is a ${chalk.bold.green('FULL')} release.`)
    console.log(`Version: "${chalk.bold.green(VERSION)}"`)
  } else {
    console.log(`This is a ${chalk.bold.yellow('RELEASE CANDIDATE')}.`)
    console.log(`Version Candidate: "${chalk.bold.yellow(VERSION_RC)}"`)
    console.log(`Version (to eventually be part of): "${chalk.bold.yellow(VERSION)}"`)
  }
  await proceedYesNo()
}

const confirmDocumentationCorrect = async () => {
  stepTitle('Documentation is Up to Date')

  console.log(`Please check that these ${chalk.bold('files have been updated')} correctly`)
  console.log(' - README.md')
  console.log(' - CHANGELOG.md')
  console.log('   - with new version number')
  console.log('   - with all Public, Internal and UI changes')
  console.log('   - with a link to diff between last and current version (at the bottom of the file)')
  console.log(' - MIGRATION.md')
  await proceedYesNo('All of those files have been updated')
}

const shouldIncrementBase32Version = async () => {
  stepTitle('Base 32 Version')

  console.log(`Should this script auto-bump the ${chalk.bold('Base 32 Version')}?`)
  console.log(`${chalk.bold('NOTE!')} This should only be bumped when a ${chalk.bold('breaking change')} is introduced between the SDK and Cross Device client`)
  console.log(`${chalk.bold('ALSO!')} This should be bumped once ${chalk.bold('PER RELEASE')} (not per release candidate!)`)
  return await question('Bump the version?')
}

const letsGetStarted = () => {
  console.log('\nGreat! Then let\'s get started! 🤖\n')
}

const checkoutBranch = async () => {
  stepTitle('🕑 Checking out the latest branch...')

  console.log('Does a release branch exist already? If not, we\'ll branch from development')
  const useRelease = await question('A release branch exists already')
  const branchToCheckout = useRelease ? `release/${VERSION}` : 'development'
  console.log(`Great, checking out ${chalk.magenta(branchToCheckout)}`)

  // TODO uncomment this later, it's just annoying when developing the script
  // await spawnAssumeOkay('git', ['checkout', branchToCheckout])
  // await spawnAssumeOkay('git', ['pull'])

  console.log('✅ Success!')

  return useRelease
}

const bumpBase32 = numberString => {
  const base = 32
  const number = parseInt(numberString, base)
  const incNumber = number + 1
  return incNumber.toString(base).toUpperCase()
}

const incrementBase32Version = async () => {
  stepTitle('⬆️ Incrementing the Base 32 version...')

  replaceInFile(
    './webpack.config.babel.js',
    /'BASE_32_VERSION'\s+: '([A-Z]+)'/,
    (_, groupMatch) => `'BASE_32_VERSION': '${bumpBase32(groupMatch)}'`
  )

  console.log('✅ Success!')
}

const incrementPackageJsonVersion = async () => {
  stepTitle('⬆️ Setting the package.json version...')

  replaceInFile(
    './package.json',
    /"version": ".*"/,
    () => `"version": "${VERSION_RC || VERSION}"`
  )

  console.log('✅ Success!')
}

const npmInstallAndBuild = async () => {
  stepTitle('🌍 Making sure our npm dependencies are up to date...')
  // TODO uncomment this later, it's just annoying when developing the script
  // await spawnAssumeOkay('npm', ['install'])

  stepTitle('🏗️ Running an npm build...')
  // TODO uncomment this later, it's just annoying when developing the script
  // await spawnAssumeOkay('npm', ['run', 'build'])

  console.log('✅ Success!')
}

const happyWithChanges = async () => {
  stepTitle('🔎 Check that you are happy with the changes...')

  console.log(chalk.magenta('These are the files that will change:'))
  await spawnAssumeOkay('git', ['status'], true)

  console.log(chalk.magenta('And here\'s the diff, excluding the dist folder:'))
  await spawnAssumeOkay('git', ['diff', '--', '.', '":!dist"'], true)

  await proceedYesNo('The changes look correct')
}

const createReleaseBranch = async () => {
  stepTitle('🍴 Creating a release branch')

  const releaseBranch = `release/${VERSION}`
  console.log(`Creating the branch ${chalk.red(releaseBranch)}`)

  await spawnAssumeOkay('git', ['checkout', '-b', releaseBranch])
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const makeReleaseCommit = async () => {
  stepTitle('💾 Making commit release')

  const commitMessage = `Bump version to ${VERSION_RC || VERSION}`
  console.log(`Creating the commit message: "${commitMessage}"`)

  await spawnAssumeOkay('git', ['commit', '-m', commitMessage])

  console.log('✅ Success!')
}

const main = async () => {
  welcomeMessage()
  await checkWorkspaceIsClean()
  checkRequiredParams()
  await confirmReleaseVersion()
  await confirmDocumentationCorrect()
  const shouldBumpBase32 = await shouldIncrementBase32Version()

  letsGetStarted()

  const releaseBranchAlreadyExists = await checkoutBranch()
  if (shouldBumpBase32) {
    await incrementBase32Version()
  }
  incrementPackageJsonVersion()
  await npmInstallAndBuild()

  await happyWithChanges()
  if (!releaseBranchAlreadyExists) {
    await createReleaseBranch()
  }
  await makeReleaseCommit()
}

main()


/**

 TODO sorry I didn't manage to finish this in time :(

 Here's my thinking in this script:
  - bash would have worked, but is harder to maintian for larger scripts
  - adding colours etc. is arguably overkill, but brings to attention important info (I would argue worthwhile for release scripts)
  - JS Fiddle actually allows you to just view a fiddle created from a GitHub repo's master branch
    - docs: https://docs.jsfiddle.net/github-integration/untitled-1
    - e.g. https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/demo/compare/
    - which is just pointing at https://github.com/highcharts/highcharts/tree/master/samples/stock/demo/compare
    - so I've gone for getting us on this, so we don't have to manually update the JSFiddle link each time! We can just always point at master
  - I've ignored the part of the release-candidate script of `aws s3 sync`, as it's pushing code to production that actually overwrites code that is being used... And as far as I could tell from chatting with Stefania, it's not actually needed until doing the final release.
  - this script should be able to do pretty much all of what was involved in the wiki page, but _eventually_ it should only do the pre-PR stuff. The post-PR stuff should be handled automatically be Travis or something

 Here was my TODO list to get everything finished.

 - make commit <-- this is throwing an error for some reason I can't work out :/

 - if RC, release npm version @next
 - if RC, tag branch
 - say to push and create a pr

 - add a “do you want to do a full release? do you already have a pr?” Step
 - aws s3 sync x-device
 - aws s3 sync lazy-loading
 - tag branch
 - post out saying to check version is deployed to ‘latest’, and to npm publish and merge master <—> development when ready
 */
