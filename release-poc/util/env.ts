import { writeToFile } from './file'

const { RELEASE_VERSION, BASE32_VERSION, IS_LTS, IS_CI } = process.env

type envT = {
  RELEASE_VERSION: string
  BASE32_VERSION: string
  IS_LTS: boolean
  IS_CI: boolean
  RELEASE_BRANCH_NAME: string
}

// @TODO: replace "poc-release" with "release" when workflow completed
const branchPrefix = 'poc-release'

export let env: envT = {
  RELEASE_VERSION: RELEASE_VERSION as string,
  BASE32_VERSION: BASE32_VERSION as string,
  IS_LTS: IS_LTS === 'true',
  IS_CI: IS_CI === 'true' || false,
  RELEASE_BRANCH_NAME: `${branchPrefix}/${RELEASE_VERSION}`,
}

export const setEnv = (vars: Record<string, unknown>) => {
  env = {
    ...env,
    ...vars,
  }
  env.RELEASE_BRANCH_NAME = `${branchPrefix}/${env.RELEASE_VERSION}`
}

export const writePoCFile = async () => {
  writeToFile(
    `release-poc/PoC-input.txt`,
    [
      `Release version: ${env.RELEASE_VERSION}`,
      `Base 32: ${env.BASE32_VERSION}`,
      `is LTS?: ${env.IS_LTS}`,
    ].join('\n')
  )
}
