const { writeToFile } = require('./util/file')
const { cleanVersion, cleanVersionIfRC } = require('./util/helpers')
const parseChangelog = require('changelog-parser')
const moment = require('moment')
const semver = require('semver')
const { debug } = require('@actions/core')
const { RELEASE_VERSION } = process.env

const updateChangelog = async () => {
  let changelogData = await parseChangelog('CHANGELOG.md')

  const alreadyExists = !!changelogData.versions.find((i) => {
    if (!i.version) {
      return false
    }
    // Only overwrite changelog entries from rc releases
    return cleanVersionIfRC(i.version) == cleanVersion(RELEASE_VERSION)
  })

  changelogData.versions = changelogData.versions
    .map((i) => {
      const isNextVersion = !!i.title.match('next-version')
      const date = moment().format('YYYY-MM-DD')

      // For new entry replace next-version (add now one later) otherwise update entry
      if (
        (alreadyExists &&
          cleanVersionIfRC(i.version || '') ===
            cleanVersion(RELEASE_VERSION)) ||
        (!alreadyExists && isNextVersion)
      ) {
        return {
          ...i,
          version: RELEASE_VERSION,
          date,
        }
      }

      return i
    })
    .sort((a, b) => {
      if (a.version === null) {
        return -1
      }
      if (b.version === null) {
        return 1
      }
      return semver.lt(a.version, b.version)
        ? 1
        : semver.gt(a.version, b.version)
        ? -1
        : 0
    })

  if (!alreadyExists) {
    changelogData.versions.unshift({
      version: 'next-version',
      title: 'next-version',
    })
  }

  debug('Updating changelog')
  await generateChangeLog(changelogData)
}

const generateChangeLog = async (data) => {
  const entries = data.versions
    .map((i) =>
      [
        `## [${i.version || 'next-version'}]${i.date ? ` - ${i.date}` : ''}`,
        i.body ? `\n\n${i.body}\n\n` : '\n\n',
      ].join('')
    )
    .join('')

  const links = data.versions
    .map((i, index) => {
      const isNextVersion = index === 0
      const isLastEntry = index === data.versions.length - 1

      // Latest release in changelog is 0.5.0, we need one version before to generate the diff link
      const baseRelease = '0.4.0'
      const previous = isLastEntry
        ? baseRelease
        : data.versions[index + 1]?.version
      const current = isNextVersion ? 'development' : i?.version
      const version = isNextVersion ? 'next-version' : i?.version

      return `[${version}]: https://github.com/onfido/onfido-sdk-ui/compare/${previous}...${current}`
    })
    .join('\n')

  const newChangeLog = [
    `# ${data.title}`,
    '\n\n',
    data.description,
    '\n\n',
    entries,
    links,
    '\n',
  ].join('')

  await writeToFile('CHANGELOG.md', newChangeLog)
}

;(async () => {
  updateChangelog()
})()
