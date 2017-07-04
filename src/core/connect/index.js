import queryString from 'query-string'
import Socket from './socket'
import { actions } from '../store/actions'
import * as constants from '../constants'

const { setWebSocketSupport } = actions

function constructUrl(jwt, socketUrl) {
  const query = queryString.stringify({ jwt })
  return `${socketUrl}?${query}`
}

export default function connect(jwt, socketUrl=constants.SOCKET_URL) {
  const supportsWebSockets = ('WebSocket' in window)
  setWebSocketSupport(supportsWebSockets)
  try {
    if (!supportsWebSockets) throw 'WebSockets not supported'
    const url = constructUrl(jwt, socketUrl)
    const socket = new Socket
    socket.connect(url)
    return socket
  }
  catch(err) {
    console.log(err)
  }
}
