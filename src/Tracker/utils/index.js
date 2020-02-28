export const sendAnalytics = (payload) => {
  console.log('payload', payload)
  const request = new XMLHttpRequest()
  request.open('POST', 'https://analytics-sdk-dev.onfido.com/v1/import')
  request.setRequestHeader('Content-Type', "application/json")
  request.setRequestHeader('Authorization', "Basic M002Z3tQWURwWTlUanlDKDNRTHIqTDZOQ1hVY2FLZUU6")

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
