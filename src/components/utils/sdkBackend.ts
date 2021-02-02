import { performHttpReq } from './http'
import { formatError } from './onfidoApi'
import { trackException } from '../../Tracker'

import type {
  ApiError,
  ValidateDocumentResponse,
  ValidateDocumentExpiredTokenError,
  SuccessCallback,
  ErrorCallback,
} from '~types/api'

const handleError = (
  { status, response }: ApiError | ValidateDocumentExpiredTokenError,
  callback: ErrorCallback
) => {
  trackException(`${status} - ${response}`)

  if (typeof response === 'string') {
    callback({
      status,
      response: {
        error: { type: 'expired_token', message: response, fields: {} },
      },
    })
  } else {
    callback({ status, response })
  }
}

export const postToBackend = (
  payload: string,
  url: string,
  token: string,
  onSuccess: SuccessCallback<ValidateDocumentResponse>,
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
