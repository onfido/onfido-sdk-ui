import { HttpRequestParams, performHttpRequest } from '~core/Network'
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
  url: string | undefined,
  token: string | undefined,
  onSuccess: SuccessCallback<ValidateDocumentResponse>,
  errorCallback: ErrorCallback
): void => {
  if (!url) {
    return errorCallback({
      response: {
        message: 'detect_document_url not provided',
      },
    })
  }

  if (!token) {
    return errorCallback({
      response: {
        message: 'token not provided',
      },
    })
  }

  const endpoint = `${url}/validate_document`

  const options: HttpRequestParams = {
    payload,
    endpoint,
    token,
    contentType: 'application/json',
  }

  performHttpRequest(options, onSuccess, (error) =>
    handleError(error, errorCallback)
  )
}
