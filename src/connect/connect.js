const Socket = require('./socket')
const supportsWebSockets = require('../utils/feature-detection')
const actions = require('../store/actions/actions')
const store = require('../store/store')

function init (jwt) {
  actions.setWebSocketSupport(supportsWebSockets)
  if (supportsWebSockets) {
    const socket = new Socket
    socket.connect(jwt)
    return socket
  } else {
    console.warn('WebSockets not supported')
  }
}

module.exports = init
