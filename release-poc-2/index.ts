import { env, writePoCFile } from './util/env'
import { collectInputByTerminal } from './util/IO'
import { goodbye } from './util/output'

import updateFilesWithVersion from './steps/updateFiles'
import { makePullRequest } from './steps/github'
import { npmInstallAndBuild } from './steps/build'
import { checkWorkspaceIsClean, validateInput } from './steps/workspace'
import {
  validateBase32Version,
  updateFilesWithBase32Version,
} from './steps/base32'
import {
  checkoutAndPull,
  makeReleaseCommit,
  pushChangesToRemote,
} from './steps/git'

const main = async () => {
  // !env.IS_CI && (await checkWorkspaceIsClean())
  // !env.IS_CI && (await collectInputByTerminal())
  // await validateInput()
  // await writePoCFile()

  await validateBase32Version() // @TODO: validate against AWS

  // await checkoutAndPull()
  // await updateFilesWithVersion()
  // await updateFilesWithBase32Version()
  // await npmInstallAndBuild()
  // await makeReleaseCommit()
  // await pushChangesToRemote()
  // env.IS_CI && (await makePullRequest())

  // goodbye()
  // await publishGitTag()

  // await revertAllFiles()
  // Wish list:
  // await validateS3Uploads()
  // await validateNPM()
  // await validateReleaseGithub()
  // auto upgrade demo app repo with new version (and push to github)
  // automate base32 version bump
  // automate rc bump (instead of entering it in the version)
}

main()
