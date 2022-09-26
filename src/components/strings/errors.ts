import type { ErrorNames } from '~types/commons'

type LocaleData = {
  message: string
  instruction: string
  icon?: string
}

const errors: Record<ErrorNames, LocaleData> = {
  DOCUMENT_DETECTION: {
    message: 'doc_confirmation.alert.no_doc_title',
    instruction: 'doc_confirmation.alert.no_doc_detail',
  },
  INVALID_TYPE: {
    message: 'generic.errors.invalid_type.message',
    instruction: 'generic.errors.invalid_type.instruction',
  },
  UNSUPPORTED_FILE: {
    message: 'generic.errors.unsupported_file.message',
    instruction: 'generic.errors.unsupported_file.instruction',
  },
  INVALID_SIZE: {
    message: 'generic.errors.invalid_size.message',
    instruction: 'generic.errors.invalid_size.instruction',
  },
  INVALID_IMAGE_SIZE: {
    message: 'generic.errors.invalid_size.message',
    instruction: 'generic.errors.invalid_size.instruction',
  },
  NO_FACE_ERROR: {
    message: 'generic.errors.no_face.message',
    instruction: 'generic.errors.no_face.instruction',
  },
  MULTIPLE_FACES_ERROR: {
    message: 'generic.errors.multiple_faces.message',
    instruction: 'generic.errors.multiple_faces.instruction',
  },
  REQUEST_ERROR: {
    message: 'generic.errors.request_error.message',
    instruction: 'generic.errors.request_error.instruction',
  },
  EXPIRED_TOKEN: {
    message: 'generic.errors.expired_token.message',
    instruction: 'generic.errors.expired_token.instruction',
  },
  CUTOFF_DETECTED: {
    message: 'doc_confirmation.alert.crop_title',
    instruction: 'doc_confirmation.alert.crop_detail',
  },
  GEOBLOCKED_ERROR: {
    message: 'generic.errors.geoblocked_error.message',
    instruction: 'generic.errors.geoblocked_error.instruction',
  },
  GLARE_DETECTED: {
    message: 'doc_confirmation.alert.glare_title',
    instruction: 'doc_confirmation.alert.glare_detail',
  },
  BLUR_DETECTED: {
    message: 'doc_confirmation.alert.blur_title',
    instruction: 'doc_confirmation.alert.blur_detail',
  },
  SMS_FAILED: {
    message: 'generic.errors.sms_failed.message',
    instruction: 'generic.errors.sms_failed.instruction',
  },
  SMS_OVERUSE: {
    message: 'generic.errors.sms_overuse.message',
    instruction: 'generic.errors.sms_overuse.instruction',
  },
  CAMERA_NOT_WORKING: {
    message: 'selfie_capture.alert.camera_not_working.title',
    instruction: 'selfie_capture.alert.camera_not_working.detail',
  },
  CAMERA_NOT_WORKING_NO_FALLBACK: {
    message: 'selfie_capture.alert.camera_not_working.title',
    instruction: 'selfie_capture.alert.camera_not_working.detail_no_fallback',
  },
  CAMERA_INACTIVE: {
    message: 'selfie_capture.alert.camera_inactive.title',
    instruction: 'selfie_capture.alert.camera_inactive.detail',
  },
  CAMERA_INACTIVE_NO_FALLBACK: {
    message: 'selfie_capture.alert.camera_inactive.title',
    instruction: 'selfie_capture.alert.camera_inactive.detail_no_fallback',
  },
  FACE_VIDEO_TIMEOUT: {
    message: 'selfie_capture.alert.timeout.title',
    instruction: 'selfie_capture.alert.timeout.detail',
  },
  DOC_VIDEO_TIMEOUT: {
    message: 'video_capture.prompt.header_timeout',
    instruction: 'doc_video_capture.prompt.detail_timeout',
  },
  PROFILE_DATA_TIMEOUT: {
    message: 'profile_data.prompt.header_timeout',
    instruction: 'profile_data.prompt.detail_timeout',
  },
  GENERIC_CLIENT_ERROR: {
    message: 'cross_device_error_restart.title',
    instruction: 'cross_device_error_restart.subtitle',
  },
  FORBIDDEN_CLIENT_ERROR: {
    message: 'cross_device_error_desktop.title',
    instruction: 'cross_device_error_desktop.subtitle',
  },
  INTERRUPTED_FLOW_ERROR: {
    message: 'generic.errors.interrupted_flow_error.message',
    instruction: 'generic.errors.interrupted_flow_error.instruction',
    icon: 'flowInterruptedIcon',
  },
  UNSUPPORTED_ANDROID_BROWSER: {
    message: 'error_unsupported_browser.title_android',
    instruction: 'error_unsupported_browser.subtitle_android',
    icon: 'unsupportedBrowserIcon',
  },
  UNSUPPORTED_IOS_BROWSER: {
    message: 'error_unsupported_browser.title_ios',
    instruction: 'error_unsupported_browser.subtitle_ios',
    icon: 'unsupportedBrowserIcon',
  },
}

export default errors
