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

const API_ERROR_AUTHORIZATION = 'authorization_error'
const API_ERROR_EXPIRED_TOKEN = 'expired_token'
const API_ERROR_VALIDATION = 'validation_error'

type AuthorizationError = {
  type?: never
  message?: never
  error: {
    type: typeof API_ERROR_AUTHORIZATION
    message: string
    fields: Record<string, unknown>
  }
}

type ExpiredTokenError = {
  type: typeof API_ERROR_EXPIRED_TOKEN
  message: string
  error?: never
}

type ValidationReasons =
  | 'attachment_content_type'
  | 'attachment'
  | 'document_detection'
  | 'detect_cutoff'
  | 'detect_glare'
  | 'detect_blur'

type ValidationError = {
  type?: never
  message?: never
  error?: {
    type: typeof API_ERROR_VALIDATION
    message: string
    fields: Partial<Record<ValidationReasons, string[]>>
  }
}

export type ApiError = {
  response: string | ValidationError | ExpiredTokenError | AuthorizationError
  status: number
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

type ImageQualityBreakdown = {
  max: number
  min: number
  score: number
  threshold: number
}

type ImageCutoffBreakdown = {
  has_cutoff: boolean
} & ImageQualityBreakdown

type ImageGlareBreakdown = {
  has_glare: boolean
} & ImageQualityBreakdown

type ImageBlurBreakdown = {
  has_blur: boolean
} & ImageQualityBreakdown

type ImageQualityWarnings = {
  detect_cutoff?: { valid: boolean }
  detect_glare?: { valid: boolean }
  detect_blur?: { valid: boolean }
  image_quality: {
    quality: string
    breakdown: {
      cutoff?: ImageCutoffBreakdown
      glare?: ImageGlareBreakdown
      blur?: ImageBlurBreakdown
      has_document: boolean
    }
    image_quality_uuid: string
  }
}

export type DocumentImageResponse = {
  applicant_id: string
  type: DocumentTypes | PoaTypes
  side: DocumentSides
  issuing_country?: string
  sdk_warnings: ImageQualityWarnings
} & UploadFileResponse

const CHALLENGE_RECITE = 'recite'
const CHALLENGE_MOVEMENT = 'movement'

export type ChallengePayload =
  | { type: typeof CHALLENGE_RECITE; query: number[] }
  | { type: typeof CHALLENGE_MOVEMENT; query: string }

export type ChallengeData = {
  challenges: ChallengePayload[]
  id: string
  switchSeconds: number
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
  valid: boolean
}

/* Callbacks */

export type SuccessCallback<T> = (response: T) => void
export type ErrorCallback = (request: ApiError) => void
