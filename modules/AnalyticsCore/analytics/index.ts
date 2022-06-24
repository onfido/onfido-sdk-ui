// @ts-nocheck

class AnalyticsService {
  network = undefined
  options = {
    url: 'http://default',
  }

  constructor(props) {
    this.network = props.network
  }

  dispatchToNetwork = (data) => {
    this.network.dispatch({
      url: this.options.url,
      data,
    })
  }
}

export class InhouseService extends AnalyticsService {
  options = {
    url: 'http://inhouse',
  }

  dispatch = (data) => {
    data.meta = {
      sdk_source: 'web',
    }

    this.dispatchToNetwork(data)
  }
}

export class WoopraService extends AnalyticsService {
  options = {
    url: 'http://woopra',
  }

  dispatch = (data) => {
    data.meta = {
      sdk_source: 'web',
    }

    this.dispatchToNetwork(data)
  }
}

class AnalyticsInterface {
  services = {}
  options = {
    mapEvent: undefined,
  }

  constructor(props) {
    this.services = props.services || this.services
    this.options = props.options || this.options // Combine?
  }

  dispatch = (eventData) => {
    let serviceData

    if (this.options.mapEvent) {
      serviceData = this.options.mapEvent(eventData)
    }

    Object.keys(serviceData || this.services).map((serviceName) => {
      let data = serviceData ? serviceData[serviceName] || eventData : eventData

      if (!this.services[serviceName]) {
        console.error('service can not be found')
        return
      }

      this.services[serviceName].map((i) => {
        data = typeof i === 'function' ? i(data) : i.dispatch(data)
      })
    })
  }
}

export class Analytics extends AnalyticsInterface {
  sendEvent = (eventName: string, properties: Record<string, unknown>) => {
    this.dispatch({
      eventName,
      properties,
    })
  }

  sendScreenEvent = (
    screenName: string,
    properties: Record<string, unknown>
  ) => {
    this.dispatch({
      screenName,
      properties,
    })
  }
}

export class ReactAnalytics {
  analytics = undefined

  constructor(analytics: Analytics) {
    this.analytics = analytics
  }

  trackComponent = (Component, screenName: string) => {
    this.analytics.sendScreenEvent(screenName, {})
  }
  appendToTracking = (Component, ancestorScreenNameHierarchy: string) => {
    this.analytics.sendScreenEvent(ancestorScreenNameHierarchy, {})
  }
}
