import { step } from '../util/output'
import { env } from '../util/env'
import { replaceInFile, getFromFile } from '../util/file'
import * as semverSort from 'semver-sort'

const incrementPackageJsonVersion = step(
  '[release version] - Update package.json',
  async () => {
    replaceInFile(
      'package.json',
      /"version": ".*"/,
      `"version": "${env.RELEASE_VERSION}"`
    )
  }
)

const incrementVersionInJSFiddle = step(
  '[release version] - Update JSFiddle',
  async () => {
    replaceInFile(
      'demo/fiddle/demo.details',
      /- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/onfido\.min\.js\n\s{3}- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/style\.css/,
      `- https://assets.onfido.com/web-sdk-releases/${
        env.RELEASE_VERSION
      }/onfido.min.js\n${' '.repeat(
        3
      )}- https://assets.onfido.com/web-sdk-releases/${
        env.RELEASE_VERSION
      }/style.css`
    )
  }
)

// @TODO: Support LTS updates?
const updateChangelog = step(
  '[release version] Update CHANGELOG.md',
  async () => {
    const [year, month, day] = new Date().toLocaleDateString().split('/')
    const date = [day, month, year].join('-')

    const cleanVersion = env.RELEASE_VERSION.replace(/-rc\..*/, '')
    const previousVersion = await getPreviousVersion(cleanVersion)

    const alreadyAvailable = await getFromFile(
      'CHANGELOG.md',
      new RegExp(`^## \\[${cleanVersion}\\]`, 'gm')
    )

    if (env.IS_LTS) {
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
)

const getPreviousVersion = async (version: string) => {
  const links = (await getFromFile(
    'CHANGELOG.md',
    /^(\[.*]\:.*)$/gm
  )) as string[]

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

export default async () => {
  await incrementPackageJsonVersion()
  await incrementVersionInJSFiddle()
  await updateChangelog()
}
