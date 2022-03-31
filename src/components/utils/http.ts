import type { ApiRawError, SuccessCallback } from '~types/api'

export type HttpRequestParams = {
  contentType?: string
  endpoint: string
  headers?: Record<string, string>
  payload?: string | FormData
  token: string
  method?: 'GET' | 'POST' | 'PATCH'
}

export const performHttpReq = <T>(
  {
    contentType,
    endpoint,
    headers,
    payload,
    token,
    method = 'POST',
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

  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
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
