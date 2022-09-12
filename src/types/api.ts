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
const API_ERROR_GEOBLOCKED = 'geoblocked_request'

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

type GeoblockedError = {
  type: typeof API_ERROR_GEOBLOCKED
} & ApiErrorPayload

export type ParsedError = {
  response: {
    error?:
      | AuthorizationError
      | ExpiredTokenError
      | ValidationError
      | AccessDeniedError
      | UnknownError
      | GeoblockedError
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

export type ActiveVideoResponse = {
  media: {
    data: {
      content_type: string
      file_size: number
    }
    uuid: string
  }
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

export type PoASupportedCountry = {
  country_alpha3: string
  country_alpha2: string
  country: string
  document_types: PoaTypes[]
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
