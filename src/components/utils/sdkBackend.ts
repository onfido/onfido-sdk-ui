import { performHttpReq } from './http'
import { formatError } from './onfidoApi'
import { trackException } from '../../Tracker'

import type { ApiRequest, ErrorCallback, SuccessCallback } from '~types/api'

const handleError = (
  { status, response }: ApiRequest,
  callback: ErrorCallback
) => {
  trackException(`${status} - ${response}`)
  callback({ status, response })
}

export const postToBackend = (
  payload: string,
  url: string,
  token: string,
  onSuccess: SuccessCallback,
  errorCallback: ErrorCallback
): void => {
  const endpoint = `${url}/validate_document`

  const options = {
    payload,
    endpoint,
    token,
    contentType: 'application/json',
  }

  performHttpReq(options, onSuccess, (response) =>
    formatError(response, () => handleError(response, errorCallback))
  )
}
