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
