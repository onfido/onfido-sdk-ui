export class AnalyticsInterface {
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
