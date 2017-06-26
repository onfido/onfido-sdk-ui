import { performHttpReq } from '../utils/http.js'
import forEach from 'object-loops/for-each'
const onfidoUrl = process.env.ONFIDO_URL
//Using hard-coded applicant_id while JWT v2 ready. This should not be pushed to origin
// const applicant_id = "hard-coded applicant_id"

export const postToOnfido = ({blob, documentType, side}, captureType, token) => {
  if (captureType === 'face') return sendFile({blob}, 'live_photos', token)
  sendFile({blob, type: documentType, side}, 'documents', token)
}

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const handleOnfidoError = (response) => {

}

const sendFile = ({blob, ...extraOptions}, path, token) => {
  //Temporary: in development I override the current JWT with the static token
  const endpoint = `${onfidoUrl}/${path}`
  const body = {
    file: blob,
    applicant_id,
    ...extraOptions
  }
  const requestParams = {
    payload: objectToFormData(body),
    url:`${process.env.ONFIDO_URL}/v2/${path}`,
    method: 'POST',
    contentType: 'multipart/form-data',
    token
  }
  performHttpReq(requestParams, (r) => console.log('ok', r), (response) => handleOnfidoError(response))
}
