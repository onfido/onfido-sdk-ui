import queryString from 'query-string'
import Socket from './socket'
import { actions } from '../store/actions'
import {
  supportsWebSockets,
  supportsGetUserMedia
} from '../utils/feature-detection'
import * as constants from '../constants'

const { setWebSocketSupport, setGumSupport } = actions

function setSupport() {
  setWebSocketSupport(supportsWebSockets)
  setGumSupport(supportsGetUserMedia)
}

function constructUrl(jwt, socketUrl) {
  const query = queryString.stringify({ jwt: jwt })
  return `${socketUrl}?${query}`
}

export default function connect(jwt, socketUrl=constants.SOCKET_URL) {
  setSupport()
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
