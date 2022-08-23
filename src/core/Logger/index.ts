import { Logger, ConsoleService, EnviromentType } from '~modules/Logger'

const onfidoSDKLogger = new Logger({
  services: {
    console: new ConsoleService({
      environment: process.env.NODE_ENV as EnviromentType,
    }),
  },
})

export const logger = onfidoSDKLogger.createInstance('default')
export default onfidoSDKLogger

// TODO: remove, only used for acceptance
window.logger = logger
window.customLevelLogger = onfidoSDKLogger.createInstance('Custom level')

logger.info('Info log')
logger.debug('debug log')
logger.warning('warning log')
logger.error('error log')
logger.fatal('fatal log')

customLevelLogger.info('Info log')
customLevelLogger.debug('debug log')
customLevelLogger.warning('warning log')
customLevelLogger.error('error log')
customLevelLogger.fatal('fatal log')
