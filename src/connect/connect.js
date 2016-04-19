const Socket = require('./socket')
const supportsWebSockets = require('../utils/websockets-detection')
const supportsGetUserMedia = require('../utils/gum-detection')
// const actions = require('../store/actions/actions').boundActions

function connect (jwt) {
  // actions.setWebSocketSupport(supportsWebSockets)
  if (supportsWebSockets) {
    const socket = new Socket
    socket.connect(jwt)
    // actions.setToken(jwt)
    return socket
  } else {
    console.warn('WebSockets not supported')
  }
}

module.exports = connect
