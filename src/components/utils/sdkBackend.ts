import { performHttpReq } from './http'
import { formatError } from './onfidoApi'
import { trackException } from '../../Tracker'

import type {
  ApiRawError,
  ValidateDocumentResponse,
  SuccessCallback,
  ErrorCallback,
} from '~types/api'

const handleError = (
  { status, response }: ApiRawError,
  callback: ErrorCallback
) => {
  trackException(`${status} - ${response}`)

  if (response === 'Token has expired.') {
    callback({
      status,
      response: {
        error: { type: 'expired_token', message: response, fields: {} },
      },
    })
  } else {
    formatError({ status, response }, callback)
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

  performHttpReq(options, onSuccess, (error) =>
    handleError(error, errorCallback)
  )
}
