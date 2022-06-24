// @ts-nocheck
import { Network } from './network'

import Analytics from './AnalyticsCore/analytics'
import Logger from '../../modules/AnalyticsCore/logger'
import Performance from '../../modules/AnalyticsCore/performance'

import InHouse from '../../modules/AnalyticsCore/services/inhouse'
import Woopra from '../../modules/AnalyticsCore/services/woopra'

import ApiAnalytics from '../../modules/AnalyticsCore/apiAnalytics'

const network = new Network()

// Reversed usage: capture events from network -> send to services -> send to network
const apiAnalytics = new ApiAnalytics({
  services: {
    inhouse: [inhouseService],
  },
  network,
})

const inhouseService = new InHouse({
  network,
})

const woopraService = new Woopra({
  network,
})

// Exposes api for developers to use
// Note: Needs addiontial React interface
const analyticsInterface = new Analytics({
  services: {
    inhouse: [inhouseService],
    woopra: [woopraService],
  },
  options: {
    network: { batch: true },
    mapEvent: ({ eventName, properties }) => {
      return {
        inhouse: { eventName, properties },
        woopra: { eventName, properties },
      }
    },
  },
})

const logger = new Logger({
  services: {
    inhouse: [inhouseService],
  },
  options: {
    // Custom opt-in for batching network requests
    network: { batch: (level) => level !== 'fatal' },
  },
})

const performanceInterface = new Performance({
  services: {
    inhouse: [inhouseService],
  },
})

// const analyticsCore = new AnalyticsCore({
//   interfaces: [analyticsInterface, loggerInterface, performanceInterface],
//   services: [inhouseService, woopraService],
//   network,
// })
