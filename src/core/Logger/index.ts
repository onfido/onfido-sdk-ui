import { Logger, ConsoleService } from '~modules/Logger'

const onfidoSDKLogger = new Logger({
  services: {
    console: new ConsoleService(),
  },
})

export default onfidoSDKLogger
