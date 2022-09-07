export * from './Network'
export * from './types'

import { Network } from './Network'
import requestHeadersMiddleware from './middleware/requestHeadersMiddleware'

const network = new Network({
  middleware: [requestHeadersMiddleware],
})

export const performHttpRequest = network.performHttpRequest
