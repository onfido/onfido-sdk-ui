// TODO: remove logs in production builds if not error/fatal
// TODO: check workings of injection
export * from './types'

import { OutputInterface } from './types'
import { Logger } from './Logger'

// Outputs
import { ConsoleOutput } from './outputs/ConsoleOutput'
import { NetworkOutput } from './outputs/NetworkOutput'

// Enable re-use by exporting them
export const consoleOutput = new ConsoleOutput({
  // TODO: Add to documentation, only for non production environment
  // filters: [
  //   // * allows any labels (and any number of labels) before the next label
  //   // { label: 'network.*', levels: ['info'] },
  //   // { levels: ['info'] },
  // ],
})

export const networkOutput = new NetworkOutput()

const defaultOutputs: OutputInterface[] = [consoleOutput, networkOutput]

export class DefaultLogger extends Logger {
  constructor() {
    super({
      outputs: defaultOutputs,
      labels: ['network', 'layer'],
    })
  }
}

export const logger = new DefaultLogger()
export const testLogger = new Logger({ outputs: defaultOutputs })

logger.info('test')

testLogger.info('hello')
