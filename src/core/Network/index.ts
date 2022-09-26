import { Network } from '~modules/Network'
export { HttpRequestParams } from '~modules/Network'

import requestHeadersMiddleware from './middleware/requestHeadersMiddleware'

const network = new Network({
  middleware: [requestHeadersMiddleware],
})

export const performHttpRequest = network.performHttpRequest
