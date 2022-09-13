import { v4 as uuidv4 } from 'uuid'
import { sendAnalytics } from '~utils/onfidoApi'
import { trackedEnvironmentData } from '~utils'
import type { ExtendedStepTypes, UrlsConfig } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { RootState } from '~types/redux'
import type { AnalyticsPayload, LegacyTrackedEventNames } from '~types/tracker'
import { reduxStore } from 'components/ReduxAppWrapper'
import { analyticsEventsMapping } from './trackerData'
import { trackException } from './'
import { cleanStepsForConfig } from './steps'
import * as execeptionTracking from '~core/ExceptionHandler'

let currentStepType: ExtendedStepTypes | undefined
let analyticsSessionUuid: string | undefined
let steps: StepConfig[]
let token: string | undefined
let urls: UrlsConfig
let client_uuid: string | undefined
let applicant_uuid: string | undefined
let anonymous_uuid: string | undefined
let isCrossDeviceClient: boolean | undefined

const select = (state: RootState) => {
  return state.globals
}
// TODO: Convert `sendAnalyticsEvent` to react component so Context can be used
// instead of redux store
// this will allow us to remove multiple redux actions and reducers such as
// token
// isCrossDeviceClient
// applicantUuid
// clientUuid
// stepsConfig
const listener = () => {
  const globalsInStore = select(reduxStore.getState())
  token = globalsInStore.token
  analyticsSessionUuid = globalsInStore.analyticsSessionUuid
  currentStepType = globalsInStore.currentStepType
  urls = globalsInStore.urls
  client_uuid = globalsInStore.clientUuid
  applicant_uuid = globalsInStore.applicantUuid
  anonymous_uuid = globalsInStore.anonymousUuid
  isCrossDeviceClient = globalsInStore.isCrossDeviceClient
  steps = cleanStepsForConfig(globalsInStore.stepsConfig)
}

reduxStore.subscribe(listener)

const source_metadata = {
  platform: process.env.SDK_SOURCE,
  version: process.env.SDK_VERSION,
  sdk_environment: process.env.NODE_ENV,
}

const stepsArrToString = () => steps?.map((step) => step['type']).join()

export const sendAnalyticsEvent = (
  event: LegacyTrackedEventNames,
  eventProperties: Optional<Record<string, unknown>>
): void => {
  // Do not send requests without analyticsSessionUuid
  // We need at least one identification property to identify the flow
  if (!analyticsSessionUuid) return

  const environmentData = trackedEnvironmentData()
  const eventData = analyticsEventsMapping.get(event)

  if (!eventData?.eventName) {
    const msg = `Legacy event is not mapped - ${event}`
    console.error(msg)
    trackException(msg)
    return
  }
  console.log(event, eventData.eventName)
  const requiredFields = {
    event_uuid: uuidv4(),
    event: eventData.eventName,
    event_time: new Date(Date.now()).toISOString(),
    source: 'sdk',
  }

  const properties = {
    step: currentStepType,
    is_cross_device: isCrossDeviceClient,
    ...eventProperties,
    ...eventData?.properties,
  }

  const event_metadata = {
    domain: location.href,
    ...environmentData,
  }
  const identificationProperties = {
    applicant_uuid,
    anonymous_uuid,
    client_uuid,
    session_uuid: analyticsSessionUuid,
  }

  const sdk_config = {
    expected_steps: stepsArrToString(),
    steps_config: steps,
  }

  const analyticsPayload: AnalyticsPayload = {
    ...requiredFields,
    ...identificationProperties,
    event_metadata,
    source_metadata,
    properties,
    sdk_config,
  }

  // TODO: Convert analytics to include an eventemitter
  execeptionTracking.addBreadcrumb({
    message: `Analytics event: ${eventData?.eventName}`,
    data: properties,
  })

  const payload = JSON.stringify({ events: [analyticsPayload] })
  const url = urls.onfido_api_url

  sendAnalytics(url, payload, token!)
}
