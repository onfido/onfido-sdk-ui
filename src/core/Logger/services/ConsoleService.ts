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
    let log: unknown[] = [
      `[${data.labels.join(',')}:${data.level}] ${data.message}`,
    ]

    if (this.environment !== 'production') {
      log = log.concat([
        data.metadata,
        { line: data.line, file: data.file, method: data.method },
      ])
    }

    console.log(...log)
  }
}
