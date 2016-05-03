export function setToken(payload) {
  return {
    type: 'SET_TOKEN',
    payload
  }
}

export function setWebSocketSupport(payload) {
  return {
    type: 'SET_WEBSOCKET_SUPPORT',
    payload
  }
}

export function setDocumentCaptured(payload) {
  return {
    type: 'SET_DOCUMENT_CAPTURED',
    payload
  }
}

export function setFaceCaptured(payload) {
  return {
    type: 'SET_FACE_CAPTURED',
    payload
  }
}

export function setAuthenticated(payload) {
  return {
    type: 'SET_AUTHENTICATED',
    payload
  }
}

export function setGumSupport(payload) {
  return {
    type: 'SET_GUM_SUPPORT',
    payload
  }
}
