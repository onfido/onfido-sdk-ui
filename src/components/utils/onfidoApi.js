import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'
import forEach from 'object-loops/for-each'
import { humanizeField } from '../utils'

const formatError = ({response, status}, onError) =>
  onError({status, response: JSON.parse(response)})

export const uploadDocument = (data, token, onSuccess, onError) => {
  data['sdk_validations'] = {'detect_document': 'error', 'detect_glare': 'warn'}
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/documents`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const uploadLivePhoto = (data, token, onSuccess, onError) => {
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/live_photos`
  sendFile(endpoint, data, token, onSuccess, onError)
}


const objectToFormData = (object) => {
  const formData = new FormData()
  forEach(object, (value, key) => {
    const isObject = (value instanceof Object) && !(value instanceof File)
    value = isObject ? JSON.stringify(value) : value
    formData.append(key, value)
  })
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
