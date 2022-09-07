import { reduxStore } from 'components/ReduxAppWrapper'
import type { HttpRequestParams } from '~modules/Network'

const metadata: Record<string, Record<string, unknown>> = {
  system: {},
}

export default (httpRequestData: HttpRequestParams) => {
  if (!httpRequestData.headers) {
    httpRequestData.headers = {}
  }

  httpRequestData.headers['x-onfido-sdk-platform'] = 'web'
  httpRequestData.headers['x-onfido-sdk-version'] = process.env.SDK_VERSION!

  // Temporary, need to be fully implemeneted in IX-2577
  if (metadata.system.integration) {
    httpRequestData.headers['x-onfido-sdk-metadata'] = JSON.stringify(metadata)
  }

  return httpRequestData
}

reduxStore.subscribe(() => {
  const store = reduxStore.getState()
  metadata.system.integration = store.globals.sdkOptions?.integration?.name
  metadata.system['integration_version'] =
    store.globals.sdkOptions?.integration?.version
})
