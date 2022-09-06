import type {
  UserAnalyticsEventNames,
  LegacyTrackedEventNames,
  AnalyticsTrackedEventNames,
  AnalyticsEventProperties,
} from '~types/tracker'

export const integratorTrackedEvents = new Map<
  LegacyTrackedEventNames,
  UserAnalyticsEventNames
>([
  ['screen_welcome', 'WELCOME'],
  ['screen_workflow_retry', 'WORKFLOW_RETRY'],
  ['screen_userConsent', 'USER_CONSENT'],
  ['screen_data_capture', 'DATA_CAPTURE'],
  ['screen_document_front_capture_file_upload', 'DOCUMENT_CAPTURE_FRONT'],
  ['screen_document_front_confirmation', 'DOCUMENT_CAPTURE_CONFIRMATION_FRONT'],
  ['screen_document_back_capture_file_upload', 'DOCUMENT_CAPTURE_BACK'],
  ['screen_document_back_confirmation', 'DOCUMENT_CAPTURE_CONFIRMATION_BACK'],
  ['screen_face_selfie_intro', 'FACIAL_INTRO'],
  ['screen_face_selfie_capture', 'FACIAL_CAPTURE'],
  ['screen_face_selfie_confirmation', 'FACIAL_CAPTURE_CONFIRMATION'],
  ['screen_face_video_intro', 'VIDEO_FACIAL_INTRO'],
  ['screen_face_video_capture_step_1', 'VIDEO_FACIAL_CAPTURE_STEP_1'],
  ['screen_face_video_capture_step_2', 'VIDEO_FACIAL_CAPTURE_STEP_2'],
  ['screen_document_type_select', 'DOCUMENT_TYPE_SELECT'],
  ['screen_document_country_select', 'ID_DOCUMENT_COUNTRY_SELECT'],
  ['screen_crossDevice', 'CROSS_DEVICE_INTRO'],
  ['screen_crossDevice_crossdevice_link', 'CROSS_DEVICE_GET_LINK'],
  ['document_upload_started', 'UPLOAD'],
  ['document_video_upload_started', 'UPLOAD'],
  ['face_video_upload_started', 'UPLOAD'],
  ['Starting snapshot upload', 'UPLOAD'],
  ['Starting live photo upload', 'UPLOAD'],
])

export const analyticsEventsMapping = new Map<
  LegacyTrackedEventNames,
  {
    eventName: AnalyticsTrackedEventNames
    properties: AnalyticsEventProperties
  }
>([
  [
    'screen_complete',
    {
      eventName: 'COMPLETE',
      properties: {
        event_type: 'screen',
      },
    },
  ],
  [
    'screen_complete_crossdevice_mobile_success',
    {
      eventName: 'COMPLETE_CROSS_DEVICE_MOBILE_SUCCESS',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_document_country_select',
    {
      eventName: 'COUNTRY_SELECTION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_document_crossDevice_client_intro',
    {
      eventName: 'CROSS_DEVICE_CLIENT_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_crossDevice_client_intro',
    {
      eventName: 'CROSS_DEVICE_CLIENT_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_crossDevice_client_intro',
    {
      eventName: 'CROSS_DEVICE_CLIENT_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_crossDevice_desktop_submit',
    {
      eventName: 'CROSS_DEVICE_DESKTOP_SUBMIT',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_crossDevice_crossdevice_link',
    {
      eventName: 'CROSS_DEVICE_GET_LINK',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_crossDevice',
    {
      eventName: 'CROSS_DEVICE_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'copy link selected',
    {
      eventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      properties: { event_type: 'action', link_method_selected: 'copy' },
    },
  ],
  [
    'qr code selected',
    {
      eventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      properties: { event_type: 'action', link_method_selected: 'qr_code' },
    },
  ],
  [
    'sms selected',
    {
      eventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      properties: { event_type: 'action', link_method_selected: 'sms' },
    },
  ],
  [
    'screen_crossDevice_mobile_notification_sent',
    {
      eventName: 'CROSS_DEVICE_MOBILE_NOTIFICATION_SENT',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_crossDevice_mobile_connected',
    {
      eventName: 'CROSS_DEVICE_MOBILE_SUBMIT',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_crossDevice_sms_failed',
    {
      eventName: 'CROSS_DEVICE_SMS_FAILED',
      properties: { event_type: 'view' },
    },
  ],
  [
    'Starting upload',
    {
      eventName: 'CUSTOM_API_REQUEST_STARTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'Completed upload',
    {
      eventName: 'CUSTOM_API_REQUEST_COMPLETED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'Taking live photo of document',
    {
      eventName: 'DOCUMENT_CAMERA_SHUTTER_CLICK',
      properties: { event_type: 'action', capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_document_back_capture_file_upload',
    {
      eventName: 'DOCUMENT_CAPTURE',
      properties: {
        event_type: 'screen',
        document_side: 'back',
        capture_method_rendered: 'upload',
      },
    },
  ],
  // Note: Only the _file_upload ones for DOCUMENT_CAPTURE seem to be used
  [
    'screen_document_back_capture',
    {
      eventName: 'DOCUMENT_CAPTURE',
      properties: { event_type: 'screen', document_side: 'front' },
    },
  ],
  [
    'screen_document_front_capture_file_upload',
    {
      eventName: 'DOCUMENT_CAPTURE',
      properties: {
        event_type: 'screen',
        capture_method_rendered: 'upload',
        document_side: 'front',
      },
    },
  ],
  [
    'screen_document_front_capture',
    {
      eventName: 'DOCUMENT_CAPTURE',
      properties: { event_type: 'screen', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_confirmation',
    {
      eventName: 'DOCUMENT_CONFIRMATION',
      properties: { event_type: 'screen', document_side: 'back' },
    },
  ],
  [
    'screen_document_front_confirmation',
    {
      eventName: 'DOCUMENT_CONFIRMATION',
      properties: { event_type: 'screen', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_confirmation_retake_button_clicked',
    {
      eventName: 'DOCUMENT_CONFIRMATION_RETAKE_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'back' },
    },
  ],
  [
    'screen_document_front_confirmation_retake_button_clicked',
    {
      eventName: 'DOCUMENT_CONFIRMATION_RETAKE_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_confirmation_upload_button_clicked',
    {
      eventName: 'DOCUMENT_CONFIRMATION_UPLOAD_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'back' },
    },
  ],
  [
    'screen_document_front_confirmation_upload_button_clicked',
    {
      eventName: 'DOCUMENT_CONFIRMATION_UPLOAD_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'front' },
    },
  ],
  [
    'screen_document_fallback_clicked',
    {
      eventName: 'DOCUMENT_FALLBACK_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_image_quality_guide',
    {
      eventName: 'DOCUMENT_IMAGE_QUALITY_GUIDE',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_document_type_select',
    {
      eventName: 'DOCUMENT_TYPE_SELECTION',
      properties: {
        event_type: 'screen',
        combined_country_and_document_selection: true,
      },
    },
  ],
  [
    'screen_document_document_video_capture_file_upload',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_document_document_video_capture',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_document_document_video_capture_camera_access',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_document_document_video_capture_camera_access_denied',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_document_document_video_capture_camera_access_allow_button_clicked',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_document_video_capture_camera_access_denied_refresh_button_clicked',
    {
      eventName:
        'DOCUMENT_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_document_video_capture_fallback_triggered',
    {
      eventName: 'DOCUMENT_VIDEO_FALLBACK_TRIGGERED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_intro',
    { eventName: 'FACE_SELFIE_INTRO', properties: { event_type: 'screen' } },
  ],
  [
    'screen_face_selfie_intro_take_selfie_button_clicked',
    {
      eventName: 'FACE_SELFIE_INTRO_TAKE_SELFIE_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_capture_camera_access',
    {
      eventName: 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_selfie_capture_camera_access_denied',
    {
      eventName: 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_DENIED',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_selfie_capture_camera_access_allow_button_clicked',
    {
      eventName: 'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_capture_camera_access_denied_refresh_button_clicked',
    {
      eventName:
        'FACE_SELFIE_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_capture_file_upload',
    {
      eventName: 'FACE_SELFIE_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_face_selfie_capture',
    {
      eventName: 'FACE_SELFIE_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_selfie_capture_capture_button_clicked',
    {
      eventName: 'FACE_SELFIE_CAPTURE_CAPTURE_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_confirmation',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_selfie_confirmation_retake_button_clicked',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_RETAKE_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_confirmation_upload_button_clicked',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_UPLOAD_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_selfie_capture_fallback_triggered',
    {
      eventName: 'FACE_SELFIE_FALLBACK_TRIGGERED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'Snapshot upload completed',
    {
      eventName: 'FACE_SELFIE_SNAPSHOT_UPLOAD_COMPLETED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'Starting snapshot upload',
    {
      eventName: 'FACE_SELFIE_SNAPSHOT_UPLOAD_STARTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'Starting live photo upload',
    {
      eventName: 'FACE_SELFIE_UPLOAD_STARTED',
      properties: { event_type: 'flow', capture_method_rendered: 'camera' },
    },
  ],
  [
    'Live photo upload completed',
    {
      eventName: 'FACE_SELFIE_UPLOAD_COMPLETED',
      properties: { event_type: 'flow', capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_face_video_capture_file_upload',
    {
      eventName: 'FACE_VIDEO_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_face_face_video_capture',
    {
      eventName: 'FACE_VIDEO_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_access',
    {
      eventName: 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_access_denied',
    {
      eventName: 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_access_allow_button_clicked',
    {
      eventName: 'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_access_denied_refresh_button_clicked',
    {
      eventName:
        'FACE_VIDEO_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_confirmation_video_error',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_VIDEO_ERROR',
      properties: { event_type: 'view', ui_alerts: { video_error: 'warning' } },
    },
  ],
  [
    'screen_face_video_capture_step_1',
    {
      eventName: 'FACE_VIDEO_CAPTURE',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_video_capture_step_2',
    {
      eventName: 'FACE_VIDEO_CAPTURE',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_video_challenge_load_failed',
    {
      eventName: 'FACE_VIDEO_CHALLENGE_FETCH_ERROR',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'screen_face_video_challenge_loaded',
    {
      eventName: 'FACE_VIDEO_CHALLENGE_LOADED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'screen_face_video_challenge_requested',
    {
      eventName: 'FACE_VIDEO_CHALLENGE_REQUESTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'screen_face_face_video_confirmation',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_face_video_confirmation_retake_button_clicked',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_RETAKE_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_confirmation_upload_button_clicked',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_UPLOAD_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_capture_fallback_triggered',
    {
      eventName: 'FACE_VIDEO_FALLBACK_TRIGGERED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_video_intro',
    {
      eventName: 'FACE_VIDEO_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_face_video_intro_record_video_button_clicked',
    {
      eventName: 'FACE_VIDEO_INTRO_RECORD_VIDEO_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'completed flow',
    { eventName: 'FLOW_COMPLETED', properties: { event_type: 'flow' } },
  ],
  [
    'started flow',
    { eventName: 'FLOW_STARTED', properties: { event_type: 'flow' } },
  ],
  [
    'screen_forbidden_client_error',
    {
      eventName: 'FORBIDDEN_CLIENT_ERROR',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_generic_client_error',
    {
      eventName: 'GENERIC_CLIENT_ERROR',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_interrupted_flow_error',
    {
      eventName: 'INTERRUPTED_FLOW_ERROR',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_poa_file_upload',
    {
      eventName: 'POA_CAPTURE',
      properties: { event_type: 'screen', capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_poa_poa',
    {
      // TODO: once we remove Woopra and we figure out where this is triggered it will have to be renamed
      eventName: 'POA_CAPTURE_POA',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_front_confirmation',
    {
      eventName: 'POA_CONFIRMATION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_type_select',
    {
      eventName: 'POA_DOCUMENT_TYPE_SELECTION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_poa_country_select',
    {
      eventName: 'POA_COUNTRY_SELECTION',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa',
    { eventName: 'POA_INTRO', properties: { event_type: 'screen' } },
  ],
  [
    'screen_unsupported_android_browser',
    {
      eventName: 'UNSUPPORTED_BROWSER',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_unsupported_ios_browser',
    {
      eventName: 'UNSUPPORTED_BROWSER',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_data_capture',
    { eventName: 'DATA_CAPTURE', properties: { event_type: 'screen' } },
  ],
  [
    'screen_userConsent',
    { eventName: 'USER_CONSENT', properties: { event_type: 'screen' } },
  ],
  [
    'screen_welcome',
    { eventName: 'WELCOME', properties: { event_type: 'screen' } },
  ],
  [
    'screen_workflow_retry',
    { eventName: 'WORKFLOW_RETRY', properties: { event_type: 'screen' } },
  ],
  [
    'screen_document_front_confirmation_cutoff_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { cutoff: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_cutoff_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'front',
        warning_shown: 'cutoff',
      },
    },
  ],
  [
    'screen_document_back_confirmation_cutoff_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { cutoff: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_cutoff_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'back',
        warning_shown: 'cutoff',
      },
    },
  ],
  [
    'screen_document_front_confirmation_blur_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { blur: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_blur_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'front',
        warning_shown: 'blur',
      },
    },
  ],
  [
    'screen_document_back_confirmation_blur_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { blur: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_blur_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'back',
        warning_shown: 'blur',
      },
    },
  ],
  [
    'screen_document_front_confirmation_glare_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { glare: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_glare_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'front',
        warning_shown: 'glare',
      },
    },
  ],
  [
    'screen_document_back_confirmation_glare_detected',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { glare: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_glare_detected_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'back',
        warning_shown: 'glare',
      },
    },
  ],
  [
    'screen_face_selfie_confirmation_no_face_error',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { no_face: 'error' },
      },
    },
  ],
  [
    'screen_face_selfie_confirmation_multiple_faces_error',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { multiple_faces: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_request_error',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_request_error',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_face_face_video_confirmation_request_error',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_face_selfie_confirmation_request_error',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_document_detection',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { document_detection: 'error' },
      },
    },
  ],
  [
    'screen_document_front_confirmation_document_detection_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'front',
        warning_shown: 'document',
      },
    },
  ],
  [
    'screen_document_back_confirmation_document_detection',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { document_detection: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_document_detection_warning',
    {
      eventName: 'DOCUMENT_CONFIRMATION_WARNING',
      properties: {
        event_type: 'view',
        document_side: 'back',
        warning_shown: 'document',
      },
    },
  ],
  [
    'screen_document_front_confirmation_invalid_type',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { invalid_type: 'error' },
      },
    },
  ],
  [
    'screen_document_back_confirmation_invalid_type',
    {
      eventName: 'DOCUMENT_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { invalid_type: 'error' },
      },
    },
  ],
  [
    'screen_face_selfie_confirmation_unsupported_file',
    {
      eventName: 'FACE_SELFIE_CONFIRMATION_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { unsupported_file: 'error' },
      },
    },
  ],
  [
    'screen_face_face_video_capture_face_video_timeout',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { face_video_timeout: 'warning' },
      },
    },
  ],
  [
    'screen_data_capture_profile_data_timeout',
    {
      eventName: 'DATA_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { profile_data_timeout: 'warning' },
      },
    },
  ],
  [
    'screen_document_document_video_capture_doc_video_timeout',
    {
      eventName: 'DOCUMENT_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { doc_video_timeout: 'warning' },
      },
    },
  ],
  [
    'screen_face_face_video_capture_camera_not_working',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: true,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_document_front_capture_camera_not_working',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        has_fallback: true,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_document_back_capture_camera_not_working',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        has_fallback: true,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_face_selfie_capture_camera_not_working',
    {
      eventName: 'FACE_SELFIE_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: true,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],

  [
    'screen_face_face_video_capture_camera_not_working_no_fallback',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: false,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_document_front_capture_camera_not_working_no_fallback',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        has_fallback: false,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_document_back_capture_camera_not_working_no_fallback',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        has_fallback: false,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],
  [
    'screen_face_selfie_capture_camera_not_working_no_fallback',
    {
      eventName: 'FACE_SELFIE_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: false,
        ui_alerts: { camera_not_working: 'error' },
      },
    },
  ],

  [
    'screen_face_face_video_capture_camera_inactive',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: true,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_document_front_capture_camera_inactive',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        has_fallback: true,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_document_back_capture_camera_inactive',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        has_fallback: true,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_face_selfie_capture_camera_inactive',
    {
      eventName: 'FACE_SELFIE_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: true,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],

  [
    'screen_face_face_video_camera_inactive_no_fallback',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: false,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_document_front_capture_camera_inactive_no_fallback',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        has_fallback: false,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_document_back_capture_camera_inactive_no_fallback',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        has_fallback: false,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],
  [
    'screen_face_selfie_capture_camera_inactive_no_fallback',
    {
      eventName: 'FACE_SELFIE_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: false,
        ui_alerts: { camera_inactive: 'warning' },
      },
    },
  ],

  [
    'screen_crossDevice_sms_overuse',
    {
      eventName: 'CROSS_DEVICE_SMS_OVERUSE',
      properties: {
        event_type: 'view',
      },
    },
  ],
  [
    'screen_face_face_video_capture_record_button_click',
    {
      eventName: 'FACE_VIDEO_CAPTURE_RECORD_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_capture_next_button_clicked',
    {
      eventName: 'FACE_VIDEO_CAPTURE_NEXT_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_capture_finish_button_clicked',
    {
      eventName: 'FACE_VIDEO_CAPTURE_FINISH_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_confirmation_play_clicked',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_PLAY_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_confirmation_pause_clicked',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_PAUSE_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_confirmation_playback_finished',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_PLAYBACK_FINISHED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_front_capture_request_error',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_document_back_capture_request_error',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: { request_error: 'error' },
      },
    },
  ],
  [
    'screen_document_image_quality_guide_invalid_type',
    {
      eventName: 'DOCUMENT_IMAGE_QUALITY_GUIDE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { invalid_type: 'error' },
      },
    },
  ],
  [
    'screen_document_image_quality_guide_invalid_size',
    {
      eventName: 'DOCUMENT_IMAGE_QUALITY_GUIDE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: { invalid_size: 'error' },
      },
    },
  ],
  [
    'screen_document_confirmation_video_play_clicked',
    {
      eventName: 'DOCUMENT_VIDEO_CONFIRMATION_PLAY_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_confirmation_video_pause_clicked',
    {
      eventName: 'DOCUMENT_VIDEO_CONFIRMATION_PAUSE_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_confirmation_video_playback_finished',
    {
      eventName: 'DOCUMENT_VIDEO_CONFIRMATION_PLAYBACK_FINISHED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'Triggering onSubmitSelfie callback',
    {
      eventName: 'CUSTOM_CALLBACK_TRIGGERED',
      properties: { event_type: 'flow', callback_name: 'onSubmitSelfie' },
    },
  ],
  [
    'Triggering onSubmitVideo callback',
    {
      eventName: 'CUSTOM_CALLBACK_TRIGGERED',
      properties: { event_type: 'flow', callback_name: 'onSubmitVideo' },
    },
  ],
  [
    'Triggering onSubmitDocument callback',
    {
      eventName: 'CUSTOM_CALLBACK_TRIGGERED',
      properties: { event_type: 'flow', callback_name: 'onSubmitDocument' },
    },
  ],
  [
    'Error response from onSubmitSelfie',
    {
      eventName: 'CUSTOM_CALLBACK_ERROR',
      properties: { event_type: 'flow', callback_name: 'onSubmitSelfie' },
    },
  ],
  [
    'Error response from onSubmitVideo',
    {
      eventName: 'CUSTOM_CALLBACK_ERROR',
      properties: { event_type: 'flow', callback_name: 'onSubmitVideo' },
    },
  ],
  [
    'Error response from onSubmitDocument',
    {
      eventName: 'CUSTOM_CALLBACK_ERROR',
      properties: { event_type: 'flow', callback_name: 'onSubmitDocument' },
    },
  ],
  [
    'document_upload_started',
    {
      eventName: 'DOCUMENT_UPLOAD_STARTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'document_upload_completed',
    {
      eventName: 'DOCUMENT_UPLOAD_COMPLETED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'document_video_upload_started',
    {
      eventName: 'DOCUMENT_VIDEO_UPLOAD_STARTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'document_video_upload_completed',
    {
      eventName: 'DOCUMENT_VIDEO_UPLOAD_COMPLETED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'face_video_upload_started',
    {
      eventName: 'FACE_VIDEO_UPLOAD_STARTED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'face_video_upload_completed',
    {
      eventName: 'FACE_VIDEO_UPLOAD_COMPLETED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'navigation_back_button_clicked',
    {
      eventName: 'NAVIGATION_BACK_BUTTON_CLICKED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'navigation_close_button_clicked',
    {
      eventName: 'NAVIGATION_CLOSE_BUTTON_CLICKED',
      properties: { event_type: 'flow' },
    },
  ],
  [
    'screen_poa_poa_client_intro',
    {
      eventName: 'POA_CLIENT_INTRO',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_poa_poa_confirmation',
    {
      eventName: 'POA_CONFIRMATION_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_poa_poa_confirmation_upload_button_clicked',
    {
      eventName: 'POA_CONFIRMATION_UPLOAD_BUTTON_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_inactive_no_fallback',
    {
      eventName: 'FACE_VIDEO_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        has_fallback: false,
        ui_alerts: {
          camera_inactive: 'error',
        },
      },
    },
  ],
  [
    'screen_document_front_capture_file_upload_invalid_type',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: {
          invalid_type: 'error',
        },
      },
    },
  ],
  [
    'screen_document_back_capture_file_upload_invalid_type',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        ui_alerts: {
          invalid_type: 'error',
        },
      },
    },
  ],
  [
    'screen_retry',
    {
      eventName: 'RETRY',
      properties: { event_type: 'screen' },
    },
  ],
  [
    'screen_complete_face_video_confirmation_play_clicked',
    {
      eventName: 'FACE_VIDEO_CONFIRMATION_PLAY_CLICKED',
      properties: { event_type: 'action' },
    },
  ],
  [
    'screen_document_front_capture_file_upload_invalid_size',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'front',
        ui_alerts: {
          invalid_size: 'error',
        },
      },
    },
  ],
  [
    'screen_document_back_capture_file_upload_invalid_size',
    {
      eventName: 'DOCUMENT_CAPTURE_ERROR',
      properties: {
        event_type: 'view',
        document_side: 'back',
        ui_alerts: {
          invalid_size: 'error',
        },
      },
    },
  ],
  [
    'screen_document_front_capture_camera_access',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS',
      properties: { event_type: 'screen', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_capture_camera_access',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS',
      properties: { event_type: 'screen', document_side: 'back' },
    },
  ],
  [
    'screen_document_front_capture_camera_access_allow_button_clicked',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_capture_camera_access_allow_button_clicked',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'back' },
    },
  ],
  [
    'screen_document_front_capture_camera_access_denied_refresh_button_clicked',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'front' },
    },
  ],
  [
    'screen_document_back_capture_camera_access_denied_refresh_button_clicked',
    {
      eventName: 'DOCUMENT_CAPTURE_CAMERA_ACCESS_DENIED_REFRESH_BUTTON_CLICKED',
      properties: { event_type: 'action', document_side: 'back' },
    },
  ],
  [
    'screen_activeVideo_intro',
    {
      eventName: 'FACE_LIVENESS_INTRO',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_intro_ready_clicked',
    {
      eventName: 'FACE_LIVENESS_INTRO_READY_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_alignment',
    {
      eventName: 'FACE_LIVENESS_ALIGNMENT',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_alignment_status_not_centered',
    {
      eventName: 'FACE_LIVENESS_ALIGNMENT_STATUS',
      properties: {
        event_type: 'view',
        step: 'face',
        alignment_status: 'face not centered',
      },
    },
  ],
  [
    'screen_activeVideo_alignment_status_too_close',
    {
      eventName: 'FACE_LIVENESS_ALIGNMENT_STATUS',
      properties: {
        event_type: 'view',
        step: 'face',
        alignment_status: 'face too close',
      },
    },
  ],
  [
    'screen_activeVideo_alignment_status_too_far',
    {
      eventName: 'FACE_LIVENESS_ALIGNMENT_STATUS',
      properties: {
        event_type: 'view',
        step: 'face',
        alignment_status: 'face too far',
      },
    },
  ],
  [
    'screen_activeVideo_alignment_status_aligned',
    {
      eventName: 'FACE_LIVENESS_ALIGNMENT_STATUS',
      properties: {
        event_type: 'view',
        step: 'face',
        alignment_status: 'face aligned',
      },
    },
  ],
  [
    'screen_activeVideo_camera_access',
    {
      eventName: 'FACE_LIVENESS_CAMERA_ACCESS',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_camera_access_allow_button_clicked',
    {
      eventName: 'FACE_LIVENESS_CAMERA_ACCESS_ALLOW_BUTTON_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture',
    {
      eventName: 'FACE_LIVENESS_CAPTURE',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture_status',
    {
      eventName: 'FACE_LIVENESS_CAPTURE_STATUS',
      properties: { event_type: 'view', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_no_face_detected',
    {
      eventName: 'FACE_LIVENESS_NO_FACE_DETECTED',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_no_face_detected_restart_clicked',
    {
      eventName: 'FACE_LIVENESS_NO_FACE_DETECTED_RESTART_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture_error_timeout',
    {
      eventName: 'FACE_LIVENESS_CAPTURE_ERROR_TIMEOUT',
      properties: { event_type: 'view', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture_error_timeout_restart_clicked',
    {
      eventName: 'FACE_LIVENESS_CAPTURE_ERROR_TIMEOUT_RESTART_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture_error_too_fast',
    {
      eventName: 'FACE_LIVENESS_CAPTURE_ERROR_TOO_FAST',
      properties: { event_type: 'view', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_capture_error_too_fast_restart_clicked',
    {
      eventName: 'FACE_LIVENESS_CAPTURE_ERROR_TOO_FAST_RESTART_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_outro',
    {
      eventName: 'FACE_LIVENESS_OUTRO',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_outro_upload_clicked',
    {
      eventName: 'FACE_LIVENESS_OUTRO_UPLOAD_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_upload',
    {
      eventName: 'FACE_LIVENESS_UPLOAD',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_upload_completed',
    {
      eventName: 'FACE_LIVENESS_UPLOAD_COMPLETED',
      properties: { event_type: 'view', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_connection_error',
    {
      eventName: 'FACE_LIVENESS_CONNECTION_ERROR',
      properties: { event_type: 'screen', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_connection_error_retry_clicked',
    {
      eventName: 'FACE_LIVENESS_CONNECTION_ERROR_RETRY_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
  [
    'screen_activeVideo_connection_error_restart_clicked',
    {
      eventName: 'FACE_LIVENESS_CONNECTION_ERROR_RESTART_CLICKED',
      properties: { event_type: 'action', step: 'face' },
    },
  ],
])
