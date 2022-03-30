const { replaceInFile, getFromFile } = require('./utils/file')
const config = require('./config')
const semverSort = require('semver-sort')

const incrementPackageJsonVersion = async (version) => {
  console.log('⬆️ Setting the package.json version...')

  replaceInFile(
    'package.json',
    /"version": ".*"/,
    () => `"version": "${config.RELEASE_VERSION}"`
  )

  console.log('✅ Success!')
}

const incrementVersionInJSFiddle = async () => {
  console.log('⬆️ Increment version in JSFiddle...')

  replaceInFile(
    'demo/fiddle/demo.details',
    /- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/onfido\.min\.js\n\s{3}- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/style\.css/,
    () =>
      `- https://assets.onfido.com/web-sdk-releases/${
        config.RELEASE_VERSION
      }/onfido.min.js\n${' '.repeat(
        3
      )}- https://assets.onfido.com/web-sdk-releases/${
        config.RELEASE_VERSION
      }/style.css`
  )
  console.log('✅ Success!')
}

// @TODO: Support LTS updates?
const updateChangelog = async () => {
  const [year, month, day] = new Date().toLocaleDateString().split('/')
  const date = [day, month, year].join('-')

  const cleanVersion = config.RELEASE_VERSION.replace(/-rc\..*/, '')
  const isLTS = config.IS_LTS
  const previousVersion = await getPreviousVersion(cleanVersion)

  const alreadyAvailable = await getFromFile(
    'CHANGELOG.md',
    new RegExp(`^## \\[${cleanVersion}\\]`, 'gm')
  )

  if (isLTS) {
    console.error('We dont supported automated LTS releases yet...')
    process.exit(1)
    return
  }
  if (alreadyAvailable) {
    return
  }

  await replaceInFile(
    'CHANGELOG.md',
    '## [next-version]',
    [`## [next-version]`, `## [${cleanVersion}] - ${date}`].join('\n\n')
  )

  await replaceInFile(
    'CHANGELOG.md',
    /^\[next-version]\:.*$/gm,
    [
      `[next-version]: https://github.com/onfido/onfido-sdk-ui/compare/${cleanVersion}...development`,
      `[${cleanVersion}]: https://github.com/onfido/onfido-sdk-ui/compare/${previousVersion}...${cleanVersion}`,
    ].join('\n')
  )
}

const getPreviousVersion = async (version) => {
  const links = await getFromFile('CHANGELOG.md', /^(\[.*]\:.*)$/gm)

  let versionList = links.map((i) => {
    const [_all, version, link] = i.match(/\[(.*)\]: (.*)/)
    return version
  })

  if (versionList.indexOf(version) === -1) {
    versionList.push(version)
  }

  versionList = semverSort.desc(versionList.slice(2, 500))
  const index = versionList.indexOf(version)
  return versionList[index + 1]
}

module.exports = async () => {
  await incrementPackageJsonVersion()
  await incrementVersionInJSFiddle()
  await updateChangelog()
  return false
}
