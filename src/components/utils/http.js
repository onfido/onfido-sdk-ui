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
