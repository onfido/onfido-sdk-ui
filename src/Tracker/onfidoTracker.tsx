import { v4 as uuidv4 } from 'uuid'
import { sendAnalytics } from '~utils/onfidoApi'
import { parseJwt } from '~utils/jwt'
import { trackedEnvironmentData } from '~utils'
import type {
  NormalisedSdkOptions,
  ExtendedStepTypes,
  UrlsConfig,
} from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { RootState } from '~types/redux'
import type { AnalyticsPayload, TrackedEventNames } from '~types/tracker'
import { reduxStore } from 'components/ReduxAppWrapper'

let currentStepType: ExtendedStepTypes | undefined
let analyticsSessionUuid: string | undefined
let options: NormalisedSdkOptions
let token: string | undefined
let mobileFlow: boolean | undefined
let urls: UrlsConfig

const select = (state: RootState) => {
  return state.globals
}

const listener = () => {
  const globalsInStore = select(reduxStore.getState())
  analyticsSessionUuid = globalsInStore.analyticsSessionUuid
  currentStepType = globalsInStore.currentStepType
  urls = globalsInStore.urls
}

reduxStore.subscribe(listener)

const source_metadata = {
  platform: process.env.SDK_SOURCE,
  version: process.env.SDK_VERSION,
  sdk_environment: process.env.NODE_ENV,
}

const stepsArrToString = (steps: Array<StepConfig>) =>
  steps?.map((step) => step['type']).join()

export const initializeOnfidoTracker = (
  sdkOptions: NormalisedSdkOptions
): void => {
  token = sdkOptions.token
  options = sdkOptions
  mobileFlow = sdkOptions.mobileFlow
}

export const sendAnalyticsEvent = (
  event: TrackedEventNames,
  event_type: string,
  eventProperties: Optional<Record<string, unknown>>
): void => {
  // Do not send requests without analyticsSessionUuid
  // We need at least one identification property to identify the flow
  if (!analyticsSessionUuid) return

  const environmentData = trackedEnvironmentData()

  const jwtData = parseJwt(token)
  const jwtPayload = jwtData?.payload

  const { client_uuid, app: applicant_uuid } = jwtPayload

  const requiredFields = {
    event_uuid: uuidv4(),
    event,
    event_time: new Date(Date.now()).toISOString(),
    source: 'sdk',
  }

  const properties = {
    event_type,
    step: currentStepType,
    is_cross_device: mobileFlow,
    ...eventProperties,
  }

  const event_metadata = {
    domain: location.href,
    ...environmentData,
  }
  const identificationProperties = {
    applicant_uuid,
    client_uuid,
    session_uuid: analyticsSessionUuid,
  }

  const sdk_config = {
    expected_steps: stepsArrToString(options.steps),
    steps_config: options.steps,
    sdk_token: token,
  }

  const analyticsPayload: AnalyticsPayload = {
    ...requiredFields,
    ...identificationProperties,
    event_metadata,
    source_metadata,
    properties,
    sdk_config,
  }

  const payload = JSON.stringify(analyticsPayload)

  const url = urls.onfido_api_url

  sendAnalytics(url, payload)
}
