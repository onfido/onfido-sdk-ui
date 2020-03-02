export const sendAnalytics = (payload) => {
  const request = new XMLHttpRequest()
  request.open('POST', 'https://analytics-sdk-dev.onfido.com/v1/import')
  request.setRequestHeader('Content-Type', "application/json")
  request.setRequestHeader('Authorization', "Basic M002Z3tQWURwWTlUanlDKDNRTHIqTDZOQ1hVY2FLZUU6")

  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      console.log("Event sent", request.response)
    }
    else {
      console.log("Request failed", request)
    }
  }
  request.onerror = () => console.log("Something went wrong", request)

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
          name: "analytics-js", // I think the value here probably refer to the library used to capture the events
          version: "0.0.0" // I think the value here probably refer to the version of the library used to capture the events
        },
        ...woopra.getOptionParams(), // this returns key and values for screen, referrer, hostname, language. etc. Some values might be redundant and might need cleaning up
        ...woopra.visitorData // this returns the sdk_version and origin
      },
      event: eventName,
      properties,
      timestamp: woopra.last_activity,
      type: "track"
    }]
  })
