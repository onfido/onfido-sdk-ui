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

type ChallengeResponse = {
  id: string
  challenge: ChallengePayload[]
}

export type ApiResponse = {
  data?: ChallengeResponse // | or something
  uuid?: string
  valid: boolean
}
