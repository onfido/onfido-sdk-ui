import { env } from '../util/env'
import { step } from '../util/output'
import { execute } from '../util/processes'

export const checkoutAndPull = step('[git] Checkout & pull', async () => {
  await execute('git fetch origin')

  const { stdout: currentBranchOut } = await execute(
    `git symbolic-ref --short HEAD`
  )

  const { stdout: branchExistLocalOut } = await execute(
    `git branch --all --list ${env.RELEASE_BRANCH_NAME}`
  )
  const { stdout: branchExistRemoteOut } = await execute(
    `git branch --all --list ${env.RELEASE_BRANCH_NAME}`
  )

  const onLocalReleaseBranch = !!currentBranchOut.match(env.RELEASE_BRANCH_NAME)
  const branchExistLocal = !!branchExistLocalOut.match(env.RELEASE_BRANCH_NAME)
  const branchExistRemote = !!branchExistRemoteOut.match(
    `remotes/origin/${env.RELEASE_BRANCH_NAME}`
  )

  if (!onLocalReleaseBranch) {
    await execute(
      `git checkout ${branchExistLocal ? '' : '-b'} ${env.RELEASE_BRANCH_NAME}`
    )
  }

  if (branchExistRemote) {
    // @TODO: Test
    await execute(`git pull origin HEAD`)
  }
})

export const makeReleaseCommit = step('[git] Make release commit', async () => {
  const commitMessage = `Bump version to ${env.RELEASE_VERSION}`

  await execute('git add .')
  await execute(`git commit -m "${commitMessage}"`)
})

export const pushChangesToRemote = step(
  '[git] Push changes to remote',
  async () => {
    // @TODO: test in safe environment
    // await execute('git push origin head')
  }
)

export const publishGitTag = step(
  `[git] Creating tag ${env.RELEASE_VERSION}`,
  async () => {
    // @TODO: test in safe environment
    // await execute(
    //   `git tag ${env.RELEASE_VERSION} -m "Release ${env.RELEASE_VERSION}"`
    // )
  }
)

export const revertAllFiles = step(
  '[git] Revert all file changes',
  async () => {
    await execute('git reset .')
    await execute(
      'git checkout CHANGELOG.md demo/fiddle/demo.details release/BASE_32_VERSION_MAPPING.md release/githubActions/workflows.config webpack.config.babel.js'
    )
  }
)