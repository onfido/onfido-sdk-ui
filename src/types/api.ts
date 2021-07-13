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

type ValidationReasons =
  | 'attachment_content_type'
  | 'attachment'
  | 'document_detection'
  | 'detect_cutoff'
  | 'detect_glare'
  | 'detect_blur'

type ValidationError = {
  type: typeof API_ERROR_VALIDATION
  message: string
  fields: Partial<Record<ValidationReasons, string[]>>
}

export type ParsedError = {
  response: {
    error?: AuthorizationError | ExpiredTokenError | ValidationError
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

type ImageQualityWarnings = {
  detect_cutoff?: { valid: boolean }
  detect_glare?: { valid: boolean }
  detect_blur?: { valid: boolean }
}

export type DocumentImageResponse = {
  applicant_id: string
  type: DocumentTypes | PoaTypes
  side: DocumentSides
  issuing_country?: string
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

/* Callbacks */

export type SuccessCallback<T> = (response: T) => void
export type ErrorCallback = (error: ParsedError) => void
