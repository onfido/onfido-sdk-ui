import type { DataPackage, EnvironmentType, ServiceInterface } from '../types'

export type NetworkServiceProps = {
  environment?: EnvironmentType

  enabled?: boolean
  labels?: string[]
  levels?: string[]
}

export class NetworkService implements ServiceInterface {
  environment: EnvironmentType = 'production'
  enabled?: boolean = false
  labels?: string[] = []
  levels?: string[] = []

  queue: DataPackage[] = []

  constructor(props: NetworkServiceProps = {}) {
    this.setConfiguration(props)
    return this
  }

  setConfiguration(props: NetworkServiceProps = {}) {
    this.environment = props.environment || this.environment
    this.enabled = props.enabled || this.enabled
    this.labels = props.labels || this.labels
    this.levels = props.levels || this.levels
  }

  public dispatch(data: DataPackage) {
    console.log('dispatch', data)
    if (!this.enabled) {
      return false
    }

    this.queue.push(data)

    if (this.queue.length >= 20) {
      this.flush()
    }

    return true
  }

  private flush() {
    console.log('[NetworkService] - flush queue:', this.queue.length)
    this.queue = []
  }
}
