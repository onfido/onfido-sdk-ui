export * from './types'

import { Logger } from './Logger'
import { ConsoleService } from './services/ConsoleService'
import { EnviromentType } from './types'

const onfidoSDKLogger = new Logger({
  services: {
    console: new ConsoleService({
      environment: process.env.NODE_ENV as EnviromentType,
    }),
  },
})

export const logger = onfidoSDKLogger.createInstance('default')
export default onfidoSDKLogger
