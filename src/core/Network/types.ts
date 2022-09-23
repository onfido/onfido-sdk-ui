export type HttpRequestParams = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT'
  contentType?: string
  endpoint: string
  headers?: Record<string, string>
  payload?: string | FormData
  token?: string
}

export type IMiddleware = (
  httpRequestData: HttpRequestParams
) => void | HttpRequestParams

export type SuccessCallback<T> = (response: T) => void
export type ErrorCallback = (error: ApiRawError) => void
export type ApiRawError = {
  response: string
  status: number
}

export type onMiddlewareError = (
  error: Error,
  httpRequestParams: HttpRequestParams
) => void

export type onRequestErrorResponse = (
  request: XMLHttpRequest,
  httpRequestParams: HttpRequestParams
) => void
