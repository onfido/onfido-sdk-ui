import type { ApiRawError, SuccessCallback } from '~types/api'

export type HttpRequestParams = {
  contentType?: string
  endpoint: string
  headers?: Record<string, string>
  payload?: string | FormData
  token: string
}

export const performHttpReq = <T>(
  { contentType, endpoint, headers, payload, token }: HttpRequestParams,
  onSuccess: SuccessCallback<T>,
  onError: (error: ApiRawError) => void
): void => {
  const request = new XMLHttpRequest()
  request.open('POST', endpoint)

  if (contentType) {
    request.setRequestHeader('Content-Type', contentType)
  }

  Object.entries(headers || {}).forEach(([key, value]) =>
    request.setRequestHeader(key, value)
  )

  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      try {
        const resp = JSON.parse(request.response)
        onSuccess(resp)
      } catch (error) {
        console.warn('Unparseable response:', request.response)
        onSuccess({} as T)
      }
    } else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send(payload)
}

export const getAuthConfig = (
  token: string,
  onSuccess: SuccessCallback<string>,
  onError: (error: ApiRawError) => void
): void => {
  const body = {
    sdk_type: 'onfido_web_sdk',
  }
  const request = new XMLHttpRequest()

  request.open('POST', `${process.env.AUTH_URL}/v3/auth_3d/session`)

  request.setRequestHeader('Authorization', token)
  request.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
  request.setRequestHeader('Content-Type', 'application/json')

  request.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      onSuccess(this.responseText)
    } else onError(request)
  }
  request.send(JSON.stringify(body))
}
