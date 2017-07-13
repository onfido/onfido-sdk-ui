import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'
const SDK_SERVER_URL = 'https://sdk.onfido.com'

const handleError = ({status, response}, callback) => {
  console.error(status, response)
  Tracker.sendError(`${status} - ${response}`)
  callback()
}

export const postToBackend = (payload, serverUrl, token, onSuccess, errorCallback) => {
  const endpoint = `${serverUrl ? serverUrl : SDK_SERVER_URL}/validate_document`
  const options = {
    payload, endpoint, token,
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}
