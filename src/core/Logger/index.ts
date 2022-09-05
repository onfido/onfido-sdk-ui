// @ts-nocheck
import {
  Logger,
  ConsoleService,
  NetworkService,
  EnviromentType,
} from '~modules/Logger'
import { performHttpRequest } from '~core/Network'

const environment = process.env.NODE_ENV as EnviromentType

const onfidoSDKLogger = new Logger({
  // TODO: allow global config?
  services: {
    console: new ConsoleService({
      environment,
    }),
    network: new NetworkService({
      environment,
      performHttpRequest,

      // SDK config service
      getConfiguration: async () => {
        return {
          enabled: true,
          labels: [],
          levels: [],
        }
      },

      // enabled: true,
      // labels: ['default', 'test'],
      // levels: ['error', 'fatal'],
    }),
  },
})

export const logger = onfidoSDKLogger.createInstance('default')
export default onfidoSDKLogger

// setInterval(() => {
//   logger.error('test error log')
// }, 500)
