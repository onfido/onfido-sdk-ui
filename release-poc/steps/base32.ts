import { step, logError } from '../util/output'
import { appendToFile, getFromFile, replaceInFile } from '../util/file'
import { env } from '../util/env'

const bumpBase32 = (numberString: string) => {
  const base = 32
  const number = parseInt(numberString, base)
  const incNumber = number + 1
  return incNumber.toString(base).toUpperCase()
}

export const validateBase32Version = step(
  'Validate Base 32 version',
  async () => {
    const content = await getFromFile(
      'release/BASE_32_VERSION_MAPPING.md',
      /\|\s([A-Z]{2})\s+\|\s?(.+?)\|(\s.*?)\|/g
    )

    if (!content) {
      logError('Could not read the BASE_32_VERSION_MAPPING.md file')
      return
    }

    const baseList = content.map((i) => {
      const result = i.match(/\|\s([A-Z]{2})\s+\|\s?(.+?)\|(\s.*?)\|/)

      if (!result) {
        return
      }

      return {
        hash: result[1].trim(),
        releaseVersion: result[2].trim(),
        date: result[3].trim(),
      }
    })

    console.log('baseList', JSON.stringify(baseList.map(i => i.hash)))
    const hashAlreadyExists = baseList?.find(
      (i) => i?.hash === env.BASE32_VERSION
    )

    // @TODO: get base release_version (with -rc etc) for good comparison
    const versionAlreadyExists = baseList?.find(
      (i) => i?.releaseVersion === env.RELEASE_VERSION
    )

    const lastBase32Version = baseList.slice(-1)[0]
    if (!lastBase32Version) {
      return
    }
    const bumpedBase32 = bumpBase32(lastBase32Version.hash)
    const isInvalidNextBase32Hash = bumpedBase32 !== env.BASE32_VERSION

    if (hashAlreadyExists) {
      logError(`The base32 version already exists (${env.BASE32_VERSION})`)
    }
    if (versionAlreadyExists) {
      logError(`The release version already exists (${env.RELEASE_VERSION})`)
    }
    if (isInvalidNextBase32Hash) {
      logError(
        `The provided base32 version is not the next one (provided=${env.BASE32_VERSION}, expected=${bumpedBase32})`
      )
    }
  }
)

export const updateFilesWithBase32Version = async () => {
  await updateWebpackConfig()
  await updateGithubWorkflowConfig()
  await updateMappingFile()
}

const updateWebpackConfig = step(
  '[base 32] - Update webpack.config.babel.js',
  async () => {
    await replaceInFile(
      'webpack.config.babel.js',
      /BASE_32_VERSION\s*: '([A-Z]+)'/,
      `BASE_32_VERSION: '${env.BASE32_VERSION}'`
    )
  }
)

const updateGithubWorkflowConfig = step(
  '[base 32] - Update release/githubActions/workflows.config',
  async () => {
    await replaceInFile(
      'release/githubActions/workflows.config',
      /BASE_32_VERSION\s*=([A-Z]+)/,
      `BASE_32_VERSION=${env.BASE32_VERSION}`
    )
  }
)

const updateMappingFile = step(
  '[base 32] - Add to BASE_32_VERSION_MAPPING',
  async () => {
    const [year, month, day] = new Date().toLocaleDateString().split('/')
    const date = [year, month, day].join('-')

    await appendToFile(
      'release/BASE_32_VERSION_MAPPING.md',
      `| ${env.BASE32_VERSION}              | ${env.RELEASE_VERSION}           | ${date} |                                                                                                                                                                                                                      |`
    )
  }
)
