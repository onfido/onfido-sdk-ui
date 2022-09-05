/* 
  Architectural flow:
  - Instances -> Central place -> Services (console, network)

  Responsibilities:
    - Be central place to collect all logs from instances and dispatch them to available services
    - Provide log instances
*/
import { LogInstance } from './LogInstance'
import type { DataPackage, EnvironmentType, ServicesType } from './types'

export class Logger {
  private services: ServicesType = {}
  private environment: EnvironmentType = 'production'

  constructor(props: { environment: EnvironmentType, services: ServicesType }) {
    this.services = props?.services
    this.environment = props?.environment || this.environment

    if (!this.services) {
      throw new Error('There are no services provided to the logger')
    }
  }

  private dispatch = (data: DataPackage) => {
    Object.values(this.services || {}).forEach((service) => {
      if (service?.dispatch) {
        service.dispatch(data)
      }
    })
  }

  public createInstance(label: string) {
    return new LogInstance(label, this.dispatch)
  }
}
