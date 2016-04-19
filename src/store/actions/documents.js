function documentCapture(data) {
  return {
    type: 'DOCUMENT_CAPTURE',
    data
  }
}

function faceCapture(data) {
  return {
    type: 'FACE_CAPTURE',
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
  documentCapture,
  faceCapture,
  setToken,
  setWebSocketSupport
}
