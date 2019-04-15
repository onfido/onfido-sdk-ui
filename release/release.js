#!/usr/bin/env node

const chalk = require('chalk')
const config = require('./releaseConfig')
const helpers = require('./helpers')
const { stepTitle, question, proceedYesNo, execWithErrorHandling, checkWorkspaceIsClean,
  spawnAssumeOkay, replaceInFile, exitRelease
} = helpers

const { VERSION } = process.env

let updatedBase32 = ''
let rcNumber = NaN
let versionRC = null
let isFirstReleaseIteration = rcNumber === 1

const welcomeMessage = () => {
  console.log('Beep boop. Release Bot at your service. Let\'s release the SDK 🤖👋')
}

const checkRequiredParams = () => {
  const required = ['VERSION']
  const missingEnvKeys = required.filter(reqEnv => !process.env[reqEnv])
  if (missingEnvKeys.length) {
    console.error(`These are required environment variables! ${missingEnvKeys.join(', ')}`)
    exitRelease()
  }
}

const confirmReleaseVersion = async () => {
  stepTitle('Release Type & Version')
  const isReleaseCandidate = await question('Is this a Release Candidate?')
  if (isReleaseCandidate) {
    const rcInput = await question('What is the Release Candidate number')
    rcNumber = parseInt(rcInput, 10)
    versionRC = `${VERSION}-rc.${rcNumber}`
    console.log(`This is a ${chalk.bold.yellow('RELEASE CANDIDATE')}.`)
    console.log(`Version Candidate: "${chalk.bold.yellow(versionRC)}"`)
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
  await proceedYesNo('All of those files have been updated')
}

const letsGetStarted = () => {
  console.log('\nGreat! Then let\'s get started! 🤖\n')
}

const checkoutBranch = async () => {
  stepTitle('🕑 Checking out the latest branch...')
  const branchToCheckout = isFirstReleaseIteration ? 'development' : `release/${VERSION}`
  console.log(`Great, checking out ${chalk.magenta(branchToCheckout)}`)

  // TODO uncomment this later, it's just annoying when developing the script
  await spawnAssumeOkay('git', ['checkout', branchToCheckout])
  await spawnAssumeOkay('git', ['pull'])

  console.log('✅ Success!')
}

const bumpBase32 = numberString => {
  const base = 32
  const number = parseInt(numberString, base)
  const incNumber = number + 1
  updatedBase32 = incNumber.toString(base).toUpperCase()
  // We need to read the file to know what the current base32 version is
  // but we only want to update it the version if this is the first release candidate
  // TODO: refactor this to only read from file and skip writing
  return isFirstReleaseIteration ? updatedBase32 : numberString
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
    () => `"version": "${versionRC || VERSION}"`
  )

  console.log('✅ Success!')
}

const npmInstallAndBuild = async () => {
  stepTitle('🌍 Making sure our npm dependencies are up to date...')
  // TODO uncomment this later, it's just annoying when developing the script
  await spawnAssumeOkay('npm', ['install'])

  stepTitle('🏗️ Running an npm build...')
  // TODO uncomment this later, it's just annoying when developing the script
  await spawnAssumeOkay('npm', ['run', 'build'])

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

  const commitMessage = `Bump version to ${versionRC || VERSION}`
  console.log(`Creating the commit message: "${commitMessage}"`)
  await spawnAssumeOkay('git', ['add', '.'])
  await spawnAssumeOkay('git', ['commit', '-m', commitMessage])

  console.log('✅ Success!')
}

const loginToS3 = async () => {
  stepTitle('Sign in to 1Password and S3')
  console.log('On another shell, please run the following commands:')
  console.log(`${chalk.bold.green(config.OP_LOGIN_CMD)}`)
  console.log(`${chalk.bold.green(config.S3_LOGIN_CMD)}`)
  await proceedYesNo('Have all of these commands succeeded?')
}

const uploadToS3 = async () => {
  stepTitle('Upload to S3')
  if (!updatedBase32) {
    console.error('❌ Something went wrong! New Base32 is not available 🤖😞')
    exitRelease()
  }
  console.log('On another shell, please run the following commands:')
  console.log(`${chalk.bold.green(`${config.UPLOAD_CMD} ${config.S3_BUCKET}${config.BASE_32_FOLDER_PATH}/${updatedBase32}/`)}`)
  const versionPath = versionRC ? versionRC : VERSION
  console.log(`${chalk.bold.green(`${config.UPLOAD_CMD} ${config.S3_BUCKET}${config.RELEASES_FOLDER_PATH}/${versionPath}/`)}`)
  await proceedYesNo('Have all of these commands succeeded?')
}

const publishTag = async () => {
  if (versionRC) {
    stepTitle(`🕑 Creating next tag for release candidate ${versionRC}`)
    await spawnAssumeOkay('npm', ['publish', '--tag', 'next'])
    console.log('Done. Now make sure that the latest tag has not changed, only the next one:')
    await spawnAssumeOkay('npm', ['dist-tag', 'ls', 'onfido-sdk-ui'], true)
    await proceedYesNo('Is it all good?')
  }
  else {
    stepTitle(`🕑 Creating tag ${VERSION}`)
    await spawnAssumeOkay('git', ['tag', VERSION])
    await spawnAssumeOkay('git', ['push', 'origin', VERSION])
    console.log(`Done. The latest tag should now be ${VERSION}`)
    console.log(`Now check that: `)
    console.log('- Travis TAG build was successfull')
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
  console.log('Oh, oh. Looks like you are not logged in.')
  console.log('In a new tab, run `npm login` using the credentials from 1Password')
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
  stepTitle('🕑 Creating the new tag...')
  const versionToInstall = versionRC ? versionRC : VERSION
  await spawnAssumeOkay('cd', [config.SAMPLE_APP_PATH])
  await spawnAssumeOkay('pwd',[], true)
  await spawnAssumeOkay('npm', ['install', `onfido-sdk-ui@${versionToInstall}`])
  console.log('✅ Success!')
}

const regressionTesting = async () => {
  stepTitle('Regression testing')
  console.log('✅ Release candidate complete!')
  console.log('🥪 Go ahead and test the SDK deployment on surge link associated with the PR')
  console.log('Note: Use https://release-[PR-NUMBER]-pr-onfido-sdk-ui-onfido.surge.sh/')
}

const main = async () => {
  welcomeMessage()
  await checkWorkspaceIsClean()
  checkRequiredParams()
  await confirmReleaseVersion()
  await confirmDocumentationCorrect()

  letsGetStarted()

  await checkoutBranch()
  // TODO ideally this function should only be called if isFirstReleaseIteration
  await incrementBase32Version()
  incrementPackageJsonVersion()
  await npmInstallAndBuild()

  await happyWithChanges()
  if (isFirstReleaseIteration) {
    await createReleaseBranch()
  }
  await makeReleaseCommit()
  await loginToS3()
  await uploadToS3()
  await npmLogin()
  await publishTag()
  if (versionRC) {
    await upgradeDemoAppToTag()
    regressionTesting()
  }
  else {
    await npmLogin()
    await publishOnNpm()
    await upgradeDemoAppToTag()
  }
}

main()
