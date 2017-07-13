import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'
const ONFIDO_SDK_SERVER_URL = process.env.ONFIDO_SDK_SERVER_URL

const handleError = ({status, response}, callback) => {
  console.error(status, response)
  Tracker.sendError(`${status} - ${response}`)
  callback()
}

export const postToBackend = (payload, token, onSuccess, errorCallback) => {
  const endpoint = `${ONFIDO_SDK_SERVER_URL}/validate_document`
  const options = {
    payload, endpoint, token,
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}
