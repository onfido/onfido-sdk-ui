import Socket from './socket'
import { actions } from '../store/actions'
import {
  supportsWebSockets,
  supportsGetUserMedia
} from '../utils/feature-detection'

const {
  setToken,
  setWebSocketSupport,
  setGumSupport,
  setAuthenticated
} = actions

function setSupport() {
  setWebSocketSupport(supportsWebSockets)
  setGumSupport(supportsGetUserMedia)
}

export default function connect(jwt) {
  setSupport()
  if (supportsWebSockets) {
    const socket = new Socket
    socket.connect(jwt)
    setToken(jwt)
    setAuthenticated(true)
    return socket
  } else {
    // console.warn('WebSockets not supported')
  }
}
