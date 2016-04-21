const queryString = require('query-string')
const {SOCKET_URL} = require('../utils/constants')
const {actions} = require('../store/actions/actions')

class Socket {

  connect (jwt) {
    const query = queryString.stringify({jwt: jwt})
    const url = `${SOCKET_URL}?${query}`
    const socket = new WebSocket(url)
    this.socket = socket
    this.onMessage()
  }

  onMessage () {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data)
      if (data.has_passport) {
        actions.setDocumentCaptured(true)
      }
    }
  }

  sendMessage (message) {
    this.socket.send(message)
    console.log(message)
  }

}

module.exports = Socket
