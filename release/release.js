#!/usr/bin/env node
const chalk = require('chalk')

const config = require('./releaseConfig')
const terminalUI = require('./utils/terminalUI')
const io = require('./utils/IO')
const file = require('./utils/file')
const processes = require('./utils/processes')

const { welcomeMessage, stepTitle } = terminalUI
const { question, getNumberInput, proceedYesNo } = io
const { spawnAssumeOkay, execAssumeOkay, exitRelease } = processes
const { replaceInFile } = file

const { VERSION } = process.env

const checkWorkspaceIsClean = async () => {
  const { stdout: workspaceIsUnclean } = await execAssumeOkay(
    'git diff-index --quiet HEAD || echo "not clean"'
  )
  if (workspaceIsUnclean) {
    console.error(
      '❌ Your git workspace must be clean before starting a release 🤖😞'
    )
    exitRelease()
  }
  config.write('safeToClearWorkspace', true)
}

const checkRequiredParams = () => {
  const required = ['VERSION']
  const missingEnvKeys = required.filter((reqEnv) => !process.env[reqEnv])
  if (missingEnvKeys.length) {
    console.error(
      `❌ Some required environment variables are missing! ${missingEnvKeys.join(
        ', '
      )}`
    )
    exitRelease()
  }
}

const confirmReleaseVersion = async () => {
  stepTitle('Release Type & Version')
  const isReleaseCandidate = await question('Is this a Release Candidate?')
  if (isReleaseCandidate) {
    const isTestReleaseCandidate = await question(
      'Is this a Test Release Candidate?'
    )
    const rcNumber = await getNumberInput(
      'What is the Release Candidate number? '
    )
    config.write(
      'versionRC',
      `${VERSION}-rc.${rcNumber}${isTestReleaseCandidate ? '-test' : ''}`
    )
    const isFirstReleaseIteration = parseInt(rcNumber, 10) === 1
    config.write('isFirstReleaseIteration', isFirstReleaseIteration)
    console.log(`This is a ${chalk.bold.yellow('RELEASE CANDIDATE')}.`)
    console.log(
      `Version Candidate: "${chalk.bold.yellow(config.data.versionRC)}"`
    )
    console.log(
      `Version (to eventually be part of): "${chalk.bold.yellow(VERSION)}"`
    )
  } else {
    console.log(`This is a ${chalk.bold.green('FULL')} release.`)
    console.log(`Version: "${chalk.bold.green(VERSION)}"`)
  }
  await proceedYesNo()
}

const confirmDocumentationCorrect = async () => {
  stepTitle('Documentation is Up to Date')

  console.log(
    `Please check that these ${chalk.bold('files have been updated')} correctly`
  )
  console.log(' - README.md')
  console.log(' - CHANGELOG.md')
  console.log('   - with new version number')
  console.log('   - with all Public, Internal and UI changes')
  console.log(
    '   - with a link to diff between last and current version (at the bottom of the file)'
  )
  console.log(' - MIGRATION.md')
  console.log('   - with all breaking changes (for MAJOR versions)')
  console.log('   - with a list of translation keys changes (for all versions)')
  console.log(' - CONFLUENCE')
  console.log('   - Review and update "feature matrix", if necessary.')
  console.log(
    '   - Review and update the relevant subpages under the Technology > SDK (Web & Mobile) section of the Onfido product documentation'
  )

  await proceedYesNo('All of those files have been updated')
}

const letsGetStarted = () => {
  console.log("\nGreat! Then let's get started! 🤖\n")
}

const checkoutAndPullLatestCode = async () => {
  stepTitle('👀 Checking out the latest branch...')
  const branchToCheckout = config.data.isFirstReleaseIteration
    ? 'development'
    : `release/${VERSION}`
  console.log(`Great, checking out ${chalk.magenta(branchToCheckout)}`)
  console.log()
  await spawnAssumeOkay('git', ['checkout', branchToCheckout])
  await spawnAssumeOkay('git', ['pull', 'origin', branchToCheckout])

  console.log('✅ Success!')
}

const bumpBase32 = (numberString) => {
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
    try {
      await replaceInFile(
        'webpack.config.babel.js',
        /BASE_32_VERSION\s*: '([A-Z]+)'/,
        (_, groupMatch) => {
          config.write('base32Version', bumpBase32(groupMatch))
          return `BASE_32_VERSION: '${config.data.base32Version}'`
        }
      )

      await replaceInFile(
        'release/githubActions/workflows.config',
        /BASE_32_VERSION\s*=([A-Z]+)/,
        () => `BASE_32_VERSION=${config.data.base32Version}`
      )
    } catch (err) {
      console.log(err.message)
      console.log(err.meta)
      exitRelease()
    }
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
    () =>
      `- https://assets.onfido.com/web-sdk-releases/${version}/onfido.min.js\n${' '.repeat(
        3
      )}- https://assets.onfido.com/web-sdk-releases/${version}/style.css`
  )
  console.log('✅ Success!')
}

const npmInstallAndBuild = async () => {
  stepTitle('🌍 Making sure our NPM dependencies are up to date...')

  const isVerboseCmd = true
  await spawnAssumeOkay('npm', ['install'], isVerboseCmd)

  stepTitle('🏗️ Running npm build...')
  await spawnAssumeOkay('npm', ['run', 'build'], isVerboseCmd)
  console.log()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log('✅ Success!')
}

const happyWithChanges = async () => {
  stepTitle('🤓 Check that you are happy with the changes...')

  console.log(chalk.magenta('These are the files that will change:'))

  const isVerboseCmd = true
  await spawnAssumeOkay('git', ['status'], isVerboseCmd)

  console.log(chalk.magenta("And here's the diff, excluding the dist folder:"))
  await spawnAssumeOkay(
    'git',
    ['diff', '--', '.', '":(exclude)dist/*"'],
    isVerboseCmd
  )

  await proceedYesNo('Do the changes look correct?')
}

const createReleaseBranch = async () => {
  stepTitle('🍴 Creating a release branch')

  const releaseBranch = `release/${VERSION}`
  console.log(`Creating the branch ${chalk.red(releaseBranch)}`)
  console.log()

  await spawnAssumeOkay('git', ['checkout', '-b', releaseBranch])
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const checkoutExistingReleaseBranch = async () => {
  stepTitle('👀 Checking out release branch')

  const releaseBranch = `release/${VERSION}`
  console.log(`Creating the branch ${chalk.red(releaseBranch)}`)
  console.log()

  await spawnAssumeOkay('git', ['checkout', releaseBranch])
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const checkoutOrCreateBranch = async () => {
  stepTitle('💅 Release branch')

  if (config.data.isFirstReleaseIteration) {
    const doesBranchExist = await question(
      'Does a branch for this release already exist? If "No", I will create one for you'
    )
    doesBranchExist
      ? await checkoutExistingReleaseBranch()
      : await createReleaseBranch()
  } else {
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
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('✅ Success!')
}

const publishTag = async () => {
  const versionToPublish = config.data.versionRC
    ? config.data.versionRC
    : VERSION
  stepTitle(`🕑 Creating tag ${versionToPublish}`)
  await spawnAssumeOkay('git', ['tag', versionToPublish])
  await spawnAssumeOkay('git', ['push', 'origin', versionToPublish])
  console.log(`Now check that: `)
  console.log(`- Github Actions have succeeded`)
  console.log(
    `- The S3 folder for ${versionToPublish} includes style.css, onfido.min.js and onfido.crossDevice.min.js`
  )
  console.log(
    `- The S3 folder for the new Base32 version includes style.css, onfido.min.js and onfido.crossDevice.min.js`
  )
  if (!config.data.versionRC) {
    console.log(`NPM has published the new tag`)
    console.log('- Travis TAG build was successful')
    console.log(
      `- https://latest-onfido-sdk-ui-onfido.surge.sh/ is using ${VERSION}`
    )
  } else {
    console.log(`NPM has published the tag as 'next'`)
  }
  await proceedYesNo('Is it all good?')
}

const upgradeDemoAppToTag = async () => {
  stepTitle('🕑 Upgrading demo app...')
  const versionToInstall = config.data.versionRC
    ? config.data.versionRC
    : VERSION
  await spawnAssumeOkay(
    `cd ${config.data.SAMPLE_APP_PATH} && npm install onfido-sdk-ui@${versionToInstall}`,
    []
  )
  console.log('✅ Success!')
}

const regressionTesting = async () => {
  stepTitle('👀 Regression testing')
  console.log('✅ Release candidate complete!')
  console.log(
    '🏃 Go ahead and test the SDK deployment on https://release-[PR-NUMBER]-pr-onfido-sdk-ui-onfido.surge.sh'
  )
  console.log(
    'If running test cycle with crowd testing provider, share https://release-[PR-NUMBER]-pr-onfido-sdk-ui-onfido.surge.sh and MANUAL_REGRESSION.md file in relevant Slack channel setting up the scope and duration of the cycle.'
  )
}

const releaseComplete = () => {
  stepTitle('🎉🎉🎉 Release Complete!')
  console.log('Beep boop. Release Bot has completed the release. 🤖')
  console.log(
    '🏃 Go ahead and perform the post release steps! See you next release! 🤖👋'
  )
}

const main = async () => {
  welcomeMessage()
  checkRequiredParams()
  await checkWorkspaceIsClean()
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
  await publishTag()
  await upgradeDemoAppToTag()
  if (config.data.versionRC) {
    regressionTesting()
  } else {
    releaseComplete()
  }
}

main()
