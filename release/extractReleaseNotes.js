const { error } = require('./util/logging')
const parseChangelog = require('changelog-parser')
const { RELEASE_VERSION, IS_LTS } = process.env

module.exports = async (core) => {
  const changelogData = await parseChangelog('CHANGELOG.md')
  const entry = changelogData.versions.find(
    (i) => i.version === RELEASE_VERSION
  )

  if (!entry) {
    error('Could not extract release notes from CHANGELOG.md')
  }

  core.setOutput('release_notes', entry.body)
  core.setOutput('release_name', `${RELEASE_VERSION}${IS_LTS ? '-LTS' : ''}`)
}
