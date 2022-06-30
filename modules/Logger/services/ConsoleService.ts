import type { DataPackage, EnviromentType, ServiceInterface } from '../types'

// TODO: Remote configurability for labels and levels
export class ConsoleService implements ServiceInterface {
  environment: EnviromentType = 'production'

  constructor({ environment }: { environment?: EnviromentType } = {}) {
    this.environment = environment || this.environment
    return this
  }

  public dispatch(data: DataPackage) {
    if (this.environment === 'development') {
      this.log(data)
      return true
    }

    if (this.environment === 'production' && data.level === 'fatal') {
      this.log(data)
      return true
    }

    return false
  }

  private log(data: DataPackage) {
    console.log(
      `[Console] label=${data.label} level=${data.level} message=${data.message} data=`,
      data
    )
  }
}
