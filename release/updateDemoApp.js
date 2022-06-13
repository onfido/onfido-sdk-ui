const path = require('path')
const { debug } = require('./util/logging')
const { execute, spawnShell } = require('./util/terminal')
const { RELEASE_VERSION } = process.env

const repo = `https://github.com/onfido/onfido-sdk-web-sample-app.git`
const repoName = 'onfido-sdk-web-sample-app'

const updateDemoApp = async () => {
  const cwd = path.resolve(repoName)

  debug(`Cloning ${repoName}`)
  await execute(`rm -rf ${repoName}`)
  await execute(`git clone ${repo}`)
  await execute('git checkout master', cwd)

  debug(`Installing onfido-sdk-ui@${RELEASE_VERSION}`)
  await spawnShell(`npm i onfido-sdk-ui@${RELEASE_VERSION}`, cwd)

  debug('git status')
  const { stdout } = await execute('git status', cwd)
  console.log(stdout)

  debug('Commit to bump onfido-sdk-ui version')
  await execute(
    `git commit -am "Bump onfido-sdk-ui to ${RELEASE_VERSION}" --no-verify`,
    cwd
  )

  await execute(`git push origin master`, cwd)
  await execute(`rm -rf ${repoName}`)
}

;(async () => {
  await updateDemoApp()
})()
