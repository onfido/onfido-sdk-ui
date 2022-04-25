const { debug } = require('./util/logging')
const parseChangelog = require('changelog-parser')
const {
  GITHUB_ACTOR,
  RELEASE_VERSION,
  GITHUB_REF,
  RELEASE_BRANCH_NAME,
} = process.env

module.exports = async (github, context) => {
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
    "> The crowd manual regression test cycle can be skipped when it's a alpha / beta release or when the release doesn't have any noteworthy changes.",
    '- [ ] 4) Start the crowd manual regression testing cycle',
    '- [ ] 5) Finish the crowd manual regression testing cycle',
    '',
    '### Full release',
    `- [ ] 6) Trigger \`pre-publish\` workflow for branch \`${RELEASE_BRANCH_NAME}\` ([link](https://github.com/onfido/onfido-sdk-ui/actions/workflows/manual_release.yml))`,
    '- [ ] 7) Review changes',
    `- [ ] 8) Trigger \`Publish release\` workflow for branch \`${RELEASE_BRANCH_NAME}\` ([link](https://github.com/onfido/onfido-sdk-ui/actions/workflows/publish_release.yml))`,
    '- [ ] 9) Notify people on slack `#team-sdk-web`',
  ].join('\n')

  const { repo, owner } = context.repo

  const reviewers = [
    'DannyvanderJagt',
    'Phoebe-B',
    'zoeradkani',
    'it-ony',
    'nulrich',
  ].filter((s) => s.toLowerCase() !== GITHUB_ACTOR.toLowerCase())

  debug('Creating PR')
  const result = await github.rest.pulls.create({
    title: RELEASE_BRANCH_NAME,
    owner,
    repo,
    head: GITHUB_REF,
    base: 'master',
    body,
  })

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
}
