export const sendAnalytics = (payload) => {
  console.log('payload', payload)
  const request = new XMLHttpRequest()
  request.open('POST', 'https://analytics-sdk.onfido.com/v1/import')
  request.setRequestHeader('Authorization', "Basic UAaNtJm6qP42NW43HUioHkuz3yo7egZC")

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      console.log(request.response)
    }
    else {
      console.log(request)
    }
  }
  request.onerror = () => console.log(request)

  request.send(payload)
}
