import { Queue } from '../Queue'
import type { LogData, EnvironmentType, OutputInterface } from '../types'
import { performHttpRequest } from '~core/Network'
import { reduxStore } from 'components/ReduxAppWrapper'
import { createAnalyticsPayload } from '~core/Analytics/createAnalyticsPayload'
import { SdkConfiguration } from '~core/SdkConfiguration/types'

let token: string | undefined
let url: string | undefined
let sdkConfiguration: SdkConfiguration | undefined

export class NetworkOutput implements OutputInterface {
  private queue: Queue<unknown>
  private waitingList: LogData[] = []

  constructor() {
    this.queue = new Queue<unknown>({
      limit: 1, // Note: Send directly until we find a reliable way to listen to SDK unmount, should be 20.
      paused: true,
      flushListener: this.sendToBackend,
    })

    this.listenToReduxStore()
  }

  /* 
    Note: We need to wait for the token, url & sdkConfiguration 
    to be available in the store before sending any network requests
  */
  private listenToReduxStore() {
    reduxStore.subscribe(() => {
      const store = reduxStore.getState()

      token = store.globals.token
      url = store.globals.urls.onfido_api_url
      sdkConfiguration = store.globals.sdkConfiguration

      if (token && url && sdkConfiguration) {
        if (this.waitingList.length) {
          this.waitingList.forEach(this.write)
        }
        this.queue.resume()
      }
    })
  }

  private sendToBackend = (data: unknown[]) => {
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
      event_time: data.timestamp,
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

  public write = (data: LogData) => {
    if (!sdkConfiguration) {
      this.waitingList.push(data)
      return
    }

    const enabled =
      sdkConfiguration?.sdk_features?.enable_logger?.enabled || false
    const enabledLevels =
      sdkConfiguration?.sdk_features?.enable_logger?.levels || []

    if (enabled && enabledLevels.indexOf(data.level) > -1) {
      this.queue.push(this.createLogPayload(data))
      return
    }
  }
}
