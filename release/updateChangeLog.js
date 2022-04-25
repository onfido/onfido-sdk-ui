const { writeToFile } = require('./util/file')
const { cleanVersion } = require('./util/helpers')
const parseChangelog = require('changelog-parser')
const moment = require('moment')
const semver = require('semver')
const { debug } = require('@actions/core')
const { RELEASE_VERSION } = process.env

const updateChangeLog = async () => {
  let changelogData = await parseChangelog('CHANGELOG.md')

  const alreadyExists = !!changelogData.versions.find(
    (i) => i.version == cleanVersion(RELEASE_VERSION)
  )

  changelogData.versions = changelogData.versions
    .map((i) => {
      const isNextVersion = !!i.title.match('next-version')
      const date = moment().format('YYYY-MM-DD')

      // For new entry replace next-version (add now one later) otherwise update entry
      if (
        (alreadyExists &&
          cleanVersion(i.version || '') === cleanVersion(RELEASE_VERSION)) ||
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
    .map((i, index) =>
      [
        `## [${i.version}]${i.date ? ` - ${i.date}` : ''}`,
        i.body ? `\n\n${i.body}\n\n` : '\n\n',
      ].join('')
    )
    .join('')

  const links = data.versions
    .map((i, index) => {
      const isNextVersion = index === 0
      const isLastEntry = index === data.versions.length - 1

      const previous = isLastEntry ? '0.4.0' : data.versions[index + 1]?.version
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
  updateChangeLog()
})()
