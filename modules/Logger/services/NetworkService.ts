import type { DataPackage, EnviromentType, ServiceInterface } from '../types'

export class NetworkService implements ServiceInterface {
  environment: EnviromentType = 'production'
  token?: string = undefined

  queue: DataPackage[] = []

  constructor({ environment }: { environment?: EnviromentType } = {}) {
    this.environment = environment || this.environment
    return this
  }

  public dispatch(data: DataPackage) {
    // TODO: filter by feature flags
    this.queue.push(data)
    console.log(`[Logger][Network] queue size=${this.queue.length}`)
    // if (this.environment === 'production') {
    //   if (data.level === 'fatal') {
    //     this.log(data)
    //     return true
    //   }

    //   return false
    // }

    // if (this.environment !== 'development') {
    //   this.log(data)
    //   return true
    // }

    return false
  }
}
