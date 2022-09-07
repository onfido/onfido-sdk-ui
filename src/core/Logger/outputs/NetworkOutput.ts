import { Queue } from '../Queue'
import type { LogData, EnvironmentType, OutputInterface } from '../types'
import { performHttpRequest } from '~core/Network'
import { reduxStore } from 'components/ReduxAppWrapper'
import { createAnalyticsPayload } from '~core/Analytics/createAnalyticsPayload'

let token: string | undefined
let url: string | undefined

export class NetworkOutput implements OutputInterface {
  private queue: Queue<unknown>

  constructor() {
    this.queue = new Queue<unknown>({
      limit: 1, // Note: Send directly until we find a reliable way to listen to SDK unmount, should be 20.
      paused: true,
      flushListener: this.onFlush,
    })

    this.listenToReduxStore()
  }

  // Wait for url & token to be available
  private listenToReduxStore() {
    reduxStore.subscribe(() => {
      const store = reduxStore.getState()

      token = store.globals.token
      url = store.globals.urls.onfido_api_url

      if (token && url) {
        this.queue.resume()
      }
    })
  }

  // Send to backend
  private onFlush = (data: unknown[]) => {
    performHttpRequest(
      {
        method: 'POST',
        contentType: 'application/json',
        endpoint: `${url}/v4/sdk/logger`,
        token: `Bearer ${token}`,
        payload: JSON.stringify({ events: data }),
      },
      this.onNetworkSucces,
      this.onNetworkError
    )
  }

  private createLogPayload(data: LogData) {
    return createAnalyticsPayload({
      event: `LOG_${data.level.toUpperCase()}`,
      properties: {
        log_labels: data.labels,
        log_level: data.level,

        // TODO: align with other SDKs
        log_metadata: {
          message: data.message,
          metadata: data.metadata,
          file: data.file,
          method: data.method,
          line: data.line,
        },
      },
    })
  }

  // TODO: track network error automatically, maybe fallback to Sentry?
  private onNetworkSucces() {}
  private onNetworkError() {}

  public write(data: LogData, environment: EnvironmentType) {
    if (
      environment === 'production' &&
      data.level !== 'error' &&
      data.level !== 'fatal'
    ) {
      this.queue.push(this.createLogPayload(data))
      return true
    }

    return false
  }
}
