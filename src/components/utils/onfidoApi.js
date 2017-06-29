import { performHttpReq } from '../utils/http.js'
import forEach from 'object-loops/for-each'
const onfidoUrl = process.env.ONFIDO_URL
//Using hard-coded applicant_id while JWT v2 ready. This should not be pushed to origin
// const applicant_id = "hard-coded applicant_id"

const handleApiError = (request, callback) => {
  const response = JSON.parse(request.responseText)
  const fields = response.error.fields
  callback()
}

export const postToOnfido = ({blob, documentType, side}, captureType, token, onSuccess, onError) => {
  if (captureType === 'face') return sendFile({blob}, 'live_photos', token, onSuccess, onError)
  sendFile({blob, type: documentType, side}, 'documents', token, onSuccess, onError)
}

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const sendFile = ({blob, ...extraOptions}, path, token, onSuccess, onError) => {
  //Temporary: in development I override the current JWT with the static token
  const body = {
    file: blob,
    applicant_id,
    ...extraOptions
  }
  const requestParams = {
    payload: objectToFormData(body),
    url:`${onfidoUrl}/v2/${path}`,
    method: 'POST',
    contentType: 'multipart/form-data',
    token
  }
  performHttpReq(requestParams, onSuccess, onError)
}
