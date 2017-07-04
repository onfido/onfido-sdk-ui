import { performHttpReq } from '../utils/http.js'
import forEach from 'object-loops/for-each'
const onfidoUrl = process.env.ONFIDO_URL
//Using hard-coded applicant_id while JWT v2 ready. This should not be pushed to origin
const applicant_id = "hard-coded applicant_id"

const errorType = (key, val) => {
  // Comment to myself. I don't think the advenced validation is ever needed
  if (key === 'document_detection') return 'INVALID_CAPTURE'
  if (key === 'face_detection') {
    return val.indexOf('Multiple faces') !== -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
  }
  // What are we returning for 500 errors or for JWT authentication errors?
}

const buildErrorMessage = (error) => {
  const fields = error.fields
  const errors = []
  for (const key of Object.keys(fields)) {
    const val = fields[key]
    errors.push(errorType(key, val))
  }
  // Comment to myself. Even if we are returning an array, the state will always be the first element, this needs to be considered
  return errors
}

const handleApiError = (request, callback) => {
  const response = JSON.parse(request.response)
  const error = buildErrorMessage(response.error)
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
  //Temporary: in development I override the current JWT with the static token
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
