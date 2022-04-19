import { env } from '../util/env'
import { step, logErrorNow, logError } from '../util/output'
import { execute } from '../util/processes'

export const checkWorkspaceIsClean = async () => {
  const { stdout } = await execute(
    'git diff-index --quiet HEAD || echo "not clean"'
  )

  if (stdout) {
    logErrorNow('Your git workspace must be clean before starting a release')
  }
}

export const validateInput = step('Validating input', () => {
  console.log(
    [
      '-------------------------------',
      `Release version: ${env.RELEASE_VERSION}`,
      `BASE 32: ${env.BASE32_VERSION}`,
      `LTS release? ${env.IS_LTS}`,
      `CI? ${env.IS_CI}`,
      `Release branch: ${env.RELEASE_BRANCH_NAME}`,
      '-------------------------------',
    ].join('\n')
  )

  const validReleaseVersion = /^\d{1,2}\.\d{1,2}\.\d{1,2}(\-rc\.\d{1,2})?$/.test(
    env.RELEASE_VERSION
  )
  const validBase32 = /^[A-Z]{2}$/.test(env.BASE32_VERSION)

  if (!validReleaseVersion) {
    logError(
      'Invalid release version, use format: major.minor.patch(-rc.*) (6.20.0 / 6.20.0-rc.1)'
    )
  }
  if (!validBase32) {
    logError('Invalid base32 version, use two capital letters. Like: AA')
  }
})
