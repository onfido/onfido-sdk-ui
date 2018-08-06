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

export const uploadLiveVideo = (data, token, onSuccess, onError) => {
  const {
    challenges: challenge,
    id: challenge_id,
    switchSeconds: challenge_switch_at
  } = data.challengeData
  // Temporary, need to update react-webcam to return the right blob.type
  const blobWithType = data.blob.slice(0, data.blob.size, "video/webm")
  const payload = { file: blobWithType, challenge: JSON.stringify(challenge), challenge_id, challenge_switch_at }
  const endpoint = `${process.env.ONFIDO_API_URL}/v2/live_videos`
  sendFile(endpoint, payload, token, onSuccess, onError)
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
