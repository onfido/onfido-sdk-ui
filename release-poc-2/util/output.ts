import chalk from 'chalk'

export const logErrorNow = (errorMessage: string, error?: any) => {
  console.log(chalk.bold.red(`[Error] - ${errorMessage}`), error)
  exit()
}

const errors: unknown[] = []
export const logError = (errorMessage: string, error?: any) => {
  errors.push([chalk.bold.red(`[Error] - ${errorMessage}`), error])
}

export const logErrorAndExit = (errorMessage: string, error?: any) => {
  logError(errorMessage, error)
  exit()
}

export const exit = () => {
  process.exit(1)
}

export const step = (title: string, fn: () => void) => (): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      await fn()
    } catch (e) {
      logError(`❌ - ${title}: An error occured`, e)
    }

    if (errors.length) {
      console.error(`❌ - ${title}`)
      errors.forEach((e) => console.error.apply(console, e))
      reject()
      exit()
    }

    console.log(`✅ - ${title}`)
    resolve()
  })

export const goodbye = () => {
  console.log(
    [
      '-------------------------------',
      '    The release is ready 🤖    ',
      '-------------------------------',
    ].join('\n')
  )
}
