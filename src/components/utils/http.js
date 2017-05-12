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

export const postToServer = (payload, serverUrl, token) => {
  const request = new XMLHttpRequest()
  const url = serverUrl ? serverUrl : SDK_SERVER_URL
  request.open('POST', `${url}/confirm_document`)
  request.setRequestHeader('Content-Type', 'application/json')

  request.onload = () => {
    if (request.readyState === request.DONE) {
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText)
      } else {
        console.log(request.error)
      }
    }
  }
  request.send(payload)
}
