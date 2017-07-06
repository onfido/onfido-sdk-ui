import { events } from '../../core'
import Tracker from '../../Tracker'
const SDK_SERVER_URL = 'https://sdk.onfido.com'

const handleError = ({status, response}, callback) => {
  console.error(status, response)
  Tracker.sendError(`${status} - ${response}`)
  callback()
}

export const postToServer = (payload, serverUrl, token, onSuccess, errorCallback) => {
  const endpoint = `${serverUrl ? serverUrl : SDK_SERVER_URL}/validate_document`
  const options = {
    payload, endpoint, token,
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}

export const performHttpReq = ({payload, endpoint, contentType, token}, onSuccess, onError) => {
  const request = new XMLHttpRequest()
  request.open('POST', endpoint)
  if (contentType) {
    request.setRequestHeader('Content-Type', contentType)
  }
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      onSuccess(JSON.parse(request.response))}
    else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)

  request.send(payload)
}
