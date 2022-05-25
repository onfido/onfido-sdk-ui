import type { ApiRawError, SuccessCallback } from '~types/api'

export type HttpRequestParams = {
  method?: 'GET' | 'POST' | 'PATCH'
  contentType?: string
  endpoint: string
  headers?: Record<string, string>
  payload?: string | FormData
  token: string
}

export const performHttpReq = <T>(
  {
    method = 'POST',
    contentType,
    endpoint,
    headers,
    payload,
    token,
  }: HttpRequestParams,
  onSuccess: SuccessCallback<T>,
  onError: (error: ApiRawError) => void
): void => {
  const request = new XMLHttpRequest()
  request.open(method, endpoint)

  if (contentType) {
    request.setRequestHeader('Content-Type', contentType)
  }

  Object.entries(headers || {}).forEach(([key, value]) =>
    request.setRequestHeader(key, value)
  )

  if (token) {
    request.setRequestHeader('Authorization', token)
  }

  request.onload = () => {
    if (
      request.status === 200 ||
      request.status === 201
    ) {
      const contentType = request.getResponseHeader('content-type')
      if (contentType && contentType.startsWith('application/json')) {
        onSuccess(JSON.parse(request.response))
      } else {
        onSuccess(request.response)
      }
    } else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send(payload)
}
