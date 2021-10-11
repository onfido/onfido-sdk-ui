import type { DeviceTypes } from './commons'
import type { StepConfig } from './steps'

export const USER_ANALYTICS_EVENT = 'userAnalyticsEvent'

type MappedEventNames =
  | 'screen_welcome'
  | 'screen_userConsent'
  | 'screen_document_front_capture_file_upload'
  | 'screen_document_front_confirmation'
  | 'screen_document_back_capture_file_upload'
  | 'screen_document_back_confirmation'
  | 'screen_face_selfie_intro'
  | 'screen_face_selfie_capture'
  | 'screen_face_selfie_confirmation'
  | 'screen_face_video_intro'
  | 'screen_face_video_capture_step_1'
  | 'screen_face_video_capture_step_2'
  | 'screen_document_type_select'
  | 'screen_document_country_select'
  | 'screen_crossDevice'
  | 'screen_crossDevice_crossdevice_link'
  | 'Starting upload'

export type TrackedEventNames =
  | MappedEventNames
  | 'started flow'
  | 'Completed upload'
  | 'Snapshot upload completed'
  | 'Starting live photo upload'
  | 'Starting snapshot upload'
  | 'Taking live photo of document'
  | 'completed flow'

export type UserAnalyticsEventNames =
  | 'WELCOME'
  | 'USER_CONSENT'
  | 'DOCUMENT_CAPTURE_FRONT'
  | 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT'
  | 'DOCUMENT_CAPTURE_BACK'
  | 'DOCUMENT_CAPTURE_CONFIRMATION_BACK'
  | 'FACIAL_INTRO'
  | 'FACIAL_CAPTURE'
  | 'FACIAL_CAPTURE_CONFIRMATION'
  | 'VIDEO_FACIAL_INTRO'
  | 'VIDEO_FACIAL_CAPTURE_STEP_1'
  | 'VIDEO_FACIAL_CAPTURE_STEP_2'
  | 'DOCUMENT_TYPE_SELECT'
  | 'ID_DOCUMENT_COUNTRY_SELECT'
  | 'CROSS_DEVICE_INTRO'
  | 'CROSS_DEVICE_GET_LINK'
  | 'UPLOAD'

export type UserAnalyticsEventDetail = {
  eventName: UserAnalyticsEventNames
  isCrossDevice: boolean
  properties: Record<string, unknown>
}

export type TrackedEventTypes = 'screen' | 'action' | 'flow'

export type TrackedEnvironmentData = {
  device?: DeviceTypes
  os: string
  os_version: string
  browser: string
  browser_version: string
}

export type AnalyticsPayload = {
  applicant_uuid?: string
  client_uuid?: string
  event: TrackedEventNames
  event_metadata: {
    domain: string
  } & TrackedEnvironmentData
  event_time: string
  event_uuid: string
  properties: {
    event_type: string
    step?: string
    is_cross_device?: boolean
    is_custom_ui?: boolean
    status?: string
  }
  session_uuid?: string
  source: string
  source_metadata: {
    platform?: string
    version?: string
    sdk_environment?: string
  }
  sdk_config: {
    expected_steps: string
    steps_config?: StepConfig[]
    sdk_token?: string
  }
}
