import * as constants from '../../constants'

export function setWebSocketSupport(payload) {
  return {
    type: constants.SET_WEBSOCKET_SUPPORT,
    payload
  }
}

export function setWebSocketError(payload) {
  return {
    type: constants.SET_WEBSOCKET_ERROR,
    payload
  }
}

export function setDocumentType(payload) {
  return {
    type: constants.SET_DOCUMENT_TYPE,
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
