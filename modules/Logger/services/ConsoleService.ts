import type { DataPackage, EnviromentType, ServiceInterface } from '../types'

export class ConsoleService implements ServiceInterface {
  environment: EnviromentType = 'production'

  constructor({ environment }: { environment?: EnviromentType } = {}) {
    this.environment = environment || this.environment
    return this
  }

  public dispatch(data: DataPackage) {
    if (this.environment === 'production') {
      if (data.level === 'fatal') {
        this.log(data)
        return true
      }

      return false
    }

    if (this.environment === 'development') {
      this.log(data)
      return true
    }

    return false
  }

  private log(data: DataPackage) {
    console.log(
      `[${data.labels.join(',')}:${data.level}] ${data.message}`,
      data.metadata
    )
  }
}
