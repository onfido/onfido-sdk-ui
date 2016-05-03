import * as constants from '../../constants';

export function setToken(payload) {
  return {
    type: constants.SET_TOKEN,
    payload
  }
}

export function setWebSocketSupport(payload) {
  return {
    type: constants.SET_WEBSOCKET_SUPPORT,
    payload
  }
}

export function setDocumentCaptured(payload) {
  return {
    type: constants.SET_DOCUMENT_CAPTURED,
    payload
  }
}

export function setFaceCaptured(payload) {
  return {
    type: constants.SET_FACE_CAPTURED,
    payload
  }
}

export function setAuthenticated(payload) {
  return {
    type: constants.SET_AUTHENTICATED,
    payload
  }
}

export function setGumSupport(payload) {
  return {
    type: constants.SET_GUM_SUPPORT,
    payload
  }
}
