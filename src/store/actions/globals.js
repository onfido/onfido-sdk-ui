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

function setDocumentCaptured(bool) {
  return {
    type: 'SET_DOCUMENT_CAPTURED',
    hasDocumentCaptured: bool
  }
}

function setFaceCaptured(bool) {
  return {
    type: 'SET_FACE_CAPTURED',
    hasFaceCaptured: bool
  }
}

module.exports = {
  setToken,
  setWebSocketSupport,
  setDocumentCaptured,
  setFaceCaptured
}
