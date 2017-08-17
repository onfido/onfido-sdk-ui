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

export const shortenUrl = (longUrl, onSuccess, onError) => {
  const request = new XMLHttpRequest()
  const key = process.env.URL_SHORTENER_KEY
  const url = `https://www.googleapis.com/urlshortener/v1/url?key=${key}`
  request.open('POST', url)
  request.setRequestHeader('Content-Type', 'application/json')

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      onSuccess(JSON.parse(request.response))}
    else {
      onError(request)
    }
  }
  request.onerror = () => onError(request)
  request.send({longUrl})
}
