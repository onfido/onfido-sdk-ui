import type { DeviceTypes, ErrorNames } from './commons'
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
  | 'screen_crossDevice_sms_overuse'
  | 'Starting upload'
  | 'Completed upload'
  | 'Taking live photo of document'
  | 'screen_document_back_capture'
  | 'screen_document_front_capture'
  | 'screen_document_front_capture_file_upload'
  | 'screen_document_back_capture_file_upload'
  | 'screen_document_front_capture_camera_not_working'
  | 'screen_document_back_capture_camera_not_working'
  | 'screen_document_front_capture_camera_not_working_no_fallback'
  | 'screen_document_back_capture_camera_not_working_no_fallback'
  | 'screen_document_front_capture_camera_inactive'
  | 'screen_document_back_capture_camera_inactive'
  | 'screen_document_front_capture_camera_inactive_no_fallback'
  | 'screen_document_back_capture_camera_inactive_no_fallback'
  | 'screen_document_front_capture_request_error'
  | 'screen_document_back_capture_request_error'
  | 'screen_document_back_confirmation'
  | 'screen_document_front_confirmation'
  | 'screen_document_back_confirmation_retake_button_clicked'
  | 'screen_document_front_confirmation_retake_button_clicked'
  | 'screen_document_back_confirmation_upload_button_clicked'
  | 'screen_document_front_confirmation_upload_button_clicked'
  | 'screen_document_front_confirmation_cutoff_detected'
  | 'screen_document_back_confirmation_cutoff_detected'
  | 'screen_document_front_confirmation_blur_detected'
  | 'screen_document_back_confirmation_blur_detected'
  | 'screen_document_front_confirmation_glare_detected'
  | 'screen_document_back_confirmation_glare_detected'
  | 'screen_document_front_confirmation_cutoff_detected_warning'
  | 'screen_document_back_confirmation_cutoff_detected_warning'
  | 'screen_document_front_confirmation_blur_detected_warning'
  | 'screen_document_back_confirmation_blur_detected_warning'
  | 'screen_document_front_confirmation_glare_detected_warning'
  | 'screen_document_back_confirmation_glare_detected_warning'
  | 'screen_document_front_confirmation_document_detection_warning'
  | 'screen_document_back_confirmation_document_detection_warning'
  | 'screen_document_front_confirmation_request_error'
  | 'screen_document_back_confirmation_request_error'
  | 'screen_document_front_confirmation_document_detection'
  | 'screen_document_back_confirmation_document_detection'
  | 'screen_document_front_confirmation_invalid_type'
  | 'screen_document_back_confirmation_invalid_type'
  | 'screen_document_fallback_clicked'
  | 'screen_document_image_quality_guide'
  | 'screen_document_image_quality_guide_invalid_type'
  | 'screen_document_image_quality_guide_invalid_size'
  | 'screen_document_type_select'
  | 'screen_document_document_video_capture_file_upload'
  | 'screen_document_document_video_capture'
  | 'screen_document_document_video_capture_camera_access'
  | 'screen_document_document_video_capture_camera_access_denied'
  | 'screen_document_document_video_capture_camera_access_allow_button_clicked'
  | 'screen_document_document_video_capture_camera_access_denied_refresh_button_clicked'
  | 'screen_document_document_video_capture_fallback_triggered'
  | 'screen_document_document_video_capture_doc_video_timeout'
  | 'screen_document_confirmation_video_play_clicked'
  | 'screen_document_confirmation_video_pause_clicked'
  | 'screen_document_confirmation_video_playback_finished'
  | 'screen_face_selfie_intro'
  | 'screen_face_selfie_intro_take_selfie_button_clicked'
  | 'screen_face_selfie_capture_file_upload'
  | 'screen_face_selfie_capture'
  | 'screen_face_selfie_capture_capture_button_clicked'
  | 'screen_face_selfie_capture_camera_access'
  | 'screen_face_selfie_capture_camera_access_denied'
  | 'screen_face_selfie_capture_camera_access_allow_button_clicked'
  | 'screen_face_selfie_capture_camera_access_denied_refresh_button_clicked'
  | 'screen_face_selfie_capture_camera_not_working'
  | 'screen_face_selfie_capture_camera_not_working_no_fallback'
  | 'screen_face_selfie_capture_camera_inactive'
  | 'screen_face_selfie_capture_camera_inactive_no_fallback'
  | 'screen_face_selfie_confirmation'
  | 'screen_face_selfie_confirmation_retake_button_clicked'
  | 'screen_face_selfie_confirmation_upload_button_clicked'
  | 'screen_face_selfie_confirmation_no_face_error'
  | 'screen_face_selfie_confirmation_multiple_faces_error'
  | 'screen_face_selfie_confirmation_request_error'
  | 'screen_face_selfie_confirmation_unsupported_file'
  | 'screen_face_selfie_capture_fallback_triggered'
  | 'Snapshot upload completed'
  | 'Starting snapshot upload'
  | 'Starting live photo upload'
  | 'Live photo upload completed'
  | 'screen_face_face_video_capture_file_upload'
  | 'screen_face_face_video_capture_record_button_click'
  | 'screen_face_face_video_capture_next_button_clicked'
  | 'screen_face_face_video_capture_finish_button_clicked'
  | 'screen_face_face_video_capture'
  | 'screen_face_face_video_capture_camera_access'
  | 'screen_face_face_video_capture_camera_access_denied'
  | 'screen_face_face_video_capture_face_video_timeout'
  | 'screen_face_face_video_capture_camera_inactive'
  | 'screen_face_face_video_capture_camera_not_working'
  | 'screen_face_face_video_capture_camera_not_working_no_fallback'
  | 'screen_face_face_video_capture_camera_access_allow_button_clicked'
  | 'screen_face_face_video_capture_camera_access_denied_refresh_button_clicked'
  | 'screen_face_face_video_capture_fallback_triggered'
  | 'screen_face_face_video_camera_inactive_no_fallback'
  | 'screen_face_video_capture_step_1'
  | 'screen_face_video_capture_step_2'
  | 'screen_face_video_challenge_load_failed'
  | 'screen_face_video_challenge_loaded'
  | 'screen_face_video_challenge_requested'
  | 'screen_face_face_video_confirmation'
  | 'screen_face_face_video_confirmation_request_error'
  | 'screen_face_face_video_confirmation_video_error'
  | 'screen_face_face_video_confirmation_play_clicked'
  | 'screen_face_face_video_confirmation_pause_clicked'
  | 'screen_face_face_video_confirmation_playback_finished'
  | 'screen_face_face_video_confirmation_retake_button_clicked'
  | 'screen_face_face_video_confirmation_upload_button_clicked'
  | 'screen_face_face_video_capture_fallback_triggered'
  | 'screen_face_video_intro'
  | 'screen_face_video_intro_record_video_button_clicked'
  | 'completed flow'
  | 'started flow'
  | 'screen_forbidden_client_error'
  | 'screen_generic_client_error'
  | 'screen_interrupted_flow_error'
  | 'screen_poa_poa_file_upload'
  | 'screen_poa_poa'
  | 'screen_poa_front_confirmation'
  | 'screen_poa_type_select'
  | 'screen_poa_poa_country_select'
  | 'screen_poa'
  | 'screen_unsupported_android_browser'
  | 'screen_unsupported_ios_browser'
  | 'screen_userConsent'
  | 'screen_welcome'
  | 'screen_data_capture'
  | 'screen_data_capture_profile_data_timeout'
  | 'Triggering onSubmitSelfie callback'
  | 'Triggering onSubmitVideo callback'
  | 'Triggering onSubmitDocument callback'
  | 'Error response from onSubmitSelfie'
  | 'Error response from onSubmitVideo'
  | 'Error response from onSubmitDocument'
  | 'Success response from onSubmitSelfie'
  | 'Success response from onSubmitVideo'
  | 'Success response from onSubmitDocument'
  | 'document_upload_started'
  | 'document_upload_completed'
  | 'document_video_upload_started'
  | 'document_video_upload_completed'
  | 'face_video_upload_started'
  | 'face_video_upload_completed'
  | 'active_video_upload_started'
  | 'active_video_upload_completed'
  | 'screen_workflow_retry'
  | 'navigation_back_button_clicked'
  | 'navigation_close_button_clicked'
  | 'screen_poa_poa_client_intro'
  | 'screen_poa_poa_confirmation'
  | 'screen_poa_poa_confirmation_upload_button_clicked'
  | 'screen_face_face_video_capture_camera_inactive_no_fallback'
  | 'screen_document_front_capture_file_upload_invalid_type'
  | 'screen_document_back_capture_file_upload_invalid_type'
  | 'screen_retry'
  | 'screen_complete_face_video_confirmation_play_clicked'
  | 'screen_document_front_capture_file_upload_invalid_size'
  | 'screen_document_back_capture_file_upload_invalid_size'
  | 'screen_document_front_capture_camera_access'
  | 'screen_document_back_capture_camera_access'
  | 'screen_document_front_capture_camera_access_allow_button_clicked'
  | 'screen_document_back_capture_camera_access_allow_button_clicked'
  | 'screen_document_front_capture_camera_access_denied_refresh_button_clicked'
  | 'screen_document_back_capture_camera_access_denied_refresh_button_clicked'
  | 'screen_activeVideo_intro'
  | 'screen_activeVideo_intro_ready_clicked'
  | 'screen_activeVideo_alignment'
  | 'screen_activeVideo_alignment_status_not_centered'
  | 'screen_activeVideo_alignment_status_too_close'
  | 'screen_activeVideo_alignment_status_too_far'
  | 'screen_activeVideo_alignment_status_aligned'
  | 'screen_activeVideo_camera_access'
  | 'screen_activeVideo_camera_access_allow_button_clicked'
  | 'screen_activeVideo_capture'
  | 'screen_activeVideo_capture_status'
  | 'screen_activeVideo_no_face_detected'
  | 'screen_activeVideo_no_face_detected_restart_clicked'
  | 'screen_activeVideo_capture_error_timeout'
  | 'screen_activeVideo_capture_error_timeout_restart_clicked'
  | 'screen_activeVideo_capture_error_too_fast'
  | 'screen_activeVideo_capture_error_too_fast_restart_clicked'
  | 'screen_activeVideo_outro'
  | 'screen_activeVideo_outro_upload_clicked'
  | 'screen_activeVideo_upload'
  | 'screen_activeVideo_upload_completed'
  | 'screen_activeVideo_connection_error'
  | 'screen_activeVideo_connection_error_retry_clicked'
  | 'screen_activeVideo_connection_error_restart_clicked'

export type UserAnalyticsEventNames =
  | 'WELCOME'
  | 'WORKFLOW_RETRY'
  | 'USER_CONSENT'
  | 'DATA_CAPTURE'
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

type TrackedEventTypes = 'screen' | 'action' | 'flow' | 'view'

export type TrackedEnvironmentData = {
  device?: DeviceTypes
  os: string
  os_version: string
  browser: string
  browser_version: string
}

type UIAlerts =
  | 'cutoff'
  | 'blur'
  | 'glare'
  | 'request_error'
  | 'invalid_capture'
  | 'invalid_type'
  | 'invalid_size'
  | 'no_face'
  | 'multiple_faces'
  | 'document_capture'
  | 'document_detection'
  | 'document' // same as document_detection, new nomenclature for analytics
  | 'face_video_timeout'
  | 'profile_data_timeout'
  | 'doc_video_timeout'
  | 'unsupported_file'
  | 'camera_not_working'
  | 'camera_inactive'
  | 'video_error'

export const ErrorNameToUIAlertMapping: Record<
  ErrorNames,
  UIAlerts | undefined
> = {
  BLUR_DETECTED: 'blur',
  CAMERA_INACTIVE: 'camera_inactive',
  CAMERA_INACTIVE_NO_FALLBACK: 'camera_inactive',
  CAMERA_NOT_WORKING: 'camera_not_working',
  CAMERA_NOT_WORKING_NO_FALLBACK: 'camera_not_working',
  CUTOFF_DETECTED: 'cutoff',
  DOC_VIDEO_TIMEOUT: 'doc_video_timeout',
  FACE_VIDEO_TIMEOUT: 'face_video_timeout',
  FORBIDDEN_CLIENT_ERROR: undefined,
  GENERIC_CLIENT_ERROR: undefined,
  GEOBLOCKED_ERROR: undefined,
  INTERRUPTED_FLOW_ERROR: undefined,
  PROFILE_DATA_TIMEOUT: 'profile_data_timeout',
  GLARE_DETECTED: 'glare',
  DOCUMENT_DETECTION: 'document_detection',
  INVALID_SIZE: 'invalid_size',
  INVALID_TYPE: 'invalid_type',
  INVALID_IMAGE_SIZE: 'invalid_size',
  MULTIPLE_FACES_ERROR: 'multiple_faces',
  NO_FACE_ERROR: 'no_face',
  REQUEST_ERROR: 'request_error',
  EXPIRED_TOKEN: undefined,
  SMS_FAILED: undefined,
  SMS_OVERUSE: undefined,
  UNSUPPORTED_ANDROID_BROWSER: undefined,
  UNSUPPORTED_FILE: 'unsupported_file',
  UNSUPPORTED_IOS_BROWSER: undefined,
}

export type CaptureMethodRendered = 'upload' | 'camera'
export type CaptureFormat = 'photo' | 'camera' // I think this maps 1-1 to RequestedVariant, photo is standard

export type AnalyticsEventProperties = {
  event_type?: TrackedEventTypes
  combined_country_and_document_selection?: boolean
  step?: string
  is_cross_device?: boolean
  is_custom_ui?: boolean
  status?: string
  capture_method_rendered?: CaptureMethodRendered
  document_side?: 'front' | 'back'
  video_capture_step?: 'step1' | 'step2'
  video_instruction_type?: 'recite' | 'movement'
  link_method_selected?: 'copy' | 'qr_code' | 'sms'
  has_fallback?: boolean
  ui_alerts?: {
    [key in UIAlerts]?: 'error' | 'warning' | null
  }
  warning_shown?: 'document' | 'blur' | 'glare' | 'cutoff'
  callback_name?: string
  alignment_status?:
    | 'face not centered'
    | 'face too close'
    | 'face too far'
    | 'face aligned'
}

export type AnalyticsEventPropertiesWarnings = {
  [key in UIAlerts]?: 'warning'
}

export type AnalyticsPayload = {
  applicant_uuid?: string
  client_uuid?: string
  event?: AnalyticsTrackedEventNames
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
  | 'CROSS_DEVICE_DESKTOP_SUBMIT'
  | 'CROSS_DEVICE_GET_LINK'
  | 'CROSS_DEVICE_INTRO'
  | 'CROSS_DEVICE_LINK_METHOD_SELECTED'
  | 'CROSS_DEVICE_MOBILE_NOTIFICATION_SENT'
  | 'CROSS_DEVICE_MOBILE_SUBMIT'
  | 'CROSS_DEVICE_SMS_FAILED'
  | 'CROSS_DEVICE_SMS_OVERUSE'
  | 'CUSTOM_API_REQUEST_STARTED'
  | 'CUSTOM_API_REQUEST_COMPLETED'
  | 'CUSTOM_CALLBACK_TRIGGERED'
  | 'CUSTOM_CALLBACK_ERROR'
  | 'DOCUMENT_CAMERA_ERROR'
  | 'DOCUMENT_CAMERA_SHUTTER_CLICK'
  | 'DOCUMENT_CAPTURE'
  | 'DOCUMENT_CAPTURE_ERROR'
  | 'DOCUMENT_CONFIRMATION'
  | 'DOCUMENT_CONFIRMATION_RETAKE_BUTTON_CLICKED'
  | 'DOCUMENT_CONFIRMATION_UPLOAD_BUTTON_CLICKED'
  | 'DOCUMENT_CONFIRMATION_ERROR'
  | 'DOCUMENT_CONFIRMATION_WARNING'
  | 'DOCUMENT_FALLBACK_CLICKED'
  | 'DOCUMENT_IMAGE_QUALITY_GUIDE'
  | 'DOCUMENT_IMAGE_QUALITY_GUIDE_ERROR'
  | 'DOCUMENT_TYPE_SELECTION'
  | 'DOCUMENT_VIDEO_CAPTURE'
  | 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS'
  | 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED'
  | 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED'
  | 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED'
  | 'DOCUMENT_VIDEO_CAPTURE_ERROR'
  | 'DOCUMENT_VIDEO_FALLBACK_TRIGGERED'
  | 'DOCUMENT_VIDEO_CONFIRMATION_PLAY_CLICKED'
  | 'DOCUMENT_VIDEO_CONFIRMATION_PAUSE_CLICKED'
  | 'DOCUMENT_VIDEO_CONFIRMATION_PLAYBACK_FINISHED'
  | 'FACE_LIVENESS_ALIGNMENT'
  | 'FACE_LIVENESS_ALIGNMENT_STATUS'
  | 'FACE_LIVENESS_CAMERA_ACCESS'
  | 'FACE_LIVENESS_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED'
  | 'FACE_LIVENESS_CAPTURE'
  | 'FACE_LIVENESS_CAPTURE_ERROR_TIMEOUT'
  | 'FACE_LIVENESS_CAPTURE_ERROR_TIMEOUT_RESTART_CLICKED'
  | 'FACE_LIVENESS_CAPTURE_ERROR_TOO_FAST'
  | 'FACE_LIVENESS_CAPTURE_ERROR_TOO_FAST_RESTART_CLICKED'
  | 'FACE_LIVENESS_CAPTURE_STATUS'
  | 'FACE_LIVENESS_CONNECTION_ERROR'
  | 'FACE_LIVENESS_CONNECTION_ERROR_RESTART_CLICKED'
  | 'FACE_LIVENESS_CONNECTION_ERROR_RETRY_CLICKED'
  | 'FACE_LIVENESS_INTRO'
  | 'FACE_LIVENESS_INTRO_READY_CLICKED'
  | 'FACE_LIVENESS_NO_FACE_DETECTED'
  | 'FACE_LIVENESS_NO_FACE_DETECTED_RESTART_CLICKED'
  | 'FACE_LIVENESS_OUTRO'
  | 'FACE_LIVENESS_OUTRO_UPLOAD_CLICKED'
  | 'FACE_LIVENESS_UPLOAD'
  | 'FACE_LIVENESS_UPLOAD_COMPLETED'
  | 'FACE_LIVENESS_UPLOAD_PROGRESS_COMPLETED'
  | 'FACE_LIVENESS_UPLOAD_PROGRESS_STARTED'
  | 'FACE_SELFIE_INTRO'
  | 'FACE_SELFIE_INTRO_TAKE_SELFIE_BUTTON_CLICKED'
  | 'FACE_SELFIE_CAPTURE'
  | 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS'
  | 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_DENIED'
  | 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED'
  | 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED'
  | 'FACE_SELFIE_CAPTURE_ERROR'
  | 'FACE_SELFIE_CAPTURE_CAPTURE_BUTTON_CLICKED'
  | 'FACE_SELFIE_CONFIRMATION'
  | 'FACE_SELFIE_CONFIRMATION_ERROR'
  | 'FACE_SELFIE_CONFIRMATION_RETAKE_BUTTON_CLICKED'
  | 'FACE_SELFIE_CONFIRMATION_UPLOAD_BUTTON_CLICKED'
  | 'FACE_SELFIE_FALLBACK_TRIGGERED'
  | 'FACE_SELFIE_SNAPSHOT_UPLOAD_COMPLETED'
  | 'FACE_SELFIE_SNAPSHOT_UPLOAD_STARTED'
  | 'FACE_SELFIE_UPLOAD_STARTED'
  | 'FACE_SELFIE_UPLOAD_COMPLETED'
  | 'FACE_VIDEO_CAPTURE'
  | 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS'
  | 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED'
  | 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED'
  | 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED'
  | 'FACE_VIDEO_CAPTURE_ERROR'
  | 'FACE_VIDEO_CAPTURE_RECORD_BUTTON_CLICKED'
  | 'FACE_VIDEO_CAPTURE_NEXT_BUTTON_CLICKED'
  | 'FACE_VIDEO_CAPTURE_FINISH_BUTTON_CLICKED'
  | 'FACE_VIDEO_CHALLENGE_FETCH_ERROR'
  | 'FACE_VIDEO_CHALLENGE_LOADED'
  | 'FACE_VIDEO_CHALLENGE_REQUESTED'
  | 'FACE_VIDEO_CONFIRMATION'
  | 'FACE_VIDEO_CONFIRMATION_ERROR'
  | 'FACE_VIDEO_CONFIRMATION_VIDEO_ERROR'
  | 'FACE_VIDEO_CONFIRMATION_PLAY_CLICKED'
  | 'FACE_VIDEO_CONFIRMATION_PAUSE_CLICKED'
  | 'FACE_VIDEO_CONFIRMATION_PLAYBACK_FINISHED'
  | 'FACE_VIDEO_CONFIRMATION_RETAKE_BUTTON_CLICKED'
  | 'FACE_VIDEO_CONFIRMATION_UPLOAD_BUTTON_CLICKED'
  | 'FACE_VIDEO_FALLBACK_TRIGGERED'
  | 'FACE_VIDEO_INTRO'
  | 'FACE_VIDEO_INTRO_RECORD_VIDEO_BUTTON_CLICKED'
  | 'FLOW_COMPLETED'
  | 'FLOW_STARTED'
  | 'FORBIDDEN_CLIENT_ERROR'
  | 'GENERIC_CLIENT_ERROR'
  | 'INTERRUPTED_FLOW_ERROR'
  | 'POA_CAPTURE'
  | 'POA_CAPTURE_POA'
  | 'POA_CONFIRMATION'
  | 'POA_COUNTRY_SELECTION'
  | 'POA_DOCUMENT_TYPE_SELECTION'
  | 'POA_INTRO'
  | 'UNSUPPORTED_BROWSER'
  | 'UPLOAD_COMPLETED'
  | 'USER_CONSENT'
  | 'DATA_CAPTURE'
  | 'DATA_CAPTURE_ERROR'
  | 'WELCOME'
  | 'WORKFLOW_RETRY'
  | 'NAVIGATION_BACK_BUTTON_CLICKED'
  | 'NAVIGATION_CLOSE_BUTTON_CLICKED'
  | 'DOCUMENT_UPLOAD_STARTED'
  | 'DOCUMENT_UPLOAD_COMPLETED'
  | 'DOCUMENT_VIDEO_UPLOAD_STARTED'
  | 'DOCUMENT_VIDEO_UPLOAD_COMPLETED'
  | 'FACE_VIDEO_UPLOAD_STARTED'
  | 'FACE_VIDEO_UPLOAD_COMPLETED'
  | 'POA_CLIENT_INTRO'
  | 'POA_CONFIRMATION_BUTTON_CLICKED'
  | 'POA_CONFIRMATION_UPLOAD_BUTTON_CLICKED'
  | 'FACE_VIDEO_CAPTURE_ERROR'
  | 'RETRY'
  | 'FACE_VIDEO_COMFIRMATION_PLAY_CLICKED'
  | 'DOCUMENT_CAPTURE_ERROR'
  | 'DOCUMENT_CAPTURE_CAMERA_ACCESS'
  | 'DOCUMENT_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED'
  | 'DOCUMENT_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED'
