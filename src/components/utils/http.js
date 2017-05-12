const VALIDATE_DOCUMENT_ENDPOINT = 'https://sdk-staging.onfido.com/validate_document'

const reduceObj = (object, callback, initialValue) =>
  Object.keys(object).reduce(
    (accumulator, key) => callback(accumulator, object[key], key, object),
    initialValue)

const objectToFormData = (object) =>
  reduceObj(object, (formData, value, key) => {
    formData.append(key, value)
    return formData;
  }, new FormData())

export const postToServer = (options) => {
  const request = new XMLHttpRequest()
  request.open('POST', VALIDATE_DOCUMENT_ENDPOINT , true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.setRequestHeader('Authorization', options.token)
  // request.setRequestHeader('referer', 'http://lvh.me:8080')
  // request.setRequestHeader('Access-Control-Allow-Origin', 'http://lvh.me:8080')
  request.onload = function() {
    if (request.readyState === request.DONE) {
      console.log(request.responseText)
      console.log(request.status)
    }
  }

  request.onerror = (e) => {
    console.log('error', e, request.responseText)
  }

  const body = {
    file: options.image,
    type: options.documentType
  }

  request.send(objectToFormData(body))
}
