const Socket = require('./socket')
const supportsWebSockets = require('../utils/websockets-detection')
const supportsGetUserMedia = require('../utils/gum-detection')
// const {boundActions} = require('../store/actions/actions')

function connect (jwt) {
  // boundActions.setWebSocketSupport(supportsWebSockets)
  if (supportsWebSockets) {
    const socket = new Socket
    socket.connect(jwt)
    // boundActions.setToken(jwt)
    return socket
  } else {
    console.warn('WebSockets not supported')
  }
}

module.exports = connect
