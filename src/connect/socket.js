import queryString from 'query-string'
import events from '../core/events'
import * as constants from '../constants'
import { actions } from '../store/actions'
import ReconnectingWebSocket from 'reconnectingwebsocket'

const {
  setWebSocketError,
  setToken,
  setAuthenticated
} = actions

export default class Socket {

  connect(jwt) {
    const query = queryString.stringify({ jwt: jwt })
    const url = `${constants.SOCKET_URL}?${query}`
    const socket = new ReconnectingWebSocket(url)
    socket.onopen = () => {
      this.socket = socket
      this.onMessage()
      setToken(jwt)
      setAuthenticated(true)
    }

    socket.onerror = (e) => {
      events.emit('onError')
      setWebSocketError(true)
    }
  }

  onMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      events.emit('onMessage', data)
      setWebSocketError(false)
    }
  }

  sendMessage(message) {
    this.socket.send(message)
  }

}
