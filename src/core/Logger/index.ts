// @ts-nocheck
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
const customLevelLogger = onfidoSDKLogger.createInstance('Custom level')

window.logger = logger
window.customLevelLogger = customLevelLogger

const metadata = { meta: 'data', is: 'working' }

logger.info('Info log', metadata)
logger.debug('debug log', metadata)
logger.warning('warning log', metadata)
logger.error('error log', metadata)
logger.fatal('fatal log', metadata)

customLevelLogger.info('Info log', metadata)
customLevelLogger.debug('debug log', metadata)
customLevelLogger.warning('warning log', metadata)
customLevelLogger.error('error log', metadata)
customLevelLogger.fatal('fatal log', metadata)
