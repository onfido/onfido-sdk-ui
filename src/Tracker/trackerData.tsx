import type {
  TrackedEventNames,
  UserAnalyticsEventNames,
  LegacyAnalyticsTrackedEventNames,
  NewEventStructure,
} from '~types/tracker'

export const integratorTrackedEvents = new Map<
  TrackedEventNames,
  UserAnalyticsEventNames
>([
  ['screen_welcome', 'WELCOME'],
  ['screen_userConsent', 'USER_CONSENT'],
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
  ['Starting upload', 'UPLOAD'],
])

// TODO: Add typings using the objects in the comments

export const analyticsEventsMapping = new Map<
  LegacyAnalyticsTrackedEventNames,
  NewEventStructure
>([
  [
    'screen_complete',
    { newEventName: 'COMPLETE', eventType: 'screen', properties: {} },
  ],
  [
    'screen_complete_crossdevice_mobile_success',
    {
      newEventName: 'COMPLETE_CROSS_DEVICE_MOBILE_SUCCESS',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_document_country_select',
    {
      newEventName: 'COUNTRY_SELECTION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_document_crossDevice_client_intro',
    {
      newEventName: 'CROSS_DEVICE_CLIENT_INTRO',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_face_crossDevice_client_intro',
    {
      newEventName: 'CROSS_DEVICE_CLIENT_INTRO',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_poa_crossDevice_client_intro',
    {
      newEventName: 'CROSS_DEVICE_CLIENT_INTRO',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_crossDevice_desktop_submit',
    {
      newEventName: 'CROSS_DEVICE_DESKTOP_SUBMIT',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_crossDevice_crossdevice_link',
    {
      newEventName: 'CROSS_DEVICE_GET_LINK',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_crossDevice',
    {
      newEventName: 'CROSS_DEVICE_INTRO',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'copy link selected',
    {
      newEventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      eventType: 'action',
      properties: { link_method_selected: 'copy' },
    },
  ],
  [
    'qr code selected',
    {
      newEventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      eventType: 'action',
      properties: { link_method_selected: 'qr_code' },
    },
  ],
  [
    'sms selected',
    {
      newEventName: 'CROSS_DEVICE_LINK_METHOD_SELECTED',
      eventType: 'action',
      properties: { link_method_selected: 'sms' },
    },
  ],
  [
    'screen_crossDevice_mobile_notification_sent',
    {
      newEventName: 'CROSS_DEVICE_MOBILE_NOTIFICATION_SENT',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'screen_crossDevice_mobile_connected',
    {
      newEventName: 'CROSS_DEVICE_MOBILE_SUBMIT',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_crossDevice_sms_failed',
    {
      newEventName: 'CROSS_DEVICE_SMS_FAILED',
      eventType: 'view',
      properties: {},
    },
  ],
  [
    'Starting upload',
    {
      newEventName: 'CUSTOM_API_REQUEST_STARTED',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'screen_document_back_capture_camera_error',
    {
      newEventName: 'DOCUMENT_CAMERA_ERROR',
      eventType: 'view',
      properties: { document_side: 'back' },
    },
  ],
  [
    'screen_document_front_capture_camera_error',
    {
      newEventName: 'DOCUMENT_CAMERA_ERROR',
      eventType: 'view',
      properties: { document_side: 'front' },
    },
  ],
  [
    'Taking live photo of document',
    {
      newEventName: 'DOCUMENT_CAMERA_SHUTTER_CLICK',
      eventType: 'action',
      properties: { capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_document_back_capture_file_upload',
    {
      newEventName: 'DOCUMENT_CAPTURE',
      eventType: 'screen',
      properties: { document_side: 'back' },
    },
  ],
  [
    'screen_document_back_capture',
    {
      newEventName: 'DOCUMENT_CAPTURE',
      eventType: 'screen',
      properties: { document_side: 'front' },
    },
  ],
  [
    'screen_document_front_capture_file_upload',
    {
      newEventName: 'DOCUMENT_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_document_front_capture',
    {
      newEventName: 'DOCUMENT_CAPTURE',
      eventType: 'screen',
      properties: { document_side: 'front' },
    },
  ],
  [
    'screen_document_back_confirmation',
    {
      newEventName: 'DOCUMENT_CONFIRMATION',
      eventType: 'screen',
      properties: { document_side: 'back' },
    },
  ],
  [
    'screen_document_front_confirmation',
    {
      newEventName: 'DOCUMENT_CONFIRMATION',
      eventType: 'screen',
      properties: { document_side: 'front' },
    },
  ],
  [
    'screen_document_fallback_clicked',
    {
      newEventName: 'DOCUMENT_FALLBACK_CLICKED',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'screen_document_image_quality_guide',
    {
      newEventName: 'DOCUMENT_IMAGE_QUALITY_GUIDE',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_document_type_select',
    {
      newEventName: 'DOCUMENT_TYPE_SELECTION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_document_document_video_capture_file_upload',
    {
      newEventName: 'DOCUMENT_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_document_document_video_capture',
    {
      newEventName: 'DOCUMENT_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_document_document_video_capture_fallback_triggered',
    {
      newEventName: 'DOCUMENT_VIDEO_FALLBACK_TRIGGERED',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'screen_face_selfie_intro',
    { newEventName: 'FACE_INTRO', eventType: 'screen', properties: {} },
  ],
  [
    'screen_face_selfie_capture_camera_error',
    {
      newEventName: 'FACE_SELFIE_CAMERA_ERROR',
      eventType: 'view',
      properties: {},
    },
  ],
  [
    'screen_face_selfie_capture_file_upload',
    {
      newEventName: 'FACE_SELFIE_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_face_selfie_capture',
    {
      newEventName: 'FACE_SELFIE_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_selfie_confirmation',
    {
      newEventName: 'FACE_SELFIE_CONFIRMATION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_face_selfie_capture_fallback_triggered',
    {
      newEventName: 'FACE_SELFIE_FALLBACK_TRIGGERED',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'Snapshot upload completed',
    {
      newEventName: 'FACE_SELFIE_SNAPSHOT_UPLOAD_COMPLETED',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'Starting snapshot upload',
    {
      newEventName: 'FACE_SELFIE_SNAPSHOT_UPLOAD_STARTED',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'Starting live photo upload',
    {
      newEventName: 'FACE_SELFIE_UPLOAD_STARTED',
      eventType: 'flow',
      properties: { capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_face_video_capture_camera_error',
    {
      newEventName: 'FACE_VIDEO_CAMERA_ERROR',
      eventType: 'view',
      properties: {},
    },
  ],
  [
    'screen_face_face_video_capture_file_upload',
    {
      newEventName: 'FACE_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_face_face_video_capture',
    {
      newEventName: 'FACE_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'camera' },
    },
  ],
  [
    'screen_face_video_capture_step_1',
    {
      newEventName: 'FACE_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { video_capture_step: 'step1' },
    },
  ],
  [
    'screen_face_video_capture_step_2',
    {
      newEventName: 'FACE_VIDEO_CAPTURE',
      eventType: 'screen',
      properties: { video_capture_step: 'step2' },
    },
  ],
  [
    'screen_face_video_challenge_load_failed',
    {
      newEventName: 'FACE_VIDEO_CHALLENGE_FETCH_ERROR',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'screen_face_video_challenge_loaded',
    {
      newEventName: 'FACE_VIDEO_CHALLENGE_LOADED',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'screen_face_video_challenge_requested',
    {
      newEventName: 'FACE_VIDEO_CHALLENGE_REQUESTED',
      eventType: 'flow',
      properties: {},
    },
  ],
  [
    'screen_face_face_video_confirmation',
    {
      newEventName: 'FACE_VIDEO_CONFIRMATION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_face_face_video_capture_fallback_triggered',
    {
      newEventName: 'FACE_VIDEO_FALLBACK_TRIGGERED',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'screen_face_video_intro',
    {
      newEventName: 'FACE_VIDEO_INTRO',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'completed flow',
    { newEventName: 'FLOW_COMPLETED', eventType: 'flow', properties: {} },
  ],
  [
    'started flow',
    { newEventName: 'FLOW_STARTED', eventType: 'flow', properties: {} },
  ],
  [
    'screen_forbidden_client_error',
    {
      newEventName: 'FORBIDDEN_CLIENT_ERROR',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_generic_client_error',
    {
      newEventName: 'GENERIC_CLIENT_ERROR',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_interrupted_flow_error',
    {
      newEventName: 'INTERRUPTED_FLOW_ERROR',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_poa_poa_file_upload',
    {
      newEventName: 'POA_CAPTURE',
      eventType: 'screen',
      properties: { capture_method_rendered: 'upload' },
    },
  ],
  [
    'screen_poa_poa',
    {
      newEventName: 'POA_CAPTURE_POA',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_poa_front_confirmation',
    {
      newEventName: 'POA_CONFIRMATION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_poa_type_select',
    {
      newEventName: 'POA_DOCUMENT_TYPE_SELECTION',
      eventType: 'screen',
      properties: {},
    },
  ],
  [
    'screen_poa',
    { newEventName: 'POA_INTRO', eventType: 'screen', properties: {} },
  ],
  [
    'screen_unsupported_android_browser',
    {
      newEventName: 'UNSUPPORTED_BROWSER',
      eventType: 'screen',
      properties: { browser_os: 'android' },
    },
  ],
  [
    'screen_unsupported_ios_browser',
    {
      newEventName: 'UNSUPPORTED_BROWSER',
      eventType: 'screen',
      properties: { browser_os: 'ios' },
    },
  ],
  [
    'Completed upload',
    {
      newEventName: 'UPLOAD_COMPLETED',
      eventType: 'action',
      properties: {},
    },
  ],
  [
    'screen_userConsent',
    { newEventName: 'USER_CONSENT', eventType: 'screen', properties: {} },
  ],
  [
    'screen_welcome',
    { newEventName: 'WELCOME', eventType: 'screen', properties: {} },
  ],
])
