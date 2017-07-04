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

export const postToServer = (payload, serverUrl, token, onSuccess, onError) => {
  const request = new XMLHttpRequest()
  const url = serverUrl ? serverUrl : SDK_SERVER_URL
  request.open('POST', `${url}/validate_document`)
  // This line doesn't work on IE on Win7, use JSON.parse() instead
  // request.responseType = 'json'
  request.setRequestHeader('Content-Type', 'application/json')
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200) {
      onSuccess(JSON.parse(request.response))}
    else {
      handleError(request, onError)
    }
  }

  request.onerror = () => handleError(request, onError)

  request.send(payload)
}
