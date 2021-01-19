type MessagePayload = {
  message?: string
  type?: string
}

type ResponseObject = {
  error?: MessagePayload
} & MessagePayload

export type ApiRequest = {
  response: string | ResponseObject
  status: number
}

export type ApiResponse = {
  uuid?: string
  valid: boolean
}

export type SuccessCallback = (response: ApiResponse) => void
export type ErrorCallback = (request: ApiRequest) => void

export type ImageQualityValidationTypes =
  | 'detect_document'
  | 'detect_cutoff'
  | 'detect_glare'
  | 'detect_blur'

export type ImageQualityValidationPayload = Record<
  ImageQualityValidationTypes,
  'error' | 'warn'
>

type ChallengePayload =
  | { query: number[]; type: 'recite' }
  | { query: string; type: 'movement' }

export type ChallengeData = {
  challenges: ChallengePayload[]
  id: string
  switchSeconds: number
}
