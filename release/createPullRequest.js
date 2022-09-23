const { debug } = require('./util/logging')
const parseChangelog = require('changelog-parser')
const { replaceInFile, readFile } = require('./util/file')
const {
  GITHUB_ACTOR,
  RELEASE_VERSION,
  RELEASE_BRANCH_NAME,
  REMOTE_BRANCH_EXIST,
} = process.env

module.exports = async (github, context) => {
  if (REMOTE_BRANCH_EXIST) {
    console.log('PR already exists, we are good to go!')
    return
  }

  const changelogData = await parseChangelog('CHANGELOG.md')
  const entry = changelogData.versions.find(
    (i) => i.version === RELEASE_VERSION
  )

  const body = [
    `## ${entry.title}\n`,
    entry.body,
    '\n----\n',
    '# Next steps:',
    '',
    '### Release',
    '- [ ] 1) Review the changes',
    '- [ ] 2) Update `MIGRATION.md` when necessary',
    `- [ ] 3) Trigger \`Publish release\` workflow for branch \`${RELEASE_BRANCH_NAME}\` ([link](https://github.com/onfido/onfido-sdk-ui/actions/workflows/publish_release.yml))`,
    '',
    '### Manual regression testing:',
    "> The crowd manual regression test cycle can be skipped when it's an alpha/beta release or when the release doesn't have any noteworthy changes.",
    '- [ ] 4) Start the crowd manual regression testing cycle',
    '- [ ] 5) Finish the crowd manual regression testing cycle',
    '',
    '### Full release',
    `- [ ] 6) Trigger \`pre-publish\` workflow for branch \`${RELEASE_BRANCH_NAME}\` ([link](https://github.com/onfido/onfido-sdk-ui/actions/workflows/manual_release.yml))`,
    '- [ ] 7) Review changes',
    `- [ ] 8) Trigger \`Publish release\` workflow for branch \`${RELEASE_BRANCH_NAME}\` ([link](https://github.com/onfido/onfido-sdk-ui/actions/workflows/publish_release.yml))`,
    '- [ ] 9) Notify people on slack `#team-sdk-web`',
    '',
    '### Post release',
    '> Only for full releases, not for -rc, -alpha, -beta, -test releases!',
    '- [ ] 10) Merge this PR into master',
    '- [ ] 11) Update & merge PR from master to development',
  ].join('\n')

  const { repo, owner } = context.repo

  const reviewers = [
    'DannyvanderJagt',
    'zoeradkani',
    'it-ony',
    'nulrich',
    'osolliec',
    'warrenseine',
  ].filter((s) => s.toLowerCase() !== GITHUB_ACTOR.toLowerCase())

  try {
    debug('Creating PR')
    const result = await github.rest.pulls.create({
      title: RELEASE_BRANCH_NAME,
      owner,
      repo,
      head: RELEASE_BRANCH_NAME,
      base: 'master',
      body,
    })

    debug('Updating workflows.config')
    await replaceInFile(
      'release/githubActions/workflows.config',
      /^PULL_REQUEST_NUMBER\s*=.*$/gm,
      `PULL_REQUEST_NUMBER=${result.data.number}`
    )

    debug('Adding reviewers')
    await github.rest.pulls.requestReviewers({
      owner,
      repo,
      pull_number: result.data.number,
      reviewers,
    })

    debug('Adding labels')
    github.rest.issues.addLabels({
      owner,
      repo,
      issue_number: result.data.number,
      labels: ['release'],
    })
  } catch (e) {}
}
