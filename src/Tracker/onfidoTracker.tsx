import { sendAnalytics } from '~utils/onfidoApi'
import type { ExtendedStepTypes, UrlsConfig } from '~types/commons'
import type { LegacyTrackedEventNames } from '~types/tracker'
import { reduxStore } from 'components/ReduxAppWrapper'
import { analyticsEventsMapping } from './trackerData'
import { trackException } from './'
import * as execeptionTracking from '~core/ExceptionHandler'
import { createAnalyticsPayload } from '~core/Analytics/createAnalyticsPayload'

let currentStepType: ExtendedStepTypes | undefined
let analyticsSessionUuid: string | undefined
let token: string | undefined
let urls: UrlsConfig
let isCrossDeviceClient: boolean | undefined

const listener = () => {
  const store = reduxStore.getState()
  token = store.globals.token
  currentStepType = store.globals.currentStepType
  urls = store.globals.urls
  isCrossDeviceClient = store.globals.isCrossDeviceClient
  analyticsSessionUuid = store.globals.analyticsSessionUuid
}

reduxStore.subscribe(listener)

export const sendAnalyticsEvent = (
  event: LegacyTrackedEventNames,
  eventProperties: Optional<Record<string, unknown>>
): void => {
  // Do not send requests without analyticsSessionUuid
  // We need at least one identification property to identify the flow
  if (!analyticsSessionUuid) {
    trackException('No analytics session uuid while sending analytics event')
    return
  }

  const eventData = analyticsEventsMapping.get(event)

  if (!eventData?.eventName) {
    const msg = `Legacy event is not mapped - ${event}`
    console.error(msg)
    trackException(msg)
    return
  }

  const properties = {
    step: currentStepType,
    is_cross_device: isCrossDeviceClient,
    ...eventProperties,
    ...eventData?.properties,
  }

  const analyticsPayload = createAnalyticsPayload({
    event: eventData.eventName,
    properties,
  })

  // TODO: Convert analytics to include an eventemitter
  execeptionTracking.addBreadcrumb({
    message: `Analytics event: ${eventData?.eventName}`,
    data: properties,
  })

  const payload = JSON.stringify({ events: [analyticsPayload] })
  const url = urls.onfido_api_url

  sendAnalytics(url, payload, token!)
}
