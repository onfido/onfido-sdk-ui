const { debug } = require('./util/logging')
const { execute } = require('./util/terminal')
const { RELEASE_BRANCH_NAME } = process.env

const checkoutReleaseBranch = async () => {
  await execute('git fetch origin')

  const { stdout: currentBranchOut } = await execute(
    `git symbolic-ref --short HEAD`
  )

  const { stdout: remoteBranchExistsOut } = await execute(
    `git branch --all --list origin/${RELEASE_BRANCH_NAME}`
  )

  const onReleaseBranch = !!currentBranchOut.match(RELEASE_BRANCH_NAME)
  const remoteBranchExists = !!remoteBranchExistsOut.match(RELEASE_BRANCH_NAME)

  if (onReleaseBranch) {
    debug(`We are already on the release branch: ${RELEASE_BRANCH_NAME}`)
    return
  }

  debug(`Checking out a new branch ${RELEASE_BRANCH_NAME}`)
  await execute(
    `git checkout ${remoteBranchExists ? '' : '-b'} ${RELEASE_BRANCH_NAME}`
  )

  if (remoteBranchExists) {
    await execute(`git pull origin ${RELEASE_BRANCH_NAME}`)
  } else {
    await execute(`git push origin ${RELEASE_BRANCH_NAME}`)
  }
}

;(async () => {
  await checkoutReleaseBranch()
})()
