import { Logger, ConsoleService, EnviromentType } from '~modules/Logger'

const onfidoSDKLogger = new Logger({
  services: {
    console: new ConsoleService({
      environment: process.env.NODE_ENV as EnviromentType,
    }),
  },
})

export const defaultLogger = onfidoSDKLogger.createInstance('default')
export default onfidoSDKLogger
