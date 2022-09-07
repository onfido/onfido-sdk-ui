import {
  ApiRawError,
  HttpRequestParams,
  IMiddleware,
  onMiddlewareError,
  onRequestErrorResponse,
  SuccessCallback,
} from './types'

export type NetworkProps = {
  middleware?: IMiddleware[]
  onMiddlewareError?: onMiddlewareError
  onRequestErrorResponse?: onRequestErrorResponse
}

export class Network {
  private middleware: NetworkProps['middleware'] = []
  private onMiddlewareError?: onMiddlewareError
  private onRequestErrorResponse?: onRequestErrorResponse

  constructor({
    middleware,
    onMiddlewareError,
    onRequestErrorResponse,
  }: NetworkProps = {}) {
    this.middleware = middleware || []
    this.onMiddlewareError = onMiddlewareError
    this.onRequestErrorResponse = onRequestErrorResponse
  }

  // Note: Legacy name
  public performHttpRequest = <T>(
    httpRequestParams: HttpRequestParams,
    onSuccess: SuccessCallback<T>,
    onError: (error: ApiRawError) => void
  ) => {
    this.executeHttpRequest(
      this.applyMiddleware(httpRequestParams),
      onSuccess,
      onError
    )
  }

  private applyMiddleware = (
    httpRequestParams: HttpRequestParams
  ): HttpRequestParams => {
    return (this.middleware || []).reduce(
      (reducedHttpRequestParams, middleware) => {
        let result

        if (middleware && typeof middleware === 'function') {
          try {
            result = middleware(httpRequestParams)
          } catch (e) {
            result = null

            if (this.onMiddlewareError) {
              this.onMiddlewareError(e as Error, httpRequestParams)
            } else {
              throw e
            }
          }
        }

        return result || reducedHttpRequestParams
      },
      httpRequestParams
    )
  }

  private executeHttpRequest = <T>(
    httpRequestParams: HttpRequestParams,
    onSuccess: SuccessCallback<T>,
    onError: (error: ApiRawError) => void
  ) => {
    const {
      method = 'POST',
      contentType,
      endpoint,
      headers,
      payload,
      token,
    } = httpRequestParams

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

    // @ts-ignore
    const sessionId = window.sessionId
    if (process.env.NODE_ENV !== 'production' && sessionId) {
      request.setRequestHeader('X-Session-Id', sessionId)
    }

    // TODO: Provide consistent api
    request.onload = () => {
      if (request.status === 200 || request.status === 201) {
        const contentType = request.getResponseHeader('content-type')

        if (contentType && /^application\/json/.test(contentType)) {
          onSuccess(JSON.parse(request.response))
        } else {
          onSuccess(request.response)
        }
      } else if (request.status === 204) {
        onSuccess(request.response)
      } else {
        this.onRequestError(onError, httpRequestParams, request)
      }
    }
    request.onerror = () =>
      this.onRequestError(onError, httpRequestParams, request)

    request.send(payload)
  }

  private onRequestError = (
    onError: (error: ApiRawError) => void,
    httpRequestParams: HttpRequestParams,
    request: XMLHttpRequest
  ) => {
    onError && onError(request)
    if (this.onRequestErrorResponse) {
      this.onRequestErrorResponse(request, httpRequestParams)
    }
  }
}
