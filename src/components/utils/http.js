import { events } from 'onfido-sdk-core'
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

export const postToServer = (payload, serverUrl, token, onComplete) => {
  const request = new XMLHttpRequest()
  const url = serverUrl ? serverUrl : SDK_SERVER_URL
  request.open('POST', `${url}/validate_document`)
  request.responseType = 'json'
  request.setRequestHeader('Content-Type', 'application/json')
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    if (request.readyState === request.DONE) {
      const response = request.status === 200 ? request.response : {error: true}
      onComplete(response)
    }
  }
  request.send(payload)
}
