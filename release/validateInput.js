const { error, log } = require('./util/logging')
const { execute } = require('./util/terminal')

const {
  RELEASE_VERSION,
  BASE_32_VERSION,
  IS_LTS,
  RELEASE_BRANCH_NAME,
} = process.env

const validateInput = () => {
  log(
    [
      '-------------------------------',
      `Release version: ${RELEASE_VERSION}`,
      `BASE 32: ${BASE_32_VERSION}`,
      `LTS release? ${IS_LTS}`,
      `Release branch: ${RELEASE_BRANCH_NAME}`,
      '-------------------------------',
    ].join('\n')
  )

  const validReleaseVersion = /^\d{1,2}\.\d{1,2}\.\d{1,2}(\-rc\.\d{1,2})?$/.test(
    RELEASE_VERSION
  )
  const validBase32 = /^[A-Z]{2}$/.test(BASE_32_VERSION)

  if (!validReleaseVersion) {
    error(
      'Invalid release version, use format: major.minor.patch(-rc.*) (6.20.0 / 6.20.0-rc.1)'
    )
  }
  if (!validBase32) {
    error('Invalid base32 version, use two capital letters. Like: AA')
  }
}

const validateReleaseVersion = async () => {
  const { stdout } = await execute(`npm view onfido-sdk-ui@${RELEASE_VERSION}`)

  if (stdout) {
    error(`The version ${RELEASE_VERSION} already exists on npm`)
  }
}

;(async () => {
  validateInput()
  await validateReleaseVersion()
})()
