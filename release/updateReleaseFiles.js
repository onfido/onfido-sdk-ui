const semverSort = require('semver-sort')
const semver = require('semver')
const { info, exitWithError } = require('./util/logging')
const {
  replaceInFile,
  abstractFromFile,
  readFile,
  writeToFile,
} = require('./util/file')
const { getChangeLogEntry } = require('./util/helpers')
const { RELEASE_VERSION, RELEASE_VERSION_CLEAN, IS_LTS } = process.env

const incrementPackageJsonVersion = async () => {
  replaceInFile(
    'package.json',
    /"version": ".*"/,
    `"version": "${RELEASE_VERSION}"`
  )
}

const incrementVersionInJSFiddle = async () => {
  replaceInFile(
    'demo/fiddle/demo.details',
    /- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/onfido\.min\.js\n\s{3}- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/style\.css/,
    `- https://assets.onfido.com/web-sdk-releases/${RELEASE_VERSION}/onfido.min.js\n${' '.repeat(
      3
    )}- https://assets.onfido.com/web-sdk-releases/${RELEASE_VERSION}/style.css`
  )
}

const updateChangeLog = async () => {
  const [month, day, year] = new Date().toLocaleDateString().split('/')
  const date = [day, month, year].join('-')

  const previousVersion = await getPreviousVersion(RELEASE_VERSION_CLEAN)
  const versionExists = await abstractFromFile(
    'CHANGELOG.md',
    new RegExp(`^## \\[${RELEASE_VERSION_CLEAN}\\]`, 'gm')
  )

  if (versionExists) {
    info('Skipping updating CHANGELOG.md')
    return
  }

  if (IS_LTS || isPatchRelease(RELEASE_VERSION_CLEAN, previousVersion)) {
    let newEntry = await getChangeLogEntry('next-version')
    newEntry = newEntry[0].replace(
      '## [next-version]',
      `## [${RELEASE_VERSION_CLEAN}] - ${date}`
    )

    const nextVersion = await getNextVersion(previousVersion)
    let changelog = await readFile('CHANGELOG.md')

    changelog = changelog
      .replace(
        /## \[next\-version](.|\r|\n)*?(?=\#\# \[)/g,
        '## [next-version]\n\n'
      )
      .replace(
        new RegExp(`## \\[${previousVersion}\\](.|\r|\n)*?(?=\\#\\# \\[)`, 'g'),
        (all) => [newEntry, all].join('\n')
      )
      .replace(
        new RegExp(`\\[${nextVersion}\\]: https.*`, 'g'),
        `[${nextVersion}]: https://github.com/onfido/onfido-sdk-ui/compare/${RELEASE_VERSION_CLEAN}...${nextVersion}`
      )
      .replace(new RegExp(`\\[${previousVersion}\\]: https.*`, 'g'), (result) =>
        [
          `[${RELEASE_VERSION_CLEAN}]: https://github.com/onfido/onfido-sdk-ui/compare/${previousVersion}...${RELEASE_VERSION_CLEAN}`,
          result,
        ].join('\n')
      )

    await writeToFile('CHANGELOG.md', changelog)
    return
  }

  await replaceInFile(
    'CHANGELOG.md',
    '## [next-version]',
    [`## [next-version]`, `## [${RELEASE_VERSION_CLEAN}] - ${date}`].join(
      '\n\n'
    )
  )

  await replaceInFile(
    'CHANGELOG.md',
    /^\[next-version]\:.*$/gm,
    [
      `[next-version]: https://github.com/onfido/onfido-sdk-ui/compare/${RELEASE_VERSION_CLEAN}...development`,
      `[${RELEASE_VERSION_CLEAN}]: https://github.com/onfido/onfido-sdk-ui/compare/${previousVersion}...${RELEASE_VERSION_CLEAN}`,
    ].join('\n')
  )
}

// Helpers
const getVersionsFromChangeLog = async () => {
  const links = await abstractFromFile('CHANGELOG.md', /^(\[.*]\:.*)$/gm)
  const versionList = links
    .map((i) => {
      const r = i.match(/\[(\d.*)\]: (.*)/)
      return r ? r[1] : null
    })
    .filter(Boolean)
  return semverSort.desc(versionList)
}

const getPreviousVersion = async (version) => {
  const versionList = await getVersionsFromChangeLog()

  // Note: for patch version it get the last / highest one
  return versionList.find((v) => {
    const major = semver.major(version)
    const minor = semver.minor(version)
    return !!v.match(new RegExp(`${major}.${minor}.*`))
  })
}

const getNextVersion = async (version) => {
  const versionList = await getVersionsFromChangeLog()
  const index = versionList.indexOf(version)
  const nextVersion = versionList[index - 1]

  if (index === -1 || !nextVersion) {
    exitWithError('Could not find the next version from CHANGELOG.md')
    return
  }

  return nextVersion
}

const isPatchRelease = (versionA, versionB) => {
  const major = semver.major(versionA) === semver.major(versionB)
  const minor = semver.minor(versionA) === semver.minor(versionB)
  const patch = semver.patch(versionA) === semver.patch(versionB)
  return major && minor && !patch
}

;(async () => {
  await incrementPackageJsonVersion()
  await incrementVersionInJSFiddle()
  await updateChangeLog()
})()
