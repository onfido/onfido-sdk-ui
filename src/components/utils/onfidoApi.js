import { performHttpReq } from '../utils/http.js'
import forEach from 'object-loops/for-each'
const onfidoUrl = process.env.ONFIDO_URL
//Using hard-coded applicant_id while JWT v2 ready. This should not be pushed to origin
const applicant_id = "hard-coded applicant_id"

const errorType = (key, val) => {
  if (key === 'document_detection') return 'INVALID_CAPTURE'
  if (key === 'file') return 'INVALID_TYPE' // This error is only hit on corrupted PDF submission
  if (key === 'face_detection') {
    return val.indexOf('Multiple faces') === -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
  }
}

const identifyValidationError = (error) => {
  const fields = error.fields
  for (const key of Object.keys(fields)) {
    const val = fields[key]
    error = errorType(key, val[0])
  }
  return error
}

const getErrorMessage = (error, status) =>
  status === 422 ? identifyValidationError(error) : 'SERVER_ERROR'

const handleApiError = (request, callback) => {
  const response = JSON.parse(request.response)
  const error = getErrorMessage(response.error, request.status)
  callback(error)
}

export const postToOnfido = ({blob, documentType, side}, captureType, token, allowApiAdvancedValidation, onSuccess, onError) => {
  if (captureType === 'face') return sendFile({blob}, 'live_photos', token, onSuccess, (request) => handleApiError(request, onError))
  sendFile({blob, type: documentType, side, advanced_validation: allowApiAdvancedValidation}, 'documents', token, onSuccess, (request) => handleApiError(request, onError))
}

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const sendFile = ({blob, ...extraOptions}, path, token, onSuccess, onError) => {
  const bodyOptions = {
    file: blob,
    applicant_id,
    ...extraOptions
  }
  const requestParams = {
    payload: objectToFormData(bodyOptions),
    endpoint: `${onfidoUrl}/v2/${path}`,
    token
  }
  performHttpReq(requestParams, onSuccess, onError)
}
