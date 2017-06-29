import { events } from '../../core'
import Tracker from '../../Tracker'
const SDK_SERVER_URL = 'https://sdk.onfido.com'

const reduceObj = (object, callback, initialValue) =>
  Object.keys(object).reduce(
    (accumulator, key) => callback(accumulator, object[key], key, object),
    initialValue)

const handleError = ({status, response}, callback) => {
  console.error(status, response)
  Tracker.sendError(`${status} - ${response}`)
  callback()
}

export const postToServer = (payload, serverUrl, token, onSuccess, errorCallback) => {
  const url = `${serverUrl ? serverUrl : SDK_SERVER_URL}/validate_document`
  const options = {
    payload, url, token,
    method: 'POST',
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}

export const performHttpReq = ({payload, method, url, contentType, token}, onSuccess, onError) => {
  const request = new XMLHttpRequest()
  request.open(method, url)
  request.setRequestHeader('Content-Type', contentType)
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200) {
      onSuccess(JSON.parse(request.response))}
    else {
      onError(request)
    }
  }

  request.onerror = () => onError(request)

  request.send(payload)
}
