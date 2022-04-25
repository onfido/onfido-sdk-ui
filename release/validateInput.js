const { error, debug } = require('./util/logging')
const { execute } = require('./util/terminal')

const { RELEASE_VERSION, IS_LTS, RELEASE_BRANCH_NAME } = process.env

const validateInput = () => {
  console.log(
    [
      '-------------------------------',
      `Release version: ${RELEASE_VERSION}`,
      `LTS release? ${IS_LTS}`,
      `Release branch: ${RELEASE_BRANCH_NAME}`,
      '-------------------------------',
    ].join('\n')
  )

  const validReleaseVersion = /^\d{1,2}\.\d{1,2}\.\d{1,2}(\-(rc|alpha|beta)\.\d{1,2})?$/.test(
    RELEASE_VERSION
  )

  if (!validReleaseVersion) {
    error(
      'Invalid release version, use format: major.minor.patch(-rc.*) (6.20.0 / 6.20.0-rc.1)'
    )
  }

  debug('The input looks good')
}

const validateReleaseVersionNPM = async () => {
  const { stdout } = await execute(`npm view onfido-sdk-ui@${RELEASE_VERSION}`)

  if (stdout) {
    error(`The version ${RELEASE_VERSION} already exists on npm`)
  }

  debug(`The version doesn't exist on NPM yet`)
}

;(async () => {
  validateInput()
  await validateReleaseVersionNPM()
})()
