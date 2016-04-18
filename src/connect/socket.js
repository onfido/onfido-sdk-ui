const queryString = require('query-string')
const SOCKET_URL = require('../utils/constants').SOCKET_URL

class Socket {

  connect (jwt) {
    const query = queryString.stringify({jwt: jwt})
    const url = `${SOCKET_URL}?${query}`
    this.socket = new WebSocket(url)
    this.socket.onmessage = (e) => this.onMessage(e)
  }

  onMessage (message) {
    const data = JSON.parse(message.data)
    console.log(data)
  }

  sendMessage (message) {
    this.socket.send(message)
    // console.log(message)
  }

}

module.exports = Socket
