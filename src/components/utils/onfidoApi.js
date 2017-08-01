import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'
import forEach from 'object-loops/for-each'
import { humanizeField } from '../utils'

const errorType = (key, val) => {
  if (key === 'document_detection') return 'INVALID_CAPTURE'
  // on corrupted PDF or other unsupported file types
  if (key === 'file') return 'INVALID_TYPE'
  // hit on PDF/invalid file type submission for face detection
  if (key === 'attachment' || key === 'attachment_content_type') return 'UNSUPPORTED_FILE'
  if (key === 'face_detection') {
    return val.indexOf('Multiple faces') === -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
  }
}

const identifyValidationError = (error) => {
  const fields = error.fields
  for (const key of Object.keys(fields)) {
    const val = fields[key]
    console.warn(humanizeField(key), val)
    error = errorType(key, val[0])
  }
  return error
}

const serverError = ({status, response}) => {
  Tracker.sendError(`${status} - ${response}`)
  return 'SERVER_ERROR'
}

const handleError = (request, callback) => {
  const response = JSON.parse(request.response)
  const error = request.status === 422 ?
    identifyValidationError(response.error) :
    serverError(request)
  callback(error)
}

export const uploadDocument = (data, token, onSuccess, onError) => {
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/documents`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const uploadLivePhoto = (data, token, onSuccess, onError) => {
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/live_photos`
  sendFile(endpoint, data, token, onSuccess, onError)
}

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const sendFile = (endpoint, data, token, onSuccess, onError) => {
  data['sdk_source'] = 'onfido_web_sdk'
  data['sdk_version'] = process.env.SDK_VERSION

  const requestParams = {
    payload: objectToFormData(data),
    endpoint,
    token: `Bearer ${token}`
  }
  performHttpReq(requestParams, onSuccess, (request) => handleError(request, onError))
}
