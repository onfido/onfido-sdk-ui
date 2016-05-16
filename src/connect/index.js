import Socket from './socket'
import { actions } from '../store/actions'
import {
  supportsWebSockets,
  supportsGetUserMedia
} from '../utils/feature-detection'

const { setWebSocketSupport, setGumSupport } = actions

function setSupport() {
  setWebSocketSupport(supportsWebSockets)
  setGumSupport(supportsGetUserMedia)
}

export default function connect(jwt) {
  setSupport()
  try {
    if (!supportsWebSockets) throw 'WebSockets not supported'
    const socket = new Socket
    socket.connect(jwt)
    return socket
  }
  catch(err) {
    console.log(err)
  }
}
