const { debug } = require('./util/logging')
const parseChangelog = require('changelog-parser')
const { RELEASE_VERSION } = process.env

module.exports = async (core) => {
  const changelogData = await parseChangelog('CHANGELOG.md')
  const entry = changelogData.versions.find(
    (i) => i.version === RELEASE_VERSION
  )
  console.log(entry.body)
  if (!entry) {
    error('Could not extract release notes from CHANGELOG.md')
  }

  core.setOutput('release_notes', entry.body)
}
