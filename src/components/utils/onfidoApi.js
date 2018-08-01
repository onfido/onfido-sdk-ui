import { performHttpReq } from '../utils/http'
import forEach from 'object-loops/for-each'
import { isOfFileType } from '../utils/file.js'

const formatError = ({response, status}, onError) =>
  onError({status, response: JSON.parse(response)})

const sdkValidations = (data) => {
  const detectDocument =  {'detect_document': 'error'}
  if (!isOfFileType(['pdf'], data.file)) return {...detectDocument, 'detect_glare': 'warn'}
  return detectDocument
}

const identity = value => value

const endpointUploader = (endpoint, transform = identity) => {
  const url = `${process.env.ONFIDO_API_URL}/v2/${endpoint}`
  return (data, token, onSuccess, onError) => {
    sendFile(url, transform(data), token, onSuccess, onError)
  }
}

export const uploadDocument = endpointUploader('documents', data => ({
  ...data,
  sdk_validations:  JSON.stringify(sdkValidations(data)),
}))

export const uploadLivePhoto = endpointUploader('live_photos')

export const uploadLiveVideo = endpointUploader('live_videos', data => ({
  ...data,
  challenge: JSON.stringify(data.challenge),
}))

const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => formData.append(key, value))
  return formData
}

const sendFile = (endpoint, data, token, onSuccess, onError) => {
  data = {
    ...data,
    sdk_source: 'onfido_web_sdk',
    sdk_version: process.env.SDK_VERSION,
  }

  const requestParams = {
    payload: objectToFormData(data),
    endpoint,
    token: `Bearer ${token}`
  }
  performHttpReq(requestParams, onSuccess, (request) => formatError(request, onError))
}
