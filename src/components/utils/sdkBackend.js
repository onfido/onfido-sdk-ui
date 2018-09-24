import { performHttpReq } from '../utils/http'
import Tracker from '../../Tracker'

const handleError = ({status, response}, callback) => {
  Tracker.trackException(`${status} - ${response}`)
  callback()
}

export const postToBackend = (payload, token, onSuccess, errorCallback) => {
  const endpoint = `${process.env.ONFIDO_SDK_URL}/validate_document`
  const options = {
    payload, endpoint, token,
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}
