// @ts-nocheck
import { Network } from './network'
import {
  InhouseService,
  Analytics,
  WoopraService,
  ReactAnalytics,
} from './AnalyticsCore/analytics'

// const log = {}
// const ApiAnalytics = (networkEvent) => {
//   if (!log[networkEvent.url]) {
//     log[networkEvent.url] = 0
//   }

//   log[networkEvent.url]++
//   return networkEvent
// }

// setInterval(() => {
//   console.log('[Logs]', log)
// }, 1000)

const network = new Network({
  pipes: [
    /* ApiAnalytics */
  ],
})

const inhouseService = new InhouseService({
  network,
})

const woopraService = new WoopraService({
  network,
})

const analytics = new Analytics({
  services: {
    inhouse: [inhouseService], // chainable
    woopra: [woopraService],
  },
})

analytics.sendEvent('Hello?', { some: 'properties' })

const reactAnalytics = new ReactAnalytics(analytics)
reactAnalytics.appendToTracking('Component', 'some name')
