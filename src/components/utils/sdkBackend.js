import { performHttpReq } from './http'
import {trackException} from '../../Tracker'

const handleError = ({status, response}, callback) => {
  trackException(`${status} - ${response}`)
  callback()
}

export const postToBackend = (payload, urls, token, onSuccess, errorCallback) => {
  const endpoint = `${urls.detect_document_v1_url}/validate_document`
  const options = {
    payload, endpoint, token,
    contentType: 'application/json'
  }
  performHttpReq(options, onSuccess, (response) => handleError(response, errorCallback))
}
