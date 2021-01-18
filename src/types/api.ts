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
  valid: boolean
}

export type SuccessCallback = (response: ApiResponse) => void
export type ErrorCallback = (request: ApiRequest) => void
