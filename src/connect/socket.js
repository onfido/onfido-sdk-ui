import queryString from 'query-string'
import events from '../core/events'
import * as constants from '../constants'
import { actions } from '../store/actions'
import ReconnectingWebSocket from 'reconnectingwebsocket'

const {
  setDocumentCaptured,
  setToken,
  setAuthenticated
} = actions

export default class Socket {

  connect(jwt) {
    const query = queryString.stringify({ jwt: jwt })
    const url = `${constants.DEV_SOCKET_URL}?${query}`
    const socket = new ReconnectingWebSocket(url)
    socket.onopen = () => {
      this.socket = socket
      this.onMessage()
      setToken(jwt)
      setAuthenticated(true)
    }
  }

  onMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      events.emit('onMessage', data)
    }
  }

  sendMessage(message) {
    this.socket.send(message)
  }

}
