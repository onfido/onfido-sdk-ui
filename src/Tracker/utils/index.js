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

export const formatAnalytics = (woopra, eventName, properties) =>
  JSON.stringify({
    batch: [{
      anonymousId: woopra.cookie,
      channel: "Web SDK",
      context: {
        app: {
          name: woopra.instanceName,
          namespace: woopra.options.domain
        },
        library: {
          name: "analytics-js", //made up values, I don't know what this is
          version: "0.0.0" //made up values, I don't know what this is
        },
        screen: {
          height: 480, //made up values, it will break without
          width: 320 //made up values, it will break without
        },
        ...woopra.visitorData
      },
      event: eventName,
      properties,
      timestamp: woopra.last_activity,
      type: "track"
    }]
  })
