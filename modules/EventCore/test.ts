// @ts-nocheck
import { Network } from '../Network'

import { ApiAnalytics } from './apis/ApiAnalytics'
import { UserAnalytics } from './apis/UserAnalytics'
// import { ApiAnalytics } from './apis/ApiAnalytics'
// import { Logger } from './apis/Logger'

import { InhouseService } from './services/InhouseService'
import { WoopraService } from './services/WoopraService'
import { ConsoleService } from './services/ConsoleService'
import { IntegratorAnalyticsService } from './services/IntegratorAnalyticsService'
import { IntegratorErrorService } from './services/IntegratorErrorService'

import { SdkConfigurationService } from '../SdkConfigurationService'

// Base
const network = new Network({})
const configuration = new SdkConfigurationService()

// Services
const consoleService = new ConsoleService({ configuration })
const inhouseService = new InhouseService({ outputs: [network], configuration })
const woopraService = new WoopraService({ outputs: [network], configuration })
const integratorAnalyticsService = new IntegratorAnalyticsService({
  outputs: [],
})
const integratorErrorService = new IntegratorErrorService({ outputs: [] })

// Internal Apis
const apiAnalytics = new ApiAnalytics({
  services: {
    inhouse: [inhouseService],
  },
})

network.setMiddleware([apiAnalytics])

const userAnalytics = new UserAnalytics({
  services: {
    inhouse: [inhouseService],
    woopra: [woopraService],
    console: [consoleService],
    integratorAnalytics: [integratorAnalyticsService],
    integratorError: [integratorErrorService],
  },
})
userAnalytics.send({ message: 'hi' })

// More internal apis
// const performanceAnalytics = new PerformanceAnalytics({
//   services: {
//     inhouse: [inhouseService]
//   }
// })

// const apiAnalytics = new ApiAnalytics({
//   services: {
//     inhouse: [inhouseService]
//   }
// })

// const logger = new Logger({
//   services: {
//     inhouse: [inhouse],
//     console: [console],
//   }
// })
