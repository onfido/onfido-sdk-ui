const { getChangeLogEntry } = require('./util/helpers')
const {
  RELEASE_VERSION_CLEAN,
  GITHUB_ACTOR,
  RELEASE_BRANCH_NAME,
  GITHUB_REF,
} = process.env

module.exports = async (github, context) => {
  const changelogEntry = await getChangeLogEntry(RELEASE_VERSION_CLEAN)

  const body = [
    changelogEntry,
    '----',
    '# Release steps:',
    "> The crowd manual regression test cycle can be skipped when it's a alpha / beta release or when the release doesn't have any noteworthy changes.",
    '- [x] 1) Create a release branch and update files',
    '- [ ] 2) Check changes and pass all tests',
    '- [ ] 3) Publish the `rc` release',
    '- [ ] 4) Start the crowd manual regression testing cycle',
    '- [ ] 5) Finish the crowd manual regression testing cycle',
    '- [ ] 6) Update release with full version number',
    '- [ ] 7) Release full version',
    '- [ ] 8) Notify people on slack (#team-sdk-web)',
  ].join('\n')

  const { repo, owner } = context.repo

  const reviewers = [
    'DannyvanderJagt',
    'Phoebe-B',
    'zoeradkani',
    'it-ony',
    'nulrich',
  ].filter((s) => s.toLowerCase() !== GITHUB_ACTOR.toLowerCase())

  const result = await github.rest.pulls.create({
    title: RELEASE_BRANCH_NAME,
    owner,
    repo,
    head: GITHUB_REF,
    base: 'master',
    body,
  })

  await github.rest.pulls.requestReviewers({
    owner,
    repo,
    pull_number: result.data.number,
    reviewers,
  })

  github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: result.data.number,
    labels: ['release'],
  })
}
