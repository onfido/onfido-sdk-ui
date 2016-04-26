const objectAssign = require('object-assign')

const initialState = {
  jwt: null,
  authenticated: false,
  supportsWebSockets: false,
  supportsGetUserMedia: false,
  hasDocumentCaptured: false,
  hasFaceCaptured: false
}

function data(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      state = objectAssign({}, state, {jwt: action.payload})
      return state
    case 'SET_AUTHENTICATED':
      state = objectAssign({}, state, {authenticated: action.payload})
      return state
    case 'SET_WEBSOCKET_SUPPORT':
      state = objectAssign({}, state, {supportsWebSockets: action.payload})
      return state
    case 'SET_GUM_SUPPORT':
      state = objectAssign({}, state, {supportsGetUserMedia: action.payload})
      return state
    case 'SET_DOCUMENT_CAPTURED':
      state = objectAssign({}, state, {hasDocumentCaptured: action.payload})
      return state
    case 'SET_FACE_CAPTURED':
      state = objectAssign({}, state, {hasFaceCaptured: action.payload})
      return state
    default:
      return state
  }
}

module.exports = data
