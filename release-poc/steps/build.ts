import { env } from '../util/env'
import { step } from '../util/output'
import { spawnShell } from '../util/processes'

export const npmInstallAndBuild = step(
  'Install packages and build',
  async () => {
    if (!env.IS_CI) {
      console.log(
        [
          '-------------------------------',
          '          Npm Install          ',
          '-------------------------------',
        ].join('\n')
      )
      await spawnShell('npm install')
    }

    console.log(
      [
        '-------------------------------',
        '       Npm run build:all       ',
        '-------------------------------',
      ].join('n')
    )
    await spawnShell('npm run build:all')
  }
)