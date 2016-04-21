const Socket = require('./socket')
const {actions} = require('../store/actions/actions')
const {
  supportsWebSockets,
  supportsGetUserMedia
} = require('../utils/feature-detection')

const {
  setToken,
  setWebSocketSupport,
  setGumSupport,
  setAuthenticated
} = actions

function setSupport () {
  setWebSocketSupport(supportsWebSockets)
  setGumSupport(supportsGetUserMedia)
}

function connect (jwt) {
  setSupport()
  if (supportsWebSockets) {
    const socket = new Socket
    socket.connect(jwt)
    setToken(jwt)
    setTimeout(() => setAuthenticated(true), 1500)
    return socket
  } else {
    console.warn('WebSockets not supported')
  }
}

module.exports = connect
