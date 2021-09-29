import { v4 as uuidv4 } from 'uuid'
import { sendAnalytics } from '~utils/onfidoApi'
import { parseJwt } from '~utils/jwt'
import detectSystem from '~utils/detectSystem'
import type { NormalisedSdkOptions } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { RootState } from '~types/redux'
import { reduxStore } from 'components/ReduxAppWrapper'

let analyticsSessionUuid: string | undefined
let options: NormalisedSdkOptions
let token: string | undefined

const osInfo = detectSystem('os')
const browserInfo = detectSystem('browser')
const os_name = osInfo.name
const os_version = osInfo.version
const browser_name = browserInfo.name
const browser_version = browserInfo.version

const select = (state: RootState) => {
  return state.globals.analyticsSessionUuid
}

const listener = () => {
  analyticsSessionUuid = select(reduxStore.getState())
}

reduxStore.subscribe(listener)

/* 
Schema

{
  "applicant_uuid": string,
  "client_uuid": string,
  "event": string, // required
  "event_metadata": {
      // Example fields
      "domain": string,
      "os_name": string,
      "os_version": string,
      "browser_name": string,
      "browser_version": string,
  }
  "event_time": string, // required
  "event_uuid": string, // required
  "properties": {
      "event_type": string,
      "step": string,
      // Example fields
      "is_cross_device": boolean,
      "is_custom_ui": boolean,
      "status": string,
  }
  "session_uuid": string,
  "source": string, // required,
  "source_metadata": {
      "platform": string,
      "version": string,
  }
  "sdk_config": {
      // Example fields
      "expected_steps": string,
      "steps_config": [],
  }
}
*/

const source_metadata = {
  platform: 'onfido_web_sdk',
  version: process.env.SDK_VERSION,
}

const stepsArrToString = (steps: Array<StepConfig>) =>
  steps
    ? steps
        .map((step) => step['type'])
        .join()
        .toLowerCase()
    : ''

export const initializeOnfidoTracker = (
  sdkOptions: NormalisedSdkOptions
): void => {
  token = sdkOptions.token
  options = sdkOptions
}

export const sendAnalyticsEvent = (
  event: string,
  event_type: string,
  eventProperties: Optional<Record<string, unknown>>
): void => {
  const jwtData = parseJwt(token)

  const {
    payload: { client_uuid, app: applicant_uuid },
  } = jwtData

  const requiredFields = {
    event_uuid: uuidv4(),
    event,
    event_time: new Date(Date.now()).toISOString(),
    source: 'sdk',
  }

  const properties = {
    event_type,
    ...eventProperties,
  }

  const event_metadata = {
    domain: location.href,
    os_name,
    os_version,
    browser_name,
    browser_version,
  }
  const identificationProperties = {
    applicant_uuid,
    client_uuid,
    session_uuid: analyticsSessionUuid,
  }

  const sdk_config = {
    expected_steps: stepsArrToString(options?.steps),
    steps_config: options?.steps,
  }

  const payload = JSON.stringify({
    ...requiredFields,
    ...identificationProperties,
    event_metadata,
    source_metadata,
    properties,
    sdk_config,
  })

  const url = jwtData.urls.onfido_api_url

  sendAnalytics(url, payload)
}
