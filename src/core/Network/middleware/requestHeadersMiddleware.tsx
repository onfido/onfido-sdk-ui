import type { HttpRequestParams } from '~modules/Network'

export default (httpRequestData: HttpRequestParams) => {
  if (!httpRequestData.headers) {
    httpRequestData.headers = {}
  }

  httpRequestData.headers['x-onfido-sdk-platform'] = 'web'
  httpRequestData.headers['x-onfido-sdk-version'] = process.env.SDK_VERSION!

  return httpRequestData
}
