const { error } = require('./util/logging')
const { isFullVersion } = require('./util/helpers')
const { execute } = require('./util/terminal')
const { RELEASE_VERSION, BASE_32_VERSION, PULL_REQUEST_NUMBER } = process.env

const postReleaseChecks = async () => {
  const { stdout: npmout } = await execute(
    `npm view onfido-sdk-ui@${RELEASE_VERSION}`
  )
  if (npmout.length === 0) {
    error(`It seems this release isn't published on NPM`)
  }

  try {
    await execute(`aws s3 ls ${AWS_BASE}${BASE_32_VERSION}/onfido.min.js`)
  } catch {
    error(
      `The upload to AWS seems to have gone wrong, we couldn't find ${BASE_32_VERSION}/onfido.min.js`
    )
  }
}

const addSlackMessageToPR = async (github, context) => {
  const slack = [
    ':bell: **Copy/paste slack message:**',
    '```',
    `@here We have released version \`${RELEASE_VERSION}\` of the WebSDK 🎉 Checkout the changelog here: https://github.com/onfido/onfido-sdk-ui/releases/tag/${RELEASE_VERSION}`,
    '```',
  ].join('\n')

  const body = [
    '### We have published a new version! :tada:',
    `- Version: \`${RELEASE_VERSION}\``,
    `- Surge: https://${RELEASE_VERSION}-onfido-sdk-ui-onfido.surge.sh`,
    isFullVersion(RELEASE_VERSION) ? `\n${slack}` : '',
  ].join('\n')

  await github.rest.issues.createComment({
    issue_number: PULL_REQUEST_NUMBER,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body,
  })
}

module.exports = async (github, context) => {
  await postReleaseChecks()
  await addSlackMessageToPR(github, context)
}
