import { v4 as uuidv4 } from 'uuid'
import { reduxStore } from 'components/ReduxAppWrapper'

import { cleanStepsForConfig } from 'Tracker/steps'
import { StepConfig } from '~types/steps'
import { trackedEnvironmentData } from '~utils'

let analyticsSessionUuid: string | undefined
let steps: StepConfig[]
let client_uuid: string | undefined
let applicant_uuid: string | undefined
let anonymous_uuid: string | undefined

const listener = () => {
  const store = reduxStore.getState()
  analyticsSessionUuid = store.globals.analyticsSessionUuid
  client_uuid = store.globals.clientUuid
  applicant_uuid = store.globals.applicantUuid
  anonymous_uuid = store.globals.anonymousUuid
  steps = cleanStepsForConfig(store.globals.stepsConfig)
}

reduxStore.subscribe(listener)

const environmentData = trackedEnvironmentData()

type AnalyticsProperties = {
  country_code?: string
  document_format?: string
  document_side?: string
  event_type?: string
  is_autocapture?: string
  step?: string
}

type LoggerProperties = {
  log_labels: string[]
  log_level: string
  log_metadata: Record<string, unknown>
}

type PerformanceAnalyticsProperties = {
  capture_type: string
  country_code?: string
  delay: number
  destination_screen: string
  document_type: string
  source_screen: string
}

type AnalyticsPayloadProps = {
  event: string
  event_time?: string
  properties:
    | AnalyticsProperties
    | LoggerProperties
    | PerformanceAnalyticsProperties
}

type AnalyticsPayload = {
  event: string
  event_uuid: string
  event_time: string

  source: 'sdk'

  applicant_uuid: string
  anonymous_uuid: string
  client_uuid: string
  session_uuid: string

  event_metadata: {
    domain: string
    os: string
    os_version: string
    browser: string
    browser_version: string
    device: 'desktop' | 'mobile'
  }

  sdk_config: {
    expected_steps: string
    steps_config: StepConfig
  }

  source_metadata: {
    platform: string
    version: string
    sdk_environment: string
  }

  properties:
    | AnalyticsProperties
    | LoggerProperties
    | PerformanceAnalyticsProperties
}

export const generatePayloadTimestamp = () => new Date(Date.now()).toISOString()

export const createAnalyticsPayload = (
  props: AnalyticsPayloadProps
): AnalyticsPayload => {
  console.log('createAnalyticsPayload', {
    applicant_uuid,
    anonymous_uuid,
    client_uuid,
    analyticsSessionUuid,
  })
  return {
    event: props.event,
    event_uuid: uuidv4(),
    event_time: props.event_time || generatePayloadTimestamp(),

    source: 'sdk',

    applicant_uuid,
    anonymous_uuid,
    client_uuid,
    session_uuid: analyticsSessionUuid,

    event_metadata: {
      domain: location.href,
      // os, os_version, browser, browser_version, device
      ...environmentData,
    },

    sdk_config: {
      expected_steps: steps?.map((step) => step['type']).join(),
      steps_config: steps,
    },

    source_metadata: {
      platform: process.env.SDK_SOURCE,
      version: process.env.SDK_VERSION,
      sdk_environment: process.env.NODE_ENV,
    },

    properties: props.properties || {},
  }
}
