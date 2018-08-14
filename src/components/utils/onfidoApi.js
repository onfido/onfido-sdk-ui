import { performHttpReq } from '../utils/http'
import forEach from 'object-loops/for-each'

const formatError = ({response, status}, onError) =>
  onError({status, response: JSON.parse(response)})

export const uploadDocument = (data, token, onSuccess, onError) => {
  const {validations, ...other} = data
  data = {
    ...other,
    sdk_validations: JSON.stringify(validations)
  }
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/documents`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const uploadLivePhoto = (data, token, onSuccess, onError) => {
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/live_photos`
  sendFile(endpoint, data, token, onSuccess, onError)
}

export const getLivenessChallenges = (onSuccess/*, onError*/) => {
  /*
  @todo, configure real request
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/liveness`
  sendFile(endpoint, {}, token, onSuccess, onError)
  */
  return onSuccess([
    {
      type: 'moveHead',
      value: 'left',
    },
    {
      type: 'repeatDigits',
      value: [1, 3, 4],
    }
  ])
}

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
