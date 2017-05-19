import { events } from 'onfido-sdk-core'
import Tracker from '../../Tracker'
const SDK_SERVER_URL = 'https://sdk.onfido.com'

const reduceObj = (object, callback, initialValue) =>
  Object.keys(object).reduce(
    (accumulator, key) => callback(accumulator, object[key], key, object),
    initialValue)

const objectToFormData = (object) =>
  reduceObj(object, (formData, value, key) => {
    formData.append(key, value)
    return formData;
  }, new FormData())

const handleError = (message, callback) => {
  Tracker.sendError(message)
  callback()
}

export const postToServer = (payload, serverUrl, token, onSuccess, onError) => {
  const request = new XMLHttpRequest()
  const url = serverUrl ? serverUrl : SDK_SERVER_URL
  request.open('POST', `${url}/validate_document`)
  request.responseType = 'json'
  request.setRequestHeader('Content-Type', 'application/json')
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    request.status === 200 ? onSuccess(request.response) : handleError('server error', onError)
  }

  request.onerror = () => handleError('request failed', onError)

  request.send(payload)
}
