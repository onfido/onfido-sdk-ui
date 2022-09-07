const { readFile } = require('./util/file')
const { exitWithError } = require('./util/logging')
const { execute } = require('./util/terminal')
const { RELEASE_VERSION } = process.env

const prePublishChecks = async () => {
  // const { stdout: npmout } = await execute(
  //   `npm view onfido-sdk-ui@${RELEASE_VERSION}`
  // )
  // if (npmout.length > 0) {
  //   exitWithError(`It seems this release is already published on NPM`)
  // }

  const config = await readFile('release/githubActions/workflows.config')

  if (
    !config.match(/BASE_32_VERSION=\w{2}/) ||
    !config.match(/RELEASE_VERSION=.+/)
  ) {
    exitWithError(
      'The release/githubActions/workflows.config file is missing a base 32 or release version'
    )
  }
}

;(async () => {
  await prePublishChecks()
})()
