export const USER_ANALYTICS_EVENT = 'userAnalyticsEvent'

type MappedEventNames =
  | 'screen_welcome'
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
  | 'Completed upload'
  | 'Snapshot upload completed'
  | 'Starting live photo upload'
  | 'Starting snapshot upload'
  | 'Taking live photo of document'
  | 'completed flow'

export type UserAnalyticsEventNames =
  | 'WELCOME'
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
