import type { ErrorCallback, SuccessCallback } from '~types/api'

export type HttpRequestParams = {
  contentType?: string
  endpoint: string
  payload?: string | FormData
  token: string
}

export const performHttpReq = (
  { contentType, endpoint, payload, token }: HttpRequestParams,
  onSuccess: SuccessCallback,
  onError: ErrorCallback
): void => {
  const request = new XMLHttpRequest()
  request.open('POST', endpoint)

  if (contentType) {
    request.setRequestHeader('Content-Type', contentType)
  }

  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      onSuccess(JSON.parse(request.response))
    } else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send(payload)
}
