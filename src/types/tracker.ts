import type { DeviceTypes } from './commons'
import type { StepConfig } from './steps'

export const USER_ANALYTICS_EVENT = 'userAnalyticsEvent'

export type LegacyTrackedEventNames =
  | 'screen_complete'
  | 'screen_complete_crossdevice_mobile_success'
  | 'screen_document_country_select'
  | 'screen_document_crossDevice_client_intro'
  | 'screen_face_crossDevice_client_intro'
  | 'screen_poa_crossDevice_client_intro'
  | 'screen_crossDevice_desktop_submit'
  | 'screen_crossDevice_crossdevice_link'
  | 'screen_crossDevice'
  | 'copy link selected'
  | 'qr code selected'
  | 'sms selected'
  | 'screen_crossDevice_mobile_notification_sent'
  | 'screen_crossDevice_mobile_connected'
  | 'screen_crossDevice_sms_failed'
  | 'Starting upload'
  | 'screen_document_back_capture_camera_error'
  | 'screen_document_front_capture_camera_error'
  | 'Taking live photo of document'
  | 'screen_document_back_capture_file_upload'
  | 'screen_document_back_capture'
  | 'screen_document_front_capture_file_upload'
  | 'screen_document_front_capture'
  | 'screen_document_back_confirmation'
  | 'screen_document_front_confirmation'
  | 'screen_document_fallback_clicked'
  | 'screen_document_image_quality_guide'
  | 'screen_document_type_select'
  | 'screen_document_document_video_capture_file_upload'
  | 'screen_document_document_video_capture'
  | 'screen_document_document_video_capture_fallback_triggered'
  | 'screen_face_selfie_intro'
  | 'screen_face_selfie_capture_camera_error'
  | 'screen_face_selfie_capture_file_upload'
  | 'screen_face_selfie_capture'
  | 'screen_face_selfie_confirmation'
  | 'screen_face_selfie_capture_fallback_triggered'
  | 'Snapshot upload completed'
  | 'Starting snapshot upload'
  | 'Starting live photo upload'
  | 'screen_face_face_video_capture_camera_error'
  | 'screen_face_face_video_capture_file_upload'
  | 'screen_face_face_video_capture'
  | 'screen_face_video_capture_step_1'
  | 'screen_face_video_capture_step_2'
  | 'screen_face_video_challenge_load_failed'
  | 'screen_face_video_challenge_loaded'
  | 'screen_face_video_challenge_requested'
  | 'screen_face_face_video_confirmation'
  | 'screen_face_face_video_capture_fallback_triggered'
  | 'screen_face_video_intro'
  | 'completed flow'
  | 'started flow'
  | 'screen_forbidden_client_error'
  | 'screen_generic_client_error'
  | 'screen_interrupted_flow_error'
  | 'screen_poa_poa_file_upload'
  | 'screen_poa_poa'
  | 'screen_poa_front_confirmation'
  | 'screen_poa_type_select'
  | 'screen_poa'
  | 'screen_unsupported_android_browser'
  | 'screen_unsupported_ios_browser'
  | 'Completed uploa'
  | 'screen_userConsent'
  | 'screen_welcome'

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

export type TrackedEventTypes = 'screen' | 'action' | 'flow' | 'view'

export type TrackedEnvironmentData = {
  device?: DeviceTypes
  os: string
  os_version: string
  browser: string
  browser_version: string
}

export type AnalyticsEventProperties = {
  event_type: TrackedEventTypes
  step?: string
  is_cross_device?: boolean
  is_custom_ui?: boolean
  status?: string
  capture_method_rendered?: 'upload' | 'camera'
  document_side?: 'front' | 'back'
  video_capture_step?: 'step1' | 'step2'
  link_method_selected?: 'copy' | 'qr_code' | 'sms'
}

export type AnalyticsPayload = {
  applicant_uuid?: string
  client_uuid?: string
  event: LegacyTrackedEventNames
  event_metadata: {
    domain: string
  } & TrackedEnvironmentData
  event_time: string
  event_uuid: string
  properties: AnalyticsEventProperties
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

export type AnalyticsTrackedEventNames =
  | 'COMPLETE'
  | 'COMPLETE_CROSS_DEVICE_MOBILE_SUCCESS'
  | 'COUNTRY_SELECTION'
  | 'CROSS_DEVICE_CLIENT_INTRO'
  | 'CROSS_DEVICE_CLIENT_INTRO'
  | 'CROSS_DEVICE_CLIENT_INTRO'
  | 'CROSS_DEVICE_DESKTOP_SUBMIT'
  | 'CROSS_DEVICE_GET_LINK'
  | 'CROSS_DEVICE_INTRO'
  | 'CROSS_DEVICE_LINK_METHOD_SELECTED'
  | 'CROSS_DEVICE_LINK_METHOD_SELECTED'
  | 'CROSS_DEVICE_LINK_METHOD_SELECTED'
  | 'CROSS_DEVICE_MOBILE_NOTIFICATION_SENT'
  | 'CROSS_DEVICE_MOBILE_SUBMIT'
  | 'CROSS_DEVICE_SMS_FAILED'
  | 'CUSTOM_API_REQUEST_STARTED'
  | 'DOCUMENT_CAMERA_ERROR'
  | 'DOCUMENT_CAMERA_ERROR'
  | 'DOCUMENT_CAMERA_SHUTTER_CLICK'
  | 'DOCUMENT_CAPTURE'
  | 'DOCUMENT_CAPTURE'
  | 'DOCUMENT_CAPTURE'
  | 'DOCUMENT_CAPTURE'
  | 'DOCUMENT_CONFIRMATION'
  | 'DOCUMENT_CONFIRMATION'
  | 'DOCUMENT_FALLBACK_CLICKED'
  | 'DOCUMENT_IMAGE_QUALITY_GUIDE'
  | 'DOCUMENT_TYPE_SELECTION'
  | 'DOCUMENT_VIDEO_CAPTURE'
  | 'DOCUMENT_VIDEO_CAPTURE'
  | 'DOCUMENT_VIDEO_FALLBACK_TRIGGERED'
  | 'FACE_INTRO'
  | 'FACE_SELFIE_CAMERA_ERROR'
  | 'FACE_SELFIE_CAPTURE'
  | 'FACE_SELFIE_CAPTURE'
  | 'FACE_SELFIE_CONFIRMATION'
  | 'FACE_SELFIE_FALLBACK_TRIGGERED'
  | 'FACE_SELFIE_SNAPSHOT_UPLOAD_COMPLETED'
  | 'FACE_SELFIE_SNAPSHOT_UPLOAD_STARTED'
  | 'FACE_SELFIE_UPLOAD_STARTED'
  | 'FACE_VIDEO_CAMERA_ERROR'
  | 'FACE_VIDEO_CAPTURE'
  | 'FACE_VIDEO_CAPTURE'
  | 'FACE_VIDEO_CAPTURE'
  | 'FACE_VIDEO_CAPTURE'
  | 'FACE_VIDEO_CHALLENGE_FETCH_ERROR'
  | 'FACE_VIDEO_CHALLENGE_LOADED'
  | 'FACE_VIDEO_CHALLENGE_REQUESTED'
  | 'FACE_VIDEO_CONFIRMATION'
  | 'FACE_VIDEO_FALLBACK_TRIGGERED'
  | 'FACE_VIDEO_INTRO'
  | 'FLOW_COMPLETED'
  | 'FLOW_STARTED'
  | 'FORBIDDEN_CLIENT_ERROR'
  | 'GENERIC_CLIENT_ERROR'
  | 'INTERRUPTED_FLOW_ERROR'
  | 'POA_CAPTURE'
  | 'POA_CAPTURE_POA'
  | 'POA_CONFIRMATION'
  | 'POA_DOCUMENT_TYPE_SELECTION'
  | 'POA_INTRO'
  | 'UNSUPPORTED_BROWSER'
  | 'UNSUPPORTED_BROWSER'
  | 'UPLOAD_COMPLETED'
  | 'USER_CONSENT'
  | 'WELCOME'
