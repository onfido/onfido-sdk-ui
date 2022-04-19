const { execute } = require('./util/terminal')
const { RELEASE_BRANCH_NAME } = process.env

const checkoutReleaseBranch = async () => {
  await execute('git fetch origin')

  const { stdout: currentBranchOut } = await execute(
    `git symbolic-ref --short HEAD`
  )

  const { stdout: remoteBranchExistsOut } = await execute(
    `git branch --all --list ${RELEASE_BRANCH_NAME}`
  )

  const onReleaseBranch = !!currentBranchOut.match(RELEASE_BRANCH_NAME)
  const remoteBranchExists = !!remoteBranchExistsOut.match(RELEASE_BRANCH_NAME)

  console.log({ onReleaseBranch, remoteBranchExists })

  if (onReleaseBranch) {
    return
  }

  await execute(
    `git checkout ${remoteBranchExists ? '' : '-b'} ${RELEASE_BRANCH_NAME}`
  )
}

;(async () => {
  await checkoutReleaseBranch()
})()
