export const performHttpReq = ({payload, endpoint, contentType, token}, onSuccess, onError) => {
  console.log('in performHttpReq')
  const request = new XMLHttpRequest()
  request.open('POST', endpoint)
  if (contentType) {
    request.setRequestHeader('Content-Type', contentType)
  }
  request.setRequestHeader('Authorization', token)

  request.onload = () => {
    console.log('in onLoad')
    if (request.status === 200 || request.status === 201) {
      console.log(request.response)
      onSuccess(JSON.parse(request.response))}
    else {
      console.log('in on error', request.response)
      onError(request)
    }
  }
  request.onerror = () => {
    console.log('in onerror')
    onError(request)
  }

  console.log('about to call request.send', payload)

  request.send(payload)
}
