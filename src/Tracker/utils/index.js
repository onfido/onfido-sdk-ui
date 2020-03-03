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

export const formatAnalytics = (woopra, eventName, properties) => {
  const woopraOptions = woopra.getOptionParams()
  const { alias, app, cookie, idle, instance, ka, language, meta, referrer, screen, vs } = woopraOptions
  const [ width, height ] = screen.split("x")

  return JSON.stringify({
    batch: [{
      idle,
      ka,
      language,
      meta,
      referrer,
      vs,
      anonymousId: cookie,
      channel: "Web SDK",
      context: {
        app: {
          name: instance,
          namespace: alias
        },
        library: {
          name: app, // I think the value here refers to the library used to capture the events
          version: woopra.version // I think the value here refers to the version of the library used to capture the events
        },
        screen: {
          width,
          height
        },
        ...woopra.visitorData // this returns the sdk_version and origin
      },
      event: eventName,
      properties,
      timestamp: woopra.last_activity,
      type: "track"
    }]
  })
}