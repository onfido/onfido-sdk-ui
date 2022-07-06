import { Network } from '~modules/Network'
export { HttpRequestParams } from '~modules/Network'

const network = new Network()

export const performHttpRequest = network.performHttpRequest
