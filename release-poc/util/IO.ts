import * as readline from 'readline'
import { env, setEnv } from './env'

export const collectInputByTerminal = async () => {
  console.log(
    [
      '-------------------------------',
      "    Let's make release 🤖     ",
      '-------------------------------',
    ].join('\n')
  )

  const RELEASE_VERSION =
    env.RELEASE_VERSION || (await question('Release version:'))
  const BASE32_VERSION = env.BASE32_VERSION || (await question('BASE 32:'))
  const IS_LTS =
    process.env['IS_LTS'] ?? (await question('LTS release? (y/n):'))

  setEnv({
    RELEASE_VERSION,
    BASE32_VERSION,
    IS_LTS: IS_LTS === 'y',
  })
}

const question = (question: string) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(`${question} `, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
