import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'
import forEach from 'object-loops/for-each'
import { humanizeField } from '../utils'

const formatError = ({response, status}) => ({status, response: JSON.parse(response)})

export const postToOnfido = ({blob, documentType, side}, captureType, token, onSuccess, onError) => {
  if (captureType === 'face') {
    return sendFile(
      {blob},
      'live_photos',
      token,
      onSuccess,
      request => onError(formatError(request))
    )
  }
  sendFile(
    {blob, type: documentType, side, advanced_validation: true},
    'documents',
    token,
    onSuccess,
    request => onError(formatError(request))
  )
}

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const sendFile = ({blob, ...extraOptions}, path, token, onSuccess, onError) => {
  const bodyOptions = {
    file: blob,
    sdk_source: 'onfido_web_sdk',
    sdk_version: process.env.SDK_VERSION,
    ...extraOptions
  }
  const requestParams = {
    payload: objectToFormData(bodyOptions),
    endpoint: `${process.env.ONFIDO_API_URL}/v2/${path}`,
    token: `Bearer ${token}`
  }
  performHttpReq(requestParams, onSuccess, onError)
}
