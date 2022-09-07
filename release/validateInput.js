const { error, debug } = require('./util/logging')
const { execute } = require('./util/terminal')
const parseChangelog = require('changelog-parser')
const { cleanVersion } = require('./util/helpers')
const semver = require('semver')

const { RELEASE_VERSION, IS_LTS, RELEASE_BRANCH_NAME } = process.env

const validateInput = async () => {
  console.log(
    [
      '-------------------------------',
      `Release version: ${RELEASE_VERSION}`,
      `LTS release? ${IS_LTS}`,
      `Release branch: ${RELEASE_BRANCH_NAME}`,
      '-------------------------------',
    ].join('\n')
  )

  const validReleaseVersionString = /^\d{1,2}\.\d{1,2}\.\d{1,2}(\-(rc|alpha|beta|test)\.\d{1,2})?$/.test(
    RELEASE_VERSION
  )

  if (!validReleaseVersionString) {
    error(
      'Invalid release version, use format: major.minor.patch(-rc|alpha|beta|test.*) (6.20.0 / 6.20.0-rc.1)'
    )
  }

  let changelogData = await parseChangelog('CHANGELOG.md')
  let similairVersions = changelogData.versions.filter(
    (v) => v.version && cleanVersion(v.version) == cleanVersion(RELEASE_VERSION)
  )
  let allowOverwrite = true

  if (similairVersions.length) {
    allowOverwrite = !similairVersions.find(
      (v) => !semver.gt(RELEASE_VERSION, v.version)
    )
  }

  if (!allowOverwrite) {
    error(
      `The new version ${RELEASE_VERSION} is lower than those who are already created.`
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
  await validateInput()
  // await validateReleaseVersionNPM()
})()
