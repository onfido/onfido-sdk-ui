const { execute } = require('./util/terminal')
const { RELEASE_BRANCH_NAME } = process.env

const checkoutAndPull = async () => {
  await execute('git fetch origin')

  const { stdout: currentBranchOut } = await execute(
    `git symbolic-ref --short HEAD`
  )

  const { stdout: remoteBranchExistsOut } = await execute(
    `git branch --all --list ${RELEASE_BRANCH_NAME}`
  )

  console.log('current out=', currentBranchOut)
  console.log('remote out=', remoteBranchExistsOut)

  const onLocalReleaseBranch = !!currentBranchOut.match(RELEASE_BRANCH_NAME)
  const remoteBranchExists = !!remoteBranchExistsOut.match(
    `remotes/origin/${RELEASE_BRANCH_NAME}`
  )

  console.log({ onLocalReleaseBranch, remoteBranchExists })

  // if (!onLocalReleaseBranch) {
  //   await execute(
  //     `git checkout ${branchExistLocal ? '' : '-b'} ${RELEASE_BRANCH_NAME}`
  //   )
  // }

  // if (branchExistRemote) {
  //   // @TODO: Test
  //   await execute(`git pull origin HEAD`)
  // }
}

;(async () => {
  await checkoutAndPull()
})()
