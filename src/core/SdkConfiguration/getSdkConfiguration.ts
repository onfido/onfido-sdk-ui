import { HttpRequestParams, performHttpRequest } from '~core/Network'
import detectSystem from '~utils/detectSystem'
import { formatError } from '~utils/onfidoApi'
import { SdkConfiguration } from './types'

export const getSdkConfiguration = (
  url: string,
  token: string
): Promise<SdkConfiguration> =>
  new Promise((resolve, reject) => {
    try {
      const browserInfo = detectSystem('browser')
      const osInfo = detectSystem('os')

      const requestParams: HttpRequestParams = {
        endpoint: `${url}/v3.3/sdk/configurations`,
        token: `Bearer ${token}`,
        contentType: 'application/json',
        method: 'POST',
        payload: JSON.stringify({
          sdk_source: process.env.SDK_SOURCE,
          sdk_version: process.env.SDK_VERSION,
          sdk_metadata: {
            system: {
              browser: browserInfo.name,
              browser_version: browserInfo.version,
              os: osInfo.name,
              os_version: osInfo.version,
            },
          },
        }),
      }

      performHttpRequest(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      reject(error)
    }
  })
