import events from '../core/events'
import { actions } from '../store/actions'
import ReconnectingWebSocket from 'reconnectingwebsocket'

const { setWebSocketError, setAuthenticated } = actions

export default class Socket {

  connect(url) {
    const socket = new ReconnectingWebSocket(url)
    socket.onerror = (e) => {
      events.emit('onError')
      setWebSocketError(true)
    }
    socket.onopen = () => {
      this.socket = socket
      this.onMessage()
      setAuthenticated(true)
    }
  }

  onMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      events.emit('onMessage', data)
      // setWebSocketError(false)
    }
  }

  sendMessage(message) {
    this.socket.send(message)
  }

}
