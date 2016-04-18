function addDocument(data) {
  return {
    type: 'ADD_DOCUMENT',
    data
  }
}

function setToken(jwt) {
  return {
    type: 'SET_TOKEN',
    jwt
  }
}

function setWebSocketSupport(bool) {
  return {
    type: 'SET_WEBSOCKET_SUPPORT',
    supportsWebSockets: bool
  }
}

module.exports = {
  addDocument,
  setToken,
  setWebSocketSupport
}
