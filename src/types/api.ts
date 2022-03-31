import { DocumentSides } from './commons'
import { SupportedLanguages } from './locales'
import { DocumentTypes, PoaTypes } from './steps'

/* Requests */

export type ImageQualityValidationTypes =
  | 'detect_document'
  | 'detect_cutoff'
  | 'detect_glare'
  | 'detect_blur'

export type ImageQualityValidationPayload = Partial<
  Record<ImageQualityValidationTypes, 'error' | 'warn'>
>

/* Errors */

export type ApiRawError = {
  response: string
  status: number
}

const API_ERROR_AUTHORIZATION = 'authorization_error'
const API_ERROR_EXPIRED_TOKEN = 'expired_token'
const API_ERROR_VALIDATION = 'validation_error'
const API_ERROR_UNKNOWN = 'unknown'
const API_ERROR_ACCESS_DENIED = 'ACCESS_DENIED'

type ApiErrorPayload = {
  message: string
  fields: Record<string, unknown>
}

type AuthorizationError = {
  type: typeof API_ERROR_AUTHORIZATION
} & ApiErrorPayload

type ExpiredTokenError = {
  type: typeof API_ERROR_EXPIRED_TOKEN
} & ApiErrorPayload

export type ValidationReasons =
  | 'attachment_content_type'
  | 'attachment'
  | 'document_detection'
  | 'detect_cutoff'
  | 'detect_glare'
  | 'detect_blur'
  | 'face_detection'
  | 'file'

export type ValidationError = {
  type: typeof API_ERROR_VALIDATION
  message: string
  fields: Partial<Record<ValidationReasons, string[]>>
}

type AccessDeniedError = {
  type: typeof API_ERROR_ACCESS_DENIED
  message: string
  fields: Record<string, unknown>
}

type UnknownError = {
  type: typeof API_ERROR_UNKNOWN
} & ApiErrorPayload

export type ParsedError = {
  response: {
    error?:
      | AuthorizationError
      | ExpiredTokenError
      | ValidationError
      | AccessDeniedError
      | UnknownError
    type?: string
    message?: string
  }
  status?: number
}

/* Responses */

export type UploadFileResponse = {
  id: string
  created_at: string
  file_name: string
  file_type: string
  file_size: number
  href: string
  download_href: string
}

export type ImageQualityWarnings = Partial<
  Record<ImageQualityValidationTypes, { valid: boolean }>
>

export type DocumentImageResponse = {
  applicant_id: string
  type: DocumentTypes | PoaTypes
  side: DocumentSides
  issuing_country: string | null | undefined
  sdk_warnings?: ImageQualityWarnings
} & UploadFileResponse

const CHALLENGE_RECITE = 'recite'
const CHALLENGE_MOVEMENT = 'movement'

export type ChallengePayload =
  | { type: typeof CHALLENGE_RECITE; query: number[] }
  | { type: typeof CHALLENGE_MOVEMENT; query: string }

export type ChallengeData = {
  challenges: ChallengePayload[]
  id: string
  switchSeconds?: number
}

type VideoChallengeLanguage = {
  source: string
  language_code: SupportedLanguages
}

export type FaceVideoResponse = {
  challenge: ChallengePayload[]
  languages: VideoChallengeLanguage[]
} & UploadFileResponse

export type SnapshotResponse = {
  uuid: string
} & Record<keyof UploadFileResponse, never>

export type VideoChallengeResponse = {
  data: {
    id: string
    challenge: ChallengePayload[]
  }
}

export type ValidateDocumentResponse = {
  breakdown: {
    document_confidence: number
    document_detected: boolean
  }
  id: string
  is_document: boolean
  valid: boolean
}

export type ApplicantConsent = {
  name: string
  granted: boolean
}

export type ApplicantConsentStatus = ApplicantConsent & {
  required: boolean
}

/* v4 APIs */
export type UploadBinaryMediaReponse = {
  media_id: string
}

type BinaryMediaPayload = {
  uuid: string
  content_type: string
  byte_size: number
}

type DocumentFieldPayload = {
  name: string
  raw_value: string
  source: string
}

type DocumentMediaPayload = {
  binary_media: BinaryMediaPayload
  document_fields: DocumentFieldPayload[]
}

export type CreateV4DocumentResponse = {
  uuid: string
  applicant_uuid: string
  document_media: Array<DocumentMediaPayload>
  document_type: 'IDENTITY_DOCUMENT' | 'OTHERS'
}

/* Callbacks */

export type SuccessCallback<T> = (response: T) => void
export type ErrorCallback = (error: ParsedError) => void

/* Sdk Configuration Service */

export interface ApplyFilter {
  doc_type?: string
}

export interface BiometricsLiveness {
  active?: BiometricsLivenessActive
  passive?: BiometricsLivenessPassive
}

export interface BiometricsLivenessActive {
  enabled?: boolean
  video_settings?: BiometricsLivenessActiveVideoSettings
}

export interface BiometricsLivenessActiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focusLock?: boolean
  white_balanceLock?: boolean
  exposure_lock?: boolean
  codec?: string
  codec_profile?: number
}

export interface BiometricsLivenessPassive {
  enabled?: boolean
  video_settings?: BiometricsLivenessPassiveVideoSettings
}

export interface BiometricsLivenessPassiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focus_lock?: boolean
  white_balance_lock?: boolean
  exposure_lock?: boolean
  codec?: string
}

export interface DocumentCapture {
  torch_turn_on_timeMs?: number
  video_length_ms?: number
  video_bitrate?: number
}

export interface ExperimentalFeatures {
  enable_image_quality_service?: boolean
  enable_multi_frame_capture?: boolean
}

export interface SdkFeatures {
  enable_applicant_consents?: boolean
}

export interface OnDeviceValidation {
  max_total_retries?: number
  threshold?: number
  applies_to?: ApplyFilter[]
}

export interface SdkConfigurationValidations {
  on_device?: SdkConfigurationValidationsOnDevice
}

export interface SdkConfigurationValidationsOnDevice {
  blur?: OnDeviceValidation
}

export type SdkConfiguration = {
  validations?: SdkConfigurationValidations
  experimental_features?: ExperimentalFeatures
  document_capture?: DocumentCapture
  biometrics_liveness?: BiometricsLiveness
  sdk_features?: SdkFeatures
}
