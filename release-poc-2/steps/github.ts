import { step } from '../util/output'

// @TODO: finish
export const makePullRequest = step('Make pull request', async () => {
  const Octokit = require('@octokit/rest')
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })
  console.log('token', Octokit, process.env.GITHUB_TOKEN)

  // octokit.rest.pulls.create({
  //   owner: 'onfido',
  //   repo: 'onfido-sdk-ui',
  //   head: env.RELEASE_BRANCH_NAME,
  //   base: 'master',
  // })
})
