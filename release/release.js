#!/usr/bin/env node
const chalk = require('chalk')

const config = require('./releaseConfig')
const terminalUI = require('./utils/terminalUI')
const io = require('./utils/IO')
const file = require('./utils/file')
const processes = require('./utils/processes')

const { welcomeMessage, stepTitle } = terminalUI
const { question, getNumberInput, proceedYesNo } = io
const { spawnAssumeOkay, execAssumeOkay, execWithErrorHandling, exitRelease} = processes
const { replaceInFile, readInFile } = file

const { VERSION } = process.env

const checkWorkspaceIsClean = async () => {
  const { stdout: workspaceIsUnclean } = await execAssumeOkay('git diff-index --quiet HEAD || echo "not clean"')
  if (workspaceIsUnclean) {
    console.error('❌ Your git workspace must be clean before starting a release 🤖😞')
    exitRelease()
  }
  config.write('safeToClearWorkspace', true)
}

const checkRequiredParams = () => {
  const required = ['VERSION']
  const missingEnvKeys = required.filter(reqEnv => !process.env[reqEnv])
  if (missingEnvKeys.length) {
    console.error(`❌ Some required environment variables are missing! ${missingEnvKeys.join(', ')}`)
    exitRelease()
  }
}

const confirmReleaseVersion = async () => {
  stepTitle('Release Type & Version')
  const isReleaseCandidate = await question('Is this a Release Candidate?')
  if (isReleaseCandidate) {
    const rcNumber = await getNumberInput('What is the Release Candidate number? ')
    config.write('versionRC', `${VERSION}-rc.${rcNumber}`)
    const isFirstReleaseIteration = parseInt(rcNumber, 10) === 1
    config.write('isFirstReleaseIteration', isFirstReleaseIteration)
    console.log(`This is a ${chalk.bold.yellow('RELEASE CANDIDATE')}.`)
    console.log(`Version Candidate: "${chalk.bold.yellow(config.data.versionRC)}"`)
    console.log(`Version (to eventually be part of): "${chalk.bold.yellow(VERSION)}"`)
  } else {
    console.log(`This is a ${chalk.bold.green('FULL')} release.`)
    console.log(`Version: "${chalk.bold.green(VERSION)}"`)
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
  console.log(' - CONFLUENCE')
  console.log('   - Review and update "feature matrix", if necessary.')
  console.log('   - Review and update the relevant subpages under the SDK (Web & Mobile) section of the Onfido product documentation')

  await proceedYesNo('All of those files have been updated')
}

const letsGetStarted = () => {
  console.log('\nGreat! Then let\'s get started! 🤖\n')
}

const checkoutAndPullLatestCode = async () => {
  stepTitle('👀 Checking out the latest branch...')
  const branchToCheckout = config.data.isFirstReleaseIteration ? 'development' : `release/${VERSION}`
  console.log(`Great, checking out ${chalk.magenta(branchToCheckout)}`)
  await spawnAssumeOkay('git', ['checkout', branchToCheckout])
  await spawnAssumeOkay('git', ['pull', 'origin', branchToCheckout])

  console.log('✅ Success!')
}

const bumpBase32 = numberString => {
  const base = 32
  const number = parseInt(numberString, base)
  const incNumber = number + 1
  return incNumber.toString(base).toUpperCase()
}

const incrementBase32Version = async () => {
  stepTitle('⬆️ Incrementing the Base 32 version...')
  // The base32 should only be updated once per release.
  // So we do it only for the first release candidate,
  // all the following iteration will use the same base32 version
  if (config.data.isFirstReleaseIteration) {
    replaceInFile(
      'webpack.config.babel.js',
      /'BASE_32_VERSION'\s*: '([A-Z]+)'/,
      (_, groupMatch) => `'BASE_32_VERSION': '${bumpBase32(groupMatch)}'`
    )
  }
  console.log('✅ Success!')
}

const incrementPackageJsonVersion = async () => {
  stepTitle('⬆️ Setting the package.json version...')

  replaceInFile(
    'package.json',
    /"version": ".*"/,
    () => `"version": "${config.data.versionRC || VERSION}"`
  )

  console.log('✅ Success!')
}

const incrementVersionInJSFiddle = async () => {
  stepTitle('⬆️ Increment version in JSFiddle...')
  const version = config.data.versionRC ? config.data.versionRC : VERSION

  replaceInFile(
    'demo/fiddle/demo.details',
    /- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/onfido\.min\.js\n\s{3}- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/style\.css/,
    () => `- https://assets.onfido.com/web-sdk-releases/${version}/onfido.min.js\n${' '.repeat(3)}- https://assets.onfido.com/web-sdk-releases/${version}/style.css`
  )
  console.log('✅ Success!')

}

const npmInstallAndBuild = async () => {
  stepTitle('🌍 Making sure our npm dependencies are up to date...')

  const isVerboseCmd = true
  await spawnAssumeOkay('npm', ['install'], isVerboseCmd)

  stepTitle('🏗️ Running npm build...')
  await spawnAssumeOkay('npm', ['run', 'build'], isVerboseCmd)
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('✅ Success!')
}

const happyWithChanges = async () => {
  stepTitle('🤓 Check that you are happy with the changes...')

  console.log(chalk.magenta('These are the files that will change:'))

  const isVerboseCmd = true
  await spawnAssumeOkay('git', ['status'], isVerboseCmd)

  console.log(chalk.magenta('And here\'s the diff, excluding the dist folder:'))
  await spawnAssumeOkay('git', ['diff', '--', '.', '":(exclude)dist/*"'], isVerboseCmd)

  await proceedYesNo('Do the changes look correct?')
}

const createReleaseBranch = async () => {
  stepTitle('🍴 Creating a release branch')

  const releaseBranch = `release/${VERSION}`
  console.log(`Creating the branch ${chalk.red(releaseBranch)}`)

  await spawnAssumeOkay('git', ['checkout', '-b', releaseBranch])
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const checkoutExistingReleaseBranch = async () => {
  stepTitle('👀 Checking out release branch')

  const releaseBranch = `release/${VERSION}`
  console.log(`Creating the branch ${chalk.red(releaseBranch)}`)

  await spawnAssumeOkay('git', ['checkout', releaseBranch])
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const checkoutOrCreateBranch = async () => {
  stepTitle('💅 Release branch')

  if (config.data.isFirstReleaseIteration) {
    const doesBranchExist = await question('Does a branch for this release already exist? If No, I will create one for you')
    doesBranchExist ? await checkoutExistingReleaseBranch() : await createReleaseBranch()
  }
  else {
    await checkoutExistingReleaseBranch()
  }
}

const makeReleaseCommit = async () => {
  stepTitle('💾 Making commit release')

  const commitMessage = `"Bump version to ${config.data.versionRC || VERSION}"`
  console.log(`Creating the commit message: "${commitMessage}"`)

  const isVerboseCmd = true
  await spawnAssumeOkay('git', ['add', '.'], isVerboseCmd)
  await spawnAssumeOkay('git', ['commit', '-m', commitMessage], isVerboseCmd)
  await spawnAssumeOkay('git', ['push', 'origin', 'HEAD'])
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const loginToS3 = async () => {
  stepTitle('🔐 Sign in to 1Password and S3')
  console.log('On another shell, please run the following commands:')
  console.log(`${chalk.bold.yellow(config.data.OP_LOGIN_CMD)}`)
  console.log(`${chalk.bold.yellow(config.data.S3_LOGIN_CMD)}`)
  await proceedYesNo('Have all of these commands succeeded?\n')
}

const uploadToS3 = async () => {
  stepTitle('📤 Upload to S3')
  console.log('On another shell, please run the following commands:')
  await readInFile('./webpack.config.babel.js',
    /'BASE_32_VERSION'\s*: '([A-Z]+)'/,
    (matchGroup) => {
      console.log(`${chalk.bold.yellow(`${config.data.UPLOAD_CMD} ${config.data.S3_BUCKET}${config.data.BASE_32_FOLDER_PATH}/${matchGroup[1]}/ ${config.data.S3_FLAGS}`)}`)
      const versionPath = config.data.versionRC ? config.data.versionRC : VERSION
      console.log(`${chalk.bold.yellow(`${config.data.UPLOAD_CMD} ${config.data.S3_BUCKET}${config.data.RELEASES_FOLDER_PATH}/${versionPath}/ ${config.data.S3_FLAGS}`)}`)
    }
  )
  await new Promise(resolve => setTimeout(resolve, 1000))
}

const didS3uploadSucceed = async () => {
  await proceedYesNo('Have all of these commands succeeded?')
}

const publishTag = async () => {
  if (config.data.versionRC) {
    stepTitle(`🕑 Creating next tag for release candidate ${config.data.versionRC}`)
    await spawnAssumeOkay('npm', ['publish', '--tag', 'next'])
    console.log('Done. Now make sure that the latest tag has not changed, only the next one:')

    const isVerboseCmd = true
    await spawnAssumeOkay('npm', ['dist-tag', 'ls', 'onfido-sdk-ui'], isVerboseCmd)
    await proceedYesNo('Is it all good?')
  }
  else {
    stepTitle(`🕑 Creating tag ${VERSION}`)
    await spawnAssumeOkay('git', ['tag', VERSION])
    await spawnAssumeOkay('git', ['push', 'origin', VERSION])
    console.log(`Done. The latest tag should now be ${VERSION}`)
    console.log(`Now check that: `)
    console.log('- Travis TAG build was successful')
    console.log(`- https://latest-onfido-sdk-ui-onfido.surge.sh/ is using ${VERSION}`)
    await proceedYesNo('Is it all good?')
  }
}

const checkNPMUserIsLoggedIn = async () => {
  const isLoggedIn = await execWithErrorHandling('npm whoami', npmLoginInstruction)
  if (isLoggedIn) {
    console.log('✅ Success!')
  }
}

const npmLoginInstruction = async () => {
  console.log('Oops! Looks like you are not logged in.')
  console.log(`In a new tab, run ${chalk.bold.yellow('npm login')} using the credentials from 1Password`)
  await proceedYesNo('All good?')
  await checkNPMUserIsLoggedIn()
}

const npmLogin = async () => {
  stepTitle(`🔑 NPM login`)
  await checkNPMUserIsLoggedIn()
}

const publishOnNpm = async () => {
  stepTitle(`🚀 Publishing ${VERSION} on NPM`)
  await spawnAssumeOkay('npm', ['publish'])
  console.log('✅ Success!')
}

const upgradeDemoAppToTag = async () => {
  stepTitle('🕑 Upgrading demo app...')
  const versionToInstall = config.data.versionRC ? config.data.versionRC : VERSION
  await spawnAssumeOkay(`cd ${config.data.SAMPLE_APP_PATH} && npm install onfido-sdk-ui@${versionToInstall}`, [])
  console.log('✅ Success!')
}

const regressionTesting = async () => {
  stepTitle('👀 Regression testing')
  console.log('✅ Release candidate complete!')
  console.log('🏃 Go ahead and test the SDK deployment on https://release-[PR-NUMBER]-pr-onfido-sdk-ui-onfido.surge.sh')
}

const releaseComplete = () => {
  stepTitle('🎉🎉🎉 Release Complete!')
  console.log('Beep boop. Release Bot has completed the release. See you next release! 🤖')
  console.log('🏃 Go ahead and perform the post release steps! See you next release! 🤖👋')
}

const main = async () => {
  welcomeMessage()
  await checkWorkspaceIsClean()
  checkRequiredParams()
  await confirmReleaseVersion()
  await confirmDocumentationCorrect()

  letsGetStarted()

  await checkoutAndPullLatestCode()
  await incrementBase32Version()
  await checkoutOrCreateBranch()
  await incrementPackageJsonVersion()
  await incrementVersionInJSFiddle()
  await npmInstallAndBuild()
  await happyWithChanges()
  await makeReleaseCommit()
  await loginToS3()
  await uploadToS3()
  await didS3uploadSucceed()
  await npmLogin()
  await publishTag()
  if (config.data.versionRC) {
    await upgradeDemoAppToTag()
    regressionTesting()
  }
  else {
    await publishOnNpm()
    await upgradeDemoAppToTag()
    releaseComplete()
  }
}

main()
