const queryString = require('query-string')
const SOCKET_URL = require('../utils/constants').SOCKET_URL
const {boundActions} = require('../store/actions/actions')

class Socket {

  connect (jwt) {
    const query = queryString.stringify({jwt: jwt})
    const url = `${SOCKET_URL}?${query}`
    this.socket = new WebSocket(url)
    this.onMessage()
  }

  onMessage () {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data)
      if (data.has_passport) {
        boundActions.setDocumentCaptured(true)
      }
    }
  }

  sendMessage (message) {
    this.socket.send(message)
    // console.log(message)
  }

}

module.exports = Socket
