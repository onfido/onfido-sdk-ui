/*

  Note: File is under construction, all parts will be moved into their
  own module (analytics, exceptionHandler, intergrationEvents)

  Most things are placeholder to keep internal api until we fully refactor

*/
import { map as mapObject } from '~utils/object'
import * as execeptionTracking from '~core/ExceptionHandler'
import * as Woopra from '~core/Woopra'
import * as Analytics from '~core/Analytics'
import { sendAnalyticsEvent } from '../core/Analytics/sendAnalyticsEvent'
import { integratorTrackedEvents } from '../core/Analytics/trackerData'
import type { EventHint } from '~core/ExceptionHandler'
import type {
  LegacyTrackedEventNames,
  UserAnalyticsEventNames,
  UserAnalyticsEventDetail,
} from '~types/tracker'

let shouldSendEvents = false

const setUp = () => {
  Woopra.install()
  shouldSendEvents = true
}

const uninstall = (): void => {
  execeptionTracking.uninstall()
  uninstallWoopra()
}

const uninstallWoopra = (): void => {
  Woopra.uninstall()
  shouldSendEvents = false
}

const install = (): void => {
  execeptionTracking.install()
  shouldSendEvents = true
}

const userAnalyticsEvent = (
  eventName: UserAnalyticsEventNames | undefined,
  properties: Record<string, unknown> = {}
): void => {
  if (!eventName) {
    return
  }

  dispatchEvent(
    new CustomEvent<UserAnalyticsEventDetail>('userAnalyticsEvent', {
      detail: { eventName, properties, isCrossDevice: false },
    })
  )
}

const formatProperties = (
  properties?: Record<string, unknown>
): Optional<Record<string, unknown>> => {
  if (!properties) {
    return null
  }

  return mapObject(properties, (value) =>
    typeof value === 'object' ? JSON.stringify(value) : value
  )
}

const sendEvent = (
  eventName: LegacyTrackedEventNames,
  properties?: Record<string, unknown>
): void => {
  if (integratorTrackedEvents.has(eventName)) {
    userAnalyticsEvent(integratorTrackedEvents.get(eventName), properties)
  }

  if (shouldSendEvents) {
    const formattedProperties = formatProperties(properties)
    Woopra.track(eventName, formattedProperties)
    sendAnalyticsEvent(eventName, formattedProperties)
  }
}

const trackException = (message: string, extra?: EventHint): void => {
  execeptionTracking?.captureException(
    new Error(message),
    extra as Record<string, unknown>
  )
}

const setWoopraCookie = Woopra.setCookie
const getWoopraCookie = Woopra.getCookie
const setupAnalyticsCookie = Analytics.setupAnalyticsCookie
const uninstallAnalyticsCookie = Analytics.uninstallAnalyticsCookie
const getAnalyticsCookie = Analytics.getAnalyticsCookie
const sendScreen = Analytics.sendScreen
const trackComponent = Analytics.trackComponent
const appendToTracking = Analytics.appendToTracking

export {
  // ExceptionHandler
  install,
  uninstall,
  trackException,
  // Analytics
  sendEvent,
  sendScreen,
  trackComponent,
  appendToTracking,
  setupAnalyticsCookie,
  uninstallAnalyticsCookie,
  getAnalyticsCookie,
  // Woopra
  setWoopraCookie,
  getWoopraCookie,
  uninstallWoopra,
  setUp,
}
